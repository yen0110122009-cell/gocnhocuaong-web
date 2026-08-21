import type { EmotionThemeId } from "../../../shared/study";

export const ONG_MASCOT_ASSETS = { human: "", hoodie: "", chibi: "" } as const;
export type OngMascotVariant = keyof typeof ONG_MASCOT_ASSETS;

type Props = { className?: string; imageUrl?: string; emotion?: EmotionThemeId; variant?: OngMascotVariant; size?: "sm" | "md" | "lg"; label?: boolean };

/** Audio-only companion marker. Legacy image props remain accepted for data compatibility but are never rendered. */
export function OngLearnerAvatar({ className = "", size = "md", label = false }: Props) {
  const sizeClass = size === "lg" ? "h-24 w-20" : size === "sm" ? "h-12 w-10" : "h-16 w-14";
  return <span className={`ong-learner-avatar inline-flex flex-col items-center gap-1 ${className}`}>
    <span className={`${sizeClass} relative inline-flex items-center justify-center rounded-2xl border-2 border-[#f4b942] bg-gradient-to-br from-[#fff7e8] to-[#eff9ef] text-[#8e1b1b] shadow-sm`} aria-label="Ong, bạn đồng hành audio-only" role="img">
      <span aria-hidden="true" className="text-xl">◉</span>
      {label ? <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white bg-[#f4b942] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#5b1717] shadow-sm">Ong · audio</span> : null}
    </span>
  </span>;
}
