import type { AvoidanceReason, ComboStep, ProcrastinationEvent, TaskCombo } from "../../../shared/study";

export const MICRO_TASKS = [
  "Mở sách và đánh dấu một ý quan trọng.",
  "Đọc lại một định nghĩa.",
  "Viết ngày hôm nay vào vở.",
  "Làm đúng một câu bài tập.",
  "Viết lại một công thức.",
  "Tự giải thích một khái niệm trong hai câu.",
  "Kiểm tra lại một câu sai.",
] as const;

export const AVOIDANCE_REASON_LABELS: Record<AvoidanceReason, string> = {
  tired: "Mệt",
  phone: "Điện thoại",
  unclear: "Không biết bắt đầu từ đâu",
  hard: "Bài khó",
  unmotivated: "Không có động lực",
  noTime: "Không đủ thời gian",
  other: "Lý do khác",
};

export const AVOIDANCE_REASONS: Array<{ id: AvoidanceReason; label: string; icon: string }> = [
  { id: "tired", label: "Mệt", icon: "😴" },
  { id: "phone", label: "Điện thoại", icon: "📱" },
  { id: "unclear", label: "Không biết bắt đầu từ đâu", icon: "😵" },
  { id: "hard", label: "Bài khó", icon: "😨" },
  { id: "unmotivated", label: "Không có động lực", icon: "🫠" },
  { id: "noTime", label: "Không đủ thời gian", icon: "🕐" },
  { id: "other", label: "Khác", icon: "✍️" },
];

export const TASK_COMBOS: TaskCombo[] = [
  {
    id: "combo-10-minutes",
    title: "Combo 10 phút",
    description: "Một vòng nhỏ: đọc, làm và tự giải thích.",
    steps: [
      { id: "read", label: "Đọc một đoạn ngắn", minutes: 2, completed: false },
      { id: "practice", label: "Làm một đến hai câu", minutes: 5, completed: false },
      { id: "explain", label: "Tự giải thích điều vừa học", minutes: 3, completed: false },
    ],
  },
  {
    id: "combo-comeback",
    title: "Combo quay lại 5 phút",
    description: "Dành cho ngày Ong chỉ cần mở lại nhịp học.",
    steps: [
      { id: "open", label: "Mở đúng tài liệu cần học", minutes: 1, completed: false },
      { id: "review", label: "Ôn một ý cũ", minutes: 2, completed: false },
      { id: "next", label: "Viết bước tiếp theo", minutes: 2, completed: false },
    ],
  },
];

export const chooseMicroTask = (random = Math.random) => MICRO_TASKS[Math.floor(random() * MICRO_TASKS.length)] ?? MICRO_TASKS[0];

export const createCombo = (template: TaskCombo, now = new Date().toISOString()): TaskCombo => ({
  ...template,
  startedAt: now,
  steps: template.steps.map((step) => ({ ...step, completed: false })),
});

export const completeComboStep = (combo: TaskCombo, stepId: string): TaskCombo => {
  const steps = combo.steps.map((step) => step.id === stepId ? { ...step, completed: true } : step);
  return { ...combo, steps, completedAt: steps.every((step) => step.completed) ? new Date().toISOString() : undefined };
};

export const comboProgress = (steps: ComboStep[]) => steps.length ? Math.round(steps.filter((step) => step.completed).length / steps.length * 100) : 0;

export type ProcrastinationAnalytics = {
  totalEvents: number;
  startsAfterDelay: number;
  commonHour: number | null;
  commonReason: AvoidanceReason | null;
  completedSmallStarts: number;
  completionRate: number;
  insight: string;
};

export function procrastinationAnalytics(events: ProcrastinationEvent[], reasons: Array<{ reason: AvoidanceReason }>): ProcrastinationAnalytics {
  const started = events.filter((event) => event.kind === "started_focus" || event.kind === "started_small").length;
  const completed = events.filter((event) => event.kind === "completed_focus").length;
  const hourCounts = new Map<number, number>();
  events.filter((event) => event.kind === "opened_without_start").forEach((event) => hourCounts.set(event.hour, (hourCounts.get(event.hour) ?? 0) + 1));
  const reasonCounts = new Map<AvoidanceReason, number>();
  reasons.forEach(({ reason }) => reasonCounts.set(reason, (reasonCounts.get(reason) ?? 0) + 1));
  const commonHour = Array.from(hourCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const commonReason: AvoidanceReason | null = Array.from(reasonCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const insight = commonReason ? `Lumi nhận thấy Ong thường khó bắt đầu vì ${AVOIDANCE_REASON_LABELS[commonReason].toLowerCase()}. Mình thử một nhiệm vụ nhỏ trước nhé.` : commonHour !== null ? `Lumi nhận thấy Ong thường mở web nhưng chưa bắt đầu vào khoảng ${String(commonHour).padStart(2, "0")}:00. Mình chỉ chọn một việc thôi nhé.` : "Lumi chưa thấy đủ dữ liệu để kết luận. Mình ghi nhận nhẹ nhàng thêm vài lần nữa nhé.";
  return { totalEvents: events.length, startsAfterDelay: started, commonHour, commonReason, completedSmallStarts: events.filter((event) => event.kind === "started_small").length, completionRate: started ? Math.round(completed / started * 100) : 0, insight };
}
