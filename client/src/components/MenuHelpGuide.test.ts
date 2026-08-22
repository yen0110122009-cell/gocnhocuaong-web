import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./MenuHelpGuide.tsx", import.meta.url), "utf8");

describe("MenuHelpGuide", () => {
  it("không render nút dấu hỏi, tooltip hoặc lớp phủ hướng dẫn nữa", () => {
    expect(source).toContain("return null;");
    expect(source).not.toContain('aria-label="Mở hướng dẫn các mục menu"');
    expect(source).not.toContain('role="dialog"');
    expect(source).not.toContain("setOpen(true)");
  });
});
