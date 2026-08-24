import { describe, expect, it } from "vitest";
import { dailyPlanStreak } from "./dailyPlanStreak";
import { emptyProfile } from "./study";

function item(id: string, date: string, completed: boolean, cadence: "day" | "week" = "day") {
  return { id, title: id, scheduledFor: date, cadence, completed, completedAt: completed ? `${date}T08:00:00.000Z` : undefined, reward: "fragment" as const, rewardAmount: 1 };
}

describe("daily plan streak", () => {
  it("tính streak hiện tại và streak dài nhất từ các ngày hoàn thành trọn vẹn", () => {
    const profile = { ...emptyProfile, studyPlanItems: [
      item("d1", "2026-08-20", true),
      item("d2", "2026-08-21", true),
      item("d3", "2026-08-22", false),
      item("d4", "2026-08-23", true),
      item("d5", "2026-08-24", true),
      item("weekly", "2026-08-24", true, "week"),
    ] };
    const result = dailyPlanStreak(profile, new Date("2026-08-24T12:00:00.000Z"), 5);
    expect(result.currentStreak).toBe(2);
    expect(result.bestStreak).toBe(2);
    expect(result.completedDates).toEqual(["2026-08-20", "2026-08-21", "2026-08-23", "2026-08-24"]);
    expect(result.days.at(-1)).toMatchObject({ date: "2026-08-24", hasPlan: true, completedCount: 1, totalItems: 1, isComplete: true });
  });

  it("không tính ngày không có kế hoạch hoặc kế hoạch tuần vào streak", () => {
    const profile = { ...emptyProfile, studyPlanItems: [item("d1", "2026-08-22", true), item("weekly", "2026-08-23", true, "week"), item("d3", "2026-08-24", true)] };
    const result = dailyPlanStreak(profile, new Date("2026-08-24T12:00:00.000Z"), 3);
    expect(result.currentStreak).toBe(1);
    expect(result.bestStreak).toBe(1);
    expect(result.days.map((day) => day.hasPlan)).toEqual([true, false, true]);
    expect(result.days[1]).toMatchObject({ date: "2026-08-23", hasPlan: false, totalItems: 0, isComplete: false });
  });
});
