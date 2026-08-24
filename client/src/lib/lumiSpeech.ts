import { readLumiSpeechSettings, type LumiSpeechSettings } from "./lumiPreferences";

let pendingVoiceCleanup: (() => void) | null = null;

export const LUMI_SPEECH_UNAVAILABLE_EVENT = "lumi:speech-unavailable";
export type LumiSpeechResult = "spoken" | "pending" | "unavailable" | "disabled";

function vietnameseVoice(voices: SpeechSynthesisVoice[]) {
  return voices
    .filter((voice) => voice.lang.replace("_", "-").toLocaleLowerCase().startsWith("vi"))
    .sort((left, right) => {
      const score = (voice: SpeechSynthesisVoice) => {
        const lang = voice.lang.replace("_", "-").toLocaleLowerCase();
        const name = voice.name.toLocaleLowerCase();
        const isNatural = /natural|neural|wavenet|google|premium|enhanced/.test(name);
        const isLowQuality = /espeak|compact|default|generic/.test(name);
        return (lang === "vi-vn" ? 100 : 0) + (isNatural ? 20 : 0) + (voice.localService ? 5 : 0) - (isLowQuality ? 15 : 0);
      };
      return score(right) - score(left);
    })[0] ?? null;
}

function notifySpeechUnavailable() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(LUMI_SPEECH_UNAVAILABLE_EVENT));
}

function splitSpeechText(text: string, maxCharacters = 220) {
  const normalized = text.replace(/\r\n?/g, "\n").trim();
  if (!normalized) return [];
  const paragraphs = normalized.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const chunks: string[] = [];
  const splitLongWord = (word: string) => {
    const pieces: string[] = [];
    let piece = "";
    for (const character of Array.from(word)) {
      if ((piece + character).length > maxCharacters) {
        if (piece) pieces.push(piece);
        piece = character;
      } else {
        piece += character;
      }
    }
    if (piece) pieces.push(piece);
    return pieces;
  };
  for (const paragraph of paragraphs) {
    const sentences = paragraph.split(/(?<=[.!?…。！？])\s+/).map((sentence) => sentence.trim()).filter(Boolean);
    const units = sentences.length ? sentences : [paragraph];
    let current = "";
    for (const unit of units) {
      if (unit.length > maxCharacters) {
        if (current) {
          chunks.push(current);
          current = "";
        }
        const words = unit.split(/\s+/).filter(Boolean);
        let wordChunk = "";
        for (const word of words) {
          if (word.length > maxCharacters) {
            if (wordChunk) {
              chunks.push(wordChunk);
              wordChunk = "";
            }
            chunks.push(...splitLongWord(word));
            continue;
          }
          const candidate = wordChunk ? `${wordChunk} ${word}` : word;
          if (candidate.length <= maxCharacters) {
            wordChunk = candidate;
          } else {
            if (wordChunk) chunks.push(wordChunk);
            wordChunk = word;
          }
        }
        if (wordChunk) chunks.push(wordChunk);
        continue;
      }
      const candidate = current ? `${current} ${unit}` : unit;
      if (candidate.length <= maxCharacters) {
        current = candidate;
      } else {
        if (current) chunks.push(current);
        current = unit;
      }
    }
    if (current) chunks.push(current);
  }
  return chunks;
}

export function createLumiVietnameseUtterance(text: string, settings: LumiSpeechSettings = readLumiSpeechSettings()): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "vi-VN";
  utterance.rate = settings.rate;
  utterance.volume = settings.volume;
  utterance.pitch = 1.04;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return utterance;
  const voice = vietnameseVoice(window.speechSynthesis.getVoices());
  if (voice) utterance.voice = voice;
  return utterance;
}

export function speakLumiVietnamese(text: string, enabled: boolean): LumiSpeechResult {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return "disabled";
  const synthesis = window.speechSynthesis;
  const chunks = splitSpeechText(text);
  if (!chunks.length) return "disabled";
  pendingVoiceCleanup?.();
  pendingVoiceCleanup = null;
  synthesis.cancel();
  synthesis.resume?.();

  let started = false;
  let cancelled = false;
  let timeout: number | undefined;
  const settings = readLumiSpeechSettings();
  const cleanup = () => {
    synthesis.removeEventListener("voiceschanged", onVoicesChanged);
    if (timeout !== undefined) window.clearTimeout(timeout);
    if (pendingVoiceCleanup === cleanup) pendingVoiceCleanup = null;
  };
  const speakWithVoice = (voice: SpeechSynthesisVoice): LumiSpeechResult => {
    started = true;
    let chunkIndex = 0;
    const speakNext = () => {
      if (cancelled || chunkIndex >= chunks.length) {
        cleanup();
        return;
      }
      const utterance = createLumiVietnameseUtterance(chunks[chunkIndex], settings);
      utterance.voice = voice;
      chunkIndex += 1;
      utterance.onend = speakNext;
      utterance.onerror = (event) => {
        cancelled = true;
        cleanup();
        if (event.error === "voice-unavailable" || event.error === "language-unavailable") notifySpeechUnavailable();
      };
      synthesis.speak(utterance);
    };
    speakNext();
    return "spoken";
  };
  const attempt = (): LumiSpeechResult | null => {
    const voice = vietnameseVoice(synthesis.getVoices());
    return voice ? speakWithVoice(voice) : null;
  };
  const immediate = attempt();
  if (immediate) return immediate;

  function onVoicesChanged() {
    if (started || cancelled) return;
    const result = attempt();
    if (result) started = true;
  }
  timeout = window.setTimeout(() => {
    if (started || cancelled) return;
    cancelled = true;
    cleanup();
    notifySpeechUnavailable();
  }, 1_800);
  pendingVoiceCleanup = () => {
    cancelled = true;
    synthesis.cancel();
    cleanup();
  };
  synthesis.addEventListener("voiceschanged", onVoicesChanged);
  return "pending";
}

export function stopLumiSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  pendingVoiceCleanup?.();
  pendingVoiceCleanup = null;
}

export function hasLumiVietnameseVoice(): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  return Boolean(vietnameseVoice(window.speechSynthesis.getVoices()));
}

export { splitSpeechText };
