import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Quản trị thành viên và Event", () => {
  it("giữ quản lý thành viên với trạng thái, phân quyền, khóa và xóa", () => {
    const members = source("client/src/pages/AdminEnhanced.tsx");
    expect(members).toContain("Danh sách thành viên");
    expect(members).toContain("Làm mới danh sách thành viên");
    expect(members).toContain("cloudUpdateAccount");
    expect(members).toContain("cloudDeleteAccount");
    expect(members).toContain("lastActiveAt");
    expect(members).toContain("Đã khóa");
  });

  it("gom quản trị vào các khối thu gọn và cung cấp Event chỉ thưởng vé hoặc mảnh ghép", () => {
    const workspace = source("client/src/pages/AdminWorkspace.tsx");
    expect(workspace).toContain("PersistentCollapsible");
    expect(workspace).toContain('storageKey="admin-members"');
    expect(workspace).toContain('storageKey="admin-events"');
    expect(workspace).toContain("Tạo Event nháp");
    expect(workspace).toContain('rewardType === "ticket"');
    expect(workspace).toContain('rewardType === "fragment"');
  });

  it("không đưa Thành tích, Cấp độ, Danh hiệu, Bảo tàng hoặc Vòng quay vào workspace mới", () => {
    const workspace = source("client/src/pages/AdminWorkspace.tsx");
    expect(workspace).toContain("không còn nằm trong bề mặt quản trị");
    expect(workspace).not.toContain("AchievementCatalogAdmin");
    expect(workspace).not.toContain("WheelEnhanced");
  });
});
