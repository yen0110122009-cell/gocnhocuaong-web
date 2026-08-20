import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const studio = () => readFileSync(resolve(projectRoot, "client/src/components/ExperienceStudio.tsx"), "utf8");
const home = () => readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
const pomodoro = () => readFileSync(resolve(projectRoot, "client/src/pages/Pomodoro.tsx"), "utf8");
const companionControls = () => readFileSync(resolve(projectRoot, "client/src/components/EmotionCompanionMediaControls.tsx"), "utf8");
const defaultCompanionMedia = () => readFileSync(resolve(projectRoot, "client/src/lib/defaultCompanionMedia.ts"), "utf8");
const congratulationControls = () => readFileSync(resolve(projectRoot, "client/src/components/LumiCongratulationControls.tsx"), "utf8");
const styles = () => readFileSync(resolve(projectRoot, "client/src/index.css"), "utf8");

describe("Emotion, ambient scene and audio persistence contract", () => {
  it("uses the saved scene as the default scene and applies it globally", () => {
    expect(studio()).toContain('profile?.defaultAmbientScene ?? "morning"');
    expect(studio()).toContain("defaultAmbientScene: ambientScene");
    expect(home()).toContain('root.dataset.ambientScene = profile.defaultAmbientScene ?? "morning"');
  });

  it("persists independent scene and recorded-Lumi volume controls without device speech synthesis", () => {
    expect(studio()).toContain("function updateAmbientVolume");
    expect(studio()).toContain("ambientSceneVolumes: next");
    expect(studio()).toContain("function updateLumiVolume");
    expect(studio()).toContain("audio.volume = lumiVolume / 100");
    expect(studio()).not.toContain("speechSynthesis");
    expect(studio()).not.toContain("Dùng giọng đọc theo ngày của thiết bị");
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

  it("uses a saved Lumi recording for the learner emotion and explains when no recording exists", () => {
    expect(studio()).toContain("item.emotion === theme.id");
    expect(studio()).toContain("Giọng Lumi theo cảm xúc");
    expect(studio()).toContain("Chưa có bản thu Lumi cho lời nhắn này");
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

  it("starts companion media without default images and requires a recorded Lumi voice before image upload", () => {
    expect(defaultCompanionMedia()).toContain("getDefaultMascotImage");
    expect(defaultCompanionMedia()).toContain("getDefaultLumiImage");
    expect(companionControls()).toContain("Chưa có ảnh");
    expect(companionControls()).toContain("kind === \"lumi-image\" && voiceRecordings.length === 0");
    expect(companionControls()).not.toContain("getDefaultLumiImage(emotion)");
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

  it("stores one weekly completion record and shows a persistent learner-visible history", () => {
    expect(pomodoro()).toContain("weeklyPomodoroGoalCompletions");
    expect(pomodoro()).toContain("weeklyGoalHistoryWriteRef");
    expect(pomodoro()).toContain("Lịch sử hoàn thành mục tiêu tuần");
    expect(pomodoro()).toContain("Mỗi tuần chỉ được lưu một lần");
  });

  it("provides per-emotion Lumi congratulation CRUD and uses the custom message when available", () => {
    expect(studio()).toContain("LumiCongratulationControls");
    expect(studio()).toContain("lumiCongratulationMessages?.[theme.id]?.[0]");
    expect(studio()).toContain("lumiCongratulationText");
    expect(congratulationControls()).toContain("function save()");
    expect(congratulationControls()).toContain("function beginEdit");
    expect(congratulationControls()).toContain("function remove");
    expect(congratulationControls()).toContain("Ghi âm trực tiếp");
    expect(congratulationControls()).toContain("audioUrl");
    expect(congratulationControls()).toContain("getUserMedia");
  });

  it("adds a brief visual and audio transition only when the learner enables these attention preferences", () => {
    expect(studio()).toContain("async function playEmotionTransitionSound");
    expect(studio()).toContain("attentionPreferences.soundEnabled");
    expect(studio()).toContain("attentionPreferences.animationsEnabled");
    expect(studio()).toContain("lumi-emotion-transition");
    expect(styles()).toContain('html[data-animations="on"] .lumi-emotion-transition');
    expect(styles()).toContain("@media (prefers-reduced-motion: no-preference)");
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

  it("prevents stale background starts and keeps Pomodoro aligned with the global sound preference", () => {
    expect(pomodoro()).toContain("backgroundGenerationRef");
    expect(pomodoro()).toContain("generation !== backgroundGenerationRef.current");
    expect(pomodoro()).toContain("profileSoundRef");
    expect(pomodoro()).toContain("setSound(profile.soundEnabled)");
    expect(pomodoro()).toContain('audioContextRef.current.state === "closed"');
  });

  it("keeps clean ambient playback exclusive, user-initiated, faded, and adjustable", () => {
    expect(studio()).toContain("ambientGenerationRef");
    expect(studio()).toContain("ambientTrackRef");
    expect(studio()).toContain("function stopAmbient()");
    expect(studio()).toContain("audio.loop = true");
    expect(studio()).toContain("audio.play()");
    expect(studio()).toContain("fadeIn");
    expect(studio()).toContain("track.pause(); track.removeAttribute(\"src\"); track.load()");
    expect(studio()).toContain("Hãy thêm tệp thật vào Audio Center");
    expect(studio()).toContain('audio.preload = "auto"');
    expect(studio()).toContain("Thử lại âm nền");
    expect(studio()).not.toContain("ambientGenerationRef.current);");
  });
});
