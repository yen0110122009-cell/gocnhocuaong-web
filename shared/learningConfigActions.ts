import type { AppConfig } from "./study";

export type CustomAchievementInput = Omit<AppConfig["customAchievements"][number], "id">;
export type WheelRewardInput = Omit<AppConfig["wheelRewards"][number], "id">;

export function addCustomAchievement(config: AppConfig, input: CustomAchievementInput, id: string): AppConfig {
  return { ...config, customAchievements: [...config.customAchievements, { ...input, id }] };
}

export function updateCustomAchievement(config: AppConfig, id: string, patch: Partial<CustomAchievementInput>): AppConfig {
  return { ...config, customAchievements: config.customAchievements.map((item) => item.id === id ? { ...item, ...patch } : item) };
}

export function toggleCustomAchievement(config: AppConfig, id: string): AppConfig {
  return updateCustomAchievement(config, id, { enabled: !(config.customAchievements.find((item) => item.id === id)?.enabled ?? true) });
}

export function deleteCustomAchievement(config: AppConfig, id: string): AppConfig {
  return { ...config, customAchievements: config.customAchievements.filter((item) => item.id !== id) };
}

export function addWheelReward(config: AppConfig, input: WheelRewardInput, id: string): AppConfig {
  return { ...config, wheelRewards: [...config.wheelRewards, { ...input, id }] };
}

export function updateWheelReward(config: AppConfig, id: string, patch: Partial<WheelRewardInput>): AppConfig {
  return { ...config, wheelRewards: config.wheelRewards.map((item) => item.id === id ? { ...item, ...patch } : item) };
}

export function toggleWheelReward(config: AppConfig, id: string): AppConfig {
  return updateWheelReward(config, id, { enabled: !(config.wheelRewards.find((item) => item.id === id)?.enabled ?? true) });
}

export function deleteWheelReward(config: AppConfig, id: string): AppConfig {
  return { ...config, wheelRewards: config.wheelRewards.filter((item) => item.id !== id) };
}
