import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { emotionThemes, emotionFromCommand } from "../lib/emotionThemes";

const studioSource = await import.meta.glob("./ExperienceStudio.tsx", { query: "?raw", import: "default", eager: true })["./ExperienceStudio.tsx"] as string;
const homeSource = await import.meta.glob("../pages/Home.tsx", { query: "?raw", import: "default", eager: true })["../pages/Home.tsx"] as string;
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

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
    expect(studioSource).toContain("OngLearnerAvatar");
    expect(studioSource).toContain("companionImage");
  });

  it("restores a saved emotion at most once and delegates DOM theme ownership to the app controller", () => {
    expect(studioSource).toContain("restoredEmotionRef");
    expect(studioSource).toContain("if (restoredEmotionRef.current) return;");
    expect(studioSource).not.toContain("root.dataset.emotion = selected");
    expect(homeSource).toContain("function EmotionThemeController");
    expect(homeSource).toContain("new MutationObserver");
    expect(homeSource).toContain("study-empire:emotion-change");
  });

  it("does not animate full background images while changing emotion palettes", () => {
    expect(cssSource).not.toContain("background-image 240ms");
    expect(cssSource).toContain("transition: border-color 160ms");
  });

  it("shows Lumi as a companion with an image, a direct listen control and environmental scenes", () => {
    expect(studioSource).toContain("Lumi đang ở đây");
    expect(studioSource).toContain("Nghe lời thoại Lumi");
    expect(studioSource).toContain("configuredLumiImage");
    expect(studioSource).toContain("ambientScene");
    expect(studioSource).toContain("Âm thanh và cảnh nền");
    expect(studioSource).toContain("profile?.defaultAmbientScene");
    expect(studioSource).toContain("defaultAmbientScene: ambientScene");
  });

  it("does not retain purchasable cosmetic theme selectors after switching to emotion-based colors", () => {
    expect(cssSource).not.toContain("data-cosmetic-theme");
    expect(cssSource).not.toContain("data-cosmetic-background");
  });
});
