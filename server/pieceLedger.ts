import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import {
  studyAuditLogs,
  studyPieceTransactions,
  studyPieceTypes,
  studyUserPieces,
} from "../drizzle/schema";
import type { LedgerDelta } from "../shared/masterBuild";
import { assertAdminOperation, getStudySession } from "./studyStore";
import { getDb } from "./db";

export type PieceLedgerAdjustment = Pick<LedgerDelta, "delta"> & {
  pieceTypeId: string;
  kind: string;
  idempotencyKey: string;
  referenceType?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
  reason: string;
};

export type PieceLedgerResult = {
  transactionId: string;
  accountId: string;
  pieceTypeId: string;
  delta: number;
  balance: number;
  idempotent: boolean;
};

async function database() {
  const db = await getDb();
  if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng.");
  return db;
}

export function validatePieceLedgerAdjustment(input: PieceLedgerAdjustment) {
  if (!Number.isInteger(input.delta) || input.delta === 0) {
    throw new Error("Thay đổi mảnh ghép phải là số nguyên khác 0.");
  }
  if (!input.pieceTypeId.trim()) throw new Error("Loại mảnh ghép là bắt buộc.");
  if (!input.kind.trim()) throw new Error("Loại giao dịch là bắt buộc.");
  if (!input.idempotencyKey.trim()) throw new Error("Idempotency key là bắt buộc.");
  if (!input.reason.trim()) throw new Error("Lý do điều chỉnh là bắt buộc.");
  if (input.idempotencyKey.length > 160) throw new Error("Idempotency key quá dài.");
  if (input.kind.length > 32) throw new Error("Loại giao dịch quá dài.");
  if (input.referenceType && input.referenceType.length > 64) throw new Error("Reference type quá dài.");
  if (input.referenceId && input.referenceId.length > 128) throw new Error("Reference id quá dài.");
  if (input.reason.length > 2000) throw new Error("Lý do điều chỉnh quá dài.");
}

async function findExistingTransaction(accountId: string, idempotencyKey: string) {
  const db = await database();
  return (await db.select().from(studyPieceTransactions).where(and(
    eq(studyPieceTransactions.accountId, accountId),
    eq(studyPieceTransactions.idempotencyKey, idempotencyKey),
  )).limit(1))[0];
}

function toResult(row: typeof studyPieceTransactions.$inferSelect, balance: number, idempotent: boolean): PieceLedgerResult {
  return {
    transactionId: row.id,
    accountId: row.accountId,
    pieceTypeId: row.pieceTypeId,
    delta: row.delta,
    balance,
    idempotent,
  };
}

/**
 * Applies one ledger delta atomically. The balance update is conditional at the
 * database boundary (`balance + delta >= 0`), while the unique account/key
 * constraint makes retries idempotent.
 */
export async function applyPieceDelta(
  actorAccountId: string,
  accountId: string,
  input: PieceLedgerAdjustment,
): Promise<PieceLedgerResult> {
  validatePieceLedgerAdjustment(input);
  const db = await database();

  const existing = await findExistingTransaction(accountId, input.idempotencyKey);
  if (existing) {
    const current = (await db.select().from(studyUserPieces).where(and(
      eq(studyUserPieces.accountId, accountId),
      eq(studyUserPieces.pieceTypeId, input.pieceTypeId),
    )).limit(1))[0];
    return toResult(existing, current?.balance ?? 0, true);
  }

  try {
    return await db.transaction(async (tx) => {
      const type = (await tx.select().from(studyPieceTypes).where(and(
        eq(studyPieceTypes.id, input.pieceTypeId),
        eq(studyPieceTypes.enabled, true),
      )).limit(1))[0];
      if (!type || type.deletedAt) throw new Error("Loại mảnh ghép không tồn tại hoặc đã bị vô hiệu hóa.");

      await tx.insert(studyUserPieces).values({
        accountId,
        pieceTypeId: input.pieceTypeId,
        balance: 0,
        updatedAt: new Date(),
      }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });

      const updateResult = await tx.update(studyUserPieces).set({
        balance: sql`${studyUserPieces.balance} + ${input.delta}`,
        updatedAt: new Date(),
      }).where(and(
        eq(studyUserPieces.accountId, accountId),
        eq(studyUserPieces.pieceTypeId, input.pieceTypeId),
        sql`${studyUserPieces.balance} + ${input.delta} >= 0`,
      ));
      const affectedRows = Number((updateResult as { affectedRows?: number }).affectedRows ?? 0);
      if (affectedRows !== 1) throw new Error("Số dư mảnh ghép không đủ để thực hiện giao dịch.");

      const transactionId = randomUUID();
      const now = new Date();
      await tx.insert(studyPieceTransactions).values({
        id: transactionId,
        accountId,
        pieceTypeId: input.pieceTypeId,
        delta: input.delta,
        kind: input.kind,
        idempotencyKey: input.idempotencyKey,
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        createdAt: now,
      });
      await tx.insert(studyAuditLogs).values({
        id: randomUUID(),
        actorAccountId,
        targetAccountId: accountId,
        action: "piece_ledger.adjust",
        entityType: "piece_transaction",
        entityId: transactionId,
        afterData: JSON.stringify({ pieceTypeId: input.pieceTypeId, delta: input.delta, kind: input.kind }),
        reason: input.reason,
        createdAt: now,
      });

      const updated = (await tx.select().from(studyUserPieces).where(and(
        eq(studyUserPieces.accountId, accountId),
        eq(studyUserPieces.pieceTypeId, input.pieceTypeId),
      )).limit(1))[0];
      if (!updated) throw new Error("Không đọc được số dư sau giao dịch.");
      return {
        transactionId,
        accountId,
        pieceTypeId: input.pieceTypeId,
        delta: input.delta,
        balance: updated.balance,
        idempotent: false,
      };
    });
  } catch (error) {
    const retried = await findExistingTransaction(accountId, input.idempotencyKey);
    if (retried) {
      const current = (await db.select().from(studyUserPieces).where(and(
        eq(studyUserPieces.accountId, accountId),
        eq(studyUserPieces.pieceTypeId, input.pieceTypeId),
      )).limit(1))[0];
      return toResult(retried, current?.balance ?? 0, true);
    }
    throw error;
  }
}

export async function getPieceBalanceForToken(token: string, pieceTypeId: string) {
  const { account } = await getStudySession(token);
  const db = await database();
  const row = (await db.select().from(studyUserPieces).where(and(
    eq(studyUserPieces.accountId, account.id),
    eq(studyUserPieces.pieceTypeId, pieceTypeId),
  )).limit(1))[0];
  return { accountId: account.id, pieceTypeId, balance: row?.balance ?? 0 };
}

export async function adjustPieceBalanceForToken(token: string, input: PieceLedgerAdjustment & { accountId: string }) {
  const { account: actor } = await getStudySession(token);
  assertAdminOperation(actor);
  return applyPieceDelta(actor.id, input.accountId, input);
}
