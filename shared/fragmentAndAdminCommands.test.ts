import { describe, expect, it } from "vitest";
import { approveAdminAiDraft, canPublishAdminDraft, createAdminAiDraft } from "./adminCommandCenter";
import { exchangePieceRuleAtomic, unlockHistoricalCharacterAtomic } from "./fragmentSystem";
import { emptyAppConfig, emptyProfile } from "./study";

const config = emptyAppConfig();
const character = { ...config.characters[0], id: "test-character", name: "Nhân vật kiểm thử", unlockCost: 8, fragmentTotal: 4, pieces: [] };

describe("atomic fragment and admin command contracts", () => {
  it("does not mutate profile when exchange validation fails", () => {
    const profile = { ...emptyProfile(), fragmentLedger: { I: 1 } };
    const result = exchangePieceRuleAtomic(config, profile, { id: "rule-1", fromTier: "I", fromAmount: 2, toTier: "II", toAmount: 1, enabled: true });
    expect(result.exchanged).toBe(false);
    expect(result.reason).toBe("insufficient_pieces");
    expect(profile.fragmentLedger?.I).toBe(1);
    expect(profile.pieceTransactions ?? []).toHaveLength(0);
  });

  it("writes both spend and grant records in one successful exchange", () => {
    const profile = { ...emptyProfile(), fragmentLedger: { I: 10 } };
    const result = exchangePieceRuleAtomic(config, profile, { id: "rule-2", fromTier: "I", fromAmount: 3, toTier: "II", toAmount: 1, enabled: true });
    expect(result.exchanged).toBe(true);
    expect(result.profile.fragmentLedger).toMatchObject({ I: 7, II: 1 });
    expect(result.profile.pieceTransactions?.map((item) => item.amount)).toEqual([-3, 1]);
    expect(result.profile.rewardAuditLogs).toHaveLength(1);
  });

  it("unlocks a character only after sufficient value and records spending", () => {
    const profile = { ...emptyProfile(), fragmentLedger: { I: 8 } };
    const result = unlockHistoricalCharacterAtomic(config, profile, character);
    expect(result.unlocked).toBe(true);
    expect(result.profile.fragmentLedger?.I).toBe(0);
    expect(result.profile.characterProgress[character.id]?.status).toBe("unlocked");
    expect(result.profile.pieceTransactions?.every((item) => item.amount < 0)).toBe(true);
  });

  it("keeps AI draft unpublished until an Admin approval", () => {
    const draft = createAdminAiDraft("CREATE_EVENT", { title: "Event kiểm thử" }, "2026-08-19T00:00:00.000Z");
    expect(draft.status).toBe("ai_suggestion");
    expect(canPublishAdminDraft(draft)).toBe(false);
    const approved = approveAdminAiDraft(draft, "admin-1");
    expect(approved.approved).toBe(true);
    expect(approved.draft.status).toBe("approved");
    expect(canPublishAdminDraft(approved.draft)).toBe(true);
  });
});
