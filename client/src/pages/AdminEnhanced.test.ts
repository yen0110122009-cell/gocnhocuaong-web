import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Admin } from "./Home";
import { emptyAppConfig, type StudyAccount } from "../../../shared/study";

describe("Admin character source workflow", () => {
  it("exposes a complete member list surface with explicit data states", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/AdminEnhanced.tsx"), "utf8");
    expect(source).toContain("Danh sách thành viên");
    expect(source).toContain("Làm mới danh sách thành viên");
    expect(source).toContain("Đang tải danh sách thành viên");
    expect(source).toContain("Không thể tải danh sách thành viên");
    expect(source).toContain("Chưa có thành viên nào trong nguồn dữ liệu này");
    expect(source).toContain("Danh sách đang được cập nhật.");
  });

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

describe("learning configuration admin flow", () => {
  it("keeps configuration controls behind the Admin/Founder guard and exposes full milestone editing", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(source).toContain("if (!isAdmin(account)) return <Empty");
    expect(source).toContain("const [editingAchievement, setEditingAchievement]");
    expect(source).toContain("saveEditAchievement");
    expect(source).toContain("cancelEditAchievement");
    expect(source).toContain("aria-label=\"Chỉ số mốc đang chỉnh sửa\"");
    expect(source).toContain("aria-label=\"Mảnh ghép đang chỉnh sửa\"");
    expect(source).toContain("Lưu thay đổi");
    expect(source).toContain("Hủy chỉnh sửa");
  });
});

describe("learning configuration render access", () => {
  const account = (role: StudyAccount["role"]): StudyAccount => ({
    id: role.toLowerCase(),
    name: role,
    code: role === "Founder" ? "999" : "102",
    role,
    locked: false,
    deletedAt: null,
    createdAt: new Date().toISOString(),
  });

  it("blocks Member and exposes controls to Admin and Founder", () => {
    const blocked = renderToStaticMarkup(React.createElement(Admin, { account: account("Member"), config: emptyAppConfig(), onConfig: () => undefined }));
    const admin = renderToStaticMarkup(React.createElement(Admin, { account: account("Admin"), config: emptyAppConfig(), onConfig: () => undefined }));
    const founder = renderToStaticMarkup(React.createElement(Admin, { account: account("Founder"), config: emptyAppConfig(), onConfig: () => undefined }));
    expect(blocked).toContain("Khu vực giới hạn");
    expect(blocked).not.toContain("Tạo mốc thành tích");
    expect(admin).toContain("Cấu hình hệ sinh thái học tập");
    expect(founder).toContain("Cấu hình hệ sinh thái học tập");
    expect(admin).toContain("Mốc thành tích");
    expect(admin).toContain("Vòng quay");
  });
});

describe("historical character collection admin workflow", () => {
  it("exposes verified-source metadata, truthful image states and trash controls", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/AdminContentHub.tsx"), "utf8");
    expect(source).toContain("historicalPeriod");
    expect(source).toContain("sourceText");
    expect(source).toContain("imageStatus");
    expect(source).toContain("Chưa có ảnh");
    expect(source).toContain("Ảnh đang cập nhật");
    expect(source).toContain("softDeleteCharacter");
    expect(source).toContain("restoreCharacter");
    expect(source).toContain("permanentlyDeleteCharacter");
    expect(source).toContain("Đưa vào thùng rác");
    expect(source).toContain("Khôi phục");
    expect(source).toContain("Xóa vĩnh viễn");
  });
});
