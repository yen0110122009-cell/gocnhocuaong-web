import { describe, expect, it } from "vitest";
import fs from "node:fs";

const home = fs.readFileSync("client/src/pages/Home.tsx", "utf8");
const css = fs.readFileSync("client/src/index.css", "utf8");

describe("Góc Ong dark theme and mascot preview", () => {
  it("exposes the audio-backed Coffee/Góc Ong theme", () => {
    expect(home).toContain('id: "coffee", label: "Góc Ong · Đêm ấm"');
    expect(home).toContain('from-[#241613] via-[#6f3023] to-[#a84f2f]');
  });

  it("uses a neutral mascot stage without the legacy sun decoration", () => {
    expect(home).toContain("mascot-preview-stage");
    expect(home).not.toContain('aria-hidden="true">☀️</span>');
  });

  it("keeps the reference treatment transparent and interaction-safe", () => {
    expect(css).toContain('data-ambient-scene="coffee"] .mascot-preview-stage::after');
    expect(css).toContain("pointer-events:none");
    expect(css).toContain("--scene-text:#fff7ed");
  });
});
