export type ExternalLumiSpeechResult = "spoken" | "unavailable" | "disabled";

const TTS_FUNCTION_URL = String(import.meta.env.VITE_SUPABASE_TTS_FUNCTION_URL ?? "").trim();
const DEFAULT_VOICE = "vi-VN-Wavenet-A";
let activeAudio: HTMLAudioElement | null = null;
let activeObjectUrl: string | null = null;
let activeRequestController: AbortController | null = null;
let speechRequestId = 0;

function cleanupAudio() {
  activeRequestController?.abort();
  activeRequestController = null;
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.removeAttribute("src");
    activeAudio.load();
    activeAudio = null;
  }
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
}

export function externalLumiTtsConfigured() {
  return Boolean(TTS_FUNCTION_URL);
}

export function stopExternalLumiSpeech() {
  speechRequestId += 1;
  cleanupAudio();
}

export async function speakLumiExternalVietnamese(text: string, enabled: boolean): Promise<ExternalLumiSpeechResult> {
  if (!enabled) return "disabled";
  if (!TTS_FUNCTION_URL || typeof window === "undefined" || typeof Audio === "undefined") return "unavailable";
  const normalized = text.trim();
  if (!normalized) return "unavailable";

  const requestId = speechRequestId + 1;
  speechRequestId = requestId;
  cleanupAudio();
  const controller = new AbortController();
  activeRequestController = controller;
  try {
    const response = await fetch(TTS_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "audio/wav" },
      body: JSON.stringify({ text: normalized, voiceName: DEFAULT_VOICE, speakingRate: 0.96, pitch: 1.08 }),
      signal: controller.signal,
    });
    if (requestId !== speechRequestId || !response.ok) return "unavailable";
    const blob = await response.blob();
    if (requestId !== speechRequestId || !blob.size) return "unavailable";
    const objectUrl = URL.createObjectURL(blob);
    const audio = new Audio(objectUrl);
    audio.preload = "auto";
    activeObjectUrl = objectUrl;
    activeAudio = audio;
    activeRequestController = null;
    const result = await new Promise<ExternalLumiSpeechResult>((resolve) => {
      let settled = false;
      const finish = (value: ExternalLumiSpeechResult) => {
        if (settled) return;
        settled = true;
        if (activeAudio === audio) cleanupAudio();
        resolve(value);
      };
      audio.onended = () => finish("spoken");
      audio.onerror = () => finish("unavailable");
      void audio.play().catch(() => finish("unavailable"));
    });
    return result;
  } catch {
    if (requestId === speechRequestId) cleanupAudio();
    return "unavailable";
  }
}
