import { LOCAL_AMBIENT_AUDIO, LOCAL_FESTIVE_AUDIO } from "@/lib/audioAssets";

export type FestiveAnimation = "sine-wave" | "bounce" | "float" | "circular" | "tilt" | "edge-patrol" | "wing-flap" | "small-orbit" | "jitter" | "pixel-steps" | "wave-flight" | "crab-walk" | "squirrel-hop" | "snow-sway";
export type FestiveWanderPattern = "random" | "edge-vertical" | "circular" | "small-orbit" | "horizontal" | "diagonal" | "wave";

export type FestiveClickEffect = "scale-bounce" | "shake" | "particle-burst" | "ripple-wave" | "pulse-glow";

export interface FestiveEffectConfig {
  type: FestiveClickEffect;
  intensity: number;
  durationMs: number;
}

/** Hạt trang trí thuần emoji; renderer luôn đặt lớp này dưới nội dung và không nhận pointer events. */
export type FestiveAmbientMotion = "fall" | "rise" | "drift" | "glow" | "diagonal" | "bounce" | "rest" | "sine" | "flash";
export interface FestiveAmbientDecoration {
  emoji: string;
  motion: FestiveAmbientMotion;
  count: number;
  size: string;
  durationMs?: number;
  staggerMs?: number;
}

export interface FestiveThemeConfig {
  id: string;
  displayName: string;
  audioDescription: string;
  colors: { light: { bg: string; primary: string; accent: string; textPrimary?: string; textSecondary?: string; panel?: string }; dark: { bg: string; primary: string; accent: string; textPrimary?: string; textSecondary?: string; panel?: string } };
  bgm: { url: string; volume: number; loop: boolean };
  mascot: { emoji: string; size: string; initialPosition: { top: string; left: string }; zIndex: number; draggable: boolean; wanderIntervalMs?: number; wanderPattern?: FestiveWanderPattern; animation?: FestiveAnimation; clickEffect?: FestiveEffectConfig };
  groundContainer: { height: string; bottom: string; zIndex: number; rippleEffect?: boolean; itemCount?: number; exactSize?: boolean; items: Array<{ emoji: string; size: string; density: number; draggable: boolean; clickEffect?: FestiveEffectConfig }> };
}

const arcade = LOCAL_AMBIENT_AUDIO.bell;
const birds = LOCAL_AMBIENT_AUDIO.morning;
const wind = LOCAL_AMBIENT_AUDIO.rain;

/** Registry âm thanh local tự host, thay các host ngoài không ổn định. */
export const USER_PROVIDED_FESTIVE_AUDIO: Record<string, string> = LOCAL_FESTIVE_AUDIO;
const item = (emoji: string, size: string, density: number, clickEffect?: FestiveEffectConfig) => ({ emoji, size, density, draggable: true, clickEffect });

/** Mô tả tone do Ong cung cấp; URL audio được giữ trong registry local bên trên. */
export const FESTIVE_THEME_AUDIO_DESCRIPTIONS: Record<string, string> = {
  "tet-nguyen-dan": "Đàn tranh ấm, chuông gió, piano điện và nhịp chổi nhẹ trong không khí mùa xuân thanh bình.",
  "gio-to-hung-vuong": "Sáo trúc thiền định, tiếng gảy thưa và không gian rừng núi rộng, không dùng nhịp trống.",
  "ngay-thanh-nien-26-3": "Guitar acoustic, cajon và bass ấm tạo nhịp Lofi trẻ trung, sáng và tập trung.",
  "giai-phong-30-4": "Piano ấm, nhịp snare/chổi tiết chế và lớp synth đồng mềm tạo không khí khải hoàn trang trọng.",
  "thuong-binh-liet-si-27-7": "Piano nỉ, cello trầm và mưa rất nhẹ tạo không gian tưởng niệm lắng đọng.",
  "cach-mang-19-8": "Trống khung và tom tiết chế, bass gảy cùng synth analog tạo nhịp quyết tâm ổn định.",
  "quoc-khanh-2-9": "Sáo trúc, guitar dây nylon và ambience đồng quê tạo sắc thái quê hương thanh bình.",
  "tet-trung-thu": "Kalimba, chuông đêm, tiếng dế và trống khung chải nhẹ trong không khí Trung Thu hoài niệm.",
  "nha-giao-viet-nam-20-11": "Piano nỉ, dây nylon và tiếng lật trang rất khẽ gợi một buổi chiều yên tĩnh trong lớp học.",
  "quoc-te-phu-nu-8-3": "Guitar jazz ấm, Rhodes, contrabass và trống chổi tạo màu Lofi ngọt ngào, tự tin.",
  "tet-doan-ngo-5-5": "Marimba sáng, guitar acoustic, shaker tre và chim buổi sớm trong không khí mùa hè tươi mới.",
  "vu-lan-bao-hieu": "Âm chuông thiền mềm, tiếng suối, piano thưa và pad thoáng cho không gian tĩnh tâm.",
  "phu-nu-viet-nam-20-10": "Piano nỉ, violin legato và nhịp chổi nhẹ trong không khí vườn hồng lãng mạn.",
  "quan-doi-nhan-dan-22-12": "Pad trầm, gió thông rừng xa, nhịp heartbeat thấp và hòa âm mộc tạo sắc thái kiên cường.",
};

const FESTIVE_THEME_CONFIG_DATA: Array<Omit<FestiveThemeConfig, "audioDescription">> = [
  { id: "tet-nguyen-dan", displayName: "Tết Nguyên Đán 🧧", colors: { light: { bg: "#FFFBEB", primary: "#991B1B", accent: "#D97706" }, dark: { bg: "#2A0808", primary: "#FACC15", accent: "#EF4444" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["tet-nguyen-dan"], volume: .35, loop: true }, mascot: { emoji: "🦁", size: "95px", initialPosition: { top: "20%", left: "45%" }, zIndex: 100, draggable: true, animation: "bounce", clickEffect: { type: "scale-bounce", intensity: 1.3, durationMs: 350 } }, groundContainer: { height: "60px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("🧧", "28px", .6, { type: "shake", intensity: 1.15, durationMs: 300 }), item("🌸", "24px", .4, { type: "particle-burst", intensity: 1.2, durationMs: 450 })] } },
  { id: "gio-to-hung-vuong", displayName: "Giỗ Tổ Hùng Vương 👑", colors: { light: { bg: "#FEF3C7", primary: "#78350F", accent: "#B45309" }, dark: { bg: "#1C1917", primary: "#F59E0B", accent: "#FCD34D" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["gio-to-hung-vuong"], volume: .35, loop: true }, mascot: { emoji: "🦅", size: "95px", initialPosition: { top: "15%", left: "40%" }, zIndex: 100, draggable: true, animation: "sine-wave", clickEffect: { type: "pulse-glow", intensity: 1.25, durationMs: 400 } }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, rippleEffect: true, items: [item("🪷", "26px", .5, { type: "ripple-wave", intensity: 1.2, durationMs: 500 }), item("🪵", "24px", .5, { type: "scale-bounce", intensity: 1.1, durationMs: 250 })] } },
  { id: "ngay-thanh-nien-26-3", displayName: "Ngày Thành Lập Đoàn 26/3 💙", colors: { light: { bg: "#EFF6FF", primary: "#1D4ED8", accent: "#2563EB" }, dark: { bg: "#0B132B", primary: "#60A5FA", accent: "#93C5FD" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["ngay-thanh-nien-26-3"], volume: .35, loop: true }, mascot: { emoji: "⭐", size: "85px", initialPosition: { top: "25%", left: "48%" }, zIndex: 100, draggable: true }, groundContainer: { height: "50px", bottom: "0px", zIndex: 50, items: [item("🌿", "22px", .7), item("📘", "22px", .3)] } },
  { id: "giai-phong-30-4", displayName: "Giải Phóng Miền Nam 30/4 🪖", colors: { light: { bg: "#FEF2F2", primary: "#B91C1C", accent: "#DC2626" }, dark: { bg: "#2A0808", primary: "#FACC15", accent: "#F87171" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["giai-phong-30-4"], volume: .35, loop: true }, mascot: { emoji: "🕊️", size: "90px", initialPosition: { top: "20%", left: "42%" }, zIndex: 100, draggable: true }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, items: [item("🎉", "24px", .5), item("🎈", "24px", .5)] } },
  { id: "thuong-binh-liet-si-27-7", displayName: "Ngày Thương Binh Liệt Sĩ 27/7 🕯️", colors: { light: { bg: "#F5F5F4", primary: "#57534E", accent: "#D97706" }, dark: { bg: "#1C1917", primary: "#FBBF24", accent: "#A8A29E" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["thuong-binh-liet-si-27-7"], volume: .30, loop: true }, mascot: { emoji: "🕯️", size: "85px", initialPosition: { top: "30%", left: "46%" }, zIndex: 100, draggable: true }, groundContainer: { height: "50px", bottom: "0px", zIndex: 50, items: [item("🌼", "22px", .8), item("🎗️", "20px", .2)] } },
  { id: "cach-mang-19-8", displayName: "Cách Mạng Tháng Tám 19/8 ✊", colors: { light: { bg: "#FEF2F2", primary: "#991B1B", accent: "#B91C1C" }, dark: { bg: "#1F0404", primary: "#FACC15", accent: "#EF4444" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["cach-mang-19-8"], volume: .35, loop: true }, mascot: { emoji: "✊", size: "85px", initialPosition: { top: "22%", left: "45%" }, zIndex: 100, draggable: true }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, items: [item("🚩", "24px", .6), item("🌟", "22px", .4)] } },
  { id: "quoc-khanh-2-9", displayName: "Quốc Khánh 2/9 🇻🇳", colors: { light: { bg: "#FEF2F2", primary: "#991B1B", accent: "#D97706" }, dark: { bg: "#2A0808", primary: "#FACC15", accent: "#F87171" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["quoc-khanh-2-9"], volume: .35, loop: true }, mascot: { emoji: "🇻🇳", size: "90px", initialPosition: { top: "18%", left: "44%" }, zIndex: 100, draggable: true, animation: "float", clickEffect: { type: "scale-bounce", intensity: 1.3, durationMs: 300 } }, groundContainer: { height: "60px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("🎆", "26px", .5, { type: "particle-burst", intensity: 1.4, durationMs: 600 }), item("🎈", "24px", .5, { type: "shake", intensity: 1.2, durationMs: 350 })] } },
  { id: "tet-trung-thu", displayName: "Tết Trung Thu 🥮", colors: { light: { bg: "#FFFBEB", primary: "#D97706", accent: "#B45309" }, dark: { bg: "#0B0813", primary: "#FBBF24", accent: "#FDE047" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["tet-trung-thu"], volume: .35, loop: true }, mascot: { emoji: "🐇", size: "85px", initialPosition: { top: "25%", left: "46%" }, zIndex: 100, draggable: true }, groundContainer: { height: "60px", bottom: "0px", zIndex: 50, items: [item("🏮", "26px", .5), item("🥮", "24px", .5)] } },
  { id: "nha-giao-viet-nam-20-11", displayName: "Ngày Nhà Giáo Việt Nam 20/11 💐", colors: { light: { bg: "#F0FDF4", primary: "#15803D", accent: "#16A34A" }, dark: { bg: "#022C22", primary: "#4ADE80", accent: "#86EFAC" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["nha-giao-viet-nam-20-11"], volume: .35, loop: true }, mascot: { emoji: "💐", size: "90px", initialPosition: { top: "20%", left: "45%" }, zIndex: 100, draggable: true }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, items: [item("📚", "24px", .5), item("✒️", "22px", .5)] } },
  { id: "quoc-te-phu-nu-8-3", displayName: "Quốc Tế Phụ Nữ 8/3 💐", colors: { light: { bg: "#FDF2F8", primary: "#DB2777", accent: "#F43F5E" }, dark: { bg: "#831843", primary: "#F472B6", accent: "#FB7185" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["quoc-te-phu-nu-8-3"], volume: .35, loop: true }, mascot: { emoji: "🌷", size: "90px", initialPosition: { top: "20%", left: "45%" }, zIndex: 100, draggable: true, animation: "float" }, groundContainer: { height: "60px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("🌸", "24px", .5), item("🎀", "22px", .5)] } },
  { id: "tet-doan-ngo-5-5", displayName: "Tết Đoan Ngọ 5/5 🥟", colors: { light: { bg: "#FEF3C7", primary: "#D97706", accent: "#B45309" }, dark: { bg: "#1C1917", primary: "#FBBF24", accent: "#FDE047" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["tet-doan-ngo-5-5"], volume: .35, loop: true }, mascot: { emoji: "🍇", size: "85px", initialPosition: { top: "22%", left: "46%" }, zIndex: 100, draggable: true, animation: "bounce" }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("🥟", "26px", .6), item("Plum/✨", "20px", .4)] } },
  { id: "vu-lan-bao-hieu", displayName: "Lễ Vu Lan Báo Hiếu 🪷", colors: { light: { bg: "#FAF5FF", primary: "#7E22CE", accent: "#A855F7" }, dark: { bg: "#3B0764", primary: "#C084FC", accent: "#E9D5FF" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["vu-lan-bao-hieu"], volume: .30, loop: true }, mascot: { emoji: "📿", size: "85px", initialPosition: { top: "25%", left: "47%" }, zIndex: 100, draggable: true, animation: "sine-wave" }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, rippleEffect: true, items: [item("🪷", "26px", .6), item("🕯️", "20px", .4)] } },
  { id: "phu-nu-viet-nam-20-10", displayName: "Ngày Phụ Nữ Việt Nam 20/10 🌹", colors: { light: { bg: "#FFF1F2", primary: "#BE123C", accent: "#E11D48" }, dark: { bg: "#4C0519", primary: "#FB7185", accent: "#FDA4AF" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["phu-nu-viet-nam-20-10"], volume: .35, loop: true }, mascot: { emoji: "🌹", size: "90px", initialPosition: { top: "18%", left: "44%" }, zIndex: 100, draggable: true, animation: "circular" }, groundContainer: { height: "60px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("💖", "22px", .5), item("💐", "24px", .5)] } },
  { id: "quan-doi-nhan-dan-22-12", displayName: "QĐND Việt Nam 22/12 🎖️", colors: { light: { bg: "#F0FDF4", primary: "#14532D", accent: "#15803D" }, dark: { bg: "#052E16", primary: "#4ADE80", accent: "#86EFAC" } }, bgm: { url: LOCAL_FESTIVE_AUDIO["quan-doi-nhan-dan-22-12"], volume: .35, loop: true }, mascot: { emoji: "🪖", size: "85px", initialPosition: { top: "22%", left: "45%" }, zIndex: 100, draggable: true, animation: "bounce" }, groundContainer: { height: "55px", bottom: "0px", zIndex: 50, rippleEffect: false, items: [item("🎖️", "22px", .5), item("⭐", "22px", .5)] } },
];


/** Năm theme Nữ sinh theo đặc tả mới; tách khỏi 14 theme lễ hội để không đổi contract cũ. */
const STUDENT_THEME_CONFIG_DATA: Array<Omit<FestiveThemeConfig, "audioDescription">> = [
  { id: "sweet_strawberry", displayName: "Nữ sinh Dâu Tây 🍓", colors: { light: { bg: "linear-gradient(135deg, #FFF0F5, #FFE4E1)", primary: "#F43F5E", accent: "#F43F5E", textPrimary: "#881337", textSecondary: "#9D174D", panel: "#FFFFFF" }, dark: { bg: "linear-gradient(135deg, #4C0519, #881337)", primary: "#FB7185", accent: "#FB7185", textPrimary: "#FFE4E8", textSecondary: "#FECDD3", panel: "#23050C" } }, bgm: { url: LOCAL_AMBIENT_AUDIO.bell, volume: .30, loop: true }, mascot: { emoji: "🐱", size: "130px", initialPosition: { top: "200px", left: "150px" }, zIndex: 100, draggable: true, wanderIntervalMs: 3500, wanderPattern: "random", animation: "tilt" }, groundContainer: { height: "120px", bottom: "0px", zIndex: 55, itemCount: 25, exactSize: true, items: [item("🍓", "100px", 1)] } },
  { id: "black_ribbon", displayName: "Nữ sinh Cool Girl 🖤", colors: { light: { bg: "linear-gradient(135deg, #F8FAFC, #E2E8F0)", primary: "#64748B", accent: "#64748B", textPrimary: "#0F172A", textSecondary: "#1E293B", panel: "#FFFFFF" }, dark: { bg: "linear-gradient(135deg, #090D16, #181825)", primary: "#CBA6F7", accent: "#CBA6F7", textPrimary: "#CDD6F4", textSecondary: "#A6ADC8", panel: "#11111B" } }, bgm: { url: LOCAL_AMBIENT_AUDIO.storm, volume: .28, loop: true }, mascot: { emoji: "🕶️", size: "130px", initialPosition: { top: "150px", left: "100px" }, zIndex: 100, draggable: true, wanderIntervalMs: 5000, wanderPattern: "edge-vertical", animation: "edge-patrol" }, groundContainer: { height: "120px", bottom: "0px", zIndex: 55, itemCount: 25, exactSize: true, items: [item("🖤", "100px", 1)] } },
  { id: "library_chill", displayName: "Nữ sinh Thư viện 📖", colors: { light: { bg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", primary: "#D97706", accent: "#D97706", textPrimary: "#451A03", textSecondary: "#78350F", panel: "#FFFFFF" }, dark: { bg: "linear-gradient(135deg, #2E1000, #451A03)", primary: "#F59E0B", accent: "#F59E0B", textPrimary: "#FEF3C7", textSecondary: "#FDE68A", panel: "#1C0A00" } }, bgm: { url: LOCAL_AMBIENT_AUDIO.bookPages, volume: .28, loop: true }, mascot: { emoji: "🦉", size: "130px", initialPosition: { top: "80px", left: "50vw" }, zIndex: 100, draggable: true, wanderIntervalMs: 4000, wanderPattern: "circular", animation: "wing-flap" }, groundContainer: { height: "120px", bottom: "0px", zIndex: 55, itemCount: 25, exactSize: true, items: [item("📖", "100px", 1)] } },
  { id: "after_school", displayName: "Nữ sinh Tan Trường 🎒", colors: { light: { bg: "linear-gradient(135deg, #FEF9C3, #FEF08A)", primary: "#EAB308", accent: "#EAB308", textPrimary: "#713F12", textSecondary: "#854D0E", panel: "#FFFFFF" }, dark: { bg: "linear-gradient(135deg, #422006, #713F12)", primary: "#FACC15", accent: "#FACC15", textPrimary: "#FEF08A", textSecondary: "#FEF08A", panel: "#1C0D02" } }, bgm: { url: LOCAL_AMBIENT_AUDIO.morning, volume: .30, loop: true }, mascot: { emoji: "🐝", size: "130px", initialPosition: { top: "300px", left: "200px" }, zIndex: 100, draggable: true, wanderIntervalMs: 2500, wanderPattern: "small-orbit", animation: "jitter" }, groundContainer: { height: "120px", bottom: "0px", zIndex: 55, itemCount: 25, exactSize: true, items: [item("🎒", "100px", 1)] } },
  { id: "classic_academy", displayName: "Nữ sinh Nghệ thuật 🎻", colors: { light: { bg: "linear-gradient(135deg, #E0F2FE, #BAE6FD)", primary: "#0284C7", accent: "#0284C7", textPrimary: "#0369A1", textSecondary: "#075985", panel: "#FFFFFF" }, dark: { bg: "linear-gradient(135deg, #082F49, #0C4A6E)", primary: "#38BDF8", accent: "#38BDF8", textPrimary: "#E0F2FE", textSecondary: "#7DD3FC", panel: "#031825" } }, bgm: { url: LOCAL_AMBIENT_AUDIO.morning, volume: .28, loop: true }, mascot: { emoji: "🦢", size: "130px", initialPosition: { top: "250px", left: "400px" }, zIndex: 100, draggable: true, wanderIntervalMs: 6000, wanderPattern: "horizontal", animation: "float" }, groundContainer: { height: "120px", bottom: "0px", zIndex: 55, itemCount: 25, exactSize: true, items: [item("🎻", "100px", 1)] } },
  { id: "cyber_highschool", displayName: "Nữ sinh Y2K Cyber 💿", colors: { light: { bg: "linear-gradient(135deg, #FAE8FF, #F0ABFC)", primary: "#D946EF", accent: "#D946EF", textPrimary: "#701A75", textSecondary: "#86198F", panel: "#FFFFFF" }, dark: { bg: "linear-gradient(135deg, #2A0835, #581C87)", primary: "#E879F9", accent: "#E879F9", textPrimary: "#FAE8FF", textSecondary: "#F5D0FE", panel: "#190422" } }, bgm: { url: LOCAL_AMBIENT_AUDIO.bell, volume: .28, loop: true }, mascot: { emoji: "👾", size: "130px", initialPosition: { top: "220px", left: "300px" }, zIndex: 100, draggable: true, wanderIntervalMs: 3000, wanderPattern: "diagonal", animation: "pixel-steps" }, groundContainer: { height: "120px", bottom: "0px", zIndex: 55, itemCount: 25, exactSize: true, items: [item("💿", "100px", 1)] } },
  { id: "spring_fresh", displayName: "Mùa Xuân Thanh Tân 🌸", colors: { light: { bg: "linear-gradient(135deg, #FDF2F8, #FBCFE8)", primary: "#EC4899", accent: "#EC4899", textPrimary: "#831843", textSecondary: "#9D174D", panel: "#FFFFFF" }, dark: { bg: "linear-gradient(135deg, #3B071E, #701A75)", primary: "#F472B6", accent: "#F472B6", textPrimary: "#FDF2F8", textSecondary: "#FCE7F3", panel: "#1F030F" } }, bgm: { url: LOCAL_AMBIENT_AUDIO.morning, volume: .28, loop: true }, mascot: { emoji: "🐦", size: "130px", initialPosition: { top: "120px", left: "100px" }, zIndex: 100, draggable: true, wanderIntervalMs: 4000, wanderPattern: "wave", animation: "wave-flight" }, groundContainer: { height: "120px", bottom: "0px", zIndex: 55, itemCount: 25, exactSize: true, items: [item("🌱", "100px", 1)] } },
  { id: "summer_ocean", displayName: "Mùa Hạ Biển Xanh 🏖️", colors: { light: { bg: "linear-gradient(135deg, #E0F2FE, #7DD3FC)", primary: "#0284C7", accent: "#0284C7", textPrimary: "#0369A1", textSecondary: "#075985", panel: "#FFFFFF" }, dark: { bg: "linear-gradient(135deg, #082F49, #0C4A6E)", primary: "#38BDF8", accent: "#38BDF8", textPrimary: "#E0F2FE", textSecondary: "#BAE6FD", panel: "#031825" } }, bgm: { url: LOCAL_AMBIENT_AUDIO.rain, volume: .25, loop: true }, mascot: { emoji: "🦀", size: "130px", initialPosition: { top: "calc(100vh - 250px)", left: "100px" }, zIndex: 100, draggable: true, wanderIntervalMs: 4500, wanderPattern: "horizontal", animation: "crab-walk" }, groundContainer: { height: "120px", bottom: "0px", zIndex: 55, itemCount: 25, exactSize: true, items: [item("🐚", "100px", 1)] } },
  { id: "autumn_leaves", displayName: "Mùa Thu Lá Vàng Rơi 🍁", colors: { light: { bg: "linear-gradient(135deg, #FFF7ED, #FFEDD5)", primary: "#EA580C", accent: "#EA580C", textPrimary: "#7C2D12", textSecondary: "#9A3412", panel: "#FFFFFF" }, dark: { bg: "linear-gradient(135deg, #431407, #7C2D12)", primary: "#FB923C", accent: "#FB923C", textPrimary: "#FFF7ED", textSecondary: "#FFEDD5", panel: "#230A03" } }, bgm: { url: LOCAL_AMBIENT_AUDIO.rain, volume: .25, loop: true }, mascot: { emoji: "🐿️", size: "130px", initialPosition: { top: "250px", left: "200px" }, zIndex: 100, draggable: true, wanderIntervalMs: 3200, wanderPattern: "small-orbit", animation: "squirrel-hop" }, groundContainer: { height: "120px", bottom: "0px", zIndex: 55, itemCount: 25, exactSize: true, items: [item("🌰", "100px", 1)] } },
  { id: "winter_snow", displayName: "Mùa Đông Người Tuyết ☃️", colors: { light: { bg: "linear-gradient(135deg, #F0F9FF, #E0F2FE)", primary: "#0284C7", accent: "#0284C7", textPrimary: "#0C4A6E", textSecondary: "#0369A1", panel: "#FFFFFF" }, dark: { bg: "linear-gradient(135deg, #082F49, #0F172A)", primary: "#38BDF8", accent: "#38BDF8", textPrimary: "#F0F9FF", textSecondary: "#7DD3FC", panel: "#031825" } }, bgm: { url: LOCAL_AMBIENT_AUDIO.rain, volume: .22, loop: true }, mascot: { emoji: "☃️", size: "130px", initialPosition: { top: "180px", left: "50vw" }, zIndex: 100, draggable: true, wanderIntervalMs: 5000, wanderPattern: "horizontal", animation: "snow-sway" }, groundContainer: { height: "120px", bottom: "0px", zIndex: 55, itemCount: 25, exactSize: true, items: [item("🧊", "100px", 1)] } },
];

export const STUDENT_THEME_CONFIGS: FestiveThemeConfig[] = STUDENT_THEME_CONFIG_DATA.map((theme) => ({ ...theme, audioDescription: "Âm nền tích hợp theo đặc tả Nữ sinh; link YouTube chỉ là tham chiếu." }));

export const FESTIVE_THEME_CONFIGS: FestiveThemeConfig[] = FESTIVE_THEME_CONFIG_DATA.map((theme) => ({
  ...theme,
  audioDescription: FESTIVE_THEME_AUDIO_DESCRIPTIONS[theme.id] ?? "Âm nền lễ hội do Ong chọn.",
}));

/**
 * Cấu hình hiệu ứng theme: 14 theme lễ hội giữ 28 hạt; 5 theme Nữ sinh
 * dùng số lượng và kích thước cố định theo đặc tả riêng, không dùng ảnh/canvas.
 */
export const FESTIVE_THEME_DECORATIONS: Record<string, FestiveAmbientDecoration[]> = {
  "tet-nguyen-dan": [{ emoji: "🧧", motion: "fall", count: 7, size: "1.25rem" }, { emoji: "🌸", motion: "drift", count: 8, size: "1.1rem" }, { emoji: "✨", motion: "glow", count: 7, size: "1rem" }, { emoji: "🏮", motion: "bounce", count: 6, size: "1.25rem" }],
  "sweet_strawberry": [{ emoji: "🍰", motion: "fall", count: 12, size: "40px", durationMs: 6000, staggerMs: 500 }],
  "black_ribbon": [{ emoji: "⚡", motion: "flash", count: 6, size: "40px", durationMs: 1800, staggerMs: 300 }],
  "library_chill": [{ emoji: "☕", motion: "rise", count: 8, size: "40px", durationMs: 7000, staggerMs: 500 }],
  "after_school": [{ emoji: "🍋", motion: "diagonal", count: 10, size: "40px", durationMs: 3500, staggerMs: 350 }],
  "classic_academy": [{ emoji: "🎼", motion: "sine", count: 15, size: "40px", durationMs: 8000, staggerMs: 450 }],
  "cyber_highschool": [{ emoji: "🌟", motion: "rise", count: 14, size: "40px", durationMs: 5000, staggerMs: 260 }],
  "spring_fresh": [{ emoji: "🌸", motion: "fall", count: 16, size: "40px", durationMs: 7000, staggerMs: 430 }],
  "summer_ocean": [{ emoji: "🫧", motion: "rise", count: 12, size: "40px", durationMs: 5500, staggerMs: 420 }],
  "autumn_leaves": [{ emoji: "🍁", motion: "fall", count: 15, size: "40px", durationMs: 6500, staggerMs: 380 }],
  "winter_snow": [{ emoji: "❄️", motion: "fall", count: 18, size: "40px", durationMs: 8000, staggerMs: 360 }],
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
export const STUDENT_THEME_IDS = STUDENT_THEME_CONFIGS.map((theme) => theme.id);
const ALL_THEME_CONFIGS = [...FESTIVE_THEME_CONFIGS, ...STUDENT_THEME_CONFIGS];
export const festiveThemeFor = (scene?: string) => ALL_THEME_CONFIGS.find((theme) => theme.id === scene);
