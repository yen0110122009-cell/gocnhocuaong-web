import type { AdminReward, AppConfig, CollectionShopItem, CustomAchievement } from "./study";

export type SoftDeleteKind = "achievement" | "title" | "reward" | "shopItem";
const FIELD_BY_KIND: Record<SoftDeleteKind, "deletedAchievementIds" | "deletedTitleIds" | "deletedRewardIds" | "deletedShopItemIds"> = { achievement: "deletedAchievementIds", title: "deletedTitleIds", reward: "deletedRewardIds", shopItem: "deletedShopItemIds" };
const keyFor = (kind: SoftDeleteKind) => FIELD_BY_KIND[kind];

export function softDeleteConfigItem(config: AppConfig, kind: SoftDeleteKind, id: string, at = new Date().toISOString()): AppConfig {
  if (!id.trim()) return config;
  if (kind === "achievement") return { ...config, customAchievements: config.customAchievements.map((item) => item.id === id ? { ...item, deletedAt: at, enabled: false } : item), deletedAchievementIds: Array.from(new Set([...(config.deletedAchievementIds ?? []), id])) };
  if (kind === "shopItem") return { ...config, collectionConfig: config.collectionConfig ? { ...config.collectionConfig, shopItems: config.collectionConfig.shopItems.map((item) => item.id === id ? { ...item, deletedAt: at, enabled: false } : item) } : config.collectionConfig, deletedShopItemIds: Array.from(new Set([...(config.deletedShopItemIds ?? []), id])) };
  if (kind === "reward") return { ...config, collectionConfig: config.collectionConfig ? { ...config.collectionConfig, adminRewards: (config.collectionConfig.adminRewards ?? []).map((item) => item.id === id ? { ...item, deletedAt: at, active: false } : item) } : config.collectionConfig, deletedRewardIds: Array.from(new Set([...(config.deletedRewardIds ?? []), id])) };
  return { ...config, deletedTitleIds: Array.from(new Set([...(config.deletedTitleIds ?? []), id])) };
}

export function restoreConfigItem(config: AppConfig, kind: SoftDeleteKind, id: string): AppConfig {
  const key = keyFor(kind);
  const ids = (config[key] ?? []).filter((itemId) => itemId !== id);
  if (kind === "achievement") return { ...config, customAchievements: config.customAchievements.map((item) => item.id === id ? { ...item, deletedAt: undefined, enabled: true } : item), [key]: ids };
  if (kind === "shopItem") return { ...config, collectionConfig: config.collectionConfig ? { ...config.collectionConfig, shopItems: config.collectionConfig.shopItems.map((item) => item.id === id ? { ...item, deletedAt: undefined, enabled: true } : item) } : config.collectionConfig, [key]: ids };
  if (kind === "reward") return { ...config, collectionConfig: config.collectionConfig ? { ...config.collectionConfig, adminRewards: (config.collectionConfig.adminRewards ?? []).map((item) => item.id === id ? { ...item, deletedAt: undefined, active: true } : item) } : config.collectionConfig, [key]: ids };
  return { ...config, [key]: ids };
}

export function permanentlyDeleteConfigItem(config: AppConfig, kind: SoftDeleteKind, id: string): AppConfig {
  const restored = restoreConfigItem(config, kind, id);
  if (kind === "achievement") return { ...restored, customAchievements: restored.customAchievements.filter((item) => item.id !== id) };
  if (kind === "shopItem") return { ...restored, collectionConfig: restored.collectionConfig ? { ...restored.collectionConfig, shopItems: restored.collectionConfig.shopItems.filter((item) => item.id !== id) } : restored.collectionConfig };
  if (kind === "reward") return { ...restored, collectionConfig: restored.collectionConfig ? { ...restored.collectionConfig, adminRewards: (restored.collectionConfig.adminRewards ?? []).filter((item) => item.id !== id) } : restored.collectionConfig };
  return restored;
}

export function isSoftDeleted(config: AppConfig, kind: SoftDeleteKind, id: string) { return (config[keyFor(kind)] ?? []).includes(id); }

export type SoftDeleteEntity = CustomAchievement | CollectionShopItem | AdminReward;
