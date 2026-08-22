import type { PersonalAudioAsset, PersonalStudyPreset } from "../../../shared/study";

export const DEFAULT_AMBIENT_RAIN_URL = "https://gocnhocuaong-dtezjgqf.manus.space/manus-storage/ambient-rain-default_b45cf4f8.wav";
export const DEFAULT_AMBIENT_BOOK_PAGES_URL = "https://gocnhocuaong-dtezjgqf.manus.space/manus-storage/ambient-book-pages-default_790e9c11.wav";
export const DEFAULT_AMBIENT_MORNING_URL = "https://gocnhocuaong-dtezjgqf.manus.space/manus-storage/ambient-morning-default_f0c64617.mp3";
export const DEFAULT_AMBIENT_STORM_URL = "https://gocnhocuaong-dtezjgqf.manus.space/manus-storage/ambient-storm-default_0cd66680.mp3";

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

export const DEFAULT_POMODORO_AMBIENT_PRESET: PersonalStudyPreset = {
  id: "built-in-pomodoro-morning-storm",
  name: "Pomodoro · Bình minh & Bão nhẹ",
  emotion: "focused",
  ambientScene: "morning",
  audioAssetIds: [DEFAULT_AMBIENT_MORNING_ASSET.id, DEFAULT_AMBIENT_STORM_ASSET.id],
  companionMode: "both",
  focusMode: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

/** Nguồn audio theme do người dùng cung cấp trong tài liệu tham chiếu. */
export const PROVIDED_THEME_AMBIENT_ASSETS = {
  tet: {
    id: "provided-theme-tet",
    name: "Tết · Nhạc truyền thống",
    description: "Traditional Asian Flute & Drums",
    url: "https://actions.google.com/sounds/v1/holidays/lunar_new_year_music.ogg",
    target: "tet",
    source: "provided",
  },
  space: {
    id: "provided-theme-space",
    name: "Không gian · Ambient vũ trụ",
    description: "Cosmic Sci-Fi Ambient",
    url: "https://actions.google.com/sounds/v1/science_fiction/space_synth_pad.ogg",
    target: "space",
    source: "provided",
  },
} as const;
