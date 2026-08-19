import type { EmotionThemeId } from "../../../shared/study";

const MASCOT_FALLBACKS: Record<EmotionThemeId, string> = {
  calm: "/manus-storage/mascot-calm_75fbb2fa.png",
  happy: "/manus-storage/mascot-happy_954e950a.png",
  tired: "/manus-storage/mascot-tired_13e7923d.png",
  sad: "/manus-storage/mascot-sad_ba2b0ae8.png",
  stressed: "/manus-storage/mascot-stressed_1daaf3dd.png",
  lazy: "/manus-storage/mascot-lazy_67dd9931.png",
  proud: "/manus-storage/mascot-proud_92bdea38.png",
  focused: "/manus-storage/mascot-focused_3e33e4c9.png",
  hopeful: "/manus-storage/mascot-hopeful_9f2c199f.png",
  overwhelmed: "/manus-storage/mascot-overwhelmed_ff6a26f8.png",
  sleepy: "/manus-storage/mascot-tired_13e7923d.png",
  excited: "/manus-storage/mascot-happy_954e950a.png",
  lonely: "/manus-storage/mascot-sad_ba2b0ae8.png",
  confident: "/manus-storage/mascot-proud_92bdea38.png",
  curious: "/manus-storage/mascot-focused_3e33e4c9.png",
  comeback: "/manus-storage/mascot-hopeful_9f2c199f.png",
};

const LUMI_FALLBACKS: Record<EmotionThemeId, string> = {
  calm: "/manus-storage/lumi-calm_275f2794.png",
  happy: "/manus-storage/lumi-happy_46aa93f8.png",
  tired: "/manus-storage/lumi-tired_47eab3af.png",
  sad: "/manus-storage/lumi-sad_7159227f.png",
  stressed: "/manus-storage/lumi-stressed_8bde69f8.png",
  lazy: "/manus-storage/lumi-tired_47eab3af.png",
  proud: "/manus-storage/lumi-happy_46aa93f8.png",
  focused: "/manus-storage/lumi-calm_275f2794.png",
  hopeful: "/manus-storage/lumi-calm_275f2794.png",
  overwhelmed: "/manus-storage/lumi-stressed_8bde69f8.png",
  sleepy: "/manus-storage/lumi-tired_47eab3af.png",
  excited: "/manus-storage/lumi-happy_46aa93f8.png",
  lonely: "/manus-storage/lumi-sad_7159227f.png",
  confident: "/manus-storage/lumi-happy_46aa93f8.png",
  curious: "/manus-storage/lumi-calm_275f2794.png",
  comeback: "/manus-storage/lumi-calm_275f2794.png",
};

export function getDefaultMascotImage(emotion: EmotionThemeId): string {
  return MASCOT_FALLBACKS[emotion] ?? MASCOT_FALLBACKS.calm;
}

export function getDefaultLumiImage(emotion: EmotionThemeId): string {
  return LUMI_FALLBACKS[emotion] ?? LUMI_FALLBACKS.calm;
}
