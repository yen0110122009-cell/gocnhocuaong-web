import { describe, expect, it } from "vitest";
import { allAchievementsWithProgress, emptyAppConfig, emptyProfile, generateAchievements, normalizeProfile } from "./study";

describe("tiến trình học không còn gắn Thành tích", () => {
  it("không sinh catalog hoặc tiến trình Thành tích", () => {
    expect(generateAchievements()).toEqual([]);
    expect(allAchievementsWithProgress(emptyProfile(), emptyAppConfig())).toEqual([]);
  });

  it("giữ học liệu và linh vật khi làm sạch tiến trình Thành tích cũ", () => {
    const profile = normalizeProfile({
      unlockedAchievementIds: ["legacy"],
      activeTitle: "legacy-title",
      flashcardSets: [{ id: "cards", title: "Sinh học", subject: "Sinh học", topic: "Tế bào", cards: [] }],
      appearanceEmojiPet: { emoji: "🐼", x: 120, y: 1 },
    });
    expect(profile.unlockedAchievementIds).toEqual([]);
    expect(profile.activeTitle).toBeNull();
    expect(profile.flashcardSets).toHaveLength(1);
    expect(profile.appearanceEmojiPet).toEqual({ emoji: "🐼", x: 96, y: 7, roam: false, roamingEnabled: false });
  });
});
