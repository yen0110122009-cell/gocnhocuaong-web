import { describe, expect, it } from "vitest";
import { dailyPlanSummary, claimDailyPhoneReward, formatStudyDuration } from "./dailyPlanReward";
import { emptyProfile } from "./study";

const date = "2026-08-24";

function profileFor(items: Array<{ id: string; completed: boolean; completedAt?: string }>) {
  return {
    ...emptyProfile,
    studyPlanItems: items.map((item) => ({
      id: item.id,
      title: item.id,
      scheduledFor: date,
      cadence: "day" as const,
      completed: item.completed,
      completedAt: item.completedAt,
      reward: "fragment" as const,
      rewardAmount: 1,
    })),
    studyActivity: [
      { id: "pomodoro-1", occurredAt: "2026-08-24T08:00:00.000Z", kind: "pomodoro" as const, quantity: 1, durationSeconds: 1_800, xpEarned: 20 },
      { id: "quiz-1", occurredAt: "2026-08-24T09:00:00.000Z", kind: "quiz" as const, quantity: 1, durationSeconds: 600, xpEarned: 10 },
      { id: "wheel-1", occurredAt: "2026-08-24T10:00:00.000Z", kind: "wheel" as const, quantity: 1, durationSeconds: 3_600, xpEarned: 0 },
    ],
  };
}

describe("daily plan reward", () => {
  it("chỉ mở thưởng khi hoàn thành đủ các mục kế hoạch ngày", () => {
    const summary = dailyPlanSummary(profileFor([
      { id: "one", completed: true, completedAt: "2026-08-24T08:30:00.000Z" },
      { id: "two", completed: false },
    ]), date);
    expect(summary.completedCount).toBe(1);
    expect(summary.totalItems).toBe(2);
    expect(summary.isComplete).toBe(false);
    expect(summary.rewardMinutes).toBe(0);
  });

  it("tính thời gian học thật và bỏ qua hoạt động vòng quay", () => {
    const summary = dailyPlanSummary(profileFor([
      { id: "one", completed: true, completedAt: "2026-08-24T08:30:00.000Z" },
    ]), date);
    expect(summary.isComplete).toBe(true);
    expect(summary.studySeconds).toBe(2_400);
    expect(summary.studyMinutes).toBe(40);
    expect(summary.rewardMinutes).toBe(15);
    expect(formatStudyDuration(summary.studySeconds)).toBe("40 phút");
  });

  it("ghi claim một lần cho mỗi ngày", () => {
    const profile = profileFor([{ id: "one", completed: true, completedAt: "2026-08-24T08:30:00.000Z" }]);
    const first = claimDailyPhoneReward(profile, date, "2026-08-24T20:00:00.000Z");
    expect(first.claimed).toBe(true);
    expect(first.profile.dailyPhoneRewardClaims).toHaveLength(1);
    expect(first.profile.dailyPhoneRewardClaims?.[0]).toMatchObject({ date, rewardMinutes: 15, completedPlanItemIds: ["one"] });

    const second = claimDailyPhoneReward(first.profile, date, "2026-08-24T20:01:00.000Z");
    expect(second.claimed).toBe(false);
    expect(second.profile.dailyPhoneRewardClaims).toHaveLength(1);
  });
});
