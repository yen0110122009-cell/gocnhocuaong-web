import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("global learning search", () => {
  it("indexes flashcards, quizzes, achievements, characters and fragments", () => {
    expect(source).toContain("profile.flashcardSets.map");
    expect(source).toContain("profile.quizzes.map");
    expect(source).toContain("computedAchievements(profile, config)");
    expect(source).toContain("config.characters.flatMap");
    expect(source).toContain("Mảnh ghép · ${x.name}");
  });

  it("adds the requested Pomodoro study destination without unrelated productivity tools", () => {
    expect(source).toContain("Pomodoro");
    expect(source).not.toMatch(/Todo|Habit|Journal|Schedule/);
  });
});
