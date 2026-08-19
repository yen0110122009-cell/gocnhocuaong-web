import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bird, CloudRain, Leaf, Pause, Play, Snowflake, Volume2, VolumeX, Zap } from "lucide-react";
import { emotionFromCommand, emotionThemes, type EmotionId } from "../lib/emotionThemes";
import { activeContentFor, antiProcrastinationChoices, gentleReminders, randomAntiProcrastinationSpeech, randomMicroTask, speechForEvent, speechGroupLabels, type SpeechGroup } from "../lib/speechLibrary";
import type { AppConfig } from "../../../shared/study";
import { OngLearnerAvatar } from "./OngLearnerAvatar";

type AttentionPreferences = { animationsEnabled: boolean; popupsEnabled: boolean; soundEnabled: boolean };
type AmbientScene = "morning" | "rain" | "snow" | "leaves" | "storm";
type Props = {
  selected: EmotionId;
  onSelect: (id: EmotionId) => void;
  onStartTwoMinutes?: () => void;
  customContent?: AppConfig["customContent"];
  mascotStates?: AppConfig["mascotStates"];
  voiceLines?: AppConfig["mascotVoiceLines"];
};

const companionImage = "/manus-storage/lumi-mascot-clean_28a6da68.png";
const sceneOptions: Array<{ id: AmbientScene; label: string; detail: string; icon: typeof Bird }> = [
  { id: "morning", label: "Buổi sáng", detail: "chim hót · nắng nhẹ", icon: Bird },
  { id: "rain", label: "Mưa", detail: "mưa rơi · thư giãn", icon: CloudRain },
  { id: "snow", label: "Tuyết", detail: "tĩnh lặng · dịu mắt", icon: Snowflake },
  { id: "leaves", label: "Lá rơi", detail: "gió nhẹ · mùa thu", icon: Leaf },
  { id: "storm", label: "Sấm chớp", detail: "mưa xa · tập trung", icon: Zap },
];

export function ExperienceStudio({ selected, onSelect, onStartTwoMinutes, customContent = [], mascotStates = [], voiceLines = [] }: Props) {
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("");
  const [lazyLevel, setLazyLevel] = useState<"mild" | "very" | "none" | null>(null);
  const [speechGroup, setSpeechGroup] = useState<SpeechGroup>("comfort");
  const [speech, setSpeech] = useState(() => speechForEvent("procrastination"));
  const [recentContentIds, setRecentContentIds] = useState<string[]>([]);
  const [microTask, setMicroTask] = useState(() => randomMicroTask());
  const [reminder, setReminder] = useState<string>(() => gentleReminders[0]);
  const [ambientScene, setAmbientScene] = useState<AmbientScene>(() => (typeof window !== "undefined" ? window.localStorage.getItem("study-empire:ambient-scene") : null) as AmbientScene || "morning");
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [attentionPreferences, setAttentionPreferences] = useState<AttentionPreferences>(() => {
    try { const saved = typeof window !== "undefined" ? window.localStorage.getItem("study-empire:attention-preferences") : null; const parsed = saved ? JSON.parse(saved) as Partial<AttentionPreferences> : {}; return { animationsEnabled: parsed.animationsEnabled !== false, popupsEnabled: parsed.popupsEnabled !== false, soundEnabled: parsed.soundEnabled !== false }; }
    catch { return { animationsEnabled: true, popupsEnabled: true, soundEnabled: true }; }
  });
  const restoredEmotionRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientStopRef = useRef<(() => void) | null>(null);
  const lumiAudioRef = useRef<HTMLAudioElement | null>(null);
  const theme = emotionThemes.find((item) => item.id === selected) ?? emotionThemes[0];
  const configuredLumiImage = mascotStates.find((item) => item.enabled && item.imageUrl)?.imageUrl || companionImage;
  const matchingVoiceLine = voiceLines.find((item) => item.enabled && !item.deletedAt && (theme.id === "sad" || theme.id === "tired" || theme.id === "lazy" ? /failed|comeback|almost/i.test(item.state) : true));
  const safeCommandHint = useMemo(() => "Ví dụ: vui vẻ, tôi đang mệt, cần đồng hành", []);

  useEffect(() => {
    if (restoredEmotionRef.current) return;
    restoredEmotionRef.current = true;
    const saved = window.localStorage.getItem("study-empire:emotion-theme") as EmotionId | null;
    const rootEmotion = document.documentElement.dataset.emotion as EmotionId | undefined;
    const next = emotionThemes.some((item) => item.id === rootEmotion) ? rootEmotion : emotionThemes.some((item) => item.id === saved) ? saved : null;
    if (next && next !== selected) onSelect(next);
  }, [onSelect, selected]);

  useEffect(() => {
    document.documentElement.dataset.animations = attentionPreferences.animationsEnabled ? "on" : "off";
    document.documentElement.dataset.popups = attentionPreferences.popupsEnabled ? "on" : "off";
    document.documentElement.dataset.sound = attentionPreferences.soundEnabled ? "on" : "off";
    window.localStorage.setItem("study-empire:attention-preferences", JSON.stringify(attentionPreferences));
  }, [attentionPreferences]);

  useEffect(() => () => { ambientStopRef.current?.(); lumiAudioRef.current?.pause(); }, []);

  function setScene(next: AmbientScene) {
    setAmbientScene(next);
    window.localStorage.setItem("study-empire:ambient-scene", next);
    document.documentElement.dataset.ambientScene = next;
  }

  function stopAmbient() { ambientStopRef.current?.(); ambientStopRef.current = null; setAmbientPlaying(false); }

  async function toggleAmbient(scene = ambientScene) {
    if (!attentionPreferences.soundEnabled) { setMessage("Âm thanh đang tắt trong cài đặt tập trung. Hãy bật Âm thanh trước."); return; }
    setScene(scene);
    if (ambientPlaying && scene === ambientScene) { stopAmbient(); return; }
    stopAmbient();
    try {
      const context = audioContextRef.current ?? new AudioContext();
      audioContextRef.current = context;
      if (context.state !== "running") await context.resume();
      const master = context.createGain(); master.gain.value = 0.055; master.connect(context.destination);
      const sources: AudioScheduledSourceNode[] = []; const timers: number[] = [];
      const beep = (frequency: number, duration: number, gain: number, at = context.currentTime) => {
        const osc = context.createOscillator(); const node = context.createGain(); osc.type = "sine"; osc.frequency.setValueAtTime(frequency, at); node.gain.setValueAtTime(0.001, at); node.gain.exponentialRampToValueAtTime(gain, at + 0.03); node.gain.exponentialRampToValueAtTime(0.001, at + duration); osc.connect(node).connect(master); osc.start(at); osc.stop(at + duration + 0.05); sources.push(osc);
      };
      if (scene === "morning") { beep(880, .17, .34); timers.push(window.setInterval(() => { beep(660, .16, .28); beep(880, .12, .22, context.currentTime + .22); }, 4200)); }
      if (scene === "leaves") { beep(196, 1.5, .12); timers.push(window.setInterval(() => beep(261, 1.1, .1), 5600)); }
      if (scene === "snow") { beep(330, 2.2, .08); timers.push(window.setInterval(() => beep(392, 1.4, .06), 6400)); }
      if (scene === "rain" || scene === "storm") {
        const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate); const data = buffer.getChannelData(0); for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
        const noise = context.createBufferSource(); const filter = context.createBiquadFilter(); const gain = context.createGain(); filter.type = "lowpass"; filter.frequency.value = scene === "storm" ? 1250 : 2200; gain.gain.value = scene === "storm" ? .18 : .1; noise.buffer = buffer; noise.loop = true; noise.connect(filter).connect(gain).connect(master); noise.start(); sources.push(noise);
        if (scene === "storm") timers.push(window.setInterval(() => beep(70, .8, .42), 9000));
      }
      ambientStopRef.current = () => { timers.forEach(window.clearInterval); sources.forEach((source) => { try { source.stop(); } catch { /* stopped */ } }); master.disconnect(); };
      setAmbientPlaying(true); setMessage(`Đang phát nền ${sceneOptions.find((item) => item.id === scene)?.label.toLowerCase()} sau thao tác của Ong.`);
    } catch { setMessage("Trình duyệt chưa cho phép phát âm thanh. Hãy nhấn lại nút âm nền."); }
  }

  function selectEmotion(id: EmotionId) {
    const next = emotionThemes.find((item) => item.id === id) ?? emotionThemes[0];
    onSelect(next.id);
    window.dispatchEvent(new CustomEvent<EmotionId>("study-empire:emotion-change", { detail: next.id }));
    setMessage(`${next.emoji} ${next.encouragement}`);
  }

  function playLumiVoice() {
    if (!attentionPreferences.soundEnabled) { setMessage("Âm thanh đang tắt trong cài đặt tập trung."); return; }
    if (matchingVoiceLine?.audioUrl) {
      lumiAudioRef.current?.pause(); const audio = new Audio(matchingVoiceLine.audioUrl); lumiAudioRef.current = audio; void audio.play().catch(() => setMessage("Không thể phát bản thu này. Lumi vẫn để lại lời nhắn ở bên cạnh.")); return;
    }
    if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(speech.text); utterance.lang = "vi-VN"; utterance.rate = .92; utterance.pitch = 1.15; window.speechSynthesis.speak(utterance); setMessage("Lumi đang đọc lời nhắn cho Ong."); }
    else setMessage("Thiết bị này chưa hỗ trợ giọng đọc. Ong có thể đọc lời nhắn của Lumi.");
  }

  function chooseSpeechGroup(group: SpeechGroup) {
    setSpeechGroup(group); const event = group === "comfort" ? "mistake" : group === "encouragement" || group === "understanding" ? "start" : "procrastination"; const context = event === "mistake" ? "mistake" : event === "start" ? "start" : "procrastination"; const custom = activeContentFor({ customContent }, "antiProcrastination", context, recentContentIds);
    if (custom) { setSpeech({ id: custom.id, group, event, text: custom.text, action: custom.kind === "microTask" ? "Mở nhiệm vụ nhỏ" : undefined }); setRecentContentIds((ids) => [...ids.filter((id) => id !== custom.id), custom.id].slice(-5)); }
    else setSpeech(speechForEvent(event, group));
  }
  function chooseAntiProcrastination(id: "five" | "review" | "lumi") { if (id === "five") onStartTwoMinutes?.(); if (id === "review") setSpeech({ ...speechForEvent("ineffective", "understanding"), text: "Lumi chọn cho Ong: mở lại một phần bài cũ trong 5 phút thôi nhé." }); if (id === "lumi") { setSpeech(randomAntiProcrastinationSpeech()); setMicroTask(randomMicroTask()); setReminder(gentleReminders[Math.floor(Math.random() * gentleReminders.length)] ?? gentleReminders[0]); } setMessage(id === "five" ? "Lumi ở đây. Mình bắt đầu thật nhẹ nhé." : "Lumi đã chọn một nhiệm vụ nhỏ cho Ong."); }
  function chooseLazy(level: "mild" | "very" | "none") { if (lazyLevel === level) { setLazyLevel(null); setMessage("Đã bỏ chọn Chế độ lười."); return; } setLazyLevel(level); setMessage("Không ép buộc. Ong chỉ cần một bước nhỏ khi sẵn sàng."); }

  return <section className="panel emotion-studio relative overflow-hidden border-2 border-[#c62828]/15 bg-[linear-gradient(135deg,#fff7f2_0%,#f5fff5_100%)] p-5 sm:p-6" aria-labelledby="emotion-studio-title">
    <div className={`ambient-scene ambient-scene-${ambientScene}`} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-[#c62828]">Không gian cảm xúc của Lumi</p><h2 id="emotion-studio-title" className="mt-2 font-display text-2xl font-black text-[#7f1d1d]">Hôm nay Ong đang cảm thấy thế nào?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#3f513f]">Chọn cảm xúc để đổi màu toàn ứng dụng và nhận lời đồng hành phù hợp. Âm nền chỉ phát khi Ong chủ động nhấn nút.</p></div><div className="flex items-center gap-3 rounded-2xl border border-[#2e7d32]/20 bg-white/85 px-3 py-3 shadow-sm"><img src={configuredLumiImage} alt="Lumi, bạn đồng hành của Ong" className="h-20 w-16 rounded-2xl object-cover object-top" /><div><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Bạn đồng hành</p><p className="mt-1 text-sm font-black text-[#7f1d1d]">Lumi</p><span className="text-xs text-[#35523a]">Đang ở bên Ong · {theme.label}</span></div><OngLearnerAvatar size="sm" label /></div></div>
    <AttentionControls preferences={attentionPreferences} onToggle={(key) => setAttentionPreferences((current) => ({ ...current, [key]: !current[key] }))} />
    <div className="relative z-10 mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{emotionThemes.map((item) => <div key={item.id} className={`relative rounded-2xl border ${item.id === selected ? "border-[var(--emotion-primary)] bg-[var(--emotion-soft)] shadow-md" : "border-[#2e7d32]/15 bg-white/75"}`}><button type="button" aria-pressed={item.id === selected} onClick={() => selectEmotion(item.id)} className="w-full p-3 pr-10 text-left text-[var(--emotion-ink)]"><span className="text-xl" aria-hidden="true">{item.emoji}</span><b className="mt-1 block text-sm">{item.label}</b><small className="mt-1 block text-[11px] leading-4 opacity-75">{item.description}</small></button><button type="button" aria-label={`Phát âm nền cho cảm xúc ${item.label}`} onClick={() => toggleAmbient(item.id === "sad" || item.id === "tired" ? "rain" : item.id === "happy" || item.id === "proud" ? "morning" : item.id === "stressed" ? "storm" : "leaves")} className="absolute bottom-2 right-2 rounded-lg border border-[#c62828]/20 bg-white/95 p-1.5 text-[#c62828] shadow-sm"><Volume2 className="h-3.5 w-3.5" /></button></div>)}</div>
    <section className="relative z-10 mt-4 rounded-2xl border border-[#2e7d32]/20 bg-white/85 p-3" aria-label="Âm thanh và cảnh nền"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Âm thanh và cảnh nền</p><p className="mt-1 text-xs text-[#35523a]">Chọn cảnh rồi nhấn nghe. Không tự phát khi tải trang.</p></div><button type="button" onClick={() => toggleAmbient()} className="rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white">{ambientPlaying ? <><Pause className="mr-1 inline h-3.5 w-3.5" />Dừng âm nền</> : <><Play className="mr-1 inline h-3.5 w-3.5" />Nghe âm nền</>}</button></div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{sceneOptions.map((scene) => { const Icon = scene.icon; return <button key={scene.id} type="button" aria-pressed={ambientScene === scene.id} onClick={() => setScene(scene.id)} className={`rounded-xl border p-2 text-left text-xs ${ambientScene === scene.id ? "border-[#c62828] bg-[#fff0eb] text-[#7f1d1d]" : "border-[#2e7d32]/15 bg-white text-[#35523a]"}`}><Icon className="h-4 w-4" /><b className="mt-1 block">{scene.label}</b><span className="text-[10px] opacity-75">{scene.detail}</span></button>; })}</div></section>
    <div className="relative z-10 mt-4 rounded-2xl border border-[#c62828]/15 bg-white/85 p-4"><label htmlFor="emotion-command" className="text-sm font-black text-[#7f1d1d]">Câu lệnh đổi giao diện</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input id="emotion-command" value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") selectEmotion(emotionFromCommand(command).id); }} placeholder={safeCommandHint} className="field flex-1 border-[#2e7d32]/25 bg-white" /><button type="button" onClick={() => selectEmotion(emotionFromCommand(command).id)} className="primary-button justify-center bg-[#c62828] hover:bg-[#a91f1f]">Áp dụng</button></div>{message ? <p className="mt-2 text-xs font-bold text-[#2e7d32]" role="status">{message}</p> : null}</div>
    <section className="relative z-10 mt-5 rounded-2xl border-2 border-[#2e7d32]/15 bg-[#f5fff5]/95 p-4" aria-labelledby="speech-library-title"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Lời an ủi và động viên từ Lumi</p><h3 id="speech-library-title" className="mt-1 text-lg font-black text-[#7f1d1d]">Lumi ở đây để nói trực tiếp với Ong</h3></div><span className="rounded-full bg-[#c62828] px-3 py-1 text-xs font-black text-white">{speechGroupLabels[speechGroup]}</span></div><div className="mt-3 flex flex-wrap gap-2">{(Object.entries(speechGroupLabels) as [SpeechGroup, string][]).map(([group, label]) => <button key={group} type="button" onClick={() => chooseSpeechGroup(group)} className={`rounded-xl px-3 py-2 text-xs font-black ${speechGroup === group ? "bg-[#c62828] text-white" : "bg-white text-[#2e7d32]"}`}>{label}</button>)}</div><div className="mt-3 flex gap-3 rounded-2xl bg-[#fff0eb] p-4"><img src={configuredLumiImage} alt="Lumi đang động viên Ong" className="h-20 w-16 rounded-xl object-cover object-top" /><div className="min-w-0 flex-1"><p className="text-sm font-bold leading-6 text-[#6f2424]">{matchingVoiceLine?.text || speech.text}</p><button type="button" onClick={playLumiVoice} className="mt-3 rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white"><Volume2 className="mr-1 inline h-3.5 w-3.5" />Nghe lời Lumi</button>{matchingVoiceLine?.audioUrl ? <span className="ml-2 text-[11px] font-bold text-[#2e7d32]">Dùng bản thu đã được Admin duyệt</span> : <span className="ml-2 text-[11px] text-[#6f5a53]">Dùng giọng đọc thiết bị khi chưa có bản thu</span>}</div></div><div className="mt-3 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-[#2e7d32]/20 bg-white p-3"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">🫠 Chống trì hoãn</p><div className="mt-2 flex flex-wrap gap-2">{antiProcrastinationChoices.map((choice) => <button key={choice.id} type="button" onClick={() => chooseAntiProcrastination(choice.id)} className="rounded-xl border border-[#2e7d32]/20 bg-[#eff9ef] px-3 py-2 text-left text-xs font-black text-[#2e7d32]"><span className="block">{choice.label}</span><small className="mt-1 block font-medium text-[#35523a]">{choice.description}</small></button>)}</div></div><div className="rounded-2xl border border-[#c62828]/15 bg-white p-3"><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">🎯 Nhiệm vụ siêu nhỏ</p><p className="mt-2 text-sm font-black text-[#35523a]">{microTask}</p><button type="button" onClick={() => setMicroTask(randomMicroTask())} className="mt-3 rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white">Đổi nhiệm vụ</button></div></div></section>
    <div className="relative z-10 mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl bg-[#fff0eb]/95 p-4">
        <div className="flex items-start gap-3"><img src={configuredLumiImage} alt="Lumi đang an ủi Ong" className="h-14 w-12 rounded-xl object-cover object-top" /><div><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">Lời nhắn của Lumi</p><p className="mt-2 text-sm font-bold leading-6 text-[#6f2424]">{theme.encouragement}</p></div></div>
        <p className="mt-3 text-xs text-[#6f5a53]">Lumi đang ở đây cùng Ong — không phán xét, chỉ cùng mình đi tiếp.</p>
        <button type="button" onClick={playLumiVoice} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white shadow-sm"><Volume2 className="h-3.5 w-3.5" />{matchingVoiceLine?.audioUrl ? "Nghe lời thoại Lumi" : "Lumi đọc lời nhắn"}</button>
      </div>
      <div className="rounded-2xl bg-[#eff9ef]/95 p-4"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Chế độ lười</p><p className="mt-2 text-sm leading-6 text-[#35523a]">Không ép buộc. Chọn mức năng lượng hiện tại:</p><div className="mt-3 flex flex-wrap gap-2">{([ ["mild", "😌 Hơi lười"], ["very", "🥱 Rất lười"], ["none", "🫠 Không muốn làm gì"] ] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={lazyLevel === value} onClick={() => chooseLazy(value)} className={`rounded-xl px-2.5 py-2 text-xs font-black ${lazyLevel === value ? "bg-[#2e7d32] text-white" : "bg-white text-[#2e7d32]"}`}>{label}</button>)}</div><button type="button" onClick={onStartTwoMinutes} className="mt-3 rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white">⏱ Thử 2 phút</button></div>
      <div className="rounded-2xl bg-[#fff9e8]/95 p-4"><p className="text-xs font-black uppercase tracking-wider text-[#9a5b00]">Boss Trì hoãn</p><p className="mt-2 text-sm font-bold text-[#6b4a1f]">👾 HP 100% · Mỗi phiên hoàn thành: −20 HP</p><div className="mt-3 h-2 rounded-full bg-[#ead9b3]"><div className="h-full w-full rounded-full bg-[#c62828]" /></div><p className="mt-2 text-xs text-[#6b4a1f]">Metaphor vui, không phải bảng phạt.</p></div>
      <div className="rounded-2xl bg-[#f5fff5]/95 p-4"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Ong vs Trì hoãn</p><div className="mt-3 flex items-center justify-between text-center"><div><div className="text-2xl">🐝</div><b className="text-xs text-[#2e7d32]">Ong +1</b></div><span className="text-xs font-black text-[#c62828]">VS</span><div><div className="text-2xl">🫠</div><b className="text-xs text-[#9a5b00]">Trì hoãn</b></div></div><p className="mt-3 text-xs leading-5 text-[#35523a]">Mỗi lần bắt đầu là Ong đang thắng một chút.</p></div>
    </div>
  </section>;
}

function AttentionControls({ preferences, onToggle }: { preferences: AttentionPreferences; onToggle: (key: keyof AttentionPreferences) => void }) {
  const items: Array<{ key: keyof AttentionPreferences; label: string; detail: string }> = [
    { key: "animationsEnabled", label: "Hoạt ảnh", detail: "Hiệu ứng chuyển động và cảnh nền" },
    { key: "popupsEnabled", label: "Popup", detail: "Thông báo nổi không thiết yếu" },
    { key: "soundEnabled", label: "Âm thanh", detail: "Lời Lumi, âm nền và chuông" },
  ];
  return <div className="relative z-10 mt-4 grid gap-2 sm:grid-cols-3">{items.map((item) => <button key={item.key} type="button" aria-pressed={preferences[item.key]} onClick={() => onToggle(item.key)} className={`rounded-xl border p-3 text-left ${preferences[item.key] ? "border-[#2e7d32]/25 bg-[#eff9ef] text-[#25582c]" : "border-slate-200 bg-white/80 text-slate-500"}`}><span className="text-sm font-black">{item.label}</span><small className="mt-1 block text-[11px] font-medium opacity-75">{preferences[item.key] ? item.detail : `${item.detail} · đang tạm dừng`}</small></button>)}</div>;
}
