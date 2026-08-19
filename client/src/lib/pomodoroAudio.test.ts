import { describe, expect, it } from "vitest";
import { COMPLETE_ALERT_PROFILE, SOUND_EVENTS, SOUNDSCAPE_LAYERS, SOUNDSCAPE_NOTES, SOUNDSCAPE_PRESETS, scaledGain, scaledLayerGain, soundEventDuration, soundEventGainMultiplier, soundEventSpacing } from "./pomodoroAudio";

describe("Pomodoro audio map", () => {
  it("contains distinct sequences for all learning states", () => {
    expect(Object.keys(SOUND_EVENTS)).toEqual(["start", "tick", "complete", "warning", "reward", "error"]);
    expect(SOUND_EVENTS.start.length).toBeGreaterThan(1);
    expect(SOUND_EVENTS.complete.length).toBeGreaterThan(SOUND_EVENTS.tick.length);
    expect(SOUND_EVENTS.reward).not.toEqual(SOUND_EVENTS.error);
  });

  it("provides non-noise tonal soundscapes", () => {
    expect(Object.keys(SOUNDSCAPE_NOTES)).toEqual(["Mưa", "Mưa nhẹ", "Rừng", "Thư viện", "White noise", "Brown noise"]);
    expect(Object.values(SOUNDSCAPE_NOTES).every((notes) => notes.length >= 4 && notes.every((note) => note > 0))).toBe(true);
  });

  it("clamps volume scaling and keeps tick shorter", () => {
    expect(scaledGain(-20, 0.13)).toBe(0);
    expect(scaledGain(50, 0.2)).toBe(0.1);
    expect(scaledGain(200, 0.2)).toBe(0.2);
    expect(soundEventDuration("tick")).toBeLessThan(soundEventDuration("complete"));
  });

  it("uses a wake-up completion profile instead of a short single chime", () => {
    expect(SOUND_EVENTS.complete.length).toBeGreaterThanOrEqual(8);
    expect(soundEventGainMultiplier("complete")).toBeGreaterThan(soundEventGainMultiplier("start"));
    expect(soundEventSpacing("complete")).toBeGreaterThan(soundEventSpacing("tick"));
    expect(soundEventDuration("complete")).toBe(COMPLETE_ALERT_PROFILE.durationSeconds);
    expect(COMPLETE_ALERT_PROFILE.vibratePattern.length).toBeGreaterThan(3);
  });

  it("boosts each mixer layer enough to remain audible while preserving slider control", () => {
    expect(scaledLayerGain(0, 0.9)).toBe(0);
    expect(scaledLayerGain(50, 0.9)).toBe(0.5625);
    expect(scaledLayerGain(100, 0.9)).toBe(1.125);
    expect(scaledLayerGain(150, 0.9)).toBe(1.125);
  });

  it("provides rich layered presets that can run continuously", () => {
    expect(Object.keys(SOUNDSCAPE_LAYERS).length).toBeGreaterThanOrEqual(20);
    expect(Object.keys(SOUNDSCAPE_PRESETS).length).toBeGreaterThanOrEqual(10);
    expect(Object.values(SOUNDSCAPE_PRESETS).every((preset) => preset.layers.every((id) => SOUNDSCAPE_LAYERS[id]?.intervalMs > 0))).toBe(true);
    expect(SOUNDSCAPE_PRESETS["Mưa"].layers.length).toBeGreaterThan(1);
    expect(SOUNDSCAPE_PRESETS["Deep focus"].layers).toContain("brown");
  });
});
