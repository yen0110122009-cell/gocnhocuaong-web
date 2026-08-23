import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("theme audio and space scene fix", () => {
  it("applies the selected ambient scene to the document root", () => {
    expect(home).toContain('root.dataset.ambientScene = profile.defaultAmbientScene ?? "none";');
  });

  it("starts and stops theme audio through one stable popup audio element", () => {
    expect(home).toContain('<audio ref={audioRef} src={audioTheme.url}');
    expect(home).toContain("const toggleThemeAudio = () => {");
    expect(home).toContain("void player.play()");
    expect(home).toContain("const handleThemeAudioError = () => {");
    expect(home).toContain("audioUnavailable");
    expect(home).toContain("onError={handleThemeAudioError}");
    expect(home).toContain("player.pause();");
    expect(home).not.toContain("setAudioUnlocked(true)");
    expect(home).not.toContain("const player = audioRef.current ?? new Audio();");
  });

  it("keeps the Space scene visible without a dark full-screen veil", () => {
    expect(css).toContain(':root[data-ambient-scene="space"] #root > div.min-h-screen');
    expect(css).toContain(':root[data-ambient-scene] #root > div.min-h-screen::before,');
    expect(css).toContain('content: none !important;');
    expect(css).toContain('display: none !important;');
    expect(css).toContain('background: none !important;');
  });
});
