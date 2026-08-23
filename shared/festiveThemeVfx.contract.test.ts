import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { FESTIVE_THEME_CONFIGS, FESTIVE_THEME_DECORATIONS, USER_PROVIDED_FESTIVE_AUDIO } from "../client/src/lib/festiveThemes";

const layer = readFileSync(resolve(process.cwd(), "client/src/components/FestiveThemeLayer.tsx"), "utf8");
const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("festive VFX contract", () => {
  it("keeps the configured Vietnamese holiday themes and 28 decorative icons per theme", () => {
    expect(FESTIVE_THEME_CONFIGS).toHaveLength(14);
    for (const theme of FESTIVE_THEME_CONFIGS) {
      expect(FESTIVE_THEME_DECORATIONS[theme.id].reduce((sum, item) => sum + item.count, 0)).toBe(28);
    }
  });

  it("uses a 28-item interactive ground layer with Pointer Capture and five release physics", () => {
    expect(layer).toContain("* 28");
    expect(layer).toContain("setPointerCapture");
    expect(layer).toContain("releasePointerCapture");
    expect(layer).toContain('"ground", "float", "bounce", "orbit", "snap"');
    expect(layer).toContain('physics === "bounce"');
    expect(layer).toContain('physics === "orbit"');
    expect(layer).toContain('physics === "snap"');
    expect(layer).toContain("active.velocityX * 80");
    expect(layer).toContain("bottomGap");
    expect(layer).toContain("displaySize = clamp(Math.max(100, size * 2), 100, 140)");
    expect(layer).toContain("const mascotSize = config ? clamp(pixels(config.mascot.size), 100, 140) : 0");
    expect(layer).toContain("stableHash");
  });

  it("keeps visual overlays below navigation and never pauses unrelated learning audio", () => {
    expect(css).toContain(".festive-ambient-decorations { position: fixed; inset: 0; z-index: 50;");
    expect(css).toContain(".festive-visual-effects { position: fixed; inset: 0; z-index: 65;");
    expect(css).toContain(".min-h-screen > aside");
    expect(css).toContain("z-index: 100 !important");
    expect(layer).toContain("zIndex: 60");
    expect(layer).not.toContain("document.querySelectorAll<HTMLAudioElement>(\"audio\")");
  });

  it("registers exactly ten user-provided festive audio sources and plays only after a user gesture", () => {
    expect(Object.keys(USER_PROVIDED_FESTIVE_AUDIO)).toHaveLength(10);
    expect(home).toContain("FESTIVE_AUDIO_FALLBACKS");
    expect(home).toContain("setAudioUnlocked(true)");
    expect(home).toContain("handleThemeAudioError");
    expect(home).toContain("fallbackUrl");
  });
});
