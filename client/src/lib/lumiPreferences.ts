export const LUMI_SPEECH_STORAGE_KEY = "lumi_speech_enabled";
export const LUMI_WATER_MESSAGE_STORAGE_KEY = "lumi_water_message";
export const LUMI_DIALOGUE_LINES_STORAGE_KEY = "lumi_dialogue_lines";
export const DEFAULT_LUMI_WATER_MESSAGE = "Đã đến giờ uống một ngụm nước ấm rồi nè bạn ơi! ☕💧";

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function readLumiSpeechPreference(fallback = true) {
  try {
    const value = storage()?.getItem(LUMI_SPEECH_STORAGE_KEY);
    return value === null ? fallback : value === "true";
  } catch {
    return fallback;
  }
}

export function saveLumiSpeechPreference(enabled: boolean) {
  try { storage()?.setItem(LUMI_SPEECH_STORAGE_KEY, String(enabled)); } catch { /* storage may be unavailable */ }
}

export function readLumiWaterMessage() {
  try { return storage()?.getItem(LUMI_WATER_MESSAGE_STORAGE_KEY)?.trim() || DEFAULT_LUMI_WATER_MESSAGE; } catch { return DEFAULT_LUMI_WATER_MESSAGE; }
}

export function saveLumiWaterMessage(message: string) {
  const value = message.trim().slice(0, 280) || DEFAULT_LUMI_WATER_MESSAGE;
  try { storage()?.setItem(LUMI_WATER_MESSAGE_STORAGE_KEY, value); } catch { /* storage may be unavailable */ }
  return value;
}

export function readLumiDialogueLines() {
  try {
    const raw = storage()?.getItem(LUMI_DIALOGUE_LINES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((line): line is string => typeof line === "string" && Boolean(line.trim())).map((line) => line.trim().slice(0, 280)).slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function saveLumiDialogueLines(lines: string[]) {
  const values = Array.from(new Set(lines.map((line) => line.trim().slice(0, 280)).filter(Boolean))).slice(0, 20);
  try { storage()?.setItem(LUMI_DIALOGUE_LINES_STORAGE_KEY, JSON.stringify(values)); } catch { /* storage may be unavailable */ }
  return values;
}
