import { beforeEach, describe, expect, it } from "vitest";
import { emptyProfile, type PomodoroSession } from "../../../shared/study";
import { appendPomodoroHistoryRecovery, mergePomodoroHistoryRecovery } from "./pomodoroHistoryRecovery";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

const session: PomodoroSession = {
  id: "morning-50-1",
  startedAt: "2026-08-26T06:00:00.000Z",
  endedAt: "2026-08-26T06:50:00.000Z",
  durationMinutes: 50,
  elapsedSeconds: 3_000,
  subject: "Toán",
  topic: "Ôn tập",
  sessionNumber: 1,
  totalSessions: 4,
  mode: "focus",
  status: "completed",
};

describe("pomodoroHistoryRecovery", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: memoryStorage() });
  });

  it("khôi phục phiên đã ghi và không tạo bản sao", () => {
    appendPomodoroHistoryRecovery("account-a", session);
    appendPomodoroHistoryRecovery("account-a", session);
    const merged = mergePomodoroHistoryRecovery(emptyProfile(), "account-a");
    expect(merged.pomodoroHistory).toHaveLength(1);
    expect(merged.pomodoroHistory[0]).toMatchObject({ id: "morning-50-1", elapsedSeconds: 3_000, status: "completed" });
  });
});
