import { describe, expect, it } from "vitest";
import { emptyAppConfig } from "../../../shared/study";

describe("bề mặt Bảo tàng đã được gỡ", () => {
  it("không tạo thẻ Thành tích hoặc phần thưởng Vòng quay từ cấu hình mặc định", () => {
    const config = emptyAppConfig();
    expect(config.customAchievements).toEqual([]);
    expect(config.wheelRewards).toEqual([]);
    expect(config.wheelTicketsPerAchievement).toBe(0);
  });
});
