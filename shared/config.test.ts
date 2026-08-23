import { describe, expect, it } from "vitest";
import { emptyAppConfig } from "./study";
import { canManageLearningConfig } from "./permissions";

describe("cấu hình khởi tạo sau khi bỏ Thành tích", () => {
  it("chỉ giữ Event mẫu Kế hoạch, không seed Thành tích, Danh hiệu hay nguồn thưởng cũ", () => {
    const config = emptyAppConfig();
    expect(config.levelDefinitions).toEqual([]);
    expect(config.customAchievements).toEqual([]);
    expect(config.achievementOverrides).toEqual([]);
    expect(config.collectionConfig?.rewardSources).toEqual([]);
    expect(config.collectionConfig?.events).toHaveLength(1);
  });

  it("chỉ cho Admin và Founder quản lý cấu hình", () => {
    expect(canManageLearningConfig("Member")).toBe(false);
    expect(canManageLearningConfig("Admin")).toBe(true);
    expect(canManageLearningConfig("Founder")).toBe(true);
  });
});
