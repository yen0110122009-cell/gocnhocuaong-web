import { describe, expect, it } from "vitest";
import { emptyAppConfig, purgeLegacyAchievementConfig } from "../../../shared/study";

describe("dữ liệu quản trị Thành tích đã bị loại bỏ", () => {
  it("không cung cấp catalog Thành tích, Danh hiệu hay Cấp độ mặc định", () => {
    const config = purgeLegacyAchievementConfig(emptyAppConfig());
    expect(config.customAchievements).toEqual([]);
    expect(config.achievementOverrides).toEqual([]);
    expect(config.levelDefinitions).toEqual([]);
  });
});
