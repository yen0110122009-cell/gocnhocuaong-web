import { Activity, CalendarDays, Clock3, Flame, Target, TrendingUp } from "lucide-react";
import type { ProfileState } from "../../../shared/study";
import { formatStudyMinutes, goalPercent, studyDayHistory, subjectNames, subjectHistory, type StudyTimeGoals } from "../../../shared/studyTimeAnalytics";

type Props = { profile: ProfileState; goals: StudyTimeGoals; todaySeconds: number; weekSeconds: number };
type RecentSession = NonNullable<ProfileState["pomodoroHistory"]>[number];

function toDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }
function sessionDate(session: RecentSession) { return toDate(session.startedAt) ?? toDate(session.endedAt); }
function hours(seconds: number) { return `${(Math.max(0, seconds) / 3_600).toFixed(1)} giờ`; }
function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function weekDates(anchor = new Date()) {
  const monday = new Date(anchor); monday.setHours(12, 0, 0, 0); const day = monday.getDay(); monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, index) => { const date = new Date(monday); date.setDate(monday.getDate() + index); return date; });
}

export function StudyProgressOverview({ profile, goals, todaySeconds, weekSeconds }: Props) {
  const dayHistory = studyDayHistory(profile, new Date(), 60);
  const historyMap = new Map(dayHistory.map((day) => [day.key, day]));
  const recentSessions = (profile.pomodoroHistory ?? []).filter((session) => session.mode === "focus" && session.status === "completed" && session.durationMinutes > 0 && sessionDate(session)).sort((a, b) => (sessionDate(b)?.getTime() ?? 0) - (sessionDate(a)?.getTime() ?? 0)).slice(0, 6);
  const subjectRows = subjectNames(profile).map((subject) => ({ subject, seconds: subjectHistory(profile, subject).totalSeconds })).filter((item) => item.seconds > 0).sort((a, b) => b.seconds - a.seconds).slice(0, 6);
  const totalFocusSeconds = subjectRows.reduce((sum, item) => sum + item.seconds, 0);
  const averageSeconds = dayHistory.filter((day) => { const date = toDate(`${day.key}T12:00:00`); return date && date.getTime() >= Date.now() - 6 * 86_400_000; }).reduce((sum, day) => sum + day.seconds, 0) / 7;
  const dailyPercent = goalPercent(Math.round(todaySeconds / 60), goals.dailyMinutes);
  const weeklyPercent = goalPercent(Math.round(weekSeconds / 60), goals.weeklyMinutes);
  const weeklyTargetReached = goals.weeklyMinutes > 0 && weekSeconds >= goals.weeklyMinutes * 60;
  const maxDaySeconds = Math.max(1, ...weekDates().map((date) => historyMap.get(dateKey(date))?.seconds ?? 0));
  const weekCells = weekDates();
  const weekdayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const palette = ["var(--scene-accent, #c62828)", "var(--scene-accent-alt, #f4b942)", "color-mix(in srgb, var(--scene-accent, #c62828) 65%, var(--scene-accent-alt, #f4b942))", "color-mix(in srgb, var(--scene-accent, #c62828) 35%, var(--scene-card, #fffdf8))", "color-mix(in srgb, var(--scene-accent-alt, #f4b942) 55%, var(--scene-card, #fffdf8))", "var(--scene-border, #ead8c4)"];

  return <section className="study-progress-overview" aria-label="Tổng quan tiến độ học tập">
    <div className="study-overview-heading"><div><p className="study-overview-eyebrow">Bảng điều khiển học tập</p><h2 className="study-overview-title">Nhịp học của Ong</h2><p className="study-overview-subtitle">Tóm tắt nhanh thời gian học, phiên gần đây và tiến độ trong tuần.</p></div><div className="study-overview-status"><Activity className="h-4 w-4" aria-hidden="true" />Dữ liệu thật từ Pomodoro</div></div>
    <div className="study-kpi-grid">
      <article className="study-kpi-card"><div><span>Tổng giờ học</span><strong>{hours(totalFocusSeconds)}</strong><small>{formatStudyMinutes(totalFocusSeconds)} Pomodoro hoàn thành</small></div><span className="study-kpi-icon"><Clock3 className="h-5 w-5" aria-hidden="true" /></span></article>
      <article className="study-kpi-card"><div><span>Hôm nay</span><strong>{hours(todaySeconds)}</strong><small>{formatStudyMinutes(todaySeconds)} đã ghi nhận</small></div><span className="study-kpi-icon"><CalendarDays className="h-5 w-5" aria-hidden="true" /></span></article>
      <article className="study-kpi-card"><div><span>Trung bình / ngày</span><strong>{hours(averageSeconds)}</strong><small>Trung bình 7 ngày gần nhất</small></div><span className="study-kpi-icon"><TrendingUp className="h-5 w-5" aria-hidden="true" /></span></article>
      <article className="study-kpi-card"><div><span>KPI hôm nay</span><strong>{dailyPercent}%</strong><small>{goals.dailyMinutes ? `${formatStudyMinutes(todaySeconds)} / ${formatStudyMinutes(goals.dailyMinutes * 60)}` : "Chưa đặt mục tiêu ngày"}</small></div><span className="study-kpi-icon"><Target className="h-5 w-5" aria-hidden="true" /></span></article>
      <article className="study-kpi-card"><div><span>KPI tuần</span><strong>{weeklyPercent}%</strong><small>{weeklyTargetReached ? "Đã đạt mục tiêu tuần" : goals.weeklyMinutes ? `${formatStudyMinutes(weekSeconds)} / ${formatStudyMinutes(goals.weeklyMinutes * 60)}` : "Chưa đặt mục tiêu tuần"}</small></div><span className="study-kpi-icon"><Flame className="h-5 w-5" aria-hidden="true" /></span></article>
    </div>
    <div className="study-overview-main-grid">
      <article className="study-overview-card study-recent-card"><div className="study-card-heading"><div><span className="study-card-kicker">Pomodoro</span><h3>Phiên học gần đây</h3></div><span className="study-count-pill">{recentSessions.length} phiên</span></div><div className="study-recent-list">{recentSessions.length ? recentSessions.map((session) => { const date = sessionDate(session); return <div className="study-recent-row" key={session.id}><span className="study-session-number">{session.sessionNumber}</span><div className="study-recent-copy"><strong>{session.subject?.trim() || "Chưa chọn môn"}</strong><small>{session.topic?.trim() || "Phiên tập trung"} · {date?.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</small></div><b>{formatStudyMinutes(session.durationMinutes * 60)}</b></div>; }) : <p className="study-empty-state">Chưa có phiên Pomodoro hoàn thành.</p>}</div><p className="study-helper-text">Mỗi dòng là một phiên tập trung đã hoàn thành. Môn, nội dung và số phút được lấy từ lịch sử Pomodoro để bạn kiểm tra nhanh mình vừa học gì.</p></article>
      <article className="study-overview-card study-subject-card"><div className="study-card-heading"><div><span className="study-card-kicker">Phân bổ thời gian</span><h3>Buổi học theo môn</h3></div><span className="study-count-pill">{subjectRows.length} môn</span></div>{subjectRows.length ? <div className="study-subject-layout"><div className="study-donut" style={{ background: `conic-gradient(${subjectRows.map((item, index) => `${palette[index % palette.length]} ${(subjectRows.slice(0, index).reduce((sum, current) => sum + current.seconds, 0) / totalFocusSeconds) * 360}deg ${((subjectRows.slice(0, index + 1).reduce((sum, current) => sum + current.seconds, 0) / totalFocusSeconds) * 360)}deg`).join(", ")})` }} role="img" aria-label="Biểu đồ phân bổ thời gian theo môn"><div><strong>{hours(totalFocusSeconds)}</strong><span>Tổng học</span></div></div><div className="study-subject-legend">{subjectRows.map((item, index) => <div key={item.subject}><span style={{ background: palette[index % palette.length] }} /><div><strong>{item.subject}</strong><small>{formatStudyMinutes(item.seconds)} · {Math.round(item.seconds / totalFocusSeconds * 100)}%</small></div></div>)}</div></div> : <p className="study-empty-state">Hãy hoàn thành một phiên để xem phân bổ theo môn.</p>}</article>
    </div>
    <article className="study-overview-card study-heatmap-card"><div className="study-card-heading"><div><span className="study-card-kicker">Nhịp học tuần này</span><h3>Tiến độ theo ngày</h3></div><span className="study-count-pill">{formatStudyMinutes(weekSeconds)} / tuần</span></div><div className="study-heatmap"><div className="study-heatmap-labels">{weekdayLabels.map((label) => <span key={label}>{label}</span>)}</div><div className="study-heatmap-grid">{weekCells.map((date) => { const day = historyMap.get(dateKey(date)); const ratio = day ? Math.min(1, day.seconds / maxDaySeconds) : 0; const opacity = ratio ? 35 + Math.round(ratio * 65) : 0; return <div key={dateKey(date)} className="study-heatmap-cell" title={`${date.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" })}: ${day ? formatStudyMinutes(day.seconds) : "0 phút"}`} style={{ background: opacity ? `color-mix(in srgb, var(--scene-accent, #c62828) ${opacity}%, var(--scene-card, #fffdf8))` : "color-mix(in srgb, var(--scene-card, #fffdf8) 88%, transparent)" }} aria-label={`${date.toLocaleDateString("vi-VN")}: ${day ? formatStudyMinutes(day.seconds) : "0 phút"}`} />; })}</div></div><div className="study-heatmap-footer"><span>Ít hơn</span><i /><i /><i /><i /><span>Nhiều hơn</span></div></article>
  </section>;
}

export default StudyProgressOverview;
