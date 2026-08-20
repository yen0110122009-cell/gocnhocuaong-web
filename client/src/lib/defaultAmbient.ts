import type { PersonalAudioAsset } from "../../../shared/study";

export const DEFAULT_AMBIENT_RAIN_URL = "/manus-storage/ambient-rain-default_b45cf4f8.wav";

export const DEFAULT_AMBIENT_RAIN_ASSET: PersonalAudioAsset = {
  id: "built-in-ambient-rain-default",
  name: "Mưa dịu mặc định",
  description: "Âm thanh mưa nền mặc định để nghe thử ngay, không lời và có thể lặp.",
  tags: ["environment", "rain", "built-in"],
  url: DEFAULT_AMBIENT_RAIN_URL,
  source: "built_in",
  category: "background",
  target: "rain",
  enabled: true,
  isDefault: true,
  volume: 55,
  durationSeconds: 60,
  sortOrder: -1,
  group: "Âm thanh mặc định",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  healthStatus: "unknown",
};

export const DEFAULT_AMBIENT_ASSET = DEFAULT_AMBIENT_RAIN_ASSET;
export const DEFAULT_AMBIENT_ASSETS = [DEFAULT_AMBIENT_RAIN_ASSET] as const;
