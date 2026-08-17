import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Focus Hub learning support", () => {
  it("contains smart review, ten-minute study, positive streak and fragment vault entry points", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/FocusHub.tsx"), "utf8");
    expect(source).toContain("Ôn lại thông minh");
    expect(source).toContain("Học 10 phút");
    expect(source).toContain("Chuỗi học:");
    expect(source).toContain("Kho mảnh ghép");
    expect(source).toContain("Không cần hoàn hảo");
  });
});
