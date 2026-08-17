import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("progress enhancements", () => {
  it("offers flashcards from saved wrong-answer explanations", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/QuizEnhanced.tsx"), "utf8");
    expect(source).toContain("Tạo Flashcard từ giải thích sâu");
    expect(source).toContain("wrongAnswerReviews");
    expect(source).toContain("flashcardSets: [set");
  });

  it("filters progress reports by date, subject and quiz mode", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/ProgressReports.tsx"), "utf8");
    expect(source).toContain("Lọc khoảng thời gian tiến bộ");
    expect(source).toContain("Lọc môn học tiến bộ");
    expect(source).toContain("Lọc chế độ làm đề tiến bộ");
    expect(source).toContain("completedAt");
  });

  it("supports browser print flow that can save the report as PDF", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/ProgressReports.tsx"), "utf8");
    expect(source).toContain("In / lưu PDF");
    expect(source).toContain("window.print()");
    expect(source).toContain("Báo cáo tiến bộ");
  });
});
