import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("cảnh tuyết phủ toàn giao diện", () => {
  it("đặt lớp tuyết tiền cảnh phía trên nội dung nhưng không chặn thao tác", () => {
    expect(css).toContain(':root[data-ambient-scene="snow"] #root > div.min-h-screen::after');
    expect(css).toContain("z-index: 54");
    expect(css).toContain("pointer-events: none");
    expect(css).toContain("snow-frontfall");
  });

  it("có lớp tuyết tích ở đáy và tôn trọng giảm chuyển động", () => {
    expect(css).toContain('radial-gradient(ellipse 30% 8% at 7% 101%');
    expect(css).toContain('radial-gradient(ellipse 38% 10% at 41% 102%');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
