import { describe, expect, it } from "vitest";
import { chooseMicroTask, comboProgress, completeComboStep, createCombo, procrastinationAnalytics, TASK_COMBOS } from "./procrastination";

describe("procrastination helpers", () => {
  it("chooses a deterministic micro task", () => {
    expect(chooseMicroTask(() => 0)).toBe("Mở sách và đánh dấu một ý quan trọng.");
    expect(chooseMicroTask(() => 0.99)).toBe("Kiểm tra lại một câu sai.");
  });
  it("tracks combo progress and completion", () => {
    const combo = createCombo(TASK_COMBOS[0], "2026-08-18T00:00:00.000Z");
    const one = completeComboStep(combo, combo.steps[0].id);
    expect(comboProgress(one.steps)).toBe(33);
    const done = one.steps.slice(1).reduce((current, step) => completeComboStep(current, step.id), one);
    expect(comboProgress(done.steps)).toBe(100);
    expect(done.completedAt).toBeTruthy();
  });
  it("creates a gentle insight from event patterns", () => {
    const result = procrastinationAnalytics([
      { id: "1", occurredAt: "2026-08-18T20:00:00.000Z", kind: "opened_without_start", hour: 20 },
      { id: "2", occurredAt: "2026-08-18T20:05:00.000Z", kind: "started_small", hour: 20, taskMinutes: 5 },
      { id: "3", occurredAt: "2026-08-18T20:10:00.000Z", kind: "completed_focus", hour: 20 },
    ], [{ reason: "unclear" }, { reason: "unclear" }]);
    expect(result.commonReason).toBe("unclear");
    expect(result.insight).toContain("không biết bắt đầu");
    expect(result.completionRate).toBe(100);
  });
});
