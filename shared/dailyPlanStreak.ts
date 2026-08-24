import type { ProfileState, StudyPlanItem } from "./study";
import { localDateKey } from "./dailyPlanReward";

export type DailyPlanStreakDay = {
  date: string;
  label: string;
  hasPlan: boolean;
  completedCount: number;
  totalItems: number;
  isComplete: boolean;
};

export type DailyPlanStreakSummary = {
  days: DailyPlanStreakDay[];
  currentStreak: number;
  bestStreak: number;
  completedDates: string[];
};

function dateWithOffset(date: Date, offset: number) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + offset);
  return result;
}

function isCompletedOnDate(item: StudyPlanItem, date: string) {
  return item.completed && (!item.completedAt || localDateKey(item.completedAt) === date);
}

function dayLabel(date: Date) {
  return date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }).replace(/^Thứ /, "T");
}

export function dailyPlanStreak(profile: Pick<ProfileState, "studyPlanItems">, endDate = new Date(), days = 14): DailyPlanStreakSummary {
  const items = (profile.studyPlanItems ?? []).filter((item) => item.cadence === "day" && /^\d{4}-\d{2}-\d{2}$/.test(item.scheduledFor));
  const history = Array.from({ length: Math.max(1, days) }, (_, index) => {
    const dateObject = dateWithOffset(endDate, -(Math.max(1, days) - 1 - index));
    const date = localDateKey(dateObject);
    const dayItems = items.filter((item) => item.scheduledFor === date);
    const completedCount = dayItems.filter((item) => isCompletedOnDate(item, date)).length;
    return { date, label: dayLabel(dateObject), hasPlan: dayItems.length > 0, completedCount, totalItems: dayItems.length, isComplete: dayItems.length > 0 && completedCount === dayItems.length };
  });
  const completeDates = new Set(items.reduce<string[]>((dates, item) => {
    if (!dates.includes(item.scheduledFor)) dates.push(item.scheduledFor);
    return dates;
  }, []).filter((date) => {
    const dateItems = items.filter((item) => item.scheduledFor === date);
    return dateItems.length > 0 && dateItems.every((item) => isCompletedOnDate(item, date));
  }));
  const allDates = Array.from(new Set(items.map((item) => item.scheduledFor))).sort();
  let bestStreak = 0;
  let run = 0;
  for (let index = 0; index < allDates.length; index += 1) {
    const current = allDates[index];
    const previous = allDates[index - 1];
    const previousDate = previous ? new Date(`${previous}T00:00:00`) : null;
    const currentDate = new Date(`${current}T00:00:00`);
    const consecutive = previousDate !== null && (currentDate.getTime() - previousDate.getTime()) === 86_400_000;
    run = completeDates.has(current) ? (consecutive && completeDates.has(previous) ? run + 1 : 1) : 0;
    bestStreak = Math.max(bestStreak, run);
  }
  const today = localDateKey(endDate);
  let currentStreak = 0;
  if (completeDates.has(today)) {
    currentStreak = 1;
    let cursor = dateWithOffset(endDate, -1);
    while (completeDates.has(localDateKey(cursor))) {
      currentStreak += 1;
      cursor = dateWithOffset(cursor, -1);
    }
  }
  return { days: history, currentStreak, bestStreak, completedDates: Array.from(completeDates).sort() };
}
