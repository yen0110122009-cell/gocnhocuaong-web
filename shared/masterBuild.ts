import { generateAchievements, type Achievement } from "./study";

export type AchievementCatalogRow = {
  id: string;
  rank: number;
  rankName: string;
  icon: string;
  name: string;
  description: string;
  metric: Achievement["metric"];
  threshold: number;
  rewardXp: number;
  rewardFragments: number;
  titleId: string | null;
  titleMeaning: string | null;
  difficulty: Achievement["difficulty"];
  badgeLabel: string;
  encouragement: string;
  animation: Achievement["animation"];
  enabled: boolean;
};

export type TitleCatalogRow = {
  id: string;
  achievementId: string;
  name: string;
  meaning: string;
  enabled: boolean;
};

export type LedgerDelta = {
  previousBalance: number;
  delta: number;
  nextBalance: number;
};

export function titleIdForAchievement(achievementId: string) {
  return `title:${achievementId}`;
}

export function achievementCatalogRows(): AchievementCatalogRow[] {
  return generateAchievements().map((achievement) => ({
    id: achievement.id,
    rank: achievement.rank,
    rankName: achievement.rankName,
    icon: achievement.icon,
    name: achievement.name,
    description: achievement.description,
    metric: achievement.metric,
    threshold: achievement.threshold,
    rewardXp: achievement.rewardXp,
    rewardFragments: achievement.rewardFragments,
    titleId: achievement.title ? titleIdForAchievement(achievement.id) : null,
    titleMeaning: achievement.titleMeaning,
    difficulty: achievement.difficulty,
    badgeLabel: achievement.badgeLabel,
    encouragement: achievement.encouragement,
    animation: achievement.animation,
    enabled: true,
  }));
}

export function titleCatalogRows(): TitleCatalogRow[] {
  const sources = generateAchievements();
  return achievementCatalogRows().flatMap((achievement) => {
    if (!achievement.titleId || !achievement.titleMeaning) return [];
    const source = sources.find((item) => item.id === achievement.id);
    if (!source?.title) return [];
    return [{
      id: achievement.titleId,
      achievementId: achievement.id,
      name: source.title,
      meaning: achievement.titleMeaning,
      enabled: true,
    }];
  });
}

export function validateMasterCatalog(achievements = achievementCatalogRows(), titles = titleCatalogRows()) {
  const errors: string[] = [];
  const achievementIds = new Set(achievements.map((item) => item.id));
  const titleIds = new Set(titles.map((item) => item.id));
  if (achievements.length !== 900) errors.push(`Expected 900 achievements, received ${achievements.length}.`);
  if (titles.length !== 400) errors.push(`Expected 400 titles, received ${titles.length}.`);
  if (achievementIds.size !== achievements.length) errors.push("Achievement IDs must be unique.");
  if (titleIds.size !== titles.length) errors.push("Title IDs must be unique.");
  for (const title of titles) {
    if (!achievementIds.has(title.achievementId)) errors.push(`Title ${title.id} references a missing achievement.`);
  }
  for (const achievement of achievements) {
    if (achievement.titleId && !titleIds.has(achievement.titleId)) errors.push(`Achievement ${achievement.id} references a missing title.`);
  }
  return { valid: errors.length === 0, errors };
}

export function calculateLedgerDelta(previousBalance: number, delta: number): LedgerDelta {
  if (!Number.isSafeInteger(previousBalance) || previousBalance < 0) {
    throw new Error("Piece balance must be a non-negative integer.");
  }
  if (!Number.isSafeInteger(delta) || delta === 0) {
    throw new Error("Piece delta must be a non-zero integer.");
  }
  const nextBalance = previousBalance + delta;
  if (nextBalance < 0) throw new Error("Piece balance cannot become negative.");
  return { previousBalance, delta, nextBalance };
}
