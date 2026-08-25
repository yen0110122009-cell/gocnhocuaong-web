import { describe, expect, it } from "vitest";
import { currentPomodoroSessionNumber, focusCompletionTransition, nextPomodoroBreakMode, pendingTransitionForSavedPomodoro, pomodoroStartSeconds, repairPomodoroGoalCounter, resetPomodoroForGoalChange, shouldCelebrateAndEnterBreak, shouldClaimPomodoroCompletion } from "./pomodoroFlow";

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
    expect(shouldCelebrateAndEnterBreak(4, 4)).toBe(true);
    expect(shouldCelebrateAndEnterBreak(3, 4)).toBe(false);
  });

  it("resets the goal to the first focus session when the target changes", () => {
    expect(currentPomodoroSessionNumber("focus", 3, 4)).toBe(4);
    const reset = resetPomodoroForGoalChange(25);
    expect(reset).toEqual({ completedFocusSessions: 0, mode: "focus", pendingTransition: null, seconds: 1500, running: false, sessionStartedAt: null });
    expect(currentPomodoroSessionNumber(reset.mode, reset.completedFocusSessions, 2)).toBe(1);
  });

  it("chuyển phiên đầu tiên sang đúng nghỉ ngắn ở cả hai chế độ", () => {
    const manual = focusCompletionTransition({ completedFocusSessions: 0, totalSessions: 4, autoAdvance: false, shortBreakMinutes: 5, longBreakMinutes: 15 });
    expect(manual).toEqual({ completedFocusSessions: 1, mode: "shortBreak", pendingTransition: "break", seconds: 0, running: false, goalReached: false });
    expect(currentPomodoroSessionNumber(manual.mode, manual.completedFocusSessions, 4)).toBe(1);
    const automatic = focusCompletionTransition({ completedFocusSessions: 0, totalSessions: 4, autoAdvance: true, shortBreakMinutes: 5, longBreakMinutes: 15 });
    expect(automatic).toEqual({ completedFocusSessions: 1, mode: "shortBreak", pendingTransition: null, seconds: 300, running: true, goalReached: false });
  });

  it("vào nghỉ dài sau phiên thứ tư và không đánh dấu đủ phiên sau phiên đầu", () => {
    const first = focusCompletionTransition({ completedFocusSessions: 0, totalSessions: 4, autoAdvance: true, shortBreakMinutes: 5, longBreakMinutes: 15 });
    const fourth = focusCompletionTransition({ completedFocusSessions: 3, totalSessions: 4, autoAdvance: false, shortBreakMinutes: 5, longBreakMinutes: 15 });
    expect(first.completedFocusSessions).toBe(1);
    expect(first.goalReached).toBe(false);
    expect(fourth).toEqual({ completedFocusSessions: 4, mode: "longBreak", pendingTransition: "break", seconds: 0, running: false, goalReached: true });
  });

  it("không nhảy mục tiêu 4 phiên lên 4/4 sau khi mới hoàn thành 2 phiên", () => {
    const first = focusCompletionTransition({ completedFocusSessions: 0, totalSessions: 4, autoAdvance: false, shortBreakMinutes: 5, longBreakMinutes: 15 });
    const second = focusCompletionTransition({ completedFocusSessions: first.completedFocusSessions, totalSessions: 4, autoAdvance: false, shortBreakMinutes: 5, longBreakMinutes: 15 });
    expect(currentPomodoroSessionNumber("focus", 0, 4)).toBe(1);
    expect(first.completedFocusSessions).toBe(1);
    expect(second.completedFocusSessions).toBe(2);
    expect(currentPomodoroSessionNumber("focus", second.completedFocusSessions, 4)).toBe(3);
    expect(shouldClaimPomodoroCompletion(null, "focus", "session-1", 10_000)).toBe(true);
    const claim = JSON.stringify({ mode: "focus", sessionStartedAt: "session-1", claimedAt: 10_000 });
    expect(shouldClaimPomodoroCompletion(claim, "focus", "session-1", 10_001)).toBe(false);
    expect(shouldClaimPomodoroCompletion(claim, "focus", "session-2", 10_001)).toBe(true);
    expect(shouldClaimPomodoroCompletion(claim, "focus", "session-1", 15_001)).toBe(true);
  });

  it("khôi phục phiên thủ công ở giây 0 thành trạng thái chờ bắt đầu nghỉ", () => {
    expect(pendingTransitionForSavedPomodoro({ mode: "shortBreak", seconds: 0, goalCompletedSessions: 1, totalSessions: 4 })).toBe("break");
    expect(pendingTransitionForSavedPomodoro({ mode: "focus", seconds: 0, goalCompletedSessions: 1, totalSessions: 4 })).toBe("focus");
    expect(pendingTransitionForSavedPomodoro({ mode: "focus", seconds: 0, goalCompletedSessions: 4, totalSessions: 4 })).toBeNull();
  });

  it("always restores a valid duration when starting from zero seconds", () => {
    expect(pomodoroStartSeconds({ mode: "focus", pendingTransition: null, seconds: 0, focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 })).toBe(1500);
    expect(pomodoroStartSeconds({ mode: "focus", pendingTransition: "focus", seconds: 0, focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 })).toBe(1500);
    expect(pomodoroStartSeconds({ mode: "shortBreak", pendingTransition: "break", seconds: 0, focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 })).toBe(300);
    expect(pomodoroStartSeconds({ mode: "focus", pendingTransition: "focus", seconds: 0, focusMinutes: 45, shortBreakMinutes: 10, longBreakMinutes: 20 })).toBe(2_700);
    expect(pomodoroStartSeconds({ mode: "shortBreak", pendingTransition: "break", seconds: 0, focusMinutes: 45, shortBreakMinutes: 10, longBreakMinutes: 20 })).toBe(600);
  });

  it("sửa state focus đứng yên 4/4 về phiên đầu tiên của chu kỳ mới", () => {
    expect(repairPomodoroGoalCounter({ mode: "focus", running: false, pendingTransition: null, completedFocusSessions: 4, totalSessions: 4 })).toBe(0);
    expect(currentPomodoroSessionNumber("focus", 0, 4)).toBe(1);
  });

  it("giữ 4/4 khi đang ở nghỉ dài hoặc chờ bắt đầu phiên focus kế tiếp", () => {
    expect(repairPomodoroGoalCounter({ mode: "longBreak", running: false, pendingTransition: "break", completedFocusSessions: 4, totalSessions: 4 })).toBe(4);
    expect(repairPomodoroGoalCounter({ mode: "focus", running: false, pendingTransition: "focus", completedFocusSessions: 4, totalSessions: 4 })).toBe(4);
  });

  it("giữ độc lập thời lượng 50/10 với bộ đếm số phiên", () => {
    expect(pomodoroStartSeconds({ mode: "focus", pendingTransition: null, seconds: 0, focusMinutes: 50, shortBreakMinutes: 10, longBreakMinutes: 20 })).toBe(3000);
    expect(focusCompletionTransition({ completedFocusSessions: 0, totalSessions: 4, autoAdvance: true, shortBreakMinutes: 10, longBreakMinutes: 20 })).toEqual({ completedFocusSessions: 1, mode: "shortBreak", pendingTransition: null, seconds: 600, running: true, goalReached: false });
  });
});
