export type SoundEvent = "start" | "tick" | "complete" | "warning" | "reward" | "error";

export const SOUND_EVENTS: Record<SoundEvent, number[]> = {
  start: [262, 330, 392],
  tick: [880],
  complete: [523, 659, 784, 1047],
  warning: [494, 392, 330],
  reward: [784, 988, 1175, 1568],
  error: [220, 165],
};

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
  return event === "tick" ? 0.12 : 0.34;
}
