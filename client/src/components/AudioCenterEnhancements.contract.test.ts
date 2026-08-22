import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const componentSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/AudioCenterEnhancements.tsx"), "utf8");
const homeSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const experienceStudioSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/ExperienceStudio.tsx"), "utf8");
const defaultAmbientSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/lib/defaultAmbient.ts"), "utf8");
const pomodoroSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");

describe("Audio Center UX contracts", () => {
  it("provides advanced library search and filters", () => {
    expect(componentSource).toContain("audioSearch");
    expect(componentSource).toContain("audioSource");
    expect(componentSource).toContain("audioStatus");
    expect(componentSource).toContain("audioTag");
    expect(componentSource).toContain("audioTarget");
    expect(componentSource).toContain("Tìm kiếm nâng cao thư viện audio");
    expect(componentSource).toContain("libraryAssets");
  });

  it("confirms permanent deletion through a toast and access semantics", () => {
    expect(componentSource).toContain('toast.success(`Đã xóa vĩnh viễn');
    expect(componentSource).toContain("Tệp không còn truy cập được");
    expect(componentSource).toContain("storage contract");
  });

  it("supports direct waveform preview, multi-select and bulk management", () => {
    expect(componentSource).toContain("onPlay");
    expect(componentSource).toContain("selectedAssetIds");
    expect(componentSource).toContain("bulkMoveAssets");
    expect(componentSource).toContain("bulkTagAssets");
    expect(componentSource).toContain("bulkSoftDeleteAssets");
    expect(componentSource).toContain("Chọn tất cả tệp đang hiển thị");
  });

  it("suggests tags for newly uploaded audio", () => {
    expect(componentSource).toContain("suggestAudioTags");
    expect(componentSource).toContain("nhãn gợi ý");
    expect(componentSource).toContain("suggestedTags");
  });

  it("exposes four built-in environment choices and labels them clearly", () => {
    expect(componentSource).toContain('{ id: "morning", label: "Buổi sáng" }');
    expect(componentSource).toContain('{ id: "storm", label: "Bão nhẹ" }');
    expect(componentSource).toContain("DEFAULT_AMBIENT_MORNING_ASSET");
    expect(componentSource).toContain("DEFAULT_AMBIENT_STORM_ASSET");
    expect(componentSource).toContain("environmentTargetLabel");
  });

  it("retries rate-limited health checks with bounded backoff and explains 429", () => {
    expect(componentSource).toContain("maxAttempts = 3");
    expect(componentSource).toContain("backoffMs = [500, 1200, 2500]");
    expect(componentSource).toContain('response.status === 429');
    expect(componentSource).toContain("Storage đang bận");
    expect(componentSource).toContain("Hãy chờ một chút rồi thử lại");
  });

  it("persists the last rate-limit retry and skips immediate duplicate checks", () => {
    expect(componentSource).toContain('study-empire:ambient-health-last-retry-v1');
    expect(componentSource).toContain("healthRetryCooldownMs = 60_000");
    expect(componentSource).toContain("localStorage.setItem(healthRetryStorageKey");
    expect(componentSource).toContain("Hệ thống sẽ kiểm tra lại sau một chút");
  });

  it("offers the combined Pomodoro ambient preset", () => {
    expect(componentSource).toContain("DEFAULT_POMODORO_AMBIENT_PRESET");
    expect(componentSource).toContain("Áp dụng preset");
    expect(experienceStudioSource).toContain("ambientAdditionalTracksRef");
    expect(experienceStudioSource).toContain("secondaryTracks");
  });

  it("attempts continuous ambient autoplay with a gesture fallback", () => {
    expect(experienceStudioSource).toContain("ambientTrackRef");
    expect(experienceStudioSource).toContain("pointerdown");
    expect(experienceStudioSource).toContain("touchstart");
    expect(experienceStudioSource).toContain("autoplay");
  });

  it("supports ambient volume and mute controls", () => {
    expect(experienceStudioSource).toContain("audioChannelVolumes.environment");
    expect(experienceStudioSource).toContain("toggleAmbientMute");
    expect(experienceStudioSource).toContain("ambientMuted");
    expect(experienceStudioSource).toContain("Âm lượng âm nền");
  });

  it("shows current volume in playback status and offers type-aware speed presets", () => {
    expect(componentSource).toContain("Âm lượng: ${volume}%");
    expect(componentSource).toContain("defaultPreviewRate");
    expect(componentSource).toContain("Tự động theo loại tệp");
    expect(experienceStudioSource).toContain("volume: Math.round(environment.volume * 100)");
  });

  it("supports waveform preview playback rates", () => {
    expect(componentSource).toContain("previewRate");
    expect(componentSource).toContain('value="0.5"');
    expect(componentSource).toContain('value="1.5"');
    expect(componentSource).toContain('value="2"');
    expect(componentSource).toContain("playbackRate");
  });

  it("supports user-customized speed presets per audio category", () => {
    expect(componentSource).toContain("audioPreviewSpeedPresets");
    expect(componentSource).toContain("speedPresetCategory");
    expect(componentSource).toContain("speedPresetDraft");
    expect(componentSource).toContain("Lưu preset");
    expect(componentSource).toContain("Khôi phục");
    expect(componentSource).toContain("changeSpeedPresetCategory");
  });

  it("renders an accessible volume meter beside every playback channel", () => {
    expect(componentSource).toContain('role="meter"');
    expect(componentSource).toContain("Mức âm lượng ${label}");
    expect(componentSource).toContain("aria-valuenow");
    expect(componentSource).toContain("style={{ width: `${status.active ? volume : 0}%` }}");
  });

  it("renders an accessible skeleton while the Audio Center lazy module loads", () => {
    expect(homeSource).toContain("AudioCenterLoadingSkeleton");
    expect(homeSource).toContain('aria-busy="true"');
    expect(homeSource).toContain("animate-pulse");
    expect(homeSource).toContain("<Suspense fallback={<AudioCenterLoadingSkeleton />}");
  });

  it("isolates Audio Center interactions and limits high-frequency playback renders", () => {
    expect(componentSource).toContain("onPointerDownCapture={(event) => event.stopPropagation()}");
    expect(componentSource).toContain("onClickCapture={(event) => event.stopPropagation()}");
    expect(experienceStudioSource).toContain("lastPlaybackUpdateRef");
    expect(experienceStudioSource).toContain("now - lastPlaybackUpdateRef.current >= 250");
    expect(experienceStudioSource).toContain("playAudioPreview");
    expect(experienceStudioSource).toContain("stopAudioPreview");
  });

  it("keeps the full Lumi emotion space independently collapsible", () => {
    expect(experienceStudioSource).toContain('storageKey="experience-lumi-emotion-space"');
    expect(experienceStudioSource).toContain('title="Không gian cảm xúc của Lumi" defaultOpen');
    const collapsibleSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/PersistentCollapsible.tsx"), "utf8");
    expect(collapsibleSource).toContain('{open ? "Thu gọn" : "Mở rộng"}');
  });

  it("keeps favorite themes unbounded and wires only explicitly provided theme audio", () => {
    expect(experienceStudioSource).toContain("favoriteAmbientScenes");
    expect(experienceStudioSource).toContain("toggleFavoriteAmbientScene");
    expect(experienceStudioSource).toContain("Giao diện yêu thích");
    expect(defaultAmbientSource).toContain("PROVIDED_THEME_AMBIENT_ASSETS");
    expect(experienceStudioSource).toContain("toggleAmbient");
    expect(pomodoroSource).toContain("themeAmbientEnabled");
    expect(pomodoroSource).toContain("themeAmbientVolume");
  });

  it("applies a favorite theme from the Lumi panel and preserves collapse state", () => {
    expect(experienceStudioSource).toContain('storageKey="experience-lumi-favorite-scenes"');
    expect(experienceStudioSource).toContain('title="Giao diện yêu thích"');
    expect(experienceStudioSource).toContain("onClick={() => setScene(scene.id)}");
    expect(experienceStudioSource).toContain("aria-label={`${isFavorite ? \"Bỏ\" : \"Thêm\"} yêu thích ${scene.label}`}");
  });

  it("uses only supplied theme audio and exposes preview/toggle/volume controls", () => {
    expect(defaultAmbientSource).toContain("tet:");
    expect(defaultAmbientSource).toContain("space:");
    expect(experienceStudioSource).toContain("providedThemeAudio");
    expect(componentSource).toContain("Nghe thử");
    expect(pomodoroSource).toContain("themeAmbientEnabled");
    expect(pomodoroSource).toContain("themeAmbientVolume");
    expect(pomodoroSource).toContain("pomodoroBackground");
  });
});
