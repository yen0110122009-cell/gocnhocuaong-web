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


describe("Item-level collapse scope contract", () => {
  const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
  const museum = readFileSync(resolve(process.cwd(), "client/src/pages/MuseumJourney.tsx"), "utf8");
  const pomodoro = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");
  const experienceStudio = readFileSync(resolve(process.cwd(), "client/src/components/ExperienceStudio.tsx"), "utf8");

  it("does not wrap an entire routed View in one collapsible container", () => {
    expect(home).not.toContain("storageKey={`view-${view}`}");
    expect(home).not.toContain("<PersistentCollapsible");
  });

  it("uses separate storage keys for independently collapsible content sections", () => {
    expect(museum).toContain('storageKey="museum-achievement-museum"');
    expect(museum).toContain('storageKey="museum-fragment-vault"');
    expect(museum).toContain('storageKey="museum-characters"');
    expect(pomodoro).not.toContain('storageKey="pomodoro-audio-center"');
    expect(pomodoro).toContain('storageKey="pomodoro-weekly-goal-history"');
    expect(experienceStudio).toContain('storageKey="experience-ambient-audio"');
    expect(experienceStudio).toContain('storageKey="experience-emotion-command"');
    expect(experienceStudio).toContain('storageKey="experience-lumi-speech-library"');
  });
});


describe("background audio contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/Pomodoro.tsx"), "utf8");

  it("documents alert playback and preserves the audio unlock helper without ambient playback", () => {
    expect(source).toContain("resume");
    expect(source).toContain("playSequence");
    expect(source).not.toContain("startBackground");
    expect(source).not.toContain("backgroundVolume");
  });
});

void 0;
