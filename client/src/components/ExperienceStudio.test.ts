import { describe, expect, it } from "vitest";
import { emotionThemes, emotionFromCommand } from "../lib/emotionThemes";

const studioSource = await import.meta.glob("./ExperienceStudio.tsx", { query: "?raw", import: "default", eager: true })["./ExperienceStudio.tsx"] as string;

describe("Experience Studio requirements", () => {
  it("keeps a broad emotion catalog with encouragement and mascot mapping", () => {
    expect(emotionThemes.length).toBeGreaterThanOrEqual(6);
    expect(emotionThemes.every((theme) => theme.encouragement.length > 20)).toBe(true);
    expect(emotionThemes.every((theme) => theme.mascot === "lumi" || theme.mascot === "ong")).toBe(true);
  });

  it("supports safe mood command routing", () => {
    expect(emotionFromCommand("bật theme vui vẻ").id).toBe("happy");
    expect(emotionFromCommand("tôi đang mệt").id).toBe("tired");
    expect(emotionFromCommand("lệnh không xác định").id).toBe("calm");
  });

  it("contains the required non-pressure learning flows and red-green visual tokens", () => {
    expect(studioSource).toContain("Chế độ lười");
    expect(studioSource).toContain("Thử 2 phút");
    expect(studioSource).toContain("Boss Trì hoãn");
    expect(studioSource).toContain("Ong vs Trì hoãn");
    expect(studioSource).toContain("#c62828");
    expect(studioSource).toContain("#2e7d32");
    expect(studioSource).toContain("companionImage");
    expect(studioSource).toContain("learnerImage");
    expect(studioSource).toContain("lumi-mascot-clean_28a6da68.png");
    expect(studioSource).toContain("study-historia-bee-mascot_45260784.png");
  });
});
