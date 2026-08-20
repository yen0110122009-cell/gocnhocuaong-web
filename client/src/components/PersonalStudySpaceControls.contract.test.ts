import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Personal Learning Corner contracts", () => {
  const controls = readFileSync(resolve(process.cwd(), "client/src/components/PersonalStudySpaceControls.tsx"), "utf8");
  const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("exposes quick audio search and editable labels", () => {
    expect(controls).toContain("librarySearch");
    expect(controls).toContain("selectedLabel");
    expect(controls).toContain("asset.tags");
    expect(controls).toContain("visibleAssets");
  });

  it("stores weekly preset automation and restore history", () => {
    expect(controls).toContain("personalStudyPresetSchedule");
    expect(controls).toContain("personalStudyPresetHistory");
    expect(controls).toContain("updatePresetSchedule");
    expect(controls).toContain("restorePresetHistory");
    expect(controls).toContain("tự động áp dụng preset");
  });

  it("keeps the website summary and desk learning corner on the dashboard", () => {
    expect(home).toContain("Tóm tắt sơ qua về web");
    expect(home).toContain("personal-learning-corner");
    expect(home).toContain("Bàn học nhỏ, hành trình lớn");
    expect(home).toContain("PersonalStudySpaceControls");
  });
});
