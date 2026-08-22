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

  it("keeps only the Pomodoro bell volume in the profile mixer", () => {
    expect(pomodoro()).toContain("audioMixerHydratedRef");
    expect(pomodoro()).toContain("pomodoroBell: alertVolume");
    expect(pomodoro()).toContain("profile.audioMixer?.pomodoroBell ?? 85");
    expect(pomodoro()).not.toContain("pomodoroLayers: layerVolumes");
    expect(pomodoro()).not.toContain("pomodoroAmbientMix");
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

  it("keeps legacy mascot/Lumi image data out of the rendered companion UI while preserving visibility state", () => {
    expect(studio()).not.toContain("companionMedia?.mascotImageUrl");
    expect(studio()).not.toContain("companionMedia?.lumiImageUrl");
    expect(studio()).toContain("profile?.showMascot !== false");
    expect(studio()).toContain("profile?.showLumi !== false");
  });

  it("keeps companion audio independent after removing mascot and Lumi images", () => {
    expect(defaultCompanionMedia()).toContain("getDefaultMascotImage");
    expect(defaultCompanionMedia()).toContain("getDefaultLumiImage");
    expect(companionControls()).not.toContain("Chưa có ảnh");
    expect(companionControls()).not.toContain("kind === \"lumi-image\" && voiceRecordings.length === 0");
    expect(companionControls()).toContain("Chỉ nhận WebM, OGG, WAV hoặc MP3, tối đa 8 MB.");
    expect(companionControls()).not.toContain("Chỉ nhận PNG, JPG, WEBP hoặc GIF, tối đa 3 MB.");
    expect(companionControls()).not.toContain("getDefaultLumiImage(emotion)");
    expect(companionControls()).toContain("Nhấn để nghe");
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

  it("keeps only transition alerts and exposes both transition modes", () => {
    expect(pomodoro()).toContain('aria-label="Âm báo và chuyển phiên Pomodoro"');
    expect(pomodoro()).toContain('name="pomodoro-transition-mode"');
    expect(pomodoro()).toContain("Tự động chuyển phiên");
    expect(pomodoro()).toContain("Tôi tự nhấn để chuyển");
    expect(pomodoro()).toContain('previewEvent("breakStart")');
    expect(pomodoro()).toContain('previewEvent("breakEnd")');
    expect(pomodoro()).not.toContain("Nghe thử 5 giây");
    expect(pomodoro()).not.toContain("Bật Audio Center");
  });

  it("removes Pomodoro background playback while preserving the global sound unlock flow", () => {
    expect(pomodoro()).not.toContain("backgroundGenerationRef");
    expect(pomodoro()).not.toContain("startBackground");
    expect(pomodoro()).toContain("profileSoundRef");
    expect(pomodoro()).toContain("setSound(profile.soundEnabled)");
    expect(pomodoro()).toContain('audioContextRef.current.state === "closed"');
    expect(pomodoro()).toContain('playSequence("breakStart")');
    expect(pomodoro()).toContain('playSequence("breakEnd")');
  });

  it("keeps clean ambient playback exclusive, user-initiated, faded, and adjustable", () => {
    expect(studio()).toContain("ambientGenerationRef");
    expect(studio()).toContain("ambientTrackRef");
    expect(studio()).toContain("function stopAmbient()");
    expect(studio()).toContain("audio.loop = true");
    expect(studio()).toContain("audio.play()");
    expect(studio()).toContain("fadeIn");
    expect(studio()).toContain("track.pause(); track.removeAttribute(\"src\"); track.load()");
    expect(studio()).toContain("DEFAULT_AMBIENT_ASSET");
    expect(studio()).toContain("DEFAULT_AMBIENT_BOOK_PAGES_ASSET");
    expect(studio()).toContain("DEFAULT_AMBIENT_MORNING_ASSET");
    expect(studio()).toContain("DEFAULT_AMBIENT_STORM_ASSET");
    expect(studio()).toContain('scene === "morning" || scene === "summer" || scene === "spring" || scene === "tet" || scene === "desert" ? DEFAULT_AMBIENT_MORNING_ASSET');
    expect(studio()).toContain('scene === "rain" ? DEFAULT_AMBIENT_ASSET');
    expect(studio()).toContain('scene === "leaves" ? DEFAULT_AMBIENT_BOOK_PAGES_ASSET');
    expect(studio()).toContain('scene === "storm" || scene === "halloween" || scene === "night" ? DEFAULT_AMBIENT_STORM_ASSET');
    expect(studio()).toContain('audio.preload = "auto"');
    expect(studio()).toContain("ambientTrackRef");
    expect(readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8")).toContain("Điều khiển âm nền theme");
    expect(studio()).not.toContain("ambientGenerationRef.current);");
  });
});
