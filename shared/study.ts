export type StudyRole = "Member" | "Admin" | "Founder";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  status: "new" | "learning" | "known";
  starred: boolean;
};

export type FlashcardSet = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: "Cơ bản" | "Trung bình" | "Nâng cao";
  createdAt: string;
  studyCount: number;
  cards: Flashcard[];
};

export type DeepExplanation = {
  knowledge?: string;
  formula?: string;
  givenData?: string;
  solutionSteps?: string[];
  whyThisMethod?: string;
  commonMistakes?: string[];
  alternativeSolution?: string;
  deepQuestions?: Array<{ question: string; answer?: string; explanation?: string }>;
  variationExplanation?: string;
  needsVerification?: boolean;
};

export type WrongAnswerReview = {
  id: string;
  attemptId: string;
  questionId: string;
  question: string;
  learnerAnswer: string;
  correctAnswer: string;
  whyWrong: string;
  knowledgeGap: string;
  correctThinking: string[];
  commonMistake: string;
  retryQuestion: string;
  retryAnswer: string;
  source: string;
  needsVerification: boolean;
  createdAt: string;
};

export type QuizQuestion = {
  id: string;
  type: "multiple" | "boolean" | "short";
  prompt: string;
  options?: string[];
  answer: string;
  explanation?: string;
  deepExplanation?: DeepExplanation;
};

export type Quiz = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: "Cơ bản" | "Trung bình" | "Nâng cao";
  durationMinutes: number;
  createdAt: string;
  questions: QuizQuestion[];
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  completedAt: string;
  correct: number;
  total: number;
  accuracy: number;
  durationSeconds: number;
  answers?: unknown[];
  mode?: "quick" | "deep" | "paper";
  certainty?: Record<string, "certain" | "unsure" | "wrong" | "blank">;
  thoughts?: Record<string, string>;
};

export type PaperQuizSession = {
  id: string;
  quizId?: string;
  title: string;
  subject: string;
  questionCount: number;
  durationMinutes: number;
  startedAt: string;
  endedAt?: string;
  elapsedSeconds: number;
  goal?: string;
  status: "running" | "paused" | "completed" | "abandoned";
  allowPause: boolean;
  certainty: Record<string, "certain" | "unsure" | "wrong" | "blank">;
  results?: Record<string, "correct" | "wrong" | "unsure" | "blank">;
  notes?: string;
};

export type StudyActivity = {
  id: string;
  occurredAt: string;
  kind: "flashcard" | "quiz" | "wheel" | "pomodoro";
  quantity: number;
  durationSeconds: number;
  xpEarned: number;
  correct?: number;
  total?: number;
};

export type FragmentRarity = "common" | "rare" | "special" | "legendary";
export type SourceVerificationStatus = "verified" | "unverified" | "missing";
export type CharacterUnlockStatus = "locked" | "assembling" | "ready" | "unlocked";

export type CharacterTimeline = {
  id: string;
  title: string;
  content: string;
  requiredFragments: number;
  occurredAt?: string;
  location?: string;
  imageUrl?: string;
  sourceIds?: string[];
};

export type CharacterSource = {
  id: string;
  name: string;
  url?: string;
  type: "encyclopedia" | "press" | "government" | "book" | "archive" | "other";
  author?: string;
  publishedAt?: string;
  accessedAt?: string;
  note?: string;
  verificationStatus: SourceVerificationStatus;
};

export type CharacterImage = {
  id: string;
  url: string;
  caption?: string;
  sourceName?: string;
  sourceUrl?: string;
  verificationStatus: SourceVerificationStatus;
};

export type FragmentPiece = {
  id: string;
  characterId: string;
  position: number;
  rarity: FragmentRarity;
  collectedAt?: string;
  usedAt?: string;
};

export type CharacterProgress = {
  characterId: string;
  collectedPieceIds: string[];
  usedPieceIds: string[];
  status: CharacterUnlockStatus;
  assembledAt: string | null;
  unlockedAt: string | null;
};

export type HistoricalCharacter = {
  id: string;
  name: string;
  aliases: string;
  birthYear: string;
  deathYear: string;
  hometown: string;
  role: string;
  categories: string[];
  summary: string;
  biography: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl: string;
  imageSource: string;
  fragmentTotal: number;
  timeline: CharacterTimeline[];
  updatedAt: string;
  coverImage?: string;
  images?: CharacterImage[];
  sources?: CharacterSource[];
  pastedBiography?: string;
  verificationStatus?: SourceVerificationStatus;
  visibility?: "visible" | "hidden";
  pieces?: FragmentPiece[];
  unlockContent?: string;
};

export type Encouragement = {
  id: string;
  type: "correct" | "incorrect";
  text: string;
  enabled: boolean;
};

export type WheelReward = {
  id: string;
  label: string;
  kind: "xp" | "fragment" | "badge" | "ticket" | "item";
  value: number;
  probability: number;
  color: string;
};

export type AchievementOverride = {
  achievementId: string;
  enabled?: boolean;
  rewardXp?: number;
  rewardFragments?: number;
  label?: string;
  description?: string;
};

export type CustomAchievement = {
  id: string;
  name: string;
  description: string;
  metric: "xp" | "learnedCards" | "completedQuizzes" | "completedSets" | "pomodoroSessions";
  threshold: number;
  rewardXp: number;
  rewardFragments: number;
  title?: string;
  titleMeaning?: string;
  enabled: boolean;
};

export type AppConfig = {
  characters: HistoricalCharacter[];
  encouragements: Encouragement[];
  wheelRewards: WheelReward[];
  wheelTicketsPerAchievement: number;
  dailyFragmentCap: number;
  achievementOverrides: AchievementOverride[];
  customAchievements: CustomAchievement[];
  updatedAt: string;
};

export type AiImportRecord = {
  id: string;
  title: string;
  createdAt: string;
  target: "quiz" | "flashcards" | "both" | "practice";
  questionCount: number;
  flashcardCount: number;
  prompt: string;
  rawData: string;
  quizId?: string;
  flashcardSetId?: string;
};

export type ProfileState = {
  xp: number;
  level: number;
  flashcardSets: FlashcardSet[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  studyActivity: StudyActivity[];
  fragments: Record<string, number>;
  unlockedAchievementIds: string[];
  ownedBadges: string[];
  activeTitle: string | null;
  wheelTickets: number;
  inventory: string[];
  achievementUnlockDates: Record<string, string>;
  soundEnabled: boolean;
  theme: "light" | "dark";
  lastActivityAt: string | null;
  currentStreak: number;
  bestStreak: number;
  streakShields: number;
  aiImportHistory: AiImportRecord[];
  pomodoroHistory: PomodoroSession[];
  paperQuizSessions?: PaperQuizSession[];
  wrongAnswerReviews: WrongAnswerReview[];
  characterProgress: Record<string, CharacterProgress>;
};

export type PomodoroSession = {
  id: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  subject: string;
  topic: string;
  sessionNumber: number;
  totalSessions: number;
  mode: "focus" | "shortBreak" | "longBreak";
  status: "completed" | "abandoned" | "skipped";
};

export type StudyAccount = {
  id: string;
  name: string;
  code: string;
  role: StudyRole;
  locked: boolean;
  createdAt: string;
};

export type StudySession = {
  token: string;
  expiresAt: string;
  account: StudyAccount;
};

export type AchievementMetric = "xp" | "learnedCards" | "completedQuizzes" | "completedSets" | "fragments" | "pomodoroSessions";

export type Achievement = {
  id: string;
  rank: number;
  rankName: string;
  icon: string;
  name: string;
  description: string;
  metric: AchievementMetric;
  threshold: number;
  rewardXp: number;
  rewardFragments: number;
  title: string | null;
  titleMeaning: string | null;
  difficulty: "Dễ" | "Bình thường" | "Khó" | "Rất khó" | "Cực khó" | "Huyền thoại";
  badgeLabel: string;
  encouragement: string;
  progress: number;
  animation: "spark" | "glow" | "legendary";
  unlockedAt: string | null;
};

export const emptyProfile = (): ProfileState => ({
  xp: 0,
  level: 1,
  flashcardSets: [],
  quizzes: [],
  attempts: [],
  studyActivity: [],
  fragments: {},
  unlockedAchievementIds: [],
  ownedBadges: [],
  activeTitle: null,
  wheelTickets: 0,
  inventory: [],
  achievementUnlockDates: {},
  soundEnabled: true,
  theme: "light",
  lastActivityAt: null,
  currentStreak: 0,
  bestStreak: 0,
  streakShields: 0,
  aiImportHistory: [],
  pomodoroHistory: [],
  wrongAnswerReviews: [],
  characterProgress: {},
});

export const emptyAppConfig = (): AppConfig => ({
  characters: [],
  encouragements: [],
  wheelRewards: [],
  wheelTicketsPerAchievement: 1,
  dailyFragmentCap: 10,
  achievementOverrides: [],
  customAchievements: [],
  updatedAt: new Date().toISOString(),
});

export const levelForXp = (xp: number) => Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 90)) + 1);
export const xpForNextLevel = (level: number) => Math.max(90, level * level * 90);

export const statsForProfile = (profile: ProfileState) => {
  const learnedCards = profile.flashcardSets.reduce(
    (sum, set) => sum + set.cards.filter((card) => card.status === "known").length,
    0,
  );
  const completedSets = profile.flashcardSets.filter(
    (set) => set.cards.length > 0 && set.cards.every((card) => card.status === "known"),
  ).length;
  const fragments = Object.values(profile.fragments).reduce((sum, value) => sum + Math.max(0, value), 0);
  const pomodoroSessions = profile.pomodoroHistory.filter((session) => session.status === "completed").length;
  const studySeconds = profile.studyActivity.reduce((sum, item) => sum + Math.max(0, item.durationSeconds), 0)
    || profile.attempts.reduce((sum, attempt) => sum + Math.max(0, attempt.durationSeconds), 0);
  return {
    xp: profile.xp,
    learnedCards,
    completedSets,
    completedQuizzes: profile.attempts.length,
    fragments,
    pomodoroSessions,
    studySeconds,
  };
};

const ranks = [
  ["🌱", "Khởi Đầu", "Dễ"],
  ["🌿", "Tiến Bước", "Dễ"],
  ["⭐", "Bứt Phá", "Bình thường"],
  ["🔥", "Thử Thách", "Khó"],
  ["💎", "Cao Cấp", "Khó"],
  ["👑", "Tinh Anh", "Rất khó"],
  ["⚡", "Vô Cực", "Cực khó"],
  ["🌌", "Truyền Thuyết", "Cực khó"],
  ["🐝", "Huyền Thoại", "Huyền thoại"],
] as const;

const metricLabels: Record<AchievementMetric, string> = {
  xp: "XP",
  learnedCards: "Flashcard đã nhớ",
  completedQuizzes: "đề đã hoàn thành",
  completedSets: "bộ Flashcard đã hoàn thành",
  fragments: "mảnh ghép đang sở hữu",
  pomodoroSessions: "phiên Pomodoro hoàn thành",
};

const titleSeeds = [
  "Người Bắt Đầu Con Đường", "Bước Chân Đầu Tiên", "Mầm Tri Thức", "Người Gieo Hạt", "Ánh Sáng Đầu Ngày",
  "Người Không Bỏ Cuộc", "Kẻ Bền Chí", "Người Rèn Ý Chí", "Bước Chậm Mà Chắc", "Người Đi Đến Cùng",
  "Ong Chăm Chỉ", "Ong Góp Nhặt Tri Thức", "Người Thợ Xây Tổ", "Người Gom Từng Giọt Mật", "Ong Không Ngừng Bay",
  "Người Giữ Ngọn Đèn", "Lửa Học Bền Lâu", "Ánh Đèn Bên Trang Sách", "Người Soi Đường", "Đốm Sáng Không Tàn",
  "Có Công Mài Sắt", "Kiến Tha Lâu Đầy Tổ", "Nước Chảy Đá Mòn", "Học Thầy Học Bạn", "Góp Gió Thành Bão",
  "Người Vượt Dốc", "Kẻ Băng Qua Mưa Gió", "Người Mở Lối", "Bản Lĩnh Đường Xa", "Người Vươn Tới",
  "Hạt Mầm Vươn Cành", "Cánh Chim Tri Thức", "Dòng Sông Kiến Văn", "Ngọn Núi Bền Gan", "Vầng Trăng Học Hỏi",
  "Người Dệt Mạng Hiểu Biết", "Kẻ Thuần Hóa Thử Thách", "Người Chạm Chân Trời", "Bậc Thầy Tích Lũy", "Người Gọi Bình Minh",
] as const;
const titleQualifiers = ["Khởi Sắc", "Bền Chí", "Tiến Hóa", "Tinh Anh", "Cao Quý", "Vô Cực", "Truyền Thuyết", "Huyền Thoại", "Rạng Danh", "Tối Thượng"] as const;
const titleMeaning = (seed: string, qualifier: string, specialIndex: number) => `Danh hiệu ${qualifier.toLowerCase()} #${specialIndex + 1}, dành cho người mang tinh thần ${seed.toLowerCase()} và biết biến từng lần ôn tập thành một bước tiến riêng.`;

export function generateAchievements(): Achievement[] {
  const metrics: AchievementMetric[] = ["learnedCards", "completedQuizzes", "xp", "completedSets", "fragments", "pomodoroSessions"];
  const result: Achievement[] = [];
  ranks.forEach(([icon, rankName, difficulty], rank) => {
    for (let withinRank = 0; withinRank < 100; withinRank += 1) {
      const index = rank * 100 + withinRank;
      const metric = metrics[index % metrics.length];
      const growth = Math.pow(1.055, withinRank) * Math.pow(rank + 1, 1.55);
      const base = metric === "xp" ? 250 : metric === "learnedCards" ? 10 : metric === "completedQuizzes" ? 3 : metric === "completedSets" ? 2 : metric === "pomodoroSessions" ? 10 : 3;
      const specialIndex = index - 500;
      const specialStep = Math.floor(Math.max(0, specialIndex) / metrics.length);
      const threshold = index >= 500 ? Math.max(1, Math.round(base * Math.pow(1.055, specialStep)) + specialStep) : Math.max(1, Math.round(base * growth));
      const titleSeed = titleSeeds[specialIndex % titleSeeds.length];
      const qualifier = titleQualifiers[Math.floor(specialIndex / titleSeeds.length) % titleQualifiers.length];
      const title = index === 899 ? "Người Giữ Ngọn Lửa Tri Thức" : index >= 500 ? `${titleSeed} · ${qualifier}` : null;
      const difficultyLabel = rank === 8 ? "Huyền thoại" : difficulty;
      result.push({
        id: `rank-${rank + 1}-${withinRank + 1}`,
        rank: rank + 1,
        rankName,
        icon,
        name: `${rankName} ${withinRank + 1}`,
        description: `Đạt ${threshold.toLocaleString("vi-VN")} ${metricLabels[metric]}.`,
        metric,
        threshold,
        rewardXp: 20 + rank * 25 + Math.floor(withinRank / 10) * 5,
        rewardFragments: withinRank % 20 === 19 ? 1 : 0,
        title,
        titleMeaning: title ? index === 899 ? "Danh hiệu tối thượng dành cho người đã đi hết hành trình, giữ lửa học tập và truyền cảm hứng cho những chặng đường tiếp theo." : titleMeaning(titleSeed, qualifier, specialIndex) : null,
        difficulty: difficultyLabel,
        badgeLabel: `${rankName} · Huy hiệu ${withinRank + 1}`,
        encouragement: index === 899 ? "Ong đã đi hết hành trình 900 mốc — không phải vì con đường kết thúc, mà vì bạn đã chứng minh mình có thể đi rất xa." : title ? "Ong đã bay thêm một chặng dài trên hành trình tri thức." : "Mỗi bước học đều làm nền cho bước tiến tiếp theo.",
        progress: 0,
        animation: index === 899 ? "legendary" : rank >= 7 ? "glow" : "spark",
        unlockedAt: null,
      });
    }
  });
  return result;
}

export function computedAchievements(profile: ProfileState, config: AppConfig): Achievement[] {
  const stats = statsForProfile(profile) as Record<AchievementMetric, number>;
  const overrides = new Map(config.achievementOverrides.map((item) => [item.achievementId, item]));
  const standard = generateAchievements()
    .map((achievement) => ({ ...achievement, ...overrides.get(achievement.id), progress: Math.min(100, Math.round((stats[achievement.metric] / achievement.threshold) * 100)), unlockedAt: profile.achievementUnlockDates[achievement.id] ?? null }))
    .filter((achievement) => achievement.enabled !== false)
    .filter((achievement) => stats[achievement.metric] >= achievement.threshold);
  const customs: Achievement[] = config.customAchievements
    .filter((item) => item.enabled)
    .filter((item) => (stats[item.metric] ?? 0) >= item.threshold)
    .map((item) => ({
      id: item.id,
      rank: 9,
      rankName: "Tùy chỉnh",
      icon: "🏆",
      name: item.name,
      description: item.description,
      metric: item.metric,
      threshold: item.threshold,
      rewardXp: item.rewardXp,
      rewardFragments: item.rewardFragments,
      title: item.title?.trim() || null,
      titleMeaning: item.titleMeaning?.trim() || null,
      difficulty: "Khó",
      badgeLabel: "Thành tích tùy chỉnh",
      encouragement: "Một cột mốc riêng đang được mở khóa.",
      progress: Math.min(100, Math.round(((stats[item.metric] ?? 0) / item.threshold) * 100)),
      animation: "spark",
      unlockedAt: profile.achievementUnlockDates[item.id] ?? null,
    }));
  return [...standard, ...customs];
}

export type GeneratedValidation = { valid: boolean; errors: string[]; warnings: string[] };

export function validateGeneratedCards(cards: Array<{ front?: string; back?: string }>): GeneratedValidation {
  const errors: string[] = []; const warnings: string[] = [];
  if (!cards.length) errors.push("Chưa có Flashcard hợp lệ.");
  if (cards.length > 27) warnings.push("Nội dung sẽ được giới hạn ở 27 Flashcard.");
  cards.forEach((card, index) => { if (!String(card.front ?? "").trim()) errors.push(`Flashcard ${index + 1} thiếu mặt trước.`); if (!String(card.back ?? "").trim()) errors.push(`Flashcard ${index + 1} thiếu mặt sau.`); });
  return { valid: errors.length === 0, errors, warnings };
}

export function validateGeneratedQuestions(questions: Array<{ type?: string; prompt?: string; options?: string[]; answer?: string; explanation?: string }>): GeneratedValidation {
  const errors: string[] = []; const warnings: string[] = [];
  if (!questions.length) errors.push("Chưa có câu hỏi hợp lệ.");
  questions.forEach((question, index) => { const label = `Câu ${index + 1}`; const prompt = String(question.prompt ?? "").trim(); const answer = String(question.answer ?? "").trim(); if (!prompt) errors.push(`${label} thiếu nội dung.`); if (!answer) errors.push(`${label} thiếu đáp án.`); if (question.type === "multiple") { const options = (question.options ?? []).map(String).map((item) => item.trim()).filter(Boolean); if (options.length < 2) errors.push(`${label} trắc nghiệm phải có ít nhất 2 lựa chọn.`); if (answer && options.length && !options.includes(answer)) errors.push(`${label} có đáp án không nằm trong lựa chọn.`); } if (question.type === "boolean" && !["true", "false", "đúng", "sai"].includes(answer.toLowerCase())) errors.push(`${label} đúng/sai phải có đáp án Đúng hoặc Sai.`); });
  if (questions.some((question) => !question.explanation?.trim?.())) warnings.push("Một số câu chưa có giải thích; hãy xem lại trước khi lưu.");
  return { valid: errors.length === 0, errors, warnings };
}

export function applyAchievementRewards(profile: ProfileState, config: AppConfig) {
  const newlyUnlocked = computedAchievements(profile, config).filter(
    (achievement) => !profile.unlockedAchievementIds.includes(achievement.id),
  );
  if (!newlyUnlocked.length) return { profile, newlyUnlocked };
  const rewardXp = newlyUnlocked.reduce((sum, achievement) => sum + achievement.rewardXp, 0);
  const rewardFragments = newlyUnlocked.reduce((sum, achievement) => sum + achievement.rewardFragments, 0);
  const titles = newlyUnlocked.map((achievement) => achievement.title).filter((title): title is string => Boolean(title));
  const next: ProfileState = {
    ...profile,
    xp: profile.xp + rewardXp,
    level: levelForXp(profile.xp + rewardXp),
    fragments: rewardFragments ? { ...profile.fragments, general: (profile.fragments.general ?? 0) + rewardFragments } : profile.fragments,
    unlockedAchievementIds: [...profile.unlockedAchievementIds, ...newlyUnlocked.map((achievement) => achievement.id)],
    achievementUnlockDates: { ...profile.achievementUnlockDates, ...Object.fromEntries(newlyUnlocked.map((achievement) => [achievement.id, new Date().toISOString()])) },
    ownedBadges: Array.from(new Set([...profile.ownedBadges, ...newlyUnlocked.map((achievement) => achievement.icon)])),
    activeTitle: titles.at(-1) ?? profile.activeTitle,
    wheelTickets: profile.wheelTickets + newlyUnlocked.filter((achievement) => achievement.rewardFragments > 0).length * Math.max(0, Number(config.wheelTicketsPerAchievement) || 0),
  };
  return { profile: next, newlyUnlocked };
}

export function updateStudyStreak(profile: ProfileState, occurredAt: string) {
  const dayKey = (value: string) => new Date(value).toISOString().slice(0, 10);
  const currentKey = dayKey(occurredAt);
  const lastKey = profile.lastActivityAt ? dayKey(profile.lastActivityAt) : null;
  if (lastKey === currentKey) return profile;
  const previous = profile.currentStreak ?? 0;
  const gap = lastKey ? Math.round((Date.parse(`${currentKey}T00:00:00.000Z`) - Date.parse(`${lastKey}T00:00:00.000Z`)) / 86400000) : 0;
  const continued = gap === 1 ? previous + 1 : gap === 2 && (profile.streakShields ?? 0) > 0 ? previous + 1 : 1;
  const shields = gap === 2 && (profile.streakShields ?? 0) > 0 ? (profile.streakShields ?? 0) - 1 : profile.streakShields ?? 0;
  return { ...profile, currentStreak: continued, bestStreak: Math.max(profile.bestStreak ?? 0, continued), streakShields: shields };
}

function nextStreakShield(profile: ProfileState, occurredAt: string) {
  const streaked = updateStudyStreak(profile, occurredAt);
  return streaked.currentStreak > 0 && streaked.currentStreak % 7 === 0 ? Math.min(3, streaked.streakShields + 1) : streaked.streakShields;
}

export function applyStudyActivityRewards(profile: ProfileState, activity: StudyActivity, config: AppConfig) {
  if (profile.studyActivity.some((item) => item.id === activity.id)) return { profile, added: false, newlyUnlocked: [] as Achievement[] };
  const quantity = Math.max(0, Math.floor(activity.quantity));
  const xpEarned = Math.max(0, Math.floor(activity.xpEarned));
  const previousPomodoros = profile.pomodoroHistory.filter((session) => session.status === "completed").length;
  const rawFragmentReward = activity.kind === "pomodoro" ? ((previousPomodoros + 1) % 10 === 0 ? 1 : 0) : Math.max(0, Math.floor(quantity / 10));
  const dayKey = activity.occurredAt.slice(0, 10);
  const fragmentsToday = profile.studyActivity.filter((item) => item.occurredAt.slice(0, 10) === dayKey).reduce((sum, item) => sum + Math.max(0, Math.floor(item.quantity / 10)), 0);
  const fragmentReward = Math.max(0, Math.min(rawFragmentReward, Math.max(0, Number(config.dailyFragmentCap ?? 10) - fragmentsToday)));
  const next: ProfileState = {
    ...updateStudyStreak(profile, activity.occurredAt),
    xp: profile.xp + xpEarned,
    level: levelForXp(profile.xp + xpEarned),
    streakShields: nextStreakShield(profile, activity.occurredAt),
    studyActivity: [...profile.studyActivity, { ...activity, quantity, xpEarned }],
    fragments: fragmentReward ? { ...profile.fragments, general: (profile.fragments.general ?? 0) + fragmentReward } : profile.fragments,
    lastActivityAt: activity.occurredAt,
  };
  const rewarded = applyAchievementRewards(next, config);
  return { profile: rewarded.profile, added: true, newlyUnlocked: rewarded.newlyUnlocked };
}

export function normalizeProfile(value: unknown): ProfileState {
  const source = value && typeof value === "object" ? (value as Partial<ProfileState>) : {};
  const base = emptyProfile();
  const merged: ProfileState = {
    ...base,
    ...source,
    xp: Math.max(0, Number(source.xp) || 0),
    flashcardSets: Array.isArray(source.flashcardSets) ? source.flashcardSets : [],
    quizzes: Array.isArray(source.quizzes) ? source.quizzes : [],
    attempts: Array.isArray(source.attempts) ? source.attempts.flatMap((value) => { const attempt = value && typeof value === "object" ? (value as Partial<QuizAttempt>) : null; if (!attempt?.id || !attempt.quizId) return []; return [{ id: String(attempt.id), quizId: String(attempt.quizId), completedAt: String(attempt.completedAt ?? new Date(0).toISOString()), correct: Math.max(0, Number(attempt.correct) || 0), total: Math.max(0, Number(attempt.total) || 0), accuracy: Math.max(0, Math.min(100, Number(attempt.accuracy) || 0)), durationSeconds: Math.max(0, Number(attempt.durationSeconds) || 0), answers: Array.isArray(attempt.answers) ? attempt.answers : [] }]; }) : [],
    studyActivity: Array.isArray(source.studyActivity) ? source.studyActivity.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<StudyActivity>) : null; if (!item?.id || (item.kind !== "flashcard" && item.kind !== "quiz" && item.kind !== "wheel" && item.kind !== "pomodoro")) return []; return [{ id: String(item.id), occurredAt: String(item.occurredAt ?? new Date(0).toISOString()), kind: item.kind, quantity: Math.max(0, Number(item.quantity) || 0), durationSeconds: Math.max(0, Number(item.durationSeconds) || 0), xpEarned: Math.max(0, Number(item.xpEarned) || 0), correct: item.correct === undefined ? undefined : Math.max(0, Number(item.correct) || 0), total: item.total === undefined ? undefined : Math.max(0, Number(item.total) || 0) }]; }) : [],
    fragments: source.fragments && typeof source.fragments === "object" ? source.fragments : {},
    unlockedAchievementIds: Array.isArray(source.unlockedAchievementIds) ? source.unlockedAchievementIds : [],
    ownedBadges: Array.isArray(source.ownedBadges) ? source.ownedBadges : [],
    inventory: Array.isArray(source.inventory) ? source.inventory : [],
    achievementUnlockDates: source.achievementUnlockDates && typeof source.achievementUnlockDates === "object" ? source.achievementUnlockDates : {},
    currentStreak: Math.max(0, Number(source.currentStreak) || 0),
    bestStreak: Math.max(0, Number(source.bestStreak) || 0),
    streakShields: Math.max(0, Math.min(3, Number(source.streakShields) || 0)),
    characterProgress: source.characterProgress && typeof source.characterProgress === "object" ? Object.fromEntries(Object.entries(source.characterProgress).flatMap(([characterId, value]) => { const item = value && typeof value === "object" ? (value as Partial<CharacterProgress>) : {}; if (!characterId) return []; const collected = Array.isArray(item.collectedPieceIds) ? item.collectedPieceIds.map(String) : []; const used = Array.isArray(item.usedPieceIds) ? item.usedPieceIds.map(String) : []; const status: CharacterUnlockStatus = item.status === "unlocked" || item.status === "ready" || item.status === "assembling" ? item.status : collected.length ? "assembling" : "locked"; return [[characterId, { characterId, collectedPieceIds: Array.from(new Set(collected)), usedPieceIds: Array.from(new Set(used)), status, assembledAt: item.assembledAt ? String(item.assembledAt) : null, unlockedAt: item.unlockedAt ? String(item.unlockedAt) : null } as CharacterProgress]]; })) : {},
    pomodoroHistory: Array.isArray(source.pomodoroHistory) ? source.pomodoroHistory.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<PomodoroSession>) : null; if (!item?.id) return []; return [{ id: String(item.id), startedAt: String(item.startedAt ?? new Date(0).toISOString()), endedAt: String(item.endedAt ?? new Date(0).toISOString()), durationMinutes: Math.max(1, Number(item.durationMinutes) || 1), subject: String(item.subject ?? ""), topic: String(item.topic ?? ""), sessionNumber: Math.max(1, Number(item.sessionNumber) || 1), totalSessions: Math.max(1, Number(item.totalSessions) || 1), mode: item.mode === "shortBreak" || item.mode === "longBreak" ? item.mode : "focus", status: item.status === "abandoned" || item.status === "skipped" ? item.status : "completed" }]; }) : [],
    aiImportHistory: Array.isArray(source.aiImportHistory) ? source.aiImportHistory.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<AiImportRecord>) : null; if (!item?.id || !item.title) return []; return [{ id: String(item.id), title: String(item.title), createdAt: String(item.createdAt ?? new Date(0).toISOString()), target: item.target === "quiz" || item.target === "both" || item.target === "practice" ? item.target : "flashcards", questionCount: Math.max(0, Number(item.questionCount) || 0), flashcardCount: Math.max(0, Number(item.flashcardCount) || 0), prompt: String(item.prompt ?? ""), rawData: String(item.rawData ?? ""), quizId: item.quizId ? String(item.quizId) : undefined, flashcardSetId: item.flashcardSetId ? String(item.flashcardSetId) : undefined }]; }) : [],
    wrongAnswerReviews: Array.isArray(source.wrongAnswerReviews) ? source.wrongAnswerReviews.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<WrongAnswerReview>) : null; if (!item?.id || !item.attemptId || !item.questionId) return []; return [{ id: String(item.id), attemptId: String(item.attemptId), questionId: String(item.questionId), question: String(item.question ?? ""), learnerAnswer: String(item.learnerAnswer ?? ""), correctAnswer: String(item.correctAnswer ?? ""), whyWrong: String(item.whyWrong ?? ""), knowledgeGap: String(item.knowledgeGap ?? ""), correctThinking: Array.isArray(item.correctThinking) ? item.correctThinking.map(String) : [], commonMistake: String(item.commonMistake ?? ""), retryQuestion: String(item.retryQuestion ?? ""), retryAnswer: String(item.retryAnswer ?? ""), source: String(item.source ?? "Chưa cung cấp"), needsVerification: item.needsVerification === true, createdAt: String(item.createdAt ?? new Date(0).toISOString()) }]; }) : [],
  };
  merged.level = levelForXp(merged.xp);
  return merged;
}

export function limitFlashcards<T>(cards: T[], limit = 27): T[] {
  return cards.slice(0, Math.max(0, Math.min(27, limit)));
}
