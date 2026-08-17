import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Dashboard, Login } from "./Home";
import { emptyAppConfig, emptyProfile, type StudyAccount } from "../../../shared/study";

const account: StudyAccount = {
  id: "member-qa",
  name: "Nguyễn Văn An",
  code: "111",
  role: "Member",
  locked: false,
  deletedAt: null,
  createdAt: new Date(0).toISOString(),
};

describe("login and member dashboard contract", () => {
  it("renders loading, red error, and admin-help links in the no-email login", () => {
    const markup = renderToStaticMarkup(React.createElement(Login, {
      onSubmit: () => undefined,
      loading: true,
      error: "Thông tin đăng nhập không chính xác.",
      staticHost: true,
    }));
    expect(markup).toContain("Đang xử lý…");
    expect(markup).toContain("Thông tin đăng nhập không chính xác.");
    expect(markup).toContain("Quên mật khẩu?");
    expect(markup).toContain("Quên mã thành viên?");
  });

  it("renders member greeting and account information after login", () => {
    const markup = renderToStaticMarkup(React.createElement(Dashboard, {
      account,
      profile: emptyProfile(),
      config: emptyAppConfig(),
      onView: () => undefined,
    }));
    expect(markup).toContain("Chào An!");
    expect(markup).toContain("Hồ sơ thành viên");
    expect(markup).toContain("Nguyễn Văn An");
    expect(markup).toContain("Mã thành viên:");
    expect(markup).toContain("Tài khoản đang hoạt động");
  });
});

describe("auth dashboard source accessibility", () => {
  it("keeps actionable labels for support and member status", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(source).toContain("aria-label=\"Đóng hướng dẫn\"");
    expect(source).toContain("Mã thành viên:");
    expect(source).toContain("aria-label={loading ? \"Đang kiểm tra thông tin\"");
  });
});
