import { Heart, Play, Sparkles } from "lucide-react";
import { emotionThemes, type EmotionId } from "../lib/emotionThemes";
import type { AppConfig, ProfileState } from "../../../shared/study";

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

export function ExperienceStudio({ selected, onSelect, profile, onProfile, customContent = [], voiceLines = [] }: ExperienceStudioProps) {
  const current = emotionThemes.find((item) => item.id === selected) ?? emotionThemes[0];
  const activeMessage = customContent.find((item) => item.enabled && !item.deletedAt && (item.kind === "comfort" || item.kind === "encouragement"));
  const currentVoice = voiceLines.find((item) => item.enabled && item.audioUrl && (!item.emotion || item.emotion === selected));
  const playVoice = () => {
    if (!currentVoice?.audioUrl) return;
    const audio = new Audio(currentVoice.audioUrl);
    audio.play().catch(() => undefined);
  };

  return <div className="space-y-5">
    <section className="panel overflow-hidden p-6" style={{ background: `linear-gradient(135deg, ${current.colors.soft}, var(--card, #fff))` }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-rose-700 dark:text-rose-300">Trạng thái của hôm nay</p>
          <h2 className="mt-2 font-display text-2xl font-bold">{current.emoji} {current.label}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{current.encouragement}</p>
          {activeMessage && <p className="mt-3 rounded-2xl bg-white/75 p-3 text-sm font-medium text-slate-700 dark:bg-slate-950/30 dark:text-slate-200">{activeMessage.text}</p>}
        </div>
        {currentVoice?.audioUrl && <button className="secondary-button shrink-0" onClick={playVoice}><Play className="h-4 w-4" />Nghe lời Lumi</button>}
      </div>
    </section>

    <section className="panel p-5" aria-labelledby="lumi-emotion-heading">
      <div className="flex items-center gap-2"><Heart className="h-5 w-5 text-rose-600" /><div><h2 id="lumi-emotion-heading" className="font-display text-xl font-bold">Lumi đang đồng hành thế nào?</h2><p className="text-sm text-slate-500">Chọn cảm xúc phù hợp. Bạn có thể đổi lại bất cứ lúc nào, không có lựa chọn đúng hay sai.</p></div></div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {emotionThemes.map((emotion) => <button key={emotion.id} onClick={() => { onSelect(emotion.id); if (profile && onProfile) onProfile({ ...profile, emotionTheme: emotion.id }, "Lumi đã cập nhật trạng thái đồng hành."); }} className={`rounded-2xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${selected === emotion.id ? "border-rose-400 bg-rose-50 dark:bg-rose-950/30" : "border-slate-200 hover:border-rose-200 dark:border-white/10"}`}><span className="text-xl">{emotion.emoji}</span><b className="ml-2 text-sm">{emotion.label}</b><span className="mt-2 block text-xs leading-5 text-slate-500">{emotion.description}</span></button>)}
      </div>
    </section>

    <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 text-emerald-950 dark:border-emerald-400/20 dark:bg-emerald-950/20 dark:text-emerald-50"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-5 w-5 shrink-0" /><div><h2 className="font-display text-xl font-bold">Một lời nhắc nhẹ</h2><p className="mt-1 text-sm leading-6">Lumi ở đây để động viên và lắng nghe. Khi sẵn sàng học, hãy mở Pomodoro hoặc Kế hoạch; không có Boss, combo, nhiệm vụ ngẫu nhiên hay phần thưởng áp lực trong không gian này.</p></div></div></section>
  </div>;
}

export default ExperienceStudio;
