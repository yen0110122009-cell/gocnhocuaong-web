import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_POMODORO_ALERT_SETTINGS,
  normalizeLumiWaterSettings,
  POMODORO_ALERT_EVENT_IDS,
  POMODORO_ALERT_SOUND_IDS,
  normalizePomodoroAlertSettings,
} from "./study";
import { POMODORO_ALERT_SOUNDS } from "../client/src/lib/pomodoroAlerts";
import { LUMI_WATER_ALERT_SOUNDS } from "../client/src/lib/lumiAlerts";
import { LUMI_DIALOGUE_LINES_STORAGE_KEY, LUMI_SPEECH_STORAGE_KEY, LUMI_WATER_MESSAGE_STORAGE_KEY } from "../client/src/lib/lumiPreferences";

const pomodoroSource = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");
const lumiAlertSource = readFileSync(resolve(process.cwd(), "client/src/lib/lumiAlerts.ts"), "utf8");
const pomodoroAlertSource = readFileSync(resolve(process.cwd(), "client/src/lib/pomodoroAlerts.ts"), "utf8");
const preferencesSource = readFileSync(resolve(process.cwd(), "client/src/lib/lumiPreferences.ts"), "utf8");
const speechSource = readFileSync(resolve(process.cwd(), "client/src/lib/lumiSpeech.ts"), "utf8");
const presetsSource = readFileSync(resolve(process.cwd(), "client/src/lib/lumiPresets.ts"), "utf8");

 describe("Pomodoro and Lumi audio rules", () => {
  it("keeps Pomodoro alert settings normalizable and exposes the four selectable events", () => {
    expect(POMODORO_ALERT_SOUNDS).toHaveLength(10);
    expect(POMODORO_ALERT_SOUNDS.map((sound) => sound.id)).toEqual(POMODORO_ALERT_SOUND_IDS);
    expect(POMODORO_ALERT_EVENT_IDS).toEqual(["startFocus", "endFocus", "startBreak", "endBreak"]);
    expect(Object.keys(DEFAULT_POMODORO_ALERT_SETTINGS.events)).toEqual(POMODORO_ALERT_EVENT_IDS);
    const normalized = normalizePomodoroAlertSettings({ masterVolume: 5, events: { startFocus: { enabled: false, soundId: "retro_beep" } } });
    expect(normalized.masterVolume).toBe(2);
    expect(normalized.events.startFocus).toEqual({ enabled: false, soundId: "retro_beep" });
    expect(DEFAULT_POMODORO_ALERT_SETTINGS.masterVolume).toBe(1.6);
    expect(normalizeLumiWaterSettings({ intervalMinutes: 2, scheduleMode: "clock", dailyTime: "07:30" })).toMatchObject({ intervalMinutes: 5, scheduleMode: "clock", dailyTime: "07:30", dailyTimes: ["07:30"] });
    expect(normalizeLumiWaterSettings({ scheduleMode: "clock", dailyTimes: ["14:00", "09:00", "09:00", "bad"] }).dailyTimes).toEqual(["09:00", "14:00"]);
    expect(normalizeLumiWaterSettings({ scheduleMode: "clock", dailyTime: "25:99" }).dailyTime).toBe("09:00");
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
    expect(pomodoroAlertSource).toContain("const base = volume * 0.5;");
    expect(lumiAlertSource).not.toContain("new Audio(");
  });

  it("keeps strict no-BGM behavior while enabling short Pomodoro alerts and Vietnamese TTS", () => {
    expect(pomodoroSource).toContain("Pomodoro không phát nhạc nền");
    expect(pomodoroSource).toContain("playLumiWaterAlert");
    expect(pomodoroSource).toContain("playPomodoroAlert");
    expect(pomodoroSource).toContain("triggerPomodoroAlert");
    expect(pomodoroSource).toContain("sessionProgressLabel");
    expect(pomodoroSource).toContain("Bắt đầu nghỉ");
    expect(pomodoroSource).toContain("Bắt đầu phiên");
    expect(pomodoroSource).toContain("window.speechSynthesis");
    expect(speechSource).toContain('utterance.lang = "vi-VN"');
    expect(speechSource).toContain('voice.lang.replace("_", "-").toLocaleLowerCase().startsWith("vi")');
    expect(speechSource).toContain("isNatural");
    expect(pomodoroSource).not.toContain("new Audio(");
  });

  it("supports a draggable persisted widget, expanded check-in choices and live water feedback", () => {
    expect(pomodoroSource).toContain("miniPlayerPosition");
    expect(pomodoroSource).toContain("onPointerDown={startWidgetDrag}");
    expect(pomodoroSource).toContain("Mở hộp thoại hỏi thăm của Lumi");
    expect(pomodoroSource).toContain("LUMI_CHECKIN_OPTIONS.map");
    for (const label of ["Mệt mỏi", "Thiếu động lực", "Cần cái ôm", "Sẵn sàng học", "Tập trung", "Đau lòng", "Bình tĩnh"]) expect(presetsSource).toContain(label);
    expect(pomodoroSource).toContain("Đã uống 💧");
    expect(pomodoroSource).toContain("Lumi thả tim");
    expect(pomodoroSource).toContain("setShowLumiDialog(true)");
    expect(pomodoroSource).toContain("onPointerDown={startLumiPopupDrag}");
    expect(pomodoroSource).toContain("lumiPopupPosition");
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
    expect(pomodoroSource).toContain("scheduleMode");
    expect(pomodoroSource).toContain("dailyTime");
    expect(pomodoroSource).toContain("Nghe thử âm báo nhắc nước");
  });
});
