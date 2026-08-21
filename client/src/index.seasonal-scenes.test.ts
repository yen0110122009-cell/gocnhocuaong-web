import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("bốn cảnh theo mùa và sự kiện", () => {
  it("đồng bộ nền, chữ, panel và điều khiển của từng scene", () => {
    for (const scene of ["summer", "spring", "tet", "halloween"]) {
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] { --scene-page:`);
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] body`);
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] #root > div.min-h-screen`);
    }
    expect(css).toContain("var(--scene-card)");
    expect(css).toContain("var(--scene-text)");
    expect(css).toContain("var(--scene-accent)");
  });

  it("dựng lớp cảnh thuần CSS cho nắng hè, hoa xuân và không khí Tết", () => {
    expect(css).toContain('data-ambient-scene="summer"] #root > div.min-h-screen::before');
    expect(css).toContain("summer-fireflies");
    expect(css).toContain('data-ambient-scene="spring"] #root > div.min-h-screen::after');
    expect(css).toContain("spring-petal-fall");
    expect(css).toContain('data-ambient-scene="tet"] #root > div.min-h-screen::after');
    expect(css).toContain("tet-lantern-glow");
    expect(css).toContain("tet-sparkle");
  });

  it("đặt ma và dơi Halloween trên nội dung, không chặn thao tác và chỉ xuất hiện theo nhịp thưa", () => {
    expect(css).toContain('data-ambient-scene="halloween"] #root > div.min-h-screen::after');
    expect(css).toContain("z-index: 54");
    expect(css).toContain("pointer-events: none");
    expect(css).toContain("halloween-flyby 26s");
    expect(css).toContain("0%, 10%, 24%, 60%, 74%, 100%");
    expect(css).toContain("data:image/svg+xml");
  });

  it("giữ responsive và respects prefers-reduced-motion cho lớp cảnh mới", () => {
    expect(css).toContain("@media (max-width: 767px)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain('data-ambient-scene="halloween"] #root > div.min-h-screen::after { animation: none !important; }');
  });
});
