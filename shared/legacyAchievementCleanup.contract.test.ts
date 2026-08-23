import { describe, expect, it } from "vitest";
import { emptyAppConfig, normalizeProfile, purgeLegacyAchievementConfig } from "./study";

describe("Làm sạch dữ liệu Thành tích và Danh hiệu cũ", () => {
  it("không sinh lại catalog cấp độ hoặc nguồn thưởng legacy", () => {
    const config = emptyAppConfig();
    expect(config.levelDefinitions).toEqual([]);
    expect(config.customAchievements).toEqual([]);
    expect(config.achievementOverrides).toEqual([]);
    expect(config.collectionConfig?.rewardSources).toEqual([]);
    expect(config.collectionConfig?.events).toHaveLength(1);
  });

  it("loại dữ liệu Thành tích/Danh hiệu đã lưu nhưng giữ nguyên dữ liệu học tập", () => {
    const profile = normalizeProfile({
      unlockedAchievementIds: ["achievement-demo"], ownedBadges: ["🏅"], activeTitle: "title-demo", level: 99,
      achievementUnlockDates: { "achievement-demo": "2026-08-23T00:00:00.000Z" }, achievementEvidence: { "achievement-demo": [{ id: "evidence-demo" }] },
      studyPlanItems: [{ id: "plan-1", title: "Ôn bài", cadence: "day", reward: "fragment", rewardAmount: 2 }], planFragments: 4,
      pomodoroSessions: [{ id: "pomo-1", subject: "Toán", topic: "Hàm số", durationSeconds: 1500, completedAt: "2026-08-23T00:00:00.000Z", notes: "Hoàn tất phần trọng tâm", checkedPlanItemIds: ["plan-1"] }],
      flashcardSets: [{ id: "cards-1", title: "Công thức", subject: "Toán", cards: [] }],
    });
    expect(profile.unlockedAchievementIds).toEqual([]);
    expect(profile.ownedBadges).toEqual([]);
    expect(profile.activeTitle).toBeNull();
    expect(profile.achievementUnlockDates).toEqual({});
    expect(profile.achievementEvidence).toEqual({});
    expect(profile.level).toBe(1);
    expect(profile.studyPlanItems).toHaveLength(1);
    expect(profile.planFragments).toBe(4);
    expect(profile.pomodoroSessions).toHaveLength(1);
    expect(profile.flashcardSets).toHaveLength(1);
  });

  it("làm sạch cấu hình cũ mà không xóa Event mẫu", () => {
    const config = purgeLegacyAchievementConfig({
      ...emptyAppConfig(),
      levelDefinitions: [{ id: "level-demo", icon: "🏅", name: "Cấp thử", enabled: true }],
      customAchievements: [{ id: "achievement-demo", title: "Thành tích thử", description: "", icon: "🏅", category: "study", condition: { type: "pomodoroCount", target: 1 }, reward: { type: "xp", amount: 1 }, enabled: true, createdAt: "2026-08-23T00:00:00.000Z", updatedAt: "2026-08-23T00:00:00.000Z" }],
      collectionConfig: { ...emptyAppConfig().collectionConfig!, rewardSources: [{ id: "legacy-source", kind: "studySession", label: "Thưởng cũ", description: "", enabled: true, rewards: [{ tier: "I", amount: 1 }] }] },
    });
    expect(config.levelDefinitions).toEqual([]);
    expect(config.customAchievements).toEqual([]);
    expect(config.collectionConfig?.rewardSources).toEqual([]);
    expect(config.collectionConfig?.events).toHaveLength(1);
  });
});
