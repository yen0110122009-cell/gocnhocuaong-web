export type SoundEvent = "start" | "tick" | "complete" | "warning" | "reward" | "error";

export const SOUND_EVENTS: Record<SoundEvent, number[]> = {
  start: [262, 330, 392],
  tick: [880],
  complete: [659, 880, 1047, 880, 1319, 1568, 1319, 1760],
  warning: [494, 392, 330],
  reward: [784, 988, 1175, 1568],
  error: [220, 165],
};

/** The completion alert is intentionally a longer, rising multi-note phrase. */
export const COMPLETE_ALERT_PROFILE = {
  gainMultiplier: 0.2,
  spacingSeconds: 0.18,
  durationSeconds: 0.44,
  oscillator: "triangle" as OscillatorType,
  vibratePattern: [180, 90, 180, 90, 320],
};

export function soundEventGainMultiplier(event: SoundEvent) {
  if (event === "tick") return 0.055;
  if (event === "complete") return COMPLETE_ALERT_PROFILE.gainMultiplier;
  return 0.13;
}

export function soundEventSpacing(event: SoundEvent) {
  if (event === "tick") return 0.04;
  if (event === "complete") return COMPLETE_ALERT_PROFILE.spacingSeconds;
  return 0.12;
}

export const SOUNDSCAPE_NOTES: Record<string, number[]> = {
  "Mưa": [196, 233, 294, 349],
  "Mưa nhẹ": [262, 330, 392, 494],
  "Rừng": [196, 247, 330, 440],
  "Thư viện": [220, 277, 330, 415],
  "White noise": [330, 440, 554, 659],
  "Brown noise": [110, 147, 196, 247],
};

export function scaledGain(volume: number, multiplier: number) {
  return Math.min(1, Math.max(0, volume / 100)) * multiplier;
}

export function soundEventDuration(event: SoundEvent) {
  if (event === "complete") return COMPLETE_ALERT_PROFILE.durationSeconds;
  return event === "tick" ? 0.12 : 0.34;
}
