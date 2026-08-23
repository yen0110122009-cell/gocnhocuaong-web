import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { FESTIVE_THEME_CONFIGS, FESTIVE_THEME_DECORATIONS } from "../client/src/lib/festiveThemes";

const layer = readFileSync(resolve(process.cwd(), "client/src/components/FestiveThemeLayer.tsx"), "utf8");
const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("festive VFX contract", () => {
  it("keeps the configured Vietnamese holiday themes and 28 decorative icons per theme", () => {
    expect(FESTIVE_THEME_CONFIGS).toHaveLength(14);
    for (const theme of FESTIVE_THEME_CONFIGS) {
      expect(FESTIVE_THEME_DECORATIONS[theme.id].reduce((sum, item) => sum + item.count, 0)).toBe(28);
    }
  });

  it("uses a 28-item interactive ground layer with Pointer Capture and release physics", () => {
    expect(layer).toContain("* 28");
    expect(layer).toContain("setPointerCapture");
    expect(layer).toContain("releasePointerCapture");
    expect(layer).toContain('physics === "ground"');
    expect(layer).toContain("active.velocityX * 80");
    expect(layer).toContain("bottomGap");
    expect(layer).toContain("displaySize = clamp(Math.max(80, size * 2), 80, 140)");
  });

  it("keeps visual overlays below navigation and never pauses unrelated learning audio", () => {
    expect(css).toContain(".festive-ambient-decorations { position: fixed; inset: 0; z-index: 50;");
    expect(css).toContain(".festive-visual-effects { position: fixed; inset: 0; z-index: 65;");
    expect(layer).toContain("zIndex: 60");
    expect(layer).not.toContain("document.querySelectorAll<HTMLAudioElement>(\"audio\")");
  });
});
