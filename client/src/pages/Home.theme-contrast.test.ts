import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const study = readFileSync(resolve(process.cwd(), "shared/study.ts"), "utf8");

function luminance(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)!.map((channel) => parseInt(channel, 16) / 255).map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function contrast(foreground: string, background: string) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

describe("tone giao diện và typography tương phản cao", () => {
  it("cung cấp bộ tone mở rộng có thể lưu trong profile", () => {
    for (const id of ["lavender-dream", "rose-garden", "midnight-indigo", "mint-cocoa", "terracotta-cream", "berry-ice", "jade-ivory", "copper-night", "coral-sky", "plum-gold", "sakura-ink", "neon-aurora"]) {
      expect(home).toContain(`id: "${id}"`);
      expect(study).toContain(`"${id}"`);
    }
  });

  it("gắn tone được chọn vào shell và tổng quan Kế hoạch", () => {
    expect(home).toContain("activeCosmeticTheme");
    expect(home).toContain("Kế hoạch hôm nay");
    expect(home).toContain("root.dataset.cosmeticTheme");
    expect(css).not.toContain("level-status-card");
    expect(css).toContain("--cosmetic-text-strong");
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

  it("khai báo token semantic riêng cho Light/Dark và surface có phân tách rõ", () => {
    for (const token of ["--theme-page", "--theme-surface", "--theme-surface-raised", "--theme-ink", "--theme-muted", "--theme-border", "--theme-focus"]) expect(css).toContain(token);
    expect(css).toContain(".dark {");
    expect(css).toContain("background-color: var(--theme-surface-raised) !important");
    expect(css).toContain("color: var(--theme-ink) !important");
    expect(css).toContain("border-color: var(--theme-border) !important");
  });

  it("đạt ngưỡng tương phản WCAG AA cho chữ chính, chữ phụ và control", () => {
    expect(contrast("#241815", "#fffaf1")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#5b4a43", "#fffdf8")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#f3f4f6", "#171311")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#d1d5db", "#27201d")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#f3f4f6", "#332a26")).toBeGreaterThanOrEqual(4.5);
  });

  it("bảo vệ chữ utility cũ và icon khi chuyển sang Dark mode", () => {
    expect(css).toContain(".dark :is(.text-black");
    expect(css).toContain(".dark :is(.bg-white");
    expect(css).toContain(".dark :is(.border-slate-100");
    expect(css).toContain("> svg { color: currentColor; }");
  });

  it("không đưa JavaScript tạo DOM trực tiếp từ nội dung tham chiếu vào ứng dụng", () => {
    expect(css).not.toContain("overlay.innerHTML");
  });

  it("cung cấp kho linh vật emoji có kéo thả và điểm lưu hồ sơ", () => {
    expect(home).toContain("Kho linh vật emoji");
    expect(home).toContain("FloatingEmojiPet");
    expect(home).toContain("setPointerCapture");
    expect(home).toContain("appearanceEmojiPet");
    expect(study).toContain("AppearanceEmojiPet");
  });
});
