import { Heart, Play, Plus, Save, Sparkles, Trash2, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { AppConfig, ProfileState } from "../../../shared/study";
import { emotionThemes, type EmotionId } from "../lib/emotionThemes";
import { dialogueGroupForEmotion, dialoguesForGroup, LUMI_DIALOGUE_GROUPS, readLumiCustomDialogues, saveLumiCustomDialogues, type LumiCustomDialogue, type LumiDialogueGroup, LUMI_CUSTOM_DIALOGUES_EVENT } from "../lib/lumiCustomDialogues";
import { readLumiSpeechPreference, saveLumiSpeechPreference } from "../lib/lumiPreferences";
import { PersistentCollapsible } from "./PersistentCollapsible";
import { LUMI_CHECKIN_OPTIONS, LUMI_WELCOME, lumiKaomojiForEmotion } from "../lib/lumiPresets";
import { LUMI_SPEECH_UNAVAILABLE_EVENT, speakLumiVietnamese } from "../lib/lumiSpeech";
import { DEFAULT_LUMI_MULTI_DIALOGUES, LUMI_MULTI_DIALOGUES_EVENT, readLumiMultiDialogues, restoreLumiCustomKaomojiItem, restoreLumiMultiDialogues, saveLumiCustomKaomojiItem, saveLumiMultiDialogues, type LumiKaomojiDialogueEntry } from "../lib/lumiMultiDialogues";
import { DEFAULT_LUMI_KEYWORDS, findLumiKeywordRule, LUMI_KEYWORDS_EVENT, readLumiKeywords, saveLumiKeywords, type LumiKeywordRule } from "../lib/lumiKeywords";

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

const quickFeelings = LUMI_CHECKIN_OPTIONS;

function speakLumi(text: string, enabled: boolean) {
  speakLumiVietnamese(text, enabled);
}

export function ExperienceStudio({ selected, onSelect, profile, onProfile, onStartTwoMinutes }: ExperienceStudioProps) {
  const current = emotionThemes.find((item) => item.id === selected) ?? emotionThemes[0];
  const [dialogues, setDialogues] = useState<LumiCustomDialogue[]>(() => readLumiCustomDialogues());
  const [speechEnabled, setSpeechEnabled] = useState(() => readLumiSpeechPreference(profile?.lumiSpeechEnabled !== false));
  const [activeMessage, setActiveMessage] = useState<string>(LUMI_WELCOME.text);
  const [showEmotionDialog, setShowEmotionDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [newText, setNewText] = useState("");
  const [newGroup, setNewGroup] = useState<LumiDialogueGroup>("companionship");
  const [dialogueFilter, setDialogueFilter] = useState<LumiDialogueGroup | "all">("all");
  const [multiDialogues, setMultiDialogues] = useState<LumiKaomojiDialogueEntry[]>(() => readLumiMultiDialogues());
  const [newMultiDialogue, setNewMultiDialogue] = useState<Record<string, string>>({});
  const [kaomojiDrafts, setKaomojiDrafts] = useState<Record<string, { description: string; dialogue: string }>>(() => Object.fromEntries(readLumiMultiDialogues().map((entry) => [entry.kaomoji, { description: entry.description, dialogue: entry.dialogues[0]?.text ?? "" }])));
  const [keywordRules, setKeywordRules] = useState<LumiKeywordRule[]>(() => readLumiKeywords());
  const [keywordStatus, setKeywordStatus] = useState("");
  const [keywordDraft, setKeywordDraft] = useState("");
  const [keywordKaomojiDraft, setKeywordKaomojiDraft] = useState("(つ_ <｡)");
  const [keywordDialogueDraft, setKeywordDialogueDraft] = useState("");
  const lumiKaomoji = lumiKaomojiForEmotion(selected);

  const activeGroup = dialogueGroupForEmotion(selected);
  const activeDialogues = useMemo(() => dialoguesForGroup(dialogues, activeGroup), [activeGroup, dialogues]);

  useEffect(() => {
    setSpeechEnabled(readLumiSpeechPreference(profile?.lumiSpeechEnabled !== false));
  }, [profile?.lumiSpeechEnabled]);
  useEffect(() => {
    const onSpeechUnavailable = () => undefined;
    window.addEventListener(LUMI_SPEECH_UNAVAILABLE_EVENT, onSpeechUnavailable);
    return () => window.removeEventListener(LUMI_SPEECH_UNAVAILABLE_EVENT, onSpeechUnavailable);
  }, []);

  useEffect(() => {
    const refresh = (event?: Event) => {
      const customEvent = event as CustomEvent<LumiCustomDialogue[]> | undefined;
      setDialogues(customEvent?.detail?.length ? customEvent.detail : readLumiCustomDialogues());
    };
    const onStorage = (event: StorageEvent) => { if (event.key === "lumi_custom_dialogues") refresh(); };
    const refreshMultiDialogues = (event?: Event) => {
      const customEvent = event as CustomEvent<LumiKaomojiDialogueEntry[]> | undefined;
      const next = customEvent?.detail?.length ? customEvent.detail : readLumiMultiDialogues();
      setMultiDialogues(next);
      setKaomojiDrafts(Object.fromEntries(next.map((entry) => [entry.kaomoji, { description: entry.description, dialogue: entry.dialogues[0]?.text ?? "" }])));
    };
    const onMultiStorage = (event: StorageEvent) => { if (event.key === "lumi_multi_dialogues_data" || event.key === "lumi_custom_kaomoji_data") refreshMultiDialogues(); };
    const refreshKeywords = (event?: Event) => {
      const detail = (event as CustomEvent<LumiKeywordRule[]> | undefined)?.detail;
      setKeywordRules(detail?.length ? detail : readLumiKeywords());
    };
    const onKeywordStorage = (event: StorageEvent) => { if (event.key === "lumi_custom_keywords") refreshKeywords(); };
    window.addEventListener(LUMI_CUSTOM_DIALOGUES_EVENT, refresh);
    window.addEventListener("storage", onStorage);
      window.addEventListener(LUMI_MULTI_DIALOGUES_EVENT, refreshMultiDialogues);
      window.addEventListener("storage", onMultiStorage);
      window.addEventListener(LUMI_KEYWORDS_EVENT, refreshKeywords);
      window.addEventListener("storage", onKeywordStorage);
    return () => {
      window.removeEventListener(LUMI_CUSTOM_DIALOGUES_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(LUMI_MULTI_DIALOGUES_EVENT, refreshMultiDialogues);
      window.removeEventListener("storage", onMultiStorage);
      window.removeEventListener(LUMI_KEYWORDS_EVENT, refreshKeywords);
      window.removeEventListener("storage", onKeywordStorage);
    };
  }, []);

  useEffect(() => {
    if (activeMessage === LUMI_WELCOME.text) return;
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

  function chooseFeeling(choice: typeof quickFeelings[number]) {
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

  function persistMultiDialogues(next: LumiKaomojiDialogueEntry[]) {
    setMultiDialogues(saveLumiMultiDialogues(next));
  }

  function addMultiDialogue(entry: LumiKaomojiDialogueEntry) {
    const text = (newMultiDialogue[entry.kaomoji] ?? "").trim().slice(0, 280);
    if (!text) return;
    persistMultiDialogues(multiDialogues.map((item) => item.kaomoji === entry.kaomoji ? { ...item, dialogues: [...item.dialogues, { id: `lumi-multi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text }] } : item));
    setNewMultiDialogue((current) => ({ ...current, [entry.kaomoji]: "" }));
  }

  function updateKaomojiDraft(entry: LumiKaomojiDialogueEntry, field: "description" | "dialogue", value: string) {
    setKaomojiDrafts((current) => ({ ...current, [entry.kaomoji]: { description: current[entry.kaomoji]?.description ?? entry.description, dialogue: current[entry.kaomoji]?.dialogue ?? entry.dialogues[0]?.text ?? "", [field]: value } }));
  }

  function saveKaomojiCustomization(entry: LumiKaomojiDialogueEntry) {
    const draft = kaomojiDrafts[entry.kaomoji] ?? { description: entry.description, dialogue: entry.dialogues[0]?.text ?? "" };
    const description = draft.description.trim().slice(0, 120);
    const dialogue = draft.dialogue.trim().slice(0, 280);
    if (!description || !dialogue) { toast.error("Hãy nhập đủ tên mô tả và câu thoại cho Kaomoji."); return; }
    setMultiDialogues(saveLumiCustomKaomojiItem({ kaomoji: entry.kaomoji, description, dialogue }));
    toast.success(`Đã lưu tùy chỉnh cho ${entry.kaomoji}.`);
  }

  function restoreKaomojiCustomization(entry: LumiKaomojiDialogueEntry) {
    const restored = restoreLumiCustomKaomojiItem(entry.kaomoji);
    setMultiDialogues(restored);
    setKaomojiDrafts((current) => ({ ...current, [entry.kaomoji]: { description: DEFAULT_LUMI_MULTI_DIALOGUES.find((item) => item.kaomoji === entry.kaomoji)?.description ?? entry.description, dialogue: DEFAULT_LUMI_MULTI_DIALOGUES.find((item) => item.kaomoji === entry.kaomoji)?.dialogues[0]?.text ?? entry.dialogues[0]?.text ?? "" } }));
    toast.success(`Đã khôi phục mặc định cho ${entry.kaomoji}.`);
  }

  function removeMultiDialogue(entry: LumiKaomojiDialogueEntry, dialogueId: string) {
    persistMultiDialogues(multiDialogues.map((item) => item.kaomoji === entry.kaomoji ? { ...item, dialogues: item.dialogues.filter((dialogue) => dialogue.id !== dialogueId) } : item));
  }

  function playMultiDialogue(text: string) {
    setActiveMessage(text);
    speakLumi(text, speechEnabled);
  }

  function restoreMultiDialogueDefaults() {
    setMultiDialogues(restoreLumiMultiDialogues());
    setNewMultiDialogue({});
    toast.success("Đã khôi phục bộ câu thoại gốc của Lumi.");
  }

  function emotionForKeywordKaomoji(kaomoji: string): EmotionId {
    if (kaomoji.includes("つ≧") || kaomoji.includes("づ")) return "lonely";
    if (kaomoji.includes("(´ー") || kaomoji.includes("🥛")) return "calm";
    if (kaomoji.includes("٩(ˊ") || kaomoji.includes("ง’")) return "focused";
    if (kaomoji.includes("٩(◕") || kaomoji.includes("ω ^")) return "happy";
    return "tired";
  }

  function activateKeywordStatus() {
    const matched = findLumiKeywordRule(keywordRules, keywordStatus);
    if (!matched) { toast.info("Chưa tìm thấy từ khóa Lumi phù hợp."); return; }
    onSelect(emotionForKeywordKaomoji(matched.kaomoji));
    if (profile && onProfile) onProfile({ ...profile, emotionTheme: emotionForKeywordKaomoji(matched.kaomoji) }, `Lumi đã nhận diện: ${matched.keyword}.`);
    setActiveMessage(matched.dialogue);
    speakLumi(matched.dialogue, speechEnabled);
    toast.success(`Lumi đã kích hoạt ${matched.kaomoji}.`);
  }

  function addKeywordRule() {
    const keyword = keywordDraft.trim().slice(0, 180);
    const dialogue = keywordDialogueDraft.trim().slice(0, 280);
    if (!keyword || !dialogue) return;
    setKeywordRules(saveLumiKeywords([...keywordRules, { id: `lumi-keyword-${Date.now()}`, keyword, kaomoji: keywordKaomojiDraft, dialogue }]));
    setKeywordDraft("");
    setKeywordDialogueDraft("");
  }

  function editKeywordRule(rule: LumiKeywordRule) {
    const keyword = window.prompt("Từ khóa, phân tách bằng dấu phẩy", rule.keyword)?.trim();
    if (!keyword) return;
    const dialogue = window.prompt("Lời thoại kích hoạt", rule.dialogue)?.trim();
    if (!dialogue) return;
    setKeywordRules(saveLumiKeywords(keywordRules.map((item) => item.id === rule.id ? { ...item, keyword, dialogue } : item)));
  }

  function removeKeywordRule(id: string) {
    setKeywordRules(saveLumiKeywords(keywordRules.filter((rule) => rule.id !== id)));
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
        <div className="grid min-h-36 min-w-56 place-items-center rounded-[2rem] border border-rose-200 bg-white/75 px-6 py-5 shadow-inner dark:border-rose-300/20 dark:bg-slate-950/25" aria-label={`Lumi đang thể hiện ${current.label}`}><div className="text-5xl" aria-hidden="true">{current.emoji}</div><div className="mt-2 font-mono text-2xl font-black text-rose-800 dark:text-rose-100">{activeMessage === LUMI_WELCOME.text ? LUMI_WELCOME.kaomoji : lumiKaomoji}</div><p className="mt-2 text-xs font-bold text-rose-700 dark:text-rose-200">Lumi · {current.label}</p></div>
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

    <PersistentCollapsible storageKey="lumi-keywords" eyebrow="Tự động hóa Lumi" title="Từ khóa phát hiện cảm xúc">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-[.16em] text-amber-700 dark:text-amber-300">Keyword detection</p><h2 className="mt-1 font-display text-2xl font-black">Tự động kích hoạt Kaomoji & lời thoại</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Nhập một trạng thái như “mệt”, “đuối” hoặc từ khóa bạn tự thêm để Lumi chọn đúng biểu cảm và câu nói.</p></div>
        <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-black text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">{keywordRules.length} nhóm từ khóa</span>
      </div>
      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-3 dark:border-amber-300/15 dark:bg-amber-950/20">
        <div className="flex gap-2"><input className="field min-w-0 flex-1" value={keywordStatus} onChange={(event) => setKeywordStatus(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") activateKeywordStatus(); }} placeholder="Ví dụ: hôm nay mình hơi mệt…" aria-label="Trạng thái để Lumi phát hiện từ khóa" /><button type="button" className="primary-button shrink-0" onClick={activateKeywordStatus}>Kích hoạt Lumi</button></div>
        <p className="mt-2 text-xs font-semibold text-slate-500">Từ khóa được quét không phân biệt hoa thường và có thể phân tách bằng dấu phẩy.</p>
      </div>
      <div className="mt-4 grid gap-2 rounded-2xl border border-amber-100 bg-white/80 p-3 dark:border-amber-300/15 dark:bg-white/[.035]"><div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><input className="field" value={keywordDraft} maxLength={180} onChange={(event) => setKeywordDraft(event.target.value)} placeholder="Từ khóa: mệt, đuối, hết pin…" aria-label="Từ khóa Lumi mới" /><select className="field" value={keywordKaomojiDraft} onChange={(event) => setKeywordKaomojiDraft(event.target.value)} aria-label="Kaomoji kích hoạt">{multiDialogues.map((entry) => <option key={entry.kaomoji} value={entry.kaomoji}>{entry.kaomoji} · {entry.description}</option>)}</select></div><div className="mt-2 flex gap-2"><input className="field min-w-0 flex-1" value={keywordDialogueDraft} maxLength={280} onChange={(event) => setKeywordDialogueDraft(event.target.value)} placeholder="Lời thoại khi phát hiện từ khóa…" aria-label="Lời thoại từ khóa Lumi mới" /><button type="button" className="primary-button shrink-0" onClick={addKeywordRule}><Plus className="h-4 w-4" />Thêm từ khóa mới</button></div></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">{keywordRules.map((rule) => <article key={rule.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[.035]"><div className="flex items-start gap-3"><div className="grid min-h-12 min-w-24 place-items-center rounded-2xl bg-amber-500 px-2 py-2 text-center font-mono text-sm font-black text-white">{rule.kaomoji}</div><div className="min-w-0 flex-1"><p className="text-xs font-black uppercase tracking-[.12em] text-amber-700 dark:text-amber-300">{rule.keyword}</p><p className="mt-2 text-sm font-semibold leading-6">{rule.dialogue}</p></div></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" className="secondary-button px-3 py-2 text-xs" onClick={() => { setActiveMessage(rule.dialogue); speakLumi(rule.dialogue, speechEnabled); }}><Volume2 className="h-3.5 w-3.5" />Nghe thử</button><button type="button" className="secondary-button px-3 py-2 text-xs" onClick={() => editKeywordRule(rule)}><Save className="h-3.5 w-3.5" />Chỉnh sửa</button><button type="button" className="secondary-button px-3 py-2 text-xs text-rose-700" onClick={() => removeKeywordRule(rule.id)}><Trash2 className="h-3.5 w-3.5" />Xóa</button></div></article>)}</div>
      <div className="mt-3 flex items-center justify-between gap-3"><p className="text-xs text-slate-500">Lưu tại <code>lumi_custom_keywords</code> và đồng bộ ngay trong tab.</p><button type="button" className="secondary-button text-xs" onClick={() => setKeywordRules(saveLumiKeywords(DEFAULT_LUMI_KEYWORDS))}>Khôi phục từ khóa gốc</button></div>
    </PersistentCollapsible>

    <PersistentCollapsible storageKey="lumi-multi-dialogues" eyebrow="Kaomoji Lumi" title="Quản lý nhiều câu thoại theo từng biểu tượng">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Kho thoại đa dạng</p>
          <h2 className="mt-1 font-display text-2xl font-black">Mỗi Kaomoji, nhiều lời nhắn luân phiên</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Thêm nhiều câu cho từng biểu tượng. Widget Pomodoro và pop-up Lumi sẽ chọn ngẫu nhiên, đồng thời tránh lặp lại cùng một câu liên tiếp.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100">{multiDialogues.length}/{DEFAULT_LUMI_MULTI_DIALOGUES.length} Kaomoji</span>
          <button type="button" className="secondary-button text-xs" onClick={restoreMultiDialogueDefaults}>Khôi phục bộ câu gốc</button>
        </div>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {multiDialogues.map((entry) => <article key={entry.kaomoji} className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm dark:border-emerald-300/15 dark:bg-white/[.035]">
          <div className="flex items-start gap-3">
            <div className="grid min-h-12 min-w-24 place-items-center rounded-2xl bg-emerald-700 px-2 py-2 text-center font-mono text-sm font-black text-white" title={entry.kaomoji}>{entry.kaomoji}</div>
            <div className="min-w-0 flex-1"><p className="text-xs font-black uppercase tracking-[.12em] text-emerald-700 dark:text-emerald-300">{entry.group}</p><h3 className="mt-1 font-bold">{entry.description}</h3><p className="mt-1 text-xs text-slate-500">{entry.dialogues.length} câu thoại · phát luân phiên ngẫu nhiên</p></div>
          </div>
          <div className="mt-4 grid gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-3 dark:border-emerald-300/15 dark:bg-emerald-950/20">
            <label className="text-xs font-black text-emerald-900 dark:text-emerald-100">Tên mô tả hành động<input className="field mt-1" maxLength={120} value={kaomojiDrafts[entry.kaomoji]?.description ?? entry.description} onChange={(event) => updateKaomojiDraft(entry, "description", event.target.value)} placeholder="Nhập tên mô tả hành động mới…" aria-label={`Tên mô tả cho ${entry.kaomoji}`} /></label>
            <label className="text-xs font-black text-emerald-900 dark:text-emerald-100">Câu thoại phát ra<textarea className="field mt-1 min-h-20" maxLength={280} value={kaomojiDrafts[entry.kaomoji]?.dialogue ?? entry.dialogues[0]?.text ?? ""} onChange={(event) => updateKaomojiDraft(entry, "dialogue", event.target.value)} placeholder="Nhập câu thoại/lời nhắn mới…" aria-label={`Câu thoại chính cho ${entry.kaomoji}`} /></label>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="primary-button px-3 py-2 text-xs" onClick={() => saveKaomojiCustomization(entry)}><Save className="h-3.5 w-3.5" />Lưu thay đổi</button>
              <button type="button" className="secondary-button px-3 py-2 text-xs" onClick={() => playMultiDialogue(kaomojiDrafts[entry.kaomoji]?.dialogue ?? entry.dialogues[0]?.text ?? "")}><Volume2 className="h-3.5 w-3.5" />Nghe thử</button>
              <button type="button" className="secondary-button px-3 py-2 text-xs" onClick={() => restoreKaomojiCustomization(entry)}>🔄 Khôi phục mặc định</button>
            </div>
            <p className="text-[11px] leading-5 text-slate-500 dark:text-slate-300">Kaomoji <code>{entry.kaomoji}</code> được giữ cố định; chỉ tên mô tả và câu thoại chính có thể thay đổi.</p>
          </div>
          <div className="mt-3 space-y-2">
            {entry.dialogues.map((dialogue) => <div key={dialogue.id} className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 dark:border-white/10 dark:bg-slate-950/30"><p className="min-w-0 flex-1 text-sm font-semibold leading-6">{dialogue.text}</p><div className="flex shrink-0 gap-1"><button type="button" className="secondary-button !px-2 !py-1.5 text-xs" aria-label={`Nghe thử ${dialogue.text}`} onClick={() => playMultiDialogue(dialogue.text)}><Volume2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Nghe thử</span></button><button type="button" className="secondary-button !px-2 !py-1.5 text-xs text-rose-700" aria-label={`Xóa câu thoại ${dialogue.text}`} onClick={() => removeMultiDialogue(entry, dialogue.id)}><Trash2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Xóa</span></button></div></div>)}
            {entry.dialogues.length === 0 ? <p className="rounded-xl border border-dashed border-slate-200 p-3 text-xs font-semibold text-slate-500 dark:border-white/10">Chưa có câu thoại. Hãy thêm một câu mới cho Kaomoji này.</p> : null}
          </div>
          <div className="mt-3 flex gap-2"><input className="field min-w-0 flex-1" maxLength={280} value={newMultiDialogue[entry.kaomoji] ?? ""} onChange={(event) => setNewMultiDialogue((current) => ({ ...current, [entry.kaomoji]: event.target.value }))} placeholder="Thêm lời nhắn mới…" aria-label={`Câu thoại mới cho ${entry.kaomoji}`} /><button type="button" className="primary-button shrink-0 px-3" onClick={() => addMultiDialogue(entry)}><Plus className="h-4 w-4" /><span className="hidden sm:inline">Thêm câu thoại mới</span><span className="sm:hidden">Thêm</span></button></div>
        </article>)}
      </div>
    </PersistentCollapsible>
  </div>;
}

export default ExperienceStudio;
