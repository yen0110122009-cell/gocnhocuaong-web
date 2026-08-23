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
import { LUMI_WATER_ALERT_SOUNDS } from "../client/src/lib/lumiAlerts";
import { LUMI_DIALOGUE_LINES_STORAGE_KEY, LUMI_SPEECH_STORAGE_KEY, LUMI_WATER_MESSAGE_STORAGE_KEY } from "../client/src/lib/lumiPreferences";

const pomodoroSource = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");
const lumiAlertSource = readFileSync(resolve(process.cwd(), "client/src/lib/lumiAlerts.ts"), "utf8");
const preferencesSource = readFileSync(resolve(process.cwd(), "client/src/lib/lumiPreferences.ts"), "utf8");

 describe("Pomodoro and Lumi audio rules", () => {
  it("keeps legacy Pomodoro alert data normalizable without exposing it as active playback", () => {
    expect(POMODORO_ALERT_SOUNDS).toHaveLength(10);
    expect(POMODORO_ALERT_SOUNDS.map((sound) => sound.id)).toEqual(POMODORO_ALERT_SOUND_IDS);
    expect(POMODORO_ALERT_EVENT_IDS).toEqual(["startFocus", "endFocus", "startBreak", "endBreak"]);
    expect(Object.keys(DEFAULT_POMODORO_ALERT_SETTINGS.events)).toEqual(POMODORO_ALERT_EVENT_IDS);
    const normalized = normalizePomodoroAlertSettings({ masterVolume: 5, events: { startFocus: { enabled: false, soundId: "retro_beep" } } });
    expect(normalized.masterVolume).toBe(2);
    expect(normalized.events.startFocus).toEqual({ enabled: false, soundId: "retro_beep" });
  });

  it("provides exactly five selectable water reminder sounds using Web Audio only", () => {
    expect(LUMI_WATER_ALERT_SOUNDS).toHaveLength(5);
    expect(LUMI_WATER_ALERT_SOUNDS.map((sound) => sound.label)).toEqual([
      "Giọt nước mượt mà 💧",
      "Chuông tinh tinh 🔔",
      "Tiếng chuông gió 🎐",
      "Tiếng cốc cốc 🪵",
      "Âm tích tích Kawaii ✨",
    ]);
    expect(lumiAlertSource).toContain("context.createOscillator()");
    expect(lumiAlertSource).toContain("context.createGain()");
    expect(lumiAlertSource).not.toContain("new Audio(");
  });

  it("enforces strict no-BGM behavior while keeping water alert and Vietnamese TTS", () => {
    expect(pomodoroSource).toContain("Pomodoro không phát nhạc nền");
    expect(pomodoroSource).toContain("playLumiWaterAlert");
    expect(pomodoroSource).toContain("window.speechSynthesis");
    expect(pomodoroSource).toContain('utterance.lang = "vi-VN"');
    expect(pomodoroSource).not.toContain("triggerAlert(");
    expect(pomodoroSource).not.toContain("playPomodoroAlert");
    expect(pomodoroSource).not.toContain("POMODORO_ALERT_EVENT_IDS.map");
  });

  it("supports a draggable persisted widget, four warm check-in choices and live water feedback", () => {
    expect(pomodoroSource).toContain("miniPlayerPosition");
    expect(pomodoroSource).toContain("onPointerDown={startWidgetDrag}");
    expect(pomodoroSource).toContain("Mở hộp thoại hỏi thăm của Lumi");
    expect(pomodoroSource).toContain("Mệt mỏi");
    expect(pomodoroSource).toContain("Thiếu động lực");
    expect(pomodoroSource).toContain("Cần cái ôm");
    expect(pomodoroSource).toContain("Sẵn sàng học");
    expect(pomodoroSource).toContain("Đã uống 💧");
    expect(pomodoroSource).toContain("Lumi thả tim");
    expect(pomodoroSource).not.toContain("Mảnh ghép đang có");
    expect(pomodoroSource).not.toContain("nhận 1 Mảnh ghép");
  });

  it("persists speech, water message and editable dialogue lines in dedicated LocalStorage keys", () => {
    expect([LUMI_SPEECH_STORAGE_KEY, LUMI_WATER_MESSAGE_STORAGE_KEY, LUMI_DIALOGUE_LINES_STORAGE_KEY]).toEqual([
      "lumi_speech_enabled",
      "lumi_water_message",
      "lumi_dialogue_lines",
    ]);
    expect(preferencesSource).toContain("localStorage");
    expect(preferencesSource).toContain("saveLumiDialogueLines");
    expect(preferencesSource).toContain("DEFAULT_LUMI_WATER_MESSAGE");
  });
});
