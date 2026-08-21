import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("bốn cảnh theo mùa và sự kiện", () => {
  it("đồng bộ nền, chữ, panel và điều khiển của từng scene", () => {
    for (const scene of ["summer", "spring", "tet", "halloween"]) {
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] { --scene-page:`);
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] body`);
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] #root > div.min-h-screen`);
    }
    expect(css).toContain("var(--scene-card)");
    expect(css).toContain("var(--scene-text)");
    expect(css).toContain("var(--scene-accent)");
  });

  it("dựng lớp cảnh thuần CSS cho nắng hè, hoa xuân và không khí Tết", () => {
    expect(css).toContain('data-ambient-scene="summer"] #root > div.min-h-screen::before');
    expect(css).toContain("summer-fireflies");
    expect(css).toContain('data-ambient-scene="spring"] #root > div.min-h-screen::after');
    expect(css).toContain("spring-petal-fall");
    expect(css).toContain('data-ambient-scene="tet"] #root > div.min-h-screen::after');
    expect(css).toContain("tet-lantern-glow");
    expect(css).toContain("tet-sparkle");
    expect(css).toContain("--scene-page: #fff0f5");
    expect(css).toContain("height: 6.4rem");
  });

  it("đặt ma và dơi Halloween trên nội dung, không chặn thao tác và chỉ xuất hiện theo nhịp thưa", () => {
    expect(css).toContain('data-ambient-scene="halloween"] #root > div.min-h-screen::after');
    expect(css).toContain("z-index: 54");
    expect(css).toContain("pointer-events: none");
    expect(css).toContain("halloween-flyby 26s");
    expect(css).toContain("0%, 10%, 24%, 60%, 74%, 100%");
    expect(css).toContain("data:image/svg+xml");
    expect(css).toContain("height: 8rem");
    expect(css).toContain("background-size: cover");
  });

  it("giữ responsive và respects prefers-reduced-motion cho lớp cảnh mới", () => {
    expect(css).toContain("@media (max-width: 767px)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain('data-ambient-scene="halloween"] #root > div.min-h-screen::after { animation: none !important; }');
  });

  it("dùng lớp phủ toàn giao diện, token màu mùa rõ ràng và không chặn thao tác", () => {
    expect(css).toContain("z-index: 9999");
    expect(css).toContain("z-index: 10000");
    expect(css).toContain("pointer-events: none");
    expect(css).toContain("--scene-page: #f4a460");
    expect(css).toContain("--scene-page: #87ceeb");
    expect(css).toContain("--scene-page: #2c003e");
    expect(css).toContain("--scene-page: #d0e8f2");
    expect(css).toContain("--scene-page: #4a5568");
    expect(css).toContain("--scene-page: #fff0f5");
    expect(css).toContain("🍂  🍁");
    expect(css).toContain("border-top: 4px solid");
  });

  it("khai báo token cảnh và màu chữ tương phản cho đủ sáu cảnh được chuẩn hóa", () => {
    for (const scene of ["leaves", "summer", "halloween", "snow", "rain", "spring"]) {
      expect(css).toMatch(new RegExp(`:root\\[data-ambient-scene="${scene}"\\] \\{[^}]*--scene-page:[^}]*--scene-text:`));
    }
  });

  it("có Sa mạc, Cảnh đêm và sấm chớp với lớp phủ toàn giao diện không cản thao tác", () => {
    expect(css).toContain(':root[data-ambient-scene="desert"] { --scene-page:');
    expect(css).toContain(':root[data-ambient-scene="night"] { --scene-page:');
    expect(css).toContain("storm-lightning-strike");
    expect(css).toContain("pointer-events:none");
  });

  it("khai báo đủ 14 theme thiên nhiên và đô thị với token màu đồng bộ", () => {
    for (const scene of ["desert", "naturepark", "sunrise", "mountainsunset", "meteorice", "galaxy", "cityday", "citysunset", "citydusk", "citynight", "bridgefog", "urbanfog", "sparklers", "fireworks"]) {
      expect(css).toContain(`:root[data-ambient-scene="${scene}"]`);
    }
    expect(css).toContain("--scene-page:");
    expect(css).toContain("--scene-text:");
    expect(css).toContain("--scene-accent:");
  });

  it("giữ lớp phủ CSS toàn màn hình, thuần hiển thị và tôn trọng reduced-motion cho bộ cảnh mới", () => {
    expect(css).toContain(':root[data-ambient-scene="naturepark"] #root > div.min-h-screen::before');
    expect(css).toContain(':root[data-ambient-scene="fireworks"] #root > div.min-h-screen::before');
    expect(css).toContain('content:"✹');
    expect(css).toContain("position:fixed; inset:0; z-index:54; pointer-events:none");
    expect(css).toContain('@media (prefers-reduced-motion: reduce) { :root[data-ambient-scene="naturepark"]');
  });

  it("khai báo token và lớp phủ fixed cho chín cảnh thiên nhiên, không gian và lễ hội bổ sung", () => {
    for (const scene of ["forest", "sunset", "space", "crescentmoon", "ocean", "neon", "sakura", "autumn", "festival"]) {
      expect(css).toMatch(new RegExp(`:root\\[data-ambient-scene="${scene}"\\] \\{[^}]*--scene-page:[^}]*--scene-text:[^}]*--scene-accent:`));
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] #root > div.min-h-screen::before`);
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] body::after`);
    }
    expect(css).toContain("position:fixed; inset:0; z-index:54; pointer-events:none");
  });

  it("giới hạn tương tác ánh sáng cho pháo hoa và loại bỏ hiệu ứng theo con trỏ khi reduced-motion", () => {
    expect(css).toContain("var(--scene-pointer-x,72%) var(--scene-pointer-y,19%)");
    expect(css).toContain(':root[data-ambient-scene="festival"] #root > div.min-h-screen::before');
    expect(css).toContain('@media (prefers-reduced-motion: reduce) { :root[data-ambient-scene="fireworks"]');
  });

  it("dựng năm theme sáng tạo với token đồng bộ, lớp phủ thuần CSS/emoji và trợ năng chuyển động", () => {
    for (const scene of ["volcano", "deepocean", "magicforest", "spacestation", "flowerfield"]) {
      expect(css).toMatch(new RegExp(`:root\\[data-ambient-scene="${scene}"\\] \\{[^}]*--scene-page:[^}]*--scene-text:[^}]*--scene-accent:`));
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] #root > div.min-h-screen::before`);
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] body::after`);
    }
    expect(css).toContain('content:"🌋');
    expect(css).toContain('content:"🐋');
    expect(css).toContain('content:"🍄');
    expect(css).toContain('content:"🌻');
    expect(css).toContain("scene-new-theme-breathe");
    expect(css).toContain(':root[data-ambient-scene="volcano"] #root > div.min-h-screen::before,:root[data-ambient-scene="deepocean"]');
    expect(css).toContain("deepocean-whale-glide");
    expect(css).toContain("deepocean-bubbles-rise");
    expect(css).toContain("magicforest-butterfly-float");
    expect(css).toContain("flowerfield-pollinator-flight");
    expect(css).toContain("spacestation-scan-sweep");
    expect(css).toContain("spacestation-orbit-drift");
    expect(css).toContain("#ee896b");
    expect(css).toContain(':root[data-ambient-scene="deepocean"] #root > div.min-h-screen::after');
    expect(css).toContain('@media (prefers-reduced-motion: reduce) { :root[data-ambient-scene="deepocean"] #root > div.min-h-screen::after');
  });

  it("dựng năm theme kể chuyện với palette, lớp phủ CSS/emoji và chuyển động có thể giảm", () => {
    for (const scene of ["fairytale", "circus", "prehistoric", "cyberrace", "foodfestival"]) {
      expect(css).toMatch(new RegExp(`:root\\[data-ambient-scene="${scene}"\\] \\{[^}]*--scene-page:[^}]*--scene-text:[^}]*--scene-accent:`));
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] #root > div.min-h-screen::before`);
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] body::after`);
      expect(css).toContain(`:root[data-ambient-scene="${scene}"] #root > div.min-h-screen::after`);
    }
    expect(css).toContain('content:"🏰');
    expect(css).toContain('content:"🎪');
    expect(css).toContain('content:"🦕');
    expect(css).toContain('content:"🏎️');
    expect(css).toContain('content:"🧋');
    expect(css).toContain('content:"🧚');
    expect(css).toContain('content:"🎈');
    expect(css).toContain('content:"🐾');
    expect(css).toContain('content:"🚦');
    expect(css).toContain('content:"🍕');
    expect(css).toContain("🍦");
    expect(css).toContain("--scene-text:#ffe79b");
    expect(css).toContain("--scene-page-alt:#173661");
    expect(css).toContain("scene-story-sparkle");
    expect(css).toContain("scene-story-balloons-rise");
    expect(css).toContain("scene-story-dino-stroll");
    expect(css).toContain("scene-story-race");
    expect(css).toContain("scene-story-food-fall");
    expect(css).toContain('@media (prefers-reduced-motion: reduce) {\n  :root[data-ambient-scene="fairytale"]');
    expect(css).toContain("position:fixed; inset:0; z-index:54; pointer-events:none");
  });

  it("nâng Tết Cổ Truyền bằng palette đỏ-vàng, lồng đèn, hoa rơi và reduced-motion", () => {
    expect(css).toContain("--scene-page: #b71c1c");
    expect(css).toContain("--scene-side: #4a0000");
    expect(css).toContain("--scene-text: #fffdd0");
    expect(css).toContain("tet-lantern-sway");
    expect(css).toContain("tet-petals-and-festival-fall");
    expect(css).toContain('content: "🧧"');
    expect(css).toContain(':root[data-ambient-scene="tet"] body::before');
  });

  it("neo đủ chi tiết Tết: lồng đèn hai góc, cây hoa ở đáy và bánh chưng/bánh tét cố định", () => {
    expect(css).toContain("background-position: left 1rem top -.65rem, right 1rem top -.65rem");
    expect(css).toContain("-2.5rem calc(100% + 1rem)");
    expect(css).toContain("background-position: calc(100% - 3.35rem) calc(100% - .45rem)");
    expect(css).toContain("fill='%234d8d41'");
    expect(css).toContain("fill='%235b9946'");
    expect(css).toContain("z-index: 9998");
  });
});
