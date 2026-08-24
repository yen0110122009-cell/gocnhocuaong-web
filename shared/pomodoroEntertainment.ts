import { normalizeEntertainmentConversionSettings, type EntertainmentConversionSettings, type ProfileState } from "./study";

export const ENTERTAINMENT_STUDY_BLOCK_MINUTES = 30;
export const ENTERTAINMENT_MINUTES_PER_BLOCK = 10;
export const MAX_DAILY_ENTERTAINMENT_MINUTES = 120;

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function completedFocusMinutesForDay(profile: Pick<ProfileState, "pomodoroHistory">, date: Date) {
  const key = dateKey(date);
  return (profile.pomodoroHistory ?? []).reduce((total, session) => {
    if (session.mode !== "focus" || session.status !== "completed" || session.durationMinutes <= 0) return total;
    const endedAt = new Date(session.endedAt);
    return !Number.isNaN(endedAt.getTime()) && dateKey(endedAt) === key ? total + session.durationMinutes : total;
  }, 0);
}

export function entertainmentMinutesFromStudy(studyMinutes: number, rawSettings?: EntertainmentConversionSettings) {
  const settings = normalizeEntertainmentConversionSettings(rawSettings);
  const safeMinutes = Math.max(0, Math.floor(Number(studyMinutes) || 0));
  return Math.min(settings.dailyCapMinutes, Math.floor(safeMinutes / settings.studyBlockMinutes) * settings.entertainmentMinutesPerBlock);
}

export function dailyEntertainmentReward(profile: Pick<ProfileState, "pomodoroHistory">, date = new Date(), rawSettings?: EntertainmentConversionSettings) {
  const studyMinutes = completedFocusMinutesForDay(profile, date);
  return { studyMinutes, entertainmentMinutes: entertainmentMinutesFromStudy(studyMinutes, rawSettings) };
}

export function weeklyEntertainmentReward(profile: Pick<ProfileState, "pomodoroHistory">, date = new Date(), rawSettings?: EntertainmentConversionSettings) {
  const end = new Date(date); end.setHours(23, 59, 59, 999);
  const day = end.getDay();
  const start = new Date(end); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
  const studyMinutes = (profile.pomodoroHistory ?? []).reduce((total, session) => {
    if (session.mode !== "focus" || session.status !== "completed" || session.durationMinutes <= 0) return total;
    const endedAt = new Date(session.endedAt);
    return !Number.isNaN(endedAt.getTime()) && endedAt >= start && endedAt <= end ? total + session.durationMinutes : total;
  }, 0);
  return { studyMinutes, entertainmentMinutes: entertainmentMinutesFromStudy(studyMinutes, rawSettings) };
}
