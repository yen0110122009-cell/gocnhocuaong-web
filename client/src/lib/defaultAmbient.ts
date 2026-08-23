import type { PersonalAudioAsset, PersonalStudyPreset } from "../../../shared/study";
import { LOCAL_AMBIENT_AUDIO, LOCAL_FESTIVE_AUDIO } from "@/lib/audioAssets";

export const DEFAULT_AMBIENT_RAIN_URL = LOCAL_AMBIENT_AUDIO.rain;
export const DEFAULT_AMBIENT_BOOK_PAGES_URL = LOCAL_AMBIENT_AUDIO.bookPages;
export const DEFAULT_AMBIENT_MORNING_URL = LOCAL_AMBIENT_AUDIO.morning;
export const DEFAULT_AMBIENT_STORM_URL = LOCAL_AMBIENT_AUDIO.storm;

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
    url: LOCAL_AMBIENT_AUDIO.bell,
    target: "tet",
    source: "provided",
  },
  space: {
    id: "provided-theme-space",
    name: "Không gian · Ambient vũ trụ",
    description: "Cosmic Sci-Fi Ambient",
    url: LOCAL_AMBIENT_AUDIO.bell,
    target: "space",
    source: "provided",
  },
  rainy_season: { id: "provided-theme-rainy-season", name: "Mưa phủ phàng · Mưa mái tôn", description: "Lofi Chill & heavy rain", url: LOCAL_AMBIENT_AUDIO.rain, target: "rainy_season", source: "provided" },
  stormy_season: { id: "provided-theme-stormy-season", name: "Bão giật · Gió và sấm", description: "Dark Ambient Synth & storm wind", url: LOCAL_AMBIENT_AUDIO.rain, target: "stormy_season", source: "provided" },
  morning_chill: { id: "provided-theme-morning-chill", name: "Nắng ban mai · Chim sớm", description: "Acoustic Guitar & morning birds", url: LOCAL_AMBIENT_AUDIO.morning, target: "morning_chill", source: "provided" },
  coffee: { id: "provided-theme-coffee", name: "Quán Cà Phê · Lofi Jazz", description: "Lofi Jazz & coffee shop rain", url: LOCAL_AMBIENT_AUDIO.bell, target: "coffee", source: "provided" },
  sweet_strawberry: { id: "provided-theme-sweet-strawberry", name: "Nữ sinh Dâu Tây · Music Box", description: "Acoustic Guitar vui tươi & music box", url: LOCAL_FESTIVE_AUDIO["tet-nguyen-dan"], target: "sweet_strawberry", source: "provided" },
  black_ribbon: { id: "provided-theme-black-ribbon", name: "Nữ sinh Cool Girl · Lo-Fi Synth", description: "Lo-Fi Synth trầm & bass sâu", url: LOCAL_AMBIENT_AUDIO.storm, target: "black_ribbon", source: "provided" },
  library_chill: { id: "provided-theme-library-chill", name: "Nữ sinh Thư viện · Library Chill", description: "Mưa ngoài cửa sổ & piano chậm", url: LOCAL_AMBIENT_AUDIO.bookPages, target: "library_chill", source: "provided" },
  after_school: { id: "provided-theme-after-school", name: "Nữ sinh Tan trường · 8-bit", description: "Nhịp phách tươi vui kiểu arcade", url: LOCAL_AMBIENT_AUDIO.morning, target: "after_school", source: "provided" },
  classic_academy: { id: "provided-theme-classic-academy", name: "Nữ sinh Nghệ thuật · Cổ điển", description: "Hòa tấu violin & piano", url: LOCAL_FESTIVE_AUDIO["nha-giao-viet-nam-20-11"], target: "classic_academy", source: "provided" },
  cyber_highschool: { id: "provided-theme-cyber-highschool", name: "Nữ sinh Y2K Cyber · Synthwave", description: "Pop Y2K Synthwave sôi động", url: LOCAL_AMBIENT_AUDIO.bell, target: "cyber_highschool", source: "provided" },
  "spring-blossom": { id: "provided-theme-spring-blossom", name: "Mùa Xuân Thanh Tân", description: "BGM từ tài liệu tham chiếu", url: LOCAL_AMBIENT_AUDIO.morning, target: "spring-blossom", source: "provided" },
  "summer-beach": { id: "provided-theme-summer-beach", name: "Mùa Hạ Biển Xanh & Nắng Vàng", description: "BGM từ tài liệu tham chiếu", url: LOCAL_AMBIENT_AUDIO.rain, target: "summer-beach", source: "provided" },
  "autumn-leave": { id: "provided-theme-autumn-leave", name: "Mùa Thu Lá Vàng Rơi", description: "BGM từ tài liệu tham chiếu", url: LOCAL_AMBIENT_AUDIO.rain, target: "autumn-leave", source: "provided" },
  "winter-snow": { id: "provided-theme-winter-snow", name: "Mùa Đông Tuyết Rơi & Người Tuyết", description: "BGM từ tài liệu tham chiếu", url: LOCAL_AMBIENT_AUDIO.rain, target: "winter-snow", source: "provided" },
  "halloween-spooky": { id: "provided-theme-halloween-spooky", name: "Đêm Hội Halloween", description: "BGM từ tài liệu tham chiếu", url: LOCAL_AMBIENT_AUDIO.rain, target: "halloween-spooky", source: "provided" },
  "lunar-new-year": { id: "provided-theme-lunar-new-year", name: "Tết Cổ Truyền Rực Rỡ", description: "BGM từ tài liệu tham chiếu", url: LOCAL_AMBIENT_AUDIO.bell, target: "lunar-new-year", source: "provided" },
  "thunder-storm": { id: "provided-theme-thunder-storm", name: "Sấm Chớp Bão Bùng", description: "BGM từ tài liệu tham chiếu", url: LOCAL_AMBIENT_AUDIO.rain, target: "thunder-storm", source: "provided" },
  "rainy-day": { id: "provided-theme-rainy-day", name: "Mưa Rào Tình Cảm", description: "BGM từ tài liệu tham chiếu", url: LOCAL_AMBIENT_AUDIO.rain, target: "rainy-day", source: "provided" },
  "sunny-day": { id: "provided-theme-sunny-day", name: "Nắng Nhiệt Đới Rực Rỡ", description: "BGM từ tài liệu tham chiếu", url: LOCAL_AMBIENT_AUDIO.morning, target: "sunny-day", source: "provided" },
  "foggy-morning": { id: "provided-theme-foggy-morning", name: "Sương Mù Mờ Áo", description: "BGM từ tài liệu tham chiếu", url: LOCAL_AMBIENT_AUDIO.rain, target: "foggy-morning", source: "provided" },
  volcano_lava: { id: "provided-theme-volcano-lava", name: "Núi Lửa · Lava & Fire", description: "Âm thanh lava/fire local; link YouTube chỉ là tham chiếu.", url: LOCAL_AMBIENT_AUDIO.storm, target: "volcano_lava", source: "provided", referenceUrl: "https://www.youtube.com/watch?v=Jx5CR-RYJnI" },
  deep_ocean: { id: "provided-theme-deep-ocean", name: "Đại Dương Sâu · Deep Water", description: "Âm nước local; link YouTube chỉ là tham chiếu.", url: LOCAL_AMBIENT_AUDIO.rain, target: "deep_ocean", source: "provided", referenceUrl: "https://www.youtube.com/watch?v=yJg-Y5byMMw" },
  magic_forest: { id: "provided-theme-magic-forest", name: "Rừng Phép Thuật · Lofi Forest", description: "Chuông/ambience local; link YouTube chỉ là tham chiếu.", url: LOCAL_AMBIENT_AUDIO.bell, target: "magic_forest", source: "provided", referenceUrl: "https://www.youtube.com/watch?v=mVnImSxvAV8" },
  space_station: { id: "provided-theme-space-station", name: "Trạm Vũ Trụ · Synthwave", description: "Ambient vũ trụ local; link YouTube chỉ là tham chiếu.", url: LOCAL_AMBIENT_AUDIO.bell, target: "space_station", source: "provided", referenceUrl: "https://www.youtube.com/watch?v=mVnImSxvAV8" },
  flower_field: { id: "provided-theme-flower-field", name: "Cánh Đồng Hoa · Ukulele", description: "Chim hót local; link YouTube chỉ là tham chiếu.", url: LOCAL_AMBIENT_AUDIO.morning, target: "flower_field", source: "provided", referenceUrl: "https://www.youtube.com/watch?v=79yzXoj0EOo" },

  "summer-ocean": { id: "provided-theme-summer-ocean", name: "summer-ocean", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "summer-ocean", source: "provided" },
  "autumn-maple": { id: "provided-theme-autumn-maple", name: "autumn-maple", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "autumn-maple", source: "provided" },
  "tet-vietnam": { id: "provided-theme-tet-vietnam", name: "tet-vietnam", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "tet-vietnam", source: "provided" },
  "halloween-night": { id: "provided-theme-halloween-night", name: "halloween-night", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "halloween-night", source: "provided" },
  "ghost-month": { id: "provided-theme-ghost-month", name: "ghost-month", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "ghost-month", source: "provided" },
  "xmas-holiday": { id: "provided-theme-xmas-holiday", name: "xmas-holiday", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "xmas-holiday", source: "provided" },
  "teachers-day": { id: "provided-theme-teachers-day", name: "teachers-day", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.morning, target: "teachers-day", source: "provided" },
  "vietnam-heroes": { id: "provided-theme-vietnam-heroes", name: "vietnam-heroes", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "vietnam-heroes", source: "provided" },
  "rainy-ripple": { id: "provided-theme-rainy-ripple", name: "rainy-ripple", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "rainy-ripple", source: "provided" },
  "windy-dust": { id: "provided-theme-windy-dust", name: "windy-dust", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "windy-dust", source: "provided" },
  "fire-element": { id: "provided-theme-fire-element", name: "fire-element", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "fire-element", source: "provided" },
  "girly-pastel": { id: "provided-theme-girly-pastel", name: "girly-pastel", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "girly-pastel", source: "provided" },
  "hung-kings-festival": { id: "provided-theme-hung-kings-festival", name: "hung-kings-festival", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "hung-kings-festival", source: "provided" },
  "youth-volunteers": { id: "provided-theme-youth-volunteers", name: "youth-volunteers", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.morning, target: "youth-volunteers", source: "provided" },
  "dien-bien-phu-victory": { id: "provided-theme-dien-bien-phu-victory", name: "dien-bien-phu-victory", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "dien-bien-phu-victory", source: "provided" },
  "liberation-day": { id: "provided-theme-liberation-day", name: "liberation-day", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "liberation-day", source: "provided" },
  "vpa-day": { id: "provided-theme-vpa-day", name: "vpa-day", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "vpa-day", source: "provided" },
  "mid-autumn": { id: "provided-theme-mid-autumn", name: "mid-autumn", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "mid-autumn", source: "provided" },
  "water-element": { id: "provided-theme-water-element", name: "water-element", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "water-element", source: "provided" },
  "air-wind-element": { id: "provided-theme-air-wind-element", name: "air-wind-element", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "air-wind-element", source: "provided" },
  "earth-element": { id: "provided-theme-earth-element", name: "earth-element", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.morning, target: "earth-element", source: "provided" },
  "masculine-cyber": { id: "provided-theme-masculine-cyber", name: "masculine-cyber", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "masculine-cyber", source: "provided" },
  "oriental-wuxia": { id: "provided-theme-oriental-wuxia", name: "oriental-wuxia", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.morning, target: "oriental-wuxia", source: "provided" },
  "mekong-delta": { id: "provided-theme-mekong-delta", name: "mekong-delta", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "mekong-delta", source: "provided" },
  "hanoi-old-quarter": { id: "provided-theme-hanoi-old-quarter", name: "hanoi-old-quarter", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "hanoi-old-quarter", source: "provided" },
  "mini-hologram-cosmos": { id: "provided-theme-mini-hologram-cosmos", name: "mini-hologram-cosmos", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "mini-hologram-cosmos", source: "provided" },
  "aurora-borealis": { id: "provided-theme-aurora-borealis", name: "aurora-borealis", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "aurora-borealis", source: "provided" },
  "arcade-retro": { id: "provided-theme-arcade-retro", name: "arcade-retro", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.bell, target: "arcade-retro", source: "provided" },
  "magic-chess": { id: "provided-theme-magic-chess", name: "magic-chess", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "magic-chess", source: "provided" },
  "lofi-rain-chill": { id: "provided-theme-lofi-rain-chill", name: "lofi-rain-chill", description: "BGM từ pasted_content_7/8/9", url: LOCAL_AMBIENT_AUDIO.rain, target: "lofi-rain-chill", source: "provided" },  "fairy-tale": { id: "provided-theme-fairy-tale", name: "Cổ Tích Xứ Sở Thần Thoại", description: "Chuông cổ tích theo pasted_content_9", url: LOCAL_AMBIENT_AUDIO.bell, target: "fairy-tale", source: "provided" },
} as const;
