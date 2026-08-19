import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { emptyProfile, normalizeProfile } from "./study";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("module audit and distraction-control contracts", () => {
  it("persists independent animation, popup and sound preferences with safe defaults", () => {
    const profile = emptyProfile();
    expect(profile).toMatchObject({ animationsEnabled: true, popupsEnabled: true, soundEnabled: true });
    expect(normalizeProfile({ ...profile, animationsEnabled: false })).toMatchObject({ animationsEnabled: false, popupsEnabled: true, soundEnabled: true });
  });

  it("keeps a visible 15-module matrix with every required status vocabulary", () => {
    const matrix = source("client/src/components/ModuleAuditMatrix.tsx");
    expect(matrix).toContain('"Đạt" | "Chưa đạt" | "Thiếu" | "Sai"');
    expect((matrix.match(/\{ module: "/g) ?? []).length).toBe(15);
    ["Giao diện", "Mascot", "Pomodoro", "Audio Center", "Achievement", "Khoảnh khắc", "Hiểu tận gốc", "Làm đề giấy", "Thùng rác", "Sửa / xóa / khôi phục", "Responsive", "Lưu dữ liệu", "Animation", "Popup", "Trạng thái mascot"].forEach((label) => expect(matrix).toContain(label));
  });

  it("provides independent controls and app-wide data attributes for distraction reduction", () => {
    const studio = source("client/src/components/ExperienceStudio.tsx");
    const home = source("client/src/pages/Home.tsx");
    expect(studio).toContain("animationsEnabled");
    expect(studio).toContain("popupsEnabled");
    expect(studio).toContain("soundEnabled");
    expect(home).toContain("dataset.animations");
    expect(home).toContain("dataset.popups");
    expect(home).toContain("dataset.sound");
  });
});
