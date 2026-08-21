import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("tinh chỉnh cảnh mưa, lá rơi, tuyết và dark mode theo mùa", () => {
  it("dựng mây cố định, giọt nước chóp nhọn, vũng nước và sét cho mưa/sấm", () => {
    expect(css).toContain('data-ambient-scene="rain"] body::before');
    expect(css).toContain('data-ambient-scene="storm"] body::before');
    expect(css).toContain('data-ambient-scene="rain"] body::after');
    expect(css).toContain("raindrop-diagonal-fall");
    expect(css).toContain("cloud-gentle-sway");
    expect(css).toContain("lightning-strike");
    expect(css).toContain("rain-puddles-shimmer");
    expect(css).toContain("storm-puddle-lightning");
    expect(css).toContain("repeating-radial-gradient(ellipse");
    expect(css).toContain("data:image/svg+xml");
    expect(css).toContain("pointer-events: none");
  });

  it("giảm lá rơi về trục dọc, dùng lá nhỏ nhiều sắc độ và bỏ thảm lá đáy", () => {
    expect(css).toContain("autumn-sparse-vertical-fall");
    expect(css).toContain("background-position: 18% 118vh, 76% 112vh");
    expect(css).toContain('data-ambient-scene="leaves"] body::after');
    expect(css).toContain('body::after { content: none; }');
    expect(css).toContain("%23e69a9d");
  });

  it("đặt người tuyết SVG ở góc dưới nhưng không nhận thao tác", () => {
    expect(css).toContain('data-ambient-scene="snow"] body::after');
    expect(css).toContain("snowman-gentle-bob");
    expect(css).toContain("--snowman-x");
    expect(css).toContain("--snowman-y");
    expect(css).toContain("width: 7.3rem");
  });

  it("áp dụng token tối riêng cho tất cả scene lên nền, menu, panel và thành tích", () => {
    for (const scene of ["morning", "rain", "snow", "leaves", "storm", "summer", "spring", "tet", "halloween"]) {
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] { --season-night-page:`);
    }
    expect(css).toContain(":root.dark[data-ambient-scene] #root > div.min-h-screen > aside");
    expect(css).toContain(".achievement-card--unlocked");
    expect(css).toContain("[class*=\"trophy\"]");
  });

  it("dừng chuyển động không thiết yếu khi người dùng yêu cầu reduced motion", () => {
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain('data-ambient-scene="snow"] body::after');
    expect(css).toContain("animation: none !important");
  });
});
