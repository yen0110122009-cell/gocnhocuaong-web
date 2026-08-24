import { describe, expect, it } from "vitest";
import { emptyAppConfig, normalizeProfile } from "./study";

describe("dữ liệu kế hoạch legacy được bảo toàn", () => {
  it("giữ lịch sử Kế hoạch cũ và không làm mất thời gian Pomodoro khi chuẩn hóa hồ sơ", () => {
    const profile = normalizeProfile({
      studyPlanItems: [{ id: "daily-1", title: "Ôn công thức", cadence: "day", completed: true, completedAt: "2026-08-23T08:00:00.000Z", reward: "fragment", rewardAmount: 2 }],
      planFragments: 2,
      pomodoroHistory: [{ id: "pomo-1", subject: "Toán", topic: "Hàm số", durationMinutes: 25, startedAt: "2026-08-23T08:00:00.000Z", endedAt: "2026-08-23T08:25:00.000Z", sessionNumber: 1, totalSessions: 1, mode: "focus", status: "completed" }],
      studyActivity: [{ id: "activity-1", occurredAt: "2026-08-23T08:25:00.000Z", kind: "pomodoro", quantity: 1, durationSeconds: 1_500, xpEarned: 0 }],
    });
    expect(profile.studyPlanItems).toHaveLength(1);
    expect(profile.studyPlanItems?.[0]).toMatchObject({ title: "Ôn công thức", completed: true });
    expect(profile.planFragments).toBe(2);
    expect(profile.pomodoroHistory).toHaveLength(1);
    expect(profile.studyActivity[0].durationSeconds).toBe(1_500);
  });

  it("không tự tạo Kế hoạch mới khi hồ sơ cũ không có dữ liệu", () => {
    const profile = normalizeProfile({});
    expect(profile.studyPlanItems).toEqual([]);
    expect(profile.dailyPhoneRewardClaims).toEqual([]);
    expect(profile.dailyPlanReminderSettings).toMatchObject({ enabled: true, hour: 20, minute: 0 });
  });

  it("giữ đúng một event mẫu legacy không có phần thưởng XP", () => {
    const events = emptyAppConfig().collectionConfig?.events ?? [];
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ id: "sample-weekly-plan-event", approvalStatus: "approved", status: "active" });
    expect(events[0].rewards.some((reward) => reward.type === "xp")).toBe(false);
  });
});
