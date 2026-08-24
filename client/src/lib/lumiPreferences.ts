export const LUMI_SPEECH_STORAGE_KEY = "lumi_speech_enabled";
export const LUMI_SPEECH_RATE_STORAGE_KEY = "lumi_speech_rate";
export const LUMI_SPEECH_VOLUME_STORAGE_KEY = "lumi_speech_volume";
export const DEFAULT_LUMI_SPEECH_RATE = 0.96;
export const DEFAULT_LUMI_SPEECH_VOLUME = 1;

export type LumiSpeechSettings = {
  rate: number;
  volume: number;
};

const clampSpeechRate = (value: number) => Math.min(1.5, Math.max(0.6, value));
const clampSpeechVolume = (value: number) => Math.min(1, Math.max(0, value));

export function normalizeLumiSpeechSettings(value: Partial<LumiSpeechSettings> | null | undefined): LumiSpeechSettings {
  const rate = typeof value?.rate === "number" && Number.isFinite(value.rate) ? value.rate : DEFAULT_LUMI_SPEECH_RATE;
  const volume = typeof value?.volume === "number" && Number.isFinite(value.volume) ? value.volume : DEFAULT_LUMI_SPEECH_VOLUME;
  return { rate: clampSpeechRate(rate), volume: clampSpeechVolume(volume) };
}

export function readLumiSpeechSettings(): LumiSpeechSettings {
  try {
    const savedRate = storage()?.getItem(LUMI_SPEECH_RATE_STORAGE_KEY);
    const savedVolume = storage()?.getItem(LUMI_SPEECH_VOLUME_STORAGE_KEY);
    return normalizeLumiSpeechSettings({
      rate: savedRate === null || savedRate === undefined ? undefined : Number(savedRate),
      volume: savedVolume === null || savedVolume === undefined ? undefined : Number(savedVolume),
    });
  } catch {
    return normalizeLumiSpeechSettings(undefined);
  }
}

export function saveLumiSpeechSettings(value: Partial<LumiSpeechSettings>) {
  const settings = normalizeLumiSpeechSettings(value);
  try {
    storage()?.setItem(LUMI_SPEECH_RATE_STORAGE_KEY, String(settings.rate));
    storage()?.setItem(LUMI_SPEECH_VOLUME_STORAGE_KEY, String(settings.volume));
  } catch { /* storage may be unavailable */ }
  return settings;
}

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
  const value = message.trim() || DEFAULT_LUMI_WATER_MESSAGE;
  try { storage()?.setItem(LUMI_WATER_MESSAGE_STORAGE_KEY, value); } catch { /* storage may be unavailable */ }
  return value;
}

export function readLumiDialogueLines() {
  try {
    const raw = storage()?.getItem(LUMI_DIALOGUE_LINES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((line): line is string => typeof line === "string" && Boolean(line.trim())).map((line) => line.trim()).slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function saveLumiDialogueLines(lines: string[]) {
  const values = Array.from(new Set(lines.map((line) => line.trim()).filter(Boolean))).slice(0, 20);
  try { storage()?.setItem(LUMI_DIALOGUE_LINES_STORAGE_KEY, JSON.stringify(values)); } catch { /* storage may be unavailable */ }
  return values;
}
