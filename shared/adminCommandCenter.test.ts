import { describe, expect, it } from "vitest";
import { ADMIN_AI_COMMANDS, approveAdminAiDraft, canPublishAdminDraft, createAdminAiDraft } from "./adminCommandCenter";

describe("Admin AI Command Center prompt guidance", () => {
  it("provides detailed purpose, input, output, and approval guidance for every command", () => {
    expect(ADMIN_AI_COMMANDS).toHaveLength(9);
    for (const command of ADMIN_AI_COMMANDS) {
      expect(command.purpose.length).toBeGreaterThan(20);
      expect(command.inputGuide.length).toBeGreaterThan(20);
      expect(command.outputGuide.length).toBeGreaterThan(20);
      expect(command.approvalGuide).toContain("Admin");
    }
  });

  it("keeps a shared custom prompt inside the AI draft without publishing it", () => {
    const draft = createAdminAiDraft("CREATE_EVENT", {
      title: "Tuần Lễ Chăm Chỉ",
      customPrompt: "Tạo Event 7 ngày, hoàn thành 5 Pomodoro, thưởng 3 mảnh Bạc, chỉ đề xuất.",
      sourceText: "Nguồn do Admin cung cấp",
    }, "2026-08-19T00:00:00.000Z");

    expect(draft.customPrompt).toContain("chỉ đề xuất");
    expect(draft.payload.customPrompt).toContain("5 Pomodoro");
    expect(draft.status).toBe("ai_suggestion");
    expect(canPublishAdminDraft(draft)).toBe(false);
  });

  it("requires an authenticated Admin identity before approval", () => {
    const draft = createAdminAiDraft("CREATE_REWARD", { title: "Reward test" }, "2026-08-19T00:00:00.000Z");
    expect(approveAdminAiDraft(draft, "").approved).toBe(false);
    const approved = approveAdminAiDraft(draft, "admin-1", "Đã kiểm tra");
    expect(approved.approved).toBe(true);
    expect(canPublishAdminDraft(approved.draft)).toBe(true);
  });

  it("provides a dedicated, approval-gated command for comforting and encouraging content", () => {
    const command = ADMIN_AI_COMMANDS.find((item) => item.value === "CREATE_ENCOURAGEMENT");
    expect(command?.label).toContain("an ủi/động viên");
    expect(command?.inputGuide).toContain("cần tránh");
    expect(command?.approvalGuide).toContain("Admin");

    const draft = createAdminAiDraft("CREATE_ENCOURAGEMENT", { title: "Lời động viên khi quá tải", emotion: "overwhelmed" });
    expect(draft.status).toBe("ai_suggestion");
    expect(canPublishAdminDraft(draft)).toBe(false);
  });
});
