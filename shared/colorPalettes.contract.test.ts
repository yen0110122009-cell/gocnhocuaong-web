import { describe, expect, it } from "vitest";
import { COLOR_PALETTES, COLOR_PALETTE_IDS, normalizeCosmeticPaletteId } from "./colorPalettes";
import { emptyProfile, normalizeProfile } from "./study";

describe("color palette contract", () => {
  it("keeps exactly 18 high-contrast palettes with complete light and dark tokens", () => {
    expect(COLOR_PALETTE_IDS).toHaveLength(18);
    for (const id of COLOR_PALETTE_IDS) {
      const palette = COLOR_PALETTES[id];
      for (const mode of [palette.light, palette.dark]) {
        expect(mode.bgGradient).toContain("gradient");
        expect(mode.textPrimary).toMatch(/^#/);
        expect(mode.textSecondary).toMatch(/^#/);
        expect(mode.cardBg).toBeTruthy();
        expect(mode.accent).toMatch(/^#/);
        expect(mode.borderColor).toMatch(/^#/);
      }
    }
  });

  it("assigns stars only to the three mystical night palettes and aurora only to Cực Quang", () => {
    const stars = COLOR_PALETTE_IDS.filter((id) => "effectClass" in COLOR_PALETTES[id] && COLOR_PALETTES[id].effectClass === "bg-starry-twinkle");
    const aurora = COLOR_PALETTE_IDS.filter((id) => "effectClass" in COLOR_PALETTES[id] && COLOR_PALETTES[id].effectClass === "bg-aurora-glow");
    expect(stars).toEqual(["rung_dem_huyen_bi", "cham_dem_dien_lam", "vu_tru_huyen_dieu"]);
    expect(aurora).toEqual(["cuc_quang_tim_than"]);
  });

  it("normalizes legacy selections and restores all three festive toggles for legacy profiles", () => {
    expect(normalizeCosmeticPaletteId("ong-red")).toBe("ong_do_la_xanh");
    const profile = normalizeProfile({ ...emptyProfile(), activeCosmeticTheme: "neon-aurora" as never, festiveThemeOptions: { enableThemeTone: false } as never });
    expect(profile.activeCosmeticTheme).toBe("cuc_quang_tim_than");
    expect(profile.festiveThemeOptions).toEqual({ enableThemeTone: false, enableAmbientAudio: true, enableVFX: true });
  });
});
