import { describe, expect, it } from "vitest";
import { allAchievementsWithProgress, emptyAppConfig, emptyProfile, selectEarnedTitle } from "./study";

describe("profile title selection", () => {
  it("rejects an unearned title without changing the profile", () => {
    const profile = emptyProfile();
    const config = emptyAppConfig();
    const result = selectEarnedTitle(profile, config, "achievement-title-001");
    expect(result.selected).toBeNull();
    expect(result.profile.activeTitle).toBeNull();
  });

  it("stores only an earned title", () => {
    const config = emptyAppConfig();
    const achievement = allAchievementsWithProgress(emptyProfile(), config).find((item) => item.title);
    expect(achievement).toBeTruthy();
    const profile = { ...emptyProfile(), unlockedAchievementIds: [achievement!.id] };
    const result = selectEarnedTitle(profile, config, achievement!.id);
    expect(result.selected?.id).toBe(achievement!.id);
    expect(result.profile.activeTitle).toBe(achievement!.id);
  });
});
