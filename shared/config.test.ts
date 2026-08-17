import { describe, expect, it } from "vitest";
import { emptyAppConfig } from "./study";
import { canManageLearningConfig } from "./permissions";

describe("starter achievement and reward configuration", () => {
  it("provides editable starter milestones and wheel rewards without user-earned state", () => {
    const config = emptyAppConfig();

    expect(config.customAchievements.length).toBeGreaterThanOrEqual(3);
    expect(config.customAchievements.every((item) => item.enabled && item.threshold > 0)).toBe(true);
    expect(config.customAchievements.map((item) => item.name).join(" ")).toContain("Mẫu khởi đầu");
    expect(config.wheelRewards.length).toBeGreaterThanOrEqual(3);
    expect(config.wheelRewards.reduce((sum, item) => sum + item.probability, 0)).toBe(100);
    expect(config.wheelRewards.every((item) => item.value >= 0 && item.label.includes("Mẫu khởi đầu"))).toBe(true);
  });

  it("allows only Admin and Founder to manage configuration", () => {
    expect(canManageLearningConfig("Member")).toBe(false);
    expect(canManageLearningConfig("Admin")).toBe(true);
    expect(canManageLearningConfig("Founder")).toBe(true);
  });
});
