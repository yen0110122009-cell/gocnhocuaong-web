import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const studio = () => readFileSync(resolve(projectRoot, "client/src/components/ExperienceStudio.tsx"), "utf8");
const home = () => readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
const pomodoro = () => readFileSync(resolve(projectRoot, "client/src/pages/Pomodoro.tsx"), "utf8");
const companionControls = () => readFileSync(resolve(projectRoot, "client/src/components/EmotionCompanionMediaControls.tsx"), "utf8");
const defaultCompanionMedia = () => readFileSync(resolve(projectRoot, "client/src/lib/defaultCompanionMedia.ts"), "utf8");

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

  it("selects an approved Lumi recording for the learner emotion before falling back to device speech", () => {
    expect(studio()).toContain("item.emotion === theme.id");
    expect(studio()).toContain("Giọng Lumi theo cảm xúc");
    expect(studio()).toContain("Dùng bản thu đã được Admin duyệt");
  });

  it("shows the actual seven-day Pomodoro study trend and a clear empty state", () => {
    expect(pomodoro()).toContain("Array.from({ length: 7 }");
    expect(pomodoro()).toContain("Tổng thời gian Pomodoro tuần qua");
    expect(pomodoro()).toContain("Chưa có phiên Pomodoro hoàn thành trong bảy ngày qua");
  });

  it("keeps the weekly Pomodoro goal and progress beside the seven-day chart", () => {
    expect(pomodoro()).toContain("weeklyPomodoroGoalMinutes");
    expect(pomodoro()).toContain("Mục tiêu tuần (phút)");
    expect(pomodoro()).toContain("weeklyProgress");
    expect(pomodoro()).toContain("Tiến độ mục tiêu tuần");
  });

  it("uses learner-uploaded Mascot and Lumi images for the selected emotion and honors visibility choices", () => {
    expect(studio()).toContain("companionMedia?.mascotImageUrl");
    expect(studio()).toContain("companionMedia?.lumiImageUrl");
    expect(studio()).toContain("profile?.showMascot !== false");
    expect(studio()).toContain("profile?.showLumi !== false");
  });

  it("uses emotion-specific fallback images when the learner has not uploaded personal images", () => {
    expect(defaultCompanionMedia()).toContain("getDefaultMascotImage");
    expect(defaultCompanionMedia()).toContain("getDefaultLumiImage");
    expect(companionControls()).toContain("getDefaultLumiImage(emotion)");
    expect(companionControls()).toContain("emotion={emotion}");
    expect(studio()).toContain("getDefaultLumiImage(theme.id)");
  });

  it("plays a favorite personal Lumi recording before legacy and approved recordings", () => {
    expect(studio()).toContain("preferredPersonalVoice?.url || companionMedia?.lumiVoiceUrl || matchingVoiceLine?.audioUrl");
    expect(companionControls()).toContain("lumiVoiceRecordings");
    expect(companionControls()).toContain("favoriteLumiVoiceId");
    expect(companionControls()).toContain("Bản thu ưu tiên");
  });

  it("shows a weekly goal celebration only after crossing the goal and remembers the calendar week", () => {
    expect(pomodoro()).toContain("calendarWeekKey");
    expect(pomodoro()).toContain("pomodoro_goal_celebrated_week_");
    expect(pomodoro()).toContain("weeklyGoalReachedRef.current === false && reached");
    expect(pomodoro()).toContain("weeklyGoalCelebrationOpen");
    expect(pomodoro()).toContain("Ong đã chạm mục tiêu rồi!");
  });

  it("keeps explicit audio-center start, stop, preview and status controls behind a user gesture", () => {
    expect(pomodoro()).toContain("async function toggleAudioCenter");
    expect(pomodoro()).toContain("async function toggleBackgroundPlayback");
    expect(pomodoro()).toContain("const [backgroundRequested, setBackgroundRequested]");
    expect(pomodoro()).toContain("const [backgroundActive, setBackgroundActive]");
    expect(pomodoro()).toContain("Bật Audio Center");
    expect(pomodoro()).toContain("Dừng nền");
    expect(pomodoro()).toContain("Nghe thử 5 giây");
    expect(pomodoro()).toContain("async function unlockAudio(allowWhenJustEnabled = false)");
    expect(pomodoro()).toContain("unlockAudio(allowWhenJustEnabled)");
  });
});
