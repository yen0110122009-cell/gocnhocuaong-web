import { describe, expect, it } from "vitest";
import { createStudyBackup, restoreStudyBackup } from "./studyBackup";
import { emptyProfile } from "./study";

describe("study JSON backup", () => {
  it("xuất và khôi phục được tiến độ cùng phần thưởng thời gian", () => {
    const profile = {
      ...emptyProfile(),
      studyPlanItems: [{ id: "plan-1", title: "Ôn bài", scheduledFor: "2026-08-24", cadence: "day" as const, completed: true, completedAt: "2026-08-24T08:00:00.000Z", reward: "fragment" as const, rewardAmount: 1 }],
      studyActivity: [{ id: "activity-1", occurredAt: "2026-08-24T09:00:00.000Z", kind: "pomodoro" as const, quantity: 1, durationSeconds: 1500, xpEarned: 0 }],
      dailyPhoneRewardSettings: { baseMinutes: 25, bonusMinutesPerStudyBlock: 10 },
      dailyPlanReminderSettings: { enabled: true, hour: 0, minute: 30 },
      dailyPhoneRewardClaims: [{ date: "2026-08-24", claimedAt: "2026-08-24T20:00:00.000Z", studySeconds: 1500, rewardMinutes: 25, completedPlanItemIds: ["plan-1"] }],
    };
    const restored = restoreStudyBackup(createStudyBackup(profile, "2026-08-24T21:00:00.000Z"));
    expect(restored.studyPlanItems).toHaveLength(1);
    expect(restored.studyActivity).toHaveLength(1);
    expect(restored.dailyPhoneRewardSettings).toEqual({ baseMinutes: 25, bonusMinutesPerStudyBlock: 10 });
    expect(restored.dailyPlanReminderSettings).toEqual({ enabled: true, hour: 0, minute: 30 });
    expect(restored.dailyPhoneRewardClaims?.[0]).toMatchObject({ date: "2026-08-24", rewardMinutes: 25, completedPlanItemIds: ["plan-1"] });
  });

  it("từ chối JSON không thuộc ứng dụng hoặc sai phiên bản", () => {
    expect(() => restoreStudyBackup(JSON.stringify({ app: "other-app", version: 1, profile: {} }))).toThrow("không thuộc");
    expect(() => restoreStudyBackup(JSON.stringify({ app: "gocnhocuaong", version: 99, profile: {} }))).toThrow("không thuộc");
    expect(() => restoreStudyBackup("not-json")).toThrow("JSON hợp lệ");
  });
});
