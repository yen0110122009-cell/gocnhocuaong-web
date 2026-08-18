import type {
  AdminReward,
  AppConfig,
  CharacterProgress,
  CharacterSource,
  CharacterUnlockStatus,
  CollectionShopItem,
  CollectionEvent,
  FragmentPiece,
  FragmentTier,
  FragmentRewardSourceRule,
  FragmentRewardGrant,
  LearningMilestone,
  PieceExchangeRule,
  PieceTransaction,
  RewardAuditLog,
  RewardClaimReceipt,
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

export function fragmentLedgerValue(config: AppConfig, ledger: Partial<Record<FragmentTier, number>> = {}) {
  return (["I", "II", "III", "IV", "V", "VI"] as FragmentTier[]).reduce((sum, tier) => sum + Math.max(0, Math.floor(Number(ledger[tier]) || 0)) * configuredFragmentValue(config, tier), 0);
}

export function rewardSourceClaimsToday(profile: ProfileState, sourceId: string, occurredAt: string) {
  const dayKey = occurredAt.slice(0, 10);
  return Object.entries(profile.fragmentRewardClaims ?? {}).reduce((sum, [key, amount]) => key.startsWith(`${dayKey}:${sourceId}:`) ? sum + Math.max(0, Math.floor(Number(amount) || 0)) : sum, 0);
}

export function grantFragmentSourceReward(config: AppConfig, profile: ProfileState, rule: FragmentRewardSourceRule, claimKey: string, occurredAt = new Date().toISOString()) {
  if (!rule.enabled || !rule.rewards.length) return { profile, granted: false, reason: "disabled" as const, amount: 0 };
  const key = `${occurredAt.slice(0, 10)}:${rule.id}:${claimKey}`;
  if ((profile.fragmentRewardClaims ?? {})[key] || (profile.rewardClaims ?? {})[key]) return { profile, granted: false, reason: "already_claimed" as const, amount: 0 };
  const claimedToday = rewardSourceClaimsToday(profile, rule.id, occurredAt);
  const requested = rule.rewards.reduce((sum, reward) => sum + Math.max(0, Math.floor(reward.amount)), 0);
  const remainingDaily = rule.dailyCap === undefined ? requested : Math.max(0, Math.floor(rule.dailyCap) - claimedToday);
  const grantScale = requested > 0 ? Math.min(1, remainingDaily / requested) : 0;
  if (grantScale <= 0 || (rule.claimLimit !== undefined && claimedToday >= Math.max(0, Math.floor(rule.claimLimit)))) return { profile, granted: false, reason: "limit_reached" as const, amount: 0 };
  const ledger = { ...(profile.fragmentLedger ?? {}) } as Partial<Record<FragmentTier, number>>;
  let nextProfile = profile;
  let amount = 0;
  const transactionIds: string[] = [];
  for (const reward of rule.rewards) {
    const granted = Math.floor(Math.max(0, reward.amount) * grantScale);
    if (!granted) continue;
    ledger[reward.tier] = Math.max(0, Math.floor(Number(ledger[reward.tier]) || 0)) + granted;
    amount += granted;
    const transactionId = `piece-tx-${key}-${reward.tier}`;
    transactionIds.push(transactionId);
    nextProfile = appendPieceTransaction(nextProfile, { id: transactionId, occurredAt, source: rule.kind, sourceType: rule.kind, sourceId: rule.id, reason: rule.description, claimKey: key, type: "grant", tier: reward.tier, amount: granted, value: granted * configuredFragmentValue(config, reward.tier), description: reward.label ?? rule.label, relatedId: rule.id });
  }
  if (!amount) return { profile, granted: false, reason: "limit_reached" as const, amount: 0 };
  const receipt: RewardClaimReceipt = { claimKey: key, sourceType: rule.kind, sourceId: rule.id, reason: rule.description, claimedAt: occurredAt, amount, transactionIds };
  nextProfile = { ...nextProfile, fragmentLedger: ledger, fragmentRewardClaims: { ...(nextProfile.fragmentRewardClaims ?? {}), [key]: amount }, rewardClaims: { ...(nextProfile.rewardClaims ?? {}), [key]: receipt } };
  return { profile: appendRewardAudit(nextProfile, { occurredAt, actor: "system", action: "grant", entityType: "fragment_reward", entityId: rule.id, summary: `${rule.label}: +${amount} mảnh`, metadata: { claimKey: key, sourceType: rule.kind, sourceId: rule.id, amount } }), granted: true, reason: "ok" as const, amount };
}

export function claimCollectionEventReward(config: AppConfig, profile: ProfileState, event: CollectionEvent, occurredAt = new Date().toISOString()) {
  const now = new Date(occurredAt).getTime();
  const startsAt = new Date(event.startsAt).getTime();
  const endsAt = new Date(event.endsAt).getTime();
  if (event.deletedAt || event.status === "draft" || event.status === "archived" || !Number.isFinite(startsAt) || !Number.isFinite(endsAt) || now < startsAt || now > endsAt || (event.status !== "active" && event.status !== "scheduled")) {
    return { profile, claimed: false, reason: "inactive" as const, amount: 0, missingConditions: [] as string[] };
  }
  const progress = profile.eventProgress?.[event.id] ?? {};
  const missingConditions = event.participationConditions.filter((condition) => Math.max(0, Number(progress[condition.metric] ?? 0)) < Math.max(0, condition.target)).map((condition) => condition.label);
  if (missingConditions.length) return { profile, claimed: false, reason: "conditions_not_met" as const, amount: 0, missingConditions };
  const claimKey = `event:${event.id}`;
  const previousReceipt = profile.eventRewardClaims?.[claimKey] ?? profile.rewardClaims?.[claimKey];
  if (previousReceipt) return { profile, claimed: false, reason: "already_claimed" as const, amount: 0, missingConditions: [] as string[] };
  const previousClaims = Math.max(0, Math.floor(Number(profile.claimedEventRewards?.[event.id] ?? 0)));
  const claimLimit = Math.max(0, Math.floor(Number(event.claimLimit)));
  if (claimLimit > 0 && previousClaims >= claimLimit) return { profile, claimed: false, reason: "limit_reached" as const, amount: 0, missingConditions: [] as string[] };
  const rewards = event.fragmentRewards.map((reward) => ({ ...reward, amount: Math.max(0, Math.floor(reward.amount)) })).filter((reward) => reward.amount > 0);
  if (!rewards.length) return { profile, claimed: false, reason: "empty_reward" as const, amount: 0, missingConditions: [] as string[] };
  const ledger = { ...(profile.fragmentLedger ?? {}) } as Partial<Record<FragmentTier, number>>;
  let nextProfile: ProfileState = { ...profile, fragmentLedger: ledger, claimedEventRewards: { ...(profile.claimedEventRewards ?? {}), [event.id]: previousClaims + 1 } };
  const transactionIds: string[] = [];
  let amount = 0;
  for (const reward of rewards) {
    ledger[reward.tier] = Math.max(0, Math.floor(Number(ledger[reward.tier]) || 0)) + reward.amount;
    amount += reward.amount;
    const transactionId = `piece-tx-${claimKey}-${reward.tier}`;
    transactionIds.push(transactionId);
    nextProfile = appendPieceTransaction(nextProfile, { id: transactionId, occurredAt, source: "event", sourceType: "event", sourceId: event.id, reason: event.description, claimKey, type: "grant", tier: reward.tier, amount: reward.amount, value: reward.amount * configuredFragmentValue(config, reward.tier), description: reward.label ?? event.name, relatedId: event.id });
  }
  const receipt: RewardClaimReceipt = { claimKey, sourceType: "event", sourceId: event.id, reason: event.description, claimedAt: occurredAt, amount, transactionIds };
  nextProfile = { ...nextProfile, eventRewardClaims: { ...(nextProfile.eventRewardClaims ?? {}), [claimKey]: receipt }, rewardClaims: { ...(nextProfile.rewardClaims ?? {}), [claimKey]: receipt } };
  return { profile: appendRewardAudit(nextProfile, { occurredAt, actor: "system", action: "grant", entityType: "event_reward", entityId: event.id, summary: `${event.name}: +${amount} mảnh`, metadata: { claimKey, sourceType: "event", sourceId: event.id, amount, claimLimit } }), claimed: true, reason: "ok" as const, amount, missingConditions: [] as string[], rewards };
}

export function grantAdminReward(config: AppConfig, profile: ProfileState, reward: AdminReward, adminId: string, occurredAt = new Date().toISOString()) {
  const claimKey = `admin:${reward.id}:${reward.recipientUserId ?? "profile"}`;
  const auditId = reward.auditId ?? claimKey;
  if (reward.approvalStatus !== "approved" || !reward.active) return { profile, granted: false, reason: "not_approved" as const };
  if (!reward.recipientUserId || !reward.grantReason?.trim()) return { profile, granted: false, reason: "missing_recipient_or_reason" as const };
  if ((profile.rewardClaims ?? {})[claimKey] || (profile.rewardAuditLogs ?? []).some((item) => item.id === auditId)) return { profile, granted: false, reason: "already_granted" as const };
  const value = Math.max(0, Math.floor(Number(reward.value) || 0));
  if (!value) return { profile, granted: false, reason: "empty_reward" as const };
  let nextProfile: ProfileState = profile;
  const transactionIds: string[] = [];
  if (reward.type === "piece") {
    const tier = (reward.condition.match(/tier[:=]?(VI|IV|V|I{1,3})/i)?.[1] ?? "I") as FragmentTier;
    const ledger = { ...(profile.fragmentLedger ?? {}) } as Partial<Record<FragmentTier, number>>;
    ledger[tier] = Math.max(0, Math.floor(Number(ledger[tier]) || 0)) + value;
    const transactionId = `piece-tx-${claimKey}-${tier}`;
    transactionIds.push(transactionId);
    nextProfile = appendPieceTransaction({ ...profile, fragmentLedger: ledger }, { id: transactionId, occurredAt, source: "admin", sourceType: "admin", sourceId: reward.id, reason: reward.grantReason, claimKey, type: "grant", tier, amount: value, value: value * configuredFragmentValue(config, tier), description: reward.name, relatedId: reward.id, userId: reward.recipientUserId });
  } else if (reward.type === "ticket") {
    nextProfile = { ...profile, collectionTickets: Math.max(0, profile.collectionTickets ?? 0) + value };
  } else if (reward.type === "achievement_points") {
    nextProfile = { ...profile, xp: Math.max(0, profile.xp) + value };
  } else {
    nextProfile = { ...profile, inventory: Array.from(new Set([...(profile.inventory ?? []), ...Array.from({ length: value }, () => reward.id)])) };
  }
  const receipt: RewardClaimReceipt = { claimKey, sourceType: "admin", sourceId: reward.id, reason: reward.grantReason, claimedAt: occurredAt, amount: value, transactionIds };
  nextProfile = { ...nextProfile, rewardClaims: { ...(nextProfile.rewardClaims ?? {}), [claimKey]: receipt } };
  nextProfile = appendRewardAudit(nextProfile, { occurredAt, actor: adminId, action: "admin_grant", entityType: "admin_reward", entityId: reward.id, summary: `${reward.name}: cấp ${value} cho ${reward.recipientUserId}`, metadata: { adminId, recipientUserId: reward.recipientUserId, rewardType: reward.type, rewardValue: value, reason: reward.grantReason, auditId } });
  return { profile: nextProfile, granted: true, reason: "ok" as const, claimKey, receipt };
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

export function appendPieceTransaction(profile: ProfileState, transaction: Omit<PieceTransaction, "id" | "sourceType" | "sourceId" | "reason"> & { id?: string; sourceType?: PieceTransaction["sourceType"]; sourceId?: string; reason?: string }) {
  const amount = Math.max(0, Math.floor(transaction.amount));
  if (!amount) return profile;
  const id = transaction.id ?? `piece-tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  if ((profile.pieceTransactions ?? []).some((item) => item.id === id)) return profile;
  const nextTransaction: PieceTransaction = {
    ...transaction,
    id,
    sourceType: transaction.sourceType ?? "admin",
    sourceId: transaction.sourceId ?? transaction.relatedId ?? "legacy",
    reason: transaction.reason ?? transaction.description ?? "Không có lý do được ghi nhận",
    amount,
    value: Math.max(0, Math.floor(transaction.value)),
  };
  return { ...profile, pieceTransactions: [...(profile.pieceTransactions ?? []), nextTransaction] };
}

export function appendRewardAudit(profile: ProfileState, audit: Omit<RewardAuditLog, "id">) {
  const id = `audit-${audit.entityType}-${audit.entityId}-${audit.occurredAt}`;
  if ((profile.rewardAuditLogs ?? []).some((item) => item.id === id)) return profile;
  return { ...profile, rewardAuditLogs: [...(profile.rewardAuditLogs ?? []), { ...audit, id }] };
}

export function grantLearningMilestone(config: AppConfig, profile: ProfileState, milestone: LearningMilestone, occurredAt = new Date().toISOString()) {
  const claimKey = `milestone:${milestone.id}`;
  if (!milestone.enabled || (profile.claimedMilestones ?? {})[milestone.id] || (profile.rewardClaims ?? {})[claimKey]) return { profile, granted: false, reason: "already_claimed" as const, rewards: [] as FragmentRewardGrant[] };
  const ledger = { ...(profile.fragmentLedger ?? {}) } as Partial<Record<FragmentTier, number>>;
  const rewards = milestone.rewards.map((reward) => ({ ...reward, amount: Math.max(0, Math.floor(reward.amount)) })).filter((reward) => reward.amount > 0);
  const next = rewards.reduce((acc, reward) => ({ ...acc, [reward.tier]: Math.max(0, Math.floor(Number(acc[reward.tier]) || 0)) + reward.amount }), ledger);
  let nextProfile: ProfileState = { ...profile, fragmentLedger: next, claimedMilestones: { ...(profile.claimedMilestones ?? {}), [milestone.id]: occurredAt } };
  const transactionIds: string[] = [];
  for (const reward of rewards) {
    const transactionId = `piece-tx-${claimKey}-${reward.tier}`;
    transactionIds.push(transactionId);
    nextProfile = appendPieceTransaction(nextProfile, { id: transactionId, occurredAt, source: "learning_milestone", sourceType: "studySession", sourceId: milestone.id, reason: milestone.label, claimKey, type: "grant", tier: reward.tier, amount: reward.amount, value: reward.amount * configuredFragmentValue(config, reward.tier), description: milestone.label, relatedId: milestone.id });
  }
  const receipt: RewardClaimReceipt = { claimKey, sourceType: "studySession", sourceId: milestone.id, reason: milestone.label, claimedAt: occurredAt, amount: rewards.reduce((sum, reward) => sum + reward.amount, 0), transactionIds };
  nextProfile = { ...nextProfile, rewardClaims: { ...(nextProfile.rewardClaims ?? {}), [claimKey]: receipt } };
  return { profile: appendRewardAudit(nextProfile, { occurredAt, actor: "system", action: "grant", entityType: "learning_milestone", entityId: milestone.id, summary: `${milestone.label}: nhận mảnh`, metadata: { claimKey, sourceType: "studySession", sourceId: milestone.id } }), granted: rewards.length > 0, reason: rewards.length ? "ok" as const : "empty" as const, rewards };
}

export function exchangePieceTier(config: AppConfig, profile: ProfileState, rule: PieceExchangeRule, occurredAt = new Date().toISOString()) {
  if (!rule.enabled || rule.fromAmount <= 0 || rule.toAmount <= 0) return { profile, exchanged: false, reason: "disabled" as const };
  const ledger = { ...(profile.fragmentLedger ?? {}) } as Partial<Record<FragmentTier, number>>;
  const current = Math.max(0, Math.floor(Number(ledger[rule.fromTier]) || 0));
  if (current < rule.fromAmount) return { profile, exchanged: false, reason: "insufficient_balance" as const };
  ledger[rule.fromTier] = current - rule.fromAmount;
  ledger[rule.toTier] = Math.max(0, Math.floor(Number(ledger[rule.toTier]) || 0)) + rule.toAmount;
  const claimKey = `exchange:${rule.id}:${Math.max(0, (profile.claimedPieceExchanges?.[rule.id] ?? 0) + 1)}`;
  const nextProfile = appendPieceTransaction({ ...profile, fragmentLedger: ledger, claimedPieceExchanges: { ...(profile.claimedPieceExchanges ?? {}), [rule.id]: Math.max(0, (profile.claimedPieceExchanges?.[rule.id] ?? 0) + 1) } }, { id: `piece-tx-${claimKey}-from`, occurredAt, source: "piece_exchange", sourceType: "admin", sourceId: rule.id, reason: `Đổi ${rule.fromTier} sang ${rule.toTier}`, claimKey, type: "exchange", tier: rule.fromTier, amount: rule.fromAmount, value: rule.fromAmount * configuredFragmentValue(config, rule.fromTier), description: `${rule.fromTier} → ${rule.toTier}`, relatedId: rule.id });
  const withGrant = appendPieceTransaction(nextProfile, { id: `piece-tx-${claimKey}-to`, occurredAt, source: "piece_exchange", sourceType: "admin", sourceId: rule.id, reason: `Đổi ${rule.fromTier} sang ${rule.toTier}`, claimKey, type: "grant", tier: rule.toTier, amount: rule.toAmount, value: rule.toAmount * configuredFragmentValue(config, rule.toTier), description: `${rule.fromTier} → ${rule.toTier}`, relatedId: rule.id });
  return { profile: appendRewardAudit(withGrant, { occurredAt, actor: "system", action: "exchange", entityType: "piece_exchange", entityId: rule.id, summary: `${rule.fromAmount} mảnh ${rule.fromTier} → ${rule.toAmount} mảnh ${rule.toTier}`, metadata: { claimKey, sourceType: "admin", sourceId: rule.id } }), exchanged: true, reason: "ok" as const };
}

export function pieceTransactionHistory(profile: ProfileState) {
  return [...(profile.pieceTransactions ?? [])].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
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

