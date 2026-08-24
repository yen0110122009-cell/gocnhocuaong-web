import { normalizeEntertainmentConversionSettings, type EntertainmentConversionSettings, type ProfileState } from "./study";

export const ENTERTAINMENT_STUDY_BLOCK_MINUTES = 30;
export const ENTERTAINMENT_MINUTES_PER_BLOCK = 10;
export const MAX_DAILY_ENTERTAINMENT_MINUTES = 120;

type EntertainmentProfile = Pick<ProfileState, "pomodoroHistory">;
export type EntertainmentDayHistory = { key: string; label: string; studyMinutes: number; entertainmentMinutes: number; sessions: number };

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function sessionDate(session: EntertainmentProfile["pomodoroHistory"][number]) {
  const startedAt = new Date(session.startedAt);
  if (!Number.isNaN(startedAt.getTime())) return startedAt;
  const endedAt = new Date(session.endedAt);
  return Number.isNaN(endedAt.getTime()) ? null : endedAt;
}

function completedFocusMinutesForDay(profile: EntertainmentProfile, date: Date) {
  const key = dateKey(date);
  return (profile.pomodoroHistory ?? []).reduce((total, session) => {
    if (session.mode !== "focus" || session.status !== "completed" || session.durationMinutes <= 0) return total;
    const studyDate = sessionDate(session);
    return studyDate && dateKey(studyDate) === key ? total + session.durationMinutes : total;
  }, 0);
}

export function entertainmentMinutesFromStudy(studyMinutes: number, rawSettings?: EntertainmentConversionSettings) {
  const settings = normalizeEntertainmentConversionSettings(rawSettings);
  const safeMinutes = Math.max(0, Math.floor(Number(studyMinutes) || 0));
  return Math.min(settings.dailyCapMinutes, Math.floor(safeMinutes / settings.studyBlockMinutes) * settings.entertainmentMinutesPerBlock);
}

export function dailyEntertainmentReward(profile: EntertainmentProfile, date = new Date(), rawSettings?: EntertainmentConversionSettings) {
  const studyMinutes = completedFocusMinutesForDay(profile, date);
  return { studyMinutes, entertainmentMinutes: entertainmentMinutesFromStudy(studyMinutes, rawSettings) };
}

export function weeklyEntertainmentReward(profile: EntertainmentProfile, date = new Date(), rawSettings?: EntertainmentConversionSettings) {
  const end = new Date(date); end.setHours(23, 59, 59, 999);
  const day = end.getDay();
  const start = new Date(end); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
  const studyMinutes = (profile.pomodoroHistory ?? []).reduce((total, session) => {
    if (session.mode !== "focus" || session.status !== "completed" || session.durationMinutes <= 0) return total;
    const studyDate = sessionDate(session);
    return studyDate && studyDate >= start && studyDate <= end ? total + session.durationMinutes : total;
  }, 0);
  return { studyMinutes, entertainmentMinutes: entertainmentMinutesFromStudy(studyMinutes, rawSettings) };
}

export function entertainmentDayHistory(profile: EntertainmentProfile, anchor = new Date(), days = 30, rawSettings?: EntertainmentConversionSettings): EntertainmentDayHistory[] {
  const end = new Date(anchor); end.setHours(23, 59, 59, 999);
  const start = new Date(end); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - Math.max(1, Math.floor(days)) + 1);
  const map = new Map<string, { studyMinutes: number; sessions: number }>();
  (profile.pomodoroHistory ?? []).forEach((session) => {
    if (session.mode !== "focus" || session.status !== "completed" || session.durationMinutes <= 0) return;
    const studyDate = sessionDate(session);
    if (!studyDate || studyDate < start || studyDate > end) return;
    const key = dateKey(studyDate);
    const current = map.get(key) ?? { studyMinutes: 0, sessions: 0 };
    current.studyMinutes += session.durationMinutes;
    current.sessions += 1;
    map.set(key, current);
  });
  const labelDate = (key: string) => new Date(`${key}T12:00:00`).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
  return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0])).map(([key, value]) => ({ key, label: labelDate(key), studyMinutes: value.studyMinutes, entertainmentMinutes: entertainmentMinutesFromStudy(value.studyMinutes, rawSettings), sessions: value.sessions }));
}
