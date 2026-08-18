import React, { useEffect, useMemo, useState } from "react";
import { emotionFromCommand, emotionThemes, type EmotionId } from "../lib/emotionThemes";
import { activeContentFor, antiProcrastinationChoices, gentleReminders, randomAntiProcrastinationSpeech, randomMicroTask, speechForEvent, speechGroupLabels, type SpeechGroup } from "../lib/speechLibrary";
import type { AppConfig } from "../../../shared/study";
import { OngLearnerAvatar } from "./OngLearnerAvatar";

type Props = { selected: EmotionId; onSelect: (id: EmotionId) => void; onStartTwoMinutes?: () => void; customContent?: AppConfig["customContent"] };

const companionImage = "/manus-storage/lumi-mascot-clean_28a6da68.png";

export function ExperienceStudio({ selected, onSelect, onStartTwoMinutes, customContent = [] }: Props) {
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("");
  const [lazyLevel, setLazyLevel] = useState<"mild" | "very" | "none" | null>(null);
  const [speechGroup, setSpeechGroup] = useState<SpeechGroup>("comfort");
  const [speech, setSpeech] = useState(() => speechForEvent("procrastination"));
  const [recentContentIds, setRecentContentIds] = useState<string[]>([]);
  const [microTask, setMicroTask] = useState(() => randomMicroTask());
  const [reminder, setReminder] = useState<string>(() => gentleReminders[0]);
  const theme = emotionThemes.find((item) => item.id === selected) ?? emotionThemes[0];
  const safeCommandHint = useMemo(() => "Ví dụ: vui vẻ, tôi đang mệt, cần đồng hành", []);
  const mascotName = "Lumi";
  const mascotAlt = "Lumi đeo kính với kẹp tóc hình ngôi sao vàng, bạn đồng hành của Ong";

  useEffect(() => {
    const saved = window.localStorage.getItem("study-empire:emotion-theme") as EmotionId | null;
    if (saved && emotionThemes.some((item) => item.id === saved) && saved !== selected) onSelect(saved);
  }, [onSelect, selected]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.emotion = selected;
    root.style.setProperty("--emotion-primary", theme.colors.primary);
    root.style.setProperty("--emotion-secondary", theme.colors.secondary);
    root.style.setProperty("--emotion-soft", theme.colors.soft);
    root.style.setProperty("--emotion-ink", theme.colors.ink);
    root.style.setProperty("--emotion-glow", theme.colors.glow);
    window.localStorage.setItem("study-empire:emotion-theme", selected);
  }, [selected, theme]);

  function selectEmotion(id: EmotionId) {
    const next = emotionThemes.find((item) => item.id === id) ?? emotionThemes[0];
    onSelect(next.id);
    setMessage(`${next.emoji} ${next.encouragement}`);
  }

  function applyCommand() {
    const next = emotionFromCommand(command);
    selectEmotion(next.id);
    setCommand("");
  }

  function chooseSpeechGroup(group: SpeechGroup) {
    setSpeechGroup(group);
    const event = group === "comfort" ? "mistake" : group === "encouragement" ? "start" : group === "understanding" ? "start" : "procrastination";
    const context = event === "mistake" ? "mistake" : event === "start" ? "start" : "procrastination";
    const custom = activeContentFor({ customContent }, "antiProcrastination", context, recentContentIds);
    if (custom) {
      setSpeech({ id: custom.id, group, event, text: custom.text, action: custom.kind === "microTask" ? "Mở nhiệm vụ nhỏ" : undefined });
      setRecentContentIds((ids) => [...ids.filter((id) => id !== custom.id), custom.id].slice(-5));
    } else setSpeech(speechForEvent(event, group));
  }

  function chooseAntiProcrastination(id: "five" | "review" | "lumi") {
    if (id === "five") onStartTwoMinutes?.();
    if (id === "review") setSpeech({ ...speechForEvent("ineffective", "understanding"), text: "Lumi chọn cho Ong: mở lại một phần bài cũ trong 5 phút thôi nhé." });
    if (id === "lumi") {
      const custom = activeContentFor({ customContent }, "antiProcrastination", "procrastination", recentContentIds);
      if (custom) { setSpeech({ id: custom.id, group: "antiProcrastination", event: "procrastination", text: custom.text, action: custom.kind === "microTask" ? "Mở nhiệm vụ nhỏ" : undefined }); setRecentContentIds((ids) => [...ids.filter((item) => item !== custom.id), custom.id].slice(-5)); }
      else setSpeech(randomAntiProcrastinationSpeech());
      setMicroTask(randomMicroTask()); setReminder(gentleReminders[Math.floor(Math.random() * gentleReminders.length)] ?? gentleReminders[0]);
    }
    setMessage(id === "five" ? "Lumi ở đây. Mình bắt đầu 5 phút thật nhẹ nhé." : id === "review" ? "Đã chọn ôn bài cũ cùng Lumi." : "Lumi đã chọn một nhiệm vụ nhỏ cho Ong.");
  }

  function chooseLazy(level: "mild" | "very" | "none") {
    if (lazyLevel === level) {
      setLazyLevel(null);
      setMessage("Đã bỏ chọn Chế độ lười. Ong có thể chọn lại mức phù hợp bất cứ lúc nào.");
      return;
    }
    setLazyLevel(level);
    if (level === "none") setMessage("Không sao cả. Hôm nay mình chỉ cần nghỉ ngơi tử tế. Nhấn lại lựa chọn này để bỏ chọn.");
    else if (level === "very") setMessage("Mình không ép Ong. Chỉ thử một nhiệm vụ 2 phút khi sẵn sàng nhé. Nhấn lại để bỏ chọn.");
    else setMessage("Hơi lười cũng được. Mở sách hoặc một thẻ học trong 2 phút thôi. Nhấn lại để bỏ chọn.");
  }

  return <section className="panel emotion-studio border-2 border-[#c62828]/15 bg-[linear-gradient(135deg,#fff7f2_0%,#f5fff5_100%)] p-5 sm:p-6" aria-labelledby="emotion-studio-title">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#c62828]">Emotion Theme Studio</p><h2 id="emotion-studio-title" className="mt-2 font-display text-2xl font-black text-[#7f1d1d]">Hôm nay Ong đang cảm thấy thế nào?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#3f513f]">Chọn một nhịp phù hợp. Giao diện và lời nhắn sẽ đổi theo cảm xúc; Lumi sẽ xuất hiện để ở bên và động viên, còn Ong là người đang học.</p></div>
      <div className="flex items-center gap-3 rounded-2xl border border-[#2e7d32]/20 bg-white/80 px-3 py-3 shadow-sm"><img src={companionImage} alt={mascotAlt} className="h-20 w-16 rounded-2xl object-cover object-top" /><div><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Bạn đồng hành</p><p className="mt-1 text-sm font-black text-[#7f1d1d]">Lumi</p><span className="text-xs text-[#35523a]">Đang ở bên Ong · {theme.label}</span></div><OngLearnerAvatar size="sm" label /></div>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{emotionThemes.map((item) => <button key={item.id} type="button" aria-pressed={item.id === selected} onClick={() => selectEmotion(item.id)} className={`rounded-2xl border p-3 text-left transition ${item.id === selected ? "border-[var(--emotion-primary)] bg-[var(--emotion-soft)] text-[var(--emotion-ink)] shadow-md" : "border-[#2e7d32]/15 bg-white/70 text-[#35523a] hover:border-[#2e7d32]"}`}><span className="text-xl" aria-hidden="true">{item.emoji}</span><b className="mt-1 block text-sm">{item.label}</b><small className="mt-1 block text-[11px] leading-4 opacity-75">{item.description}</small></button>)}</div>
    <div className="mt-5 rounded-2xl border border-[#c62828]/15 bg-white/80 p-4"><label htmlFor="emotion-command" className="text-sm font-black text-[#7f1d1d]">Câu lệnh đổi giao diện</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><input id="emotion-command" value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") applyCommand(); }} placeholder={safeCommandHint} className="field flex-1 border-[#2e7d32]/25 bg-white" /><button type="button" onClick={applyCommand} className="primary-button justify-center bg-[#c62828] hover:bg-[#a91f1f]">Áp dụng</button></div>{message ? <p className="mt-2 text-xs font-bold text-[#2e7d32]" role="status">{message}</p> : null}</div>
    <section className="mt-5 rounded-2xl border-2 border-[#2e7d32]/15 bg-[#f5fff5] p-4" aria-labelledby="speech-library-title"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">💬 Kho lời nói & ý tưởng</p><h3 id="speech-library-title" className="mt-1 text-lg font-black text-[#7f1d1d]">Lumi chọn lời phù hợp với lúc này</h3></div><span className="rounded-full bg-[#c62828] px-3 py-1 text-xs font-black text-white">{speechGroupLabels[speechGroup]}</span></div><div className="mt-3 flex flex-wrap gap-2">{(Object.entries(speechGroupLabels) as [SpeechGroup, string][]).map(([group, label]) => <button key={group} type="button" onClick={() => chooseSpeechGroup(group)} className={`rounded-xl px-3 py-2 text-xs font-black ${speechGroup === group ? "bg-[#c62828] text-white" : "bg-white text-[#2e7d32]"}`}>{label}</button>)}</div><div className="mt-3 rounded-2xl bg-[#fff0eb] p-4"><div className="flex items-start gap-3"><img src={companionImage} alt="Lumi, bạn đồng hành" className="h-14 w-12 rounded-xl object-cover object-top" /><p className="text-sm font-bold leading-6 text-[#6f2424]">{speech.text}</p></div>{speech.action ? <button type="button" className="mt-3 rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white" onClick={() => chooseAntiProcrastination("five")}>{speech.action}</button> : null}</div><div className="mt-3 rounded-2xl border border-[#c62828]/15 bg-white p-3"><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">🫠 Chống trì hoãn</p><div className="mt-2 flex flex-wrap gap-2">{antiProcrastinationChoices.map((choice) => <button key={choice.id} type="button" onClick={() => chooseAntiProcrastination(choice.id)} className="rounded-xl border border-[#2e7d32]/20 bg-[#eff9ef] px-3 py-2 text-left text-xs font-black text-[#2e7d32]"><span className="block">{choice.label}</span><small className="mt-1 block font-medium text-[#35523a]">{choice.description}</small></button>)}</div></div><div className="mt-3 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-[#2e7d32]/20 bg-[#eff9ef] p-3"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">🎯 Nhiệm vụ siêu nhỏ</p><p className="mt-2 text-sm font-black text-[#35523a]">{microTask}</p><button type="button" onClick={() => { setMicroTask(randomMicroTask()); setMessage("Lumi đã đổi sang một nhiệm vụ nhỏ khác cho Ong."); }} className="mt-3 rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white">🎲 Đổi nhiệm vụ</button></div><div className="rounded-2xl border border-[#c62828]/15 bg-[#fff0eb] p-3"><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">🌱 Lời nhắc nhẹ</p><p className="mt-2 text-sm font-bold leading-6 text-[#6f2424]">{reminder}</p><button type="button" onClick={() => setReminder(gentleReminders[Math.floor(Math.random() * gentleReminders.length)] ?? gentleReminders[0])} className="mt-3 rounded-xl bg-[#c62828] px-3 py-2 text-xs font-black text-white">Lời nhắc khác</button></div></div></section><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4"><div className="rounded-2xl bg-[#fff0eb] p-4"><p className="text-xs font-black uppercase tracking-wider text-[#c62828]">Lời nhắn cho Ong</p><p className="mt-2 text-sm font-bold leading-6 text-[#6f2424]">{theme.encouragement}</p><p className="mt-2 text-xs text-[#6f5a53]">Lumi đang ở đây cùng Ong — không phán xét, chỉ cùng mình đi tiếp.</p></div><div className="rounded-2xl bg-[#eff9ef] p-4"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Chế độ lười</p><p className="mt-2 text-sm leading-6 text-[#35523a]">Không ép buộc. Chọn mức năng lượng hiện tại:</p><div className="mt-3 flex flex-wrap gap-2">{([["mild", "😌 Hơi lười"], ["very", "🥱 Rất lười"], ["none", "🫠 Không muốn làm gì"]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={lazyLevel === value} onClick={() => chooseLazy(value)} className={`rounded-xl px-2.5 py-2 text-xs font-black ${lazyLevel === value ? "bg-[#2e7d32] text-white" : "bg-white text-[#2e7d32]"}`}>{label}</button>)}</div><button type="button" onClick={onStartTwoMinutes} className="mt-3 rounded-xl bg-[#2e7d32] px-3 py-2 text-xs font-black text-white hover:bg-[#236328]">⏱ Thử 2 phút</button></div><div className="rounded-2xl bg-[#fff9e8] p-4"><p className="text-xs font-black uppercase tracking-wider text-[#9a5b00]">Boss Trì hoãn</p><p className="mt-2 text-sm font-bold text-[#6b4a1f]">👾 HP 100% · Mỗi phiên hoàn thành: −20 HP</p><div className="mt-3 h-2 rounded-full bg-[#ead9b3]"><div className="h-full w-full rounded-full bg-[#c62828]" /></div><p className="mt-2 text-xs text-[#6b4a1f]">Metaphor vui, không phải bảng phạt.</p></div><div className="rounded-2xl bg-[#f5fff5] p-4"><p className="text-xs font-black uppercase tracking-wider text-[#2e7d32]">Ong vs Trì hoãn</p><div className="mt-3 flex items-center justify-between text-center"><div><div className="text-2xl">🐝</div><b className="text-xs text-[#2e7d32]">Ong +1</b></div><span className="text-xs font-black text-[#c62828]">VS</span><div><div className="text-2xl">🫠</div><b className="text-xs text-[#9a5b00]">Trì hoãn</b></div></div><p className="mt-3 text-xs leading-5 text-[#35523a]">Mỗi lần bắt đầu là Ong đang thắng một chút.</p></div></div>
  </section>;
}
