import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const study = readFileSync(resolve(process.cwd(), "shared/study.ts"), "utf8");

describe("tone giao diện và typography tương phản cao", () => {
  it("cung cấp bộ tone mở rộng có thể lưu trong profile", () => {
    for (const id of ["lavender-dream", "rose-garden", "midnight-indigo", "mint-cocoa", "terracotta-cream", "berry-ice", "jade-ivory", "copper-night", "coral-sky", "plum-gold", "sakura-ink", "neon-aurora"]) {
      expect(home).toContain(`id: "${id}"`);
      expect(study).toContain(`"${id}"`);
    }
  });

  it("gắn tone được chọn vào cả shell và thẻ cấp độ hiện tại", () => {
    expect(home).toContain("activeCosmeticTheme");
    expect(home).toContain("level-status-card");
    expect(home).toContain("root.dataset.cosmeticTheme");
    expect(css).toContain("level-status-card");
    expect(css).toContain("--cosmetic-level-bg");
  });

  it("áp dụng token chữ tương phản cao trên nền sáng và tối", () => {
    expect(css).toContain("--cosmetic-text");
    expect(css).toContain("--cosmetic-muted");
    expect(css).toContain("--cosmetic-text-strong");
    expect(css).toContain("color: var(--cosmetic-text-strong)");
    expect(css).toContain(":root.dark[data-cosmetic-theme]");
    expect(css).toContain("--season-night-ink");
  });

  it("đồng bộ shell, sidebar, header và chữ với token cảnh thay vì màu utility cũ", () => {
    expect(css).toContain('#root > .min-h-screen > aside');
    expect(css).toContain('#root > .min-h-screen > div > header');
    expect(css).toContain('background: var(--scene-page) !important');
    expect(css).toContain('background: var(--scene-card) !important');
    expect(css).toContain('color: var(--scene-text) !important');
    expect(css).toContain('color: var(--scene-muted) !important');
    expect(css).toContain('[class*="bg-[#"]');
    expect(css).toContain('button[aria-current="page"]');
    expect(home).toContain('bg-[var(--scene-accent)]');
    expect(home).toContain('text-[var(--scene-muted)]');
    expect(home).toContain('border-[var(--scene-border)]');
    expect(home).toContain('linear-gradient(90deg,var(--scene-accent),var(--scene-accent-alt))');
    expect(home).not.toContain('active ? "bg-[#c62828]');
  });
});
