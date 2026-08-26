import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Study goals by subject contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/components/StudyGoalsDashboard.tsx"), "utf8");

  it("cho phép đặt mục tiêu ngày, tuần và tổng cho từng môn", () => {
    expect(source).toContain("subjectDailyMinutes");
    expect(source).toContain("subjectWeeklyMinutes");
    expect(source).toContain("subjectTotalMinutes");
    expect(source).toContain("Mục tiêu/ngày (phút)");
    expect(source).toContain("Mục tiêu/tuần (phút)");
    expect(source).toContain("Tổng mục tiêu (phút)");
  });

  it("hiển thị tiến độ thực tế theo cả ba chu kỳ", () => {
    expect(source).toContain("subjectSecondsForDay(profile, subject)");
    expect(source).toContain("subjectSecondsForWeek(profile, subject)");
    expect(source).toContain("history.totalSeconds");
    expect(source).toContain("goalPercent");
  });

  it("đặt dashboard mới trong khu riêng và giữ khu tiến độ cũ", () => {
    expect(source).toContain('storageKey="study-progress-overview-new"');
    expect(source).toContain("<StudyProgressOverview");
    expect(source).not.toContain('storageKey="study-goals-overview"');
    expect(source).toContain("Tiến độ trong ngày");
  });

  it("chỉ hiển thị lịch sử tiến độ học theo từng ngày", () => {
    expect(source).toContain("studyDayHistory(profile, new Date(), 3650)");
    expect(source).toContain("Lịch sử tiến độ theo ngày");
    expect(source).toContain("day.subjectCount");
    expect(source).not.toContain("entertainment");
    expect(source).not.toContain("giải trí");
  });
});
