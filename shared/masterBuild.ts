import { generateAchievements, type Achievement } from "./study";

export type AchievementCatalogRow = {
  id: string;
  rank: number;
  rankName: string;
  level: number;
  levelLabel: string;
  group: string;
  topic: Achievement["topic"];
  topicLabel: Achievement["topicLabel"];
  tags: string[];
  icon: string;
  name: string;
  description: string;
  metric: Achievement["metric"];
  threshold: number;
  rewardXp: number;
  rewardFragments: number;
  titleId: string | null;
  titleMeaning: string | null;
  titleInspiration: string | null;
  titleExplanation: string | null;
  titleGroup: number | null;
  titleGroupLabel: string | null;
  source_type: Achievement["source_type"];
  source_text: string | null;
  source_note: string | null;
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
  titleGroup: number;
  titleGroupLabel: string;
  source_type: "verified" | "inspired";
  source_text: string;
  source_note: string;
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
    level: achievement.level,
    levelLabel: achievement.levelLabel,
    group: achievement.group,
    topic: achievement.topic,
    topicLabel: achievement.topicLabel,
    tags: achievement.tags,
    icon: achievement.icon,
    name: achievement.name,
    description: achievement.description,
    metric: achievement.metric,
    threshold: achievement.threshold,
    rewardXp: achievement.rewardXp,
    rewardFragments: achievement.rewardFragments,
    titleId: achievement.title ? titleIdForAchievement(achievement.id) : null,
    titleMeaning: achievement.titleMeaning,
    titleInspiration: achievement.titleInspiration ?? null,
    titleExplanation: achievement.titleExplanation ?? null,
    titleGroup: achievement.titleGroup ?? null,
    titleGroupLabel: achievement.titleGroupLabel ?? null,
    source_type: achievement.source_type ?? "not_applicable",
    source_text: achievement.source_text ?? null,
    source_note: achievement.source_note ?? null,
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
      titleGroup: source.titleGroup ?? 1,
      titleGroupLabel: source.titleGroupLabel ?? "Khó",
      source_type: source.source_type === "verified" ? "verified" : "inspired",
      source_text: source.source_text ?? source.titleInspiration ?? "",
      source_note: source.source_note ?? source.titleExplanation ?? "",
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
  for (let titleGroup = 1; titleGroup <= 8; titleGroup += 1) {
    const count = titles.filter((item) => item.titleGroup === titleGroup).length;
    if (count !== 50) errors.push(`Title group ${titleGroup} must contain 50 titles, received ${count}.`);
  }
  if (achievementIds.size !== achievements.length) errors.push("Achievement IDs must be unique.");
  if (titleIds.size !== titles.length) errors.push("Title IDs must be unique.");
  for (let level = 1; level <= 9; level += 1) {
    const count = achievements.filter((item) => item.level === level).length;
    if (count !== 100) errors.push(`Level ${level} must contain 100 achievements, received ${count}.`);
  }
  for (const topic of ["study", "pomodoro", "discipline", "deep-understanding", "exam", "journal", "anti-procrastination", "journey", "collection"] as const) {
    if (!achievements.some((item) => item.topic === topic)) errors.push(`Topic ${topic} has no achievements.`);
  }
  for (const title of titles) {
    if (!achievementIds.has(title.achievementId)) errors.push(`Title ${title.id} references a missing achievement.`);
  }
  for (const achievement of achievements) {
    if (achievement.titleId && !titleIds.has(achievement.titleId)) errors.push(`Achievement ${achievement.id} references a missing title.`);
    if (!achievement.name || !achievement.description || achievement.threshold < 1 || achievement.tags.length === 0) errors.push(`Achievement ${achievement.id} is missing public catalog data.`);
    if (achievement.titleId && (!achievement.titleMeaning || !achievement.titleInspiration || !achievement.titleExplanation || !achievement.titleGroup || !achievement.titleGroupLabel || !achievement.source_type || !achievement.source_text || !achievement.source_note)) errors.push(`Title achievement ${achievement.id} is missing public cultural/source metadata.`);
    if (achievement.titleId && achievement.rewardXp <= 0) errors.push(`Title achievement ${achievement.id} must have an explicit positive XP reward.`);
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
