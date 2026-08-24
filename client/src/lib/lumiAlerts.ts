import { LUMI_WATER_ALERT_SOUND_IDS, type LumiWaterAlertSoundId } from "../../../shared/study";

export const LUMI_WATER_ALERT_SOUNDS = [
  { id: "water_drop", label: "Giọt nước mượt mà 💧", description: "Hai giọt âm thanh trong và êm." },
  { id: "soft_chime", label: "Chuông tinh tinh 🔔", description: "Ba nốt nhẹ nhàng." },
  { id: "wind_chime", label: "Tiếng chuông gió 🎐", description: "Chuỗi nốt lan nhẹ như gió." },
  { id: "wood_block", label: "Tiếng cốc cốc 🪵", description: "Hai nhịp gõ mộc mạc." },
  { id: "cute_beep", label: "Âm tích tích Kawaii ✨", description: "Ba tiếng beep ngắn vui tươi." },
] as const;

export function isLumiWaterAlertSoundId(value: string): value is LumiWaterAlertSoundId {
  return LUMI_WATER_ALERT_SOUND_IDS.includes(value as LumiWaterAlertSoundId);
}

function tone(context: globalThis.AudioContext, frequency: number, start: number, duration: number, volume: number, type: OscillatorType = "sine") {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, Math.min(0.95, volume)), start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

export function playLumiWaterAlert(context: globalThis.AudioContext, soundId: LumiWaterAlertSoundId, volume: number, repeatCount = 1, durationMultiplier = 1) {
  const loudness = Math.max(0, Math.min(10, volume));
  if (loudness <= 0) return;
  const repeats = Math.max(1, Math.min(10, Math.round(repeatCount)));
  const durationScale = Math.max(0.5, Math.min(3, durationMultiplier));
  const base = Math.min(0.9, loudness * 0.075);
  const start = context.currentTime + 0.02;
  const playSequence = (sequenceStart: number) => {
    const notes = (frequencies: number[], interval: number, duration: number, type: OscillatorType = "sine") => frequencies.forEach((frequency, index) => tone(context, frequency, sequenceStart + index * interval * durationScale, duration * durationScale, base, type));
    if (soundId === "water_drop") notes([880, 1174.66], 0.18, 0.38);
    else if (soundId === "soft_chime") notes([659.25, 783.99, 987.77], 0.16, 0.52);
    else if (soundId === "wind_chime") notes([523.25, 659.25, 783.99, 1046.5], 0.13, 0.72);
    else if (soundId === "wood_block") notes([520, 390], 0.2, 0.14, "triangle");
    else notes([880, 1108.73, 1318.51], 0.11, 0.16, "square");
  };
  const sequenceGap = 1.45 * durationScale;
  for (let index = 0; index < repeats; index += 1) playSequence(start + index * sequenceGap);
}
