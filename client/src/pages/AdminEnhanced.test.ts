import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Admin character source workflow", () => {
  it("exposes CRUD, copy, preview and source validation controls", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/AdminEnhanced.tsx"), "utf8");
    expect(source).toContain("function CharacterManager");
    expect(source).toContain("Sao chép");
    expect(source).toContain("Tải ảnh JPG/PNG/WebP");
    expect(source).toContain("Chỉ nhận ảnh JPG, PNG hoặc WebP.");
    expect(source).toContain("Nguồn tư liệu");
    expect(source).toContain("Trạng thái nguồn");
    expect(source).toContain("Tư liệu/timeline JSON");
    expect(source).toContain("Thiếu nguồn");
  });
});
