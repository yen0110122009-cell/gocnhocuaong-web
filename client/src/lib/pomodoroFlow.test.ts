import { describe, expect, it } from "vitest";
import { currentPomodoroSessionNumber, nextPomodoroBreakMode, pomodoroStartSeconds } from "./pomodoroFlow";

describe("pomodoroFlow", () => {
  it("shows the first focus session as 1 of the selected goal", () => {
    expect(currentPomodoroSessionNumber("focus", 0, 4)).toBe(1);
    expect(currentPomodoroSessionNumber("focus", 1, 4)).toBe(2);
    expect(currentPomodoroSessionNumber("focus", 3, 4)).toBe(4);
  });

  it("uses the completed count to choose a long break every fourth focus session", () => {
    expect(nextPomodoroBreakMode(1)).toBe("shortBreak");
    expect(nextPomodoroBreakMode(3)).toBe("shortBreak");
    expect(nextPomodoroBreakMode(4)).toBe("longBreak");
  });

  it("always restores a valid duration when starting from zero seconds", () => {
    expect(pomodoroStartSeconds({ mode: "focus", pendingTransition: null, seconds: 0, focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 })).toBe(1500);
    expect(pomodoroStartSeconds({ mode: "focus", pendingTransition: "focus", seconds: 0, focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 })).toBe(1500);
    expect(pomodoroStartSeconds({ mode: "shortBreak", pendingTransition: "break", seconds: 0, focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 })).toBe(300);
  });
});
