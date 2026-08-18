import { describe, expect, it } from "vitest";
import { allAchievementsWithProgress, emptyAppConfig, emptyProfile, generateAchievements } from "./study";

describe("achievement progress", () => {
  it("reports current value, percentage and remaining target for locked achievements", () => {
    const profile = {
      ...emptyProfile(),
      flashcardSets: [{
        id: "set-1",
        title: "Sinh học",
        subject: "Sinh học",
        topic: "Tế bào",
        difficulty: "Cơ bản" as const,
        createdAt: new Date().toISOString(),
        studyCount: 1,
        cards: Array.from({ length: 4 }, (_, index) => ({ id: `card-${index}`, front: "A", back: "B", status: "known" as const, starred: false })),
      }],
    };
    const achievement = allAchievementsWithProgress(profile, emptyAppConfig()).find((item) => item.metric === "learnedCards");
    expect(achievement).toBeDefined();
    expect(achievement?.currentValue).toBe(4);
    expect(achievement?.threshold).toBeGreaterThan(4);
    expect(achievement?.progress).toBe(Math.round(4 / (achievement?.threshold ?? 1) * 100));
    expect(achievement?.remaining).toBe((achievement?.threshold ?? 0) - 4);
  });

  it("generates the public 900-achievement catalog with 400 final titles", () => {
    const catalog = generateAchievements();
    expect(catalog).toHaveLength(900);
    expect(new Set(catalog.map((item) => item.rank)).size).toBe(9);
    expect(catalog.filter((item) => item.title).length).toBe(400);
    expect(catalog.slice(500).every((item) => Boolean(item.title))).toBe(true);
    expect(catalog.every((item) => item.isSecret !== true)).toBe(true);
  });

  it("includes enabled custom achievements with the same progress contract", () => {
    const config = { ...emptyAppConfig(), customAchievements: [{ id: "custom-1", name: "Bền bỉ", description: "Đạt 5 XP", metric: "xp" as const, threshold: 5, rewardXp: 10, rewardFragments: 0, enabled: true }] };
    const achievement = allAchievementsWithProgress({ ...emptyProfile(), xp: 3 }, config).find((item) => item.id === "custom-1");
    expect(achievement).toMatchObject({ currentValue: 3, threshold: 5, progress: 60, remaining: 2 });
  });
});
