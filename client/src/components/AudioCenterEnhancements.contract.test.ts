import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const componentSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/AudioCenterEnhancements.tsx"), "utf8");
const homeSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const experienceStudioSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/ExperienceStudio.tsx"), "utf8");

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

  it("renders an accessible skeleton while the Audio Center lazy module loads", () => {
    expect(homeSource).toContain("AudioCenterLoadingSkeleton");
    expect(homeSource).toContain('aria-busy="true"');
    expect(homeSource).toContain("animate-pulse");
    expect(homeSource).toContain("<Suspense fallback={<AudioCenterLoadingSkeleton />}");
  });
});
