import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Lumi mascot contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("defines an accessible Lumi mascot component with responsive variants", () => {
    expect(source).toContain("function LumiMascot");
    expect(source).toContain("aria-label=\"Lumi, bạn đồng hành của Ong\"");
    expect(source).toContain('/manus-storage/lumi-mascot-clean_28a6da68.png');
    expect(source).toContain('/manus-storage/ong-mascot-clean_079128db.png');
    expect(source).toContain('OngMascot');
    expect(source).toContain('size?: "hero" | "compact" | "sidebar"');
  });

  it("renders Lumi in the login hero, mobile login header, and authenticated sidebar", () => {
    expect(source).toContain("<LumiMascot />");
    expect(source).toContain('<LumiMascot size="compact" />');
    expect(source).toContain('<LumiMascot size="sidebar" />');
  });
});
