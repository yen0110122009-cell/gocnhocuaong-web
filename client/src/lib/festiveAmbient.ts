import { FESTIVE_THEME_CONFIGS, USER_PROVIDED_FESTIVE_AUDIO } from "./festiveThemes";

export type FestiveAmbientAsset = {
  id: string;
  name: string;
  description: string;
  url: string;
  fallbackUrl?: string;
  target: string;
  volume: number;
};

/** Asset BGM lễ hội: chỉ chuẩn hoá dữ liệu nguyên gốc do người dùng cung cấp. */
export const FESTIVE_THEME_AMBIENT_ASSETS = Object.fromEntries(FESTIVE_THEME_CONFIGS.map((theme) => [theme.id, {
  id: `provided-theme-${theme.id}`,
  name: `${theme.displayName} · Âm nền`,
  description: "Âm nền lễ hội do người dùng cung cấp; có nguồn dự phòng đã audit khi tải không thành công",
  url: USER_PROVIDED_FESTIVE_AUDIO[theme.id] ?? theme.bgm.url,
  fallbackUrl: USER_PROVIDED_FESTIVE_AUDIO[theme.id] ? theme.bgm.url : undefined,
  target: theme.id,
  volume: theme.bgm.volume * 100,
}])) as Record<string, FestiveAmbientAsset>;

export function festiveAmbientFor(scene?: string) {
  return scene ? FESTIVE_THEME_AMBIENT_ASSETS[scene] : undefined;
}
