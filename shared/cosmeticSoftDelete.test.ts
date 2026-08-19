import { describe, expect, it } from "vitest";
import { emptyAppConfig, emptyProfile } from "./study";
import { purchaseCollectionItem } from "./fragmentSystem";
import { permanentlyDeleteConfigItem, restoreConfigItem, softDeleteConfigItem } from "./softDelete";

describe("cosmetic shop and soft-delete contracts", () => {
  it("seeds purchasable themes and animated backgrounds with explicit purpose", () => {
    const config = emptyAppConfig();
    const items = config.collectionConfig?.shopItems ?? [];
    expect(items.filter((item) => item.cosmeticType === "theme")).toHaveLength(4);
    expect(items.filter((item) => item.cosmeticType === "background")).toHaveLength(4);
    expect(items.every((item) => item.cosmeticType ? item.description.length > 10 && item.cosmeticId : true)).toBe(true);
  });

  it("uses the existing collection ledger and records ownership before applying cosmetic", () => {
    const config = emptyAppConfig();
    const item = config.collectionConfig!.shopItems.find((entry) => entry.id === "theme-forest-green")!;
    const profile = { ...emptyProfile(), collectionTickets: item.price };
    const result = purchaseCollectionItem(config, profile, item);
    expect(result.purchased).toBe(true);
    expect(result.profile.collectionTickets).toBe(0);
    expect(result.profile.collectionInventory).toContain(item.id);
  });

  it("soft-deletes and restores custom achievements, rewards and shop items without losing records", () => {
    const config = emptyAppConfig();
    const achievementId = config.customAchievements[0].id;
    const shopId = config.collectionConfig!.shopItems[0].id;
    const rewardId = "test-admin-reward";
    const withReward = { ...config, collectionConfig: { ...config.collectionConfig!, adminRewards: [{ id: rewardId, name: "Test reward", type: "ticket" as const, value: 1, rarity: "common" as const, icon: "🎟️", description: "Regression only", condition: "Test", active: true, createdAt: "2026-01-01", updatedAt: "2026-01-01" }] } };
    const trashed = softDeleteConfigItem(softDeleteConfigItem(softDeleteConfigItem(withReward, "achievement", achievementId), "shopItem", shopId), "reward", rewardId);
    expect(trashed.customAchievements.find((item) => item.id === achievementId)?.deletedAt).toBeTruthy();
    expect(trashed.collectionConfig!.shopItems.find((item) => item.id === shopId)?.deletedAt).toBeTruthy();
    expect(trashed.collectionConfig!.adminRewards?.find((item) => item.id === rewardId)?.deletedAt).toBeTruthy();
    const restored = restoreConfigItem(restoreConfigItem(restoreConfigItem(trashed, "achievement", achievementId), "shopItem", shopId), "reward", rewardId);
    expect(restored.customAchievements.find((item) => item.id === achievementId)?.deletedAt).toBeUndefined();
    expect(restored.collectionConfig!.shopItems.find((item) => item.id === shopId)?.deletedAt).toBeUndefined();
    expect(restored.collectionConfig!.adminRewards?.find((item) => item.id === rewardId)?.deletedAt).toBeUndefined();
    expect(permanentlyDeleteConfigItem(restored, "shopItem", shopId).collectionConfig!.shopItems.some((item) => item.id === shopId)).toBe(false);
    expect(permanentlyDeleteConfigItem(restored, "reward", rewardId).collectionConfig!.adminRewards?.some((item) => item.id === rewardId)).toBe(false);
  });
});
