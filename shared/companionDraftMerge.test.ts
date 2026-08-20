import { describe, expect, it } from "vitest";
import { companionDraftDiff, mergeCompanionDrafts, parseCompanionDraft } from "./companionDraftMerge";

const recording = (id: string, url: string, createdAt: string) => ({ id, url, label: id, createdAt });

describe("companion draft local-cloud merge", () => {
  it("parses invalid cloud payload safely", () => {
    expect(parseCompanionDraft("not-json")).toBeNull();
    expect(parseCompanionDraft(JSON.stringify({ companionEmotionMedia: {} }))).toEqual({ companionEmotionMedia: {} });
  });

  it("reports only emotions with different media", () => {
    const local = { companionEmotionMedia: { calm: { lumiImageUrl: "local.png" } } };
    const cloud = { companionEmotionMedia: { calm: { lumiImageUrl: "cloud.png" }, happy: { lumiImageUrl: "happy.png" } } };
    expect(companionDraftDiff(local, cloud).map((item) => item.emotion)).toEqual(["calm", "happy"]);
  });

  it("merges recordings without losing either side and lets local win on duplicate ids", () => {
    const local = { companionEmotionMedia: { calm: { lumiVoiceRecordings: [recording("same", "local.webm", "2026-01-02T00:00:00.000Z"), recording("local", "local-2.webm", "2026-01-03T00:00:00.000Z")] } } };
    const cloud = { companionEmotionMedia: { calm: { lumiVoiceRecordings: [recording("same", "cloud.webm", "2026-01-01T00:00:00.000Z"), recording("cloud", "cloud-2.webm", "2026-01-04T00:00:00.000Z")] } } };
    const merged = mergeCompanionDrafts(local, cloud, {});
    const records = merged.companionEmotionMedia?.calm?.lumiVoiceRecordings ?? [];
    expect(records.map((item) => item.id)).toEqual(["same", "local", "cloud"]);
    expect(records[0]?.url).toBe("local.webm");
  });

  it("honors explicit local and cloud choices per emotion", () => {
    const local = { companionEmotionMedia: { calm: { lumiImageUrl: "local.png" }, happy: { lumiImageUrl: "local-happy.png" } } };
    const cloud = { companionEmotionMedia: { calm: { lumiImageUrl: "cloud.png" }, happy: { lumiImageUrl: "cloud-happy.png" } } };
    const merged = mergeCompanionDrafts(local, cloud, { calm: "cloud", happy: "local" });
    expect(merged.companionEmotionMedia?.calm?.lumiImageUrl).toBe("cloud.png");
    expect(merged.companionEmotionMedia?.happy?.lumiImageUrl).toBe("local-happy.png");
  });
});
