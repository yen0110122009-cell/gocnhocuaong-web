import { describe, expect, it } from "vitest";
import { emptyAppConfig, emptyProfile } from "./study";
import { permanentlyDeleteConfigItem, restoreConfigItem, softDeleteConfigItem } from "./softDelete";

describe("collection configuration and soft-delete contracts", () => {
  it("does not seed purchasable themes or animated backgrounds because color follows emotion", () => {
    const config = emptyAppConfig();
    const items = config.collectionConfig?.shopItems ?? [];
    expect(items.filter((item) => item.cosmeticType === "theme" || item.cosmeticType === "background")).toHaveLength(0);
  });

  it("keeps the collection configuration ready for non-cosmetic learning rewards", () => {
    const config = emptyAppConfig();
    expect(config.collectionConfig).toBeDefined();
    expect(emptyProfile().emotionTheme).toBeDefined();
  });

  it("soft-deletes and restores custom achievements and admin rewards without losing records", () => {
    const config = emptyAppConfig();
    const achievementId = config.customAchievements[0].id;
    const rewardId = "test-admin-reward";
    const withReward = { ...config, collectionConfig: { ...config.collectionConfig!, adminRewards: [{ id: rewardId, name: "Test reward", type: "ticket" as const, value: 1, rarity: "common" as const, icon: "🎟️", description: "Regression only", condition: "Test", active: true, createdAt: "2026-01-01", updatedAt: "2026-01-01" }] } };
    const trashed = softDeleteConfigItem(softDeleteConfigItem(withReward, "achievement", achievementId), "reward", rewardId);
    expect(trashed.customAchievements.find((item) => item.id === achievementId)?.deletedAt).toBeTruthy();
    expect(trashed.collectionConfig!.adminRewards?.find((item) => item.id === rewardId)?.deletedAt).toBeTruthy();
    const restored = restoreConfigItem(restoreConfigItem(trashed, "achievement", achievementId), "reward", rewardId);
    expect(restored.customAchievements.find((item) => item.id === achievementId)?.deletedAt).toBeUndefined();
    expect(restored.collectionConfig!.adminRewards?.find((item) => item.id === rewardId)?.deletedAt).toBeUndefined();
    expect(permanentlyDeleteConfigItem(restored, "reward", rewardId).collectionConfig!.adminRewards?.some((item) => item.id === rewardId)).toBe(false);
  });
});
