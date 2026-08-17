import { TRPCError } from "@trpc/server";
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
  }),
  master: router({
    catalog: publicProcedure.query(() => {
      const achievements = achievementCatalogRows();
      const titles = titleCatalogRows();
      const validation = validateMasterCatalog(achievements, titles);
      if (!validation.valid) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: validation.errors.join(" ") });
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
  }),
});
