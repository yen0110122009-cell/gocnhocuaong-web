import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Focus Hub learning support", () => {
  it("contains smart review, ten-minute study and Kế hoạch entry points", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/FocusHub.tsx"), "utf8");
    expect(source).toContain("Ôn lại thông minh");
    expect(source).toContain("Học 10 phút");
    expect(source).toContain("Kế hoạch tự quản lý");
    expect(source).not.toContain("Mảnh ghép Kế hoạch");
    expect(source).not.toContain("Từ mục tiêu đã nhận");
    expect(source).toContain("Không cần hoàn hảo");
  });
});
