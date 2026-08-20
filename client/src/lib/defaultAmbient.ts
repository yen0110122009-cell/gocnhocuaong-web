import type { PersonalAudioAsset } from "../../../shared/study";

export const DEFAULT_AMBIENT_RAIN_URL = "https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/manus-storage/ambient-rain-default_b45cf4f8.wav";
export const DEFAULT_AMBIENT_BOOK_PAGES_URL = "https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/manus-storage/ambient-book-pages-default_790e9c11.wav";

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
  sortOrder: -2,
  group: "Âm thanh mặc định",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  healthStatus: "unknown",
};

export const DEFAULT_AMBIENT_BOOK_PAGES_ASSET: PersonalAudioAsset = {
  id: "built-in-ambient-book-pages-default",
  name: "Lật sách dịu nhẹ",
  description: "Hiệu ứng lật trang sách thưa, không lời, phù hợp làm âm nền học tập.",
  tags: ["environment", "book", "reading", "built-in"],
  url: DEFAULT_AMBIENT_BOOK_PAGES_URL,
  source: "built_in",
  category: "background",
  target: "general",
  enabled: true,
  isDefault: true,
  volume: 42,
  durationSeconds: 45,
  sortOrder: -1,
  group: "Âm thanh mặc định",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  healthStatus: "unknown",
};

export const DEFAULT_AMBIENT_ASSET = DEFAULT_AMBIENT_RAIN_ASSET;
export const DEFAULT_AMBIENT_ASSETS = [DEFAULT_AMBIENT_RAIN_ASSET, DEFAULT_AMBIENT_BOOK_PAGES_ASSET] as const;
