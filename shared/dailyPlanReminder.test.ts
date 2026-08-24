import { describe, expect, it } from "vitest";
import { dailyPlanReminderMessage, dailyPlanReminderStatus, isDailyPlanReminderDue, normalizeDailyPlanReminderSettings } from "./dailyPlanReminder";
import { emptyProfile } from "./study";

const plan = (completed: boolean) => ({ id: "plan-1", title: "Ôn bài", scheduledFor: "2026-08-24", cadence: "day" as const, completed, completedAt: completed ? "2026-08-24T08:00:00.000Z" : undefined, reward: "fragment" as const, rewardAmount: 1 });

describe("daily plan reminder", () => {
  it("chỉ đủ điều kiện nhắc khi còn mục Kế hoạch ngày chưa hoàn thành", () => {
    const pending = { ...emptyProfile(), studyPlanItems: [plan(false)] };
    const complete = { ...emptyProfile(), studyPlanItems: [plan(true)] };
    const none = { ...emptyProfile(), studyPlanItems: [] };
    expect(dailyPlanReminderStatus(pending, "2026-08-24")).toMatchObject({ totalItems: 1, completedCount: 0, shouldRemind: true });
    expect(dailyPlanReminderStatus(complete, "2026-08-24").shouldRemind).toBe(false);
    expect(dailyPlanReminderStatus(none, "2026-08-24").shouldRemind).toBe(false);
    expect(dailyPlanReminderMessage(dailyPlanReminderStatus(pending, "2026-08-24"))).toContain("1/1");
  });

  it("đúng mốc giờ địa phương và tắt được trong cài đặt", () => {
    const profile = { ...emptyProfile(), studyPlanItems: [plan(false)], dailyPlanReminderSettings: { enabled: true, hour: 20, minute: 0 } };
    expect(isDailyPlanReminderDue(profile, new Date("2026-08-24T19:59:00"))).toBe(false);
    expect(isDailyPlanReminderDue(profile, new Date("2026-08-24T20:00:00"))).toBe(true);
    expect(isDailyPlanReminderDue(profile, new Date("2026-08-24T20:01:00"))).toBe(true);
    expect(isDailyPlanReminderDue({ ...profile, dailyPlanReminderSettings: { enabled: false, hour: 20, minute: 0 } }, new Date("2026-08-24T20:00:00"))).toBe(false);
    expect(normalizeDailyPlanReminderSettings({ hour: 0, minute: 30 })).toEqual({ enabled: true, hour: 0, minute: 30 });
  });
});
