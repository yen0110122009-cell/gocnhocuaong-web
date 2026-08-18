import { describe, expect, it } from "vitest";
import { emptyAppConfig, emptyProfile } from "./study";
import {
  exchangePieceTier,
  grantFragmentSourceReward,
  grantLearningMilestone,
  pieceTransactionHistory,
} from "./fragmentSystem";

describe("fragment reward integrity", () => {
  it("records traceable metadata and rejects the same source claim on retry", () => {
    const config = emptyAppConfig();
    const profile = emptyProfile();
    const rule = {
      id: "achievement-first-session",
      kind: "achievement" as const,
      label: "Bước đầu tiên",
      description: "Hoàn thành phiên học đầu tiên.",
      enabled: true,
      claimLimit: 1,
      rewards: [{ tier: "I" as const, amount: 2, label: "2 mảnh Cấp I" }],
    };
    const first = grantFragmentSourceReward(config, profile, rule, "achievement-001", "2026-08-19T08:00:00.000Z");
    const second = grantFragmentSourceReward(config, first.profile, rule, "achievement-001", "2026-08-19T08:00:01.000Z");

    expect(first.granted).toBe(true);
    expect(first.profile.fragmentLedger?.I).toBe(2);
    expect(second.granted).toBe(false);
    expect(second.reason).toBe("already_claimed");
    expect(first.profile.pieceTransactions).toHaveLength(1);
    expect(first.profile.pieceTransactions?.[0]).toMatchObject({
      sourceType: "achievement",
      sourceId: "achievement-first-session",
      reason: "Hoàn thành phiên học đầu tiên.",
      claimKey: "2026-08-19:achievement-first-session:achievement-001",
    });
    expect(first.profile.rewardClaims?.["2026-08-19:achievement-first-session:achievement-001"]).toMatchObject({
      sourceType: "achievement",
      sourceId: "achievement-first-session",
      amount: 2,
    });
    expect(first.profile.rewardAuditLogs).toHaveLength(1);
  });

  it("keeps milestone claims idempotent and creates a receipt", () => {
    const config = emptyAppConfig();
    const milestone = {
      id: "milestone-10-hours",
      label: "10 giờ học",
      studySeconds: 36_000,
      enabled: true,
      rewards: [{ tier: "II" as const, amount: 3 }],
    };
    const first = grantLearningMilestone(config, emptyProfile(), milestone, "2026-08-19T09:00:00.000Z");
    const second = grantLearningMilestone(config, first.profile, milestone, "2026-08-19T09:01:00.000Z");

    expect(first.granted).toBe(true);
    expect(second.granted).toBe(false);
    expect(second.reason).toBe("already_claimed");
    expect(first.profile.rewardClaims?.["milestone:milestone-10-hours"]?.transactionIds).toHaveLength(1);
    expect(first.profile.rewardAuditLogs?.[0].entityId).toBe("milestone-10-hours");
  });

  it("never creates negative balances and records both sides of an exchange", () => {
    const config = emptyAppConfig();
    const profile = { ...emptyProfile(), fragmentLedger: { I: 5 } };
    const rule = { id: "i-to-ii", fromTier: "I" as const, fromAmount: 3, toTier: "II" as const, toAmount: 1, enabled: true };
    const result = exchangePieceTier(config, profile, rule, "2026-08-19T10:00:00.000Z");
    const history = pieceTransactionHistory(result.profile);

    expect(result.exchanged).toBe(true);
    expect(result.profile.fragmentLedger?.I).toBe(2);
    expect(result.profile.fragmentLedger?.II).toBe(1);
    expect(Object.values(result.profile.fragmentLedger ?? {}).every((value) => Number(value) >= 0)).toBe(true);
    expect(history).toHaveLength(2);
    expect(history.every((transaction) => transaction.sourceType === "admin" && transaction.sourceId === "i-to-ii" && transaction.reason)).toBe(true);
  });
});
