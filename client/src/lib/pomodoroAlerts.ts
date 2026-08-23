import {
  POMODORO_ALERT_SOUND_IDS,
  type PomodoroAlertSoundId,
} from "../../../shared/study";

export const POMODORO_ALERT_SOUNDS: Array<{ id: PomodoroAlertSoundId; label: string; description: string }> = [
  { id: "digital_bell", label: "Chuông điện tử", description: "Ba nốt cao, trong và ngân dài." },
  { id: "loud_alarm", label: "Báo động dồn dập", description: "Ba tiếng báo rõ ràng." },
  { id: "marimba", label: "Marimba vui tươi", description: "Bốn nốt gỗ nhẹ nhàng." },
  { id: "school_bell", label: "Chuông trường học", description: "Âm reng dài, dứt khoát." },
  { id: "crystal_gong", label: "Gong pha lê", description: "Âm vang sâu và thanh tịnh." },
  { id: "soft_chime", label: "Chuông gió nhẹ", description: "Hai nốt du dương." },
  { id: "retro_beep", label: "Beep cổ điển", description: "Âm 8-bit ngắn, rõ." },
  { id: "victory_fanfare", label: "Kèn chiến thắng", description: "Chuỗi nốt chúc mừng hoàn thành." },
  { id: "wood_tap", label: "Tiếng cốc gỗ", description: "Hai nhịp gõ tập trung." },
  { id: "whistle_up", label: "Còi tăng năng lượng", description: "Âm vút cao để vào guồng." },
];

export const isPomodoroAlertSoundId = (value: string): value is PomodoroAlertSoundId => POMODORO_ALERT_SOUND_IDS.includes(value as PomodoroAlertSoundId);

function clampVolume(value: number) { return Math.max(0, Math.min(2, value)); }
function tone(context: AudioContext, frequency: number, start: number, duration: number, volume: number, type: OscillatorType = "sine") {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

export function playPomodoroAlert(context: AudioContext, soundId: PomodoroAlertSoundId, masterVolume: number) {
  const start = context.currentTime + 0.02;
  const volume = clampVolume(masterVolume);
  if (volume <= 0) return;
  const base = volume * 0.5;
  const notes = (frequencies: number[], interval: number, duration: number, type: OscillatorType = "sine", multiplier = 1) => frequencies.forEach((frequency, index) => tone(context, frequency, start + index * interval, duration, base * multiplier, type));
  if (soundId === "digital_bell") notes([523.25, 659.25, 783.99], 0.2, 0.65);
  else if (soundId === "loud_alarm") notes([880, 880, 880], 0.28, 0.2, "triangle", 1.25);
  else if (soundId === "marimba") notes([440, 554.37, 659.25, 880], 0.15, 0.38, "sine", 0.85);
  else if (soundId === "school_bell") notes([700, 700], 0.48, 0.9, "sawtooth", 0.62);
  else if (soundId === "crystal_gong") notes([523.25, 1046.5], 0.1, 1.35, "sine", 0.88);
  else if (soundId === "soft_chime") notes([659.25, 880], 0.22, 0.95, "sine", 0.65);
  else if (soundId === "retro_beep") notes([300, 600, 1200], 0.12, 0.16, "square", 0.5);
  else if (soundId === "victory_fanfare") notes([523.25, 659.25, 783.99, 1046.5], 0.18, 0.9, "sine", 0.92);
  else if (soundId === "wood_tap") notes([800, 600], 0.18, 0.16, "triangle", 0.9);
  else notes([400, 700, 1200], 0.13, 0.28, "sine", 1.02);
}
