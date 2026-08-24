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
    expect(source).toContain("if (!pet || hidden) return null;");
    expect(source).toContain("<FestiveThemeLayer");
    expect(source).toContain("><FloatingEmojiPet profile={profile} onProfile={persistProfile} /></FestiveThemeLayer>");
    expect(source).toContain("vfxEnabled={profile.festiveThemeOptions?.enableVFX !== false}");
    expect(source).toContain('window.matchMedia("(prefers-reduced-motion: reduce)")');
    expect(source).toContain("if (!pet || !roamingEnabled || dragging || reducedMotion) return;");
    expect(source).not.toContain('pointer-events-none fixed inset-0 z-[45]');
    expect(source).toContain('"fixed z-[10000]');
    expect(source).toContain("width: 130, height: 130, fontSize: 130, display: \"block\", opacity: 1");
    expect(source).toContain('aria-label="Đặt lại vị trí linh vật"');
    expect(source).toContain('const next = { x: 50, y: 72 };');
    expect(source).toContain("function playMascotFeedback");
    expect(source).toContain("window.AudioContext");
    expect(source).toContain("const draggingRef = useRef(false);");
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

  it("giữ bảng âm nền là dialog có thể thoát bằng Escape, nhấn nền và nút đóng", () => {
    expect(source).toContain('aria-label="Điều khiển âm nền theme"');
    expect(source).toContain('onClick={dismissAudioTheme}');
    expect(source).toContain('event.key === "Escape"');
    expect(source).toContain('audioThemeTriggerRef.current?.focus()');
  });

  it("có chế độ nhẹ mobile, điều hướng đáy và không khóa zoom", () => {
    expect(source).toContain("MOBILE_PERFORMANCE_STORAGE_KEY");
    expect(source).toContain('root.dataset.mobilePerformance = mobilePerformanceMode ? "light" : "full"');
    expect(source).toContain("function MobileBottomNav");
    expect(source).toContain('className="mobile-bottom-nav"');
    expect(css).toContain(':root[data-mobile-performance="light"]');
    const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
    expect(indexHtml).toContain('viewport-fit=cover');
    expect(indexHtml).not.toContain("maximum-scale=1");
  });
});
