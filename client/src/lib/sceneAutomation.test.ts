import { describe, expect, it } from "vitest";
import { fixedHolidayScene, hourIsInsideRule, resolveAutomatedScene } from "./sceneAutomation";

const enabled = {
  enabled: true,
  applyFixedHolidays: false,
  timeRules: [
    { id: "morning", label: "Sáng", startHour: 6, endHour: 18, scene: "morning" as const },
    { id: "night", label: "Đêm", startHour: 18, endHour: 6, scene: "halloween" as const },
  ],
};

describe("lịch cảnh cá nhân tại thiết bị", () => {
  it("phân giải đúng ngày lễ cố định", () => {
    expect(fixedHolidayScene(new Date(2026, 9, 31, 10))).toBe("halloween");
    expect(fixedHolidayScene(new Date(2026, 3, 30, 10))).toBe("summer");
    expect(fixedHolidayScene(new Date(2026, 8, 2, 10))).toBe("tet");
    expect(fixedHolidayScene(new Date(2026, 2, 3, 10))).toBeNull();
  });

  it("xử lý mốc giờ thông thường và rule qua nửa đêm", () => {
    expect(hourIsInsideRule(9, 6, 18)).toBe(true);
    expect(hourIsInsideRule(19, 6, 18)).toBe(false);
    expect(hourIsInsideRule(22, 18, 6)).toBe(true);
    expect(hourIsInsideRule(3, 18, 6)).toBe(true);
    expect(hourIsInsideRule(10, 18, 6)).toBe(false);
  });

  it("ưu tiên ngày lễ khi bật và chỉ đổi khi người dùng đã bật lịch", () => {
    expect(resolveAutomatedScene({ ...enabled, applyFixedHolidays: true }, new Date(2026, 9, 31, 10))).toBe("halloween");
    expect(resolveAutomatedScene(enabled, new Date(2026, 4, 6, 7))).toBe("morning");
    expect(resolveAutomatedScene({ ...enabled, enabled: false }, new Date(2026, 4, 6, 7))).toBeNull();
  });
});
