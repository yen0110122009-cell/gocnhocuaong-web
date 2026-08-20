import type { CompanionEmotionMedia, EmotionThemeId, LumiVoiceRecording, ProfileState } from "./study";

export type DraftSource = "local" | "cloud" | "merge";
export type CompanionDraftPayload = { companionEmotionMedia?: ProfileState["companionEmotionMedia"]; emotion?: EmotionThemeId; recording?: boolean; savedAt?: string };
export type CompanionDraftDiff = { emotion: EmotionThemeId; local?: CompanionEmotionMedia; cloud?: CompanionEmotionMedia; hasDifference: boolean };

const mediaKeys: Array<keyof CompanionEmotionMedia> = ["mascotImageUrl", "lumiImageUrl", "lumiVoiceUrl", "lumiVoiceRecordings", "favoriteLumiVoiceId"];

function stableMedia(value: CompanionEmotionMedia | undefined) {
  if (!value) return "";
  return JSON.stringify(mediaKeys.reduce<Record<string, unknown>>((result, key) => {
    const field = value[key];
    if (field !== undefined) result[key] = field;
    return result;
  }, {}));
}

export function parseCompanionDraft(raw: string | undefined): CompanionDraftPayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CompanionDraftPayload;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function companionDraftDiff(local: CompanionDraftPayload | null, cloud: CompanionDraftPayload | null): CompanionDraftDiff[] {
  const emotions = new Set<EmotionThemeId>([
    ...Object.keys(local?.companionEmotionMedia ?? {}) as EmotionThemeId[],
    ...Object.keys(cloud?.companionEmotionMedia ?? {}) as EmotionThemeId[],
  ]);
  return Array.from(emotions).sort().map((emotion) => {
    const localMedia = local?.companionEmotionMedia?.[emotion];
    const cloudMedia = cloud?.companionEmotionMedia?.[emotion];
    return { emotion, local: localMedia, cloud: cloudMedia, hasDifference: stableMedia(localMedia) !== stableMedia(cloudMedia) };
  }).filter((item) => item.hasDifference);
}

function mergeRecordings(local: LumiVoiceRecording[] | undefined, cloud: LumiVoiceRecording[] | undefined) {
  const merged = new Map<string, LumiVoiceRecording>();
  for (const recording of cloud ?? []) merged.set(recording.id, recording);
  for (const recording of local ?? []) merged.set(recording.id, recording);
  return Array.from(merged.values()).sort((first, second) => (Date.parse(first.createdAt) || 0) - (Date.parse(second.createdAt) || 0));
}

function mergeMedia(local: CompanionEmotionMedia | undefined, cloud: CompanionEmotionMedia | undefined, source: DraftSource): CompanionEmotionMedia | undefined {
  if (source === "local") return local;
  if (source === "cloud") return cloud;
  if (!local && !cloud) return undefined;
  const merged: CompanionEmotionMedia = { ...(cloud ?? {}), ...(local ?? {}) };
  if (local?.lumiVoiceRecordings || cloud?.lumiVoiceRecordings) merged.lumiVoiceRecordings = mergeRecordings(local?.lumiVoiceRecordings, cloud?.lumiVoiceRecordings);
  if (!local?.favoriteLumiVoiceId && cloud?.favoriteLumiVoiceId) merged.favoriteLumiVoiceId = cloud.favoriteLumiVoiceId;
  return merged;
}

export function mergeCompanionDrafts(local: CompanionDraftPayload | null, cloud: CompanionDraftPayload | null, choices: Partial<Record<EmotionThemeId, DraftSource>>): CompanionDraftPayload {
  const localMediaMap = (local?.companionEmotionMedia ?? {}) as Partial<Record<EmotionThemeId, CompanionEmotionMedia>>;
  const cloudMediaMap = (cloud?.companionEmotionMedia ?? {}) as Partial<Record<EmotionThemeId, CompanionEmotionMedia>>;
  const emotions = new Set<EmotionThemeId>([
    ...(Object.keys(localMediaMap) as EmotionThemeId[]),
    ...(Object.keys(cloudMediaMap) as EmotionThemeId[]),
  ]);
  const companionEmotionMedia: ProfileState["companionEmotionMedia"] = {};
  for (const emotion of Array.from(emotions) as EmotionThemeId[]) {
    const media = mergeMedia(localMediaMap[emotion], cloudMediaMap[emotion], choices[emotion] ?? "merge");
    if (media) companionEmotionMedia[emotion] = media;
  }
  return { ...(cloud ?? {}), ...(local ?? {}), companionEmotionMedia, savedAt: new Date().toISOString() };
}
