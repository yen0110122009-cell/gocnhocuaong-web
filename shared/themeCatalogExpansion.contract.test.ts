import { describe, expect, it } from "vitest";
import { AMBIENT_SCENE_IDS, emptyProfile, normalizeProfile } from "./study";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const study = () => readFileSync(resolve(root, "shared/study.ts"), "utf8");
const studio = () => readFileSync(resolve(root, "client/src/components/ExperienceStudio.tsx"), "utf8");
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

  it("maps only directly supplied audio URLs and keeps the rest metadata-only", () => {
    expect(ambient()).toContain("rain_heavy_loud.ogg");
    expect(ambient()).toContain("heavy_wind_storm.ogg");
    expect(ambient()).toContain("morning_birds_acoustic.ogg");
    expect(ambient()).toContain('target: "coffee"');
    expect(studio()).toContain("PROVIDED_THEME_AMBIENT_ASSETS[scene as keyof typeof PROVIDED_THEME_AMBIENT_ASSETS]");
    expect(ambient()).toContain('target: "fairy-tale"');
    expect(ambient()).not.toContain("pixel.ogg");
    expect(ambient()).not.toContain("pirate.mp3");
  });

  it("keeps theme/audio controls single-source and removes visual-only cards", () => {
    const source = home();
    expect(source).toContain("const toggleThemeAudio = () => setAudioEnabled((enabled) => !enabled)");
    expect(source).toContain("const fullCatalogSceneCards = AMBIENT_SCENE_IDS.filter((id) => Boolean(AUDIO_BACKED_SCENE_AUDIO[id]))");
    expect(studio()).toContain('const AUDIO_BACKED_SCENE_IDS = new Set<AmbientScene>');
    expect(studio()).toContain('"fairy-tale"');
    expect(source).toContain("Nguồn âm thanh:");
    expect(source).toContain('touchAction: "none"');
    expect(source).toContain("z-[90]");
    expect(source).not.toContain("const player = audioRef.current ?? new Audio()");
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
