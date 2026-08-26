import { describe, expect, it } from "vitest";
import { emptyProfile } from "./study";
import { dailyEntertainmentReward, entertainmentMinutesFromStudy, weeklyEntertainmentReward } from "./pomodoroEntertainment";
import { normalizeEntertainmentConversionSettings } from "./study";

const makeProfile = () => ({ ...emptyProfile(), pomodoroHistory: [
  { id: "today-1", startedAt: "2026-08-24T08:00:00", endedAt: "2026-08-24T08:30:00", durationMinutes: 30, subject: "Toán", topic: "Hàm số", sessionNumber: 1, totalSessions: 4, mode: "focus" as const, status: "completed" as const },
  { id: "today-2", startedAt: "2026-08-24T09:00:00", endedAt: "2026-08-24T10:15:00", durationMinutes: 75, subject: "Lý", topic: "Cơ học", sessionNumber: 2, totalSessions: 4, mode: "focus" as const, status: "completed" as const },
  { id: "break", startedAt: "2026-08-24T10:15:00", endedAt: "2026-08-24T10:30:00", durationMinutes: 15, subject: "Lý", topic: "Nghỉ", sessionNumber: 2, totalSessions: 4, mode: "shortBreak" as const, status: "completed" as const },
  { id: "abandoned", startedAt: "2026-08-24T11:00:00", endedAt: "2026-08-24T11:10:00", durationMinutes: 10, subject: "Hóa", topic: "Bài tập", sessionNumber: 3, totalSessions: 4, mode: "focus" as const, status: "abandoned" as const },
  { id: "week-1", startedAt: "2026-08-25T08:00:00", endedAt: "2026-08-25T08:30:00", durationMinutes: 30, subject: "Văn", topic: "Nghị luận", sessionNumber: 1, totalSessions: 1, mode: "focus" as const, status: "completed" as const },
] });

describe("pomodoro entertainment conversion", () => {
  it("quy đổi theo block 30 phút và không vượt trần", () => {
    expect(entertainmentMinutesFromStudy(0)).toBe(0);
    expect(entertainmentMinutesFromStudy(29)).toBe(0);
    expect(entertainmentMinutesFromStudy(30)).toBe(10);
    expect(entertainmentMinutesFromStudy(150)).toBe(50);
    expect(entertainmentMinutesFromStudy(360)).toBe(120);
    expect(entertainmentMinutesFromStudy(9999)).toBe(120);
  });
  it("chuẩn hóa và áp dụng tỷ lệ tùy chỉnh", () => {
    const settings = normalizeEntertainmentConversionSettings({ studyBlockMinutes: 45, entertainmentMinutesPerBlock: 15, dailyCapMinutes: 60 });
    expect(settings).toEqual({ studyBlockMinutes: 45, entertainmentMinutesPerBlock: 15, dailyCapMinutes: 60 });
    expect(entertainmentMinutesFromStudy(90, settings)).toBe(30);
    expect(entertainmentMinutesFromStudy(300, settings)).toBe(60);
  });

  it("không quy đổi phiên kết thúc sớm thành thời gian giải trí", () => {
    const value = makeProfile();
    value.pomodoroHistory = [{ id: "stopped-early", startedAt: "2026-08-24T11:00:00", endedAt: "2026-08-24T11:40:00", durationMinutes: 40, elapsedSeconds: 2_400, subject: "Hóa", topic: "Bài tập", sessionNumber: 3, totalSessions: 4, mode: "focus" as const, status: "abandoned" as const }, ...value.pomodoroHistory];
    expect(dailyEntertainmentReward(value, new Date("2026-08-24T12:00:00"), { studyBlockMinutes: 30, entertainmentMinutesPerBlock: 10, dailyCapMinutes: 120 })).toEqual({ studyMinutes: 105, entertainmentMinutes: 30 });
    expect(weeklyEntertainmentReward(value, new Date("2026-08-26T12:00:00"))).toEqual({ studyMinutes: 135, entertainmentMinutes: 40 });
  });

  it("chỉ tính focus completed trong ngày và tuần hiện tại", () => {
    const value = makeProfile();
    expect(dailyEntertainmentReward(value, new Date("2026-08-24T12:00:00"), { studyBlockMinutes: 45, entertainmentMinutesPerBlock: 15, dailyCapMinutes: 120 })).toEqual({ studyMinutes: 105, entertainmentMinutes: 30 });
    expect(weeklyEntertainmentReward(value, new Date("2026-08-26T12:00:00"))).toEqual({ studyMinutes: 135, entertainmentMinutes: 40 });
  });
});
