import { describe, expect, it } from "vitest";
import { emptyAppConfig, emptyProfile, purgeLegacyAchievementConfig } from "./study";

describe("cấu hình sau khi dọn dữ liệu legacy", () => {
  it("giữ cài đặt giao diện và Lumi không phụ thuộc catalog Thành tích", () => {
    expect(emptyAppConfig().collectionConfig).toBeDefined();
    expect(emptyProfile().emotionTheme).toBeDefined();
  });

  it("xóa các bản ghi Thành tích/Danh hiệu cũ nhưng giữ Event Kế hoạch", () => {
    const config = purgeLegacyAchievementConfig(emptyAppConfig());
    expect(config.customAchievements).toEqual([]);
    expect(config.deletedAchievementIds).toEqual([]);
    expect(config.deletedTitleIds).toEqual([]);
    expect(config.collectionConfig?.events).toHaveLength(1);
  });
});
