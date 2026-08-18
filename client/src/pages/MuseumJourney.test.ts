import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Museum fragment accessibility effects", () => {
  it("announces fragment progress and marks unlocked characters", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/MuseumJourney.tsx"), "utf8");
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain("achievement-card--unlocked");
    expect(source).toContain("mảnh hồ sơ đã thu thập");
    expect(source).toContain("fragment-assembly--${stage}");
    expect(source).toContain("Giai đoạn 4 · Sẵn sàng ghép");
    expect(source).toContain("Mở khóa hồ sơ");
    expect(source).toContain("Đọc lịch sử");
  });

  it("documents the 12 fragment earning paths and direct learning links", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/MuseumJourney.tsx"), "utf8");
    expect(source).toContain("KHO NHÂN VẬT LỊCH SỬ");
    expect(source).toContain("không nhận 1 mảnh cho mỗi thẻ");
    expect(source).toContain("phiên thứ 10");
    expect(source).toContain("status: \"planned\"");
    expect(source).toContain('view: "flashcards"');
    expect(source).toContain('view: "quizzes"');
    expect(source).toContain('view: "pomodoro"');
    expect(source).toContain('view: "achievements"');
    expect(source).toContain('view: "wheel"');
  });

  it("renders the journey map, public locked nodes and hoodie moments separately", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/MuseumJourney.tsx"), "utf8");
    expect(source).toContain("Bản đồ Hành trình");
    expect(source).toContain("Cây tiến bộ");
    expect(source).toContain("🔒 Chưa đạt");
    expect(source).not.toContain("Chưa khám phá");
    expect(source).toContain("Câu chuyện:");
    expect(source).toContain("Khoảnh khắc khi đạt");
    expect(source).toContain('mascotVariant: "hoodie"');
    expect(source).toContain('<OngLearnerAvatar variant="hoodie"');
    expect(source).toContain("Lưu khoảnh khắc này");
  });

  it("uses a progress message that celebrates unlocked milestones instead of deficit framing", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/MuseumJourney.tsx"), "utf8");
    expect(source).toContain("Bảo tàng Hành trình");
    expect(source).toContain("Ong đã mở khóa {unlocked.length} dấu mốc trong hành trình của mình.");
    expect(source).toContain("Không cần mở khóa thật nhiều");
    expect(source).not.toContain("Bạn còn thiếu");
  });

  it("groups achievement artifacts by year and month with expandable stories", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/MuseumJourney.tsx"), "utf8");
    expect(source).toContain("Bảo tàng hiện vật học tập");
    expect(source).toContain("Mốc thời gian");
    expect(source).toContain("const groups = Object.entries(grouped)");
    expect(source).toContain("Câu chuyện của hiện vật");
    expect(source).toContain("<details");
    expect(source).toContain("Hiện vật đầu tiên đang chờ Ong tạo ra");
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
