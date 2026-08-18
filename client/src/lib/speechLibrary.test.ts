import { describe, expect, it } from "vitest";
import { antiProcrastinationChoices, lumiSpeechLibrary, mascotReactionForAchievement, mascotVoiceForState, speechForEvent, speechGroupLabels } from "./speechLibrary";
import type { MascotVoiceLine } from "../../../shared/study";

describe("Lumi speech library", () => {
  it("contains all four requested speech groups", () => {
    const groups = new Set(lumiSpeechLibrary.map((item) => item.group));
    expect(groups).toEqual(new Set(["comfort", "encouragement", "understanding", "antiProcrastination"]));
    expect(Object.keys(speechGroupLabels)).toHaveLength(4);
  });

  it("maps learning events to a Lumi response", () => {
    for (const event of ["mistake", "lowScore", "todoMissed", "pomodoroAbandoned", "streakLost", "ineffective", "comeback", "start", "complete", "critical", "hardTask", "procrastination"] as const) {
      expect(speechForEvent(event).text.trim().length).toBeGreaterThan(10);
    }
  });

  it("selects mascot speech by state without using disabled or trashed lines", () => {
    const lines: MascotVoiceLine[] = [
      { id: "z", state: "achievement", text: "Bị ẩn", enabled: false, createdAt: "2026-01-01" },
      { id: "trash", state: "achievement", text: "Đã xóa", enabled: true, deletedAt: "2026-01-02", createdAt: "2026-01-02" },
      { id: "good", state: "achievement", text: "Ong làm được rồi!", enabled: true, createdAt: "2026-01-03" },
    ];
    expect(mascotVoiceForState(lines, "achievement")?.id).toBe("good");
    expect(mascotReactionForAchievement(lines, "almost_unlocked")?.id).toBe("good");
  });

  it("offers the three anti-procrastination choices", () => {
    expect(antiProcrastinationChoices.map((choice) => choice.id)).toEqual(["five", "review", "lumi"]);
  });
});
