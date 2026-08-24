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

  it("cho xem lịch sử tiến độ và phần thưởng theo từng ngày", () => {
    expect(source).toContain("studyDayHistory(profile, new Date(), 60)");
    expect(source).toContain("Lịch sử tiến độ theo ngày");
    expect(source).toContain("Lịch sử thưởng theo ngày");
    expect(source).toContain("entertainmentDayHistory(profile, new Date(), 60");
    expect(source).toContain("day.subjectCount");
    expect(source).toContain("day.entertainmentMinutes");
  });
});
