import { LOCAL_AMBIENT_AUDIO } from "@/lib/audioAssets";

export type FestiveAnimation = "sine-wave" | "bounce" | "float" | "circular";

export type FestiveClickEffect = "scale-bounce" | "shake" | "particle-burst" | "ripple-wave" | "pulse-glow";

export interface FestiveEffectConfig {
  type: FestiveClickEffect;
  intensity: number;
  durationMs: number;
}

/** Hạt trang trí thuần emoji; renderer luôn đặt lớp này dưới nội dung và không nhận pointer events. */
export type FestiveAmbientMotion = "fall" | "rise" | "drift" | "glow" | "diagonal" | "bounce" | "rest";
export interface FestiveAmbientDecoration {
  emoji: string;
  motion: FestiveAmbientMotion;
  count: number;
  size: string;
}

export interface FestiveThemeConfig {
  id: string;
  displayName: string;
  audioDescription: string;
  colors: { light: { bg: string; primary: string; accent: string }; dark: { bg: string; primary: string; accent: string } };
  bgm: { url: string; volume: number; loop: boolean };
  mascot: { emoji: string; size: string; initialPosition: { top: string; left: string }; zIndex: number; draggable: boolean; animation?: FestiveAnimation; clickEffect?: FestiveEffectConfig };
  groundContainer: { height: string; bottom: string; zIndex: number; rippleEffect?: boolean; items: Array<{ emoji: string; size: string; density: number; draggable: boolean; clickEffect?: FestiveEffectConfig }> };
}

const arcade = LOCAL_AMBIENT_AUDIO.bell;
const birds = LOCAL_AMBIENT_AUDIO.morning;
const wind = LOCAL_AMBIENT_AUDIO.rain;

/** Registry âm thanh local tự host, thay các host ngoài không ổn định. */
export const USER_PROVIDED_FESTIVE_AUDIO: Record<string, string> = {
  "tet-nguyen-dan": LOCAL_AMBIENT_AUDIO.bell,
  "gio-to-hung-vuong": LOCAL_AMBIENT_AUDIO.bell,
  "ngay-thanh-nien-26-3": LOCAL_AMBIENT_AUDIO.morning,
  "giai-phong-30-4": LOCAL_AMBIENT_AUDIO.bell,
  "thuong-binh-liet-si-27-7": LOCAL_AMBIENT_AUDIO.rain,
  "cach-mang-19-8": LOCAL_AMBIENT_AUDIO.bell,
  "quoc-khanh-2-9": LOCAL_AMBIENT_AUDIO.bell,
  "tet-trung-thu": LOCAL_AMBIENT_AUDIO.bell,
  "nha-giao-viet-nam-20-11": LOCAL_AMBIENT_AUDIO.bookPages,
  "quoc-te-phu-nu-8-3": LOCAL_AMBIENT_AUDIO.bell,
  "tet-doan-ngo-5-5": LOCAL_AMBIENT_AUDIO.morning,
  "vu-lan-bao-hieu": LOCAL_AMBIENT_AUDIO.bell,
  "phu-nu-viet-nam-20-10": LOCAL_AMBIENT_AUDIO.bookPages,
  "quan-doi-nhan-dan-22-12": LOCAL_AMBIENT_AUDIO.rain,
};
const item = (emoji: string, size: string, density: number, clickEffect?: FestiveEffectConfig) => ({ emoji, size, density, draggable: true, clickEffect });

/** Mô tả tone do Ong cung cấp; URL audio được giữ trong registry local bên trên. */
export const FESTIVE_THEME_AUDIO_DESCRIPTIONS: Record<string, string> = {
  "tet-nguyen-dan": "Âm rộn ràng nhẹ nhàng của tiếng đàn tranh, hòa cùng tiếng pháo hoa xa và tiếng chuông gió đầu xuân.",
  "gio-to-hung-vuong": "Tiếng trống đồng âm vang trầm hùng kết hợp tiếng sáo trúc thanh tịnh không gian núi rừng.",
  "ngay-thanh-nien-26-3": "Tiếng Guitar Acoustic trẻ trung, nhịp điệu tươi sáng truyền cảm hứng học tập và cống hiến.",
  "giai-phong-30-4": "Giai điệu khải hoàn ca không lời du dương, xen lẫn tiếng kèn đồng nhẹ nhàng tạo khí thế tự hào.",
  "thuong-binh-liet-si-27-7": "Tiếng mưa rơi dịu êm kết hợp tiếng chuông gió tĩnh lặng, mang không khí tri ân và lắng đọng.",
  "cach-mang-19-8": "Nhịp trống hội hào hùng dồn dập nhẹ, tạo năng lượng tập trung cao độ và quyết tâm.",
  "quoc-khanh-2-9": "Tiếng đàn bầu truyền thống kết hợp giai điệu quê hương thanh bình, tạo không gian trang trọng.",
  "tet-trung-thu": "Tiếng dế đêm thu rả rích kết hợp tiếng trống tùng-rinh nhẹ xa xa và giai điệu múa lân vui tươi.",
  "nha-giao-viet-nam-20-11": "Tiếng đàn Piano du dương, sâu lắng gợi nhớ ký ức mái trường và không gian học tập bình yên.",
  "quoc-te-phu-nu-8-3": "Âm nhạc Lofi Chill ngọt ngào kết hợp tiếng mưa xuân lất phất dịu dàng.",
  "tet-doan-ngo-5-5": "Tiếng chim hót líu lo rộn rã trên cành cây hòa cùng không khí rực rỡ của ngày hè.",
  "vu-lan-bao-hieu": "Tiếng chuông xoay Nepal tĩnh tâm kết hợp tiếng nước chảy suối ngàn, mang lại sự thư thái.",
  "phu-nu-viet-nam-20-10": "Bản tấu Piano ngọt ngào kết hợp tiếng Violin nhẹ nhàng, êm ái.",
  "quan-doi-nhan-dan-22-12": "Tiếng bước chân hành quân xa hòa cùng tiếng gió rừng trút lá trầm ấm, kiên cường.",
};

const FESTIVE_THEME_CONFIG_DATA: Array<Omit<FestiveThemeConfig, "audioDescription">> = [
  { id: "tet-nguyen-dan", displayName: "Tết Nguyên Đán 🧧", colors: { light: { bg: "#FFFBEB", primary: "#991B1B", accent: "#D97706" }, dark: { bg: "#2A0808", primary: "#FACC15", accent: "#EF4444" } }, bgm: { url: arcade, volume: .35, loop: true }, mascot: { emoji: "🦁", size: "95px", initialPosition: { top: "20%", left: "45%" }, zIndex: 100, draggable: true, animation: "bounce", clickEffect: { type: "scale-bounce", intensity: 1.3, durationMs: 350 } }, groundContainer: { height: "60px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("🧧", "28px", .6, { type: "shake", intensity: 1.15, durationMs: 300 }), item("🌸", "24px", .4, { type: "particle-burst", intensity: 1.2, durationMs: 450 })] } },
  { id: "gio-to-hung-vuong", displayName: "Giỗ Tổ Hùng Vương 👑", colors: { light: { bg: "#FEF3C7", primary: "#78350F", accent: "#B45309" }, dark: { bg: "#1C1917", primary: "#F59E0B", accent: "#FCD34D" } }, bgm: { url: arcade, volume: .35, loop: true }, mascot: { emoji: "🦅", size: "95px", initialPosition: { top: "15%", left: "40%" }, zIndex: 100, draggable: true, animation: "sine-wave", clickEffect: { type: "pulse-glow", intensity: 1.25, durationMs: 400 } }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, rippleEffect: true, items: [item("🪷", "26px", .5, { type: "ripple-wave", intensity: 1.2, durationMs: 500 }), item("🪵", "24px", .5, { type: "scale-bounce", intensity: 1.1, durationMs: 250 })] } },
  { id: "ngay-thanh-nien-26-3", displayName: "Ngày Thành Lập Đoàn 26/3 💙", colors: { light: { bg: "#EFF6FF", primary: "#1D4ED8", accent: "#2563EB" }, dark: { bg: "#0B132B", primary: "#60A5FA", accent: "#93C5FD" } }, bgm: { url: birds, volume: .35, loop: true }, mascot: { emoji: "⭐", size: "85px", initialPosition: { top: "25%", left: "48%" }, zIndex: 100, draggable: true }, groundContainer: { height: "50px", bottom: "0px", zIndex: 50, items: [item("🌿", "22px", .7), item("📘", "22px", .3)] } },
  { id: "giai-phong-30-4", displayName: "Giải Phóng Miền Nam 30/4 🪖", colors: { light: { bg: "#FEF2F2", primary: "#B91C1C", accent: "#DC2626" }, dark: { bg: "#2A0808", primary: "#FACC15", accent: "#F87171" } }, bgm: { url: arcade, volume: .35, loop: true }, mascot: { emoji: "🕊️", size: "90px", initialPosition: { top: "20%", left: "42%" }, zIndex: 100, draggable: true }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, items: [item("🎉", "24px", .5), item("🎈", "24px", .5)] } },
  { id: "thuong-binh-liet-si-27-7", displayName: "Ngày Thương Binh Liệt Sĩ 27/7 🕯️", colors: { light: { bg: "#F5F5F4", primary: "#57534E", accent: "#D97706" }, dark: { bg: "#1C1917", primary: "#FBBF24", accent: "#A8A29E" } }, bgm: { url: wind, volume: .30, loop: true }, mascot: { emoji: "🕯️", size: "85px", initialPosition: { top: "30%", left: "46%" }, zIndex: 100, draggable: true }, groundContainer: { height: "50px", bottom: "0px", zIndex: 50, items: [item("🌼", "22px", .8), item("🎗️", "20px", .2)] } },
  { id: "cach-mang-19-8", displayName: "Cách Mạng Tháng Tám 19/8 ✊", colors: { light: { bg: "#FEF2F2", primary: "#991B1B", accent: "#B91C1C" }, dark: { bg: "#1F0404", primary: "#FACC15", accent: "#EF4444" } }, bgm: { url: arcade, volume: .35, loop: true }, mascot: { emoji: "✊", size: "85px", initialPosition: { top: "22%", left: "45%" }, zIndex: 100, draggable: true }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, items: [item("🚩", "24px", .6), item("🌟", "22px", .4)] } },
  { id: "quoc-khanh-2-9", displayName: "Quốc Khánh 2/9 🇻🇳", colors: { light: { bg: "#FEF2F2", primary: "#991B1B", accent: "#D97706" }, dark: { bg: "#2A0808", primary: "#FACC15", accent: "#F87171" } }, bgm: { url: arcade, volume: .35, loop: true }, mascot: { emoji: "🇻🇳", size: "90px", initialPosition: { top: "18%", left: "44%" }, zIndex: 100, draggable: true, animation: "float", clickEffect: { type: "scale-bounce", intensity: 1.3, durationMs: 300 } }, groundContainer: { height: "60px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("🎆", "26px", .5, { type: "particle-burst", intensity: 1.4, durationMs: 600 }), item("🎈", "24px", .5, { type: "shake", intensity: 1.2, durationMs: 350 })] } },
  { id: "tet-trung-thu", displayName: "Tết Trung Thu 🥮", colors: { light: { bg: "#FFFBEB", primary: "#D97706", accent: "#B45309" }, dark: { bg: "#0B0813", primary: "#FBBF24", accent: "#FDE047" } }, bgm: { url: arcade, volume: .35, loop: true }, mascot: { emoji: "🐇", size: "85px", initialPosition: { top: "25%", left: "46%" }, zIndex: 100, draggable: true }, groundContainer: { height: "60px", bottom: "0px", zIndex: 50, items: [item("🏮", "26px", .5), item("🥮", "24px", .5)] } },
  { id: "nha-giao-viet-nam-20-11", displayName: "Ngày Nhà Giáo Việt Nam 20/11 💐", colors: { light: { bg: "#F0FDF4", primary: "#15803D", accent: "#16A34A" }, dark: { bg: "#022C22", primary: "#4ADE80", accent: "#86EFAC" } }, bgm: { url: birds, volume: .35, loop: true }, mascot: { emoji: "💐", size: "90px", initialPosition: { top: "20%", left: "45%" }, zIndex: 100, draggable: true }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, items: [item("📚", "24px", .5), item("✒️", "22px", .5)] } },
  { id: "quoc-te-phu-nu-8-3", displayName: "Quốc Tế Phụ Nữ 8/3 💐", colors: { light: { bg: "#FDF2F8", primary: "#DB2777", accent: "#F43F5E" }, dark: { bg: "#831843", primary: "#F472B6", accent: "#FB7185" } }, bgm: { url: birds, volume: .35, loop: true }, mascot: { emoji: "🌷", size: "90px", initialPosition: { top: "20%", left: "45%" }, zIndex: 100, draggable: true, animation: "float" }, groundContainer: { height: "60px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("🌸", "24px", .5), item("🎀", "22px", .5)] } },
  { id: "tet-doan-ngo-5-5", displayName: "Tết Đoan Ngọ 5/5 🥟", colors: { light: { bg: "#FEF3C7", primary: "#D97706", accent: "#B45309" }, dark: { bg: "#1C1917", primary: "#FBBF24", accent: "#FDE047" } }, bgm: { url: birds, volume: .35, loop: true }, mascot: { emoji: "🍇", size: "85px", initialPosition: { top: "22%", left: "46%" }, zIndex: 100, draggable: true, animation: "bounce" }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("🥟", "26px", .6), item("Plum/✨", "20px", .4)] } },
  { id: "vu-lan-bao-hieu", displayName: "Lễ Vu Lan Báo Hiếu 🪷", colors: { light: { bg: "#FAF5FF", primary: "#7E22CE", accent: "#A855F7" }, dark: { bg: "#3B0764", primary: "#C084FC", accent: "#E9D5FF" } }, bgm: { url: wind, volume: .30, loop: true }, mascot: { emoji: "📿", size: "85px", initialPosition: { top: "25%", left: "47%" }, zIndex: 100, draggable: true, animation: "sine-wave" }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, rippleEffect: true, items: [item("🪷", "26px", .6), item("🕯️", "20px", .4)] } },
  { id: "phu-nu-viet-nam-20-10", displayName: "Ngày Phụ Nữ Việt Nam 20/10 🌹", colors: { light: { bg: "#FFF1F2", primary: "#BE123C", accent: "#E11D48" }, dark: { bg: "#4C0519", primary: "#FB7185", accent: "#FDA4AF" } }, bgm: { url: birds, volume: .35, loop: true }, mascot: { emoji: "🌹", size: "90px", initialPosition: { top: "18%", left: "44%" }, zIndex: 100, draggable: true, animation: "circular" }, groundContainer: { height: "60px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("💖", "22px", .5), item("💐", "24px", .5)] } },
  { id: "quan-doi-nhan-dan-22-12", displayName: "QĐND Việt Nam 22/12 🎖️", colors: { light: { bg: "#F0FDF4", primary: "#14532D", accent: "#15803D" }, dark: { bg: "#052E16", primary: "#4ADE80", accent: "#86EFAC" } }, bgm: { url: arcade, volume: .35, loop: true }, mascot: { emoji: "🪖", size: "85px", initialPosition: { top: "22%", left: "45%" }, zIndex: 100, draggable: true, animation: "bounce" }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("🎖️", "22px", .5), item("⭐", "22px", .5)] } },
];

export const FESTIVE_THEME_CONFIGS: FestiveThemeConfig[] = FESTIVE_THEME_CONFIG_DATA.map((theme) => ({
  ...theme,
  audioDescription: FESTIVE_THEME_AUDIO_DESCRIPTIONS[theme.id] ?? "Âm nền lễ hội do Ong chọn.",
}));

/**
 * Cấu hình hiệu ứng theme: mỗi theme có 28 hạt emoji (nằm trong mức 25–35
 * của đặc tả), không dùng ảnh, canvas hay một URL media mới.
 */
export const FESTIVE_THEME_DECORATIONS: Record<string, FestiveAmbientDecoration[]> = {
  "tet-nguyen-dan": [{ emoji: "🧧", motion: "fall", count: 7, size: "1.25rem" }, { emoji: "🌸", motion: "drift", count: 8, size: "1.1rem" }, { emoji: "✨", motion: "glow", count: 7, size: "1rem" }, { emoji: "🏮", motion: "bounce", count: 6, size: "1.25rem" }],
  "gio-to-hung-vuong": [{ emoji: "🪷", motion: "rise", count: 7, size: "1.15rem" }, { emoji: "✨", motion: "glow", count: 7, size: "1rem" }, { emoji: "🍃", motion: "drift", count: 8, size: "1rem" }, { emoji: "🪵", motion: "rest", count: 6, size: "1.1rem" }],
  "ngay-thanh-nien-26-3": [{ emoji: "⭐", motion: "diagonal", count: 7, size: "1rem" }, { emoji: "📘", motion: "rise", count: 7, size: "1rem" }, { emoji: "🌿", motion: "drift", count: 8, size: "1.05rem" }, { emoji: "💙", motion: "glow", count: 6, size: "1rem" }],
  "giai-phong-30-4": [{ emoji: "🎈", motion: "rise", count: 7, size: "1.1rem" }, { emoji: "🕊️", motion: "drift", count: 7, size: "1.05rem" }, { emoji: "🎉", motion: "fall", count: 8, size: "1.1rem" }, { emoji: "✨", motion: "glow", count: 6, size: "1rem" }],
  "thuong-binh-liet-si-27-7": [{ emoji: "🌼", motion: "drift", count: 7, size: "1rem" }, { emoji: "🕯️", motion: "glow", count: 7, size: "1rem" }, { emoji: "🎗️", motion: "fall", count: 8, size: "1rem" }, { emoji: "🍂", motion: "rest", count: 6, size: "1rem" }],
  "cach-mang-19-8": [{ emoji: "🚩", motion: "diagonal", count: 7, size: "1rem" }, { emoji: "⭐", motion: "glow", count: 7, size: "1rem" }, { emoji: "✨", motion: "fall", count: 8, size: "1rem" }, { emoji: "🍃", motion: "drift", count: 6, size: "1rem" }],
  "quoc-khanh-2-9": [{ emoji: "🎆", motion: "glow", count: 7, size: "1.15rem" }, { emoji: "🎈", motion: "rise", count: 7, size: "1.1rem" }, { emoji: "⭐", motion: "diagonal", count: 8, size: "1rem" }, { emoji: "🚩", motion: "rest", count: 6, size: "1rem" }],
  "tet-trung-thu": [{ emoji: "🏮", motion: "rise", count: 7, size: "1.15rem" }, { emoji: "✨", motion: "glow", count: 7, size: "1rem" }, { emoji: "🌙", motion: "drift", count: 8, size: "1rem" }, { emoji: "🥮", motion: "rest", count: 6, size: "1.05rem" }],
  "nha-giao-viet-nam-20-11": [{ emoji: "💐", motion: "drift", count: 7, size: "1.1rem" }, { emoji: "📚", motion: "rise", count: 7, size: "1rem" }, { emoji: "✨", motion: "glow", count: 8, size: "1rem" }, { emoji: "✒️", motion: "rest", count: 6, size: "1rem" }],
  "quoc-te-phu-nu-8-3": [{ emoji: "🌷", motion: "drift", count: 7, size: "1.1rem" }, { emoji: "🌸", motion: "fall", count: 7, size: "1rem" }, { emoji: "💖", motion: "glow", count: 8, size: "1rem" }, { emoji: "🎀", motion: "rest", count: 6, size: "1rem" }],
  "tet-doan-ngo-5-5": [{ emoji: "🍇", motion: "rise", count: 7, size: "1rem" }, { emoji: "✨", motion: "glow", count: 7, size: "1rem" }, { emoji: "🍃", motion: "drift", count: 8, size: "1rem" }, { emoji: "🥟", motion: "rest", count: 6, size: "1rem" }],
  "vu-lan-bao-hieu": [{ emoji: "🪷", motion: "rise", count: 7, size: "1.1rem" }, { emoji: "🕯️", motion: "glow", count: 7, size: "1rem" }, { emoji: "✨", motion: "drift", count: 8, size: "1rem" }, { emoji: "🌊", motion: "rest", count: 6, size: "1rem" }],
  "phu-nu-viet-nam-20-10": [{ emoji: "🌹", motion: "drift", count: 7, size: "1.1rem" }, { emoji: "💖", motion: "glow", count: 7, size: "1rem" }, { emoji: "💐", motion: "fall", count: 8, size: "1.05rem" }, { emoji: "🎀", motion: "rest", count: 6, size: "1rem" }],
  "quan-doi-nhan-dan-22-12": [{ emoji: "🎖️", motion: "diagonal", count: 7, size: "1rem" }, { emoji: "⭐", motion: "glow", count: 7, size: "1rem" }, { emoji: "🍃", motion: "drift", count: 8, size: "1rem" }, { emoji: "🪖", motion: "rest", count: 6, size: "1rem" }],
};

export const FESTIVE_THEME_IDS = FESTIVE_THEME_CONFIGS.map((theme) => theme.id);
export const festiveThemeFor = (scene?: string) => FESTIVE_THEME_CONFIGS.find((theme) => theme.id === scene);
