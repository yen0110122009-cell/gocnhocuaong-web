import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("global learning search", () => {
  it("indexes flashcards and quizzes without daily plans", () => {
    expect(source).toContain("profile.flashcardSets.map");
    expect(source).toContain("profile.quizzes.map");
    expect(source).not.toContain("profile.studyPlanItems ?? []).map");
    expect(source).toContain("Tìm Flashcard, đề hoặc môn học");
    expect(source).not.toContain('to: "achievements" as View');
    expect(source).not.toContain('to: "museum" as View');
  });

  it("adds the requested Pomodoro study destination without unrelated productivity tools", () => {
    expect(source).toContain("Pomodoro");
    expect(source).not.toMatch(/Todo|Habit|Journal|Schedule/);
  });
});
