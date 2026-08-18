import { describe, expect, it } from "vitest";
import { emptyAppConfig, emptyProfile } from "./study";
import {
  claimCollectionEventReward,
  grantAdminReward,
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


  it("auto-claims an eligible event once with traceable receipt and audit", () => {
    const config = emptyAppConfig();
    const event = {
      id: "event-study-week",
      name: "Tuần Lễ Chăm Chỉ",
      description: "Hoàn thành mục tiêu học tập trong tuần.",
      startsAt: "2026-08-19T00:00:00.000Z",
      endsAt: "2026-08-26T00:00:00.000Z",
      status: "active" as const,
      difficulty: "Bình thường" as const,
      objective: "Đạt 5 Pomodoro",
      tasks: [],
      rewards: [],
      fragmentRewards: [{ tier: "II" as const, amount: 3, label: "3 mảnh Cấp II" }],
      participationConditions: [{ id: "pomodoro", label: "Pomodoro: 5/5", metric: "pomodoro", target: 5 }],
      claimLimit: 1,
      createdAt: "2026-08-18T00:00:00.000Z",
      updatedAt: "2026-08-18T00:00:00.000Z",
    };
    const eligible = { ...emptyProfile(), eventProgress: { [event.id]: { pomodoro: 5 } } };
    const first = claimCollectionEventReward(config, eligible, event, "2026-08-20T08:00:00.000Z");
    const second = claimCollectionEventReward(config, first.profile, event, "2026-08-20T08:01:00.000Z");

    expect(first.claimed).toBe(true);
    expect(first.profile.fragmentLedger?.II).toBe(3);
    expect(first.profile.eventRewardClaims?.["event:event-study-week"]).toMatchObject({ sourceType: "event", sourceId: event.id, amount: 3 });
    expect(first.profile.pieceTransactions?.[0]).toMatchObject({ sourceType: "event", sourceId: event.id, claimKey: "event:event-study-week" });
    expect(first.profile.rewardAuditLogs?.[0]).toMatchObject({ entityType: "event_reward", entityId: event.id });
    expect(second.claimed).toBe(false);
    expect(second.reason).toBe("already_claimed");
    expect(first.profile.pieceTransactions).toHaveLength(1);
  });

  it("does not claim an event before conditions are met", () => {
    const config = emptyAppConfig();
    const event = {
      id: "event-condition",
      name: "Điều kiện kiểm tra",
      description: "Cần đạt mục tiêu.",
      startsAt: "2026-08-19T00:00:00.000Z",
      endsAt: "2026-08-26T00:00:00.000Z",
      status: "active" as const,
      difficulty: "Dễ" as const,
      objective: "Đạt mục tiêu",
      tasks: [],
      rewards: [],
      fragmentRewards: [{ tier: "I" as const, amount: 1 }],
      participationConditions: [{ id: "study", label: "Học: 10/10", metric: "study", target: 10 }],
      claimLimit: 1,
      createdAt: "2026-08-18T00:00:00.000Z",
      updatedAt: "2026-08-18T00:00:00.000Z",
    };
    const result = claimCollectionEventReward(config, emptyProfile(), event, "2026-08-20T08:00:00.000Z");
    expect(result.claimed).toBe(false);
    expect(result.reason).toBe("conditions_not_met");
    expect(result.missingConditions).toEqual(["Học: 10/10"]);
    expect(result.profile.fragmentLedger ?? {}).toEqual({});
  });

describe("Admin reward grants", () => {
  it("requires approval, recipient and reason, then grants idempotently with audit", () => {
    const config = emptyAppConfig();
    const profile = emptyProfile();
    const baseReward = {
      id: "admin-grant-001",
      name: "Grant mảnh kiểm duyệt",
      type: "piece" as const,
      value: 3,
      condition: "tier=IV",
      active: true,
      approvalStatus: "approved" as const,
      recipientUserId: "user-001",
      grantReason: "Bù thưởng theo biên bản hỗ trợ #001",
    };

    const first = grantAdminReward(config, profile, baseReward, "admin-001", "2026-08-19T00:00:00.000Z");
    expect(first.granted).toBe(true);
    expect(first.profile.fragmentLedger?.IV).toBe(3);
    expect(first.profile.pieceTransactions?.[0]).toMatchObject({
      sourceType: "admin",
      sourceId: baseReward.id,
      reason: baseReward.grantReason,
      claimKey: "admin:admin-grant-001:user-001",
    });
    expect(first.profile.rewardAuditLogs?.at(-1)).toMatchObject({
      actor: "admin-001",
      action: "admin_grant",
      entityId: baseReward.id,
    });

    const retry = grantAdminReward(config, first.profile, baseReward, "admin-001", "2026-08-19T00:01:00.000Z");
    expect(retry.granted).toBe(false);
    expect(retry.reason).toBe("already_granted");
    expect(retry.profile.fragmentLedger?.IV).toBe(3);

    const pending = grantAdminReward(config, profile, { ...baseReward, approvalStatus: "draft" }, "admin-001");
    expect(pending.granted).toBe(false);
    expect(pending.reason).toBe("not_approved");

    const missingReason = grantAdminReward(config, profile, { ...baseReward, grantReason: "" }, "admin-001");
    expect(missingReason.granted).toBe(false);
    expect(missingReason.reason).toBe("missing_recipient_or_reason");
  });
});
