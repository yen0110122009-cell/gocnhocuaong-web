import type { PomodoroSession, ProfileState } from "./study";

export const DEFAULT_STUDY_SUBJECTS = ["Toán", "Lý", "Hóa", "Văn", "Anh"] as const;
export type StudyTimeGoals = { dailyMinutes: number; weeklyMinutes: number; subjectDailyMinutes: Record<string, number>; subjectWeeklyMinutes: Record<string, number>; subjectTotalMinutes: Record<string, number> };
export const DEFAULT_STUDY_TIME_GOALS: StudyTimeGoals = { dailyMinutes: 180, weeklyMinutes: 900, subjectDailyMinutes: {}, subjectWeeklyMinutes: {}, subjectTotalMinutes: {} };

type ActivityProfile = Pick<ProfileState, "studyActivity" | "pomodoroHistory" | "studySubjects" | "studyTimeGoals">;
export type SubjectHistory = { subject: string; totalSeconds: number; yearSeconds: number; monthSeconds: number; days: Array<{ key: string; label: string; seconds: number }>; months: Array<{ key: string; label: string; seconds: number; days: Array<{ key: string; label: string; seconds: number }> }>; years: Array<{ key: string; label: string; seconds: number }> };

export function localDateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
export function normalizeStudyTimeGoals(value: unknown): StudyTimeGoals {
  const source = value && typeof value === "object" ? value as Partial<StudyTimeGoals> : {};
  const readSubjectMinutes = (value: unknown, max: number) => value && typeof value === "object" ? Object.fromEntries(Object.entries(value).flatMap(([subject, minutes]) => { const name = subject.trim().slice(0, 80); const amount = Math.max(0, Math.min(max, Math.round(Number(minutes) || 0))); return name && amount > 0 ? [[name, amount]] : []; })) : {};
  const subjectDailyMinutes = readSubjectMinutes(source.subjectDailyMinutes, 1_440);
  const subjectWeeklyMinutes = readSubjectMinutes(source.subjectWeeklyMinutes, 10_080);
  const subjectTotalMinutes = readSubjectMinutes(source.subjectTotalMinutes, 10_000_000);
  return { dailyMinutes: Math.max(0, Math.min(1_440, Math.round(Number(source.dailyMinutes ?? DEFAULT_STUDY_TIME_GOALS.dailyMinutes) || 0))), weeklyMinutes: Math.max(0, Math.min(10_080, Math.round(Number(source.weeklyMinutes ?? DEFAULT_STUDY_TIME_GOALS.weeklyMinutes) || 0))), subjectDailyMinutes, subjectWeeklyMinutes, subjectTotalMinutes };
}
export function normalizeStudySubjects(value: unknown) {
  const custom = Array.isArray(value) ? value.flatMap((subject) => typeof subject === "string" && subject.trim() ? [subject.trim().slice(0, 80)] : []) : [];
  return Array.from(new Set([...DEFAULT_STUDY_SUBJECTS, ...custom])).slice(0, 50);
}
function studyDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
function sessionStudyDate(session: PomodoroSession) {
  const startedAt = studyDate(session.startedAt);
  if (startedAt && startedAt.getTime() > 0) return startedAt;
  return studyDate(session.endedAt);
}
function completedFocusSessions(profile: ActivityProfile): PomodoroSession[] { return (profile.pomodoroHistory ?? []).filter((session) => session.mode === "focus" && session.status === "completed" && session.durationMinutes > 0 && Boolean(sessionStudyDate(session))); }
function completedActivitySeconds(profile: ActivityProfile, predicate: (date: Date) => boolean) { return (profile.studyActivity ?? []).filter((activity) => activity.kind !== "wheel").reduce((total, activity) => { const date = studyDate(activity.occurredAt); return date && predicate(date) ? total + Math.max(0, activity.durationSeconds) : total; }, 0); }
function startOfDay(date: Date) { const value = new Date(date); value.setHours(0, 0, 0, 0); return value; }
function startOfWeek(date: Date) { const value = startOfDay(date); const day = value.getDay(); value.setDate(value.getDate() - (day === 0 ? 6 : day - 1)); return value; }
export function studySecondsForDay(profile: ActivityProfile, date = new Date()) { const key = localDateKey(date); return completedActivitySeconds(profile, (value) => localDateKey(value) === key); }
export function studySecondsForWeek(profile: ActivityProfile, date = new Date()) { const start = startOfWeek(date).getTime(); const end = start + 7 * 86_400_000; return completedActivitySeconds(profile, (value) => value.getTime() >= start && value.getTime() < end); }
export function subjectNames(profile: ActivityProfile) { return normalizeStudySubjects([...(profile.studySubjects ?? []), ...completedFocusSessions(profile).map((session) => session.subject.trim()).filter(Boolean)]); }
function subjectSessionSeconds(profile: ActivityProfile, subject: string, predicate: (date: Date) => boolean) { return completedFocusSessions(profile).filter((session) => session.subject.trim() === subject).reduce((total, session) => { const date = sessionStudyDate(session); return date && predicate(date) ? total + Math.max(0, session.durationMinutes * 60) : total; }, 0); }
export function subjectSecondsForDay(profile: ActivityProfile, subject: string, date = new Date()) { const key = localDateKey(date); return subjectSessionSeconds(profile, subject, (value) => localDateKey(value) === key); }
export function subjectSecondsForWeek(profile: ActivityProfile, subject: string, date = new Date()) { const start = startOfWeek(date).getTime(); const end = start + 7 * 86_400_000; return subjectSessionSeconds(profile, subject, (value) => value.getTime() >= start && value.getTime() < end); }
export function subjectHistory(profile: ActivityProfile, subject: string, anchor = new Date()): SubjectHistory {
  const rows = completedFocusSessions(profile).filter((session) => session.subject.trim() === subject).flatMap((session) => { const date = sessionStudyDate(session); return date ? [{ date, seconds: Math.max(0, session.durationMinutes * 60) }] : []; });
  const currentYear = String(anchor.getFullYear());
  const currentMonth = `${currentYear}-${String(anchor.getMonth() + 1).padStart(2, "0")}`;
  const totalSeconds = rows.reduce((sum, row) => sum + row.seconds, 0);
  const yearSeconds = rows.filter((row) => String(row.date.getFullYear()) === currentYear).reduce((sum, row) => sum + row.seconds, 0);
  const monthSeconds = rows.filter((row) => localDateKey(row.date).slice(0, 7) === currentMonth).reduce((sum, row) => sum + row.seconds, 0);
  const daysMap = new Map<string, number>(); const monthsMap = new Map<string, Map<string, number>>(); const yearsMap = new Map<string, number>();
  rows.forEach(({ date, seconds }) => { const day = localDateKey(date); const month = day.slice(0, 7); const year = day.slice(0, 4); daysMap.set(day, (daysMap.get(day) ?? 0) + seconds); yearsMap.set(year, (yearsMap.get(year) ?? 0) + seconds); const monthDays = monthsMap.get(month) ?? new Map<string, number>(); monthDays.set(day, (monthDays.get(day) ?? 0) + seconds); monthsMap.set(month, monthDays); });
  const labelDate = (key: string) => new Date(`${key}T12:00:00`).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const days = Array.from(daysMap.entries()).sort((a, b) => b[0].localeCompare(a[0])).map(([key, seconds]) => ({ key, label: labelDate(key), seconds }));
  const months = Array.from(monthsMap.entries()).sort((a, b) => b[0].localeCompare(a[0])).map(([key, dayMap]) => ({ key, label: new Date(`${key}-01T12:00:00`).toLocaleDateString("vi-VN", { month: "long", year: "numeric" }), seconds: Array.from(dayMap.values()).reduce((sum, seconds) => sum + seconds, 0), days: Array.from(dayMap.entries()).sort((a, b) => b[0].localeCompare(a[0])).map(([day, seconds]) => ({ key: day, label: labelDate(day), seconds })) }));
  const years = Array.from(yearsMap.entries()).sort((a, b) => b[0].localeCompare(a[0])).map(([key, seconds]) => ({ key, label: `Năm ${key}`, seconds }));
  return { subject, totalSeconds, yearSeconds, monthSeconds, days, months, years };
}
export function formatStudyMinutes(seconds: number) { const minutes = Math.round(Math.max(0, seconds) / 60); if (minutes < 60) return `${minutes} phút`; return `${Math.floor(minutes / 60)} giờ${minutes % 60 ? ` ${minutes % 60} phút` : ""}`; }
export function goalPercent(actualMinutes: number, targetMinutes: number) { return targetMinutes > 0 ? Math.min(100, Math.round(actualMinutes / targetMinutes * 100)) : 0; }
