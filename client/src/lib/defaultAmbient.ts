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
  rainy_season: { id: "provided-theme-rainy-season", name: "Mưa phủ phàng · Mưa mái tôn", description: "Lofi Chill & heavy rain", url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg", target: "rainy_season", source: "provided" },
  stormy_season: { id: "provided-theme-stormy-season", name: "Bão giật · Gió và sấm", description: "Dark Ambient Synth & storm wind", url: "https://actions.google.com/sounds/v1/weather/heavy_wind_storm.ogg", target: "stormy_season", source: "provided" },
  morning_chill: { id: "provided-theme-morning-chill", name: "Nắng ban mai · Chim sớm", description: "Acoustic Guitar & morning birds", url: "https://actions.google.com/sounds/v1/nature/morning_birds_acoustic.ogg", target: "morning_chill", source: "provided" },
  coffee: { id: "provided-theme-coffee", name: "Quán Cà Phê · Lofi Jazz", description: "Lofi Jazz & coffee shop rain", url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg", target: "coffee", source: "provided" },
  sweet_strawberry: { id: "provided-theme-sweet-strawberry", name: "Nữ sinh Dâu Tây · Music Box", description: "Acoustic Guitar vui tươi & music box", url: "https://actions.google.com/sounds/v1/music/upbeat_playful_acoustic.ogg", target: "sweet_strawberry", source: "provided" },
  black_ribbon: { id: "provided-theme-black-ribbon", name: "Nữ sinh Cool Girl · Lo-Fi Synth", description: "Lo-Fi Synth trầm & bass sâu", url: "https://actions.google.com/sounds/v1/science_fiction/scifi_synth_hum.ogg", target: "black_ribbon", source: "provided" },
  library_chill: { id: "provided-theme-library-chill", name: "Nữ sinh Thư viện · Library Chill", description: "Mưa ngoài cửa sổ & piano chậm", url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg", target: "library_chill", source: "provided" },
  after_school: { id: "provided-theme-after-school", name: "Nữ sinh Tan trường · 8-bit", description: "Nhịp phách tươi vui kiểu arcade", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "after_school", source: "provided" },
  classic_academy: { id: "provided-theme-classic-academy", name: "Nữ sinh Nghệ thuật · Cổ điển", description: "Hòa tấu violin & piano", url: "https://actions.google.com/sounds/v1/music/guzheng_flute_chill.ogg", target: "classic_academy", source: "provided" },
  cyber_highschool: { id: "provided-theme-cyber-highschool", name: "Nữ sinh Y2K Cyber · Synthwave", description: "Pop Y2K Synthwave sôi động", url: "https://actions.google.com/sounds/v1/science_fiction/scifi_synth_hum.ogg", target: "cyber_highschool", source: "provided" },
  "spring-blossom": { id: "provided-theme-spring-blossom", name: "Mùa Xuân Thanh Tân", description: "BGM từ tài liệu tham chiếu", url: "https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg", target: "spring-blossom", source: "provided" },
  "summer-beach": { id: "provided-theme-summer-beach", name: "Mùa Hạ Biển Xanh & Nắng Vàng", description: "BGM từ tài liệu tham chiếu", url: "https://actions.google.com/sounds/v1/water/ocean_waves.ogg", target: "summer-beach", source: "provided" },
  "autumn-leave": { id: "provided-theme-autumn-leave", name: "Mùa Thu Lá Vàng Rơi", description: "BGM từ tài liệu tham chiếu", url: "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg", target: "autumn-leave", source: "provided" },
  "winter-snow": { id: "provided-theme-winter-snow", name: "Mùa Đông Tuyết Rơi & Người Tuyết", description: "BGM từ tài liệu tham chiếu", url: "https://actions.google.com/sounds/v1/ambiences/winter_wind.ogg", target: "winter-snow", source: "provided" },
  "halloween-spooky": { id: "provided-theme-halloween-spooky", name: "Đêm Hội Halloween", description: "BGM từ tài liệu tham chiếu", url: "https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg", target: "halloween-spooky", source: "provided" },
  "lunar-new-year": { id: "provided-theme-lunar-new-year", name: "Tết Cổ Truyền Rực Rỡ", description: "BGM từ tài liệu tham chiếu", url: "https://actions.google.com/sounds/v1/festivals/fireworks_distant.ogg", target: "lunar-new-year", source: "provided" },
  "thunder-storm": { id: "provided-theme-thunder-storm", name: "Sấm Chớp Bão Bùng", description: "BGM từ tài liệu tham chiếu", url: "https://actions.google.com/sounds/v1/weather/thunderclap.ogg", target: "thunder-storm", source: "provided" },
  "rainy-day": { id: "provided-theme-rainy-day", name: "Mưa Rào Tình Cảm", description: "BGM từ tài liệu tham chiếu", url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg", target: "rainy-day", source: "provided" },
  "sunny-day": { id: "provided-theme-sunny-day", name: "Nắng Nhiệt Đới Rực Rỡ", description: "BGM từ tài liệu tham chiếu", url: "https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg", target: "sunny-day", source: "provided" },
  "foggy-morning": { id: "provided-theme-foggy-morning", name: "Sương Mù Mờ Áo", description: "BGM từ tài liệu tham chiếu", url: "https://actions.google.com/sounds/v1/ambiences/foghorn_distant.ogg", target: "foggy-morning", source: "provided" },

  "summer-ocean": { id: "provided-theme-summer-ocean", name: "summer-ocean", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/water/ocean_waves.ogg", target: "summer-ocean", source: "provided" },
  "autumn-maple": { id: "provided-theme-autumn-maple", name: "autumn-maple", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg", target: "autumn-maple", source: "provided" },
  "tet-vietnam": { id: "provided-theme-tet-vietnam", name: "tet-vietnam", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "tet-vietnam", source: "provided" },
  "halloween-night": { id: "provided-theme-halloween-night", name: "halloween-night", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg", target: "halloween-night", source: "provided" },
  "ghost-month": { id: "provided-theme-ghost-month", name: "ghost-month", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg", target: "ghost-month", source: "provided" },
  "xmas-holiday": { id: "provided-theme-xmas-holiday", name: "xmas-holiday", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "xmas-holiday", source: "provided" },
  "teachers-day": { id: "provided-theme-teachers-day", name: "teachers-day", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg", target: "teachers-day", source: "provided" },
  "vietnam-heroes": { id: "provided-theme-vietnam-heroes", name: "vietnam-heroes", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "vietnam-heroes", source: "provided" },
  "rainy-ripple": { id: "provided-theme-rainy-ripple", name: "rainy-ripple", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg", target: "rainy-ripple", source: "provided" },
  "windy-dust": { id: "provided-theme-windy-dust", name: "windy-dust", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg", target: "windy-dust", source: "provided" },
  "fire-element": { id: "provided-theme-fire-element", name: "fire-element", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg", target: "fire-element", source: "provided" },
  "girly-pastel": { id: "provided-theme-girly-pastel", name: "girly-pastel", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "girly-pastel", source: "provided" },
  "hung-kings-festival": { id: "provided-theme-hung-kings-festival", name: "hung-kings-festival", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "hung-kings-festival", source: "provided" },
  "youth-volunteers": { id: "provided-theme-youth-volunteers", name: "youth-volunteers", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg", target: "youth-volunteers", source: "provided" },
  "dien-bien-phu-victory": { id: "provided-theme-dien-bien-phu-victory", name: "dien-bien-phu-victory", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "dien-bien-phu-victory", source: "provided" },
  "liberation-day": { id: "provided-theme-liberation-day", name: "liberation-day", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "liberation-day", source: "provided" },
  "vpa-day": { id: "provided-theme-vpa-day", name: "vpa-day", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg", target: "vpa-day", source: "provided" },
  "mid-autumn": { id: "provided-theme-mid-autumn", name: "mid-autumn", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "mid-autumn", source: "provided" },
  "water-element": { id: "provided-theme-water-element", name: "water-element", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/water/ocean_waves.ogg", target: "water-element", source: "provided" },
  "air-wind-element": { id: "provided-theme-air-wind-element", name: "air-wind-element", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg", target: "air-wind-element", source: "provided" },
  "earth-element": { id: "provided-theme-earth-element", name: "earth-element", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg", target: "earth-element", source: "provided" },
  "masculine-cyber": { id: "provided-theme-masculine-cyber", name: "masculine-cyber", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/scifi_synth_hum.ogg", target: "masculine-cyber", source: "provided" },
  "oriental-wuxia": { id: "provided-theme-oriental-wuxia", name: "oriental-wuxia", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/outdoor_birds_cicadas.ogg", target: "oriental-wuxia", source: "provided" },
  "mekong-delta": { id: "provided-theme-mekong-delta", name: "mekong-delta", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/water/ocean_waves.ogg", target: "mekong-delta", source: "provided" },
  "hanoi-old-quarter": { id: "provided-theme-hanoi-old-quarter", name: "hanoi-old-quarter", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg", target: "hanoi-old-quarter", source: "provided" },
  "mini-hologram-cosmos": { id: "provided-theme-mini-hologram-cosmos", name: "mini-hologram-cosmos", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/scifi_synth_hum.ogg", target: "mini-hologram-cosmos", source: "provided" },
  "aurora-borealis": { id: "provided-theme-aurora-borealis", name: "aurora-borealis", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg", target: "aurora-borealis", source: "provided" },
  "arcade-retro": { id: "provided-theme-arcade-retro", name: "arcade-retro", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "arcade-retro", source: "provided" },
  "magic-chess": { id: "provided-theme-magic-chess", name: "magic-chess", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/human_voices/spooky_ghost_wind.ogg", target: "magic-chess", source: "provided" },
  "lofi-rain-chill": { id: "provided-theme-lofi-rain-chill", name: "lofi-rain-chill", description: "BGM từ pasted_content_7/8/9", url: "https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg", target: "lofi-rain-chill", source: "provided" },  "fairy-tale": { id: "provided-theme-fairy-tale", name: "Cổ Tích Xứ Sở Thần Thoại", description: "Chuông cổ tích theo pasted_content_9", url: "https://actions.google.com/sounds/v1/science_fiction/8bit_arcade.ogg", target: "fairy-tale", source: "provided" },
} as const;
