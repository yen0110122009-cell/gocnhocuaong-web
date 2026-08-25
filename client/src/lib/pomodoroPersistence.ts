import { normalizePomodoroAlertSettings, type PomodoroAlertSettings } from "../../../shared/study";

export type PersistedPomodoroMode = "focus" | "shortBreak" | "longBreak";

export type PersistedPomodoroSession = {
  focus: number;
  shortBreak: number;
  longBreak: number;
  seconds: number;
  mode: PersistedPomodoroMode;
  running: boolean;
  autoAdvance: boolean;
  pendingTransition?: "break" | "focus" | null;
  subject: string;
  topic: string;
  activity: string;
  notes: string;
  /** Tương thích phiên cũ; giao diện hiện tại không còn dùng liên kết Kế hoạch. */
  checkedPlanItemIds?: string[];
  totalSessions: number;
  goalCompletedSessions?: number;
  sessionStartedAt: string | null;
  backgroundSound?: string;
  backgroundVolume?: number;
  layerVolumes?: Record<string, number>;
  alertVolume: number;
  pomodoroAlerts?: PomodoroAlertSettings;
  pomodoroAmbientMix?: { morning: number; storm: number };
  compactMode: boolean;
  deepFocusMode?: boolean;
  miniPlayerPinned: boolean;
  miniPlayerX: number;
  miniPlayerY: number;
  lumiPopupX?: number;
  lumiPopupY?: number;
  savedAt: number;
};

export const POMODORO_SESSION_KEY = "study_pomodoro_session_v4";
export function pomodoroSessionStorageKey(accountId?: string) { return accountId ? `${POMODORO_SESSION_KEY}:${encodeURIComponent(accountId)}` : POMODORO_SESSION_KEY; }

function finiteNumber(value: unknown, fallback: number, min: number, max: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

export function readPersistedPomodoro(storage: Pick<Storage, "getItem"> | null = typeof window === "undefined" ? null : window.localStorage, key = POMODORO_SESSION_KEY): PersistedPomodoroSession | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<PersistedPomodoroSession>;
    if (!value || (value.mode !== "focus" && value.mode !== "shortBreak" && value.mode !== "longBreak")) return null;
    return {
      focus: finiteNumber(value.focus, 25, 1, 120),
      shortBreak: finiteNumber(value.shortBreak, 5, 1, 30),
      longBreak: finiteNumber(value.longBreak, 15, 1, 45),
      seconds: finiteNumber(value.seconds, 25 * 60, 0, 120 * 60),
      mode: value.mode,
      running: value.running === true,
      autoAdvance: value.autoAdvance !== false,
      pendingTransition: value.pendingTransition === "break" || value.pendingTransition === "focus" ? value.pendingTransition : null,
      subject: typeof value.subject === "string" ? value.subject : "",
      topic: typeof value.topic === "string" ? value.topic : "",
      activity: typeof value.activity === "string" ? value.activity : "theory",
      notes: typeof value.notes === "string" ? value.notes.slice(0, 2_000) : "",
      checkedPlanItemIds: Array.isArray(value.checkedPlanItemIds) ? Array.from(new Set(value.checkedPlanItemIds.map(String).map((id) => id.trim()).filter(Boolean))).slice(0, 30) : [],
      totalSessions: finiteNumber(value.totalSessions, 4, 1, 12),
      goalCompletedSessions: finiteNumber(value.goalCompletedSessions, 0, 0, 12),
      sessionStartedAt: typeof value.sessionStartedAt === "string" ? value.sessionStartedAt : null,
      backgroundSound: typeof value.backgroundSound === "string" ? value.backgroundSound : "Mưa nhẹ",
      backgroundVolume: finiteNumber(value.backgroundVolume, 68, 0, 100),
      layerVolumes: value.layerVolumes && typeof value.layerVolumes === "object" ? value.layerVolumes as Record<string, number> : {},
      alertVolume: finiteNumber(value.alertVolume, 85, 0, 100),
      pomodoroAlerts: normalizePomodoroAlertSettings(value.pomodoroAlerts),
      pomodoroAmbientMix: {
        morning: finiteNumber(value.pomodoroAmbientMix?.morning, 25, 0, 100),
        storm: finiteNumber(value.pomodoroAmbientMix?.storm, 75, 0, 100),
      },
      compactMode: value.compactMode === true,
      deepFocusMode: value.deepFocusMode === true,
      miniPlayerPinned: value.miniPlayerPinned === true,
      miniPlayerX: finiteNumber(value.miniPlayerX, 78, 8, 92),
      miniPlayerY: finiteNumber(value.miniPlayerY, 78, 12, 88),
      lumiPopupX: finiteNumber(value.lumiPopupX, 50, 20, 80),
      lumiPopupY: finiteNumber(value.lumiPopupY, 50, 20, 80),
      savedAt: finiteNumber(value.savedAt, Date.now(), 0, Number.MAX_SAFE_INTEGER),
    };
  } catch {
    return null;
  }
}

export function writePersistedPomodoro(session: Omit<PersistedPomodoroSession, "savedAt">, storage: Pick<Storage, "setItem"> | null = typeof window === "undefined" ? null : window.localStorage, key = POMODORO_SESSION_KEY) {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify({ ...session, savedAt: Date.now() }));
  } catch {
    // Storage may be disabled or full; the in-memory timer remains usable.
  }
}

export function clearPersistedPomodoro(storage: Pick<Storage, "removeItem"> | null = typeof window === "undefined" ? null : window.localStorage, key = POMODORO_SESSION_KEY) {
  try { storage?.removeItem(key); } catch { /* ignore unavailable storage */ }
}

export function recoverRunningSeconds(session: PersistedPomodoroSession, now = Date.now()) {
  if (!session.running) return session.seconds;
  const elapsed = Math.max(0, Math.floor((now - session.savedAt) / 1000));
  return Math.max(0, session.seconds - elapsed);
}
