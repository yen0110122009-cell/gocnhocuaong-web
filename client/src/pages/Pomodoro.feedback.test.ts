import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Pomodoro feedback contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");

  it("shows an explicit audio unlock status in the mini-player", () => {
    expect(source).toContain("Âm thanh đã mở khóa");
    expect(source).toContain("Chưa mở khóa âm thanh");
    expect(source).toContain("aria-label={audioUnlocked ?");
  });

  it("keeps restore confirmation and a smooth visual feedback state", () => {
    expect(source).toContain("Đã khôi phục phiên Pomodoro đang chạy.");
    expect(source).toContain("pomodoro-starting");
    expect(source).toContain("transition-all duration-300");
    expect(source).toContain("aria-label=\"Khôi phục phiên Pomodoro\"");
  });
});
