import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("theme audio and space scene fix", () => {
  it("applies the selected ambient scene to the document root", () => {
    expect(home).toContain('root.dataset.ambientScene = profile.defaultAmbientScene ?? "morning";');
  });

  it("starts theme audio from the user selection handler", () => {
    expect(home).toContain("const player = audioRef.current ?? new Audio();");
    expect(home).toContain("player.src = audio.url;");
    expect(home).toContain("void player.play().catch(() => undefined);");
  });

  it("keeps the Space scene visible without a dark full-screen veil", () => {
    expect(css).toContain(':root[data-ambient-scene="space"] #root > div.min-h-screen');
    expect(css).toContain(':root[data-ambient-scene] #root > div.min-h-screen::before,');
    expect(css).toContain('content: none !important;');
    expect(css).toContain('display: none !important;');
    expect(css).toContain('background: none !important;');
  });
});
