import { describe, expect, it } from "vitest";
import { purgeAudioAssetsFromTrash } from "./audioPurge";
import { emptyProfile, type PersonalAudioAsset, type ProfileState } from "./study";

const asset = (id: string): PersonalAudioAsset => ({
  id,
  name: `Asset ${id}`,
  url: `/manus-storage/${id}.mp3`,
  source: "user_upload",
  category: "background",
  target: "rain",
  enabled: false,
  volume: 50,
  createdAt: "2026-08-20T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
  deletedAt: "2026-08-20T00:00:00.000Z",
});

describe("audio permanent delete contract", () => {
  it("purges metadata, references and recoverable asset snapshots", () => {
    const deleted = asset("deleted");
    const retained = asset("retained");
    const profile: ProfileState = {
      ...emptyProfile(),
      personalAudioTrash: [deleted, retained],
      audioGroupPresets: [{ id: "group", name: "Rain", audioAssetIds: ["deleted", "retained"], enabled: true, createdAt: "2026-08-20", updatedAt: "2026-08-20" }],
      personalStudyPresets: [{ id: "preset", name: "Focus", audioAssetIds: ["deleted", "retained"], companionMode: "lumi", focusMode: true, createdAt: "2026-08-20", updatedAt: "2026-08-20" }],
      personalStudyPresetHistory: [{ id: "history", presetId: "preset", presetName: "Focus", snapshot: { id: "preset", name: "Focus", audioAssetIds: ["deleted", "retained"], companionMode: "lumi", focusMode: true, createdAt: "2026-08-20", updatedAt: "2026-08-20" }, changedAt: "2026-08-20" }],
      audioActionLogs: [
        { id: "asset-log", occurredAt: "2026-08-20", action: "delete", entityType: "asset", entityId: "deleted", entityName: deleted.name, snapshot: deleted },
        { id: "preset-log", occurredAt: "2026-08-20", action: "update", entityType: "preset", entityId: "preset", entityName: "Focus", snapshot: { id: "preset", name: "Focus", audioAssetIds: ["deleted", "retained"], companionMode: "lumi", focusMode: true, createdAt: "2026-08-20", updatedAt: "2026-08-20" } },
        { id: "retained-log", occurredAt: "2026-08-20", action: "delete", entityType: "asset", entityId: "retained", entityName: retained.name, snapshot: retained },
      ],
    };

    const next = purgeAudioAssetsFromTrash(profile, [deleted]);
    expect(next.personalAudioTrash?.map((item) => item.id)).toEqual(["retained"]);
    expect(next.audioGroupPresets?.[0].audioAssetIds).toEqual(["retained"]);
    expect(next.personalStudyPresets?.[0].audioAssetIds).toEqual(["retained"]);
    expect(next.personalStudyPresetHistory?.[0].snapshot.audioAssetIds).toEqual(["retained"]);
    expect(next.audioActionLogs?.some((log) => log.entityId === "deleted")).toBe(false);
    expect(next.audioActionLogs?.[0].snapshot?.audioAssetIds).toEqual(["retained"]);
    expect(next.audioActionLogs?.some((log) => log.entityId === "retained")).toBe(true);
  });
});
