import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./MenuHelpGuide.tsx", import.meta.url), "utf8");

describe("MenuHelpGuide", () => {
  it("cung cấp nút dấu hỏi có nhãn hỗ trợ truy cập và bảng hướng dẫn mở từ cạnh màn hình", () => {
    expect(source).toContain('aria-label="Mở hướng dẫn các mục menu"');
    expect(source).toContain("<CircleHelp");
    expect(source).toContain('role="dialog"');
    expect(source).toContain("setOpen(true)");
    expect(source).toContain("Đóng hướng dẫn menu");
  });

  it("giới thiệu công dụng và bước bắt đầu cho tất cả menu thành viên", () => {
    [
      "Trang chủ", "Ôn tập thông minh", "Nhập dữ liệu AI", "Pomodoro", "Bản đồ kiến thức", "Lịch sử học",
      "Tôi sắp kiểm tra", "Tiến trình", "AI Studio", "Flashcard", "Đề kiểm tra", "Thành tích",
      "Bảo tàng hành trình", "Vòng quay tri thức", "Tài khoản",
    ].forEach((menuLabel) => expect(source).toContain(`title: "${menuLabel}"`));
    expect(source).toContain("purpose:");
    expect(source).toContain("firstStep:");
    expect(source).toContain("Bắt đầu:");
  });

  it("chỉ hiển thị giải thích menu đặc quyền cho đúng tài khoản", () => {
    expect(source).toContain('audience: "admin"');
    expect(source).toContain('audience: "special111"');
    expect(source).toContain('item.audience === "admin" ? isAdmin : isUnlimitedAccount');
  });

  it("cho phép tra cứu nhanh và đi thẳng đến từng phần từ hướng dẫn", () => {
    expect(source).toContain('aria-label="Tìm chức năng trong hướng dẫn"');
    expect(source).toContain("const matchingItems");
    expect(source).toContain("item.title, item.purpose, item.firstStep");
    expect(source).toContain("Không tìm thấy chức năng phù hợp");
    expect(source).toContain("Đi tới phần này");
    expect(source).toContain("if (onNavigate) onNavigate(view)");
    expect(source).toContain('document.querySelectorAll<HTMLButtonElement>("aside nav button")');
    expect(source).toContain("setOpen(false)");
  });
});
