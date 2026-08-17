import { randomBytes, scryptSync, timingSafeEqual, createHash, randomUUID } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { studyAccounts, studyProfiles, studySessions, studySettings } from "../drizzle/schema";
import { emptyAppConfig, emptyProfile, normalizeProfile, type AppConfig, type ProfileState, type StudyAccount, type StudyRole } from "../shared/study";
import { canAssignRole, canManageMembers, canModifyAccount, isUnlimitedAccountCode } from "../shared/permissions.ts";
import { getDb } from "./db";

const SESSION_HOURS = 12;

function jsonFromText<T>(source: string | null | undefined, fallback: () => T): T {
  try {
    return source ? (JSON.parse(source) as T) : fallback();
  } catch {
    return fallback();
  }
}

function normalizeName(name: string) {
  return name.trim().toLocaleLowerCase("vi-VN");
}

function toPublicAccount(account: typeof studyAccounts.$inferSelect): StudyAccount {
  return {
    id: account.id,
    name: account.name,
    code: account.code,
    role: account.role as StudyRole,
    locked: account.locked,
    createdAt: account.createdAt.toISOString(),
  };
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function database() {
  const db = await getDb();
  if (!db) throw new Error("Cơ sở dữ liệu chưa sẵn sàng.");
  return db;
}

async function ensureProfile(accountId: string) {
  const db = await database();
  const rows = await db.select().from(studyProfiles).where(eq(studyProfiles.accountId, accountId)).limit(1);
  if (rows[0]) return rows[0];
  const now = new Date();
  await db.insert(studyProfiles).values({ accountId, data: JSON.stringify(emptyProfile()), updatedAt: now });
  const created = await db.select().from(studyProfiles).where(eq(studyProfiles.accountId, accountId)).limit(1);
  return created[0]!;
}

export async function loginStudyAccount(input: { name: string; password: string; code: string }) {
  const name = input.name.trim();
  const code = input.code.trim().toUpperCase();
  const password = input.password;
  const normalizedName = normalizeName(name);
  if (!name || !password || !code) throw new Error("Vui lòng nhập đủ tên, mật khẩu và mã tài khoản.");
  if (password.length < 6) throw new Error("Mật khẩu cần có ít nhất 6 ký tự.");
  const db = await database();
  let accountRows = code === "111"
    ? await db.select().from(studyAccounts).where(and(eq(studyAccounts.code, code), eq(studyAccounts.normalizedName, normalizedName))).limit(1)
    : await db.select().from(studyAccounts).where(eq(studyAccounts.code, code)).limit(1);
  let account = accountRows[0];
  if (!account && code === "111") {
    const now = new Date();
    const founderId = randomUUID();
    await db.insert(studyAccounts).values({
      id: founderId,
      name,
      normalizedName,
      code: "111",
      role: "Founder",
      passwordHash: null,
      locked: false,
      createdAt: now,
      updatedAt: now,
    });
    await db.insert(studyProfiles).values({ accountId: founderId, data: JSON.stringify(emptyProfile()), updatedAt: now });
    accountRows = await db.select().from(studyAccounts).where(eq(studyAccounts.id, founderId)).limit(1);
    account = accountRows[0];
  }
  if (!account) throw new Error("Mã tài khoản không tồn tại. Hãy liên hệ Admin hoặc Founder để được cấp mã.");
  if (account.locked && !isUnlimitedAccountCode(account.code)) throw new Error("Tài khoản đang bị khóa. Hãy liên hệ quản trị viên.");
  if (account.normalizedName !== normalizeName(name)) throw new Error("Tên đăng nhập không khớp với mã tài khoản.");
  if (!account.passwordHash) {
    await db.update(studyAccounts).set({ passwordHash: hashPassword(password), updatedAt: new Date() }).where(eq(studyAccounts.id, account.id));
  } else if (!verifyPassword(password, account.passwordHash)) {
    throw new Error("Mật khẩu không đúng.");
  }
  await ensureProfile(account.id);
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  await db.insert(studySessions).values({ tokenHash: tokenHash(token), accountId: account.id, expiresAt, createdAt: new Date() });
  return { token, expiresAt: expiresAt.toISOString(), account: toPublicAccount(account) };
}

export async function getStudySession(token: string) {
  const db = await database();
  const rows = await db
    .select({ session: studySessions, account: studyAccounts })
    .from(studySessions)
    .innerJoin(studyAccounts, eq(studySessions.accountId, studyAccounts.id))
    .where(and(eq(studySessions.tokenHash, tokenHash(token)), gt(studySessions.expiresAt, new Date())))
    .limit(1);
  const row = rows[0];
  if (!row || (row.account.locked && !isUnlimitedAccountCode(row.account.code))) throw new Error("Phiên đăng nhập đã hết hạn hoặc không còn hợp lệ.");
  return { account: toPublicAccount(row.account), session: row.session };
}

export async function logoutStudyAccount(token: string) {
  const db = await database();
  await db.delete(studySessions).where(eq(studySessions.tokenHash, tokenHash(token)));
  return { success: true };
}

export async function getProfileForToken(token: string) {
  const { account } = await getStudySession(token);
  const profile = await ensureProfile(account.id);
  return { account, profile: normalizeProfile(jsonFromText(profile.data, emptyProfile)) };
}

export async function saveProfileForToken(token: string, value: unknown) {
  const { account } = await getStudySession(token);
  const profile = normalizeProfile(value);
  const data = JSON.stringify(profile);
  if (data.length > 4_500_000) throw new Error("Dữ liệu học tập vượt quá dung lượng cho phép.");
  const db = await database();
  await ensureProfile(account.id);
  await db.update(studyProfiles).set({ data, updatedAt: new Date() }).where(eq(studyProfiles.accountId, account.id));
  return { account, profile };
}

export async function exportProfileForToken(token: string) {
  const { account, profile } = await getProfileForToken(token);
  return { version: 1, exportedAt: new Date().toISOString(), account: { name: account.name, code: account.code }, profile };
}

export async function getAppConfig() {
  const db = await database();
  const rows = await db.select().from(studySettings).where(eq(studySettings.id, "global")).limit(1);
  if (!rows[0]) {
    const config = emptyAppConfig();
    await db.insert(studySettings).values({ id: "global", data: JSON.stringify(config), updatedAt: new Date() });
    return config;
  }
  return jsonFromText<AppConfig>(rows[0].data, emptyAppConfig);
}

export function assertAdminOperation(account: Pick<StudyAccount, "role">) {
  if (!canManageMembers(account.role)) throw new Error("Chức năng này chỉ dành cho Admin hoặc Founder.");
}

export function assertRoleAssignment(actor: Pick<StudyAccount, "role">, target: StudyRole) {
  if (!canAssignRole(actor.role, target)) throw new Error("Chỉ Founder được cấp quyền Founder.");
}

function requireAdmin(account: StudyAccount) {
  assertAdminOperation(account);
}

export async function saveAppConfigForToken(token: string, value: unknown) {
  const { account } = await getStudySession(token);
  requireAdmin(account);
  const config = { ...emptyAppConfig(), ...(value as Partial<AppConfig>), updatedAt: new Date().toISOString() };
  const db = await database();
  await db.insert(studySettings).values({ id: "global", data: JSON.stringify(config), updatedAt: new Date() }).onDuplicateKeyUpdate({ set: { data: JSON.stringify(config), updatedAt: new Date() } });
  return config;
}

export async function listAccountsForToken(token: string) {
  const { account } = await getStudySession(token);
  requireAdmin(account);
  const db = await database();
  const accounts = await db.select().from(studyAccounts);
  return accounts.map(toPublicAccount);
}

export async function createAccountForToken(token: string, input: { name: string; code: string; role: StudyRole }) {
  const { account: actor } = await getStudySession(token);
  requireAdmin(actor);
  assertRoleAssignment(actor, input.role);
  const name = input.name.trim();
  const code = input.code.trim().toUpperCase();
  if (!name || !code) throw new Error("Tên và mã tài khoản là bắt buộc.");
  if (code === "999") throw new Error("Mã 999 được dành cho Admin hệ thống.");
  const db = await database();
  if (code !== "111") {
    const duplicated = await db.select().from(studyAccounts).where(eq(studyAccounts.code, code)).limit(1);
    if (duplicated[0]) throw new Error("Mã tài khoản đã được sử dụng.");
  }
  const sameName = await db.select().from(studyAccounts).where(eq(studyAccounts.normalizedName, normalizeName(name))).limit(1);
  if (sameName[0]) throw new Error("Tên tài khoản đã tồn tại.");
  const now = new Date();
  const id = randomUUID();
  await db.insert(studyAccounts).values({ id, name, normalizedName: normalizeName(name), code, role: input.role, passwordHash: null, locked: false, createdAt: now, updatedAt: now });
  await db.insert(studyProfiles).values({ accountId: id, data: JSON.stringify(emptyProfile()), updatedAt: now });
  const created = (await db.select().from(studyAccounts).where(eq(studyAccounts.id, id)).limit(1))[0]!;
  return toPublicAccount(created);
}

export async function updateAccountForToken(token: string, input: { id: string; role?: StudyRole; locked?: boolean; reset?: boolean }) {
  const { account: actor } = await getStudySession(token);
  requireAdmin(actor);
  const db = await database();
  const target = (await db.select().from(studyAccounts).where(eq(studyAccounts.id, input.id)).limit(1))[0];
  if (!target) throw new Error("Không tìm thấy tài khoản.");
  if (!canModifyAccount(actor.role, target.role, actor.id === target.id)) throw new Error("Không thể thay đổi tài khoản này với vai trò hiện tại.");
  if (input.role && !canAssignRole(actor.role, input.role)) throw new Error("Chỉ Founder được cấp quyền Founder.");
  if (target.code === "111" && input.locked === true) throw new Error("Tài khoản mã 111 luôn được miễn giới hạn khóa.");
  const values: Partial<typeof studyAccounts.$inferInsert> = { updatedAt: new Date() };
  if (input.role) values.role = input.role;
  if (typeof input.locked === "boolean") values.locked = input.locked;
  if (input.reset) values.passwordHash = null;
  await db.update(studyAccounts).set(values).where(eq(studyAccounts.id, target.id));
  if (input.reset) await db.update(studyProfiles).set({ data: JSON.stringify(emptyProfile()), updatedAt: new Date() }).where(eq(studyProfiles.accountId, target.id));
  const updated = (await db.select().from(studyAccounts).where(eq(studyAccounts.id, target.id)).limit(1))[0]!;
  return toPublicAccount(updated);
}

export async function deleteAccountForToken(token: string, id: string) {
  const { account: actor } = await getStudySession(token);
  requireAdmin(actor);
  const db = await database();
  const target = (await db.select().from(studyAccounts).where(eq(studyAccounts.id, id)).limit(1))[0];
  if (!target) throw new Error("Không tìm thấy tài khoản.");
  if (target.role === "Founder") throw new Error("Không thể xóa tài khoản Founder.");
  await db.delete(studySessions).where(eq(studySessions.accountId, id));
  await db.delete(studyProfiles).where(eq(studyProfiles.accountId, id));
  await db.delete(studyAccounts).where(eq(studyAccounts.id, id));
  return { success: true };
}
