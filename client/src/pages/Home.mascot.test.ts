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
});
