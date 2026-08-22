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
      onGuest: () => undefined,
      loading: true,
      error: "Thông tin đăng nhập không chính xác.",
      staticHost: true,
    }));
    expect(markup).toContain("Đang xử lý…");
    expect(markup).toContain("Thông tin đăng nhập không chính xác.");
    expect(markup).toContain("Quên mật khẩu?");
    expect(markup).toContain("Quên mã được cấp?");
    expect(markup).toContain("Mã được cấp");
    expect(markup).toContain("Chỉ tham quan với tài khoản khách");
    expect(markup).toContain("Facebook: gửi yêu cầu xét duyệt");
    expect(markup).toContain("Nhắn Zalo 0983346399");
    expect(markup).not.toContain("mã 111");
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
    expect(source).toContain("Bạn thật sự muốn đăng nhập tài khoản khách ư?");
    expect(source).toContain("session?.account.isGuest");
    expect(source).toContain("Chế độ khách không lưu thay đổi");
  });
});


describe("new resilience feedback contracts", () => {
  it("renders a friendly retry action for rate-limited login", () => {
    const markup = renderToStaticMarkup(React.createElement(Login, {
      onSubmit: () => undefined,
      onGuest: () => undefined,
      loading: false,
      error: "Hệ thống đang nhận quá nhiều yêu cầu đăng nhập. Vui lòng chờ khoảng một phút rồi thử lại.",
      staticHost: true,
    }));
    expect(markup).toContain("Thử lại đăng nhập");
    expect(markup).toContain("role=\"alert\"");
  });

  it("keeps the rate-limit and retry wording in the login implementation", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(source).toContain("friendlyLoginError");
    expect(source).toContain("Thử lại đăng nhập");
  });
});
