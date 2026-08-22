declare global { interface Window { webkitAudioContext?: typeof AudioContext; } }

export type SoundEvent = "start" | "breakStart" | "breakEnd" | "tick" | "complete" | "warning" | "reward" | "error";

export const SOUND_EVENTS: Record<SoundEvent, number[]> = {
  start: [262, 330, 392],
  breakStart: [392, 523, 659],
  breakEnd: [659, 523, 392],
  tick: [880],
  complete: [659, 880, 1047, 880, 1319, 1568, 1319, 1760],
  warning: [494, 392, 330],
  reward: [784, 988, 1175, 1568],
  error: [220, 165],
};

/** The completion alert is intentionally a longer, rising multi-note phrase. */
export const COMPLETE_ALERT_PROFILE = {
  gainMultiplier: 0.58,
  spacingSeconds: 0.16,
  durationSeconds: 0.56,
  oscillator: "triangle" as OscillatorType,
  vibratePattern: [220, 80, 220, 80, 420],
};

export function soundEventGainMultiplier(event: SoundEvent) {
  if (event === "tick") return 0.055;
  if (event === "breakStart" || event === "breakEnd") return 0.24;
  if (event === "complete") return COMPLETE_ALERT_PROFILE.gainMultiplier;
  return 0.2;
}

export function soundEventSpacing(event: SoundEvent) {
  if (event === "tick") return 0.04;
  if (event === "breakStart" || event === "breakEnd") return 0.1;
  if (event === "complete") return COMPLETE_ALERT_PROFILE.spacingSeconds;
  return 0.12;
}

/** Legacy one-choice notes retained for old preferences and regression contracts. */
export const SOUNDSCAPE_NOTES: Record<string, number[]> = {
  "Mưa": [196, 233, 294, 349],
  "Mưa nhẹ": [262, 330, 392, 494],
  "Rừng": [196, 247, 330, 440],
  "Thư viện": [220, 277, 330, 415],
  "White noise": [330, 440, 554, 659],
  "Brown noise": [110, 147, 196, 247],
};

export type SoundscapeCategory = "Thiên nhiên" | "Không gian" | "Thư giãn" | "Tập trung";
export type SoundscapeLayer = {
  id: string;
  label: string;
  category: SoundscapeCategory;
  notes: number[];
  waveform: OscillatorType;
  intervalMs: number;
  detune: number;
  baseVolume: number;
};

const layer = (id: string, label: string, category: SoundscapeCategory, notes: number[], waveform: OscillatorType, intervalMs: number, detune: number, baseVolume: number): SoundscapeLayer => ({ id, label, category, notes, waveform, intervalMs, detune, baseVolume });

export const SOUNDSCAPE_LAYERS: Record<string, SoundscapeLayer> = {
  rainLight: layer("rainLight", "Mưa nhẹ", "Thiên nhiên", [196, 233, 294, 349], "triangle", 680, -5, 0.9),
  rainHeavy: layer("rainHeavy", "Mưa lớn", "Thiên nhiên", [147, 196, 233, 294], "sawtooth", 420, 4, 0.62),
  distantThunder: layer("distantThunder", "Sấm xa", "Thiên nhiên", [73, 82, 98], "sine", 3600, -9, 0.3),
  forest: layer("forest", "Rừng", "Thiên nhiên", [196, 247, 330, 440], "triangle", 760, 8, 0.72),
  wind: layer("wind", "Gió", "Thiên nhiên", [174, 220, 277, 349], "sine", 1100, -12, 0.46),
  sea: layer("sea", "Biển", "Thiên nhiên", [110, 147, 196, 247], "sine", 1450, 5, 0.7),
  stream: layer("stream", "Suối", "Thiên nhiên", [262, 330, 392, 523], "triangle", 380, 11, 0.45),
  cafe: layer("cafe", "Quán cà phê", "Không gian", [147, 185, 220, 277], "sine", 920, -6, 0.35),
  library: layer("library", "Thư viện", "Không gian", [220, 277, 330, 415], "sine", 1250, 0, 0.52),
  classroom: layer("classroom", "Phòng học", "Không gian", [196, 247, 294, 392], "triangle", 980, 3, 0.38),
  pencil: layer("pencil", "Tiếng bút", "Không gian", [523, 659, 784], "square", 1900, -18, 0.18),
  pages: layer("pages", "Lật sách", "Không gian", [330, 392, 494], "triangle", 2400, 14, 0.16),
  keyboard: layer("keyboard", "Bàn phím", "Không gian", [196, 262, 330], "square", 780, -14, 0.14),
  piano: layer("piano", "Piano nhẹ", "Thư giãn", [262, 330, 392, 523, 659], "sine", 1450, 0, 0.42),
  ambient: layer("ambient", "Ambient", "Thư giãn", [110, 147, 220, 294], "sine", 2100, 7, 0.36),
  lofi: layer("lofi", "Lo-fi", "Thư giãn", [196, 247, 294, 392], "triangle", 860, -4, 0.3),
  night: layer("night", "Đêm yên", "Thư giãn", [98, 147, 196, 247], "sine", 2600, -8, 0.4),
  white: layer("white", "White noise", "Tập trung", [330, 440, 554, 659, 880], "sawtooth", 180, 0, 0.18),
  brown: layer("brown", "Brown noise", "Tập trung", [55, 73, 98, 110, 147], "sine", 240, 0, 0.5),
  deepFocus: layer("deepFocus", "Deep focus", "Tập trung", [110, 165, 220, 330], "triangle", 1750, 0, 0.34),
  ticking: layer("ticking", "Ticking nhẹ", "Tập trung", [440, 880], "square", 1000, -3, 0.1),
};

export const SOUNDSCAPE_PRESETS: Record<string, { label: string; description: string; layers: string[] }> = {
  "Mưa": { label: "Mưa trong rừng", description: "Mưa nhẹ, rừng và gió xa.", layers: ["rainLight", "forest", "wind"] },
  "Mưa nhẹ": { label: "Mưa nhẹ", description: "Một lớp mưa êm cho phiên đầu tiên.", layers: ["rainLight"] },
  "Mưa giông": { label: "Mưa giông", description: "Mưa lớn, gió và tiếng sấm xa cho những phiên cần tách khỏi ồn ào.", layers: ["rainHeavy", "wind", "distantThunder"] },
  "Rừng": { label: "Rừng xanh", description: "Rừng, suối và gió chuyển động chậm.", layers: ["forest", "stream", "wind"] },
  "Thư viện": { label: "Thư viện yên", description: "Không gian thư viện với tiếng lật sách rất nhẹ.", layers: ["library", "pages"] },
  "Không gian quán cà phê": { label: "Quán cà phê", description: "Nền ấm, piano thưa và nhịp quán nhẹ.", layers: ["cafe", "piano"] },
  "Biển đêm": { label: "Biển đêm", description: "Sóng nền trầm, ambient và gió biển.", layers: ["sea", "ambient", "wind"] },
  "Phòng học": { label: "Phòng học", description: "Phòng học, bút và bàn phím rất tiết chế.", layers: ["classroom", "pencil", "keyboard"] },
  "Đêm ambient": { label: "Đêm ambient", description: "Một lớp đêm yên cho học sâu.", layers: ["night", "ambient", "deepFocus"] },
  "Sáng trong": { label: "Sáng trong", description: "Rừng nhẹ, suối và lớp âm sáng để mở đầu ngày học.", layers: ["forest", "stream", "piano"] },
  "Bình minh & Bão nhẹ": { label: "Bình minh & Bão nhẹ", description: "Phối hai bản thu thật Buổi sáng và Bão nhẹ; có thể chỉnh tỷ lệ riêng.", layers: [] },
  "Deep focus": { label: "Deep focus", description: "Brown noise, deep focus và ticking nhẹ.", layers: ["brown", "deepFocus", "ticking"] },
  "White noise": { label: "White noise", description: "Nền đều, ít giai điệu, che tiếng ồn.", layers: ["white"] },
  "Brown noise": { label: "Brown noise", description: "Nền trầm ổn định cho người dễ phân tâm.", layers: ["brown"] },
  "Không âm thanh": { label: "Không âm thanh", description: "Tắt toàn bộ soundscape.", layers: [] },
};

export function scaledGain(volume: number, multiplier: number) {
  return Math.min(1, Math.max(0, volume / 100)) * multiplier;
}

/** Applies an individual mixer slider to a layer's nominal gain. */
export function scaledLayerGain(volume: number, baseVolume: number) {
  return scaledGain(volume, Math.max(0, baseVolume * 1.25));
}

export function soundEventDuration(event: SoundEvent) {
  if (event === "complete") return COMPLETE_ALERT_PROFILE.durationSeconds;
  return event === "tick" ? 0.12 : 0.34;
}

export async function playSoundEvent(event: SoundEvent, volume = 100) {
  if (typeof window === "undefined") return false;
  try {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return false;
    const context = new Ctor();
    if (context.state !== "running") await context.resume();
    if (context.state !== "running") return false;
    const master = context.createGain(); master.gain.value = scaledGain(volume, soundEventGainMultiplier(event)); master.connect(context.destination);
    SOUND_EVENTS[event].forEach((frequency, index) => {
      const oscillator = context.createOscillator(); const gain = context.createGain(); const startAt = context.currentTime + index * soundEventSpacing(event);
      oscillator.type = event === "complete" ? "triangle" : "sine"; oscillator.frequency.setValueAtTime(frequency, startAt); gain.gain.setValueAtTime(0.001, startAt); gain.gain.exponentialRampToValueAtTime(1, startAt + 0.025); gain.gain.exponentialRampToValueAtTime(0.001, startAt + soundEventDuration(event)); oscillator.connect(gain).connect(master); oscillator.start(startAt); oscillator.stop(startAt + soundEventDuration(event) + 0.03);
    });
    window.setTimeout(() => { void context.close(); }, 1400); return true;
  } catch { return false; }
}
