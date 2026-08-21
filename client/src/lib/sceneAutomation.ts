import type { AmbientScenePreference, SceneAutomationSettings } from "@shared/study";

/** Ngày lễ cố định được tính tại thiết bị; không cần job nền khi người học đang mở web. */
export function fixedHolidayScene(now: Date): AmbientScenePreference | null {
  const key = `${now.getMonth() + 1}-${now.getDate()}`;
  if (["1-1", "9-2"].includes(key)) return "tet";
  if (["4-30", "5-1"].includes(key)) return "summer";
  if (key === "10-31") return "halloween";
  return null;
}

export function hourIsInsideRule(hour: number, startHour: number, endHour: number) {
  return startHour === endHour ? true : startHour < endHour ? hour >= startHour && hour < endHour : hour >= startHour || hour < endHour;
}

export function resolveAutomatedScene(settings: SceneAutomationSettings | undefined, now = new Date()): AmbientScenePreference | null {
  if (!settings?.enabled) return null;
  if (settings.applyFixedHolidays) {
    const holiday = fixedHolidayScene(now);
    if (holiday) return holiday;
  }
  return settings.timeRules.find((rule) => hourIsInsideRule(now.getHours(), rule.startHour, rule.endHour))?.scene ?? null;
}
