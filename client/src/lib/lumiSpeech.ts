import { speakLumiExternalVietnamese, stopExternalLumiSpeech } from "./lumiExternalTts";

let pendingVoiceCleanup: (() => void) | null = null;

export const LUMI_SPEECH_UNAVAILABLE_EVENT = "lumi:speech-unavailable";
export type LumiSpeechResult = "spoken" | "pending" | "unavailable" | "disabled";

function vietnameseVoice(voices: SpeechSynthesisVoice[]) {
  return voices.find((voice) => voice.lang.toLocaleLowerCase() === "vi-vn")
    ?? voices.find((voice) => voice.lang.toLocaleLowerCase().startsWith("vi"));
}

function notifySpeechUnavailable() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(LUMI_SPEECH_UNAVAILABLE_EVENT));
}

export function createLumiVietnameseUtterance(text: string): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "vi-VN";
  utterance.rate = 0.96;
  utterance.pitch = 1.08;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return utterance;
  const voice = vietnameseVoice(window.speechSynthesis.getVoices());
  if (voice) utterance.voice = voice;
  return utterance;
}

export function speakLumiVietnamese(text: string, enabled: boolean): LumiSpeechResult {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return "disabled";
  const synthesis = window.speechSynthesis;
  pendingVoiceCleanup?.();
  pendingVoiceCleanup = null;
  synthesis.cancel();

  let finished = false;
  let timeout: number | undefined;
  const cleanup = () => {
    synthesis.removeEventListener("voiceschanged", onVoicesChanged);
    if (timeout !== undefined) window.clearTimeout(timeout);
    if (pendingVoiceCleanup === cleanup) pendingVoiceCleanup = null;
  };
  const speakWithVoice = (voice: SpeechSynthesisVoice): LumiSpeechResult => {
    const utterance = createLumiVietnameseUtterance(text);
    utterance.voice = voice;
    utterance.onerror = (event) => {
      if (event.error === "voice-unavailable" || event.error === "language-unavailable") notifySpeechUnavailable();
    };
    synthesis.speak(utterance);
    finished = true;
    cleanup();
    return "spoken";
  };
  const attempt = (): LumiSpeechResult | null => {
    const voice = vietnameseVoice(synthesis.getVoices());
    return voice ? speakWithVoice(voice) : null;
  };
  const immediate = attempt();
  if (immediate) return immediate;

  const onVoicesChanged = () => {
    if (finished) return;
    const result = attempt();
    if (result) finished = true;
  };
  timeout = window.setTimeout(() => {
    if (finished) return;
    finished = true;
    cleanup();
    notifySpeechUnavailable();
  }, 1_800);
  pendingVoiceCleanup = () => {
    finished = true;
    cleanup();
  };
  synthesis.addEventListener("voiceschanged", onVoicesChanged);
  return "pending";
}

export async function speakLumi(text: string, enabled: boolean): Promise<LumiSpeechResult> {
  if (!enabled) return "disabled";
  const externalResult = await speakLumiExternalVietnamese(text, enabled);
  if (externalResult === "spoken") return "spoken";
  return speakLumiVietnamese(text, enabled);
}

export function stopLumiSpeech() {
  stopExternalLumiSpeech();
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  pendingVoiceCleanup?.();
  pendingVoiceCleanup = null;
}

export function hasLumiVietnameseVoice(): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  return Boolean(vietnameseVoice(window.speechSynthesis.getVoices()));
}
