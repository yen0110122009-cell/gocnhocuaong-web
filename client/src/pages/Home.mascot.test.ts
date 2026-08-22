import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Home không còn ảnh hay marker Lumi/Ong", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
  const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

  it("giữ compatibility component nhưng không render minh họa đồng hành", () => {
    expect(source).toContain("function AudioOnlyCompanion(_: { label:");
    expect(source).toContain("return null;");
    expect(source).not.toContain("function LumiMascot");
    expect(source).not.toContain("lumi-mascot-clean");
    expect(source).not.toContain("OngLearnerAvatar");
    expect(source).not.toContain("LumiMascot");
  });

  it("dùng thương hiệu chữ thuần thay vì SVG con Ong ở shell và đăng nhập", () => {
    expect(source).toContain("Không gian học tập cá nhân");
    expect(source).not.toContain('<svg viewBox="0 0 64 64"');
    expect(css).toContain("#root > div.min-h-screen > aside > .my-6 { display: none !important; }");
  });

  it("để linh vật đi dạo trong viewport nhưng không chặn menu hoặc thao tác học", () => {
    expect(source).toContain('hidden={view === "appearance"}');
    expect(source).toContain("if (!pet || hidden) return null;");
    expect(source).toContain('window.matchMedia("(prefers-reduced-motion: reduce)")');
    expect(source).toContain("if (!pet || !roamingEnabled || dragging || reducedMotion) return;");
    expect(source).toContain('className="pointer-events-none fixed inset-0 z-[25]"');
    expect(source).toContain('"pointer-events-auto absolute');
    expect(source).toContain("Math.max(8, Math.min(90");
    expect(source).toContain("Math.max(5, Math.min(95");
    expect(source).toContain("appearanceEmojiPet: { ...pet, x: draft.x, y: draft.y, roam: true, roamingEnabled: true }");
  });

  it("chỉ kích hoạt ánh sáng theo con trỏ ở cảnh Pháo hoa hoặc Lễ hội và luôn dọn dẹp listener", () => {
    expect(source).toContain('profile.defaultAmbientScene === "fireworks" || profile.defaultAmbientScene === "festival"');
    expect(source).toContain('window.matchMedia("(prefers-reduced-motion: reduce)")');
    expect(source).toContain('window.addEventListener("pointermove", updatePointerGlow, { passive: true })');
    expect(source).toContain('window.removeEventListener("pointermove", updatePointerGlow)');
    expect(source).toContain('root.style.removeProperty("--scene-pointer-x")');
  });
});
