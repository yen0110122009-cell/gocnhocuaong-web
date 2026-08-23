import { Heart, Play, Plus, Save, Sparkles, Trash2, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AppConfig, ProfileState } from "../../../shared/study";
import { emotionThemes, type EmotionId } from "../lib/emotionThemes";
import { dialogueGroupForEmotion, dialoguesForGroup, LUMI_DIALOGUE_GROUPS, readLumiCustomDialogues, saveLumiCustomDialogues, type LumiCustomDialogue, type LumiDialogueGroup, LUMI_CUSTOM_DIALOGUES_EVENT } from "../lib/lumiCustomDialogues";
import { readLumiSpeechPreference, saveLumiSpeechPreference } from "../lib/lumiPreferences";

export type ExperienceStudioProps = {
  selected: EmotionId;
  onSelect: (id: EmotionId) => void;
  profile?: ProfileState;
  onProfile?: (profile: ProfileState, message?: string) => void;
  onStartTwoMinutes?: () => void;
  customContent?: AppConfig["customContent"];
  mascotStates?: AppConfig["mascotStates"];
  voiceLines?: AppConfig["mascotVoiceLines"];
};

type QuickFeeling = { id: EmotionId; label: string; emoji: string; group: LumiDialogueGroup };
const quickFeelings: QuickFeeling[] = [
  { id: "tired", label: "Mệt mỏi", emoji: "🥱", group: "comfort" },
  { id: "lazy", label: "Thiếu động lực", emoji: "🫠", group: "encouragement" },
  { id: "lonely", label: "Cần cái ôm", emoji: "🫂", group: "hug" },
  { id: "focused", label: "Sẵn sàng học", emoji: "🎯", group: "companionship" },
];

function speakLumi(text: string, enabled: boolean) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "vi-VN";
  utterance.rate = 0.96;
  utterance.pitch = 1.08;
  const voice = window.speechSynthesis.getVoices().find((candidate) => candidate.lang.toLocaleLowerCase().startsWith("vi"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export function ExperienceStudio({ selected, onSelect, profile, onProfile, onStartTwoMinutes }: ExperienceStudioProps) {
  const current = emotionThemes.find((item) => item.id === selected) ?? emotionThemes[0];
  const [dialogues, setDialogues] = useState<LumiCustomDialogue[]>(() => readLumiCustomDialogues());
  const [speechEnabled, setSpeechEnabled] = useState(() => readLumiSpeechPreference(profile?.lumiSpeechEnabled !== false));
  const [activeMessage, setActiveMessage] = useState(current.encouragement);
  const [showEmotionDialog, setShowEmotionDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [newText, setNewText] = useState("");
  const [newGroup, setNewGroup] = useState<LumiDialogueGroup>("companionship");
  const [dialogueFilter, setDialogueFilter] = useState<LumiDialogueGroup | "all">("all");

  const activeGroup = dialogueGroupForEmotion(selected);
  const activeDialogues = useMemo(() => dialoguesForGroup(dialogues, activeGroup), [activeGroup, dialogues]);

  useEffect(() => {
    setSpeechEnabled(readLumiSpeechPreference(profile?.lumiSpeechEnabled !== false));
  }, [profile?.lumiSpeechEnabled]);

  useEffect(() => {
    const refresh = (event?: Event) => {
      const customEvent = event as CustomEvent<LumiCustomDialogue[]> | undefined;
      setDialogues(customEvent?.detail?.length ? customEvent.detail : readLumiCustomDialogues());
    };
    const onStorage = (event: StorageEvent) => { if (event.key === "lumi_custom_dialogues") refresh(); };
    window.addEventListener(LUMI_CUSTOM_DIALOGUES_EVENT, refresh);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(LUMI_CUSTOM_DIALOGUES_EVENT, refresh); window.removeEventListener("storage", onStorage); };
  }, []);

  useEffect(() => {
    if (!activeDialogues.some((dialogue) => dialogue.text === activeMessage)) setActiveMessage(activeDialogues[0]?.text ?? current.encouragement);
  }, [activeDialogues, activeMessage, current.encouragement]);

  useEffect(() => () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); }, []);

  function setSpeech(value: boolean) {
    setSpeechEnabled(value);
    saveLumiSpeechPreference(value);
    if (!value) window.speechSynthesis?.cancel();
    if (profile && onProfile) onProfile({ ...profile, lumiSpeechEnabled: value }, `Đã ${value ? "bật" : "tắt"} AI đọc thoại cho Lumi.`);
  }

  function showDialogue(text: string) {
    setActiveMessage(text);
    speakLumi(text, speechEnabled);
  }

  function chooseFeeling(choice: QuickFeeling) {
    onSelect(choice.id);
    if (profile && onProfile) onProfile({ ...profile, emotionTheme: choice.id }, `Lumi đã cập nhật cảm xúc: ${choice.label}.`);
    const response = dialoguesForGroup(dialogues, choice.group)[0]?.text ?? current.encouragement;
    setActiveMessage(response);
    speakLumi(response, speechEnabled);
    setShowEmotionDialog(false);
  }

  function persist(next: LumiCustomDialogue[]) {
    setDialogues(saveLumiCustomDialogues(next));
  }

  function addDialogue() {
    const text = newText.trim().slice(0, 280);
    if (!text) return;
    persist([...dialogues, { id: `lumi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, group: newGroup, text }]);
    setNewText("");
  }

  function startEdit(dialogue: LumiCustomDialogue) {
    setEditingId(dialogue.id);
    setEditingText(dialogue.text);
  }

  function saveEdit(dialogue: LumiCustomDialogue) {
    const text = editingText.trim().slice(0, 280);
    if (!text) return;
    persist(dialogues.map((item) => item.id === dialogue.id ? { ...item, text, isDefault: false } : item));
    setEditingId(null);
    setEditingText("");
  }

  function removeDialogue(id: string) {
    persist(dialogues.filter((dialogue) => dialogue.id !== id));
    if (editingId === id) { setEditingId(null); setEditingText(""); }
  }

  const visibleDialogues = dialogueFilter === "all" ? dialogues : dialogues.filter((dialogue) => dialogue.group === dialogueFilter);

  return <div className="space-y-5" aria-label="Module Kaomoji Lumi bạn đồng hành">
    <section className="panel overflow-hidden p-6" style={{ background: `linear-gradient(135deg, ${current.colors.soft}, var(--card, #fff))` }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-rose-700 dark:text-rose-300">Lumi bạn đồng hành · Kaomoji</p>
          <h2 className="mt-2 font-display text-2xl font-black">Lumi đang ở đây với Ong</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Một góc nhỏ để Ong được lắng nghe, chọn cảm xúc và nhận lời nhắn vừa đủ.</p>
        </div>
        <label className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-white/80 px-3 py-2 text-xs font-black text-rose-800 shadow-sm dark:border-rose-300/20 dark:bg-slate-950/30 dark:text-rose-100"><input type="checkbox" checked={speechEnabled} onChange={(event) => setSpeech(event.target.checked)} /> <Volume2 className="h-4 w-4" aria-hidden="true" /> AI đọc thoại</label>
      </div>
      <div className="mt-6 grid place-items-center text-center">
        <div className="grid min-h-36 min-w-56 place-items-center rounded-[2rem] border border-rose-200 bg-white/75 px-6 py-5 shadow-inner dark:border-rose-300/20 dark:bg-slate-950/25" aria-label={`Lumi đang thể hiện ${current.label}`}><div className="text-5xl" aria-hidden="true">{current.emoji}</div><div className="mt-2 font-mono text-2xl font-black text-rose-800 dark:text-rose-100">{current.id === "tired" || current.id === "sleepy" ? "(｡•́︿•̀｡)" : current.id === "happy" || current.id === "excited" ? "٩(ˊᗜˋ*)و" : "(｡•̀ᴗ-)✧"}</div><p className="mt-2 text-xs font-bold text-rose-700 dark:text-rose-200">Lumi · {current.label}</p></div>
        <div className="mt-4 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm font-semibold leading-6 text-amber-950 dark:border-amber-300/20 dark:bg-amber-950/25 dark:text-amber-50" role="status" aria-live="polite">“{activeMessage}”</div>
        <div className="mt-3 flex flex-wrap justify-center gap-2"><button type="button" className="secondary-button" onClick={() => showDialogue(activeMessage)}><Play className="h-4 w-4" />Nghe lời nhắn</button>{onStartTwoMinutes ? <button type="button" className="primary-button" onClick={onStartTwoMinutes}>Bắt đầu 2 phút</button> : null}</div>
      </div>
    </section>

    <section className="panel p-5" aria-labelledby="lumi-quick-feelings-title">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><Heart className="h-5 w-5 text-rose-600" /><h2 id="lumi-quick-feelings-title" className="font-display text-xl font-bold">Chọn cảm xúc nhanh</h2></div><p className="mt-1 text-sm text-slate-500">Không có lựa chọn đúng hay sai. Lumi sẽ đổi lời nhắn và đồng bộ với widget Pomodoro.</p></div><button type="button" className="primary-button" onClick={() => setShowEmotionDialog(true)}><Sparkles className="h-4 w-4" />Hỏi thăm cảm xúc</button></div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{quickFeelings.map((choice) => <button key={choice.id} type="button" onClick={() => chooseFeeling(choice)} className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${selected === choice.id ? "border-rose-400 bg-rose-50 text-rose-950 shadow-sm dark:bg-rose-950/30 dark:text-rose-50" : "border-slate-200 dark:border-white/10"}`}><span className="text-xl" aria-hidden="true">{choice.emoji}</span><b className="ml-2 text-sm">{choice.label}</b><span className="mt-1 block text-xs text-slate-500">{LUMI_DIALOGUE_GROUPS.find((group) => group.id === choice.group)?.description}</span></button>)}</div>
    </section>

    {showEmotionDialog ? <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="lumi-emotion-dialog-title" onClick={() => setShowEmotionDialog(false)}><section className="w-[min(92vw,34rem)] rounded-3xl border border-rose-200 bg-white p-5 shadow-2xl dark:border-rose-300/20 dark:bg-slate-950" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-rose-700 dark:text-rose-300">Lumi hỏi thăm</p><h2 id="lumi-emotion-dialog-title" className="mt-1 font-display text-2xl font-black">Hôm nay Ong thấy thế nào?</h2></div><button type="button" className="secondary-button px-2" onClick={() => setShowEmotionDialog(false)} aria-label="Đóng popup cảm xúc"><X className="h-4 w-4" /></button></div><div className="mt-4 grid gap-2">{quickFeelings.map((choice) => <button key={choice.id} type="button" className="rounded-2xl border border-rose-100 bg-rose-50/70 p-3 text-left text-sm font-bold text-rose-950 hover:border-rose-400 dark:border-rose-300/15 dark:bg-rose-950/25 dark:text-rose-50" onClick={() => chooseFeeling(choice)}><span className="mr-2 text-xl">{choice.emoji}</span>{choice.label}</button>)}</div></section></div> : null}

    <section className="panel p-5" aria-labelledby="lumi-dialogue-manager-title">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Kho lời thoại Lumi</p><h2 id="lumi-dialogue-manager-title" className="mt-1 font-display text-2xl font-black">Thêm, sửa và nghe thử câu nói</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">Bộ câu thoại mặc định ngọt ngào luôn có sẵn. Câu cá nhân được lưu tại <code>lumi_custom_dialogues</code> và tự đồng bộ sang widget Pomodoro ghim.</p></div><span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100">{dialogues.length} câu thoại</span></div>
      <div className="mt-4 grid gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 dark:border-emerald-300/15 dark:bg-emerald-950/20"><div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_190px_auto]"><input className="field" value={newText} maxLength={280} onChange={(event) => setNewText(event.target.value)} placeholder="Viết một câu Lumi dành riêng cho Ong…" aria-label="Câu thoại Lumi mới" /><select className="field" value={newGroup} onChange={(event) => setNewGroup(event.target.value as LumiDialogueGroup)} aria-label="Nhóm câu thoại mới">{LUMI_DIALOGUE_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.emoji} {group.label}</option>)}</select><button type="button" className="primary-button whitespace-nowrap" onClick={addDialogue}><Plus className="h-4 w-4" />Thêm câu</button></div></div>
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Lọc nhóm lời thoại">{[{ id: "all", label: "Tất cả", emoji: "✨" }, ...LUMI_DIALOGUE_GROUPS].map((group) => <button key={group.id} type="button" role="tab" aria-selected={dialogueFilter === group.id} onClick={() => setDialogueFilter(group.id as LumiDialogueGroup | "all")} className={`rounded-full border px-3 py-1.5 text-xs font-black ${dialogueFilter === group.id ? "border-emerald-700 bg-emerald-700 text-white" : "border-emerald-200 bg-white text-emerald-800 dark:border-emerald-300/20 dark:bg-slate-950/30 dark:text-emerald-100"}`}>{group.emoji} {group.label}</button>)}</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">{visibleDialogues.map((dialogue) => { const group = LUMI_DIALOGUE_GROUPS.find((item) => item.id === dialogue.group); const editing = editingId === dialogue.id; return <article key={dialogue.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[.035]"><div className="flex items-start justify-between gap-3"><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100">{group?.emoji} {group?.label}</span>{dialogue.isDefault ? <span className="text-[10px] font-bold text-slate-400">Mặc định</span> : null}</div>{editing ? <textarea className="field mt-3 min-h-20 text-sm" value={editingText} maxLength={280} onChange={(event) => setEditingText(event.target.value)} aria-label={`Chỉnh sửa câu thoại ${dialogue.id}`} autoFocus /> : <p className="mt-3 min-h-12 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-100">{dialogue.text}</p>}<div className="mt-3 flex flex-wrap gap-2">{editing ? <><button type="button" className="primary-button px-3 py-2 text-xs" onClick={() => saveEdit(dialogue)}><Save className="h-3.5 w-3.5" />Lưu sửa</button><button type="button" className="secondary-button px-3 py-2 text-xs" onClick={() => setEditingId(null)}>Hủy</button></> : <><button type="button" className="secondary-button px-3 py-2 text-xs" onClick={() => showDialogue(dialogue.text)}><Volume2 className="h-3.5 w-3.5" />Nghe thử giọng đọc AI</button><button type="button" className="secondary-button px-3 py-2 text-xs" onClick={() => startEdit(dialogue)}><Save className="h-3.5 w-3.5" />Chỉnh sửa</button><button type="button" className="secondary-button px-3 py-2 text-xs text-rose-700" onClick={() => removeDialogue(dialogue.id)}><Trash2 className="h-3.5 w-3.5" />Xóa</button></>}</div></article>; })}</div>
    </section>
  </div>;
}

export default ExperienceStudio;
