import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("LearningProgress charts", () => {
  it("renders progress breakdown by quiz mode", () => {
    expect(source).toContain("progress-mode-chart");
    expect(source).toContain("Làm đề nhanh");
    expect(source).toContain("Hiểu tận gốc");
    expect(source).toContain("Tự làm đề–Tập trung");
  });

  it("renders progress breakdown by subject and topic from quiz history", () => {
    expect(source).toContain("progress-topic-chart");
    expect(source).toContain("Chủ đề nổi bật");
    expect(source).toContain("quizById");
    expect(source).toContain("Chưa phân loại");
  });
});

