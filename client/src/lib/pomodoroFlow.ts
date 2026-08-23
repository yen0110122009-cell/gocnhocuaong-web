export type PomodoroFlowMode = "focus" | "shortBreak" | "longBreak";

export function currentPomodoroSessionNumber(mode: PomodoroFlowMode, completedFocusSessions: number, totalSessions: number) {
  const total = Math.max(1, Math.floor(totalSessions));
  const completed = Math.max(0, Math.floor(completedFocusSessions));
  return mode === "focus" ? Math.min(total, completed + 1) : Math.min(total, completed);
}

export function nextPomodoroBreakMode(completedFocusSessions: number): Extract<PomodoroFlowMode, "shortBreak" | "longBreak"> {
  return Math.max(0, Math.floor(completedFocusSessions)) % 4 === 0 ? "longBreak" : "shortBreak";
}

export function shouldCelebrateAndEnterBreak(completedFocusSessions: number, totalSessions: number) {
  const completed = Math.max(0, Math.floor(completedFocusSessions));
  const total = Math.max(1, Math.floor(totalSessions));
  return completed >= total && nextPomodoroBreakMode(completed) === "longBreak";
}

export function resetPomodoroForGoalChange(focusMinutes: number) {
  return {
    completedFocusSessions: 0,
    mode: "focus" as const,
    pendingTransition: null,
    seconds: Math.max(1, Math.floor(focusMinutes)) * 60,
    running: false,
    sessionStartedAt: null,
  };
}

export function pomodoroStartSeconds(input: {
  mode: PomodoroFlowMode;
  pendingTransition: "break" | "focus" | null;
  seconds: number;
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
}) {
  if (input.pendingTransition === "focus") return Math.max(1, input.focusMinutes) * 60;
  if (input.pendingTransition === "break") return (input.mode === "longBreak" ? input.longBreakMinutes : input.shortBreakMinutes) * 60;
  if (input.seconds > 0) return input.seconds;
  if (input.mode === "focus") return Math.max(1, input.focusMinutes) * 60;
  return (input.mode === "longBreak" ? input.longBreakMinutes : input.shortBreakMinutes) * 60;
}
