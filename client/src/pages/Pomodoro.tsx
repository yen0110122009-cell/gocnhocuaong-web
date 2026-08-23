import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { AppConfig, PomodoroSession, ProfileState } from "../../../shared/study";
import { readPersistedPomodoro, recoverRunningSeconds, writePersistedPomodoro } from "../lib/pomodoroPersistence";

type Mode = "focus" | "shortBreak" | "longBreak";
type Activity = "flashcards" | "quizzes" | "theory" | "deep" | "reading" | "exercise";
type LumiSupportKind = "comfort" | "encouragement";
type View = "pomodoro" | "flashcards" | "quizzes" | "history" | "plans";
type Props = { profile: ProfileState; config: AppConfig; onProfile: (profile: ProfileState, message?: string) => void; onView: (view: View) => void; isVisible?: boolean };

const activities: Array<{ id: Activity; label: string; icon: string }> = [
  { id: "flashcards", label: "Flashcard", icon: "🃏" }, { id: "quizzes", label: "Đề kiểm tra", icon: "📝" }, { id: "theory", label: "Ôn lý thuyết", icon: "📖" }, { id: "deep", label: "Hiểu tận gốc", icon: "🧠" }, { id: "reading", label: "Đọc tài liệu", icon: "📚" }, { id: "exercise", label: "Làm bài tập", icon: "✍️" },
];
const presets = [{ label: "10 / 5", focus: 10, short: 5, long: 15 }, { label: "25 / 5", focus: 25, short: 5, long: 15 }, { label: "45 / 10", focus: 45, short: 10, long: 20 }];
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const labelForMode: Record<Mode, string> = { focus: "Tập trung", shortBreak: "Nghỉ ngắn", longBreak: "Nghỉ dài" };

function beep(volume: number, pattern: "start" | "complete" | "break") {
  if (typeof AudioContext === "undefined" || volume <= 0) return;
  try {
    const context = new AudioContext();
    const frequencies = pattern === "complete" ? [660, 880, 1046] : pattern === "break" ? [440, 554] : [523, 659];
    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator(); const gain = context.createGain(); const start = context.currentTime + index * 0.18;
      oscillator.frequency.value = frequency; oscillator.type = "sine"; gain.gain.setValueAtTime(0.001, start); gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume / 100 * 0.22), start + 0.02); gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
      oscillator.connect(gain).connect(context.destination); oscillator.start(start); oscillator.stop(start + 0.17);
    });
    window.setTimeout(() => void context.close(), 1_200);
  } catch { /* Browser may require a prior user gesture; the timer remains available. */ }
}

export default function Pomodoro({ profile, config, onProfile, onView, isVisible = true }: Props) {
  const restored = useMemo(() => readPersistedPomodoro(), []);
  const [focus, setFocus] = useState(restored?.focus ?? 25);
  const [shortBreak, setShortBreak] = useState(restored?.shortBreak ?? 5);
  const [longBreak, setLongBreak] = useState(restored?.longBreak ?? 15);
  const [seconds, setSeconds] = useState(() => restored ? recoverRunningSeconds(restored) : 25 * 60);
  const [mode, setMode] = useState<Mode>(restored?.mode ?? "focus");
  const [running, setRunning] = useState(restored?.running ?? false);
  const [autoAdvance, setAutoAdvance] = useState(restored?.autoAdvance ?? false);
  const [pendingTransition, setPendingTransition] = useState<"break" | "focus" | null>(restored?.pendingTransition ?? null);
  const [subject, setSubject] = useState(restored?.subject ?? "");
  const [topic, setTopic] = useState(restored?.topic ?? "");
  const [activity, setActivity] = useState<Activity>((restored?.activity as Activity) ?? "theory");
  const [notes, setNotes] = useState(restored?.notes ?? "");
  const [checkedPlanItemIds, setCheckedPlanItemIds] = useState<string[]>(restored?.checkedPlanItemIds ?? []);
  const [totalSessions, setTotalSessions] = useState(restored?.totalSessions ?? 4);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(restored?.sessionStartedAt ?? null);
  const [alertVolume, setAlertVolume] = useState(restored?.alertVolume ?? profile.audioMixer?.pomodoroBell ?? 85);
  const [compactMode, setCompactMode] = useState(restored?.compactMode ?? false);
  const [miniPlayerPinned, setMiniPlayerPinned] = useState(restored?.miniPlayerPinned ?? false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showReasons, setShowReasons] = useState(false);
  const [supportMessage, setSupportMessage] = useState<{ kind: LumiSupportKind; text: string; audioUrl?: string } | null>(null);
  const completedFocusRef = useRef(0);
  const completionHandled = useRef(false);
  const incompletePlans = (profile.studyPlanItems ?? []).filter((item) => !item.completed);
  const selectedPlans = incompletePlans.filter((item) => checkedPlanItemIds.includes(item.id));
  const completedFocusCount = profile.pomodoroHistory.filter((item) => item.mode === "focus" && item.status === "completed").length;
  const activeMinutes = mode === "focus" ? focus : mode === "shortBreak" ? shortBreak : longBreak;
  const display = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const lumiMode = profile.pomodoroLumiSupportMode ?? "encouragement";

  useEffect(() => {
    writePersistedPomodoro({ focus, shortBreak, longBreak, seconds, mode, running, autoAdvance, pendingTransition, subject, topic, activity, notes, checkedPlanItemIds, totalSessions, sessionStartedAt, alertVolume, compactMode, miniPlayerPinned });
  }, [focus, shortBreak, longBreak, seconds, mode, running, autoAdvance, pendingTransition, subject, topic, activity, notes, checkedPlanItemIds, totalSessions, sessionStartedAt, alertVolume, compactMode, miniPlayerPinned]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1_000);
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (seconds !== 0 || completionHandled.current) return;
    completionHandled.current = true;
    if (mode === "focus") completeFocus(); else completeBreak();
  }, [seconds, mode]);
  useEffect(() => {
    if (!running || mode !== "focus" || lumiMode === "off" || profile.popupsEnabled === false) return;
    const reminder = window.setTimeout(() => setSupportMessage(createSupport(lumiMode === "comfort" ? "comfort" : "encouragement")), 5 * 60_000);
    return () => window.clearTimeout(reminder);
  }, [running, mode, lumiMode, profile.popupsEnabled]);

  function createSupport(kind: LumiSupportKind) {
    const stateId = kind === "comfort" ? "mistake" : "encouragement";
    const state = (config.mascotStates ?? []).find((item) => item.id === stateId && item.enabled && !item.deletedAt);
    const line = (config.mascotVoiceLines ?? []).find((item) => item.state === stateId && item.enabled && !item.deletedAt);
    const custom = (config.customContent ?? []).find((item) => item.enabled && !item.deletedAt && item.modules.includes("pomodoro"));
    return { kind, text: line?.text || custom?.text || state?.description || (kind === "comfort" ? "Không sao nếu hôm nay chậm. Mình cùng quay lại bằng một bước vừa sức nhé." : "Mỗi phút bạn đang ở lại với việc học đều đáng được ghi nhận."), audioUrl: line?.audioUrl };
  }
  function askLumi(kind: LumiSupportKind) { setSupportMessage(createSupport(kind)); setShowSupport(true); }
  function playSupport() {
    if (!supportMessage?.audioUrl) return;
    const audio = new Audio(supportMessage.audioUrl); audio.volume = clamp((profile.audioMixer?.lumi ?? 75) / 100, 0, 1); void audio.play().catch(() => toast.error("Không thể phát bản thu trên thiết bị này. Bạn vẫn có thể đọc lời nhắn của Lumi."));
  }
  function recordAvoidance(reason: string) {
    onProfile({ ...profile, avoidanceReasons: [{ id: crypto.randomUUID(), occurredAt: new Date().toISOString(), reason: reason as never }, ...(profile.avoidanceReasons ?? [])].slice(0, 100) }, "Lumi đã ghi nhận để hỗ trợ bạn nhẹ nhàng hơn, không dùng để chấm điểm.");
    setShowReasons(false);
  }
  function restore() {
    const saved = readPersistedPomodoro();
    if (!saved) { toast.info("Chưa có phiên Pomodoro để khôi phục."); return; }
    const recovered = recoverRunningSeconds(saved);
    setFocus(saved.focus); setShortBreak(saved.shortBreak); setLongBreak(saved.longBreak); setSeconds(recovered); setMode(saved.mode); setRunning(saved.running && recovered > 0); setAutoAdvance(saved.autoAdvance); setPendingTransition(saved.pendingTransition ?? null); setSubject(saved.subject); setTopic(saved.topic); setActivity((saved.activity as Activity) ?? "theory"); setNotes(saved.notes ?? ""); setCheckedPlanItemIds(saved.checkedPlanItemIds ?? []); setTotalSessions(saved.totalSessions); setSessionStartedAt(saved.sessionStartedAt); setAlertVolume(saved.alertVolume); setCompactMode(saved.compactMode); setMiniPlayerPinned(saved.miniPlayerPinned); completionHandled.current = false;
    toast.success(saved.running && recovered > 0 ? "Đã khôi phục phiên Pomodoro đang chạy." : "Đã khôi phục phiên Pomodoro đã lưu.");
  }
  function begin() {
    if (pendingTransition === "break") { setPendingTransition(null); setSeconds((mode === "longBreak" ? longBreak : shortBreak) * 60); setRunning(true); completionHandled.current = false; beep(alertVolume, "break"); return; }
    if (pendingTransition === "focus") { setPendingTransition(null); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(new Date().toISOString()); setRunning(true); completionHandled.current = false; beep(alertVolume, "start"); return; }
    if (running) { setRunning(false); return; }
    if (mode === "focus" && !sessionStartedAt) setSessionStartedAt(new Date().toISOString());
    setRunning(true); completionHandled.current = false; beep(alertVolume, "start");
  }
  function reset() { if (running && !window.confirm("Đặt lại phiên đang chạy? Thời gian chưa hoàn thành sẽ không được ghi nhận.")) return; setRunning(false); setPendingTransition(null); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(null); completionHandled.current = false; }
  function completeFocus() {
    const endedAt = new Date().toISOString(); const activityLabel = activities.find((item) => item.id === activity)?.label ?? "Học tập";
    const session: PomodoroSession = { id: crypto.randomUUID(), startedAt: sessionStartedAt ?? new Date(Date.now() - focus * 60_000).toISOString(), endedAt, durationMinutes: focus, subject: subject.trim() || "Tự học", topic: topic.trim() || activityLabel, activity: activityLabel, notes: notes.trim() || undefined, checkedPlanItemIds, checkedPlanTitles: selectedPlans.map((item) => item.title), sessionNumber: completedFocusCount % 4 + 1, totalSessions, mode: "focus", status: "completed" };
    const activityRow = { id: `pomodoro-${session.id}`, occurredAt: endedAt, kind: "pomodoro" as const, quantity: 1, durationSeconds: focus * 60, xpEarned: 0 };
    onProfile({ ...profile, pomodoroHistory: [session, ...profile.pomodoroHistory].slice(0, 500), studyActivity: [activityRow, ...profile.studyActivity].slice(0, 2_000) }, "Đã lưu phiên Pomodoro vào Lịch sử học. Không có XP hay Thành tích tự động.");
    completedFocusRef.current += 1; const nextMode: Mode = (completedFocusCount + 1) % 4 === 0 ? "longBreak" : "shortBreak"; setSessionStartedAt(null); beep(alertVolume, "complete");
    if (autoAdvance) { setMode(nextMode); setSeconds((nextMode === "longBreak" ? longBreak : shortBreak) * 60); setRunning(true); completionHandled.current = false; beep(alertVolume, "break"); toast.success("Đã hoàn thành phiên. Pomodoro chuyển sang thời gian nghỉ."); }
    else { setMode(nextMode); setSeconds(0); setRunning(false); setPendingTransition("break"); completionHandled.current = false; toast.success("Đã hoàn thành phiên. Khi sẵn sàng, bạn có thể bắt đầu nghỉ."); }
  }
  function completeBreak() {
    beep(alertVolume, "break");
    if (autoAdvance) { setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(new Date().toISOString()); setRunning(true); completionHandled.current = false; }
    else { setMode("focus"); setRunning(false); setPendingTransition("focus"); completionHandled.current = false; }
  }
  function choosePreset(value: typeof presets[number]) { if (running && !window.confirm("Đổi nhịp học sẽ dừng phiên hiện tại. Tiếp tục?")) return; setRunning(false); setFocus(value.focus); setShortBreak(value.short); setLongBreak(value.long); setMode("focus"); setSeconds(value.focus * 60); setSessionStartedAt(null); }
  function togglePlan(id: string) { setCheckedPlanItemIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]); }

  const supportButtons = <div className="flex flex-wrap gap-2"><button type="button" className="secondary-button text-xs" onClick={() => askLumi("comfort")}>Cần an ủi</button><button type="button" className="secondary-button text-xs" onClick={() => askLumi("encouragement")}>Cần động viên</button></div>;
  if (!isVisible) {
    if (!(running || miniPlayerPinned)) return null;
    return <aside className="fixed bottom-4 right-4 z-[80] w-[min(92vw,22rem)] rounded-2xl border border-emerald-300/40 bg-[linear-gradient(135deg,#fffdf8_0%,#eff9f0_100%)] p-4 text-slate-900 shadow-2xl" aria-label="Pomodoro đang chạy"><p className="text-[10px] font-black uppercase tracking-[.16em] text-emerald-800">Pomodoro đang chạy</p><p className="mt-1 font-mono text-3xl font-black">{display}</p><p className="text-xs font-semibold text-slate-600">{labelForMode[mode]} · {subject || "Tự học"}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" className="primary-button flex-1" onClick={begin}>{running ? "Tạm dừng" : "Tiếp tục"}</button><button type="button" className="secondary-button text-xs" onClick={() => onView("pomodoro")}>Mở Pomodoro</button></div></aside>;
  }
  return <div className="space-y-5"><header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-xs font-black uppercase tracking-[.18em] text-red-700 dark:text-red-300">Nhịp học tự quản lý</p><h1 className="mt-2 font-display text-4xl font-black">Pomodoro</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Giữ nhịp tập trung, lưu môn học, nội dung và ghi chú của phiên. Bộ đếm vẫn chạy khi bạn đổi menu.</p></div><div className="flex flex-wrap gap-2"><button type="button" className="secondary-button" onClick={() => setCompactMode((value) => !value)}>{compactMode ? "Mở đầy đủ" : "Thu nhỏ"}</button><button type="button" className="secondary-button" onClick={restore}>Khôi phục phiên</button><button type="button" className="secondary-button" onClick={() => onView("history")}>Lịch sử học</button></div></header>
    {compactMode ? <section className="panel p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Pomodoro thu nhỏ</p><p className="font-mono text-5xl font-black text-slate-950 dark:text-white">{display}</p><p className="mt-1 text-xs font-bold text-slate-500">{labelForMode[mode]} · {subject || "Tự học"}</p></div><div className="flex flex-wrap gap-2"><button type="button" className="primary-button" onClick={begin}>{running ? "Tạm dừng" : pendingTransition ? "Tiếp tục" : "Bắt đầu"}</button><button type="button" className="secondary-button" onClick={reset}>Đặt lại</button></div></div><div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">{supportButtons}</div></section> : <>
      <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]"><section className="panel p-6 text-center"><p className="text-xs font-black uppercase tracking-[.18em] text-red-700 dark:text-red-300">{labelForMode[mode]}</p><p className="mt-4 font-mono text-[clamp(4rem,12vw,7rem)] font-black tracking-tight">{display}</p><p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-300">{pendingTransition === "break" ? "Phiên học đã xong. Khi sẵn sàng, hãy bắt đầu nghỉ." : pendingTransition === "focus" ? "Thời gian nghỉ đã xong. Khi sẵn sàng, hãy học tiếp." : running ? "Bộ đếm vẫn tiếp tục khi bạn mở phần khác." : "Chọn nhịp học và bắt đầu khi bạn sẵn sàng."}</p><div className="mt-6 flex flex-wrap justify-center gap-2"><button type="button" className="primary-button min-w-40" onClick={begin}>{running ? "Tạm dừng" : pendingTransition === "break" ? "Bắt đầu nghỉ" : pendingTransition === "focus" ? "Bắt đầu phiên" : "Bắt đầu"}</button><button type="button" className="secondary-button" onClick={reset}>Đặt lại</button><button type="button" className="secondary-button" onClick={() => setMiniPlayerPinned((value) => !value)}>{miniPlayerPinned ? "Bỏ ghim" : "Ghim mini"}</button></div><div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-left dark:bg-emerald-400/10"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-800 dark:text-emerald-200">Lumi ở đây khi bạn cần</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-200">Không có nhiệm vụ ngẫu nhiên hay thử thách ép buộc. Chỉ cần chọn lời hỗ trợ phù hợp với lúc này.</p><div className="mt-3">{supportButtons}</div></div></section>
      <section className="panel p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Trước khi bắt đầu</p><h2 className="mt-1 font-display text-2xl font-black">Bạn đang học gì?</h2></div><button type="button" className="text-sm font-bold text-red-700 underline" onClick={() => setShowSettings((value) => !value)}>{showSettings ? "Ẩn nhịp học" : "Chỉnh nhịp học"}</button></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{activities.map((item) => <button key={item.id} type="button" className={`rounded-xl border p-3 text-left text-xs font-bold ${activity === item.id ? "border-red-500 bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-100" : "border-slate-200 dark:border-white/10"}`} onClick={() => setActivity(item.id)}>{item.icon} {item.label}</button>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Môn học<input className="field mt-2" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Ví dụ: Lịch sử Việt Nam" /></label><label className="text-sm font-bold">Nội dung<input className="field mt-2" value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Ví dụ: Nhà Trần" /></label></div><label className="mt-3 block text-sm font-bold">Ghi chú phiên học<textarea className="field mt-2 min-h-20" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Điều đã học, điểm cần xem lại hoặc cảm nhận ngắn." /></label>{showSettings ? <div className="mt-4 rounded-2xl border border-dashed border-red-200 p-4 dark:border-red-300/20"><div className="grid gap-2 sm:grid-cols-3">{presets.map((preset) => <button key={preset.label} type="button" className="rounded-xl border border-slate-200 p-3 text-left text-sm font-bold dark:border-white/10" onClick={() => choosePreset(preset)}>{preset.label}</button>)}</div><div className="mt-3 grid grid-cols-3 gap-2"><label className="text-xs font-bold">Tập trung<input className="field mt-1" type="number" min="1" max="120" value={focus} onChange={(event) => { const value = clamp(Number(event.target.value) || 1, 1, 120); setFocus(value); if (!running && mode === "focus") setSeconds(value * 60); }} /></label><label className="text-xs font-bold">Nghỉ ngắn<input className="field mt-1" type="number" min="1" max="30" value={shortBreak} onChange={(event) => setShortBreak(clamp(Number(event.target.value) || 1, 1, 30))} /></label><label className="text-xs font-bold">Nghỉ dài<input className="field mt-1" type="number" min="1" max="45" value={longBreak} onChange={(event) => setLongBreak(clamp(Number(event.target.value) || 1, 1, 45))} /></label></div></div> : null}</section></section>
      <section className="panel p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-amber-700">Kế hoạch liên quan</p><h2 className="mt-1 font-display text-2xl font-black">Công việc đang thực hiện trong phiên</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Chọn các mục để lưu cùng lịch sử Pomodoro. Việc đánh dấu hoàn thành và phần thưởng vẫn do bạn thực hiện trong Kế hoạch.</p></div><button type="button" className="secondary-button text-xs" onClick={() => onView("plans")}>Mở Kế hoạch</button></div>{incompletePlans.length ? <div className="mt-4 grid gap-2 md:grid-cols-2">{incompletePlans.map((item) => <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-3 dark:border-white/10"><input className="mt-1" type="checkbox" checked={checkedPlanItemIds.includes(item.id)} onChange={() => togglePlan(item.id)} /><span><b className="block text-sm">{item.title}</b><small className="mt-1 block text-xs text-slate-500">{item.subject ?? "Chưa phân môn"} · {item.cadence === "day" ? "Kế hoạch ngày" : "Kế hoạch tuần"}</small></span></label>)}</div> : <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5">Chưa có kế hoạch mở. Bạn vẫn có thể ghi môn học và nội dung ngay trong phiên này.</p>}</section>
      <section className="panel p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Hỗ trợ chống trì hoãn</p><h2 className="mt-1 font-display text-2xl font-black">Bắt đầu theo cách nhẹ nhàng</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Không phán xét và không chia nhỏ thành nhiệm vụ ngẫu nhiên. Nếu bạn thấy khó bắt đầu, Lumi chỉ dùng thông tin này để đưa lời nhắc phù hợp hơn.</p></div><button type="button" className="secondary-button" onClick={() => setShowReasons((value) => !value)}>{showReasons ? "Thu gọn" : "Điều gì đang làm khó?"}</button></div>{showReasons ? <div className="mt-4 grid gap-2 sm:grid-cols-3">{["Mệt", "Khó bắt đầu", "Nội dung quá nhiều", "Mất tập trung", "Lo lắng", "Không rõ nên làm gì"].map((reason) => <button type="button" key={reason} className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-left text-sm font-bold text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100" onClick={() => recordAvoidance(reason)}>{reason}</button>)}</div> : null}</section>
      <section className="panel p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-red-700">Âm báo và chuyển phiên</p><h2 className="mt-1 font-display text-xl font-black">Chỉ âm báo lúc bắt đầu, kết thúc và chuyển nghỉ</h2></div><button type="button" className="secondary-button text-xs" onClick={() => beep(alertVolume, "complete")}>Nghe thử âm báo</button></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">Âm lượng âm báo · {alertVolume}%<input className="mt-2 w-full" type="range" min="0" max="100" value={alertVolume} onChange={(event) => setAlertVolume(Number(event.target.value))} /></label><fieldset><legend className="text-sm font-bold">Cách chuyển phiên</legend><label className="mt-2 flex gap-2 text-sm"><input type="radio" name="auto" checked={autoAdvance} onChange={() => setAutoAdvance(true)} />Tự động chuyển</label><label className="mt-2 flex gap-2 text-sm"><input type="radio" name="auto" checked={!autoAdvance} onChange={() => setAutoAdvance(false)} />Tôi tự nhấn để chuyển</label></fieldset></div></section>
    </>}
    {showSupport && supportMessage ? <section className="fixed bottom-5 left-1/2 z-[90] w-[min(92vw,38rem)] -translate-x-1/2 rounded-3xl border border-emerald-300 bg-white p-5 shadow-2xl dark:bg-slate-950" role="status"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-700">Lumi · {supportMessage.kind === "comfort" ? "an ủi" : "động viên"}</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-100">{supportMessage.text}</p></div><button type="button" className="secondary-button text-xs" onClick={() => setShowSupport(false)}>Đóng</button></div>{supportMessage.audioUrl ? <button type="button" className="primary-button mt-3 text-xs" onClick={playSupport}>Nghe lời Lumi</button> : null}</section> : null}
  </div>;
}
