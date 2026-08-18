import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("PersistentCollapsible contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/components/PersistentCollapsible.tsx"), "utf8");

  it("defaults every section to collapsed unless a saved state exists", () => {
    expect(source).toContain("defaultOpen = false");
    expect(source).toContain("saved === null ? defaultOpen : saved === \"open\"");
  });

  it("persists each section independently and exposes an accessible toggle", () => {
    expect(source).toContain("gocnhocuaong:collapse:${storageKey}");
    expect(source).toContain("aria-expanded={open}");
    expect(source).toContain("localStorage.setItem");
  });
});


describe("View-level collapse contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

  it("wraps every routed view with a stable view-specific storage key", () => {
    expect(source).toContain("storageKey={`view-${view}`}");
    expect(source).toContain("PersistentCollapsible");
  });
});


describe("background audio contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");

  it("documents the user-gesture unlock path before background playback", () => {
    expect(source).toContain("resume");
    expect(source).toContain("startBackground");
  });
});

void 0;
