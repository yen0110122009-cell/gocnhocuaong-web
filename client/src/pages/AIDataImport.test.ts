import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("AIDataImport UI contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/AIDataImport.tsx"), "utf8");

  it("keeps external-AI boundary and editable prompt controls", () => {
    expect(source).toContain("AI Data Import");
    expect(source).toContain("Tài liệu không được tự động gửi sang AI ngoài");
    expect(source).toContain("Prompt AI có thể chỉnh sửa");
    expect(source).toContain("Sao chép prompt");
    expect(source).toContain("Tạo lại");
  });

  it("exposes standard-data input, validation preview and conversion actions", () => {
    expect(source).toContain("Dán dữ liệu AI chuẩn");
    expect(source).toContain("aria-label=\"Dán dữ liệu AI\"");
    expect(source).toContain("Kiểm tra dữ liệu");
    expect(source).toContain("Preview:");
    expect(source).toContain("Tạo nội dung học");
    expect(source).toContain("convertImportToFlashcards");
    expect(source).toContain("convertImportToQuiz");
  });

  it("records account-scoped import history", () => {
    expect(source).toContain("profile.aiImportHistory");
    expect(source).toContain("aiImportHistory: [record");
    expect(source).toContain("Lịch sử chỉ thuộc tài khoản hiện tại");
    expect(source).toContain("Xem/nạp lại");
    expect(source).toContain("sao chép prompt từ lịch sử");
    expect(source).toContain("Xóa");
  });
});
