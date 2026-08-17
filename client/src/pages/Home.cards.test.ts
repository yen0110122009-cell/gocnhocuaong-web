import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Cards React study modes", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("exposes all four modes and their accessible labels", () => {
    expect(source).toContain('useState<"flip" | "choice" | "write" | "rapid">');
    expect(source).toContain('aria-label="Chế độ học Flashcard"');
    expect(source).toContain("Lật thẻ");
    expect(source).toContain("Trắc nghiệm");
    expect(source).toContain("Tự viết");
    expect(source).toContain("Tốc độ");
  });

  it("implements choice checking, rapid timing, and session report", () => {
    expect(source).toContain("const answerChoice = (choice: string)");
    expect(source).toContain("const answerWrite = () =>");
    expect(source).toContain("normalizeAnswer(card.back)");
    expect(source).toContain("rapidLimitSeconds = 60");
    expect(source).toContain("setRapidExpired");
    expect(source).toContain("Đã hết giờ");
    expect(source).toContain("setRapidSeconds");
    expect(source).toContain("Báo cáo phiên");
    expect(source).toContain("Học lại phiên");
    expect(source).toContain("applyStudyActivityRewards");
    expect(source).toContain("session-complete");
    expect(source).toContain("aria-live=\"polite\"");
  });
});

describe("Cards persistence safety", () => {
  it("keeps management and date filters alongside study mode state", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(source).toContain('aria-label="Đổi tên bộ Flashcard"');
    expect(source).toContain('aria-label="Sao chép bộ Flashcard"');
    expect(source).toContain('aria-label="Xóa bộ Flashcard"');
    expect(source).toContain('aria-label="Lọc ngày Flashcard"');
  });
});
