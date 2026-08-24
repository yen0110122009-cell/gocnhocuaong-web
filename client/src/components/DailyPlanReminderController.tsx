import { useEffect } from "react";
import { dailyPlanReminderMessage, dailyPlanReminderStatus, isDailyPlanReminderDue } from "../../../shared/dailyPlanReminder";
import type { ProfileState } from "../../../shared/study";

type Props = { profile: ProfileState; isGuest?: boolean };
const SENT_STORAGE_KEY = "gocnhocuaong_daily_plan_reminder_sent";
const localDateKey = (date: Date) => { const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, "0"); const day = String(date.getDate()).padStart(2, "0"); return `${year}-${month}-${day}`; };

export function DailyPlanReminderController({ profile, isGuest = false }: Props) {
  useEffect(() => {
    if (typeof window === "undefined" || isGuest) return;
    const checkReminder = () => {
      if (!("Notification" in window) || Notification.permission !== "granted" || !isDailyPlanReminderDue(profile, new Date())) return;
      const status = dailyPlanReminderStatus(profile, localDateKey(new Date()));
      const sentKey = `${SENT_STORAGE_KEY}:${status.date}`;
      try {
        if (window.localStorage.getItem(sentKey) === "sent") return;
        new Notification("Lumi nhắc bảo vệ streak", { body: dailyPlanReminderMessage(status), tag: sentKey });
        window.localStorage.setItem(sentKey, "sent");
      } catch { /* Trình duyệt có thể chặn Notification hoặc localStorage. */ }
    };
    checkReminder();
    const timer = window.setInterval(checkReminder, 60_000);
    return () => window.clearInterval(timer);
  }, [profile, isGuest]);
  return null;
}
