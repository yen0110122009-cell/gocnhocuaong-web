export type ColorPaletteMode = {
  bgGradient: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  accent: string;
  borderColor: string;
};

export type ColorPaletteDefinition = {
  name: string;
  effectClass?: "bg-starry-twinkle" | "bg-aurora-glow";
  light: ColorPaletteMode;
  dark: ColorPaletteMode;
};

/** Bộ tone chính thức theo pasted_content_19; mọi tone đều có surface và chữ tương phản cao. */
export const COLOR_PALETTES = {
  ong_do_la_xanh: { name: "Ong Đỏ · Lá Xanh", light: { bgGradient: "linear-gradient(135deg, #FFF0F2 0%, #FFE4E8 100%)", textPrimary: "#9F1239", textSecondary: "#BE123C", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#E11D48", borderColor: "#FECDD3" }, dark: { bgGradient: "linear-gradient(135deg, #4C0519 0%, #881337 100%)", textPrimary: "#FFE4E8", textSecondary: "#FECDD3", cardBg: "rgba(30, 4, 10, 0.8)", accent: "#FB7185", borderColor: "#9F1239" } },
  hoang_hon_tim_man: { name: "Hoàng Hôn · Tím Mận", light: { bgGradient: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)", textPrimary: "#581C87", textSecondary: "#7E22CE", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#A855F7", borderColor: "#E9D5FF" }, dark: { bgGradient: "linear-gradient(135deg, #2E1065 0%, #581C87 100%)", textPrimary: "#F3E8FF", textSecondary: "#E9D5FF", cardBg: "rgba(20, 7, 43, 0.8)", accent: "#C084FC", borderColor: "#7E22CE" } },
  rung_dem_huyen_bi: { name: "Rừng Đêm Huyền Bí ✨", effectClass: "bg-starry-twinkle", light: { bgGradient: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)", textPrimary: "#064E3B", textSecondary: "#047857", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#10B981", borderColor: "#BBF7D0" }, dark: { bgGradient: "linear-gradient(135deg, #022C22 0%, #065F46 100%)", textPrimary: "#DCFCE7", textSecondary: "#A7F3D0", cardBg: "rgba(1, 28, 22, 0.85)", accent: "#34D399", borderColor: "#047857" } },
  cuc_quang_tim_than: { name: "Cực Quang · Tím Than 🌌", effectClass: "bg-aurora-glow", light: { bgGradient: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)", textPrimary: "#4C1D95", textSecondary: "#6D28D9", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#8B5CF6", borderColor: "#DDD6FE" }, dark: { bgGradient: "linear-gradient(135deg, #0F172A 0%, #311042 100%)", textPrimary: "#EDE9FE", textSecondary: "#DDD6FE", cardBg: "rgba(15, 10, 30, 0.85)", accent: "#A78BFA", borderColor: "#5B21B6" } },
  cham_dem_dien_lam: { name: "Chàm Đêm · Điện Lam 🌠", effectClass: "bg-starry-twinkle", light: { bgGradient: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", textPrimary: "#1E3A8A", textSecondary: "#1E40AF", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#3B82F6", borderColor: "#BFDBFE" }, dark: { bgGradient: "linear-gradient(135deg, #030712 0%, #1E1B4B 100%)", textPrimary: "#DBEAFE", textSecondary: "#BFDBFE", cardBg: "rgba(5, 10, 30, 0.85)", accent: "#60A5FA", borderColor: "#1D4ED8" } },
  dai_duong_vang_nang: { name: "Đại Dương · Vàng Nắng", light: { bgGradient: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)", textPrimary: "#0C4A6E", textSecondary: "#0369A1", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#0284C7", borderColor: "#BAE6FD" }, dark: { bgGradient: "linear-gradient(135deg, #082F49 0%, #0C4A6E 100%)", textPrimary: "#E0F2FE", textSecondary: "#BAE6FD", cardBg: "rgba(3, 23, 36, 0.8)", accent: "#38BDF8", borderColor: "#075985" } },
  lavender_suong_bac: { name: "Lavender · Sương Bạc", light: { bgGradient: "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)", textPrimary: "#312E81", textSecondary: "#3730A3", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#6366F1", borderColor: "#C7D2FE" }, dark: { bgGradient: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)", textPrimary: "#EEF2FF", textSecondary: "#C7D2FE", cardBg: "rgba(15, 12, 40, 0.8)", accent: "#818CF8", borderColor: "#4338CA" } },
  vuon_hong_la_dam: { name: "Vườn Hồng · Lá Đậm", light: { bgGradient: "linear-gradient(135deg, #FDF2F8 0%, #FBCFE8 100%)", textPrimary: "#831843", textSecondary: "#9D174D", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#EC4899", borderColor: "#F9A8D4" }, dark: { bgGradient: "linear-gradient(135deg, #500724 0%, #831843 100%)", textPrimary: "#FBCFE8", textSecondary: "#F9A8D4", cardBg: "rgba(32, 3, 14, 0.8)", accent: "#F472B6", borderColor: "#BE185D" } },
  bac_ha_ca_cao: { name: "Bạc Hà · Ca Cao", light: { bgGradient: "linear-gradient(135deg, #F0FDF4 0%, #E8F5E9 100%)", textPrimary: "#1B4332", textSecondary: "#2D6A4F", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#40916C", borderColor: "#B7E4C7" }, dark: { bgGradient: "linear-gradient(135deg, #081C15 0%, #1B4332 100%)", textPrimary: "#D8F3DC", textSecondary: "#B7E4C7", cardBg: "rgba(5, 18, 13, 0.8)", accent: "#52B788", borderColor: "#2D6A4F" } },
  san_ho_troi_xanh: { name: "San Hô · Trời Xanh", light: { bgGradient: "linear-gradient(135deg, #FFF1F2 0%, #E0F2FE 100%)", textPrimary: "#881337", textSecondary: "#0369A1", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#F43F5E", borderColor: "#FECDD3" }, dark: { bgGradient: "linear-gradient(135deg, #4C0519 0%, #0C4A6E 100%)", textPrimary: "#FFE4E8", textSecondary: "#BAE6FD", cardBg: "rgba(25, 5, 20, 0.8)", accent: "#FB7185", borderColor: "#9F1239" } },
  man_chin_anh_vang: { name: "Mận Chín · Ánh Vàng", light: { bgGradient: "linear-gradient(135deg, #FFFBEB 0%, #FDE68A 100%)", textPrimary: "#78350F", textSecondary: "#92400E", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#F59E0B", borderColor: "#FCD34D" }, dark: { bgGradient: "linear-gradient(135deg, #451A03 0%, #78350F 100%)", textPrimary: "#FEF3C7", textSecondary: "#FDE68A", cardBg: "rgba(28, 10, 2, 0.8)", accent: "#FBBF24", borderColor: "#B45309" } },
  sakura_muc_xanh: { name: "Sakura · Mực Xanh", light: { bgGradient: "linear-gradient(135deg, #FFF5F7 0%, #E0E7FF 100%)", textPrimary: "#1E1B4B", textSecondary: "#3730A3", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#EC4899", borderColor: "#EEF2FF" }, dark: { bgGradient: "linear-gradient(135deg, #31102E 0%, #1E1B4B 100%)", textPrimary: "#EEF2FF", textSecondary: "#FBCFE8", cardBg: "rgba(20, 10, 30, 0.8)", accent: "#F472B6", borderColor: "#4338CA" } },
  dat_nung_kem: { name: "Đất Nung · Kem", light: { bgGradient: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)", textPrimary: "#7C2D12", textSecondary: "#9A3412", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#EA580C", borderColor: "#FED7AA" }, dark: { bgGradient: "linear-gradient(135deg, #431407 0%, #7C2D12 100%)", textPrimary: "#FFEDD5", textSecondary: "#FED7AA", cardBg: "rgba(28, 8, 3, 0.8)", accent: "#FB923C", borderColor: "#C2410C" } },
  dau_rung_bang_lam: { name: "Dâu Rừng · Băng Lam", light: { bgGradient: "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)", textPrimary: "#134E4A", textSecondary: "#0F766E", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#14B8A6", borderColor: "#99F6E4" }, dark: { bgGradient: "linear-gradient(135deg, #042F2E 0%, #134E4A 100%)", textPrimary: "#CCFBF1", textSecondary: "#99F6E4", cardBg: "rgba(2, 20, 20, 0.8)", accent: "#2DD4BF", borderColor: "#115E59" } },
  ngoc_bich_nga: { name: "Ngọc Bích · Ngà", light: { bgGradient: "linear-gradient(135deg, #F7FEE7 0%, #ECFCCB 100%)", textPrimary: "#365314", textSecondary: "#4D7C0F", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#65A30D", borderColor: "#D9F99D" }, dark: { bgGradient: "linear-gradient(135deg, #1A2E05 0%, #365314 100%)", textPrimary: "#ECFCCB", textSecondary: "#D9F99D", cardBg: "rgba(10, 20, 2, 0.8)", accent: "#A3E635", borderColor: "#3F6212" } },
  dong_co_dem_than: { name: "Đồng Cổ · Đêm Than", light: { bgGradient: "linear-gradient(135deg, #FAFAF9 0%, #E7E5E4 100%)", textPrimary: "#292524", textSecondary: "#44403C", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#78716C", borderColor: "#D6D3D1" }, dark: { bgGradient: "linear-gradient(135deg, #0C0A09 0%, #1C1917 100%)", textPrimary: "#F5F5F4", textSecondary: "#E7E5E4", cardBg: "rgba(15, 13, 12, 0.85)", accent: "#A8A29E", borderColor: "#292524" } },
  vu_tru_huyen_dieu: { name: "Vũ Trụ Huyền Diệu ✨", effectClass: "bg-starry-twinkle", light: { bgGradient: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)", textPrimary: "#312E81", textSecondary: "#4338CA", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#6366F1", borderColor: "#C7D2FE" }, dark: { bgGradient: "linear-gradient(135deg, #0A051B 0%, #1E1B4B 100%)", textPrimary: "#E0E7FF", textSecondary: "#C7D2FE", cardBg: "rgba(8, 4, 22, 0.85)", accent: "#818CF8", borderColor: "#3730A3" } },
  nang_mai_anh_dao: { name: "Nắng Mai · Mây Anh Đào", light: { bgGradient: "linear-gradient(135deg, #FFF7ED 0%, #FFE4E8 100%)", textPrimary: "#881337", textSecondary: "#C2410C", cardBg: "rgba(255, 255, 255, 0.9)", accent: "#FB7185", borderColor: "#FECDD3" }, dark: { bgGradient: "linear-gradient(135deg, #431407 0%, #4C0519 100%)", textPrimary: "#FFE4E8", textSecondary: "#FED7AA", cardBg: "rgba(30, 8, 8, 0.8)", accent: "#F43F5E", borderColor: "#9F1239" } },
} as const satisfies Record<string, ColorPaletteDefinition>;

export type CosmeticPaletteId = keyof typeof COLOR_PALETTES;
export const COLOR_PALETTE_IDS = Object.keys(COLOR_PALETTES) as CosmeticPaletteId[];

/** Giữ lựa chọn giao diện cũ hoạt động nhưng chuyển về tone mới tương ứng. */
export const LEGACY_COSMETIC_THEME_ALIASES: Record<string, CosmeticPaletteId> = {
  "ong-red": "ong_do_la_xanh", "forest-green": "rung_dem_huyen_bi", "sunset-amber": "man_chin_anh_vang", "ocean-blue": "dai_duong_vang_nang", "lavender-dream": "lavender_suong_bac", "rose-garden": "vuon_hong_la_dam", "midnight-indigo": "cham_dem_dien_lam", "mint-cocoa": "bac_ha_ca_cao", "terracotta-cream": "dat_nung_kem", "berry-ice": "dau_rung_bang_lam", "jade-ivory": "ngoc_bich_nga", "copper-night": "dong_co_dem_than", "coral-sky": "san_ho_troi_xanh", "plum-gold": "hoang_hon_tim_man", "sakura-ink": "sakura_muc_xanh", "neon-aurora": "cuc_quang_tim_than",
};

export function normalizeCosmeticPaletteId(value: unknown): CosmeticPaletteId | undefined {
  if (typeof value !== "string") return undefined;
  if (value in COLOR_PALETTES) return value as CosmeticPaletteId;
  return LEGACY_COSMETIC_THEME_ALIASES[value];
}
