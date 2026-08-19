import { describe, expect, it } from "vitest";
import { normalizeProfile } from "./study";

describe("Companion emotion media normalization", () => {
  it("migrates one legacy Lumi voice URL to one labelled recording without removing the legacy URL", () => {
    const profile = normalizeProfile({ companionEmotionMedia: { calm: { lumiVoiceUrl: "https://audio.example/legacy.webm" } } });
    const media = profile.companionEmotionMedia?.calm;
    expect(media?.lumiVoiceUrl).toBe("https://audio.example/legacy.webm");
    expect(media?.lumiVoiceRecordings).toEqual([{ id: "legacy-calm", url: "https://audio.example/legacy.webm", label: "Bản thu Lumi đã lưu", createdAt: new Date(0).toISOString() }]);
  });

  it("preserves valid recording lists and only keeps a favorite that belongs to the emotion library", () => {
    const profile = normalizeProfile({ companionEmotionMedia: { happy: { lumiVoiceRecordings: [{ id: "first", url: "https://audio.example/first.webm", label: "Lời chào", createdAt: "2026-08-19T00:00:00.000Z" }, { id: "second", url: "https://audio.example/second.webm", label: "Động viên", createdAt: "2026-08-19T01:00:00.000Z" }], favoriteLumiVoiceId: "second" }, sad: { lumiVoiceRecordings: [{ id: "only", url: "https://audio.example/only.webm", label: "An ủi", createdAt: "2026-08-19T01:00:00.000Z" }], favoriteLumiVoiceId: "missing" } } });
    expect(profile.companionEmotionMedia?.happy?.lumiVoiceRecordings).toHaveLength(2);
    expect(profile.companionEmotionMedia?.happy?.favoriteLumiVoiceId).toBe("second");
    expect(profile.companionEmotionMedia?.sad?.favoriteLumiVoiceId).toBeUndefined();
  });
});
