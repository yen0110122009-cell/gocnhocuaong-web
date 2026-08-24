import type { DailyPlanReminderSettings, ProfileState } from "./study";
import { dailyPlanSummary, localDateKey } from "./dailyPlanReward";

export const DEFAULT_DAILY_PLAN_REMINDER_SETTINGS: DailyPlanReminderSettings = { enabled: true, hour: 20, minute: 0 };

export type DailyPlanReminderStatus = {
  date: string;
  totalItems: number;
  completedCount: number;
  isComplete: boolean;
  shouldRemind: boolean;
};

export function normalizeDailyPlanReminderSettings(value: Partial<DailyPlanReminderSettings> | null | undefined): DailyPlanReminderSettings {
  const hour = Number(value?.hour);
  const minute = Number(value?.minute);
  return {
    enabled: value?.enabled !== false,
    hour: Number.isFinite(hour) ? Math.max(0, Math.min(23, Math.floor(hour))) : DEFAULT_DAILY_PLAN_REMINDER_SETTINGS.hour,
    minute: minute === 30 ? 30 : 0,
  };
}

export function dailyPlanReminderStatus(
  profile: Pick<ProfileState, "studyPlanItems" | "studyActivity" | "dailyPhoneRewardClaims" | "dailyPhoneRewardSettings">,
  date = localDateKey(new Date()),
): DailyPlanReminderStatus {
  const summary = dailyPlanSummary(profile, date);
  return {
    date,
    totalItems: summary.totalItems,
    completedCount: summary.completedCount,
    isComplete: summary.isComplete,
    shouldRemind: summary.totalItems > 0 && !summary.isComplete,
  };
}

export function isDailyPlanReminderDue(
  profile: Pick<ProfileState, "studyPlanItems" | "studyActivity" | "dailyPhoneRewardClaims" | "dailyPhoneRewardSettings" | "dailyPlanReminderSettings">,
  now = new Date(),
): boolean {
  const settings = normalizeDailyPlanReminderSettings(profile.dailyPlanReminderSettings);
  if (!settings.enabled) return false;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const reminderMinutes = settings.hour * 60 + settings.minute;
  if (currentMinutes < reminderMinutes) return false;
  return dailyPlanReminderStatus(profile, localDateKey(now)).shouldRemind;
}

export function dailyPlanReminderMessage(status: DailyPlanReminderStatus) {
  return `Bạn còn ${Math.max(0, status.totalItems - status.completedCount)}/${status.totalItems} mục Kế hoạch ngày chưa hoàn thành. Hoàn thành thêm một bước nhỏ để bảo vệ streak nhé.`;
}
