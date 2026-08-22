import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

describe("Navigation and Experience Studio UI contract", () => {
  it("keeps the sidebar menu independently scrollable on short viewports", () => {
    const css = readFileSync(resolve(projectRoot, "client/src/index.css"), "utf8");
    expect(css).toContain("#root > div.min-h-screen > aside > nav.mt-2.space-y-1");
    expect(css).toContain("overflow-y: auto");
    expect(css).toContain("min-height: 0");
    expect(css).toContain("flex: 1 1 0%");
  });

  it("does not render the removed lazy-mode choices", () => {
    const component = readFileSync(resolve(projectRoot, "client/src/components/ExperienceStudio.tsx"), "utf8");
    expect(component).not.toContain("Chế độ lười");
    expect(component).not.toContain("Hơi lười");
    expect(component).not.toContain("Rất lười");
    expect(component).not.toContain("Không muốn làm gì");
  });
});
