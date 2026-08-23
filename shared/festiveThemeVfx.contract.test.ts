import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { FESTIVE_THEME_CONFIGS, FESTIVE_THEME_DECORATIONS, STUDENT_THEME_CONFIGS, USER_PROVIDED_FESTIVE_AUDIO } from "../client/src/lib/festiveThemes";

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
    expect(layer).toContain("const targetCount = theme.groundContainer.itemCount ?? 28");
    expect(layer).toContain("setPointerCapture");
    expect(layer).toContain("releasePointerCapture");
    expect(layer).toContain('"gravity-heavy", "float-feather", "sticker-pin", "bounce-elastic", "vanish-ghost"');
    expect(layer).toContain('physics === "gravity-heavy"');
    expect(layer).toContain('physics === "bounce-elastic"');
    expect(layer).toContain('physics === "vanish-ghost"');
    expect(layer).toContain("active.velocityX * 80");
    expect(layer).toContain("bottomGap");
    expect(layer).toContain("displaySize = exactSize ? size : clamp(Math.max(100, size * 2), 100, 140)");
    expect(layer).toContain("const mascotSize = config ? 130 : 0");
    expect(layer).toContain("bindMascotDrag(mascot)");
    expect(layer).toContain("width: 130, height: 130, fontSize: 130");
    expect(layer).toContain("stableHash");
  });

  it("locks the original five student themes to the requested counts and fixed sizes", () => {
    const expected = { sweet_strawberry: ["🍰", 12], black_ribbon: ["⚡", 6], library_chill: ["☕", 8], after_school: ["🍋", 10], classic_academy: ["🎼", 15] } as const;
    expect(STUDENT_THEME_CONFIGS).toHaveLength(10);
    for (const [id, [emoji, count]] of Object.entries(expected)) {
      const theme = STUDENT_THEME_CONFIGS.find((candidate) => candidate.id === id);
      expect(theme).toBeTruthy();
      expect(theme?.mascot.emoji).toBe(({ sweet_strawberry: "🐱", black_ribbon: "🕶️", library_chill: "🦉", after_school: "🐝", classic_academy: "🦢" } as const)[id as keyof typeof expected]);
      expect(theme?.mascot.size).toBe("130px");
      expect(theme?.groundContainer.itemCount).toBe(25);
      expect(theme?.groundContainer.items[0]?.emoji).toBe(({ sweet_strawberry: "🍓", black_ribbon: "🖤", library_chill: "📖", after_school: "🎒", classic_academy: "🎻" } as const)[id as keyof typeof expected]);
      expect(theme?.groundContainer.items[0]?.size).toBe("100px");
      const decoration = FESTIVE_THEME_DECORATIONS[id]?.[0];
      expect(decoration).toMatchObject({ emoji, count, size: "40px" });
    }
  });

  it("locks the five follow-up student themes to the requested counts and fixed sizes", () => {
    const expected = { cyber_highschool: ["🌟", 14], spring_fresh: ["🌸", 16], summer_ocean: ["🫧", 12], autumn_leaves: ["🍁", 15], winter_snow: ["❄️", 18] } as const;
    const mascots = { cyber_highschool: "👾", spring_fresh: "🐦", summer_ocean: "🦀", autumn_leaves: "🐿️", winter_snow: "☃️" } as const;
    const ground = { cyber_highschool: "💿", spring_fresh: "🌱", summer_ocean: "🐚", autumn_leaves: "🌰", winter_snow: "🧊" } as const;
    for (const [id, [emoji, count]] of Object.entries(expected)) {
      const theme = STUDENT_THEME_CONFIGS.find((candidate) => candidate.id === id);
      expect(theme).toBeTruthy();
      expect(theme?.mascot.emoji).toBe(mascots[id as keyof typeof mascots]);
      expect(theme?.mascot.size).toBe("130px");
      expect(theme?.groundContainer.itemCount).toBe(25);
      expect(theme?.groundContainer.items[0]?.emoji).toBe(ground[id as keyof typeof ground]);
      expect(theme?.groundContainer.items[0]?.size).toBe("100px");
      expect(FESTIVE_THEME_DECORATIONS[id]?.[0]).toMatchObject({ emoji, count, size: "40px" });
    }
  });

  it("keeps one non-blocking high-priority VFX stage and never pauses unrelated learning audio", () => {
    expect(css).toContain("#vfx-stage { position: fixed; inset: 0; z-index: 9999 !important; pointer-events: none;");
    expect(css).toContain(".festive-visual-effects { position: fixed; inset: 0; z-index: 1; pointer-events: none;");
    expect(css).toContain(".festive-ground { position: fixed; inset-inline: 0; pointer-events: none;");
    expect(css).toContain(".festive-mascot { position: fixed; display: grid; place-items: center; min-width: 130px;");
    expect(css).toContain(".min-h-screen > aside");
    expect(css).toContain("z-index: 100 !important");
    expect(layer).toContain("zIndex: 60");
    expect(layer).not.toContain("document.querySelectorAll<HTMLAudioElement>(\"audio\")");
  });

  it("separates festive tone and VFX state while leaving the personal companion independent", () => {
    expect(layer).toContain("toneEnabled = true");
    expect(layer).toContain("vfxEnabled = true");
    expect(layer).toContain("if (!config || !resolvedVfxEnabled) return children ? <div id=\"vfx-stage\"");
    expect(layer).toContain("if (!config || !resolvedToneEnabled)");
    expect(home).toContain('root.dataset.festiveTone');
    expect(home).toContain('root.dataset.festiveVfx');
    expect(home).toContain("festiveOptions.enableAmbientAudio");
    expect(home).toContain("toneEnabled={profile.festiveThemeOptions?.enableThemeTone !== false}");
    expect(home).toContain("vfxEnabled={profile.festiveThemeOptions?.enableVFX !== false}");
    expect(layer).toContain("personalMascot={children}");
  });

  it("registers all fourteen festive audio sources locally and plays only after a user gesture", () => {
    expect(Object.keys(USER_PROVIDED_FESTIVE_AUDIO)).toHaveLength(14);
    expect(new Set(Object.values(USER_PROVIDED_FESTIVE_AUDIO)).size).toBe(14);
    expect(Object.values(USER_PROVIDED_FESTIVE_AUDIO).every((url) => url.includes("/audio/festive-") && url.endsWith(".mp3"))).toBe(true);
    for (const url of Object.values(USER_PROVIDED_FESTIVE_AUDIO)) {
      const file = url.split("/audio/")[1];
      expect(file).toBeTruthy();
      expect(readFileSync(resolve(process.cwd(), "client/public/audio", file!)).byteLength).toBeGreaterThan(1024);
    }
    expect(home).toContain("FESTIVE_AUDIO_FALLBACKS");
    expect(home).toContain("handleThemeAudioError");
    expect(home).toContain("fallbackUrl");
    expect(home).toContain("void player.play().then(() => {");
    expect(home).not.toContain("player.load();");
    expect(home).toContain("Không thể phát nguồn âm nền này.");
  });
});
