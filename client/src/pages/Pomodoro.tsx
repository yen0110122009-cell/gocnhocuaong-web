import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  normalizeLumiWaterSettings,
  normalizePomodoroAlertSettings,
  POMODORO_ALERT_EVENT_IDS,
  type AppConfig,
  type PomodoroAlertEventId,
  type PomodoroSession,
  type LumiWaterSettings,
  type ProfileState,
} from "../../../shared/study";
import { POMODORO_SESSION_KEY, readPersistedPomodoro, recoverRunningSeconds, writePersistedPomodoro } from "../lib/pomodoroPersistence";
import { LUMI_WATER_ALERT_SOUNDS, isLumiWaterAlertSoundId, playLumiWaterAlert } from "../lib/lumiAlerts";
import { POMODORO_ALERT_SOUNDS, isPomodoroAlertSoundId, playPomodoroAlert } from "../lib/pomodoroAlerts";
import { DEFAULT_LUMI_WATER_MESSAGE, readLumiSpeechPreference, readLumiWaterMessage, saveLumiSpeechPreference, saveLumiWaterMessage } from "../lib/lumiPreferences";
import { emotionThemes, type EmotionId } from "../lib/emotionThemes";
import { dialoguesForGroup, LUMI_CUSTOM_DIALOGUES_EVENT, readLumiCustomDialogues, type LumiCustomDialogue } from "../lib/lumiCustomDialogues";
import { LUMI_CHECKIN_OPTIONS, LUMI_WATER_MESSAGE, LUMI_WATER_PRAISE, LUMI_WELCOME, lumiKaomojiForEmotion, lumiKaomojiForPomodoro, lumiRoutineGroup, lumiRoutineMessage } from "../lib/lumiPresets";
import { speakLumiVietnamese } from "../lib/lumiSpeech";
import { findLumiKaomojiDialogue, LUMI_MULTI_DIALOGUES_EVENT, pickRandomLumiDialogue, readLumiMultiDialogues, type LumiKaomojiDialogueEntry } from "../lib/lumiMultiDialogues";

type Mode = "focus" | "shortBreak" | "longBreak";
type Activity = "flashcards" | "quizzes" | "theory" | "deep" | "reading" | "exercise";
type LumiSupportKind = "comfort" | "encouragement";
type View = "pomodoro" | "flashcards" | "quizzes" | "history" | "plans";
type Props = { profile: ProfileState; config: AppConfig; onProfile: (profile: ProfileState, message?: string) => void; onView: (view: View) => void; onOpenDetached?: () => void; isVisible?: boolean };
const DETACHED_POMODORO_QUERY = "pomodoro-detached";
const DETACHED_POMODORO_ACTIVE_KEY = "pomodoro_detached_window_active";
const DETACHED_POMODORO_LEASE_MS = 20_000;
const isDetachedLeaseActive = (value: string | null) => { const timestamp = Number(value); return Number.isFinite(timestamp) && Date.now() - timestamp < DETACHED_POMODORO_LEASE_MS; };
function isDetachedPomodoroWindow() { return typeof window !== "undefined" && new URLSearchParams(window.location.search).get(DETACHED_POMODORO_QUERY) === "1"; }

const activities: Array<{ id: Activity; label: string; icon: string }> = [
  { id: "flashcards", label: "Flashcard", icon: "🃏" }, { id: "quizzes", label: "Đề kiểm tra", icon: "📝" }, { id: "theory", label: "Ôn lý thuyết", icon: "📖" }, { id: "deep", label: "Hiểu tận gốc", icon: "🧠" }, { id: "reading", label: "Đọc tài liệu", icon: "📚" }, { id: "exercise", label: "Làm bài tập", icon: "✍️" },
];
const presets = [{ label: "10 / 5", focus: 10, short: 5, long: 15 }, { label: "25 / 5", focus: 25, short: 5, long: 15 }, { label: "45 / 10", focus: 45, short: 10, long: 20 }];
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const labelForMode: Record<Mode, string> = { focus: "Tập trung", shortBreak: "Nghỉ ngắn", longBreak: "Nghỉ dài" };
const pomodoroAlertEventLabels: Record<PomodoroAlertEventId, string> = { startFocus: "Bắt đầu phiên tập trung", endFocus: "Kết thúc phiên tập trung", startBreak: "Bắt đầu giờ nghỉ", endBreak: "Kết thúc giờ nghỉ" };
const celebrationFireworks = [
  { emoji: "🎆", x: "-12rem", y: "-7rem" },
  { emoji: "🎇", x: "-5rem", y: "-10rem" },
  { emoji: "✨", x: "5rem", y: "-10rem" },
  { emoji: "🎉", x: "12rem", y: "-6rem" },
  { emoji: "🌟", x: "-14rem", y: "2rem" },
  { emoji: "🎊", x: "14rem", y: "2rem" },
  { emoji: "✨", x: "-8rem", y: "8rem" },
  { emoji: "🎆", x: "8rem", y: "8rem" },
] as const;
const GOAL_CELEBRATION_DURATION_MS = 4_600;
type AudioContextConstructor = new () => AudioContext;

export default function Pomodoro({ profile, config, onProfile, onView, onOpenDetached, isVisible = true }: Props) {
  const detachedWindow = isDetachedPomodoroWindow();
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
  const [goalCompletedSessions, setGoalCompletedSessions] = useState(restored?.goalCompletedSessions ?? 0);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(restored?.sessionStartedAt ?? null);
  const [compactMode, setCompactMode] = useState(restored?.compactMode ?? false);
  const [miniPlayerPinned, setMiniPlayerPinned] = useState(restored?.miniPlayerPinned ?? false);
  const [miniPlayerPosition, setMiniPlayerPosition] = useState({ x: restored?.miniPlayerX ?? 78, y: restored?.miniPlayerY ?? 78 });
  const [lumiPopupPosition, setLumiPopupPosition] = useState({ x: restored?.lumiPopupX ?? 50, y: restored?.lumiPopupY ?? 50 });
  const [detachedWindowActive, setDetachedWindowActive] = useState(() => { try { return isDetachedLeaseActive(window.localStorage.getItem(DETACHED_POMODORO_ACTIVE_KEY)); } catch { return false; } });
  const [pomodoroAlertSettings, setPomodoroAlertSettings] = useState(() => normalizePomodoroAlertSettings(restored?.pomodoroAlerts ?? profile.audioMixer?.pomodoroAlerts));
  const [goalCelebrationVisible, setGoalCelebrationVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showReasons, setShowReasons] = useState(false);
  const [showLumiDialog, setShowLumiDialog] = useState(false);
  const [lumiDialogResponse, setLumiDialogResponse] = useState<{ group: string; kaomoji: string; description: string; text: string } | null>(null);
  const [lumiDialogIntro, setLumiDialogIntro] = useState<string>(LUMI_WELCOME.text);
  const [supportMessage, setSupportMessage] = useState<{ kind: LumiSupportKind; text: string } | null>(null);
  const [lumiWaterSettings, setLumiWaterSettings] = useState<LumiWaterSettings>(() => normalizeLumiWaterSettings(profile.lumiWaterSettings));
  const [waterSecondsRemaining, setWaterSecondsRemaining] = useState(() => normalizeLumiWaterSettings(profile.lumiWaterSettings).intervalMinutes * 60);
  const [waterReminderVisible, setWaterReminderVisible] = useState(false);
  const [waterFeedback, setWaterFeedback] = useState<string | null>(null);
  const [waterCelebrated, setWaterCelebrated] = useState(false);
  const [lumiCustomDialogues, setLumiCustomDialogues] = useState<LumiCustomDialogue[]>(() => readLumiCustomDialogues());
  const [lumiMultiDialogues, setLumiMultiDialogues] = useState<LumiKaomojiDialogueEntry[]>(() => readLumiMultiDialogues());
  const [lumiWidgetDialogue, setLumiWidgetDialogue] = useState<string | null>(null);
  const [speechEnabledPreference, setSpeechEnabledPreference] = useState(() => readLumiSpeechPreference(profile.lumiSpeechEnabled !== false));
  const [waterMessageDraft, setWaterMessageDraft] = useState(() => readLumiWaterMessage());
  const completedFocusRef = useRef(0);
  const completionHandled = useRef(false);
  const alertContextRef = useRef<AudioContext | null>(null);
  const celebrationTimeoutRef = useRef<number | undefined>(undefined);
  const waterFeedbackTimeoutRef = useRef<number | undefined>(undefined);
  const widgetDragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  const popupDragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);
  const lastWaterClockKeyRef = useRef<string | null>(null);
  const incompletePlans = (profile.studyPlanItems ?? []).filter((item) => !item.completed);
  const selectedPlans = incompletePlans.filter((item) => checkedPlanItemIds.includes(item.id));
  const completedFocusCount = profile.pomodoroHistory.filter((item) => item.mode === "focus" && item.status === "completed").length;
  const completedSessions = profile.pomodoroHistory.filter((item) => item.mode === "focus" && item.status === "completed");
  const recentCompletedSessions = completedSessions.slice(0, 4);
  const activeMinutes = mode === "focus" ? focus : mode === "shortBreak" ? shortBreak : longBreak;
  const display = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const lumiMode = profile.pomodoroLumiSupportMode ?? "encouragement";
  const lumiSpeechEnabled = speechEnabledPreference;
  const [waterMessage, setWaterMessage] = useState(() => readLumiWaterMessage());
  const waterDisplay = lumiWaterSettings.scheduleMode === "clock" ? `Mỗi ngày: ${(lumiWaterSettings.dailyTimes ?? [lumiWaterSettings.dailyTime ?? "09:00"]).join(", ")}` : `${String(Math.floor(waterSecondsRemaining / 60)).padStart(2, "0")}:${String(waterSecondsRemaining % 60).padStart(2, "0")}`;
  const lumiKaomoji = waterCelebrated ? LUMI_WELCOME.kaomoji : waterReminderVisible ? "(´ー`)旦~~" : lumiKaomojiForPomodoro(mode, running);
  const lumiKaomojiEntry = useMemo(() => findLumiKaomojiDialogue(lumiMultiDialogues, lumiKaomoji), [lumiMultiDialogues, lumiKaomoji]);
  const lumiWelcomeEntry = useMemo(() => findLumiKaomojiDialogue(lumiMultiDialogues, LUMI_WELCOME.kaomoji), [lumiMultiDialogues]);
  const lumiKaomojiDescription = lumiKaomojiEntry?.description ?? "Lumi đồng hành";
  const lumiEmotion = emotionThemes.find((theme) => theme.id === (profile.emotionTheme ?? "calm")) ?? emotionThemes[0];
  const lumiRoutineDialogue = mode === "focus" && running ? dialoguesForGroup(lumiCustomDialogues, lumiRoutineGroup(mode, running))[0]?.text : undefined;
  const lumiActiveDialogue = waterCelebrated ? LUMI_WATER_PRAISE : waterReminderVisible ? waterMessage || LUMI_WATER_MESSAGE : lumiWidgetDialogue ?? lumiRoutineDialogue ?? lumiRoutineMessage(mode, running);

  useEffect(() => {
    writePersistedPomodoro({ focus, shortBreak, longBreak, seconds, mode, running, autoAdvance, pendingTransition, subject, topic, activity, notes, checkedPlanItemIds, totalSessions, goalCompletedSessions, sessionStartedAt, alertVolume: 0, pomodoroAlerts: pomodoroAlertSettings, compactMode, miniPlayerPinned, miniPlayerX: miniPlayerPosition.x, miniPlayerY: miniPlayerPosition.y, lumiPopupX: lumiPopupPosition.x, lumiPopupY: lumiPopupPosition.y });
  }, [focus, shortBreak, longBreak, seconds, mode, running, autoAdvance, pendingTransition, subject, topic, activity, notes, checkedPlanItemIds, totalSessions, goalCompletedSessions, sessionStartedAt, pomodoroAlertSettings, compactMode, miniPlayerPinned, miniPlayerPosition, lumiPopupPosition]);
  useEffect(() => {
    if (!detachedWindow) return;
    const writeLease = () => { try { window.localStorage.setItem(DETACHED_POMODORO_ACTIVE_KEY, String(Date.now())); } catch { /* localStorage may be unavailable */ } };
    writeLease();
    const heartbeat = window.setInterval(writeLease, 10_000);
    const clearActive = () => { try { window.localStorage.removeItem(DETACHED_POMODORO_ACTIVE_KEY); } catch { /* localStorage may be unavailable */ } };
    window.addEventListener("beforeunload", clearActive);
    return () => { window.clearInterval(heartbeat); window.removeEventListener("beforeunload", clearActive); clearActive(); };
  }, [detachedWindow]);
  useEffect(() => {
    const refreshDetachedLease = (value?: string | null) => { try { setDetachedWindowActive(isDetachedLeaseActive(value ?? window.localStorage.getItem(DETACHED_POMODORO_ACTIVE_KEY))); } catch { setDetachedWindowActive(false); } };
    const onDetachedStorage = (event: StorageEvent) => { if (event.key === DETACHED_POMODORO_ACTIVE_KEY) refreshDetachedLease(event.newValue); };
    refreshDetachedLease();
    const leaseCheck = window.setInterval(refreshDetachedLease, 5_000);
    window.addEventListener("storage", onDetachedStorage);
    return () => { window.clearInterval(leaseCheck); window.removeEventListener("storage", onDetachedStorage); };
  }, []);
  useEffect(() => {
    if (!running || (!detachedWindow && detachedWindowActive)) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1_000);
    return () => window.clearInterval(timer);
  }, [running, detachedWindow, detachedWindowActive]);
  useEffect(() => {
    const onPomodoroStorage = (event: StorageEvent) => {
      if (event.key !== POMODORO_SESSION_KEY) return;
      const saved = readPersistedPomodoro();
      if (!saved) return;
      const recovered = recoverRunningSeconds(saved);
      setSeconds(recovered); setMode(saved.mode); setRunning(saved.running && recovered > 0); setPendingTransition(saved.pendingTransition ?? null); setTotalSessions(saved.totalSessions); setGoalCompletedSessions(saved.goalCompletedSessions ?? 0); setSessionStartedAt(saved.sessionStartedAt); setFocus(saved.focus); setShortBreak(saved.shortBreak); setLongBreak(saved.longBreak);
    };
    window.addEventListener("storage", onPomodoroStorage);
    return () => window.removeEventListener("storage", onPomodoroStorage);
  }, [detachedWindow]);
  useEffect(() => {
    if (seconds !== 0 || completionHandled.current) return;
    completionHandled.current = true;
    if (mode === "focus") { triggerPomodoroAlert("endFocus"); completeFocus(); } else { triggerPomodoroAlert("endBreak"); completeBreak(); }
  }, [seconds, mode]);
  useEffect(() => {
    if (!running || mode !== "focus" || lumiMode === "off" || profile.popupsEnabled === false) return;
    const reminder = window.setTimeout(() => setSupportMessage(createSupport(lumiMode === "comfort" ? "comfort" : "encouragement")), 5 * 60_000);
    return () => window.clearTimeout(reminder);
  }, [running, mode, lumiMode, profile.popupsEnabled]);
  useEffect(() => {
    const next = normalizeLumiWaterSettings(profile.lumiWaterSettings);
    setLumiWaterSettings(next);
  }, [profile.lumiWaterSettings]);
  useEffect(() => { setSpeechEnabledPreference(readLumiSpeechPreference(profile.lumiSpeechEnabled !== false)); }, [profile.lumiSpeechEnabled]);
  useEffect(() => {
    const refresh = (event?: Event) => {
      const detail = (event as CustomEvent<LumiCustomDialogue[]> | undefined)?.detail;
      setLumiCustomDialogues(detail?.length ? detail : readLumiCustomDialogues());
    };
    const onStorage = (event: StorageEvent) => { if (event.key === "lumi_custom_dialogues") refresh(); };
    const refreshMultiDialogues = (event?: Event) => {
      const detail = (event as CustomEvent<LumiKaomojiDialogueEntry[]> | undefined)?.detail;
      setLumiMultiDialogues(detail?.length ? detail : readLumiMultiDialogues());
    };
    const onMultiStorage = (event: StorageEvent) => { if (event.key === "lumi_multi_dialogues_data") refreshMultiDialogues(); };
    window.addEventListener(LUMI_CUSTOM_DIALOGUES_EVENT, refresh);
    window.addEventListener("storage", onStorage);
    window.addEventListener(LUMI_MULTI_DIALOGUES_EVENT, refreshMultiDialogues);
    window.addEventListener("storage", onMultiStorage);
    return () => {
      window.removeEventListener(LUMI_CUSTOM_DIALOGUES_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(LUMI_MULTI_DIALOGUES_EVENT, refreshMultiDialogues);
      window.removeEventListener("storage", onMultiStorage);
    };
  }, []);
  useEffect(() => {
    setLumiWidgetDialogue(lumiKaomojiEntry ? pickRandomLumiDialogue(lumiKaomojiEntry)?.text ?? null : null);
  }, [lumiKaomojiEntry]);
  function showWaterReminder() {
    const reminderText = waterMessage || DEFAULT_LUMI_WATER_MESSAGE;
    if (profile.popupsEnabled === false) return;
    setWaterReminderVisible(true);
    setWaterCelebrated(false);
    setWaterFeedback(null);
    triggerLumiWaterAlert();
    speakLumi(reminderText);
  }

  useEffect(() => {
    if (!lumiWaterSettings.enabled) { setWaterSecondsRemaining(0); lastWaterClockKeyRef.current = null; return; }
    if (lumiWaterSettings.scheduleMode === "clock") {
      setWaterSecondsRemaining(0);
      const checkClock = () => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const clockKey = `${now.toDateString()}-${currentTime}`;
        const dailyTimes = lumiWaterSettings.dailyTimes ?? [lumiWaterSettings.dailyTime ?? "09:00"];
        if (dailyTimes.includes(currentTime) && lastWaterClockKeyRef.current !== clockKey) {
          lastWaterClockKeyRef.current = clockKey;
          showWaterReminder();
        }
      };
      checkClock();
      const timer = window.setInterval(checkClock, 1_000);
      return () => window.clearInterval(timer);
    }
    lastWaterClockKeyRef.current = null;
    setWaterSecondsRemaining(lumiWaterSettings.intervalMinutes * 60);
    const timer = window.setInterval(() => setWaterSecondsRemaining((value) => {
      if (value > 1) return value - 1;
      showWaterReminder();
      return lumiWaterSettings.intervalMinutes * 60;
    }), 1_000);
    return () => window.clearInterval(timer);
  }, [lumiWaterSettings.enabled, lumiWaterSettings.intervalMinutes, lumiWaterSettings.scheduleMode, lumiWaterSettings.dailyTime, lumiWaterSettings.dailyTimes, profile.popupsEnabled, profile.soundEnabled, lumiSpeechEnabled, waterMessage]);
  useEffect(() => () => { void alertContextRef.current?.close().catch(() => undefined); window.clearTimeout(waterFeedbackTimeoutRef.current); window.speechSynthesis?.cancel(); }, []);
  useEffect(() => () => window.clearTimeout(celebrationTimeoutRef.current), []);
  useEffect(() => {
    try { window.localStorage.setItem("pomodoro_lumi_timer_badge_visible", showLumiDialog ? "visible" : "hidden"); } catch { /* localStorage may be unavailable */ }
  }, [showLumiDialog]);
  useEffect(() => {
    if (!showLumiDialog) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") dismissLumiDialog(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showLumiDialog]);

  function speakLumi(text: string) {
    speakLumiVietnamese(text, profile.soundEnabled && lumiSpeechEnabled);
  }

  function triggerPomodoroAlert(eventId: PomodoroAlertEventId) {
    if (!profile.soundEnabled) return;
    const eventSettings = pomodoroAlertSettings.events[eventId];
    if (!eventSettings.enabled) return;
    void getAlertContext().then((context) => {
      if (context) playPomodoroAlert(context, eventSettings.soundId, pomodoroAlertSettings.masterVolume);
    }).catch(() => undefined);
  }

  function updatePomodoroAlertSettings(next: ReturnType<typeof normalizePomodoroAlertSettings>) {
    const normalized = normalizePomodoroAlertSettings(next);
    setPomodoroAlertSettings(normalized);
    if (profile.audioMixer) onProfile({ ...profile, audioMixer: { ...profile.audioMixer, pomodoroAlerts: normalized } }, "Đã lưu cài đặt âm báo Pomodoro.");
  }

  function previewPomodoroAlert(eventId: PomodoroAlertEventId) {
    if (!profile.soundEnabled) { toast.info("Hãy bật âm thanh của trang để nghe thử âm báo."); return; }
    const eventSettings = pomodoroAlertSettings.events[eventId];
    void getAlertContext().then((context) => {
      if (context) playPomodoroAlert(context, eventSettings.soundId, pomodoroAlertSettings.masterVolume);
    }).catch(() => undefined);
  }

  function previewWaterAlert() {
    if (!profile.soundEnabled) { toast.info("Hãy bật âm thanh của trang để nghe thử âm báo."); return; }
    void getAlertContext().then((context) => {
      if (context) playLumiWaterAlert(context, lumiWaterSettings.soundId, (profile.audioMixer?.lumi ?? 75) / 100);
    }).catch(() => undefined);
  }

  function triggerLumiWaterAlert() {
    if (!profile.soundEnabled) return;
    void getAlertContext().then((context) => { if (context) playLumiWaterAlert(context, lumiWaterSettings.soundId, (profile.audioMixer?.lumi ?? 75) / 100); }).catch(() => undefined);
  }

  function updateLumiWaterSettings(next: LumiWaterSettings) {
    const normalized = normalizeLumiWaterSettings(next);
    setLumiWaterSettings(normalized);
    setWaterSecondsRemaining(normalized.enabled && normalized.scheduleMode !== "clock" ? normalized.intervalMinutes * 60 : 0);
    onProfile({ ...profile, lumiWaterSettings: normalized }, "Đã lưu cài đặt nhắc uống nước của Lumi.");
  }

  function updateDailyWaterTimes(next: string[]) {
    updateLumiWaterSettings({ ...lumiWaterSettings, dailyTimes: next, dailyTime: next[0] ?? "09:00" });
  }

  function addDailyWaterTime() {
    const dailyTimes = lumiWaterSettings.dailyTimes ?? [lumiWaterSettings.dailyTime ?? "09:00"];
    if (dailyTimes.length >= 12) { toast.info("Bạn có thể đặt tối đa 12 mốc giờ trong một ngày."); return; }
    const candidate = ["09:00", "11:30", "14:00", "16:30", "20:00"].find((time) => !dailyTimes.includes(time)) ?? "22:00";
    updateDailyWaterTimes([...dailyTimes, candidate]);
  }

  function removeDailyWaterTime(time: string) {
    const dailyTimes = lumiWaterSettings.dailyTimes ?? [lumiWaterSettings.dailyTime ?? "09:00"];
    if (dailyTimes.length <= 1) { toast.info("Hãy giữ lại ít nhất một mốc giờ hoặc chuyển sang nhắc theo khoảng thời gian."); return; }
    updateDailyWaterTimes(dailyTimes.filter((item) => item !== time));
  }

  function saveWaterReminderMessage() {
    const saved = saveLumiWaterMessage(waterMessageDraft);
    setWaterMessage(saved);
    setWaterMessageDraft(saved);
    toast.success("Đã lưu câu nhắc uống nước của Lumi.");
  }

  function acknowledgeWater() {
    const praise = "Ngoan lắm! Tiếp tục thôi nào ✨";
    setWaterReminderVisible(false);
    setWaterCelebrated(true);
    setWaterFeedback("💧 Lumi thả tim: Ngoan lắm! Tiếp tục thôi nào ✨");
    speakLumi(praise);
    setWaterSecondsRemaining(lumiWaterSettings.intervalMinutes * 60);
    window.clearTimeout(waterFeedbackTimeoutRef.current);
    waterFeedbackTimeoutRef.current = window.setTimeout(() => { setWaterFeedback(null); setWaterCelebrated(false); }, 4_000);
  }

  function openLumiDialog() {
    const welcomeEntry = lumiWelcomeEntry;
    const intro = (welcomeEntry ? pickRandomLumiDialogue(welcomeEntry)?.text : null) ?? LUMI_WELCOME.text;
    setLumiDialogIntro(intro);
    setLumiDialogResponse(null);
    setShowLumiDialog(true);
    speakLumi(intro);
  }
  function dismissLumiDialog() { setShowLumiDialog(false); setLumiDialogResponse(null); setLumiDialogIntro(LUMI_WELCOME.text); }
  function chooseLumiFeeling(choice: EmotionId) {
    const details = LUMI_CHECKIN_OPTIONS.find((item) => item.id === choice) ?? LUMI_CHECKIN_OPTIONS[0];
    const kaomoji = lumiKaomojiForEmotion(choice);
    const multiEntry = findLumiKaomojiDialogue(lumiMultiDialogues, kaomoji);
    const groupDialogues = dialoguesForGroup(lumiCustomDialogues, details.group);
    const text = (multiEntry ? pickRandomLumiDialogue(multiEntry)?.text : null) ?? groupDialogues[Math.floor(Math.random() * groupDialogues.length)]?.text ?? "Lumi ở đây lắng nghe bạn nè 🍀";
    setLumiDialogResponse({ group: details.label, kaomoji, description: multiEntry?.description ?? details.label, text });
    setLumiWidgetDialogue(text);
    speakLumi(text);
    setShowLumiDialog(true);
  }

  function closeDetachedWindow() {
    if (window.opener) window.close();
    else toast.info("Hãy đóng tab/cửa sổ này bằng nút đóng của trình duyệt.");
  }

  function startWidgetDrag(event: React.PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button, input, select, textarea, a")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    widgetDragRef.current = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveWidget(event: React.PointerEvent<HTMLElement>) {
    if (!widgetDragRef.current || widgetDragRef.current.pointerId !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const halfWidthPercent = rect.width / window.innerWidth * 50;
    const halfHeightPercent = rect.height / window.innerHeight * 50;
    setMiniPlayerPosition({ x: clamp((event.clientX - widgetDragRef.current.offsetX + rect.width / 2) / window.innerWidth * 100, Math.max(8, halfWidthPercent), Math.min(92, 100 - halfWidthPercent)), y: clamp((event.clientY - widgetDragRef.current.offsetY + rect.height / 2) / window.innerHeight * 100, Math.max(10, halfHeightPercent), Math.min(90, 100 - halfHeightPercent)) });
  }
  function stopWidgetDrag(event: React.PointerEvent<HTMLElement>) {
    if (widgetDragRef.current?.pointerId === event.pointerId) widgetDragRef.current = null;
  }

  function startLumiPopupDrag(event: React.PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button, input, select, textarea, a")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    popupDragRef.current = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveLumiPopup(event: React.PointerEvent<HTMLElement>) {
    if (!popupDragRef.current || popupDragRef.current.pointerId !== event.pointerId) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setLumiPopupPosition({ x: clamp((event.clientX - popupDragRef.current.offsetX + rect.width / 2) / window.innerWidth * 100, 20, 80), y: clamp((event.clientY - popupDragRef.current.offsetY + rect.height / 2) / window.innerHeight * 100, 18, 82) });
  }

  function stopLumiPopupDrag(event: React.PointerEvent<HTMLElement>) {
    if (popupDragRef.current?.pointerId === event.pointerId) popupDragRef.current = null;
  }

  function dismissGoalCelebration() {
    window.clearTimeout(celebrationTimeoutRef.current);
    setGoalCelebrationVisible(false);
  }
  function celebrateGoal() {
    window.clearTimeout(celebrationTimeoutRef.current);
    setGoalCelebrationVisible(true);
    celebrationTimeoutRef.current = window.setTimeout(() => setGoalCelebrationVisible(false), GOAL_CELEBRATION_DURATION_MS);
  }

  function createSupport(kind: LumiSupportKind) {
    const stateId = kind === "comfort" ? "mistake" : "encouragement";
    const state = (config.mascotStates ?? []).find((item) => item.id === stateId && item.enabled && !item.deletedAt);
    const line = (config.mascotVoiceLines ?? []).find((item) => item.state === stateId && item.enabled && !item.deletedAt);
    const custom = (config.customContent ?? []).find((item) => item.enabled && !item.deletedAt && item.modules.includes("pomodoro"));
    const dialogueGroup = kind === "comfort" ? "comfort" : "encouragement";
    const customLine = dialoguesForGroup(lumiCustomDialogues, dialogueGroup)[Math.floor(Math.random() * dialoguesForGroup(lumiCustomDialogues, dialogueGroup).length)]?.text;
    return { kind, text: customLine || line?.text || custom?.text || state?.description || (kind === "comfort" ? "Không sao nếu hôm nay chậm. Mình cùng quay lại bằng một bước vừa sức nhé." : "Mỗi phút bạn đang ở lại với việc học đều đáng được ghi nhận.") };
  }
  function askLumi(kind: LumiSupportKind) { const next = createSupport(kind); setSupportMessage(next); setShowSupport(true); speakLumi(next.text); }
  function recordAvoidance(reason: string) {
    onProfile({ ...profile, avoidanceReasons: [{ id: crypto.randomUUID(), occurredAt: new Date().toISOString(), reason: reason as never }, ...(profile.avoidanceReasons ?? [])].slice(0, 100) }, "Lumi đã ghi nhận để hỗ trợ bạn nhẹ nhàng hơn, không dùng để chấm điểm.");
    setShowReasons(false);
  }
  function restore() {
    const saved = readPersistedPomodoro();
    if (!saved) { toast.info("Chưa có phiên Pomodoro để khôi phục."); return; }
    const recovered = recoverRunningSeconds(saved);
    setFocus(saved.focus); setShortBreak(saved.shortBreak); setLongBreak(saved.longBreak); setSeconds(recovered); setMode(saved.mode); setRunning(saved.running && recovered > 0); setAutoAdvance(saved.autoAdvance); setPendingTransition(saved.pendingTransition ?? null); setSubject(saved.subject); setTopic(saved.topic); setActivity((saved.activity as Activity) ?? "theory"); setNotes(saved.notes ?? ""); setCheckedPlanItemIds(saved.checkedPlanItemIds ?? []); setTotalSessions(saved.totalSessions); setGoalCompletedSessions(saved.goalCompletedSessions ?? 0); setSessionStartedAt(saved.sessionStartedAt); setCompactMode(saved.compactMode); setMiniPlayerPinned(saved.miniPlayerPinned); setMiniPlayerPosition({ x: saved.miniPlayerX, y: saved.miniPlayerY }); completionHandled.current = false;
    toast.success(saved.running && recovered > 0 ? "Đã khôi phục phiên Pomodoro đang chạy." : "Đã khôi phục phiên Pomodoro đã lưu.");
  }
  async function getAlertContext() {
    if (typeof window === "undefined") return null;
    const browserWindow = window as typeof window & { webkitAudioContext?: AudioContextConstructor };
    const AudioContextClass = window.AudioContext ?? browserWindow.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!alertContextRef.current || alertContextRef.current.state === "closed") alertContextRef.current = new AudioContextClass();
    if (alertContextRef.current.state === "suspended") await alertContextRef.current.resume();
    return alertContextRef.current;
  }
  function begin() {
    if (pendingTransition === "break") { setPendingTransition(null); setSeconds((mode === "longBreak" ? longBreak : shortBreak) * 60); setRunning(true); completionHandled.current = false; triggerPomodoroAlert("startBreak"); return; }
    if (pendingTransition === "focus") { setPendingTransition(null); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(new Date().toISOString()); setRunning(true); completionHandled.current = false; triggerPomodoroAlert("startFocus"); return; }
    if (running) { setRunning(false); return; }
    if (mode === "focus" && goalCompletedSessions >= totalSessions) setGoalCompletedSessions(0);
    if (mode === "focus" && !sessionStartedAt) setSessionStartedAt(new Date().toISOString());
    setRunning(true); completionHandled.current = false; triggerPomodoroAlert(mode === "focus" ? "startFocus" : "startBreak");
  }
  function reset() { if (running && !window.confirm("Đặt lại phiên đang chạy? Thời gian chưa hoàn thành sẽ không được ghi nhận.")) return; setRunning(false); setPendingTransition(null); setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(null); completionHandled.current = false; }
  function completeFocus() {
    const endedAt = new Date().toISOString(); const activityLabel = activities.find((item) => item.id === activity)?.label ?? "Học tập";
    const session: PomodoroSession = { id: crypto.randomUUID(), startedAt: sessionStartedAt ?? new Date(Date.now() - focus * 60_000).toISOString(), endedAt, durationMinutes: focus, subject: subject.trim() || "Tự học", topic: topic.trim() || activityLabel, activity: activityLabel, notes: notes.trim() || undefined, checkedPlanItemIds, checkedPlanTitles: selectedPlans.map((item) => item.title), sessionNumber: completedFocusCount % 4 + 1, totalSessions, mode: "focus", status: "completed" };
    const activityRow = { id: `pomodoro-${session.id}`, occurredAt: endedAt, kind: "pomodoro" as const, quantity: 1, durationSeconds: focus * 60, xpEarned: 0 };
    const completedInGoal = Math.min(totalSessions, goalCompletedSessions + 1);
    const goalReached = completedInGoal >= totalSessions;
    onProfile({ ...profile, pomodoroHistory: [session, ...profile.pomodoroHistory].slice(0, 500), studyActivity: [activityRow, ...profile.studyActivity].slice(0, 2_000) }, goalReached ? "Đã đạt mục tiêu Pomodoro." : "Đã lưu phiên Pomodoro vào Lịch sử học.");
    completedFocusRef.current += 1; setGoalCompletedSessions(completedInGoal); const nextMode: Mode = (completedFocusCount + 1) % 4 === 0 ? "longBreak" : "shortBreak"; setSessionStartedAt(null);
    if (goalReached) { setMode("focus"); setSeconds(0); setRunning(false); setPendingTransition(null); celebrateGoal(); toast.success(`Chúc mừng Ong đã hoàn thành ${totalSessions} phiên Pomodoro.`); return; }
    if (autoAdvance) { setMode(nextMode); setSeconds((nextMode === "longBreak" ? longBreak : shortBreak) * 60); setRunning(true); completionHandled.current = false; triggerPomodoroAlert("startBreak"); toast.success("Đã hoàn thành phiên. Pomodoro chuyển sang thời gian nghỉ."); }
    else { setMode(nextMode); setSeconds(0); setRunning(false); setPendingTransition("break"); completionHandled.current = false; toast.success("Đã hoàn thành phiên. Khi sẵn sàng, bạn có thể bắt đầu nghỉ."); }
  }
  function completeBreak() {
    if (autoAdvance) { setMode("focus"); setSeconds(focus * 60); setSessionStartedAt(new Date().toISOString()); setRunning(true); completionHandled.current = false; triggerPomodoroAlert("startFocus"); }
    else { setMode("focus"); setRunning(false); setPendingTransition("focus"); completionHandled.current = false; }
  }
  function choosePreset(value: typeof presets[number]) { if (running && !window.confirm("Đổi nhịp học sẽ dừng phiên hiện tại. Tiếp tục?")) return; setRunning(false); setFocus(value.focus); setShortBreak(value.short); setLongBreak(value.long); setMode("focus"); setSeconds(value.focus * 60); setSessionStartedAt(null); }
  function togglePlan(id: string) { setCheckedPlanItemIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]); }

  const lumiPopups = <>{showLumiDialog ? <div className="modal-backdrop grid place-items-center p-4" role="presentation" onClick={dismissLumiDialog}><section className="lumi-popup-modal w-full max-w-md border border-emerald-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-emerald-300/25 dark:bg-slate-900 dark:text-slate-100" style={{ left: `${lumiPopupPosition.x}%`, top: `${lumiPopupPosition.y}%`, transform: "translate(-50%, -50%)" }} role="dialog" aria-modal="true" aria-labelledby="lumi-checkin-title" onClick={(event) => event.stopPropagation()}><div className="lumi-popup-drag-handle touch-none select-none text-center" title="Kéo Lumi để di chuyển popup" onPointerDown={startLumiPopupDrag} onPointerMove={moveLumiPopup} onPointerUp={stopLumiPopupDrag} onPointerCancel={stopLumiPopupDrag}><div className="text-5xl" aria-hidden="true">{lumiDialogResponse?.kaomoji ?? LUMI_WELCOME.kaomoji}</div><p className="mt-3 text-xs font-black uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Lumi hỏi thăm</p><h2 id="lumi-checkin-title" className="mt-1 font-display text-2xl font-black">{lumiDialogResponse ? lumiDialogResponse.group : "Hôm nay Ong cảm thấy thế nào?"}</h2><p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">{lumiDialogResponse?.description ?? lumiWelcomeEntry?.description ?? "Lumi sẵn sàng lắng nghe"}</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lumiDialogResponse?.text ?? lumiDialogIntro}</p></div>{!lumiDialogResponse ? <div className="lumi-quick-feelings-grid mt-5">{LUMI_CHECKIN_OPTIONS.map((choice) => <button key={choice.id} type="button" className="secondary-button justify-center text-sm" onClick={() => chooseLumiFeeling(choice.id)}>{choice.emoji} {choice.label}</button>)}</div> : <div className="mt-5 flex gap-2"><button type="button" className="secondary-button flex-1 justify-center" onClick={() => setLumiDialogResponse(null)}>Hỏi lại</button><button type="button" className="primary-button flex-1 justify-center" onClick={dismissLumiDialog}>Cảm ơn Lumi</button></div>}</section></div> : null}{waterReminderVisible ? <div className="modal-backdrop grid place-items-center p-4" role="presentation" onClick={() => setWaterReminderVisible(false)}><section className="lumi-popup-modal w-full max-w-sm border border-sky-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-sky-300/25 dark:bg-slate-900 dark:text-slate-100" role="dialog" aria-modal="true" aria-labelledby="lumi-water-title" onClick={(event) => event.stopPropagation()}><div className="text-center"><div className="text-5xl" aria-hidden="true">(´ー`)旦~~</div><p className="mt-3 text-xs font-black uppercase tracking-[.16em] text-sky-700 dark:text-sky-300">Lumi nhắc uống nước</p><h2 id="lumi-water-title" className="mt-1 font-display text-2xl font-black">Đến giờ uống nước rồi!</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{waterMessage || LUMI_WATER_MESSAGE}</p></div><button type="button" className="primary-button mt-5 w-full justify-center" onClick={acknowledgeWater}>Đã uống 💧</button></section></div> : null}</>;
  const supportButtons = <div className="flex flex-wrap gap-2"><button type="button" className="secondary-button text-xs" onClick={() => askLumi("comfort")}>Cần an ủi</button><button type="button" className="secondary-button text-xs" onClick={() => askLumi("encouragement")}>Cần động viên</button><button type="button" className="secondary-button text-xs" onClick={() => { openLumiDialog(); }}>Hỏi thăm cảm xúc</button></div>;
  const lumiTimerBadge = showLumiDialog ? <div className="lumi-timer-badge" role="timer" aria-live="off" aria-label={`Lumi đang đếm ngược ${display}`}><span aria-hidden="true">⏱️</span><span>{display}</span></div> : null;
  if (!isVisible) {
    if (!(running || miniPlayerPinned || showLumiDialog || waterReminderVisible)) return null;
    return <>{showLumiDialog ? lumiTimerBadge : <aside className="pomodoro-pinned-widget fixed w-[min(92vw,22rem)] touch-none select-none rounded-2xl border border-emerald-300/50 bg-[linear-gradient(135deg,#fffdf8_0%,#eff9f0_100%)] p-4 text-slate-900 shadow-2xl" style={{ left: `${miniPlayerPosition.x}%`, top: `${miniPlayerPosition.y}%`, transform: "translate(-50%, -50%)" }} aria-label="Pomodoro Lumi đang chạy" onPointerDown={startWidgetDrag} onPointerMove={moveWidget} onPointerUp={stopWidgetDrag} onPointerCancel={stopWidgetDrag}><div className="lumi-widget-header"><button type="button" className="lumi-avatar-box shadow-inner" aria-label="Mở hộp thoại hỏi thăm của Lumi" onClick={() => { openLumiDialog(); }}><span className={`lumi-kaomoji-text ${lumiKaomoji.length > 8 ? "lumi-kaomoji-text--long" : ""}`}>{lumiKaomoji}</span></button><div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-[.16em] text-emerald-800">Lumi · Pomodoro</p><p className="mt-1 font-mono text-3xl font-black">{display}</p><p className="truncate text-xs font-semibold text-slate-600">{labelForMode[mode]} · {lumiEmotion.label} · {subject || "Tự học"}</p><p className="mt-1 truncate text-[11px] font-bold text-emerald-700">{lumiKaomojiDescription}</p><p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-600">{lumiActiveDialogue}</p></div></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" className="primary-button flex-1" onClick={begin}>{running ? "Tạm dừng" : "Tiếp tục"}</button><button type="button" className="secondary-button text-xs" onClick={() => onView("pomodoro")}>Mở Pomodoro</button>{onOpenDetached && !detachedWindow ? <button type="button" className="secondary-button text-xs" onClick={onOpenDetached}>↗ Ghim ra màn hình</button> : null}</div>{waterFeedback ? <p className="mt-2 text-xs font-black text-rose-600">{waterFeedback}</p> : null}</aside>}{lumiPopups}</>;
  }
  return <>{lumiTimerBadge}<div className="space-y-5"><header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-xs font-black uppercase tracking-[.18em] text-red-700 dark:text-red-300">Nhịp học tự quản lý</p><h1 className="mt-2 font-display text-4xl font-black">Pomodoro</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">Giữ nhịp tập trung, lưu môn học, nội dung và ghi chú của phiên. Bộ đếm vẫn chạy khi bạn đổi menu.</p></div><div className="flex flex-wrap gap-2"><button type="button" className="secondary-button" onClick={() => setCompactMode((value) => !value)}>{compactMode ? "Mở đầy đủ" : "Thu nhỏ"}</button><button type="button" className="secondary-button" onClick={restore}>Khôi phục phiên</button><button type="button" className="secondary-button" onClick={() => onView("history")}>Lịch sử học</button>{onOpenDetached && !detachedWindow ? <button type="button" className="primary-button" onClick={onOpenDetached}>↗ Ghim ra màn hình</button> : null}{detachedWindow ? <button type="button" className="secondary-button" onClick={closeDetachedWindow}>Đóng cửa sổ</button> : null}</div></header>
    <section className="grid gap-3" aria-label="Thống kê Pomodoro">
      <div className="panel overflow-hidden p-0"><div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10"><div><p className="text-[11px] font-black uppercase tracking-[.15em] text-emerald-700 dark:text-emerald-300">Lịch sử Pomodoro</p><p className="text-sm font-bold">{completedSessions.length} phiên tập trung đã hoàn thành</p></div><button type="button" className="secondary-button text-xs" onClick={() => onView("history")}>Xem tất cả</button></div>{recentCompletedSessions.length ? <div className="divide-y divide-slate-100 dark:divide-white/10">{recentCompletedSessions.map((item) => <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-4 py-2.5 text-sm"><div className="min-w-0"><p className="truncate font-bold">{item.subject || "Tự học"} · {item.topic || "Pomodoro"}</p><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-300">{new Date(item.endedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} · {item.durationMinutes} phút</p></div><span className="self-center text-xs font-black text-emerald-700 dark:text-emerald-300">Đã xong</span></div>)}</div> : <p className="px-4 py-5 text-sm text-slate-500 dark:text-slate-300">Chưa có phiên Pomodoro hoàn thành. Phiên đầu tiên sẽ xuất hiện tại đây.</p>}</div>
    </section>
    {compactMode ? <section className="panel p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Pomodoro thu nhỏ</p><p className="font-mono text-5xl font-black text-slate-950 dark:text-white">{display}</p><p className="mt-1 text-xs font-bold text-slate-500">{labelForMode[mode]} · {subject || "Tự học"}</p></div><div className="flex flex-wrap gap-2"><button type="button" className="primary-button" onClick={begin}>{running ? "Tạm dừng" : pendingTransition ? "Tiếp tục" : "Bắt đầu"}</button><button type="button" className="secondary-button" onClick={reset}>Đặt lại</button>{onOpenDetached && !detachedWindow ? <button type="button" className="secondary-button" onClick={onOpenDetached}>↗ Ghim ra màn hình</button> : null}</div></div><div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">{supportButtons}</div></section> : <>
      <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]"><section className="panel p-6 text-center"><p className="text-xs font-black uppercase tracking-[.18em] text-red-700 dark:text-red-300">{labelForMode[mode]}</p><p className="mt-4 font-mono text-[clamp(4rem,12vw,7rem)] font-black tracking-tight">{display}</p><p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-300">{pendingTransition === "break" ? "Phiên học đã xong. Khi sẵn sàng, hãy bắt đầu nghỉ." : pendingTransition === "focus" ? "Thời gian nghỉ đã xong. Khi sẵn sàng, hãy học tiếp." : running ? "Bộ đếm vẫn tiếp tục khi bạn mở phần khác." : "Chọn nhịp học và bắt đầu khi bạn sẵn sàng."}</p><div className="mt-6 flex flex-wrap justify-center gap-2"><button type="button" className="primary-button min-w-40" onClick={begin}>{running ? "Tạm dừng" : pendingTransition === "break" ? "Bắt đầu nghỉ" : pendingTransition === "focus" ? "Bắt đầu phiên" : "Bắt đầu"}</button><button type="button" className="secondary-button" onClick={reset}>Đặt lại</button><button type="button" className="secondary-button" onClick={() => setMiniPlayerPinned((value) => !value)}>{miniPlayerPinned ? "Bỏ ghim" : "Ghim mini"}</button>{onOpenDetached && !detachedWindow ? <button type="button" className="primary-button" onClick={onOpenDetached}>↗ Ghim ra màn hình</button> : null}</div><div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-left dark:bg-emerald-400/10"><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-800 dark:text-emerald-200">Lumi ở đây khi bạn cần</p><p className="mt-1 text-sm text-slate-600 dark:text-slate-200">Không có nhiệm vụ ngẫu nhiên hay thử thách ép buộc. Chỉ cần chọn lời hỗ trợ phù hợp với lúc này.</p><div className="mt-3">{supportButtons}</div></div></section>
      <section className="panel p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Trước khi bắt đầu</p><h2 className="mt-1 font-display text-2xl font-black">Bạn đang học gì?</h2></div><button type="button" className="text-sm font-bold text-red-700 underline" onClick={() => setShowSettings((value) => !value)}>{showSettings ? "Ẩn nhịp học" : "Chỉnh nhịp học"}</button></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{activities.map((item) => <button key={item.id} type="button" className={`rounded-xl border p-3 text-left text-xs font-bold ${activity === item.id ? "border-red-500 bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-100" : "border-slate-200 dark:border-white/10"}`} onClick={() => setActivity(item.id)}>{item.icon} {item.label}</button>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold">Môn học<input className="field mt-2" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Ví dụ: Lịch sử Việt Nam" /></label><label className="text-sm font-bold">Nội dung<input className="field mt-2" value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Ví dụ: Nhà Trần" /></label></div><label className="mt-3 block text-sm font-bold">Ghi chú phiên học<textarea className="field mt-2 min-h-20" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Điều đã học, điểm cần xem lại hoặc cảm nhận ngắn." /></label>{showSettings ? <div className="mt-4 rounded-2xl border border-dashed border-red-200 p-4 dark:border-red-300/20"><div className="grid gap-2 sm:grid-cols-3">{presets.map((preset) => <button key={preset.label} type="button" className="rounded-xl border border-slate-200 p-3 text-left text-sm font-bold dark:border-white/10" onClick={() => choosePreset(preset)}>{preset.label}</button>)}</div><div className="mt-3 grid grid-cols-3 gap-2"><label className="text-xs font-bold">Tập trung<input className="field mt-1" type="number" min="1" max="120" value={focus} onChange={(event) => { const value = clamp(Number(event.target.value) || 1, 1, 120); setFocus(value); if (!running && mode === "focus") setSeconds(value * 60); }} /></label><label className="text-xs font-bold">Nghỉ ngắn<input className="field mt-1" type="number" min="1" max="30" value={shortBreak} onChange={(event) => setShortBreak(clamp(Number(event.target.value) || 1, 1, 30))} /></label><label className="text-xs font-bold">Nghỉ dài<input className="field mt-1" type="number" min="1" max="45" value={longBreak} onChange={(event) => setLongBreak(clamp(Number(event.target.value) || 1, 1, 45))} /></label></div></div> : null}</section></section>
      <section className="panel p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-amber-700">Kế hoạch liên quan</p><h2 className="mt-1 font-display text-2xl font-black">Công việc đang thực hiện trong phiên</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Chọn các mục để lưu cùng lịch sử Pomodoro. Việc đánh dấu hoàn thành và phần thưởng vẫn do bạn thực hiện trong Kế hoạch.</p></div><button type="button" className="secondary-button text-xs" onClick={() => onView("plans")}>Mở Kế hoạch</button></div>{incompletePlans.length ? <div className="mt-4 grid gap-2 md:grid-cols-2">{incompletePlans.map((item) => <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-3 dark:border-white/10"><input className="mt-1" type="checkbox" checked={checkedPlanItemIds.includes(item.id)} onChange={() => togglePlan(item.id)} /><span><b className="block text-sm">{item.title}</b><small className="mt-1 block text-xs text-slate-500">{item.subject ?? "Chưa phân môn"} · {item.cadence === "day" ? "Kế hoạch ngày" : "Kế hoạch tuần"}</small></span></label>)}</div> : <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5">Chưa có kế hoạch mở. Bạn vẫn có thể ghi môn học và nội dung ngay trong phiên này.</p>}</section>
      <section className="panel p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Hỗ trợ chống trì hoãn</p><h2 className="mt-1 font-display text-2xl font-black">Bắt đầu theo cách nhẹ nhàng</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Không phán xét và không chia nhỏ thành nhiệm vụ ngẫu nhiên. Nếu bạn thấy khó bắt đầu, Lumi chỉ dùng thông tin này để đưa lời nhắc phù hợp hơn.</p></div><button type="button" className="secondary-button" onClick={() => setShowReasons((value) => !value)}>{showReasons ? "Thu gọn" : "Điều gì đang làm khó?"}</button></div>{showReasons ? <div className="mt-4 grid gap-2 sm:grid-cols-3">{["Mệt", "Khó bắt đầu", "Nội dung quá nhiều", "Mất tập trung", "Lo lắng", "Không rõ nên làm gì"].map((reason) => <button type="button" key={reason} className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-left text-sm font-bold text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100" onClick={() => recordAvoidance(reason)}>{reason}</button>)}</div> : null}</section>
      <section className="panel p-5" aria-label="Cài đặt Lumi và Pomodoro"><div><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Lumi · Pomodoro</p><h2 className="mt-1 font-display text-xl font-black">Âm thanh tối giản, tập trung hơn</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Pomodoro không phát nhạc nền. Chỉ có âm báo nhắc nước do Ong chọn và giọng đọc Lumi khi được bật.</p></div><div className="mt-5 rounded-2xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-300/15 dark:bg-violet-950/20"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.14em] text-violet-700 dark:text-violet-300">Âm báo phiên học</p><h3 className="mt-1 text-base font-black">Báo khi bắt đầu/kết thúc</h3><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Đây là âm báo ngắn bằng Web Audio, không phải nhạc nền. Mỗi mốc có thể bật/tắt, chọn âm và nghe thử.</p></div><label className="text-xs font-bold text-violet-900 dark:text-violet-100">Âm lượng<input className="field mt-1 w-28" type="number" min="0" max="2" step="0.05" value={pomodoroAlertSettings.masterVolume} onChange={(event) => updatePomodoroAlertSettings({ ...pomodoroAlertSettings, masterVolume: Number(event.target.value) })} aria-label="Âm lượng âm báo Pomodoro" /></label></div><div className="mt-3 grid gap-2 md:grid-cols-2">{POMODORO_ALERT_EVENT_IDS.map((eventId) => { const eventSettings = pomodoroAlertSettings.events[eventId]; return <div key={eventId} className="rounded-xl border border-violet-100 bg-white/80 p-3 dark:border-white/10 dark:bg-white/[.035]"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={eventSettings.enabled} onChange={(event) => updatePomodoroAlertSettings({ ...pomodoroAlertSettings, events: { ...pomodoroAlertSettings.events, [eventId]: { ...eventSettings, enabled: event.target.checked } } })} />{pomodoroAlertEventLabels[eventId]}</label><div className="mt-2 flex gap-2"><select className="field min-w-0 flex-1 text-xs" value={eventSettings.soundId} onChange={(event) => { if (isPomodoroAlertSoundId(event.target.value)) updatePomodoroAlertSettings({ ...pomodoroAlertSettings, events: { ...pomodoroAlertSettings.events, [eventId]: { ...eventSettings, soundId: event.target.value } } }); }} aria-label={`Âm báo ${pomodoroAlertEventLabels[eventId]}`}>{POMODORO_ALERT_SOUNDS.map((sound) => <option key={sound.id} value={sound.id}>{sound.label}</option>)}</select><button type="button" className="secondary-button shrink-0 px-3 text-xs" onClick={() => previewPomodoroAlert(eventId)}><span aria-hidden="true">🔊</span> Nghe thử</button></div></div>; })}</div></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_.95fr]"><fieldset><legend className="text-sm font-bold">Mục tiêu và cách chuyển phiên</legend><label className="mt-3 block text-sm font-bold">Mục tiêu phiên học · {goalCompletedSessions}/{totalSessions}<input aria-label="Mục tiêu số phiên Pomodoro" className="field mt-2" type="number" min="1" max="12" value={totalSessions} onChange={(event) => { const next = clamp(Number(event.target.value) || 1, 1, 12); setTotalSessions(next); setGoalCompletedSessions((current) => Math.min(current, next)); }} /></label><p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-300">Đạt đủ mục tiêu, Pomodoro dừng lại và chúc mừng Ong.</p><label className="mt-4 flex gap-2 text-sm"><input type="radio" name="auto" checked={autoAdvance} onChange={() => setAutoAdvance(true)} />Tự động chuyển</label><label className="mt-2 flex gap-2 text-sm"><input type="radio" name="auto" checked={!autoAdvance} onChange={() => setAutoAdvance(false)} />Tôi tự nhấn để chuyển</label></fieldset><fieldset><legend className="text-sm font-bold">Giọng đọc và nhắc uống nước</legend><label className="mt-3 flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={lumiSpeechEnabled} onChange={(event) => { setSpeechEnabledPreference(event.target.checked); saveLumiSpeechPreference(event.target.checked); onProfile({ ...profile, lumiSpeechEnabled: event.target.checked }, `Đã ${event.target.checked ? "bật" : "tắt"} giọng đọc Lumi.`); }} />Đọc lời thoại Lumi bằng giọng tiếng Việt</label><div className="mt-3 grid gap-3 sm:grid-cols-[minmax(9rem,.8fr)_minmax(8rem,1fr)]"><label className="text-sm font-bold">Cách nhắc<select className="field mt-1" value={lumiWaterSettings.scheduleMode ?? "interval"} onChange={(event) => updateLumiWaterSettings({ ...lumiWaterSettings, scheduleMode: event.target.value === "clock" ? "clock" : "interval" })}><option value="interval">Theo khoảng thời gian</option><option value="clock">Theo mốc giờ mỗi ngày</option></select></label>{lumiWaterSettings.scheduleMode === "clock" ? <div className="space-y-2"><div className="flex items-center justify-between gap-2"><span className="text-sm font-bold">Các mốc giờ trong ngày</span><button type="button" className="secondary-button px-3 py-1.5 text-xs" onClick={addDailyWaterTime}>+ Thêm mốc giờ</button></div>{(lumiWaterSettings.dailyTimes ?? [lumiWaterSettings.dailyTime ?? "09:00"]).map((time) => <div key={time} className="flex items-center gap-2"><input className="field min-w-0 flex-1" type="time" value={time} onChange={(event) => updateDailyWaterTimes((lumiWaterSettings.dailyTimes ?? [lumiWaterSettings.dailyTime ?? "09:00"]).map((item) => item === time ? event.target.value : item))} aria-label={`Mốc nhắc uống nước ${time}`} /><button type="button" className="secondary-button shrink-0 px-3 py-2 text-xs" onClick={() => removeDailyWaterTime(time)} aria-label={`Xóa mốc ${time}`}>Xóa</button></div>)}<p className="text-xs leading-5 text-slate-500 dark:text-slate-300">Bạn có thể đặt nhiều mốc, ví dụ 09:00, 11:30, 14:00, 16:30 và 20:00.</p></div> : <label className="text-sm font-bold">Mỗi<input className="field mt-1" type="number" min="5" max="180" value={lumiWaterSettings.intervalMinutes} onChange={(event) => updateLumiWaterSettings({ ...lumiWaterSettings, intervalMinutes: clamp(Number(event.target.value) || 5, 5, 180) })} />phút</label>}</div><label className="mt-3 block text-sm font-bold">Âm báo nhắc nước<select className="field mt-1" value={lumiWaterSettings.soundId} onChange={(event) => { if (isLumiWaterAlertSoundId(event.target.value)) updateLumiWaterSettings({ ...lumiWaterSettings, soundId: event.target.value }); }}>{LUMI_WATER_ALERT_SOUNDS.map((sound) => <option key={sound.id} value={sound.id}>{sound.label}</option>)}</select></label><button type="button" className="secondary-button mt-3" onClick={previewWaterAlert}><span aria-hidden="true">🔊</span> Nghe thử âm báo nhắc nước</button><label className="mt-3 block text-sm font-bold">Câu nhắc uống nước<input className="field mt-1" value={waterMessageDraft} maxLength={280} onChange={(event) => setWaterMessageDraft(event.target.value)} placeholder="Ví dụ: Ong ơi, uống một ngụm nước nhé!" /></label><button type="button" className="secondary-button mt-3" onClick={saveWaterReminderMessage}>Lưu câu nhắc</button>{lumiWaterSettings.enabled ? <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-300">Lần nhắc tiếp theo: {waterDisplay}. Chỉ âm báo đã chọn được phát, không có BGM.</p> : <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-300">Nhắc uống nước đang tắt.</p>}</fieldset></div></section>
    </>}
    {lumiPopups}
    {showSupport && supportMessage ? <section className="fixed bottom-5 left-1/2 z-[90] w-[min(92vw,38rem)] -translate-x-1/2 rounded-3xl border border-emerald-300 bg-white p-5 shadow-2xl dark:bg-slate-950" role="status"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.14em] text-emerald-700">Lumi · {supportMessage.kind === "comfort" ? "an ủi" : "động viên"}</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-100">{supportMessage.text}</p></div><button type="button" className="secondary-button text-xs" onClick={() => setShowSupport(false)}>Đóng</button></div></section> : null}
    {goalCelebrationVisible ? <div className="pomodoro-goal-celebration" role="dialog" aria-modal="true" aria-labelledby="pomodoro-goal-celebration-title" onClick={dismissGoalCelebration}><div className="pomodoro-goal-fireworks" aria-hidden="true">{celebrationFireworks.map((item, index) => <span key={`${item.emoji}-${index}`} style={{ "--firework-x": item.x, "--firework-y": item.y, animationDelay: `${index * 70}ms` } as React.CSSProperties}>{item.emoji}</span>)}</div><div className="pomodoro-goal-celebration__card" onClick={(event) => event.stopPropagation()}><div className="text-5xl" aria-hidden="true">🏆</div><h2 id="pomodoro-goal-celebration-title" className="mt-3 font-display text-3xl font-black">Chúc mừng Ong!</h2><p className="mt-2 text-sm font-semibold leading-6">Bạn đã hoàn thành đủ {totalSessions} phiên Pomodoro.</p><button type="button" autoFocus className="primary-button mt-5 w-full" onClick={dismissGoalCelebration}>Tiếp tục học</button></div></div> : null}
  </div></>;

}
