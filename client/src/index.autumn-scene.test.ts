import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("cảnh Lá rơi mùa thu", () => {
  const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

  it("có tán lá và lá tích trên lớp nền cố định", () => {
    expect(css).toContain(':root[data-ambient-scene="leaves"] #root > div.min-h-screen::before');
    expect(css).toContain('study-scene-leaves_bb6c6f6c.jpg');
    expect(css).toContain('radial-gradient(ellipse 18% 6% at 7% 101%');
  });

  it("có lớp lá rơi tiền cảnh xuyên nội dung nhưng không chặn thao tác", () => {
    expect(css).toContain(':root[data-ambient-scene="leaves"] #root > div.min-h-screen::after');
    expect(css).toContain('z-index: 54');
    expect(css).toContain('pointer-events: none');
    expect(css).toContain('animation: autumn-frontfall');
  });

  it("giữ trải nghiệm an toàn trên mobile và giảm chuyển động", () => {
    expect(css).toContain('@media (max-width: 767px)');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
  });
});

