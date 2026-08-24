import { describe, expect, it } from "vitest";
import { emptyProfile, normalizeProfile } from "./study";
import { formatStudyMinutes, goalPercent, normalizeStudySubjects, normalizeStudyTimeGoals, studySecondsForDay, studySecondsForWeek, subjectHistory, subjectSecondsForDay } from "./studyTimeAnalytics";

const profile = () => ({ ...emptyProfile(), studyActivity: [
  { id: "p-1", occurredAt: "2026-08-24T08:00:00", kind: "pomodoro" as const, quantity: 1, durationSeconds: 1_800, xpEarned: 0 },
  { id: "wheel", occurredAt: "2026-08-24T09:00:00", kind: "wheel" as const, quantity: 1, durationSeconds: 9_999, xpEarned: 0 },
  { id: "p-2", occurredAt: "2026-08-25T08:00:00", kind: "pomodoro" as const, quantity: 1, durationSeconds: 3_600, xpEarned: 0 },
], pomodoroHistory: [
  { id: "s-1", startedAt: "2026-08-24T08:00:00", endedAt: "2026-08-24T08:30:00", durationMinutes: 30, subject: "Toán", topic: "Hàm số", sessionNumber: 1, totalSessions: 1, mode: "focus" as const, status: "completed" as const },
  { id: "s-2", startedAt: "2026-08-25T08:00:00", endedAt: "2026-08-25T08:45:00", durationMinutes: 45, subject: "Toán", topic: "Đạo hàm", sessionNumber: 1, totalSessions: 1, mode: "focus" as const, status: "completed" as const },
  { id: "break", startedAt: "2026-08-24T08:30:00", endedAt: "2026-08-24T08:35:00", durationMinutes: 5, subject: "Toán", topic: "Nghỉ", sessionNumber: 1, totalSessions: 1, mode: "shortBreak" as const, status: "completed" as const },
  { id: "abandoned", startedAt: "2026-08-24T10:00:00", endedAt: "2026-08-24T10:02:00", durationMinutes: 2, subject: "Lý", topic: "Cơ học", sessionNumber: 1, totalSessions: 1, mode: "focus" as const, status: "abandoned" as const },
  { id: "s-3", startedAt: "2026-08-26T08:00:00", endedAt: "2026-08-26T08:30:00", durationMinutes: 30, subject: "Lý", topic: "Điện học", sessionNumber: 1, totalSessions: 1, mode: "focus" as const, status: "completed" as const },
  { id: "s-4", startedAt: "2026-08-27T08:00:00", endedAt: "2026-08-27T08:45:00", durationMinutes: 45, subject: "Hóa", topic: "Este", sessionNumber: 1, totalSessions: 1, mode: "focus" as const, status: "completed" as const },
  { id: "s-5", startedAt: "2026-08-28T08:00:00", endedAt: "2026-08-28T09:00:00", durationMinutes: 60, subject: "Văn", topic: "Nghị luận", sessionNumber: 1, totalSessions: 1, mode: "focus" as const, status: "completed" as const },
  { id: "s-6", startedAt: "2026-08-29T08:00:00", endedAt: "2026-08-29T09:30:00", durationMinutes: 90, subject: "Anh", topic: "Reading", sessionNumber: 1, totalSessions: 1, mode: "focus" as const, status: "completed" as const },
] });

describe("study time analytics", () => {
  it("tổng hợp ngày/tuần từ StudyActivity và bỏ hoạt động wheel", () => {
    const value = profile();
    expect(studySecondsForDay(value, new Date("2026-08-24T12:00:00"))).toBe(1_800);
    expect(studySecondsForWeek(value, new Date("2026-08-26T12:00:00"))).toBe(5_400);
  });
  it("tổng hợp môn chỉ từ phiên focus hoàn thành và phân cấp theo ngày", () => {
    const value = profile();
    const history = subjectHistory(value, "Toán", new Date("2026-08-24T12:00:00"));
    expect(history.totalSeconds).toBe(75 * 60);
    expect(history.yearSeconds).toBe(75 * 60);
    expect(history.monthSeconds).toBe(75 * 60);
    expect(subjectSecondsForDay(value, "Toán", new Date("2026-08-24T12:00:00"))).toBe(30 * 60);
    expect(history.days.map((day) => day.key)).toEqual(["2026-08-25", "2026-08-24"]);
    expect(history.months[0].days[0]).toMatchObject({ key: "2026-08-25", seconds: 2_700 });
  });
  it("khôi phục mục tiêu ngày, tuần và tổng của môn từ profile", () => {
    const value = normalizeProfile({ studyTimeGoals: { dailyMinutes: 180, weeklyMinutes: 900, subjectDailyMinutes: { Hóa: 60 }, subjectWeeklyMinutes: { Hóa: 300 }, subjectTotalMinutes: { Hóa: 1_800 } } });
    expect(value.studyTimeGoals).toMatchObject({ subjectDailyMinutes: { Hóa: 60 }, subjectWeeklyMinutes: { Hóa: 300 }, subjectTotalMinutes: { Hóa: 1_800 } });
  });
  it("giữ riêng thời gian Hóa theo từng ngày khi tính tổng nhiều ngày", () => {
    const value = profile();
    value.pomodoroHistory = [
      { id: "hoa-1", startedAt: "2026-08-20T08:00:00", endedAt: "2026-08-20T08:45:00", durationMinutes: 45, subject: "Hóa", topic: "Este", sessionNumber: 1, totalSessions: 1, mode: "focus", status: "completed" },
      { id: "hoa-2", startedAt: "2026-08-23T13:00:00", endedAt: "2026-08-23T14:10:00", durationMinutes: 70, subject: "Hóa", topic: "Amin", sessionNumber: 1, totalSessions: 1, mode: "focus", status: "completed" },
      { id: "hoa-3", startedAt: "2026-08-24T09:00:00", endedAt: "2026-08-24T09:30:00", durationMinutes: 30, subject: "Hóa", topic: "Polime", sessionNumber: 1, totalSessions: 1, mode: "focus", status: "completed" },
    ];
    const history = subjectHistory(value, "Hóa", new Date("2026-08-24T12:00:00"));
    expect(history.totalSeconds).toBe(145 * 60);
    expect(history.days.map((day) => [day.key, day.seconds])).toEqual([["2026-08-24", 30 * 60], ["2026-08-23", 70 * 60], ["2026-08-20", 45 * 60]]);
    expect(subjectSecondsForDay(value, "Hóa", new Date("2026-08-23T20:00:00"))).toBe(70 * 60);
    expect(subjectSecondsForDay(value, "Hóa", new Date("2026-08-24T12:00:00"))).toBe(30 * 60);
  });
  it("chuẩn hóa mục tiêu từng môn theo ngày, tuần và tổng mà vẫn nhận dữ liệu cũ", () => {
    expect(normalizeStudyTimeGoals({ dailyMinutes: 180, weeklyMinutes: 900, subjectDailyMinutes: { Hóa: 60 }, subjectWeeklyMinutes: { Hóa: 300 }, subjectTotalMinutes: { Hóa: 1_800 } })).toEqual({ dailyMinutes: 180, weeklyMinutes: 900, subjectDailyMinutes: { Hóa: 60 }, subjectWeeklyMinutes: { Hóa: 300 }, subjectTotalMinutes: { Hóa: 1_800 } });
    expect(normalizeStudyTimeGoals({ subjectDailyMinutes: { Hóa: 60 } }).subjectWeeklyMinutes).toEqual({});
    expect(normalizeStudyTimeGoals({ subjectTotalMinutes: { Hóa: 99_999_999 } }).subjectTotalMinutes).toEqual({ Hóa: 10_000_000 });
  });
  it("kiểm tra đầy đủ năm môn mặc định theo tổng thời gian thực", () => {
    const value = profile();
    const anchor = new Date("2026-08-31T12:00:00");
    for (const [subject, minutes] of [["Toán", 75], ["Lý", 30], ["Hóa", 45], ["Văn", 60], ["Anh", 90]] as const) {
      const history = subjectHistory(value, subject, anchor);
      expect(history.totalSeconds).toBe(minutes * 60);
      expect(history.yearSeconds).toBe(minutes * 60);
      expect(history.monthSeconds).toBe(minutes * 60);
      expect(history.years[0]?.key).toBe("2026");
      expect(history.months[0]?.key).toBe("2026-08");
      expect(history.days.length).toBeGreaterThan(0);
    }
  });
  it("chuẩn hóa môn mặc định, mục tiêu và định dạng phút", () => {
    expect(normalizeStudySubjects([" Toán ", "Sinh học", "", 42])).toEqual(["Toán", "Lý", "Hóa", "Văn", "Anh", "Sinh học"]);
    expect(formatStudyMinutes(3_660)).toBe("1 giờ 1 phút");
    expect(goalPercent(45, 60)).toBe(75);
    expect(goalPercent(20, 0)).toBe(0);
  });
});
