import type {
  AppConfig,
  CharacterProgress,
  CharacterSource,
  CharacterUnlockStatus,
  CollectionShopItem,
  FragmentPiece,
  FragmentTier,
  HistoricalCharacter,
  ProfileState,
  SourceVerificationStatus,
} from "./study";

export const fragmentTierValues: Record<FragmentTier, number> = { I: 1, II: 3, III: 8, IV: 20, V: 50, VI: 120 };

export function configuredFragmentValue(config: AppConfig, tier: FragmentTier = "I") {
  return Math.max(1, Number(config.collectionConfig?.tierValues?.find((item) => item.tier === tier)?.value ?? fragmentTierValues[tier]));
}

export function characterCollectionValue(config: AppConfig, character: HistoricalCharacter, profile: ProfileState) {
  const progress = getCharacterProgress(profile, character);
  const pieces = piecesForCharacter(character);
  return progress.collectedPieceIds.reduce((sum, pieceId) => {
    const piece = pieces.find((item) => item.id === pieceId);
    const tier: FragmentTier = piece?.rarity === "legendary" ? "VI" : piece?.rarity === "special" ? "IV" : piece?.rarity === "rare" ? "III" : "I";
    return sum + configuredFragmentValue(config, tier);
  }, 0);
}

export function totalCollectionValue(config: AppConfig, profile: ProfileState, characters = visibleCharacters(config)) {
  return characters.reduce((sum, character) => sum + characterCollectionValue(config, character, profile), 0);
}

export function collectionTicketQuote(config: AppConfig, value: number) {
  const quote = config.collectionConfig?.ticketExchange;
  if (!quote?.enabled || quote.fragmentValue <= 0 || quote.tickets <= 0) return { tickets: 0, remainingValue: Math.max(0, value) };
  const bundles = Math.floor(Math.max(0, value) / quote.fragmentValue);
  return { tickets: bundles * quote.tickets, remainingValue: Math.max(0, value - bundles * quote.fragmentValue) };
}

export function collectionValueBalance(config: AppConfig, profile: ProfileState) {
  return Math.max(0, totalCollectionValue(config, profile) - Math.max(0, profile.collectionValueSpent ?? 0));
}

export function profileLevelState(profile: ProfileState, character: HistoricalCharacter) {
  const progress = getCharacterProgress(profile, character);
  return new Set(progress.unlockedProfileLevelIds ?? []);
}

export function unlockCharacterProfileLevel(config: AppConfig, profile: ProfileState, character: HistoricalCharacter, levelId: string) {
  const level = character.profileLevels?.find((item) => item.id === levelId);
  const progress = getCharacterProgress(profile, character);
  if (!level || progress.status !== "unlocked" || profileLevelState(profile, character).has(levelId)) return { profile, unlocked: false, reason: "not_available" as const };
  const available = collectionValueBalance(config, profile);
  if (available < level.requiredValue) return { profile, unlocked: false, reason: "insufficient_value" as const };
  const nextProgress = { ...progress, unlockedProfileLevelIds: [...(progress.unlockedProfileLevelIds ?? []), levelId] };
  return { profile: { ...profile, collectionValueSpent: Math.max(0, profile.collectionValueSpent ?? 0) + level.requiredValue, characterProgress: { ...profile.characterProgress, [character.id]: nextProgress } }, unlocked: true, reason: "ok" as const };
}

export function exchangeCollectionTickets(config: AppConfig, profile: ProfileState, value: number) {
  const quote = collectionTicketQuote(config, value);
  const available = collectionValueBalance(config, profile);
  if (!quote.tickets || value <= 0 || available < value) return { profile, exchanged: false, tickets: 0, reason: "insufficient_value" as const };
  return { profile: { ...profile, collectionTickets: Math.max(0, profile.collectionTickets ?? 0) + quote.tickets, collectionValueSpent: Math.max(0, profile.collectionValueSpent ?? 0) + value }, exchanged: true, tickets: quote.tickets, reason: "ok" as const };
}

export function purchaseCollectionItem(config: AppConfig, profile: ProfileState, item: CollectionShopItem) {
  if (!item.enabled || (item.stock !== null && item.stock <= 0) || (profile.collectionInventory ?? []).includes(item.id)) return { profile, purchased: false, reason: "unavailable" as const };
  const currentTickets = Math.max(0, profile.collectionTickets ?? 0);
  const currentValue = collectionValueBalance(config, profile);
  if (item.currency === "collectionTicket" && currentTickets < item.price) return { profile, purchased: false, reason: "insufficient_currency" as const };
  if (item.currency === "fragmentValue" && currentValue < item.price) return { profile, purchased: false, reason: "insufficient_currency" as const };
  return { profile: { ...profile, collectionTickets: item.currency === "collectionTicket" ? currentTickets - item.price : currentTickets, collectionValueSpent: item.currency === "fragmentValue" ? Math.max(0, profile.collectionValueSpent ?? 0) + item.price : profile.collectionValueSpent, collectionInventory: [...(profile.collectionInventory ?? []), item.id] }, purchased: true, reason: "ok" as const };
}

export const fragmentFlow = [
  "study",
  "rewarded",
  "owned",
  "assigned",
  "ready",
  "assembled",
  "unlocked",
  "reading",
] as const;
export type FragmentFlowStep = (typeof fragmentFlow)[number];

export type HistoricalCharacterDraft = Partial<HistoricalCharacter> & {
  id?: string;
  name?: string;
  fragmentTotal?: number;
  pieces?: FragmentPiece[];
  sources?: CharacterSource[];
};

export type CharacterValidation = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export const pieceIdFor = (characterId: string, position: number) => `${characterId}-piece-${position}`;

export function defaultPieces(characterId: string, total: number): FragmentPiece[] {
  return Array.from({ length: Math.max(1, Math.floor(total)) }, (_, index) => ({
    id: pieceIdFor(characterId, index + 1),
    characterId,
    position: index + 1,
    rarity: index === total - 1 ? "rare" : "common",
  }));
}

export function piecesForCharacter(character: HistoricalCharacter): FragmentPiece[] {
  const pieces = Array.isArray(character.pieces) && character.pieces.length ? character.pieces : defaultPieces(character.id, character.fragmentTotal);
  return pieces.filter((piece) => piece.characterId === character.id).slice(0, Math.max(1, character.fragmentTotal));
}

export function getCharacterProgress(profile: ProfileState, character: HistoricalCharacter): CharacterProgress {
  const configured = profile.characterProgress?.[character.id];
  const pieces = piecesForCharacter(character);
  const count = Math.min(pieces.length, Math.max(0, Math.floor(profile.fragments?.[character.id] ?? 0)));
  const collected = configured?.collectedPieceIds?.length
    ? configured.collectedPieceIds.filter((id) => pieces.some((piece) => piece.id === id))
    : pieces.slice(0, count).map((piece) => piece.id);
  const used = configured?.usedPieceIds?.filter((id) => collected.includes(id)) ?? [];
  const status: CharacterUnlockStatus = configured?.status === "unlocked"
    ? "unlocked"
    : collected.length >= pieces.length
      ? "ready"
      : collected.length > 0
        ? "assembling"
        : "locked";
  return {
    characterId: character.id,
    collectedPieceIds: Array.from(new Set(collected)),
    usedPieceIds: Array.from(new Set(used)),
    status,
    assembledAt: configured?.assembledAt ?? null,
    unlockedAt: configured?.unlockedAt ?? null,
  };
}

export function collectNextCharacterPiece(profile: ProfileState, character: HistoricalCharacter, occurredAt = new Date().toISOString()) {
  const pieces = piecesForCharacter(character);
  const progress = getCharacterProgress(profile, character);
  const nextPiece = pieces.find((piece) => !progress.collectedPieceIds.includes(piece.id));
  if (!nextPiece) return { profile, piece: null, progress };
  const nextProgress: CharacterProgress = {
    ...progress,
    collectedPieceIds: [...progress.collectedPieceIds, nextPiece.id],
    status: progress.collectedPieceIds.length + 1 >= pieces.length ? "ready" : "assembling",
  };
  return {
    piece: { ...nextPiece, collectedAt: occurredAt },
    progress: nextProgress,
    profile: {
      ...profile,
      fragments: { ...profile.fragments, [character.id]: progress.collectedPieceIds.length + 1 },
      characterProgress: { ...profile.characterProgress, [character.id]: nextProgress },
    },
  };
}

export function assembleCharacter(profile: ProfileState, character: HistoricalCharacter, assembledAt = new Date().toISOString()) {
  const pieces = piecesForCharacter(character);
  const progress = getCharacterProgress(profile, character);
  if (progress.collectedPieceIds.length < pieces.length || progress.status === "unlocked") return { profile, assembled: false, progress };
  const nextProgress: CharacterProgress = {
    ...progress,
    usedPieceIds: pieces.map((piece) => piece.id),
    status: "unlocked",
    assembledAt,
    unlockedAt: assembledAt,
  };
  return { assembled: true, progress: nextProgress, profile: { ...profile, characterProgress: { ...profile.characterProgress, [character.id]: nextProgress } } };
}

export function validateHistoricalCharacterDraft(draft: HistoricalCharacterDraft): CharacterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const id = String(draft.id ?? "").trim();
  const name = String(draft.name ?? "").trim();
  const total = Number(draft.fragmentTotal);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) errors.push("characterId phải là slug chữ thường, số và dấu gạch ngang.");
  if (!name) errors.push("Thiếu tên đầy đủ nhân vật.");
  if (!Number.isInteger(total) || total < 1 || total > 100) errors.push("totalPieces phải là số nguyên từ 1 đến 100.");
  const sourceStatus: SourceVerificationStatus = draft.verificationStatus ?? "missing";
  const hasImageSource = Boolean(String(draft.imageSource ?? "").trim() || draft.images?.some((image) => image.sourceUrl || image.sourceName));
  const hasTextSource = Boolean(String(draft.sourceUrl ?? "").trim() || draft.sources?.some((source) => source.url || source.type === "book"));
  if (!hasImageSource) warnings.push("Thiếu nguồn ảnh; hiển thị cảnh báo chưa xác minh.");
  if (!hasTextSource) warnings.push("Thiếu nguồn tư liệu; không được coi tiểu sử là đã xác minh.");
  if (sourceStatus !== "verified") warnings.push(`Trạng thái nguồn hiện tại: ${sourceStatus}.`);
  const pieces = Array.isArray(draft.pieces) ? draft.pieces : [];
  if (pieces.length && pieces.length !== total) errors.push("Số pieces phải khớp totalPieces.");
  if (pieces.some((piece) => piece.characterId !== id)) errors.push("Mọi piece phải gắn đúng characterId.");
  return { valid: errors.length === 0, errors, warnings };
}

export function visibleCharacters(config: AppConfig): HistoricalCharacter[] {
  return config.characters.filter((character) => character.visibility !== "hidden");
}

