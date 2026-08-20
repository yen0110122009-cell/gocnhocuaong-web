import type { AudioActionLog, PersonalAudioAsset, PersonalStudyPreset, ProfileState } from "./study";

function stripPresetAssetIds(preset: PersonalStudyPreset, deletedIds: Set<string>): PersonalStudyPreset {
  return { ...preset, audioAssetIds: preset.audioAssetIds.filter((id) => !deletedIds.has(id)) };
}

function stripSnapshot(snapshot: AudioActionLog["snapshot"], deletedIds: Set<string>) {
  if (!snapshot) return undefined;
  if ("url" in snapshot && deletedIds.has(snapshot.id)) return undefined;
  if ("audioAssetIds" in snapshot) return stripPresetAssetIds(snapshot, deletedIds);
  return snapshot;
}

/**
 * Removes an audio asset from every recoverable profile location.
 * Storage bytes remain governed by the platform storage lifecycle; this helper
 * guarantees the profile and audit history no longer retain a recovery path.
 */
export function purgeAudioAssetReferences(profile: ProfileState, assetIds: string[]): ProfileState {
  const deletedIds = new Set(assetIds.filter(Boolean));
  if (!deletedIds.size) return profile;

  const audioActionLogs = (profile.audioActionLogs ?? []).flatMap((log) => {
    if (log.entityType === "asset" && deletedIds.has(log.entityId)) return [];
    const next: AudioActionLog = {
      ...log,
      snapshot: stripSnapshot(log.snapshot, deletedIds),
      previousSnapshot: stripSnapshot(log.previousSnapshot, deletedIds),
    };
    return [next];
  });

  return {
    ...profile,
    personalAudioAssets: (profile.personalAudioAssets ?? []).filter((asset) => !deletedIds.has(asset.id)),
    personalAudioTrash: (profile.personalAudioTrash ?? []).filter((asset) => !deletedIds.has(asset.id)),
    audioGroupPresets: (profile.audioGroupPresets ?? []).map((preset) => ({
      ...preset,
      audioAssetIds: preset.audioAssetIds.filter((id) => !deletedIds.has(id)),
    })),
    personalStudyPresets: (profile.personalStudyPresets ?? []).map((preset) => stripPresetAssetIds(preset, deletedIds)),
    personalStudyPresetHistory: (profile.personalStudyPresetHistory ?? []).map((history) => ({
      ...history,
      snapshot: stripPresetAssetIds(history.snapshot, deletedIds),
    })),
    audioActionLogs,
  };
}

export function purgeAudioAssetsFromTrash(profile: ProfileState, assets: PersonalAudioAsset[]): ProfileState {
  return purgeAudioAssetReferences(profile, assets.map((asset) => asset.id));
}
