import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { emotionThemes, emotionFromCommand } from "../lib/emotionThemes";

const studioSource = await import.meta.glob("./ExperienceStudio.tsx", { query: "?raw", import: "default", eager: true })["./ExperienceStudio.tsx"] as string;
const mediaControlsSource = await import.meta.glob("./EmotionCompanionMediaControls.tsx", { query: "?raw", import: "default", eager: true })["./EmotionCompanionMediaControls.tsx"] as string;
  const personalStudySpaceSource = await import.meta.glob("./PersonalStudySpaceControls.tsx", { query: "?raw", import: "default", eager: true })["./PersonalStudySpaceControls.tsx"] as string;
  const audioCenterEnhancementsSource = await import.meta.glob("./AudioCenterEnhancements.tsx", { query: "?raw", import: "default", eager: true })["./AudioCenterEnhancements.tsx"] as string;
const homeSource = await import.meta.glob("../pages/Home.tsx", { query: "?raw", import: "default", eager: true })["../pages/Home.tsx"] as string;
const pomodoroSource = await import.meta.glob("../pages/Pomodoro.tsx", { query: "?raw", import: "default", eager: true })["../pages/Pomodoro.tsx"] as string;
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const studySource = readFileSync(resolve(process.cwd(), "shared/study.ts"), "utf8");

describe("Experience Studio requirements", () => {
  it("keeps a broad emotion catalog with encouragement and mascot mapping", () => {
    expect(emotionThemes.length).toBeGreaterThanOrEqual(6);
    expect(emotionThemes.every((theme) => theme.encouragement.length > 20)).toBe(true);
    expect(emotionThemes.every((theme) => theme.mascot === "lumi" || theme.mascot === "ong")).toBe(true);
  });

  it("supports safe mood command routing", () => {
    expect(emotionFromCommand("bật theme vui vẻ").id).toBe("happy");
    expect(emotionFromCommand("tôi đang mệt").id).toBe("tired");
    expect(emotionFromCommand("lệnh không xác định").id).toBe("calm");
  });

  it("contains the required non-pressure learning flows and red-green visual tokens", () => {
    expect(studioSource).toContain("Chế độ lười");
    expect(studioSource).toContain("Thử 2 phút");
    expect(studioSource).toContain("Boss Trì hoãn");
    expect(studioSource).toContain("Ong vs Trì hoãn");
    expect(studioSource).toContain("#c62828");
    expect(studioSource).toContain("#2e7d32");
    expect(studioSource).not.toContain("OngLearnerAvatar");
    expect(studioSource).toContain("unlockAudio");
    expect(studioSource).toContain("Đã mở khóa âm thanh trên thiết bị này.");
    expect(mediaControlsSource).toContain("Audio Lumi · Nhấn để nghe");
    expect(mediaControlsSource).not.toContain("getDefaultLumiImage");
  });

  it("restores a saved emotion at most once and delegates DOM theme ownership to the app controller", () => {
    expect(studioSource).toContain("restoredEmotionRef");
    expect(studioSource).toContain("if (restoredEmotionRef.current) return;");
    expect(studioSource).not.toContain("root.dataset.emotion = selected");
    expect(homeSource).toContain("function EmotionThemeController");
    expect(homeSource).toContain("new MutationObserver");
    expect(homeSource).toContain("study-empire:emotion-change");
  });

  it("does not animate full background images while changing emotion palettes", () => {
    expect(cssSource).not.toContain("background-image 240ms");
    expect(cssSource).toContain("transition: border-color 160ms");
  });

  it("shows Lumi as an audio-only companion with direct listening and environmental scenes", () => {
    expect(studioSource).toContain("Lumi đang ở đây");
    expect(studioSource).toContain("Nghe lời thoại Lumi");
    expect(studioSource).not.toContain("<img");
    expect(studioSource).toContain("ambientScene");
    expect(studioSource).toContain("Giao diện yêu thích");
    expect(studioSource).not.toContain("Phát âm nền cho cảm xúc");
    expect(studioSource).toContain("profile?.defaultAmbientScene");
    expect(studioSource).toContain("defaultAmbientScene: ambientScene");
  });

  it("lists and persists the four seasonal or event scenes with a safe built-in ambience fallback", () => {
    expect(studioSource).toContain('id: "summer"');
    expect(studioSource).toContain('id: "spring"');
    expect(studioSource).toContain('id: "tet"');
    expect(studioSource).toContain('id: "halloween"');
    expect(studioSource).toContain('scene === "summer" || scene === "spring" || scene === "tet"');
    expect(studioSource).toContain('scene === "storm" || scene === "halloween"');
    expect(studySource).toContain('"summer" | "spring" | "tet" | "halloween"');
    expect(studySource).toContain('summer: 36, spring: 34, tet: 38, halloween: 30');
  });

  it("keeps legacy media data compatible while rendering the selected voice as audio-only", () => {
    expect(mediaControlsSource).toContain("recordingsFromMedia");
    expect(mediaControlsSource).toContain("aria-label={`Phát bản thu ${item.label}`}");
    expect(mediaControlsSource).toContain("onClick={() => preview(item)}");
    expect(mediaControlsSource).not.toContain("<img");
  });

  it("manages saved Lumi recordings as an audio-only grid with direct preview", () => {
    expect(mediaControlsSource).toContain("Bộ sưu tập bản thu Lumi");
    expect(mediaControlsSource).toContain("sm:grid-cols-2 xl:grid-cols-3");
    expect(mediaControlsSource).not.toContain("uploadRecordingImage");
    expect(mediaControlsSource).toContain("Nghe thử");
    expect(mediaControlsSource).not.toContain("ImagePlus");
    expect(mediaControlsSource).not.toContain("getDefaultLumiImage");
    expect(mediaControlsSource).not.toContain("Đổi ảnh");
  });

  it("keeps audio library reorder, filter, and duplicate controls without image management", () => {
    expect(mediaControlsSource).not.toContain("CLASSIC_LUMI_IMAGE");
    expect(mediaControlsSource).toContain("reorderWithinEmotion");
    expect(mediaControlsSource).not.toContain("Đổi ảnh");
    expect(mediaControlsSource).toContain("draggable");
    expect(mediaControlsSource).toContain("Tìm tên bản thu Lumi");
    expect(mediaControlsSource).toContain("Lọc bản thu theo cảm xúc");
    expect(mediaControlsSource).not.toContain("Lọc bản thu theo ảnh đại diện");
    expect(mediaControlsSource).toContain("duplicateVoice");
    expect(mediaControlsSource).toContain("Nhân bản");
    expect(mediaControlsSource).toContain("Audio Lumi · Nhấn để nghe");
  });

  it("protects accidental library edits with a short undo history and visual color labels", () => {
    expect(mediaControlsSource).toContain("type UndoEntry");
    expect(mediaControlsSource).toContain("offerUndo");
    expect(mediaControlsSource).toContain("undoLastAction");
    expect(mediaControlsSource).toContain("5_000");
    expect(mediaControlsSource).toContain("Hoàn tác");
    expect(mediaControlsSource).toContain("COLOR_LABELS");
    expect(mediaControlsSource).toContain("colorLabel");
    expect(mediaControlsSource).toContain("Nhãn màu");
  });

  it("supports quick filtering by color label and a separate restorable Lumi recording trash", () => {
    expect(mediaControlsSource).toContain("Lọc nhanh bản thu theo nhãn màu");
    expect(mediaControlsSource).toContain("colorFilter === \"none\"");
    expect(mediaControlsSource).toContain("lumi-recording-trash");
    expect(mediaControlsSource).toContain("Thùng rác bản thu Lumi");
    expect(mediaControlsSource).toContain("restoreTrashedVoice");
    expect(mediaControlsSource).toContain("Xóa vĩnh viễn");
  });

  it("supports selecting individual or all trashed Lumi recordings and sorts saved recordings by time", () => {
    expect(mediaControlsSource).toContain("selectedTrashKeys");
    expect(mediaControlsSource).toContain("Chọn tất cả");
    expect(mediaControlsSource).toContain("Khôi phục đã chọn");
    expect(mediaControlsSource).toContain("Xóa vĩnh viễn đã chọn");
    expect(mediaControlsSource).toContain("librarySort");
    expect(mediaControlsSource).toContain("Mới tạo gần nhất");
    expect(mediaControlsSource).toContain("Chỉnh sửa gần nhất");
    expect(mediaControlsSource).toContain("updatedAt");
  });

  it("keeps a compact Pomodoro controller that persists and can be expanded again", () => {
    expect(pomodoroSource).toContain("compactMode");
    expect(pomodoroSource).toContain("Thu nhỏ Pomodoro");
    expect(pomodoroSource).toContain("Mở đầy đủ Pomodoro");
    expect(pomodoroSource).toContain("Pomodoro thu nhỏ");
    expect(pomodoroSource).toContain("Alt + M");
    expect(pomodoroSource).toContain("window.addEventListener(\"keydown\"");
  });

  it("only plays saved Lumi audio and exposes a member-owned personal study-space library", () => {
    expect(studioSource).not.toContain("speechSynthesis");
    expect(studioSource).toContain("Thêm hoặc nghe bản thu Lumi");
    expect(personalStudySpaceSource).toContain("Âm thanh & Chủ đề của tôi");
    expect(personalStudySpaceSource).toContain("Tải tệp MP3/WAV/OGG/M4A");
    expect(personalStudySpaceSource).toContain("preset");
  });

  it("backs up the personal study space without embedding media and rejects unsafe external audio URLs", () => {
    expect(personalStudySpaceSource).toContain("exportPersonalSpace");
    expect(personalStudySpaceSource).toContain("importPersonalSpace");
    expect(personalStudySpaceSource).toContain("const filename");
    expect(personalStudySpaceSource).toContain("safeName");
    expect(personalStudySpaceSource).toContain(".json");
    expect(personalStudySpaceSource).toContain("không sao chép tệp âm thanh");
    expect(personalStudySpaceSource).toContain("isSafeExternalAudioUrl");
    expect(personalStudySpaceSource).toContain('parsed.protocol === "https:"');
  });

  it("applies member-selected audio at Pomodoro milestones and supports night-focus preferences", () => {
    expect(pomodoroSource).toContain("playPersonalCue");
    expect(pomodoroSource).toContain("matchingPersonalAudio");
    expect(pomodoroSource).not.toContain("personalBackgroundRef");
    expect(pomodoroSource).toContain('playPersonalCue("start")');
    expect(pomodoroSource).toContain('playPersonalCue("complete")');
    expect(homeSource).toContain("profile.autoNightMode");
    expect(homeSource).toContain("root.dataset.focusMode");
    expect(cssSource).toContain(':root[data-focus-mode="true"]');
  });

  it("shows mobile-friendly loading states while recording and uploading voice media", () => {
    expect(mediaControlsSource).toContain("LoaderCircle");
    expect(mediaControlsSource).toContain("Đang ghi âm… Nhấn để dừng");
    expect(mediaControlsSource).not.toContain("Đang tải ảnh…");
    expect(mediaControlsSource).toContain("Đang tải bản thu…");
    expect(mediaControlsSource).toContain("aria-live=\"polite\"");
    expect(mediaControlsSource).toContain("disabled={Boolean(busy)}");
  });

  it("supports upload progress, retry, autosaved drafts and first-use onboarding", () => {
    expect(mediaControlsSource).toContain("uploadProgress");
    expect(mediaControlsSource).toContain("Thử lại");
    expect(mediaControlsSource).toContain("companion-media-draft:v1");
    expect(mediaControlsSource).toContain("localStorage.setItem");
    expect(mediaControlsSource).toContain("Bắt đầu với Lumi trong 3 bước");
    expect(mediaControlsSource).toContain("Ghi âm lời động viên bằng micro");
    expect(mediaControlsSource).toContain("Đã hiểu");
  });

  it("offers validated JSON export and merge-or-replace import without embedding media files", () => {
    expect(mediaControlsSource).toContain("exportLibrary");
    expect(mediaControlsSource).toContain("importLibrary");
    expect(mediaControlsSource).toContain("validImportedRecording");
    expect(mediaControlsSource).toContain("lumi-library-backup-");
    expect(mediaControlsSource).toContain("Gộp với thư viện hiện có");
    expect(mediaControlsSource).toContain("Thay thư viện theo cảm xúc");
    expect(mediaControlsSource).toContain("không sao chép tệp media");
    expect(mediaControlsSource).toContain("PersistentCollapsible");
  });

  it("offers per-emotion companion audio and keeps legacy image data hidden", () => {
    expect(homeSource).toContain("EmotionCompanionMediaControls");
    expect(mediaControlsSource).toContain("profile.showMascot === false");
    expect(mediaControlsSource).toContain("profile.showLumi === false");
    expect(mediaControlsSource).toContain("Khu vực này chỉ quản lý bản thu âm thanh");
    expect(mediaControlsSource).toContain("Nhấn để nghe");
    expect(mediaControlsSource).not.toContain("Đổi ảnh");
  });

  it("adds real environment-file upload, voice filtering, and channel playback status to Audio Center", () => {
    expect(audioCenterEnhancementsSource).toContain("Tải âm thanh môi trường thật");
    expect(audioCenterEnhancementsSource).toContain("Thư viện asset đã tải lên");
    expect(audioCenterEnhancementsSource).toContain("Nghe thử");
    expect(audioCenterEnhancementsSource).toContain("Đổi tên");
    expect(audioCenterEnhancementsSource).toContain("deletedAt");
    expect(audioCenterEnhancementsSource).toContain("uploadEnvironment");
    expect(audioCenterEnhancementsSource).toContain("audio/mpeg");
    expect(audioCenterEnhancementsSource).toContain("không tạo âm tổng hợp");
    expect(audioCenterEnhancementsSource).toContain("Lọc thư viện lời thoại");
    expect(audioCenterEnhancementsSource).toContain("voiceEmotion");
    expect(audioCenterEnhancementsSource).toContain("voiceEvent");
    expect(audioCenterEnhancementsSource).toContain("Trạng thái đang phát");
    expect(audioCenterEnhancementsSource).toContain("environment");
    expect(audioCenterEnhancementsSource).toContain("music");
    expect(audioCenterEnhancementsSource).toContain("voice");
    expect(studioSource).toContain("AudioCenterEnhancements");
    expect(studioSource).toContain("setChannelPlaying");
  });

  it("supports a separate audio trash, waveform metadata, duration, groups, and drag ordering", () => {
    expect(audioCenterEnhancementsSource).toContain('storageKey="audio-center-trash"');
    expect(audioCenterEnhancementsSource).toContain("Khôi phục tất cả");
    expect(audioCenterEnhancementsSource).toContain("softDeleteAsset");
    expect(audioCenterEnhancementsSource).toContain("Waveform");
    expect(audioCenterEnhancementsSource).toContain("durationSeconds");
    expect(audioCenterEnhancementsSource).toContain("draggable");
    expect(audioCenterEnhancementsSource).toContain("reorderAssets");
    expect(audioCenterEnhancementsSource).toContain("assignGroup");
    expect(studySource).toContain("personalAudioTrash");
    expect(studySource).toContain("waveform");
    expect(studySource).toContain("sortOrder");
    expect(studySource).toContain("group");
    expect(audioCenterEnhancementsSource).toContain("Xóa vĩnh viễn");
    expect(audioCenterEnhancementsSource).toContain("window.confirm");
    expect(audioCenterEnhancementsSource).toContain("onSeekPlayback");
    expect(audioCenterEnhancementsSource).toContain("currentTime");
    expect(audioCenterEnhancementsSource).toContain("audioGroupPresets");
    expect(audioCenterEnhancementsSource).toContain("saveGroupPreset");
    expect(audioCenterEnhancementsSource).toContain("applyGroupPreset");
    expect(studySource).toContain("AudioGroupPreset");
  });

  it("supports the dedicated interface tone system without confusing it with emotion scenes", () => {
    expect(cssSource).toContain("data-cosmetic-theme");
    expect(cssSource).toContain("data-ambient-scene");
    expect(cssSource).toContain("interface-primary");
    expect(cssSource).toContain("prefers-reduced-motion");
  });

  it("keeps legacy weather images removed while scene tokens and mixer controls remain", () => {
    expect(cssSource).not.toContain("study-scene-morning_f6b8968e.jpg");
    expect(cssSource).not.toContain("study-scene-rain_8224ae90.jpg");
    expect(cssSource).not.toContain("study-scene-snow_7068a43f.jpg");
    expect(cssSource).not.toContain("study-scene-leaves_bb6c6f6c.jpg");
    expect(cssSource).not.toContain("study-scene-storm_0f557d3d.jpg");
    expect(cssSource).toContain("#root > div.min-h-screen::before");
    expect(cssSource).toContain("pointer-events: none");
    expect(studioSource).toContain("ambientSceneVolumes");
    expect(homeSource).toContain("aria-label=\"Âm lượng âm nền theme\"");
    expect(homeSource).toContain("updateThemeAudioVolume");
  });
});
