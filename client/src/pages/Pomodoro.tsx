import { ArrowRight, BarChart3, BookOpen, Check, CircleHelp, Clock3, Flame, Pause, Play, RotateCcw, Settings2, Sparkles, Trophy, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { applyStudyActivityRewards, computedAchievements, type AppConfig, type PomodoroSession, type ProfileState } from "../../../shared/study";

const KEY = "study_historia_pomodoro_v3";
type Mode = "focus" | "shortBreak" | "longBreak";
type Activity = "flashcards" | "quizzes" | "theory" | "deep" | "reading" | "exercise";
type View = "flashcards" | "quizzes" | "achievements" | "museum" | "progress";
type Props = { profile: ProfileState; config: AppConfig; onProfile: (profile: ProfileState, message?: string) => void; onView: (view: View) => void };

type Preset = { label: string; note: string; focus: number; short: number; long: number };
const presets: Preset[] = [
  { label: "Nhanh", note: "10 phút", focus: 10, short: 5, long: 15 },
  { label: "15 phút", note: "15 / 5", focus: 15, short: 5, long: 15 },
  { label: "Pomodoro", note: "25 / 5 · mặc định", focus: 25, short: 5, long: 15 },
  { label: "Học sâu", note: "45 / 10", focus: 45, short: 10, long: 20 },
  { label: "Tập trung dài", note: "50 / 10", focus: 50, short: 10, long: 20 },
];
const activities: { id: Activity; label: string; icon: string }[] = [
  { id: "flashcards", label: "Flashcard", icon: "🃏" },
  { id: "quizzes", label: "Đề kiểm tra", icon: "📝" },
  { id: "theory", label: "Ôn lý thuyết", icon: "📖" },
  { id: "deep", label: "Hiểu tận gốc", icon: "🧠" },
  { id: "reading", label: "Đọc tài liệu", icon: "📚" },
  { id: "exercise", label: "Làm bài tập", icon: "✍️" },
];
const modeLabels: Record<Mode, string> = { focus: "Đang tập trung", shortBreak: "Đang nghỉ ngắn", longBreak: "Đang nghỉ dài" };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const dayKey = (value: string) => new Date(value).toLocaleDateString("vi-VN");

export default function Pomodoro({ profile, config, onProfile, onView }: Props) {
  const [focus, setFocus] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [seconds, setSeconds] = useState(25 * 60);
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [sound, setSound] = useState(profile.soundEnabled);
  const [showSettings, setShowSettings] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [activity, setActivity] = useState<Activity>("theory");
  const [totalSessions, setTotalSessions] = useState(4);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);
  const [backgroundSound, setBackgroundSound] = useState("Mưa nhẹ");
  const [backgroundVolume, setBackgroundVolume] = useState(40);
  const [alertVolume, setAlertVolume] = useState(70);
  const completionRef = useRef(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) {
        setFocus(clamp(Number(saved.focus) || 25, 1, 120));
        setShortBreak(clamp(Number(saved.shortBreak) || 5, 1, 30));
        setLongBreak(clamp(Number(saved.longBreak) || 15, 1, 45));
        setAutoAdvance(saved.autoAdvance !== false);
        setSound(saved.sound !== false);
        setBackgroundSound(saved.backgroundSound || "Mưa nhẹ");
        setBackgroundVolume(clamp(Number(saved.backgroundVolume) || 40, 0, 100));
        setAlertVolume(clamp(Number(saved.alertVolume) || 70, 0, 100));
      }
    } catch { /* ignore malformed preference */ }
  }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify({ focus, shortBreak, longBreak, autoAdvance, sound, backgroundSound, backgroundVolume, alertVolume })); }, [focus, shortBreak, longBreak, autoAdvance, sound, backgroundSound, backgroundVolume, alertVolume]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (seconds !== 0 || completionRef.current) return;
    completionRef.current = true;
    if (mode === "focus") completeFocus();
    else {
      setRunning(false); setMode("focus"); setSeconds(focus * 60); completionRef.current = false;
      toast.success("Đã hết thời gian nghỉ. Sẵn sàng cho phiên tiếp theo.");
    }
  }, [seconds, mode, focus]);

  const completedFocus = profile.pomodoroHistory.filter((item) => item.status === "completed" && item.mode === "focus");
  const today = dayKey(new Date().toISOString());
  const completedToday = completedFocus.filter((item) => dayKey(item.endedAt) === today).length;
  const cyclePosition = completedToday % 4;
  const totalMinutes = completedFocus.reduce((sum, item) => sum + item.durationMinutes, 0);
  const average = completedFocus.length ? Math.round(totalMinutes / completedFocus.length) : 0;
  const activeDuration = mode === "focus" ? focus : mode === "shortBreak" ? shortBreak : longBreak;
  const display = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const progress = Math.max(0, Math.min(100, (1 - seconds / (activeDuration * 60)) * 100));
  const statusText = running ? (mode === "focus" ? "Đừng bỏ cuộc giữa chừng nhé, Ong." : "Nghỉ một chút rồi quay lại nhé.") : mode === "focus" ? (sessionStartedAt ? "Phiên học đang tạm dừng." : "Bạn đã sẵn sàng học chưa?") : "Khi sẵn sàng, hãy bắt đầu phiên tiếp theo.";
  const recentDays = useMemo(() => Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index)); const key = dayKey(date.toISOString()); return { label: date.toLocaleDateString("vi-VN", { weekday: "short" }), minutes: completedFocus.filter((item) => dayKey(item.endedAt) === key).reduce((sum, item) => sum + item.durationMinutes, 0) }; }), [completedFocus]);
  const maxMinutes = Math.max(1, ...recentDays.map((item) => item.minutes));
  const byActivity = activities.map((entry) => ({ ...entry, minutes: completedFocus.filter((item) => (item.topic || "").toLowerCase().includes(entry.label.toLowerCase()) || (item.subject || "").toLowerCase().includes(entry.label.toLowerCase())).reduce((sum, item) => sum + item.durationMinutes, 0) })).filter((item) => item.minutes > 0).slice(0, 5);

  function start() {
    if (mode === "focus" && !subject.trim()) toast.info("Bạn có thể nhập môn học để thống kê chính xác hơn.");
    if (!sessionStartedAt && mode === "focus") setSessionStartedAt(new Date().toISOString());
    completionRef.current = false; setRunning(true);
  }
  function reset(record = false) {
    if (record && running && mode === "focus" && sessionStartedAt) {
      if (!window.confirm("Đặt lại phiên này? Thời gian hiện tại sẽ không được tính là một phiên hoàn thành.")) return;
      const elapsed = Math.max(0, focus * 60 - seconds);
      const abandoned: PomodoroSession = { id: crypto.randomUUID(), startedAt: sessionStartedAt, endedAt: new Date().toISOString(), durationMinutes: Math.floor(elapsed / 60), subject, topic, sessionNumber: completedToday + 1, totalSessions, mode: "focus", status: "abandoned" };
      onProfile({ ...profile, pomodoroHistory: elapsed > 0 ? [abandoned, ...profile.pomodoroHistory] : profile.pomodoroHistory }, "Đã đặt lại phiên; thời gian đã học được lưu vào lịch sử.");
    }
    setRunning(false); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(null); completionRef.current = false;
  }
  function choosePreset(preset: Preset) { if (running && !window.confirm("Đổi preset sẽ dừng phiên hiện tại. Tiếp tục?")) return; setRunning(false); setFocus(preset.focus); setShortBreak(preset.short); setLongBreak(preset.long); setMode("focus"); setSeconds(preset.focus * 60); setSessionStartedAt(null); }
  function completeFocus() {
    const endedAt = new Date().toISOString();
    const session: PomodoroSession = { id: crypto.randomUUID(), startedAt: sessionStartedAt ?? new Date(Date.now() - focus * 60000).toISOString(), endedAt, durationMinutes: focus, subject: subject.trim() || "Tự học", topic: topic.trim() || activities.find((item) => item.id === activity)?.label || "Học tập", sessionNumber: cyclePosition + 1, totalSessions, mode: "focus", status: "completed" };
    const activityReward = { id: `pomodoro-${session.id}`, occurredAt: endedAt, kind: "pomodoro" as const, quantity: 1, durationSeconds: focus * 60, xpEarned: Math.max(10, focus * 2) };
    const rewarded = applyStudyActivityRewards({ ...profile, pomodoroHistory: [session, ...profile.pomodoroHistory] }, activityReward, config);
    onProfile(rewarded.profile, rewarded.newlyUnlocked.length ? `Hoàn thành phiên Pomodoro · +${activityReward.xpEarned} XP · mở khóa ${rewarded.newlyUnlocked.length} thành tích` : `Hoàn thành phiên Pomodoro · +${activityReward.xpEarned} XP`);
    const nextMode: Mode = autoAdvance ? (session.sessionNumber % 4 === 0 ? "longBreak" : "shortBreak") : "focus";
    setRunning(false); setSessionStartedAt(null); setMode(nextMode); setSeconds((nextMode === "longBreak" ? longBreak : nextMode === "shortBreak" ? shortBreak : focus) * 60); completionRef.current = false;
    if (sound) try { window.navigator.vibrate?.([100, 80, 100]); } catch { /* optional */ }
    toast.success("Một phiên nữa đã hoàn thành! Thời gian học đã được ghi nhận.");
  }
  function endEarly() {
    if (mode !== "focus" || !sessionStartedAt) return;
    const elapsedSeconds = Math.max(0, focus * 60 - seconds);
    if (!window.confirm(`Bạn đã học ${Math.floor(elapsedSeconds / 60)} phút ${elapsedSeconds % 60} giây. Kết thúc phiên và lưu là chưa hoàn thành?`)) return;
    const now = new Date().toISOString();
    const item: PomodoroSession = { id: crypto.randomUUID(), startedAt: sessionStartedAt, endedAt: now, durationMinutes: Math.floor(elapsedSeconds / 60), subject, topic, sessionNumber: cyclePosition + 1, totalSessions, mode: "focus", status: "abandoned" };
    onProfile({ ...profile, pomodoroHistory: elapsedSeconds > 0 ? [item, ...profile.pomodoroHistory] : profile.pomodoroHistory }, "Đã kết thúc sớm; thời gian học thực tế vẫn được lưu.");
    setRunning(false); setSessionStartedAt(null); setSeconds(focus * 60); completionRef.current = false;
  }
  function skipBreak() { setRunning(false); setMode("focus"); setSeconds(focus * 60); completionRef.current = false; toast.info("Đã bỏ qua thời gian nghỉ."); }
  function handleMainAction() { if (mode !== "focus" && !running) start(); else if (running) setRunning(false); else start(); }

  return <div className="space-y-6">
    <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-red-700 dark:text-red-300">Tiến trình học tập · Góc học tập</p><h1 className="mt-2 font-display text-4xl font-bold">🍅 Pomodoro</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Một nhịp học vừa đủ tập trung, vừa đủ nghỉ. Pomodoro chỉ ghi nhận thời gian học, không phải danh sách công việc.</p></div><button className="secondary-button" onClick={() => onView("progress")}><BarChart3 className="h-4 w-4" />Xem tiến trình</button></header>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)]">
      <div className="panel relative overflow-hidden p-5 sm:p-8"><div className="absolute right-5 top-5 text-2xl opacity-80" aria-hidden="true">🐝</div><div className="text-center"><p className={`text-xs font-bold uppercase tracking-[.18em] ${mode === "focus" ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}>{modeLabels[mode]}</p><h2 className="mt-2 font-display text-2xl font-bold">{mode === "focus" ? `Phiên ${cyclePosition + 1} / 4` : "Thời gian hồi phục"}</h2><div className="mx-auto mt-6 grid aspect-square w-full max-w-[22rem] place-items-center rounded-full p-3" style={{ background: `conic-gradient(${mode === "focus" ? "#b4232a" : "#18805c"} ${progress}%, rgba(180,35,42,.12) ${progress}% 100%)` }}><div className="grid h-full w-full place-items-center rounded-full bg-[var(--card)] text-center shadow-inner"><span className="font-mono text-[clamp(3.3rem,10vw,5.5rem)] font-bold tracking-tight" aria-live="polite">{display}</span><small className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">{modeLabels[mode]}</small></div></div><p className="mx-auto mt-4 max-w-md text-sm text-slate-600 dark:text-slate-300">{statusText}</p><div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Tiến trình chu kỳ Pomodoro">{[0, 1, 2, 3].map((index) => <span key={index} className={`h-3 w-3 rounded-full border-2 ${index < cyclePosition ? "border-emerald-600 bg-emerald-600" : index === cyclePosition && mode === "focus" ? "border-red-600 bg-red-100" : "border-slate-300 bg-transparent dark:border-white/20"}`} title={`Phiên ${index + 1}`} />)}</div><div className="mt-6 flex flex-wrap justify-center gap-2"><button className="primary-button min-w-44 justify-center px-6 py-3" onClick={handleMainAction}>{running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{running ? "Tạm dừng" : sessionStartedAt ? "Tiếp tục" : mode === "focus" ? "Bắt đầu tập trung" : `Bắt đầu ${modeLabels[mode].toLowerCase()}`}</button>{mode === "focus" && sessionStartedAt ? <button className="secondary-button px-4 py-3" onClick={endEarly}>🏁 Kết thúc phiên</button> : null}<button className="secondary-button px-4 py-3" onClick={() => reset(true)}><RotateCcw className="h-4 w-4" />Đặt lại</button>{mode !== "focus" && !running ? <button className="secondary-button px-4 py-3" onClick={skipBreak}>⏭ Bỏ qua nghỉ</button> : null}</div></div></div>
      <div className="space-y-5"><section className="panel p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-red-700 dark:text-red-300">Trước khi bắt đầu</p><h2 className="mt-2 font-display text-2xl font-bold">Bạn đang học gì?</h2></div><Settings2 className="h-5 w-5 text-red-700" /></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{activities.map((item) => <button key={item.id} type="button" className={`rounded-xl border p-3 text-left text-xs font-bold transition ${activity === item.id ? "border-red-600 bg-red-50 text-red-800 dark:bg-red-400/10 dark:text-red-200" : "border-slate-200 dark:border-white/10"}`} onClick={() => setActivity(item.id)}><span className="mr-1 text-base">{item.icon}</span>{item.label}</button>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Môn học<input className="field mt-2" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ví dụ: Lịch sử Việt Nam" /></label><label className="text-sm font-bold">Nội dung<input className="field mt-2" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ví dụ: Nhà Trần" /></label></div><div className="mt-4 flex flex-wrap gap-2"><button className="secondary-button" onClick={() => onView("flashcards")}><BookOpen className="h-4 w-4" />Mở Flashcard</button><button className="secondary-button" onClick={() => onView("quizzes")}><CircleHelp className="h-4 w-4" />Mở Đề kiểm tra</button></div></section><section className="panel p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Chọn nhịp học</p><h2 className="mt-2 font-display text-xl font-bold">Preset nhanh</h2></div><button className="text-sm font-bold text-red-700 underline-offset-4 hover:underline" onClick={() => setShowSettings((value) => !value)}>{showSettings ? "Ẩn tùy chỉnh" : "Tùy chỉnh"}</button></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{presets.map((preset) => <button key={preset.label} type="button" className={`rounded-xl border p-3 text-left ${focus === preset.focus && shortBreak === preset.short && longBreak === preset.long ? "border-red-600 bg-red-50 dark:bg-red-400/10" : "border-slate-200 dark:border-white/10"}`} onClick={() => choosePreset(preset)}><b className="block text-sm">{preset.label}</b><span className="mt-1 block text-xs text-slate-500">{preset.note}</span></button>)}</div>{showSettings ? <div className="mt-4 rounded-2xl border border-dashed border-red-200 p-4 dark:border-red-400/20"><div className="grid gap-3 sm:grid-cols-3"><label className="text-xs font-bold">Tập trung<input className="field mt-1" type="number" min="1" max="120" value={focus} onChange={(e) => { const value = clamp(Number(e.target.value) || 1, 1, 120); setFocus(value); if (!running && mode === "focus") setSeconds(value * 60); }} /></label><label className="text-xs font-bold">Nghỉ ngắn<input className="field mt-1" type="number" min="1" max="30" value={shortBreak} onChange={(e) => setShortBreak(clamp(Number(e.target.value) || 1, 1, 30))} /></label><label className="text-xs font-bold">Nghỉ dài<input className="field mt-1" type="number" min="1" max="45" value={longBreak} onChange={(e) => setLongBreak(clamp(Number(e.target.value) || 1, 1, 45))} /></label></div><label className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm dark:bg-white/5"><span>Tự động chuyển sang nghỉ</span><input type="checkbox" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} /></label></div> : null}</section><section className="panel p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-sky-700 dark:text-sky-300">Audio Center</p><h2 className="mt-2 font-display text-xl font-bold">Âm thanh tập trung</h2></div><button className="secondary-button" onClick={() => setSound((value) => !value)}>{sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}{sound ? "Đang bật" : "Đang tắt"}</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Âm thanh nền<select className="field mt-2" value={backgroundSound} onChange={(e) => setBackgroundSound(e.target.value)}><option>Mưa</option><option>Mưa nhẹ</option><option>Rừng</option><option>Thư viện</option><option>White noise</option><option>Brown noise</option><option>Không âm thanh</option></select></label><button className="secondary-button self-end" onClick={() => toast.info(`Đã chọn nghe thử: ${backgroundSound}`)}>▶ Nghe thử</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold">Âm lượng nền · {backgroundVolume}%<input type="range" min="0" max="100" value={backgroundVolume} onChange={(e) => setBackgroundVolume(Number(e.target.value))} /></label><label className="text-xs font-bold">Âm báo · {alertVolume}%<input type="range" min="0" max="100" value={alertVolume} onChange={(e) => setAlertVolume(Number(e.target.value))} /></label></div></section></div>
    </section>
    <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><section className="panel p-5 sm:p-6"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">7 ngày gần đây</p><h2 className="mt-2 font-display text-2xl font-bold">Phút tập trung theo ngày</h2></div><BarChart3 className="h-5 w-5 text-emerald-700" /></div><div className="mt-7 grid h-48 grid-cols-7 items-end gap-2" role="img" aria-label="Biểu đồ phút Pomodoro trong bảy ngày gần đây">{recentDays.map((day) => <div className="flex h-full min-w-0 flex-col justify-end" key={day.label}><div className="rounded-t-xl bg-gradient-to-t from-emerald-600 to-lime-300" style={{ height: `${Math.max(day.minutes ? 12 : 3, day.minutes / maxMinutes * 100)}%` }} title={`${day.label}: ${day.minutes} phút`} /><span className="mt-2 truncate text-center text-[11px] font-bold text-slate-500">{day.label}</span></div>)}</div></section><section className="panel p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-red-700 dark:text-red-300">Theo hoạt động học</p><h2 className="mt-2 font-display text-2xl font-bold">Thời gian đã đầu tư</h2><div className="mt-5 space-y-3">{byActivity.length ? byActivity.map((item) => <div key={item.id}><div className="flex justify-between gap-3 text-sm"><b className="truncate">{item.icon} {item.label}</b><span className="text-slate-500">{item.minutes} phút</span></div><div className="mt-1 h-2 rounded-full bg-red-100 dark:bg-red-400/10"><div className="h-full rounded-full bg-red-600" style={{ width: `${Math.min(100, item.minutes / Math.max(1, byActivity[0].minutes) * 100)}%` }} /></div></div>) : <p className="text-sm text-slate-500">Chọn hoạt động học trước khi bắt đầu để xem phân bổ.</p>}</div></section></section>
    <section className="grid gap-3 sm:grid-cols-3"><Metric icon={Clock3} label="Tổng phiên hoàn thành" value={completedFocus.length} detail={`${completedToday} hôm nay`} /><Metric icon={Flame} label="Tổng thời gian học" value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}p`} detail={`Trung bình ${average} phút/phiên`} /><Metric icon={Trophy} label="Mốc Pomodoro" value={computedAchievements(profile, config).filter((item) => item.metric === "pomodoroSessions").length || "—"} detail={`${profile.xp.toLocaleString("vi-VN")} XP`} /></section>
    <section className="panel p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-red-700 dark:text-red-300">Lịch sử tập trung</p><h2 className="mt-2 font-display text-2xl font-bold">Các phiên gần đây</h2></div><button className="secondary-button" onClick={() => onView("achievements")}><Trophy className="h-4 w-4" />Xem Thành tích</button></div>{profile.pomodoroHistory.length ? <div className="mt-5 grid gap-2 md:grid-cols-2">{profile.pomodoroHistory.slice(0, 8).map((item) => <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/10"><span className={`grid h-9 w-9 place-items-center rounded-xl ${item.status === "completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-white/5"}`}>{item.status === "completed" ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}</span><span className="min-w-0 flex-1"><b className="block truncate text-sm">{item.subject || "Tự học"}</b><small className="text-xs text-slate-500">{item.durationMinutes ? `${item.durationMinutes} phút` : "Chưa hoàn tất"} · {new Date(item.endedAt).toLocaleString("vi-VN")}</small></span><span className="text-xs font-bold text-slate-500">{item.status === "completed" ? "Hoàn thành" : item.status === "abandoned" ? "Chưa hoàn thành" : "Đã bỏ qua"}</span></div>)}</div> : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5">Chưa có phiên nào. Bắt đầu với 10 phút cũng là một bước tiến.</p>}</section>
  </div>;
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof Clock3; label: string; value: string | number; detail: string }) { return <div className="study-card p-5"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><Icon className="h-5 w-5" /></span><small className="text-right text-slate-400">{detail}</small></div><b className="mt-4 block text-2xl text-slate-950 dark:text-white">{typeof value === "number" ? value.toLocaleString("vi-VN") : value}</b><p className="mt-1 text-sm text-slate-500">{label}</p></div>; }
