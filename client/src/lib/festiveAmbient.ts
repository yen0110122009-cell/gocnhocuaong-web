import { FESTIVE_THEME_CONFIGS } from "./festiveThemes";

export type FestiveAmbientAsset = {
  id: string;
  name: string;
  description: string;
  url: string;
  target: string;
  volume: number;
};

/** Asset BGM lễ hội: chỉ chuẩn hoá dữ liệu nguyên gốc do người dùng cung cấp. */
export const FESTIVE_THEME_AMBIENT_ASSETS = Object.fromEntries(FESTIVE_THEME_CONFIGS.map((theme) => [theme.id, {
  id: `provided-theme-${theme.id}`,
  name: `${theme.displayName} · Âm nền`,
  description: "Âm nền lễ hội từ cấu hình do người dùng cung cấp",
  url: theme.bgm.url,
  target: theme.id,
  volume: theme.bgm.volume * 100,
}])) as Record<string, FestiveAmbientAsset>;

export function festiveAmbientFor(scene?: string) {
  return scene ? FESTIVE_THEME_AMBIENT_ASSETS[scene] : undefined;
}
