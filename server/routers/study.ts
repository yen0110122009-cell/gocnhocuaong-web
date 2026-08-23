import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  createAccountForToken,
  deleteAccountForToken,
  exportProfileForToken,
  getAppConfig,
  getProfileForToken,
  getStudySession,
  listAccountsForToken,
  loginStudyAccount,
  logoutStudyAccount,
  saveAppConfigForToken,
  saveProfileForToken,
  updateAccountForToken,
} from "../studyStore";
import { storagePut } from "../storage";
import { invokeLLM } from "../_core/llm";
import { publicProcedure, router } from "../_core/trpc";
import { achievementCatalogRows, titleCatalogRows, validateMasterCatalog } from "../../shared/masterBuild";
import { adjustPieceBalanceForToken, getPieceBalanceForToken } from "../pieceLedger";
import { getDb } from "../db";
import { studyCompanionDraftVersions, studyCompanionDrafts } from "../../drizzle/schema";

function asTrpcError(error: unknown): never {
  throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "Không thể xử lý yêu cầu." });
}

const tokenInput = z.object({ token: z.string().min(20) });
const roleSchema = z.enum(["Member", "Admin", "Founder"]);

export const studyRouter = router({
  auth: router({
    login: publicProcedure.input(z.object({ name: z.string().min(1), password: z.string().min(1), code: z.string().min(1) })).mutation(async ({ input }) => {
      try { return await loginStudyAccount(input); } catch (error) { return asTrpcError(error); }
    }),
    session: publicProcedure.input(tokenInput).query(async ({ input }) => {
      try { return await getStudySession(input.token); } catch (error) { return asTrpcError(error); }
    }),
    logout: publicProcedure.input(tokenInput).mutation(async ({ input }) => {
      try { return await logoutStudyAccount(input.token); } catch (error) { return asTrpcError(error); }
    }),
  }),
  profile: router({
    get: publicProcedure.input(tokenInput).query(async ({ input }) => {
      try { return await getProfileForToken(input.token); } catch (error) { return asTrpcError(error); }
    }),
    save: publicProcedure.input(tokenInput.extend({ profile: z.unknown() })).mutation(async ({ input }) => {
      try { return await saveProfileForToken(input.token, input.profile); } catch (error) { return asTrpcError(error); }
    }),
    export: publicProcedure.input(tokenInput).query(async ({ input }) => {
      try { return await exportProfileForToken(input.token); } catch (error) { return asTrpcError(error); }
    }),
    import: publicProcedure.input(tokenInput.extend({ profile: z.unknown() })).mutation(async ({ input }) => {
      try { return await saveProfileForToken(input.token, input.profile); } catch (error) { return asTrpcError(error); }
    }),
    getCompanionDraft: publicProcedure.input(tokenInput).query(async ({ input }) => {
      try {
        const { account } = await getStudySession(input.token);
        const db = await getDb();
        if (!db) throw new Error("Database chưa sẵn sàng để đồng bộ nháp.");
        const current = await db.select().from(studyCompanionDrafts).where(eq(studyCompanionDrafts.accountId, account.id)).limit(1);
        const versions = await db.select({ id: studyCompanionDraftVersions.id, version: studyCompanionDraftVersions.version, deviceLabel: studyCompanionDraftVersions.deviceLabel, createdAt: studyCompanionDraftVersions.createdAt }).from(studyCompanionDraftVersions).where(eq(studyCompanionDraftVersions.accountId, account.id)).orderBy(desc(studyCompanionDraftVersions.version)).limit(20);
        return { current: current[0] ?? null, versions };
      } catch (error) { return asTrpcError(error); }
    }),
    saveCompanionDraft: publicProcedure.input(tokenInput.extend({ data: z.string().min(2).max(1_500_000), expectedVersion: z.number().int().nonnegative().optional(), deviceLabel: z.string().max(120).optional() })).mutation(async ({ input }) => {
      try {
        const { account } = await getStudySession(input.token);
        const db = await getDb();
        if (!db) throw new Error("Database chưa sẵn sàng để đồng bộ nháp.");
        const currentRows = await db.select().from(studyCompanionDrafts).where(eq(studyCompanionDrafts.accountId, account.id)).limit(1);
        const current = currentRows[0];
        if (input.expectedVersion !== undefined && (current?.version ?? 0) !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Nháp đã được cập nhật trên thiết bị khác. Hãy tải lại bản mới trước khi ghi đè." });
        const nextVersion = (current?.version ?? 0) + 1;
        const id = `${account.id}-${nextVersion}-${Date.now()}`.slice(0, 64);
        await db.transaction(async (tx) => {
          await tx.insert(studyCompanionDraftVersions).values({ id, accountId: account.id, version: nextVersion, data: input.data, deviceLabel: input.deviceLabel ?? "Thiết bị hiện tại", createdAt: new Date() });
          await tx.insert(studyCompanionDrafts).values({ accountId: account.id, version: nextVersion, data: input.data, deviceLabel: input.deviceLabel ?? "Thiết bị hiện tại", updatedAt: new Date() }).onDuplicateKeyUpdate({ set: { version: nextVersion, data: input.data, deviceLabel: input.deviceLabel ?? "Thiết bị hiện tại", updatedAt: new Date() } });
        });
        return { version: nextVersion, savedAt: new Date().toISOString(), deviceLabel: input.deviceLabel ?? "Thiết bị hiện tại" };
      } catch (error) { return asTrpcError(error); }
    }),
    restoreCompanionDraft: publicProcedure.input(tokenInput.extend({ version: z.number().int().positive(), expectedVersion: z.number().int().nonnegative().optional(), deviceLabel: z.string().max(120).optional() })).mutation(async ({ input }) => {
      try {
        const { account } = await getStudySession(input.token);
        const db = await getDb();
        if (!db) throw new Error("Database chưa sẵn sàng để khôi phục nháp.");
        const currentRows = await db.select().from(studyCompanionDrafts).where(eq(studyCompanionDrafts.accountId, account.id)).limit(1);
        const current = currentRows[0];
        if (input.expectedVersion !== undefined && (current?.version ?? 0) !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Nháp hiện tại đã thay đổi trên thiết bị khác." });
        const sourceRows = await db.select().from(studyCompanionDraftVersions).where(eq(studyCompanionDraftVersions.accountId, account.id)).limit(100);
        const source = sourceRows.find((row) => row.version === input.version);
        if (!source) throw new TRPCError({ code: "NOT_FOUND", message: "Không tìm thấy phiên bản nháp cần khôi phục." });
        const nextVersion = (current?.version ?? 0) + 1;
        const id = `${account.id}-${nextVersion}-${Date.now()}`.slice(0, 64);
        await db.transaction(async (tx) => {
          await tx.insert(studyCompanionDraftVersions).values({ id, accountId: account.id, version: nextVersion, data: source.data, deviceLabel: input.deviceLabel ?? "Khôi phục trên thiết bị hiện tại", createdAt: new Date() });
          await tx.insert(studyCompanionDrafts).values({ accountId: account.id, version: nextVersion, data: source.data, deviceLabel: input.deviceLabel ?? "Khôi phục trên thiết bị hiện tại", updatedAt: new Date() }).onDuplicateKeyUpdate({ set: { version: nextVersion, data: source.data, deviceLabel: input.deviceLabel ?? "Khôi phục trên thiết bị hiện tại", updatedAt: new Date() } });
        });
        return { version: nextVersion, data: source.data, restoredFromVersion: source.version, savedAt: new Date().toISOString() };
      } catch (error) { return asTrpcError(error); }
    }),
    uploadCompanionMedia: publicProcedure.input(tokenInput.extend({
      fileName: z.string().min(1).max(160),
      contentType: z.enum(["image/png", "image/jpeg", "image/webp", "image/gif", "audio/webm", "audio/ogg", "audio/wav", "audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/m4a"]),
      dataUrl: z.string().min(32).max(35_000_000),
      mediaType: z.enum(["mascot-image", "lumi-image", "lumi-voice", "personal-audio"]),
    })).mutation(async ({ input }) => {
      try {
        const { account } = await getStudySession(input.token);
        const isAudio = input.mediaType === "lumi-voice" || input.mediaType === "personal-audio";
        const requiredType = isAudio ? /^audio\/(webm|ogg|wav|mpeg|mp4|x-m4a|aac|m4a)$/ : /^image\/(png|jpeg|webp|gif)$/;
        if (!requiredType.test(input.contentType)) throw new Error("Loại tệp không phù hợp với nội dung đang tải.");
        const match = input.dataUrl.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);
        if (!match || match[1] !== input.contentType) throw new Error("Dữ liệu tệp không hợp lệ.");
        const bytes = Buffer.from(match[2], "base64");
        const maximumBytes = isAudio ? 25 * 1024 * 1024 : 3 * 1024 * 1024;
        if (bytes.length > maximumBytes) throw new Error(isAudio ? "Tệp âm thanh tối đa 25 MB." : "Ảnh đồng hành tối đa 3 MB.");
        const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
        const { url, key } = await storagePut(`study-historia/learners/${account.id}/companions/${input.mediaType}/${Date.now()}-${safeName}`, bytes, input.contentType);
        return { url, key, mediaType: input.mediaType, contentType: input.contentType };
      } catch (error) { return asTrpcError(error); }
    }),
  }),
  master: router({
    catalog: publicProcedure.query(() => {
      const achievements = achievementCatalogRows();
      const titles = titleCatalogRows();
      return { achievements, titles, counts: { achievements: achievements.length, titles: titles.length } };
    }),
    ledgerBalance: publicProcedure.input(tokenInput.extend({ pieceTypeId: z.string().min(1).max(96) })).query(async ({ input }) => {
      try { return await getPieceBalanceForToken(input.token, input.pieceTypeId); } catch (error) { return asTrpcError(error); }
    }),
    ledgerAdjust: publicProcedure.input(tokenInput.extend({
      accountId: z.string().uuid(),
      pieceTypeId: z.string().min(1).max(96),
      delta: z.number().int().refine((value) => value !== 0, "Delta không được bằng 0."),
      kind: z.string().min(1).max(32),
      idempotencyKey: z.string().min(1).max(160),
      referenceType: z.string().max(64).optional(),
      referenceId: z.string().max(128).optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
      reason: z.string().min(1).max(2000),
    })).mutation(async ({ input }) => {
      try { return await adjustPieceBalanceForToken(input.token, input); } catch (error) { return asTrpcError(error); }
    }),
  }),
  ai: router({
    generateDailyPlan: publicProcedure.input(tokenInput.extend({ request: z.string().min(8).max(4000) })).mutation(async ({ input }) => {
      try {
        const { account } = await getStudySession(input.token);
        if (account.isGuest) throw new Error("Chế độ khách chỉ cho phép xem. Hãy đăng nhập để tạo và lưu Kế hoạch với AI.");
        const schema = {
          type: "object",
          properties: {
            overview: { type: "string" },
            items: {
              type: "array",
              minItems: 1,
              maxItems: 10,
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  subject: { type: "string" },
                  course: { type: "string" },
                  notes: { type: "string" },
                  estimatedMinutes: { type: "integer", minimum: 5, maximum: 480 },
                },
                required: ["title", "subject", "course", "notes", "estimatedMinutes"],
                additionalProperties: false,
              },
            },
          },
          required: ["overview", "items"],
          additionalProperties: false,
        };
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Bạn là trợ lý lập Kế hoạch học tập bằng tiếng Việt. Chỉ trả về JSON đúng schema. Chia yêu cầu hôm nay thành các việc cụ thể, khả thi, có thời lượng; không tự thêm deadline, dữ liệu cá nhân hoặc phần thưởng. Mỗi mục có title ngắn, subject/course có thể là chuỗi rỗng nếu người dùng không nêu, notes nêu bước thực hiện rõ ràng." },
            { role: "user", content: `Hãy lập Kế hoạch cho hôm nay từ yêu cầu sau:\n${input.request}` },
          ],
          response_format: { type: "json_schema", json_schema: { name: "daily_study_plan", strict: true, schema } },
          maxTokens: 3000,
        });
        const content = response.choices?.[0]?.message?.content;
        const text = typeof content === "string" ? content : JSON.stringify(content ?? {});
        const parsed = JSON.parse(text) as { overview: string; items: Array<{ title: string; subject: string; course: string; notes: string; estimatedMinutes: number }> };
        if (!Array.isArray(parsed.items) || parsed.items.length === 0) throw new Error("AI chưa tạo được mục Kế hoạch hợp lệ. Hãy thử mô tả rõ hơn.");
        return parsed;
      } catch (error) { return asTrpcError(error); }
    }),
    generateFromDocument: publicProcedure.input(tokenInput.extend({
      mode: z.enum(["cards", "quiz", "both"]),
      prompt: z.string().min(20).max(30000),
      fileName: z.string().max(160).optional(),
      contentType: z.enum(["text/plain", "text/markdown", "application/pdf"]).optional(),
      dataUrl: z.string().max(7_000_000).optional(),
    })).mutation(async ({ input }) => {
      try {
        const { account } = await getStudySession(input.token);
        const parts: Array<{ type: "text"; text: string } | { type: "file_url"; file_url: { url: string; mime_type: "application/pdf" } }> = [{ type: "text", text: input.prompt }];
        if (input.dataUrl && input.fileName && input.contentType) {
          const match = input.dataUrl.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);
          if (!match || match[1] !== input.contentType) throw new Error("Dữ liệu tệp không hợp lệ.");
          const bytes = Buffer.from(match[2], "base64");
          if (bytes.length > 5 * 1024 * 1024) throw new Error("Tệp tài liệu tối đa 5 MB.");
          const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
          const stored = await storagePut(`study-historia/documents/${account.id}/${Date.now()}-${safeName}`, bytes, input.contentType);
          if (input.contentType === "application/pdf") parts.push({ type: "file_url", file_url: { url: stored.url, mime_type: "application/pdf" } });
          else parts.push({ type: "text", text: `Nội dung tệp ${input.fileName}:\\n${bytes.toString("utf8").slice(0, 120000)}` });
        }
        const cardsSchema = { type: "array", maxItems: 27, items: { type: "object", properties: { front: { type: "string" }, back: { type: "string" }, note: { type: "string" } }, required: ["front", "back"], additionalProperties: false } }; const questionsSchema = { type: "array", maxItems: 27, items: { type: "object", properties: { type: { type: "string", enum: ["multiple", "boolean", "short"] }, prompt: { type: "string" }, options: { type: "array", items: { type: "string" } }, answer: { type: "string" }, explanation: { type: "string" } }, required: ["type", "prompt", "answer"], additionalProperties: false } }; const schema = input.mode === "cards" ? { type: "object", properties: { cards: cardsSchema }, required: ["cards"], additionalProperties: false } : input.mode === "quiz" ? { type: "object", properties: { questions: questionsSchema }, required: ["questions"], additionalProperties: false } : { type: "object", properties: { cards: cardsSchema, questions: questionsSchema }, required: ["cards", "questions"], additionalProperties: false };
        const response = await invokeLLM({ messages: [{ role: "system", content: "Bạn là trợ lý biên soạn học tập lịch sử bằng tiếng Việt. Chỉ trả về JSON đúng schema, không thêm markdown." }, { role: "user", content: parts }], response_format: { type: "json_schema", json_schema: { name: input.mode === "cards" ? "flashcards" : input.mode === "quiz" ? "quiz" : "flashcards_and_quiz", strict: true, schema } }, maxTokens: 6000 });
        const content = response.choices?.[0]?.message?.content;
        const text = typeof content === "string" ? content : JSON.stringify(content ?? {});
        return { content: text, mode: input.mode };
      } catch (error) { return asTrpcError(error); }
    }),
  }),
  config: router({
    get: publicProcedure.query(async () => getAppConfig()),
    save: publicProcedure.input(tokenInput.extend({ config: z.unknown() })).mutation(async ({ input }) => {
      try { return await saveAppConfigForToken(input.token, input.config); } catch (error) { return asTrpcError(error); }
    }),
  }),
  admin: router({
    accounts: publicProcedure.input(tokenInput).query(async ({ input }) => {
      try { return await listAccountsForToken(input.token); } catch (error) { return asTrpcError(error); }
    }),
    createAccount: publicProcedure.input(tokenInput.extend({ name: z.string().min(1), code: z.string().min(1), role: roleSchema })).mutation(async ({ input }) => {
      try { return await createAccountForToken(input.token, input); } catch (error) { return asTrpcError(error); }
    }),
    updateAccount: publicProcedure.input(tokenInput.extend({ id: z.string().uuid(), role: roleSchema.optional(), locked: z.boolean().optional(), reset: z.boolean().optional() })).mutation(async ({ input }) => {
      try { return await updateAccountForToken(input.token, input); } catch (error) { return asTrpcError(error); }
    }),
    deleteAccount: publicProcedure.input(tokenInput.extend({ id: z.string().uuid() })).mutation(async ({ input }) => {
      try { return await deleteAccountForToken(input.token, input.id); } catch (error) { return asTrpcError(error); }
    }),
    uploadCharacterImage: publicProcedure.input(tokenInput.extend({ fileName: z.string().min(1).max(160), contentType: z.string().regex(/^image\/(png|jpeg|webp|gif)$/), dataUrl: z.string().min(32).max(4_300_000) })).mutation(async ({ input }) => {
      try {
        const { account } = await getStudySession(input.token);
        if (account.role !== "Admin" && account.role !== "Founder") throw new Error("Chỉ Admin hoặc Founder được tải ảnh nhân vật.");
        const match = input.dataUrl.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
        if (!match) throw new Error("Dữ liệu ảnh không hợp lệ.");
        const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
        const { url, key } = await storagePut(`study-historia/characters/${Date.now()}-${safeName}`, Buffer.from(match[2], "base64"), match[1]);
        return { url, key };
      } catch (error) { return asTrpcError(error); }
    }),
    uploadVoiceLine: publicProcedure.input(tokenInput.extend({ fileName: z.string().min(1).max(160), contentType: z.enum(["audio/webm", "audio/ogg", "audio/wav", "audio/mpeg"]), dataUrl: z.string().min(32).max(11_500_000), state: z.string().min(1).max(80) })).mutation(async ({ input }) => {
      try {
        const { account } = await getStudySession(input.token);
        if (account.role !== "Admin" && account.role !== "Founder") throw new Error("Chỉ Admin hoặc Founder được lưu lời thoại mascot.");
        const match = input.dataUrl.match(/^data:(audio\/(?:webm|ogg|wav|mpeg));base64,([A-Za-z0-9+/=]+)$/);
        if (!match) throw new Error("Dữ liệu ghi âm không hợp lệ.");
        const bytes = Buffer.from(match[2], "base64");
        if (bytes.length > 8 * 1024 * 1024) throw new Error("Bản ghi âm tối đa 8 MB.");
        const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
        const { url, key } = await storagePut(`study-historia/voice/${account.id}/${Date.now()}-${safeName}`, bytes, match[1]);
        return { url, key, contentType: match[1], state: input.state };
      } catch (error) { return asTrpcError(error); }
    }),
  }),
});
