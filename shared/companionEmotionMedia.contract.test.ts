import { describe, expect, it } from "vitest";
import { normalizeProfile } from "./study";

describe("Companion emotion media normalization", () => {
  it("migrates one legacy Lumi voice URL to one labelled recording without removing the legacy URL", () => {
    const profile = normalizeProfile({ companionEmotionMedia: { calm: { lumiVoiceUrl: "https://audio.example/legacy.webm" } } });
    const media = profile.companionEmotionMedia?.calm;
    expect(media?.lumiVoiceUrl).toBe("https://audio.example/legacy.webm");
    expect(media?.lumiVoiceRecordings).toEqual([{ id: "legacy-calm", url: "https://audio.example/legacy.webm", label: "Bản thu Lumi đã lưu", createdAt: new Date(0).toISOString(), imageUrl: undefined, colorLabel: undefined }]);
  });

  it("preserves valid recording lists and only keeps a favorite that belongs to the emotion library", () => {
    const profile = normalizeProfile({ companionEmotionMedia: { happy: { lumiVoiceRecordings: [{ id: "first", url: "https://audio.example/first.webm", label: "Lời chào", createdAt: "2026-08-19T00:00:00.000Z" }, { id: "second", url: "https://audio.example/second.webm", label: "Động viên", createdAt: "2026-08-19T01:00:00.000Z" }], favoriteLumiVoiceId: "second" }, sad: { lumiVoiceRecordings: [{ id: "only", url: "https://audio.example/only.webm", label: "An ủi", createdAt: "2026-08-19T01:00:00.000Z" }], favoriteLumiVoiceId: "missing" } } });
    expect(profile.companionEmotionMedia?.happy?.lumiVoiceRecordings).toHaveLength(2);
    expect(profile.companionEmotionMedia?.happy?.favoriteLumiVoiceId).toBe("second");
    expect(profile.companionEmotionMedia?.sad?.favoriteLumiVoiceId).toBeUndefined();
  });

  it("binds each Lumi recording to its saved image while migrating older recordings to the emotion image", () => {
    const profile = normalizeProfile({ companionEmotionMedia: { calm: { lumiImageUrl: "https://image.example/calm.png", lumiVoiceRecordings: [{ id: "older", url: "https://audio.example/older.webm", label: "Bản cũ", createdAt: "2026-08-19T00:00:00.000Z" }, { id: "linked", url: "https://audio.example/linked.webm", label: "Bản đã gắn", createdAt: "2026-08-19T01:00:00.000Z", imageUrl: "https://image.example/linked.png" }] } } });
    expect(profile.companionEmotionMedia?.calm?.lumiVoiceRecordings).toEqual([
      expect.objectContaining({ id: "older", imageUrl: "https://image.example/calm.png" }),
      expect.objectContaining({ id: "linked", imageUrl: "https://image.example/linked.png" }),
    ]);
  });

  it("preserves supported color labels and discards unsupported labels during normalization", () => {
    const profile = normalizeProfile({ companionEmotionMedia: { calm: { lumiVoiceRecordings: [
      { id: "green", url: "https://audio.example/green.webm", label: "Bản xanh", createdAt: "2026-08-19T00:00:00.000Z", colorLabel: "green" },
      { id: "unknown", url: "https://audio.example/unknown.webm", label: "Bản không hợp lệ", createdAt: "2026-08-19T00:00:00.000Z", colorLabel: "rainbow" },
    ] } } });
    expect(profile.companionEmotionMedia?.calm?.lumiVoiceRecordings).toEqual([
      expect.objectContaining({ id: "green", colorLabel: "green" }),
      expect.objectContaining({ id: "unknown", colorLabel: undefined }),
    ]);
  });

  it("normalizes custom Lumi congratulations and weekly completion history without duplicate weeks", () => {
    const profile = normalizeProfile({
      weeklyPomodoroGoalCompletions: [
        { weekKey: "2026-W34", completedAt: "2026-08-19T12:00:00.000Z", goalMinutes: 300, achievedMinutes: 320 },
        { weekKey: "2026-W34", completedAt: "2026-08-20T12:00:00.000Z", goalMinutes: 350, achievedMinutes: 370 },
        { weekKey: "invalid", completedAt: "2026-08-20T12:00:00.000Z", goalMinutes: 350, achievedMinutes: 370 },
      ],
      lumiCongratulationMessages: {
        calm: [
          { id: "calm-1", text: " Ong đã rất bền bỉ. ", createdAt: "2026-08-19T12:00:00.000Z", updatedAt: "2026-08-20T12:00:00.000Z" },
          { id: "calm-1", text: "Bản trùng", createdAt: "2026-08-19T12:00:00.000Z", updatedAt: "2026-08-20T12:00:00.000Z" },
        ],
        invalid: [{ id: "ignored", text: "Không hợp lệ", createdAt: "2026-08-19T12:00:00.000Z", updatedAt: "2026-08-20T12:00:00.000Z" }],
      },
    });
    expect(profile.weeklyPomodoroGoalCompletions).toEqual([{ weekKey: "2026-W34", completedAt: "2026-08-19T12:00:00.000Z", goalMinutes: 300, achievedMinutes: 320 }]);
    expect(profile.lumiCongratulationMessages?.calm).toEqual([{ id: "calm-1", text: "Ong đã rất bền bỉ.", createdAt: "2026-08-19T12:00:00.000Z", updatedAt: "2026-08-20T12:00:00.000Z" }]);
    expect(profile.lumiCongratulationMessages?.happy).toBeUndefined();
  });
});
