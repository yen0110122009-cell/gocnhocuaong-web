import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Audio-only companion contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("defines an accessible audio-only companion marker", () => {
    expect(source).toContain("function AudioOnlyCompanion");
    expect(source).toContain("chỉ báo audio-only");
    expect(source).not.toContain("function LumiMascot");
    expect(source).not.toContain("lumi-mascot-clean");
    expect(source).not.toContain("OngLearnerAvatar");
    expect(source).not.toContain("LumiMascot");
  });

  it("renders audio-only markers in login and authenticated shell locations", () => {
    expect(source).toContain('<AudioOnlyCompanion label="Lumi" />');
    expect(source).toContain('<AudioOnlyCompanion label="Ong" />');
    expect(source).toContain('compact />');
  });
});
