import type { PersonalAudioAsset } from "../../../shared/study";

export const DEFAULT_AMBIENT_RAIN_URL = "https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/manus-storage/ambient-rain-default_b45cf4f8.wav";
export const DEFAULT_AMBIENT_BOOK_PAGES_URL = "https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/manus-storage/ambient-book-pages-default_790e9c11.wav";
export const DEFAULT_AMBIENT_MORNING_URL = "https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/manus-storage/ambient-morning-default_f0c64617.mp3";
export const DEFAULT_AMBIENT_STORM_URL = "https://3000-ilh4bqp66udbw8fyp31nf-3b48ee0a.us3.manus.computer/manus-storage/ambient-storm-default_0cd66680.mp3";

const builtInDefaults = {
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "built_in" as const,
  category: "background" as const,
  enabled: true,
  isDefault: true,
  healthStatus: "unknown" as const,
};

export const DEFAULT_AMBIENT_RAIN_ASSET: PersonalAudioAsset = {
  ...builtInDefaults,
  id: "built-in-ambient-rain-default",
  name: "Mưa dịu mặc định",
  description: "Âm thanh mưa nền mặc định để nghe thử ngay, không lời và có thể lặp.",
  tags: ["environment", "rain", "built-in"],
  url: DEFAULT_AMBIENT_RAIN_URL,
  target: "rain",
  volume: 55,
  durationSeconds: 60,
  sortOrder: -4,
  group: "Âm thanh mặc định",
};

export const DEFAULT_AMBIENT_BOOK_PAGES_ASSET: PersonalAudioAsset = {
  ...builtInDefaults,
  id: "built-in-ambient-book-pages-default",
  name: "Lật sách dịu nhẹ",
  description: "Hiệu ứng lật trang sách thưa, không lời, phù hợp làm âm nền học tập.",
  tags: ["environment", "book", "reading", "built-in"],
  url: DEFAULT_AMBIENT_BOOK_PAGES_URL,
  target: "book",
  volume: 42,
  durationSeconds: 45,
  sortOrder: -3,
  group: "Âm thanh mặc định",
};

export const DEFAULT_AMBIENT_MORNING_ASSET: PersonalAudioAsset = {
  ...builtInDefaults,
  id: "built-in-ambient-morning-default",
  name: "Buổi sáng",
  description: "Chim hót xa và làn gió nhẹ, tạo không gian sáng dịu để bắt đầu học.",
  tags: ["environment", "morning", "birds", "wind", "built-in"],
  url: DEFAULT_AMBIENT_MORNING_URL,
  target: "morning",
  volume: 38,
  durationSeconds: 90,
  sortOrder: -2,
  group: "Âm thanh mặc định",
};

export const DEFAULT_AMBIENT_STORM_ASSET: PersonalAudioAsset = {
  ...builtInDefaults,
  id: "built-in-ambient-storm-default",
  name: "Bão nhẹ",
  description: "Mưa đều và tiếng sấm xa dịu, không có âm thanh đột ngột gây giật mình.",
  tags: ["environment", "storm", "rain", "thunder", "built-in"],
  url: DEFAULT_AMBIENT_STORM_URL,
  target: "storm",
  volume: 34,
  durationSeconds: 90,
  sortOrder: -1,
  group: "Âm thanh mặc định",
};

export const DEFAULT_AMBIENT_ASSET = DEFAULT_AMBIENT_RAIN_ASSET;
export const DEFAULT_AMBIENT_ASSETS = [
  DEFAULT_AMBIENT_RAIN_ASSET,
  DEFAULT_AMBIENT_BOOK_PAGES_ASSET,
  DEFAULT_AMBIENT_MORNING_ASSET,
  DEFAULT_AMBIENT_STORM_ASSET,
] as const;
