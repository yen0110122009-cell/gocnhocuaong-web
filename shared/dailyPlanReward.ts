import type { DailyPhoneRewardSettings, DailyPhoneRewardClaim, ProfileState, StudyPlanItem } from "./study";

export type DailyPlanSummary = {
  date: string;
  items: StudyPlanItem[];
  completedItems: StudyPlanItem[];
  studySeconds: number;
  studyMinutes: number;
  totalItems: number;
  completedCount: number;
  isComplete: boolean;
  rewardMinutes: number;
  claimed: boolean;
  rewardSettings: DailyPhoneRewardSettings;
};

export function localDateKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isCompletedOnDate(item: StudyPlanItem, date: string) {
  if (!item.completed) return false;
  return !item.completedAt || localDateKey(item.completedAt) === date;
}

export const DEFAULT_DAILY_PHONE_REWARD_SETTINGS: DailyPhoneRewardSettings = { baseMinutes: 10, bonusMinutesPerStudyBlock: 5 };

export function normalizeDailyPhoneRewardSettings(value: Partial<DailyPhoneRewardSettings> | null | undefined): DailyPhoneRewardSettings {
  const baseMinutes = typeof value?.baseMinutes === "number" && Number.isFinite(value.baseMinutes) ? value.baseMinutes : DEFAULT_DAILY_PHONE_REWARD_SETTINGS.baseMinutes;
  const bonusMinutesPerStudyBlock = typeof value?.bonusMinutesPerStudyBlock === "number" && Number.isFinite(value.bonusMinutesPerStudyBlock) ? value.bonusMinutesPerStudyBlock : DEFAULT_DAILY_PHONE_REWARD_SETTINGS.bonusMinutesPerStudyBlock;
  return {
    baseMinutes: Math.max(0, Math.min(120, Math.floor(baseMinutes))),
    bonusMinutesPerStudyBlock: Math.max(0, Math.min(30, Math.floor(bonusMinutesPerStudyBlock))),
  };
}

function rewardMinutesForStudy(studySeconds: number, settings: DailyPhoneRewardSettings) {
  // Mỗi khối học được tính là 30 phút; tổng thưởng tối đa 120 phút/ngày.
  return Math.min(120, settings.baseMinutes + Math.floor(studySeconds / (30 * 60)) * settings.bonusMinutesPerStudyBlock);
}

export function dailyPlanSummary(profile: Pick<ProfileState, "studyPlanItems" | "studyActivity" | "dailyPhoneRewardClaims" | "dailyPhoneRewardSettings">, date = localDateKey(new Date())): DailyPlanSummary {
  const rewardSettings = normalizeDailyPhoneRewardSettings(profile.dailyPhoneRewardSettings);
  const items = (profile.studyPlanItems ?? []).filter((item) => item.cadence === "day" && item.scheduledFor === date);
  const completedItems = items.filter((item) => isCompletedOnDate(item, date));
  const studySeconds = (profile.studyActivity ?? [])
    .filter((activity) => localDateKey(activity.occurredAt) === date && activity.kind !== "wheel")
    .reduce((total, activity) => total + Math.max(0, activity.durationSeconds), 0);
  const claimed = (profile.dailyPhoneRewardClaims ?? []).some((claim) => claim.date === date);
  const isComplete = items.length > 0 && completedItems.length === items.length;
  return {
    date,
    items,
    completedItems,
    studySeconds,
    studyMinutes: Math.floor(studySeconds / 60),
    totalItems: items.length,
    completedCount: completedItems.length,
    isComplete,
    rewardMinutes: isComplete ? rewardMinutesForStudy(studySeconds, rewardSettings) : 0,
    claimed,
    rewardSettings,
  };
}

export function claimDailyPhoneReward(profile: ProfileState, date = localDateKey(new Date()), claimedAt = new Date().toISOString()) {
  const summary = dailyPlanSummary(profile, date);
  if (!summary.isComplete || summary.claimed) return { profile, summary, claimed: false };
  const claim: DailyPhoneRewardClaim = {
    date,
    claimedAt,
    studySeconds: summary.studySeconds,
    rewardMinutes: summary.rewardMinutes,
    completedPlanItemIds: summary.completedItems.map((item) => item.id),
  };
  return {
    profile: { ...profile, dailyPhoneRewardClaims: [...(profile.dailyPhoneRewardClaims ?? []), claim] },
    summary: { ...summary, claimed: true },
    claimed: true,
  };
}

export function formatStudyDuration(seconds: number) {
  const minutes = Math.floor(Math.max(0, seconds) / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours ? `${hours} giờ ${remainingMinutes} phút` : `${remainingMinutes} phút`;
}
