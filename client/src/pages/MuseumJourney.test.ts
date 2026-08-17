import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Museum fragment accessibility effects", () => {
  it("announces fragment progress and marks unlocked characters", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/MuseumJourney.tsx"), "utf8");
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain("achievement-card--unlocked");
    expect(source).toContain("mảnh ghép đã thu thập");
    expect(source).toContain("fragment-assembly--${stage}");
    expect(source).toContain("Giai đoạn 4 · Sẵn sàng ghép");
    expect(source).toContain("Ghép hình hoàn chỉnh");
    expect(source).toContain("Đọc lịch sử");
  });

  it("documents the 12 fragment earning paths and direct learning links", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/MuseumJourney.tsx"), "utf8");
    expect(source).toContain("Cách nhận mảnh ghép");
    expect(source).toContain("không nhận 1 mảnh cho mỗi thẻ");
    expect(source).toContain("phiên thứ 10");
    expect(source).toContain("status: \"planned\"");
    expect(source).toContain('view: "flashcards"');
    expect(source).toContain('view: "quizzes"');
    expect(source).toContain('view: "pomodoro"');
    expect(source).toContain('view: "achievements"');
    expect(source).toContain('view: "wheel"');
  });

  it("defines reduced-motion-safe unlock and completion effects", () => {
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(css).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(css).toContain("achievement-unlock");
    expect(css).toContain("session-complete");
    expect(css).toContain("fragment-assemble");
    expect(css).toContain("fragment-complete");
    expect(css).toContain("prefers-reduced-motion: reduce");
  });
});
