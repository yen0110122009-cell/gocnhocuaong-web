import { describe, expect, it } from "vitest";
import { emptyProfile, normalizeProfile } from "./study";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const study = () => readFileSync(resolve(root, "shared/study.ts"), "utf8");
const studio = () => readFileSync(resolve(root, "client/src/components/ExperienceStudio.tsx"), "utf8");
const ambient = () => readFileSync(resolve(root, "client/src/lib/defaultAmbient.ts"), "utf8");
const styles = () => readFileSync(resolve(root, "client/src/index.css"), "utf8");
const home = () => readFileSync(resolve(root, "client/src/pages/Home.tsx"), "utf8");
const addedScenes = ["rainy_season", "stormy_season", "morning_chill", "pixel", "pirate", "sports", "disco", "laboratory", "egypt", "steampunk", "art", "ninja", "coffee", "ai", "teddy"];

describe("expanded theme catalog contract", () => {
  it("keeps every audited scene in the type, picker and normalizer", () => {
    for (const scene of addedScenes) {
      expect(study()).toContain(`"${scene}"`);
      expect(studio()).toContain(`id: "${scene}"`);
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
    for (const scene of addedScenes) expect(source).toContain(`${scene}:`);
    for (const scene of ["spring-blossom", "summer-beach", "autumn-leave", "winter-snow", "halloween-spooky", "lunar-new-year", "thunder-storm", "rainy-day", "sunny-day", "foggy-morning"]) expect(source).toContain(`"${scene}"`);
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
    expect(studio()).toContain('scene === "rainy_season" ? PROVIDED_THEME_AMBIENT_ASSETS.rainy_season');
    expect(studio()).toContain('scene === "coffee" ? PROVIDED_THEME_AMBIENT_ASSETS.coffee');
    expect(ambient()).not.toContain("pixel.ogg");
    expect(ambient()).not.toContain("pirate.mp3");
  });

  it("uses non-blocking overlays with high-contrast scene tokens and reduced-motion handling", () => {
    const css = styles();
    for (const scene of addedScenes) {
      expect(css).toContain(`data-ambient-scene="${scene}"`);
    }
    expect(css).toContain("pointer-events:none");
    expect(css).toContain("prefers-reduced-motion: no-preference");
    expect(css).toContain("--scene-text:");
    expect(css).toContain("--scene-card:");
  });
});
