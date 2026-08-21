import type { EmotionThemeId } from "../../../shared/study";

export const ONG_MASCOT_ASSETS = { human: "", hoodie: "", chibi: "" } as const;
export type OngMascotVariant = keyof typeof ONG_MASCOT_ASSETS;

type Props = { className?: string; imageUrl?: string; emotion?: EmotionThemeId; variant?: OngMascotVariant; size?: "sm" | "md" | "lg"; label?: boolean };

/** Legacy props remain accepted for data compatibility; companion visuals are intentionally not rendered. */
export function OngLearnerAvatar(_: Props) { return null; }
