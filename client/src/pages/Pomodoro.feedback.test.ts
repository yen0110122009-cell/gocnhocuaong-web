import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Pomodoro feedback contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");

  it("giữ quy định no-BGM với âm báo nước và TTS Lumi", () => {
    expect(source).toContain("Cài đặt Lumi và Pomodoro");
    expect(source).toContain("Nhắc uống nước");
    expect(source).toContain("LUMI_WATER_ALERT_SOUNDS");
    expect(source).toContain("window.speechSynthesis");
    expect(source).not.toContain("POMODORO_ALERT_EVENT_IDS.map");
    expect(source).not.toContain("playPomodoroAlert");
  });

  it("lưu ngữ cảnh học gồm môn, nội dung và ghi chú", () => {
    expect(source).toContain("Môn học");
    expect(source).toContain("Nội dung");
    expect(source).toContain("Ghi chú phiên học");
    expect(source).toContain("checkedPlanItemIds");
  });

  it("giữ hỗ trợ chống trì hoãn và Lumi không chặn thao tác", () => {
    expect(source).toContain("Hỗ trợ chống trì hoãn");
    expect(source).toContain("Cần an ủi");
    expect(source).toContain("Cần động viên");
    expect(source).toContain('role="status"');
  });
});
