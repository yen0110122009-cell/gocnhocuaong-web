import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { emotionThemes, emotionFromCommand } from "../lib/emotionThemes";

const studioSource = await import.meta.glob("./ExperienceStudio.tsx", { query: "?raw", import: "default", eager: true })["./ExperienceStudio.tsx"] as string;
const mediaControlsSource = await import.meta.glob("./EmotionCompanionMediaControls.tsx", { query: "?raw", import: "default", eager: true })["./EmotionCompanionMediaControls.tsx"] as string;
const homeSource = await import.meta.glob("../pages/Home.tsx", { query: "?raw", import: "default", eager: true })["../pages/Home.tsx"] as string;
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

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
    expect(studioSource).toContain("OngLearnerAvatar");
    expect(studioSource).toContain("getDefaultLumiImage");
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

  it("shows Lumi as a companion with an image, a direct listen control and environmental scenes", () => {
    expect(studioSource).toContain("Lumi đang ở đây");
    expect(studioSource).toContain("Nghe lời thoại Lumi");
    expect(studioSource).toContain("configuredLumiImage");
    expect(studioSource).toContain("ambientScene");
    expect(studioSource).toContain("Âm thanh và cảnh nền");
    expect(studioSource).toContain("profile?.defaultAmbientScene");
    expect(studioSource).toContain("defaultAmbientScene: ambientScene");
  });

  it("keeps the original Lumi image for comfort copy and shows the paired image of the selected voice", () => {
    expect(studioSource).toContain("CLASSIC_LUMI_IMAGE");
    expect(studioSource).toContain("voiceLinkedLumiImage");
    expect(studioSource).toContain("Ảnh Lumi gắn với giọng đang chọn");
  });

  it("manages saved Lumi recordings as a visual image-voice grid with direct preview and per-recording image replacement", () => {
    expect(mediaControlsSource).toContain("Bộ sưu tập ảnh–giọng Lumi");
    expect(mediaControlsSource).toContain("sm:grid-cols-2 xl:grid-cols-3");
    expect(mediaControlsSource).toContain("uploadRecordingImage");
    expect(mediaControlsSource).toContain("updateRecordingImage");
    expect(mediaControlsSource).toContain("Nghe thử");
    expect(mediaControlsSource).toContain("ImagePlus");
  });

  it("protects the classic comfort image and provides reorder, filter, and duplicate controls for saved pairs", () => {
    expect(studioSource).toContain("const voiceLinkedLumiImage = CLASSIC_LUMI_IMAGE");
    expect(mediaControlsSource).toContain("reorderWithinEmotion");
    expect(mediaControlsSource).toContain("draggable");
    expect(mediaControlsSource).toContain("Tìm tên bản thu hoặc ảnh");
    expect(mediaControlsSource).toContain("Lọc bản thu theo cảm xúc");
    expect(mediaControlsSource).toContain("Lọc bản thu theo ảnh đại diện");
    expect(mediaControlsSource).toContain("duplicateVoice");
    expect(mediaControlsSource).toContain("Nhân bản");
    expect(mediaControlsSource).toContain("Ảnh Lumi cũ");
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

  it("offers per-emotion companion media chosen by the learner and honors image visibility settings", () => {
    expect(studioSource).toContain("EmotionCompanionMediaControls");
    expect(studioSource).toContain("companionMedia?.mascotImageUrl");
    expect(studioSource).toContain("companionMedia?.lumiImageUrl");
    expect(studioSource).toContain("profile?.showMascot !== false");
    expect(studioSource).toContain("profile?.showLumi !== false");
  });

  it("does not retain purchasable cosmetic theme selectors after switching to emotion-based colors", () => {
    expect(cssSource).not.toContain("data-cosmetic-theme");
    expect(cssSource).not.toContain("data-cosmetic-background");
  });
});
