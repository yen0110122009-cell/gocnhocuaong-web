import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("PersistentCollapsible contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/components/PersistentCollapsible.tsx"), "utf8");

  it("mặc định thu gọn khi chưa có lựa chọn đã lưu", () => {
    expect(source).toContain("defaultOpen = false");
    expect(source).toContain('saved === null ? defaultOpen : saved === "open"');
  });

  it("lưu trạng thái độc lập và có nút truy cập được bằng bàn phím", () => {
    expect(source).toContain("gocnhocuaong:collapse:${storageKey}");
    expect(source).toContain("aria-expanded={open}");
    expect(source).toContain("localStorage.setItem");
    expect(source).toContain('gocnhocuaong:collapse-all');
    expect(source).toContain('typeof detail?.open === "boolean"');
  });
});

describe("phạm vi thu gọn hiện tại", () => {
  it("đặt các nhóm quản trị vào khóa riêng, không bao toàn bộ route", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const workspace = readFileSync(resolve(process.cwd(), "client/src/pages/AdminWorkspace.tsx"), "utf8");
    expect(home).not.toContain("storageKey={`view-${view}`}");
    expect(workspace).toContain('storageKey="admin-members"');
    expect(workspace).toContain('storageKey="admin-events"');
    expect(home).toContain('gocnhocuaong:collapse-all');
    expect(home).toContain('setSectionsCollapsed(true)');
  });

  it("giữ Pomodoro chỉ có nhắc nước/TTS thay vì âm nền hoặc preset cũ", () => {
    const pomodoro = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");
    expect(pomodoro).toContain("Cài đặt Lumi và Pomodoro");
    expect(pomodoro).toContain("Nhắc uống nước");
    expect(pomodoro).not.toContain("startBackground");
    expect(pomodoro).not.toContain('storageKey="pomodoro-audio-center"');
  });
});
