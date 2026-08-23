let pendingVoiceCleanup: (() => void) | null = null;

function vietnameseVoice(voices: SpeechSynthesisVoice[]) {
  return voices.find((voice) => voice.lang.toLocaleLowerCase() === "vi-vn")
    ?? voices.find((voice) => voice.lang.toLocaleLowerCase().startsWith("vi"));
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

export function speakLumiVietnamese(text: string, enabled: boolean): boolean {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const synthesis = window.speechSynthesis;
  pendingVoiceCleanup?.();
  pendingVoiceCleanup = null;
  synthesis.cancel();
  const speak = () => synthesis.speak(createLumiVietnameseUtterance(text));
  if (synthesis.getVoices().length) {
    speak();
    return true;
  }
  let finished = false;
  const cleanup = () => {
    synthesis.removeEventListener("voiceschanged", onVoicesChanged);
    window.clearTimeout(timeout);
    if (pendingVoiceCleanup === cleanup) pendingVoiceCleanup = null;
  };
  const onVoicesChanged = () => {
    if (finished) return;
    finished = true;
    cleanup();
    speak();
  };
  const timeout = window.setTimeout(() => {
    if (finished) return;
    finished = true;
    cleanup();
    speak();
  }, 500);
  pendingVoiceCleanup = cleanup;
  synthesis.addEventListener("voiceschanged", onVoicesChanged, { once: true });
  return true;
}
