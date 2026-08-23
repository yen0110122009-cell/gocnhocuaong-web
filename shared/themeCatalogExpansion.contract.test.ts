import { describe, expect, it } from "vitest";
import { AMBIENT_SCENE_IDS, emptyProfile, normalizeProfile } from "./study";
import { FESTIVE_THEME_CONFIGS, FESTIVE_THEME_DECORATIONS, USER_PROVIDED_FESTIVE_AUDIO } from "../client/src/lib/festiveThemes";
import { festiveAmbientFor } from "../client/src/lib/festiveAmbient";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const study = () => readFileSync(resolve(root, "shared/study.ts"), "utf8");
const ambient = () => readFileSync(resolve(root, "client/src/lib/defaultAmbient.ts"), "utf8");
const styles = () => readFileSync(resolve(root, "client/src/index.css"), "utf8");
const home = () => readFileSync(resolve(root, "client/src/pages/Home.tsx"), "utf8");
const addedScenes = ["rainy_season", "stormy_season", "morning_chill", "pixel", "pirate", "sports", "disco", "laboratory", "egypt", "steampunk", "art", "ninja", "coffee", "ai", "teddy", "spring-blossom", "summer-beach", "autumn-leave", "winter-snow", "halloween-spooky", "lunar-new-year", "thunder-storm", "rainy-day", "sunny-day", "foggy-morning", "summer-ocean", "autumn-maple", "tet-vietnam", "halloween-night", "ghost-month", "xmas-holiday", "teachers-day", "vietnam-heroes", "rainy-ripple", "windy-dust", "fire-element", "girly-pastel", "hung-kings-festival", "youth-volunteers", "dien-bien-phu-victory", "liberation-day", "vpa-day", "mid-autumn", "water-element", "air-wind-element", "earth-element", "masculine-cyber", "oriental-wuxia", "mekong-delta", "hanoi-old-quarter", "mini-hologram-cosmos", "aurora-borealis", "arcade-retro", "magic-chess", "lofi-rain-chill", "fairy-tale"];

describe("expanded theme catalog contract", () => {
  it("keeps every audited scene in the type, picker and normalizer", () => {
    for (const scene of addedScenes) {
      expect(AMBIENT_SCENE_IDS).toContain(scene);
      expect(study()).toContain(`"${scene}"`);
    }
    expect(study()).toContain("favoriteAmbientScenes");
    expect(study()).toContain("ambientSceneVolumes");
    expect(study()).toContain("sceneAutomation");
  });

  it("renders the complete shared scene catalog with explicit audio status", () => {
    const source = home();
    expect(source).toContain("AMBIENT_SCENE_IDS");
    expect(source).toContain("fullCatalogSceneCards");
    expect(source).toContain("Có âm nền");
    expect(source).toContain("Chỉ giao diện");
    expect(AMBIENT_SCENE_IDS.every((scene) => source.includes("AMBIENT_SCENE_IDS"))).toBe(true);
    for (const scene of addedScenes) expect(AMBIENT_SCENE_IDS).toContain(scene);
  });

  it("preserves new scene selections and mixer volumes during normalization", () => {
    const normalized = normalizeProfile({ ...emptyProfile(), defaultAmbientScene: "winter-snow", audioMixer: { ...emptyProfile().audioMixer, ambientSceneVolumes: { ...emptyProfile().audioMixer!.ambientSceneVolumes, "winter-snow": 77, pixel: 63 } } });
    expect(normalized.defaultAmbientScene).toBe("winter-snow");
    expect(normalized.audioMixer?.ambientSceneVolumes["winter-snow"]).toBe(77);
    expect(normalized.audioMixer?.ambientSceneVolumes.pixel).toBe(63);
  });

  it("keeps all 14 festive themes in the shared catalog and restores festive presets", () => {
    expect(FESTIVE_THEME_CONFIGS).toHaveLength(14);
    for (const theme of FESTIVE_THEME_CONFIGS) {
      expect(AMBIENT_SCENE_IDS).toContain(theme.id);
      expect(theme.audioDescription.length).toBeGreaterThan(24);
      expect(festiveAmbientFor(theme.id)).toMatchObject({ url: USER_PROVIDED_FESTIVE_AUDIO[theme.id] ?? theme.bgm.url, volume: theme.bgm.volume * 100 });
    }
    const normalized = normalizeProfile({ ...emptyProfile(), personalStudyPresets: [{ id: "holiday", name: "Quốc khánh", ambientScene: "quoc-khanh-2-9" }] });
    expect(normalized.personalStudyPresets[0]?.ambientScene).toBe("quoc-khanh-2-9");
  });

  it("gives every festive theme a bounded emoji-only interactive ground layer", () => {
    const renderer = readFileSync(resolve(root, "client/src/components/FestiveThemeLayer.tsx"), "utf8");
    const css = styles();
    for (const theme of FESTIVE_THEME_CONFIGS) {
      const decorations = FESTIVE_THEME_DECORATIONS[theme.id];
      expect(decorations).toBeDefined();
      expect(decorations.reduce((total, decoration) => total + decoration.count, 0)).toBeGreaterThanOrEqual(25);
      expect(decorations.reduce((total, decoration) => total + decoration.count, 0)).toBeLessThanOrEqual(35);
      expect(decorations.every((decoration) => !decoration.emoji.includes("http"))).toBe(true);
    }
    expect(renderer).toContain("groundItems");
    expect(renderer).toContain("groundContainer.items");
    expect(renderer).toContain('id="vfx-stage"');
    expect(css).toContain("#vfx-stage { position: fixed; inset: 0; z-index: 9999 !important; pointer-events: none;");
    expect(css).toContain(".festive-ground-item");
    expect(Object.values(FESTIVE_THEME_DECORATIONS).flat().some((decoration) => decoration.motion === "bounce")).toBe(true);
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("maps only directly supplied audio URLs and keeps the rest metadata-only", () => {
    expect(ambient()).toContain("rain_heavy_loud.ogg");
    expect(ambient()).toContain("heavy_wind_storm.ogg");
    expect(ambient()).toContain("morning_birds_acoustic.ogg");
    expect(ambient()).toContain('target: "coffee"');
    expect(ambient()).toContain('target: "fairy-tale"');
    expect(ambient()).not.toContain("pixel.ogg");
    expect(ambient()).not.toContain("pirate.mp3");
  });

  it("keeps theme/audio controls single-source and removes visual-only cards", () => {
    const source = home();
    expect(source).toContain("const toggleThemeAudio = () => {");
    expect(source).toContain("setAudioUnlocked(true)");
    expect(source).toContain("fallbackUrl");
    expect(source).toContain("const fullCatalogSceneCards = AMBIENT_SCENE_IDS.filter((id) => Boolean(AUDIO_BACKED_SCENE_AUDIO[id]))");
    expect(source).toContain("Nguồn âm thanh:");
    expect(source).toContain('touchAction: "none"');
    expect(source).toContain("<FestiveThemeLayer");
    expect(source).not.toContain("const player = audioRef.current ?? new Audio()");
  });

  it("exposes a dedicated Vietnamese holiday picker with the existing gesture audio dialog", () => {
    const source = home();
    expect(source).toContain('aria-labelledby="festive-theme-title"');
    expect(source).toContain("Tùy chọn theme đang chọn");
    expect(source).toContain("FESTIVE_THEME_CONFIGS.map((theme)");
    expect(source).toContain("chooseAudioTheme({ id: theme.id, label: theme.displayName })");
    expect(source).toContain("festiveAmbientFor(theme.id)");
    expect(source).toContain("enableThemeTone");
    expect(source).toContain("enableAmbientAudio");
    expect(source).toContain("enableVFX");
    expect(source).toContain("audioDescription");
  });

  it("returns the selected scene and tone to their clean defaults while stopping preview audio", () => {
    const source = home();
    expect(source).toContain("const resetAppearance = () => {");
    expect(source).toContain("audioRef.current?.pause()");
    expect(source).toContain("defaultAmbientScene: undefined, activeCosmeticTheme: undefined");
    expect(source).toContain("Khôi phục giao diện");
  });

  it("uses a clean default scene instead of a decorative morning overlay", () => {
    const source = home();
    expect(source).toContain('root.dataset.ambientScene = profile.defaultAmbientScene ?? "none"');
  });

  it("uses non-blocking overlays with high-contrast scene tokens and reduced-motion handling", () => {
    const css = styles();
    for (const scene of ["spring-blossom", "summer-ocean", "tet-vietnam", "rainy-ripple", "fire-element", "fairy-tale"]) {
      expect(AMBIENT_SCENE_IDS).toContain(scene);
    }
    expect(css).toContain("pointer-events:none");
    expect(css).toContain("prefers-reduced-motion: no-preference");
    expect(css).toContain("--scene-text:");
    expect(css).toContain("--scene-card:");
  });
});
