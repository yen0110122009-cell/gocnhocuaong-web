export type PomodoroFlowMode = "focus" | "shortBreak" | "longBreak";

export function repairPomodoroGoalCounter(input: { mode: PomodoroFlowMode; running: boolean; pendingTransition?: "break" | "focus" | null; completedFocusSessions: number; totalSessions: number }) {
  const total = Math.max(1, Math.floor(input.totalSessions));
  const completed = Math.max(0, Math.min(total, Math.floor(input.completedFocusSessions)));
  // Ở trạng thái focus, counter đã chạm mục tiêu chỉ hợp lệ khi đang chờ
  // chuyển tiếp rõ ràng. Nếu không có pendingTransition thì đây là state cũ
  // bị lệch và phải mở đầu chu kỳ mới từ phiên 1.
  if (input.mode === "focus" && !input.pendingTransition && completed >= total) return 0;
  return completed;
}

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

export function pendingTransitionForSavedPomodoro(input: { pendingTransition?: "break" | "focus" | null; seconds: number; goalCompletedSessions?: number; totalSessions: number; mode: PomodoroFlowMode } | null) {
  if (!input) return null;
  if (input.pendingTransition) return input.pendingTransition;
  if (input.seconds !== 0 || (input.goalCompletedSessions ?? 0) >= input.totalSessions) return null;
  return input.mode === "focus" ? "focus" as const : "break" as const;
}

export function completedFocusSessionsForActiveFocus(completedFocusSessions: number, totalSessions: number) {
  const total = Math.max(1, Math.floor(totalSessions));
  const completed = Math.max(0, Math.floor(completedFocusSessions));
  // Khi đang ở một phiên focus, completed không thể đã chạm mục tiêu. Đây là
  // lớp bảo vệ cho state cũ/cross-tab từng lưu 4/4 rồi mở lại phiên mới.
  return completed >= total ? 0 : completed;
}

export function focusCompletionTransition(input: { completedFocusSessions: number; totalSessions: number; autoAdvance: boolean; shortBreakMinutes: number; longBreakMinutes: number }) {
  const total = Math.max(1, Math.floor(input.totalSessions));
  const completed = Math.min(total, Math.max(0, Math.floor(input.completedFocusSessions)) + 1);
  const goalReached = completed >= total;
  const enterBreak = !goalReached || shouldCelebrateAndEnterBreak(completed, total);
  if (!enterBreak) return { completedFocusSessions: completed, mode: "focus" as const, pendingTransition: null, seconds: 0, running: false, goalReached };
  const mode = nextPomodoroBreakMode(completed);
  const breakMinutes = mode === "longBreak" ? Math.max(1, Math.floor(input.longBreakMinutes)) : Math.max(1, Math.floor(input.shortBreakMinutes));
  return { completedFocusSessions: completed, mode, pendingTransition: input.autoAdvance ? null : "break" as const, seconds: input.autoAdvance ? breakMinutes * 60 : 0, running: input.autoAdvance, goalReached };
}

export const POMODORO_COMPLETION_CLAIM_TTL_MS = 5_000;

export function shouldClaimPomodoroCompletion(rawClaim: string | null, mode: PomodoroFlowMode, sessionStartedAt: string | null, now = Date.now()) {
  if (!rawClaim) return true;
  try {
    const claim = JSON.parse(rawClaim) as { mode?: PomodoroFlowMode; sessionStartedAt?: string | null; claimedAt?: number };
    const sameSession = claim.mode === mode && (claim.sessionStartedAt ?? null) === sessionStartedAt;
    const claimedAt = Number(claim.claimedAt);
    return !(sameSession && Number.isFinite(claimedAt) && now - claimedAt < POMODORO_COMPLETION_CLAIM_TTL_MS);
  } catch {
    return true;
  }
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

export function elapsedPomodoroSeconds(focusMinutes: number, secondsRemaining: number) {
  const plannedSeconds = Math.max(0, Math.floor(Number(focusMinutes) || 0) * 60);
  const remaining = Math.max(0, Math.floor(Number(secondsRemaining) || 0));
  return Math.max(0, Math.min(plannedSeconds, plannedSeconds - remaining));
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
