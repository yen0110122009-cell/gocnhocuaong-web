import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const componentSource = fs.readFileSync(path.resolve(process.cwd(), "client/src/components/EmotionCompanionMediaControls.tsx"), "utf8");

describe("Lumi recording visualizer contracts", () => {
  it("connects the microphone stream to an analyser and animates realtime levels", () => {
    expect(componentSource).toContain("createMediaStreamSource(stream)");
    expect(componentSource).toContain("createAnalyser()");
    expect(componentSource).toContain("getByteFrequencyData");
    expect(componentSource).toContain("requestAnimationFrame(draw)");
    expect(componentSource).toContain("recordingLevels");
  });

  it("cleans up the animation frame and AudioContext when recording stops or unmounts", () => {
    expect(componentSource).toContain("cancelAnimationFrame");
    expect(componentSource).toContain("context.close()");
    expect(componentSource).toContain("stopVisualizer()");
  });

  it("exposes an accessible visualizer and recording status on the mobile-friendly control", () => {
    expect(componentSource).toContain('role="img" aria-label="Sóng âm đang ghi âm"');
    expect(componentSource).toContain('role="status" aria-live="polite"');
    expect(componentSource).toContain("Đang thu âm từ micro. Đã ghi");
  });
});

export {};
