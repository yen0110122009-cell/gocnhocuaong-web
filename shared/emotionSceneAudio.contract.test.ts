import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const studio = () => readFileSync(resolve(projectRoot, "client/src/components/ExperienceStudio.tsx"), "utf8");
const home = () => readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
const pomodoro = () => readFileSync(resolve(projectRoot, "client/src/pages/Pomodoro.tsx"), "utf8");

describe("Emotion, ambient scene and audio persistence contract", () => {
  it("uses the saved scene as the default scene and applies it globally", () => {
    expect(studio()).toContain('profile?.defaultAmbientScene ?? "morning"');
    expect(studio()).toContain("defaultAmbientScene: ambientScene");
    expect(home()).toContain('root.dataset.ambientScene = profile.defaultAmbientScene ?? "morning"');
  });

  it("persists independent scene and Lumi volume controls in the learner profile", () => {
    expect(studio()).toContain("function updateAmbientVolume");
    expect(studio()).toContain("ambientSceneVolumes: next");
    expect(studio()).toContain("function updateLumiVolume");
    expect(studio()).toContain("audio.volume = lumiVolume / 100");
    expect(studio()).toContain("utterance.volume = lumiVolume / 100");
  });

  it("keeps the Pomodoro layer mixer and bell volume in the same profile mixer", () => {
    expect(pomodoro()).toContain("audioMixerHydratedRef");
    expect(pomodoro()).toContain("pomodoroLayers: layerVolumes");
    expect(pomodoro()).toContain("pomodoroBell: alertVolume");
    expect(pomodoro()).toContain("profile.audioMixer?.pomodoroBell ?? 70");
  });

  it("uses the profile emotion when Pomodoro opens Experience Studio", () => {
    expect(pomodoro()).toContain('const emotion: EmotionId = profile.emotionTheme ?? "calm"');
    expect(pomodoro()).toContain("emotionTheme: nextEmotion");
  });
});
