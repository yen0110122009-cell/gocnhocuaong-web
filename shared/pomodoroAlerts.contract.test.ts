import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_POMODORO_ALERT_SETTINGS,
  POMODORO_ALERT_EVENT_IDS,
  POMODORO_ALERT_SOUND_IDS,
  normalizePomodoroAlertSettings,
} from "./study";
import { POMODORO_ALERT_SOUNDS } from "../client/src/lib/pomodoroAlerts";

const pomodoroSource = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");
const audioSource = readFileSync(resolve(process.cwd(), "client/src/lib/pomodoroAlerts.ts"), "utf8");

describe("pomodoro Web Audio alerts", () => {
  it("keeps ten selectable alert sounds and all four independent transition events", () => {
    expect(POMODORO_ALERT_SOUNDS).toHaveLength(10);
    expect(POMODORO_ALERT_SOUNDS.map((sound) => sound.id)).toEqual(POMODORO_ALERT_SOUND_IDS);
    expect(POMODORO_ALERT_EVENT_IDS).toEqual(["startFocus", "endFocus", "startBreak", "endBreak"]);
    expect(Object.keys(DEFAULT_POMODORO_ALERT_SETTINGS.events)).toEqual(POMODORO_ALERT_EVENT_IDS);
  });

  it("normalizes invalid values while allowing a 200% master alert volume", () => {
    const normalized = normalizePomodoroAlertSettings({ masterVolume: 5, events: { startFocus: { enabled: false, soundId: "retro_beep" } } });
    expect(normalized.masterVolume).toBe(2);
    expect(normalized.events.startFocus).toEqual({ enabled: false, soundId: "retro_beep" });
    expect(normalized.events.endFocus).toEqual(DEFAULT_POMODORO_ALERT_SETTINGS.events.endFocus);
  });

  it("uses Web Audio oscillators only after an explicit Pomodoro action, with no background audio", () => {
    expect(audioSource).toContain("context.createOscillator()");
    expect(audioSource).toContain("context.createGain()");
    expect(audioSource).not.toContain("new Audio(");
    expect(pomodoroSource).toContain("getAlertContext");
    expect(pomodoroSource).toContain("triggerAlert");
    expect(pomodoroSource).toContain('max="200"');
    expect(pomodoroSource).toContain("POMODORO_ALERT_EVENT_IDS.map");
    expect(pomodoroSource).toContain("Nghe thử");
  });

  it("persists custom session timings and keeps goal completion to one alerting transition", () => {
    expect(pomodoroSource).toContain('aria-label="Mục tiêu số phiên Pomodoro"');
    expect(pomodoroSource).toContain('min="1" max="12"');
    expect(pomodoroSource).toContain("Tự động chuyển");
    expect(pomodoroSource).toContain("Tôi tự nhấn để chuyển");
    expect(pomodoroSource).toContain("completionHandled.current");
    expect(pomodoroSource).toContain("Đã đạt mục tiêu Pomodoro và nhận 1 Mảnh ghép.");
  });

  it("shows a compact completed-session history and the current total of Mảnh ghép", () => {
    expect(pomodoroSource).toContain('aria-label="Thống kê Pomodoro và Mảnh ghép"');
    expect(pomodoroSource).toContain("recentCompletedSessions");
    expect(pomodoroSource).toContain("totalFragments");
    expect(pomodoroSource).toContain("Mảnh ghép đang có");
    expect(pomodoroSource).toContain("Lịch sử Pomodoro");
    expect(pomodoroSource).toContain("Xem tất cả");
  });
});
