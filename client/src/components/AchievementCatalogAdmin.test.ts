import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { emptyAppConfig, emptyProfile, generateAchievements, allAchievementsWithProgress } from "../../../shared/study";

describe("AchievementCatalogAdmin contract", () => {
  it("keeps the public catalog at 900 items with 400 title milestones", () => {
    const catalog = allAchievementsWithProgress(emptyProfile(), emptyAppConfig()).filter((item) => item.achievementCode.startsWith("ACH-"));
    expect(generateAchievements()).toHaveLength(900);
    expect(catalog).toHaveLength(900);
    expect(catalog.filter((item) => item.title).length).toBe(400);
    expect(catalog.filter((item) => item.level === 9)).toHaveLength(100);
  });

  it("contains the required admin table controls and transparent detail fields", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/AchievementCatalogAdmin.tsx"), "utf8");
    for (const label of ["Tìm kiếm thành tích hoặc danh hiệu", "Lọc cấp độ", "Lọc nhóm", "Lọc trạng thái", "Bảng riêng 400 Danh hiệu", "Điều kiện & tiến độ", "Ý nghĩa / cảm hứng", "Phần thưởng"]) {
      expect(source).toContain(label);
    }
  });
});
