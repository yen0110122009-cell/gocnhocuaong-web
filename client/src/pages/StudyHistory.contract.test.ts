import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/StudyHistory.tsx"), "utf8");

describe("StudyHistory theo môn", () => {
  it("giữ năm môn mặc định và dữ liệu Pomodoro hoàn thành", () => {
    const analytics = readFileSync(resolve(process.cwd(), "shared/studyTimeAnalytics.ts"), "utf8");
    for (const subject of ["Toán", "Lý", "Hóa", "Văn", "Anh"]) expect(analytics).toContain(`"${subject}"`);
    expect(source).toContain("subjectHistory");
    expect(source).toContain('session.mode === "focus"');
    expect(source).toContain('session.status === "completed"');
  });

  it("có tìm kiếm từ khóa, lọc trạng thái và sắp xếp", () => {
    expect(source).toContain("Tìm môn hoặc từ khóa");
    expect(source).toContain("Đã có phút học");
    expect(source).toContain("Chưa học");
    expect(source).toContain("Tổng thời gian giảm dần");
    expect(source).toContain("Tên môn A–Z");
    expect(source).toContain("history.years");
    expect(source).toContain("history.months");
    expect(source).toContain("month.days");
  });
});
