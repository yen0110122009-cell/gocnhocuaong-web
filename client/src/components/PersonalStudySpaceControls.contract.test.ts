import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("StudyCorner contracts", () => {
  const controls = readFileSync(resolve(process.cwd(), "client/src/components/PersonalStudySpaceControls.tsx"), "utf8");
  const corner = readFileSync(resolve(process.cwd(), "client/src/components/StudyCorner.tsx"), "utf8");
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

  it("defines an independent first-person desk scene", () => {
    expect(corner).toContain("study-corner-scene");
    expect(corner).toContain("lightMode");
    expect(corner).toContain("lampIntensity");
    expect(corner).toContain("windowOpen");
    expect(corner).toContain("ambientEnabled");
    expect(corner).toContain("localStorage");
  });

  it("routes the single StudyCorner screen without embedding legacy management cards", () => {
    expect(home).toContain('"study-corner"');
    expect(home).toContain("<StudyCorner profile={profile} />");
    expect(home).not.toContain('<section id="personal-learning-corner"');
    expect(home).not.toContain("<PersonalStudySpaceControls");
  });
});
