import { describe, expect, it } from "vitest";
import { POMODORO_SESSION_KEY, clearPersistedPomodoro, pomodoroSessionStorageKey, readPersistedPomodoro, recoverRunningSeconds, writePersistedPomodoro, type PersistedPomodoroSession } from "./pomodoroPersistence";

const session: Omit<PersistedPomodoroSession, "savedAt"> = {
  focus: 25, shortBreak: 5, longBreak: 15, seconds: 1490, mode: "focus", running: true,
  autoAdvance: true, subject: "Lịch sử", topic: "Nhà Trần", activity: "theory", totalSessions: 4,
  sessionStartedAt: "2026-08-21T00:00:00.000Z", backgroundSound: "Mưa nhẹ", backgroundVolume: 68,
  layerVolumes: { rain: 50 }, alertVolume: 85, pomodoroAmbientMix: { morning: 25, storm: 75 },
  compactMode: true, miniPlayerPinned: true,
};

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) };
}

describe("pomodoroPersistence", () => {
  it("round-trips the running session and pin/compact state", () => {
    const storage = memoryStorage();
    writePersistedPomodoro(session, storage);
    const restored = readPersistedPomodoro(storage);
    expect(restored?.running).toBe(true);
    expect(restored?.miniPlayerPinned).toBe(true);
    expect(restored?.compactMode).toBe(true);
    expect(restored?.backgroundSound).toBe("Mưa nhẹ");
  });

  it("cách ly phiên lưu giữa các tài khoản", () => {
    const storage = memoryStorage();
    const accountAKey = pomodoroSessionStorageKey("account-a");
    const accountBKey = pomodoroSessionStorageKey("account-b");
    writePersistedPomodoro({ ...session, goalCompletedSessions: 3 }, storage, accountAKey);
    expect(readPersistedPomodoro(storage, accountAKey)?.goalCompletedSessions).toBe(3);
    expect(readPersistedPomodoro(storage, accountBKey)).toBeNull();
  });

  it("subtracts elapsed wall-clock time while the page was unmounted", () => {
    const restored = { ...session, savedAt: 10_000 } as PersistedPomodoroSession;
    expect(recoverRunningSeconds(restored, 11_500)).toBe(1489);
    expect(recoverRunningSeconds({ ...restored, running: false }, 99_000)).toBe(1490);
  });

  it("clears the session explicitly", () => {
    const storage = memoryStorage();
    writePersistedPomodoro(session, storage);
    clearPersistedPomodoro(storage);
    expect(storage.getItem(POMODORO_SESSION_KEY)).toBeNull();
  });

  it("repairs a stale focus 4/4 snapshot instead of restoring it as the next session", () => {
    const storage = memoryStorage();
    writePersistedPomodoro({ ...session, mode: "focus", running: false, seconds: 0, pendingTransition: null, totalSessions: 4, goalCompletedSessions: 4 }, storage);
    const restored = readPersistedPomodoro(storage);
    expect(restored?.goalCompletedSessions).toBe(0);
    expect(restored?.mode).toBe("focus");
  });

  it("preserves 4/4 while the saved state is explicitly waiting for the long break", () => {
    const storage = memoryStorage();
    writePersistedPomodoro({ ...session, mode: "longBreak", running: false, seconds: 0, pendingTransition: "break", totalSessions: 4, goalCompletedSessions: 4 }, storage);
    expect(readPersistedPomodoro(storage)?.goalCompletedSessions).toBe(4);
  });
});
