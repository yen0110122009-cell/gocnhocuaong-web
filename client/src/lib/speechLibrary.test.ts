import { describe, expect, it } from "vitest";
import { antiProcrastinationChoices, lumiSpeechLibrary, speechForEvent, speechGroupLabels } from "./speechLibrary";

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

  it("offers the three anti-procrastination choices", () => {
    expect(antiProcrastinationChoices.map((choice) => choice.id)).toEqual(["five", "review", "lumi"]);
  });
});
