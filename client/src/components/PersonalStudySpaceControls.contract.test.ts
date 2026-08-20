import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("StudyCorner contracts", () => {
  const controls = readFileSync(resolve(process.cwd(), "client/src/components/PersonalStudySpaceControls.tsx"), "utf8");
  const corner = readFileSync(resolve(process.cwd(), "client/src/components/StudyCorner.tsx"), "utf8");
  const study = readFileSync(resolve(process.cwd(), "shared/study.ts"), "utf8");
  const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("keeps quick audio search, labels, trash and weekly preset history in the existing audio manager", () => {
    expect(controls).toContain("librarySearch");
    expect(controls).toContain("selectedLabel");
    expect(controls).toContain("asset.tags");
    expect(controls).toContain("visibleAssets");
    expect(controls).toContain("personalStudyPresetSchedule");
    expect(controls).toContain("personalStudyPresetHistory");
    expect(controls).toContain("restorePresetHistory");
  });

  it("defines an independent first-person desk scene with persistent controls", () => {
    expect(corner).toContain("study-corner-scene");
    expect(corner).toContain("lightMode");
    expect(corner).toContain("lampIntensity");
    expect(corner).toContain("windowOpen");
    expect(corner).toContain("ambientEnabled");
    expect(corner).toContain("localStorage");
    expect(corner).toContain("EnvironmentPanel");
    expect(corner).toContain("onProfile");
  });

  it("covers the adaptive environment matrix without assigning emotion automatically", () => {
    expect(study).toContain("StudyCornerSeason");
    expect(study).toContain("StudyCornerWeather");
    expect(study).toContain("StudyCornerAdaptiveEmotion");
    expect(study).toContain("DEFAULT_STUDY_CORNER_ENVIRONMENT");
    expect(corner).toContain("mode === \"auto\"");
    expect(corner).toContain("mode === \"manual\"");
    expect(corner).toContain("Không tự kết luận cảm xúc");
    expect(corner).toContain("Weather");
    expect(corner).toContain("soundVolume");
    expect(corner).toContain("reduceMotion");
  });

  it("provides real-audio-only behavior and explicit fallback messaging", () => {
    expect(corner).toContain("category === \"background\"");
    expect(corner).toContain("Chưa có asset thật; không phát âm thanh giả.");
    expect(corner).toContain("Audio chỉ bắt đầu sau user gesture");
    expect(corner).toContain("onError");
  });

  it("keeps StudyCorner out of Home and exposes one Audio Center on the dashboard", () => {
    expect(home).not.toContain('"study-corner"');
    expect(home).not.toContain("<StudyCorner");
    expect(home).toContain('id="home-audio-center"');
    expect(home).toContain("<ExperienceStudio");
    expect(home).not.toContain('<section id="personal-learning-corner"');
    expect(home).not.toContain("<PersonalStudySpaceControls");
  });

  it("keeps Audio Center volumes separated by source and uses clean assets only", () => {
    const audio = readFileSync(resolve(process.cwd(), "client/src/components/ExperienceStudio.tsx"), "utf8");
    expect(study).toContain("memberVoice");
    expect(study).toContain("AudioMixerSettings");
    expect(audio).toContain("AudioChannelVolumes");
    expect(audio).toContain("updateAudioChannelVolume");
    expect(audio).toContain("playCleanAmbientAsset");
    expect(audio).toContain("item.category === \"background\"");
    expect(audio).toContain("preferredMemberVoice");
    expect(audio).toContain("const fade =");
  });
});
