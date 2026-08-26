import { emptyProfile, normalizeProfile, type PomodoroSession, type ProfileState } from "../../../shared/study";

const JOURNAL_PREFIX = "gocnhocuaong_pomodoro_journal_v1:";

function key(accountId: string) { return `${JOURNAL_PREFIX}${encodeURIComponent(accountId)}`; }

function validSessions(value: unknown): PomodoroSession[] {
  if (!Array.isArray(value)) return [];
  return normalizeProfile({ ...emptyProfile(), pomodoroHistory: value }).pomodoroHistory;
}

export function readPomodoroHistoryRecovery(accountId: string): PomodoroSession[] {
  try {
    const storage = typeof localStorage === "undefined" ? null : localStorage;
    const raw = storage?.getItem(key(accountId));
    return validSessions(raw ? JSON.parse(raw) : []).slice(0, 500);
  } catch {
    return [];
  }
}

export function appendPomodoroHistoryRecovery(accountId: string, session: PomodoroSession) {
  try {
    const sessions = readPomodoroHistoryRecovery(accountId);
    const merged = new Map<string, PomodoroSession>(sessions.map((item) => [item.id, item]));
    merged.set(session.id, session);
    if (typeof localStorage !== "undefined") localStorage.setItem(key(accountId), JSON.stringify(Array.from(merged.values()).slice(0, 500)));
  } catch {
    // Không làm gián đoạn timer nếu localStorage bị chặn.
  }
}

export function mergePomodoroHistoryRecovery(profile: ProfileState, accountId?: string): ProfileState {
  if (!accountId || profile.pomodoroHistory.length === 0 && readPomodoroHistoryRecovery(accountId).length === 0) return profile;
  const journal = readPomodoroHistoryRecovery(accountId);
  if (!journal.length) return profile;
  const existing = new Map(profile.pomodoroHistory.map((item) => [item.id, item]));
  journal.forEach((item) => { if (!existing.has(item.id)) existing.set(item.id, item); });
  if (existing.size === profile.pomodoroHistory.length) return profile;
  return normalizeProfile({ ...profile, pomodoroHistory: Array.from(existing.values()).slice(0, 500) });
}

export const pomodoroHistoryRecoveryKeyPrefix = JOURNAL_PREFIX;
