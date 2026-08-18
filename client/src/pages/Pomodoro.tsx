import { ArrowRight, BarChart3, BookOpen, Check, CircleHelp, Clock3, Flame, Pause, Play, RotateCcw, Settings2, Sparkles, Trophy, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { applyStudyActivityRewards, computedAchievements, type AppConfig, type PomodoroSession, type ProfileState } from "../../../shared/study";
import { COMPLETE_ALERT_PROFILE, SOUND_EVENTS, SOUNDSCAPE_LAYERS, SOUNDSCAPE_PRESETS, scaledGain, scaledLayerGain, soundEventDuration, soundEventGainMultiplier, soundEventSpacing, type SoundEvent } from "../lib/pomodoroAudio";
import { ExperienceStudio } from "../components/ExperienceStudio";
import { PersistentCollapsible } from "../components/PersistentCollapsible";
import { comboLabel, emotionThemes, type EmotionId } from "../lib/emotionThemes";
import { AVOIDANCE_REASONS, AVOIDANCE_REASON_LABELS, TASK_COMBOS, chooseMicroTask, comboProgress, createCombo, completeComboStep, procrastinationAnalytics } from "../lib/procrastination";
import type { AvoidanceReason, ProcrastinationEvent, TaskCombo } from "../../../shared/study";

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
  const [layerVolumes, setLayerVolumes] = useState<Record<string, number>>({});
  const [alertVolume, setAlertVolume] = useState(70);
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(true);
  const [miniPlayerExpanded, setMiniPlayerExpanded] = useState(false);
  const [miniPlayerPinned, setMiniPlayerPinned] = useState(false);
  const [emotion, setEmotion] = useState<EmotionId>("calm");
  const [introAnimation, setIntroAnimation] = useState(false);
  const [completionBanner, setCompletionBanner] = useState(false);
  const [twoMinuteMode, setTwoMinuteMode] = useState(false);
  const [randomTask, setRandomTask] = useState("Lumi đang chờ Ong chọn một việc nhỏ.");
  const [activeTaskCombo, setActiveTaskCombo] = useState<TaskCombo | null>(null);
  const [showAvoidanceReasons, setShowAvoidanceReasons] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const completionRef = useRef(false);
  const trackedOpenRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const previewStopRef = useRef<(() => void) | null>(null);
  const backgroundStopRef = useRef<(() => void) | null>(null);

  function getAudioContext() {
    if (!audioContextRef.current) audioContextRef.current = new AudioContext();
    return audioContextRef.current;
  }
  async function unlockAudio() {
    if (!sound) return false;
    try {
      const context = getAudioContext();
      if (context.state !== "running") await context.resume();
      return context.state === "running";
    } catch {
      return false;
    }
  }
  function stopPreview() {
    previewStopRef.current?.();
    previewStopRef.current = null;
  }
  function stopBackground() {
    backgroundStopRef.current?.();
    backgroundStopRef.current = null;
  }
  async function startBackground() {
    stopBackground();
    if (!sound || backgroundVolume <= 0 || backgroundSound === "Không âm thanh") return false;
    try {
      const unlocked = await unlockAudio();
      if (!unlocked) return false;
      const context = getAudioContext();
      const preset = SOUNDSCAPE_PRESETS[backgroundSound] ?? SOUNDSCAPE_PRESETS["Mưa nhẹ"];
      const master = context.createGain();
      const targetMaster = Math.min(1, backgroundVolume / 100) * 0.12;
      master.gain.setValueAtTime(0.001, context.currentTime);
      master.gain.exponentialRampToValueAtTime(Math.max(0.001, targetMaster), context.currentTime + 1.2);
      master.connect(context.destination);
      const oscillators: OscillatorNode[] = [];
      const intervals: number[] = [];
      preset.layers.map((id) => SOUNDSCAPE_LAYERS[id]).filter(Boolean).forEach((definition, layerIndex) => {
        const layerGain = context.createGain();
        const targetLayerGain = Math.max(0.001, scaledLayerGain(clamp(layerVolumes[definition.id] ?? 100, 0, 100), definition.baseVolume));
        layerGain.gain.setValueAtTime(0.001, context.currentTime);
        layerGain.gain.exponentialRampToValueAtTime(targetLayerGain, context.currentTime + 0.8 + layerIndex * 0.18);
        layerGain.connect(master);
        const layerOscillators = definition.notes.slice(0, 4).map((frequency, noteIndex) => {
          const oscillator = context.createOscillator();
          oscillator.type = definition.waveform;
          oscillator.frequency.setValueAtTime(frequency, context.currentTime);
          oscillator.detune.value = definition.detune + (noteIndex % 2 ? 4 : -4);
          oscillator.connect(layerGain);
          oscillator.start(context.currentTime + layerIndex * 0.08);
          oscillators.push(oscillator);
          return oscillator;
        });
        let noteIndex = 0;
        const interval = window.setInterval(() => {
          const oscillator = layerOscillators[noteIndex % layerOscillators.length];
          const frequency = definition.notes[noteIndex % definition.notes.length];
          const drift = Math.sin(noteIndex / 3) * (definition.category === "Tập trung" ? 1.5 : 5);
          oscillator.frequency.setTargetAtTime(frequency + drift, context.currentTime, Math.min(0.8, definition.intervalMs / 1800));
          oscillator.detune.setTargetAtTime(definition.detune + Math.sin(noteIndex / 2) * 5, context.currentTime, 0.7);
          noteIndex += 1;
        }, definition.intervalMs);
        intervals.push(interval);
      });
      backgroundStopRef.current = () => {
        intervals.forEach((interval) => window.clearInterval(interval));
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setTargetAtTime(0.001, context.currentTime, 0.45);
        window.setTimeout(() => oscillators.forEach((oscillator) => { try { oscillator.stop(); } catch { /* already stopped */ } }), 1500);
        window.setTimeout(() => master.disconnect(), 1750);
      };
      return true;
    } catch { /* browsers may deny audio until a user gesture */
      return false;
    }
  }
  function playSequence(event: SoundEvent) {
    if (!sound || alertVolume <= 0) return;
    try {
      const context = getAudioContext();
      void context.resume();
      const master = context.createGain();
      master.gain.setValueAtTime(scaledGain(alertVolume, soundEventGainMultiplier(event)), context.currentTime);
      master.connect(context.destination);
      const notes = SOUND_EVENTS[event];
      notes.forEach((frequency, index) => {
        const startAt = context.currentTime + index * soundEventSpacing(event);
        const oscillator = context.createOscillator();
        const noteGain = context.createGain();
        oscillator.type = event === "complete" ? COMPLETE_ALERT_PROFILE.oscillator : event === "error" ? "square" : event === "warning" ? "triangle" : "sine";
        oscillator.frequency.setValueAtTime(frequency, startAt);
        noteGain.gain.setValueAtTime(0.001, startAt);
        noteGain.gain.exponentialRampToValueAtTime(1, startAt + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startAt + (soundEventDuration(event) - 0.01));
        oscillator.connect(noteGain).connect(master);
        oscillator.start(startAt);
        oscillator.stop(startAt + (soundEventDuration(event)));
      });
      window.setTimeout(() => master.disconnect(), notes.length * soundEventSpacing(event) * 1000 + soundEventDuration(event) * 1000 + 500);
    } catch { /* browsers may deny audio without a user gesture */ }
  }
  function playAlert() { playSequence("complete"); }
  function previewEvent(event: SoundEvent) { playSequence(event); toast.success(`Đã thử âm báo: ${event}`); }
  async function previewBackground() {
    stopPreview();
    if (!sound || backgroundVolume <= 0 || backgroundSound === "Không âm thanh") {
      toast.info("Âm thanh đang tắt hoặc âm lượng nền bằng 0.");
      return;
    }
    const unlocked = await unlockAudio();
    if (!unlocked) {
      toast.info("Trình duyệt đang chặn tự phát. Hãy nhấn lại nút nghe thử hoặc bật âm thanh sau một tương tác.");
      return;
    }
    await startBackground();
    previewStopRef.current = () => stopBackground();
    window.setTimeout(() => { if (previewStopRef.current) stopPreview(); }, 5000);
    toast.success(`Đang nghe thử: ${backgroundSound}`);
  }
  useEffect(() => () => { stopPreview(); stopBackground(); void audioContextRef.current?.close(); }, []);
  useEffect(() => { if (!sound) { stopPreview(); stopBackground(); } }, [sound]);
  useEffect(() => {
    if (trackedOpenRef.current || running) return;
    const timer = window.setTimeout(() => {
      if (trackedOpenRef.current || running) return;
      trackedOpenRef.current = true;
      const event: ProcrastinationEvent = { id: crypto.randomUUID(), occurredAt: new Date().toISOString(), kind: "opened_without_start", hour: new Date().getHours() };
      onProfile({ ...profile, procrastinationEvents: [event, ...(profile.procrastinationEvents ?? [])].slice(0, 200) });
    }, 90_000);
    return () => window.clearTimeout(timer);
  }, [onProfile, profile, running]);
  useEffect(() => {
    if (running && sound) void startBackground();
    else stopBackground();
    return () => stopBackground();
  }, [running, sound, backgroundSound, backgroundVolume, layerVolumes]);

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
        setLayerVolumes(saved.layerVolumes && typeof saved.layerVolumes === "object" ? Object.fromEntries(Object.entries(saved.layerVolumes).map(([id, value]) => [id, clamp(Number(value) || 0, 0, 100)])) : {});
        setAlertVolume(clamp(Number(saved.alertVolume) || 70, 0, 100));
      }
    } catch { /* ignore malformed preference */ }
  }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify({ focus, shortBreak, longBreak, autoAdvance, sound, backgroundSound, backgroundVolume, layerVolumes, alertVolume })); }, [focus, shortBreak, longBreak, autoAdvance, sound, backgroundSound, backgroundVolume, layerVolumes, alertVolume]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (!running || seconds <= 0 || seconds % 60 !== 0) return;
    if (seconds === 60) playSequence("warning");
    else playSequence("tick");
  }, [running, seconds]);
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
  const selectedEmotion = emotionThemes.find((item) => item.id === emotion) ?? emotionThemes[0];
  const selectedSoundscape = SOUNDSCAPE_PRESETS[backgroundSound] ?? SOUNDSCAPE_PRESETS["Mưa nhẹ"];
  const comboTier = comboLabel(Math.max(1, cyclePosition + 1));
  const criticalMoment = mode === "focus" && running && seconds > 0 && seconds <= 5 * 60;
  const progress = Math.max(0, Math.min(100, (1 - seconds / (activeDuration * 60)) * 100));
  const statusText = running ? (mode === "focus" ? "Đừng bỏ cuộc giữa chừng nhé, Ong." : "Nghỉ một chút rồi quay lại nhé.") : mode === "focus" ? (sessionStartedAt ? "Phiên học đang tạm dừng." : "Bạn đã sẵn sàng học chưa?") : "Khi sẵn sàng, hãy bắt đầu phiên tiếp theo.";
  const hour = new Date().getHours();
  const timeOfDay = hour < 11 ? "morning" : hour < 18 ? "afternoon" : "night";
  const lastCompletedAt = completedFocus[0]?.endedAt ? new Date(completedFocus[0].endedAt).getTime() : 0;
  const isComeback = lastCompletedAt > 0 && Date.now() - lastCompletedAt > 48 * 60 * 60 * 1000;
  const recentDays = useMemo(() => Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index)); const key = dayKey(date.toISOString()); return { label: date.toLocaleDateString("vi-VN", { weekday: "short" }), minutes: completedFocus.filter((item) => dayKey(item.endedAt) === key).reduce((sum, item) => sum + item.durationMinutes, 0) }; }), [completedFocus]);
  const maxMinutes = Math.max(1, ...recentDays.map((item) => item.minutes));
  const byActivity = activities.map((entry) => ({ ...entry, minutes: completedFocus.filter((item) => (item.topic || "").toLowerCase().includes(entry.label.toLowerCase()) || (item.subject || "").toLowerCase().includes(entry.label.toLowerCase())).reduce((sum, item) => sum + item.durationMinutes, 0) })).filter((item) => item.minutes > 0).slice(0, 5);
  const procrastination = procrastinationAnalytics(profile.procrastinationEvents ?? [], profile.avoidanceReasons ?? []);

  function recordEvent(kind: ProcrastinationEvent["kind"], taskMinutes?: number) {
    const event: ProcrastinationEvent = { id: crypto.randomUUID(), occurredAt: new Date().toISOString(), kind, hour: new Date().getHours(), taskMinutes };
    onProfile({ ...profile, procrastinationEvents: [event, ...(profile.procrastinationEvents ?? [])].slice(0, 200) });
  }
  async function start() {
    if (sound) await unlockAudio();
    if (mode === "focus" && !subject.trim()) toast.info("Bạn có thể nhập môn học để thống kê chính xác hơn.");
    if (!sessionStartedAt && mode === "focus") setSessionStartedAt(new Date().toISOString());
    recordEvent(twoMinuteMode || focus <= 5 ? "started_small" : "started_focus", focus);
    trackedOpenRef.current = true;
    completionRef.current = false; setIntroAnimation(true); setRunning(true); playSequence("start");
    if (sound) startBackground();
    window.setTimeout(() => setIntroAnimation(false), 2600);
  }
  function reset(record = false) {
    if (record && running && mode === "focus" && sessionStartedAt) {
      if (!window.confirm("Đặt lại phiên này? Thời gian hiện tại sẽ không được tính là một phiên hoàn thành.")) return;
      const elapsed = Math.max(0, focus * 60 - seconds);
      const abandoned: PomodoroSession = { id: crypto.randomUUID(), startedAt: sessionStartedAt, endedAt: new Date().toISOString(), durationMinutes: Math.floor(elapsed / 60), subject, topic, sessionNumber: completedToday + 1, totalSessions, mode: "focus", status: "abandoned" };
      onProfile({ ...profile, pomodoroHistory: elapsed > 0 ? [abandoned, ...profile.pomodoroHistory] : profile.pomodoroHistory }, "Đã đặt lại phiên; thời gian đã học được lưu vào lịch sử.");
    }
    setRunning(false); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(null); completionRef.current = false; stopBackground();
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
    if (sound) { try { window.navigator.vibrate?.(COMPLETE_ALERT_PROFILE.vibratePattern); } catch { /* optional */ } playAlert(); if (rewarded.newlyUnlocked.length) playSequence("reward"); }
    setCompletionBanner(true);
    window.setTimeout(() => setCompletionBanner(false), 5200);
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
  function startTwoMinutes() { setTwoMinuteMode(true); setFocus(2); setMode("focus"); setSeconds(120); setSessionStartedAt(null); setRunning(false); toast.info("Nhiệm vụ 2 phút đã sẵn sàng: mở sách hoặc chọn một thẻ học."); }
  function chooseRandomTask() {
    setRandomTask(chooseMicroTask());
    recordEvent("task_shuffled");
  }
  function saveAvoidanceReason(reason: AvoidanceReason) {
    onProfile({ ...profile, avoidanceReasons: [{ id: crypto.randomUUID(), occurredAt: new Date().toISOString(), reason }, ...(profile.avoidanceReasons ?? [])].slice(0, 100) }, `Lumi đã ghi nhận: ${AVOIDANCE_REASON_LABELS[reason].toLowerCase()}. Không phán xét, chỉ để hiểu Ong hơn.`);
    setShowAvoidanceReasons(false);
  }
  function startCombo(templateId = TASK_COMBOS[0].id) {
    const template = TASK_COMBOS.find((item) => item.id === templateId) ?? TASK_COMBOS[0];
    const next = createCombo(template);
    setActiveTaskCombo(next);
    onProfile({ ...profile, taskCombos: [next, ...(profile.taskCombos ?? [])].slice(0, 20) }, `Lumi đã chuẩn bị ${next.title}. Mình làm từng bước thôi.`);
  }
  function toggleComboStep(stepId: string) {
    if (!activeTaskCombo) return;
    const next = completeComboStep(activeTaskCombo, stepId);
    setActiveTaskCombo(next);
    if (next.completedAt) {
      const event: ProcrastinationEvent = { id: crypto.randomUUID(), occurredAt: next.completedAt, kind: "combo_completed", hour: new Date().getHours() };
      onProfile({ ...profile, taskCombos: [next, ...(profile.taskCombos ?? []).filter((item) => item.id !== next.id)].slice(0, 20), procrastinationEvents: [event, ...(profile.procrastinationEvents ?? [])].slice(0, 200) }, "🔥 COMBO COMPLETE · Ong vừa hoàn thành một chuỗi nhỏ!");
    }
  }
  function handleMainAction() { if (mode !== "focus" && !running) void start(); else if (running) setRunning(false); else void start(); }

  return <div className="space-y-6">
    <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-red-700 dark:text-red-300">Tiến trình học tập · Góc học tập</p><h1 className="mt-2 font-display text-4xl font-bold">🍅 Pomodoro</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Một nhịp học vừa đủ tập trung, vừa đủ nghỉ. Pomodoro chỉ ghi nhận thời gian học, không phải danh sách công việc.</p></div><button className="secondary-button" onClick={() => onView("progress")}><BarChart3 className="h-4 w-4" />Xem tiến trình</button></header>
    {isComeback ? <section className="rounded-3xl border-2 border-[#2e7d32]/20 bg-[#eff9ef] p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#2e7d32]">🌱 COMEBACK</p><h2 className="mt-2 font-display text-2xl font-black text-[#35523a]">Ong quay lại rồi.</h2><p className="mt-1 text-sm font-bold text-[#4d6c53]">Bắt đầu lại không có nghĩa là thất bại. Mình thử 5 phút thật nhẹ nhé.</p></div><button type="button" className="primary-button bg-[#2e7d32]" onClick={() => { setFocus(5); setSeconds(300); setMode("focus"); }}>🍅 Học 5 phút</button></div></section> : null}
    <section className={`pomodoro-journey pomodoro-journey--${timeOfDay} rounded-3xl border border-[#2e7d32]/15 p-4`} aria-label="Start Small và nền học theo thời gian"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#c62828]">🎁 HỘP NHIỆM VỤ NGẪU NHIÊN</p><p className="mt-1 text-sm font-bold text-[#4d352f]">{randomTask}</p></div><div className="flex gap-2"><button type="button" className="secondary-button text-xs" onClick={chooseRandomTask}>✨ Mở nhiệm vụ</button><button type="button" className="secondary-button text-xs" onClick={startTwoMinutes}>⏱ 2 phút</button></div></div><p className="mt-3 text-xs font-bold text-[#4d6c53]">Nền {timeOfDay === "morning" ? "buổi sáng" : timeOfDay === "afternoon" ? "buổi chiều" : "buổi tối"} · chuyển động thở nhẹ · có thể tắt bằng chế độ giảm chuyển động của thiết bị.</p></section>
    <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-3xl border border-[#c62828]/15 bg-[#fff8f5] p-5 shadow-sm dark:bg-white/5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#c62828]">🧩 Lumi giúp Ong bắt đầu</p><h2 className="mt-2 font-display text-xl font-black text-[#6f2424] dark:text-red-200">Chọn một cái thôi</h2><p className="mt-1 text-sm font-bold text-[#7b5048] dark:text-slate-300">Không cần suy nghĩ 20 lựa chọn. Một bước nhỏ cũng được tính.</p></div><button type="button" className="secondary-button text-xs" onClick={() => setShowAvoidanceReasons((value) => !value)}>{showAvoidanceReasons ? "Đóng" : "Vì sao hôm nay khó học?"}</button></div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3"><button type="button" className="rounded-2xl bg-[#c62828] px-3 py-3 text-xs font-black text-white transition hover:scale-[1.02]" onClick={() => { setFocus(5); setSeconds(300); setMode("focus"); }}>🍅 5 phút</button><button type="button" className="rounded-2xl bg-[#2e7d32] px-3 py-3 text-xs font-black text-white transition hover:scale-[1.02]" onClick={() => { setRandomTask("Ôn lại phần hôm qua."); setFocus(5); setSeconds(300); setMode("focus"); }}>📖 Ôn bài cũ</button><button type="button" className="rounded-2xl border-2 border-[#2e7d32]/30 bg-white px-3 py-3 text-xs font-black text-[#2e7d32] dark:bg-slate-900" onClick={chooseRandomTask}>🎲 Lumi chọn</button></div>
        {showAvoidanceReasons ? <div className="mt-4 rounded-2xl border border-[#2e7d32]/15 bg-[#eff9ef] p-3"><p className="text-xs font-black text-[#2e7d32]">Hôm nay điều gì khiến Ong khó bắt đầu?</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{AVOIDANCE_REASONS.map((item) => <button key={item.id} type="button" className="rounded-xl bg-white px-2 py-2 text-left text-xs font-bold text-[#35523a] dark:bg-slate-900 dark:text-slate-200" onClick={() => saveAvoidanceReason(item.id)}>{item.icon} {item.label}</button>)}</div></div> : null}
      </div>
      <div className="rounded-3xl border border-[#2e7d32]/15 bg-[#f5fff5] p-5 shadow-sm dark:bg-white/5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#2e7d32]">📊 Trì hoãn analytics</p><h2 className="mt-2 font-display text-xl font-black text-[#35523a] dark:text-green-200">Lumi nhận thấy...</h2></div><button type="button" className="text-xs font-black text-[#c62828] underline" onClick={() => setShowAnalytics((value) => !value)}>{showAnalytics ? "Thu gọn" : "Xem dữ liệu"}</button></div><p className="mt-3 text-sm font-bold leading-6 text-[#4d6c53] dark:text-slate-300">{procrastination.insight}</p>{showAnalytics ? <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-[#35523a] dark:text-slate-200"><div className="rounded-xl bg-white p-3 dark:bg-slate-900"><b className="block text-lg text-[#c62828]">{procrastination.totalEvents}</b>Sự kiện ghi nhận</div><div className="rounded-xl bg-white p-3 dark:bg-slate-900"><b className="block text-lg text-[#2e7d32]">{procrastination.completedSmallStarts}</b>Lần bắt đầu nhỏ</div><div className="rounded-xl bg-white p-3 dark:bg-slate-900"><b className="block text-lg text-[#c62828]">{procrastination.completionRate}%</b>Tỷ lệ hoàn thành</div><div className="rounded-xl bg-white p-3 dark:bg-slate-900"><b className="block text-lg text-[#2e7d32]">{procrastination.commonHour === null ? "—" : `${String(procrastination.commonHour).padStart(2, "0")}:00`}</b>Khung giờ khó bắt đầu</div></div> : null}</div>
    </section>
    <section className="rounded-3xl border border-[#c62828]/15 bg-white p-5 shadow-sm dark:bg-slate-950/60"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-[#c62828]">🎯 COMBO NHIỆM VỤ</p><h2 className="mt-2 font-display text-xl font-black">Làm theo chuỗi nhỏ</h2><p className="mt-1 text-sm font-bold text-slate-500">Hoàn thành từng bước, không cần làm tất cả cùng lúc.</p></div>{activeTaskCombo ? <span className="rounded-full bg-[#eff9ef] px-3 py-1 text-xs font-black text-[#2e7d32]">{comboProgress(activeTaskCombo.steps)}%</span> : null}</div>{activeTaskCombo ? <div className="mt-4 grid gap-2 sm:grid-cols-3">{activeTaskCombo.steps.map((step) => <button key={step.id} type="button" disabled={step.completed} onClick={() => toggleComboStep(step.id)} className={`rounded-2xl border p-3 text-left text-xs font-black transition ${step.completed ? "border-[#2e7d32] bg-[#eff9ef] text-[#2e7d32] line-through" : "border-[#c62828]/15 bg-[#fff8f5] text-[#6f2424] hover:-translate-y-0.5"}`}>{step.completed ? "✓ " : "○ "}{step.label}<span className="mt-1 block text-[11px] font-bold no-underline opacity-70">{step.minutes} phút</span></button>)}</div> : <div className="mt-4 grid gap-2 sm:grid-cols-2">{TASK_COMBOS.map((item) => <button key={item.id} type="button" className="rounded-2xl border border-[#2e7d32]/15 bg-[#f5fff5] p-3 text-left transition hover:-translate-y-0.5 dark:bg-white/5" onClick={() => startCombo(item.id)}><b className="block text-sm text-[#2e7d32]">{item.title}</b><span className="mt-1 block text-xs font-bold text-slate-500">{item.description}</span></button>)}</div>}</section>
    <ExperienceStudio selected={emotion} onSelect={setEmotion} onStartTwoMinutes={startTwoMinutes} />
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)]">
      <div className={`panel relative overflow-hidden p-5 sm:p-8 transition-colors duration-700 pomodoro-breathing pomodoro-breathing--${timeOfDay} ${introAnimation ? "pomodoro-starting" : ""} ${criticalMoment ? "pomodoro-critical" : ""}`}><div className="absolute right-5 top-5 text-2xl opacity-80" aria-hidden="true">🐝</div><div className="text-center"><p className={`text-xs font-bold uppercase tracking-[.18em] ${mode === "focus" ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}>{modeLabels[mode]}</p><h2 className="mt-2 font-display text-2xl font-bold">{mode === "focus" ? `Phiên ${cyclePosition + 1} / 4` : "Thời gian hồi phục"}</h2><div className="mx-auto mt-6 grid aspect-square w-full max-w-[22rem] place-items-center rounded-full p-3" style={{ background: `conic-gradient(${mode === "focus" ? "#b4232a" : "#18805c"} ${progress}%, rgba(180,35,42,.12) ${progress}% 100%)` }}><div className="grid h-full w-full place-items-center rounded-full bg-[var(--card)] text-center shadow-inner"><span className="font-mono text-[clamp(3.3rem,10vw,5.5rem)] font-bold tracking-tight" aria-live="polite">{display}</span><small className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">{modeLabels[mode]}</small></div></div><p className="mx-auto mt-4 max-w-md text-sm text-slate-600 dark:text-slate-300">{criticalMoment ? "🔥 5 PHÚT CUỐI — Đừng bỏ cuộc ở đây, Ong." : statusText}</p><div className="mx-auto mt-3 flex max-w-md items-center justify-center gap-2 rounded-full bg-[#fff0eb] px-3 py-2 text-xs font-black text-[#8e1b1b]" role="status"><span aria-hidden="true">{selectedEmotion.mascot === "lumi" ? "🌟" : "🔥"}</span>{selectedEmotion.encouragement}</div><div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Tiến trình chu kỳ Pomodoro">{[0, 1, 2, 3].map((index) => <span key={index} className={`h-3 w-3 rounded-full border-2 ${index < cyclePosition ? "border-emerald-600 bg-emerald-600" : index === cyclePosition && mode === "focus" ? "border-red-600 bg-red-100" : "border-slate-300 bg-transparent dark:border-white/20"}`} title={`Phiên ${index + 1}`} />)}</div><div className="mt-6 flex flex-wrap justify-center gap-2"><button className="primary-button min-w-44 justify-center px-6 py-3" onClick={handleMainAction}>{running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{running ? "Tạm dừng" : sessionStartedAt ? "Tiếp tục" : mode === "focus" ? "Bắt đầu tập trung" : `Bắt đầu ${modeLabels[mode].toLowerCase()}`}</button>{mode === "focus" && sessionStartedAt ? <button className="secondary-button px-4 py-3" onClick={endEarly}>🏁 Kết thúc phiên</button> : null}<button className="secondary-button px-4 py-3" onClick={() => reset(true)}><RotateCcw className="h-4 w-4" />Đặt lại</button>{mode !== "focus" && !running ? <button className="secondary-button px-4 py-3" onClick={skipBreak}>⏭ Bỏ qua nghỉ</button> : null}</div></div></div>
      <div className="space-y-5"><section className="panel p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-red-700 dark:text-red-300">Trước khi bắt đầu</p><h2 className="mt-2 font-display text-2xl font-bold">Bạn đang học gì?</h2></div><Settings2 className="h-5 w-5 text-red-700" /></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{activities.map((item) => <button key={item.id} type="button" className={`rounded-xl border p-3 text-left text-xs font-bold transition ${activity === item.id ? "border-red-600 bg-red-50 text-red-800 dark:bg-red-400/10 dark:text-red-200" : "border-slate-200 dark:border-white/10"}`} onClick={() => setActivity(item.id)}><span className="mr-1 text-base">{item.icon}</span>{item.label}</button>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Môn học<input className="field mt-2" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ví dụ: Lịch sử Việt Nam" /></label><label className="text-sm font-bold">Nội dung<input className="field mt-2" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ví dụ: Nhà Trần" /></label></div><div className="mt-4 flex flex-wrap gap-2"><button className="secondary-button" onClick={() => onView("flashcards")}><BookOpen className="h-4 w-4" />Mở Flashcard</button><button className="secondary-button" onClick={() => onView("quizzes")}><CircleHelp className="h-4 w-4" />Mở Đề kiểm tra</button></div></section><section className="panel p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Chọn nhịp học</p><h2 className="mt-2 font-display text-xl font-bold">Preset nhanh</h2></div><button className="text-sm font-bold text-red-700 underline-offset-4 hover:underline" onClick={() => setShowSettings((value) => !value)}>{showSettings ? "Ẩn tùy chỉnh" : "Tùy chỉnh"}</button></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{presets.map((preset) => <button key={preset.label} type="button" className={`rounded-xl border p-3 text-left ${focus === preset.focus && shortBreak === preset.short && longBreak === preset.long ? "border-red-600 bg-red-50 dark:bg-red-400/10" : "border-slate-200 dark:border-white/10"}`} onClick={() => choosePreset(preset)}><b className="block text-sm">{preset.label}</b><span className="mt-1 block text-xs text-slate-500">{preset.note}</span></button>)}</div>{showSettings ? <div className="mt-4 rounded-2xl border border-dashed border-red-200 p-4 dark:border-red-400/20"><div className="grid gap-3 sm:grid-cols-3"><label className="text-xs font-bold">Tập trung<input className="field mt-1" type="number" min="1" max="120" value={focus} onChange={(e) => { const value = clamp(Number(e.target.value) || 1, 1, 120); setFocus(value); if (!running && mode === "focus") setSeconds(value * 60); }} /></label><label className="text-xs font-bold">Nghỉ ngắn<input className="field mt-1" type="number" min="1" max="30" value={shortBreak} onChange={(e) => setShortBreak(clamp(Number(e.target.value) || 1, 1, 30))} /></label><label className="text-xs font-bold">Nghỉ dài<input className="field mt-1" type="number" min="1" max="45" value={longBreak} onChange={(e) => setLongBreak(clamp(Number(e.target.value) || 1, 1, 45))} /></label></div><label className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm dark:bg-white/5"><span>Tự động chuyển sang nghỉ</span><input type="checkbox" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} /></label></div> : null}</section><PersistentCollapsible storageKey="pomodoro-audio-center" title="Âm thanh tập trung" eyebrow="Audio Center"><div className="space-y-4"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-sky-700 dark:text-sky-300">Audio Center</p><h2 className="mt-2 font-display text-xl font-bold">Âm thanh tập trung</h2></div><button className="secondary-button" onClick={() => setSound((value) => !value)}>{sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}{sound ? "Đang bật" : "Đang tắt"}</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Cảnh âm thanh<select className="field mt-2" value={backgroundSound} onChange={(e) => setBackgroundSound(e.target.value)}>{Object.entries(SOUNDSCAPE_PRESETS).map(([id, preset]) => <option key={id} value={id}>{preset.label}</option>)}</select><span className="mt-1 block text-xs font-normal text-slate-500">{SOUNDSCAPE_PRESETS[backgroundSound]?.description}</span></label><button className="secondary-button self-end" onClick={previewBackground}>▶ Nghe thử</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold">Âm lượng tổng · {backgroundVolume}%<input aria-label="Âm lượng tổng" type="range" min="0" max="100" value={backgroundVolume} onChange={(e) => setBackgroundVolume(Number(e.target.value))} /></label><label className="text-xs font-bold">Âm báo · {alertVolume}%<input aria-label="Âm lượng âm báo" type="range" min="0" max="100" value={alertVolume} onChange={(e) => setAlertVolume(Number(e.target.value))} /></label></div><div className="mt-4 rounded-2xl border border-[#2e7d32]/15 bg-[#f2fbf2] p-4 dark:bg-white/5"><div className="flex items-center justify-between gap-2"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">🎚️ Mixer từng lớp</p><span className="text-xs font-bold text-slate-500">{selectedSoundscape.layers.length} lớp đang chọn</span></div>{selectedSoundscape.layers.length ? <div className="mt-3 grid gap-3 sm:grid-cols-2">{selectedSoundscape.layers.map((id) => { const layer = SOUNDSCAPE_LAYERS[id]; const value = layerVolumes[id] ?? 100; return <label key={id} className="rounded-xl border border-[#2e7d32]/10 bg-white/70 p-3 text-xs font-bold dark:bg-slate-900/50"><span className="flex items-center justify-between gap-2"><span>{layer?.label ?? id}</span><span className="text-[#c62828]">{value}%</span></span><input aria-label={`Âm lượng ${layer?.label ?? id}`} className="mt-2 w-full accent-[#c62828]" type="range" min="0" max="100" value={value} onChange={(e) => setLayerVolumes((current) => ({ ...current, [id]: Number(e.target.value) }))} /></label>; })}</div> : <p className="mt-2 text-xs text-slate-500">Chọn một cảnh có lớp âm thanh để điều chỉnh từng thành phần.</p>}</div><div className="mt-4 rounded-2xl bg-slate-50 p-3 dark:bg-white/5"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Thử âm báo từng trạng thái</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"><button className="secondary-button justify-center text-xs" onClick={() => previewEvent("start")}>▶ Bắt đầu</button><button className="secondary-button justify-center text-xs" onClick={() => previewEvent("tick")}>▶ Tick nhẹ</button><button className="secondary-button justify-center text-xs" onClick={() => previewEvent("complete")}>▶ Hoàn thành</button><button className="secondary-button justify-center text-xs" onClick={() => previewEvent("warning")}>▶ Cảnh báo</button><button className="secondary-button justify-center text-xs" onClick={() => previewEvent("reward")}>▶ Phần thưởng</button><button className="secondary-button justify-center text-xs" onClick={() => previewEvent("error")}>▶ Lỗi</button></div></div></div></PersistentCollapsible></div>
    </section>
    {running && miniPlayerVisible ? <aside className={`fixed inset-x-3 bottom-3 z-40 mx-auto ${miniPlayerExpanded ? "max-w-2xl" : "max-w-xl"} rounded-2xl border border-[#2e7d32]/25 bg-white/95 p-3 shadow-2xl backdrop-blur dark:bg-slate-950/95 ${miniPlayerPinned ? "ring-2 ring-[#c62828]/40" : ""}`} aria-label="Mini player âm thanh và Pomodoro"><div className="flex flex-wrap items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#c62828] text-xl text-white">🍅</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><strong className="font-mono text-lg">{display}</strong><button type="button" className="text-xs font-bold text-slate-500 underline" onClick={() => setMiniPlayerVisible(false)}>Đóng</button></div><p className="truncate text-xs font-bold text-[#2e7d32]">🎵 {selectedSoundscape.label} · {selectedSoundscape.layers.length} lớp đang hòa</p></div><button type="button" className="secondary-button px-3 py-2 text-xs" onClick={() => setMiniPlayerPinned((value) => !value)} aria-pressed={miniPlayerPinned}>{miniPlayerPinned ? "📌 Đã ghim" : "📌 Ghim"}</button><button type="button" className="secondary-button px-3 py-2 text-xs" onClick={() => setMiniPlayerExpanded((value) => !value)} aria-pressed={miniPlayerExpanded}>{miniPlayerExpanded ? "Thu gọn" : "Mở rộng"}</button><button type="button" className="secondary-button px-3 py-2" onClick={() => { if (!sound) void unlockAudio(); setSound((value) => !value); }} aria-label={sound ? "Tắt âm thanh" : "Bật âm thanh"}>{sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</button></div>{miniPlayerExpanded ? <div className="mt-3 grid gap-2 border-t border-[#2e7d32]/10 pt-3 sm:grid-cols-2"><p className="text-xs font-bold text-slate-600 dark:text-slate-300">{modeLabels[mode]} · Âm lượng tổng {backgroundVolume}%</p><p className="text-xs font-bold text-slate-600 dark:text-slate-300">Ghim chỉ giữ mini player trong trang; trình duyệt không cấp quyền always-on-top hệ điều hành.</p></div> : null}</aside> : null}
    {!miniPlayerVisible && running ? <button type="button" className="fixed bottom-3 right-3 z-40 rounded-full bg-[#2e7d32] px-4 py-2 text-xs font-black text-white shadow-lg" onClick={() => setMiniPlayerVisible(true)}>🎵 Mở mini player</button> : null}
    {completionBanner ? <div className="pomodoro-complete rounded-3xl border-2 border-[#2e7d32]/20 bg-[#eff9ef] p-5 text-center shadow-lg" role="status"><div className="text-4xl" aria-hidden="true">🎉 🌟 🐝</div><h2 className="mt-2 font-display text-2xl font-black text-[#2e7d32]">ONG VỪA HOÀN THÀNH 1 PHIÊN!</h2><p className="mt-2 text-sm font-bold text-[#35523a]">{selectedEmotion.encouragement}</p><div className="mt-4 flex flex-wrap justify-center gap-2"><button type="button" className="secondary-button" onClick={() => { setMode("shortBreak"); setSeconds(shortBreak * 60); }}>🍵 Nghỉ</button><button type="button" className="primary-button bg-[#c62828]" onClick={() => { setMode("focus"); setSeconds(focus * 60); start(); }}>🔥 Làm tiếp</button></div></div> : null}
    <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><section className="panel p-5 sm:p-6"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">7 ngày gần đây</p><h2 className="mt-2 font-display text-2xl font-bold">Phút tập trung theo ngày</h2></div><BarChart3 className="h-5 w-5 text-emerald-700" /></div><div className="mt-7 grid h-48 grid-cols-7 items-end gap-2" role="img" aria-label="Biểu đồ phút Pomodoro trong bảy ngày gần đây">{recentDays.map((day) => <div className="flex h-full min-w-0 flex-col justify-end" key={day.label}><div className="rounded-t-xl bg-gradient-to-t from-emerald-600 to-lime-300" style={{ height: `${Math.max(day.minutes ? 12 : 3, day.minutes / maxMinutes * 100)}%` }} title={`${day.label}: ${day.minutes} phút`} /><span className="mt-2 truncate text-center text-[11px] font-bold text-slate-500">{day.label}</span></div>)}</div></section><section className="panel p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-red-700 dark:text-red-300">Theo hoạt động học</p><h2 className="mt-2 font-display text-2xl font-bold">Thời gian đã đầu tư</h2><div className="mt-5 space-y-3">{byActivity.length ? byActivity.map((item) => <div key={item.id}><div className="flex justify-between gap-3 text-sm"><b className="truncate">{item.icon} {item.label}</b><span className="text-slate-500">{item.minutes} phút</span></div><div className="mt-1 h-2 rounded-full bg-red-100 dark:bg-red-400/10"><div className="h-full rounded-full bg-red-600" style={{ width: `${Math.min(100, item.minutes / Math.max(1, byActivity[0].minutes) * 100)}%` }} /></div></div>) : <p className="text-sm text-slate-500">Chọn hoạt động học trước khi bắt đầu để xem phân bổ.</p>}</div></section></section>
    <section className="grid gap-3 sm:grid-cols-3"><Metric icon={Clock3} label="Tổng phiên hoàn thành" value={completedFocus.length} detail={`${completedToday} hôm nay`} /><Metric icon={Flame} label="Tổng thời gian học" value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}p`} detail={`Trung bình ${average} phút/phiên`} /><Metric icon={Trophy} label="Mốc Pomodoro" value={computedAchievements(profile, config).filter((item) => item.metric === "pomodoroSessions").length || "—"} detail={`${profile.xp.toLocaleString("vi-VN")} XP`} /></section>
    <section className="panel p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-red-700 dark:text-red-300">Lịch sử tập trung</p><h2 className="mt-2 font-display text-2xl font-bold">Các phiên gần đây</h2></div><button className="secondary-button" onClick={() => onView("achievements")}><Trophy className="h-4 w-4" />Xem Thành tích</button></div>{profile.pomodoroHistory.length ? <div className="mt-5 grid gap-2 md:grid-cols-2">{profile.pomodoroHistory.slice(0, 8).map((item) => <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/10"><span className={`grid h-9 w-9 place-items-center rounded-xl ${item.status === "completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-white/5"}`}>{item.status === "completed" ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}</span><span className="min-w-0 flex-1"><b className="block truncate text-sm">{item.subject || "Tự học"}</b><small className="text-xs text-slate-500">{item.durationMinutes ? `${item.durationMinutes} phút` : "Chưa hoàn tất"} · {new Date(item.endedAt).toLocaleString("vi-VN")}</small></span><span className="text-xs font-bold text-slate-500">{item.status === "completed" ? "Hoàn thành" : item.status === "abandoned" ? "Chưa hoàn thành" : "Đã bỏ qua"}</span></div>)}</div> : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5">Chưa có phiên nào. Bắt đầu với 10 phút cũng là một bước tiến.</p>}</section>
  </div>;
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof Clock3; label: string; value: string | number; detail: string }) { return <div className="study-card p-5"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><Icon className="h-5 w-5" /></span><small className="text-right text-slate-400">{detail}</small></div><b className="mt-4 block text-2xl text-slate-950 dark:text-white">{typeof value === "number" ? value.toLocaleString("vi-VN") : value}</b><p className="mt-1 text-sm text-slate-500">{label}</p></div>; }
