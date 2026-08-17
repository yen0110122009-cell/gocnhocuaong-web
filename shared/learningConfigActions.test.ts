import { describe, expect, it } from "vitest";
import { emptyAppConfig } from "./study";
import { addCustomAchievement, addWheelReward, deleteCustomAchievement, deleteWheelReward, toggleCustomAchievement, toggleWheelReward, updateCustomAchievement, updateWheelReward } from "./learningConfigActions";

describe("learning configuration mutations", () => {
  it("creates, edits, toggles and deletes custom achievements", () => {
    const base = emptyAppConfig();
    const achievement = { name: "QA mốc", description: "Học 10 thẻ", metric: "learnedCards" as const, threshold: 10, rewardXp: 20, rewardFragments: 1, title: "Người bền bỉ", enabled: true };
    const added = addCustomAchievement(base, achievement, "qa-achievement");
    expect(added.customAchievements).toHaveLength(base.customAchievements.length + 1);
    const edited = updateCustomAchievement(added, "qa-achievement", { threshold: 20, title: "Người bền bỉ cấp 2" });
    const editedItem = edited.customAchievements.find((item) => item.id === "qa-achievement");
    expect(editedItem?.threshold).toBe(20);
    expect(editedItem?.title).toBe("Người bền bỉ cấp 2");
    expect(toggleCustomAchievement(edited, "qa-achievement").customAchievements.find((item) => item.id === "qa-achievement")?.enabled).toBe(false);
    expect(deleteCustomAchievement(edited, "qa-achievement").customAchievements).toHaveLength(base.customAchievements.length);
  });

  it("creates, edits, toggles and deletes wheel rewards", () => {
    const base = emptyAppConfig();
    const reward = { label: "20 XP", kind: "xp" as const, value: 20, probability: 100, color: "#f4b942", enabled: true };
    const added = addWheelReward(base, reward, "qa-reward");
    expect(added.wheelRewards).toHaveLength(base.wheelRewards.length + 1);
    const edited = updateWheelReward(added, "qa-reward", { value: 40, probability: 80 });
    expect(edited.wheelRewards.find((item) => item.id === "qa-reward")?.value).toBe(40);
    expect(toggleWheelReward(edited, "qa-reward").wheelRewards.find((item) => item.id === "qa-reward")?.enabled).toBe(false);
    expect(deleteWheelReward(edited, "qa-reward").wheelRewards).toHaveLength(base.wheelRewards.length);
  });
});
