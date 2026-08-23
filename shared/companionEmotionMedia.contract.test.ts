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

  it("keeps valid deleted Lumi recordings in a separate per-emotion trash while discarding invalid entries", () => {
    const profile = normalizeProfile({ lumiVoiceRecordingTrash: {
      calm: [
        { recording: { id: "restorable", url: "https://audio.example/restorable.webm", label: "Khôi phục được", createdAt: "2026-08-19T00:00:00.000Z", colorLabel: "purple" }, deletedAt: "2026-08-20T00:00:00.000Z", originalIndex: 2, previousFavoriteId: "restorable" },
        { recording: { id: "invalid", url: "", label: "Không hợp lệ", createdAt: "2026-08-19T00:00:00.000Z" }, deletedAt: "2026-08-20T00:00:00.000Z", originalIndex: 0 },
      ],
      invalid: [{ recording: { id: "ignored", url: "https://audio.example/ignored.webm", label: "Bỏ qua", createdAt: "2026-08-19T00:00:00.000Z" }, deletedAt: "2026-08-20T00:00:00.000Z", originalIndex: 0 }],
    } });
    expect(profile.lumiVoiceRecordingTrash?.calm).toEqual([expect.objectContaining({ recording: expect.objectContaining({ id: "restorable", colorLabel: "purple" }), originalIndex: 2, previousFavoriteId: "restorable" })]);
    expect(profile.lumiVoiceRecordingTrash?.happy).toBeUndefined();
  });

  it("permanently discards Lumi trash entries older than 30 days while retaining newer entries", () => {
    const profile = normalizeProfile({ lumiVoiceRecordingTrash: { calm: [
      { recording: { id: "old", url: "https://audio.example/old.webm", label: "Bản quá hạn", createdAt: "2026-08-19T00:00:00.000Z" }, deletedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(), originalIndex: 0 },
      { recording: { id: "fresh", url: "https://audio.example/fresh.webm", label: "Bản còn hạn", createdAt: "2026-08-19T00:00:00.000Z" }, deletedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(), originalIndex: 1 },
    ] } });
    expect(profile.lumiVoiceRecordingTrash?.calm).toEqual([expect.objectContaining({ recording: expect.objectContaining({ id: "fresh" }) })]);
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
          { id: "calm-1", text: " Ong đã rất bền bỉ. ", createdAt: "2026-08-19T12:00:00.000Z", updatedAt: "2026-08-20T12:00:00.000Z", audioUrl: "data:audio/webm;base64,dGVzdA==", audioMimeType: "audio/webm", audioDurationSeconds: 12.4 },
          { id: "calm-1", text: "Bản trùng", createdAt: "2026-08-19T12:00:00.000Z", updatedAt: "2026-08-20T12:00:00.000Z" },
        ],
        invalid: [{ id: "ignored", text: "Không hợp lệ", createdAt: "2026-08-19T12:00:00.000Z", updatedAt: "2026-08-20T12:00:00.000Z" }],
      },
    });
    expect(profile.weeklyPomodoroGoalCompletions).toEqual([{ weekKey: "2026-W34", completedAt: "2026-08-19T12:00:00.000Z", goalMinutes: 300, achievedMinutes: 320 }]);
    expect(profile.lumiCongratulationMessages?.calm).toEqual([{ id: "calm-1", text: "Ong đã rất bền bỉ.", createdAt: "2026-08-19T12:00:00.000Z", updatedAt: "2026-08-20T12:00:00.000Z", audioUrl: "data:audio/webm;base64,dGVzdA==", audioMimeType: "audio/webm", audioDurationSeconds: 12.4 }]);
    expect(profile.lumiCongratulationMessages?.happy).toBeUndefined();
  });

  it("defaults invalid or missing Pomodoro Lumi support preferences to encouragement", () => {
    expect(normalizeProfile({}).pomodoroLumiSupportMode).toBe("encouragement");
    expect(normalizeProfile({ pomodoroLumiSupportMode: "comfort" }).pomodoroLumiSupportMode).toBe("comfort");
    expect(normalizeProfile({ pomodoroLumiSupportMode: "off" }).pomodoroLumiSupportMode).toBe("off");
    expect(normalizeProfile({ pomodoroLumiSupportMode: "invalid" as never }).pomodoroLumiSupportMode).toBe("encouragement");
  });
});
