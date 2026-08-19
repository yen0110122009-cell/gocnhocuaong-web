export type StudyRole = "Member" | "Admin" | "Founder";

import { grantFragmentSourceReward } from "./fragmentSystem";

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
  deletedAt?: string;
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
export type FragmentTier = "I" | "II" | "III" | "IV" | "V" | "VI";
export type FragmentTierConfig = { tier: FragmentTier; label: string; value: number; rarity: FragmentRarity; enabled: boolean };
export type CollectionProfileLevel = { id: string; label: string; requiredValue: number; description: string; unlocked: boolean };
export type CosmeticThemeId = "ong-red" | "forest-green" | "sunset-amber" | "ocean-blue";
export type CosmeticBackgroundId = "paper-grid" | "leaf-drift" | "sunrise-glow" | "night-stars";
export type CollectionShopItem = { id: string; name: string; description: string; kind: "profileFrame" | "profileBackground" | "icon" | "decorativeBadge" | "mascotAccessory" | "profileEffect" | "historyTheme" | "colorTheme" | "animatedBackground"; price: number; currency: "collectionTicket" | "fragmentValue"; rarity: "common" | "rare" | "epic" | "legendary"; stock: number | null; enabled: boolean; cosmeticType?: "theme" | "background"; cosmeticId?: CosmeticThemeId | CosmeticBackgroundId; previewClass?: string; deletedAt?: string; };
export type RewardSourceKind = "achievement" | "studySession" | "pomodoroMilestone" | "quiz" | "deepReview" | "scoreImprovement" | "streak" | "task" | "event";
export type FragmentRewardGrant = { tier: FragmentTier; amount: number; label?: string };
export type LearningMilestone = { id: string; label: string; studySeconds: number; rewards: FragmentRewardGrant[]; achievementPoints?: number; enabled: boolean };
export type AdminReward = { id: string; name: string; type: "achievement_points" | "piece" | "ticket" | "cosmetic" | "mascot_item" | "profile_item"; value: number; rarity: "common" | "rare" | "epic" | "legendary"; icon: string; description: string; condition: string; active: boolean; createdAt: string; updatedAt: string; recipientUserId?: string; grantReason?: string; auditId?: string; approvalStatus?: "draft" | "approved" | "revoked"; deletedAt?: string };
export type PieceExchangeRule = { id: string; fromTier: FragmentTier; fromAmount: number; toTier: FragmentTier; toAmount: number; enabled: boolean; extraInputs?: Array<{ kind: "tier" | "ticket" | "item"; code: string; amount: number }> };
export type DynamicFragmentType = { id: string; code: string; name: string; rarity: FragmentRarity; value: number; description: string; uses: string[]; earnMethods: string[]; exchangeMethods: string[]; icon: string; enabled: boolean; createdAt: string; updatedAt: string };
export type PieceExchangeFormula = { id: string; name: string; inputs: Array<{ kind: "tier" | "ticket" | "item"; code: string; amount: number }>; outputs: Array<{ kind: "tier" | "ticket" | "item"; code: string; amount: number }>; enabled: boolean; startsAt?: string; endsAt?: string; createdAt: string; updatedAt: string };
export type PieceTransaction = {
  id: string;
  occurredAt: string;
  source: string;
  sourceType: RewardSourceKind | "collectionProfile" | "collectionShop" | "admin";
  sourceId: string;
  reason: string;
  type: "grant" | "spend" | "exchange" | "refund";
  tier: FragmentTier;
  amount: number;
  value: number;
  claimKey?: string;
  description?: string;
  relatedId?: string;
  userId?: string;
};
export type RewardClaimReceipt = {
  claimKey: string;
  sourceType: string;
  sourceId: string;
  reason: string;
  claimedAt: string;
  amount: number;
  transactionIds: string[];
};
export type RewardAuditLog = {
  id: string;
  occurredAt: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  metadata?: Record<string, string | number | boolean | null>;
};
export type RewardSourceExplanation = { sourceId: string; label: string; description: string; dailyCap?: number; claimLimit?: number; rewards: FragmentRewardGrant[] };
export type FragmentRewardSourceRule = {
  id: string;
  kind: RewardSourceKind;
  label: string;
  description: string;
  enabled: boolean;
  dailyCap?: number;
  claimLimit?: number;
  milestone?: number;
  conditionParameters?: Record<string, number | string>;
  rewards: FragmentRewardGrant[];
};
export type CollectionEventTask = { id: string; title: string; description: string; target: number; metric: RewardSourceKind; reward?: FragmentRewardGrant[] };
export type CollectionEvent = {
  id: string;
  name: string;
  description: string;
  bannerUrl?: string;
  startsAt: string;
  endsAt: string;
  status: "draft" | "scheduled" | "active" | "ended" | "archived";
  difficulty: "Dễ" | "Bình thường" | "Khó" | "Rất khó";
  objective: string;
  tasks: CollectionEventTask[];
  rewards: Array<{ type: "xp" | "ticket" | "item"; amount: number; itemId?: string; label?: string }>;
  fragmentRewards: FragmentRewardGrant[];
  participationConditions: Array<{ id: string; label: string; metric: string; target: number }>;
  claimLimit: number;
  maxParticipants?: number;
  approvalStatus?: "draft" | "approved";
  aiDraft?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
export type CollectionConfig = { tierValues: FragmentTierConfig[]; ticketExchange: { fragmentValue: number; tickets: number; enabled: boolean }; shopItems: CollectionShopItem[]; rewardSources?: FragmentRewardSourceRule[]; events?: CollectionEvent[]; learningMilestones?: LearningMilestone[]; adminRewards?: AdminReward[]; pieceExchangeRules?: PieceExchangeRule[]; exchangeFormulas?: PieceExchangeFormula[]; fragmentTypes?: DynamicFragmentType[]; rewardExplanations?: RewardSourceExplanation[] };
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
  unlockedProfileLevelIds?: string[];
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
  sourceText?: string;
  imageUrl: string;
  imageSource: string;
  imageStatus?: "missing" | "updating" | "available";
  fragmentTotal: number;
  fragmentCost?: number;
  period?: string;
  historicalPeriod?: string;
  dynasty?: string;
  field?: string;
  category?: string;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlockCost?: number;
  description?: string;
  adminNote?: string;
  deletedAt?: string | null;
  profileLevels?: CollectionProfileLevel[];
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
  enabled?: boolean;
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
  titleGroup?: number;
  source_type?: "verified" | "inspired";
  source_text?: string;
  source_note?: string;
  /** Ảnh Lumi bạn đồng hành cho nhiệm vụ/mốc này; để trống sẽ dùng Lumi mặc định. */
  lumiImageUrl?: string;
  enabled: boolean;
  deletedAt?: string;
};

export type ContentKind = "comfort" | "encouragement" | "studyHint" | "antiProcrastination" | "microTask" | "reminder" | "choice" | "other";
export type ContentTone = "gentle" | "normal" | "positive" | "humorous" | "highEnergy";
export type ContentContext = "mistake" | "lowScore" | "procrastination" | "start" | "pomodoroComplete" | "tired" | "sad" | "lostStreak" | "comeback" | "achievement" | "confused" | "taskComplete" | "complete" | "unsure" | "blank" | "hardTask" | "studyLittle" | "notStudied" | "browsing" | "tooLarge" | "explainMissing" | "explainPartial" | "explainCorrect" | "errorFound" | "review";
export type ContentModule = "pomodoro" | "quiz" | "deepStudy" | "achievement" | "journal" | "antiProcrastination" | "global";
export type MascotStateId = "idle" | "happy" | "studying" | "focus" | "tired" | "sleepy" | "procrastinating" | "encouragement" | "achievement" | "mistake" | "comeback" | "streak" | "level_up" | "deep_focus" | "break" | "almost_done" | "completed";
export type MascotStateItem = {
  id: MascotStateId | string;
  name: string;
  description: string;
  condition: string;
  imageUrl?: string;
  enabled: boolean;
  createdAt?: string;
  deletedAt?: string;
  updatedAt?: string;
};
export type ContentApprovalStatus = "approved" | "ai_suggestion";
export type CustomContentItem = {
  id: string;
  kind: ContentKind;
  text: string;
  contexts: ContentContext[];
  modules: ContentModule[];
  mascot: "lumi" | "lumi-sad" | "lumi-cheer" | "lumi-celebrate" | "ong";
  tone: ContentTone;
  enabled: boolean;
  approvalStatus?: ContentApprovalStatus;
  source?: "ong" | "ai" | "import";
  createdAt?: string;
  deletedAt?: string;
  lastUsedAt?: string;
  useCount?: number;
};

export type ContentImportEnvelope = {
  version: 1;
  exportedAt: string;
  app: "gocnhocuaong";
  items: CustomContentItem[];
};

export type AiContentSuggestion = Omit<CustomContentItem, "approvalStatus" | "source" | "deletedAt" | "lastUsedAt" | "useCount"> & {
  approvalStatus: "ai_suggestion";
  source: "ai";
};

export type LevelDefinition = { id: string; name: string; icon: string; enabled: boolean; createdAt?: string; updatedAt?: string; deletedAt?: string };
export type AchievementEvidence = {
  id: string;
  achievementId: string;
  label: string;
  value: number;
  source: "profile" | "studyActivity" | "deepLearning" | "streak" | "comparison";
  occurredAt?: string;
};

export type EmotionThemeId = "calm" | "happy" | "tired" | "sad" | "stressed" | "lazy" | "proud" | "focused" | "hopeful" | "overwhelmed" | "sleepy" | "excited" | "lonely" | "confident" | "curious" | "comeback";

export type MascotVoiceLine = {
  id: string;
  state: MascotStateId | string;
  /** A recording explicitly selected for this learner emotion. Older state-only recordings remain supported. */
  emotion?: EmotionThemeId;
  text: string;
  audioUrl?: string;
  source?: "admin" | "learner";
  enabled: boolean;
  createdAt?: string;
  deletedAt?: string;
};

export type AchievementMoment = {
  id: string;
  achievementId: string;
  createdAt: string;
  note: string;
  feeling: string;
  mascotVariant: "hoodie";
  photoUrl?: string;
  deletedAt?: string;
};


export type DeepLearningEvent = { id: string; occurredAt: string; kind: "correct" | "explained" | "selfFoundError" | "retryWrong" | "alternativeExplanation"; xpEarned: number; sourceId?: string; note?: string };

export type AppConfig = {
  characters: HistoricalCharacter[];
  encouragements: Encouragement[];
  customContent: CustomContentItem[];
  mascotStates: MascotStateItem[];
  mascotVoiceLines?: MascotVoiceLine[];
  wheelRewards: WheelReward[];
  wheelTicketsPerAchievement: number;
  dailyFragmentCap: number;
  collectionConfig?: CollectionConfig;
  achievementOverrides: AchievementOverride[];
  customAchievements: CustomAchievement[];
  deletedAchievementIds?: string[];
  deletedTitleIds?: string[];
  deletedRewardIds?: string[];
  deletedShopItemIds?: string[];
  levelDefinitions?: LevelDefinition[];
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

export type AvoidanceReason = "tired" | "phone" | "unclear" | "hard" | "unmotivated" | "noTime" | "other";
export type ProcrastinationEventKind = "opened_without_start" | "started_small" | "started_focus" | "abandoned_focus" | "completed_focus" | "task_shuffled" | "combo_completed";
export type ProcrastinationEvent = {
  id: string;
  occurredAt: string;
  kind: ProcrastinationEventKind;
  hour: number;
  taskMinutes?: number;
  reason?: AvoidanceReason;
};
export type ComboStep = { id: string; label: string; minutes: number; completed: boolean };
export type TaskCombo = { id: string; title: string; description: string; steps: ComboStep[]; startedAt?: string; completedAt?: string };
export type AmbientScenePreference = "morning" | "rain" | "snow" | "leaves" | "storm";
export type LumiVoiceRecording = { id: string; url: string; label: string; createdAt: string };
export type CompanionEmotionMedia = {
  mascotImageUrl?: string;
  lumiImageUrl?: string;
  /** Giữ lại để đọc hồ sơ cũ; bản ghi mới luôn dùng lumiVoiceRecordings. */
  lumiVoiceUrl?: string;
  lumiVoiceRecordings?: LumiVoiceRecording[];
  favoriteLumiVoiceId?: string;
};
export type AudioMixerSettings = {
  ambientSceneVolumes: Record<AmbientScenePreference, number>;
  pomodoroLayers: Record<string, number>;
  pomodoroBackground: number;
  pomodoroBell: number;
  lumi: number;
};

export type ProfileState = {
  xp: number;
  level: number;
  flashcardSets: FlashcardSet[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  studyActivity: StudyActivity[];
  fragments: Record<string, number>;
  fragmentLedger?: Partial<Record<FragmentTier, number>>;
  unlockedAchievementIds: string[];
  ownedBadges: string[];
  activeTitle: string | null;
  wheelTickets: number;
  collectionTickets?: number;
  inventory: string[];
  collectionInventory?: string[];
  collectionValueSpent?: number;
  activeCosmeticTheme?: CosmeticThemeId;
  activeCosmeticBackground?: CosmeticBackgroundId;
  achievementUnlockDates: Record<string, string>;
  soundEnabled: boolean;
  animationsEnabled?: boolean;
  popupsEnabled?: boolean;
  emotionTheme?: EmotionThemeId;
  companionEmotionMedia?: Partial<Record<EmotionThemeId, CompanionEmotionMedia>>;
  showMascot?: boolean;
  showLumi?: boolean;
  defaultAmbientScene?: AmbientScenePreference;
  audioMixer?: AudioMixerSettings;
  weeklyPomodoroGoalMinutes?: number;
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
  procrastinationEvents?: ProcrastinationEvent[];
  avoidanceReasons?: Array<{ id: string; occurredAt: string; reason: AvoidanceReason; note?: string }>;
  taskCombos?: TaskCombo[];
  deepLearningEvents?: DeepLearningEvent[];
  achievementMoments?: AchievementMoment[];
  achievementEvidence?: Record<string, AchievementEvidence[]>;
  mascotVoiceLines?: MascotVoiceLine[];
  fragmentRewardClaims?: Record<string, number>;
  eventProgress?: Record<string, Record<string, number>>;
  claimedEventRewards?: Record<string, number>;
  eventRewardClaims?: Record<string, RewardClaimReceipt>;
  pieceTransactions?: PieceTransaction[];
  rewardAuditLogs?: RewardAuditLog[];
  claimedMilestones?: Record<string, string>;
  claimedPieceExchanges?: Record<string, number>;
  rewardClaims?: Record<string, RewardClaimReceipt>;
  achievementRewardClaims?: Record<string, RewardClaimReceipt>;
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
export type AchievementConditionType = AchievementMetric | "currentStreak" | "bestStreak" | "studySeconds" | "deepFocusSessions";
export const achievementTopics = [
  { id: "study", label: "📚 Học tập" },
  { id: "pomodoro", label: "🍅 Pomodoro" },
  { id: "discipline", label: "🔥 Kỷ luật" },
  { id: "deep-understanding", label: "🧠 Hiểu tận gốc" },
  { id: "exam", label: "📝 Làm đề" },
  { id: "journal", label: "📔 Nhật ký" },
  { id: "anti-procrastination", label: "🫠 Chống trì hoãn" },
  { id: "journey", label: "🏆 Thành tựu & hành trình" },
  { id: "collection", label: "🐝 Khám phá & sưu tầm" },
] as const;
export type AchievementTopicId = (typeof achievementTopics)[number]["id"];
export type AchievementTopic = (typeof achievementTopics)[number]["label"];
export type AchievementCondition = {
  id: string;
  label: string;
  type: AchievementConditionType;
  parameters: Record<string, number | string>;
  currentProgress: number;
  targetProgress: number;
  progressPercentage: number;
  remaining: number;
  met: boolean;
};

export type Achievement = {
  id: string;
  achievementCode: string;
  rank: number;
  rankName: string;
  /** Cấp độ catalog 1–9; mỗi cấp độ luôn có đúng 100 mục. */
  level: number;
  levelLabel: string;
  group: string;
  topic: AchievementTopicId;
  topicLabel: AchievementTopic;
  tags: string[];
  icon: string;
  name: string;
  description: string;
  metric: AchievementMetric;
  conditionType: AchievementConditionType;
  conditionParameters: Record<string, number | string>;
  conditions: AchievementCondition[];
  threshold: number;
  rewardXp: number;
  rewardFragments: number;
  rewardType: "xp" | "fragment" | "title" | "mixed";
  rewardAmount: number;
  pieceReward: number;
  pieceTier: "I" | "II" | "III" | "IV";
  title: string | null;
  titleMeaning: string | null;
  titleSignificance?: string | null;
  titleInspiration?: string | null;
  titleExplanation?: string | null;
  titleSourceStatus?: "verified" | "inspired" | "not_applicable";
  titleGroup?: number | null;
  titleGroupLabel?: string | null;
  source_type?: "verified" | "inspired" | "not_applicable";
  source_text?: string | null;
  source_note?: string | null;
  rewardCategories?: Array<"achievement_points" | "history_fragment" | "exchange_ticket" | "cosmetic_item">;
  cosmeticReward?: string | null;
  exchangeTicketReward?: number;
  difficulty: "Dễ" | "Bình thường" | "Khó" | "Rất khó" | "Cực khó" | "Huyền thoại";
  badgeLabel: string;
  encouragement: string;
  progress: number;
  currentValue: number;
  remaining: number;
  animation: "spark" | "glow" | "legendary";
  unlockedAt: string | null;
  createdAt: string;
  updatedAt: string;
  evidence?: AchievementEvidence[];
  enabled?: boolean;
  isSecret?: boolean;
};

export const emptyProfile = (): ProfileState => ({
  xp: 0,
  level: 1,
  flashcardSets: [],
  quizzes: [],
  attempts: [],
  studyActivity: [],
  fragments: {},
  fragmentLedger: {},
  unlockedAchievementIds: [],
  ownedBadges: [],
  activeTitle: null,
  wheelTickets: 0,
  inventory: [],
  achievementUnlockDates: {},
  soundEnabled: true,
  animationsEnabled: true,
  popupsEnabled: true,
  emotionTheme: "calm",
  companionEmotionMedia: {},
  showMascot: true,
  showLumi: true,
  defaultAmbientScene: "morning",
  audioMixer: { ambientSceneVolumes: { morning: 45, rain: 42, snow: 32, leaves: 36, storm: 38 }, pomodoroLayers: {}, pomodoroBackground: 40, pomodoroBell: 70, lumi: 75 },
  weeklyPomodoroGoalMinutes: 300,
  theme: "light",
  lastActivityAt: null,
  currentStreak: 0,
  bestStreak: 0,
  streakShields: 0,
  aiImportHistory: [],
  pomodoroHistory: [],
  wrongAnswerReviews: [],
  characterProgress: {},
  procrastinationEvents: [],
  avoidanceReasons: [],
  taskCombos: [],
  achievementMoments: [],
  achievementEvidence: {},
  mascotVoiceLines: [],
  fragmentRewardClaims: {},
  eventProgress: {},
  claimedEventRewards: {},
  eventRewardClaims: {},
  rewardClaims: {},
  achievementRewardClaims: {},
  rewardAuditLogs: [],
  pieceTransactions: [],
  claimedMilestones: {},
  claimedPieceExchanges: {},
  deepLearningEvents: [],
});

export const emptyAppConfig = (): AppConfig => ({
  characters: [],
  encouragements: [],
  customContent: [],
  mascotStates: [
    ["idle", "Bình thường", "Lumi sẵn sàng đồng hành.", "Khi mở dashboard hoặc chưa có sự kiện."],
    ["happy", "Vui vẻ", "Lumi vui cùng một bước tiến nhỏ.", "Khi có hoạt động tích cực."],
    ["studying", "Đang học", "Lumi ngồi cạnh và giữ nhịp.", "Khi bắt đầu phiên học."],
    ["focus", "Tập trung", "Lumi giúp Ong giữ sự chú ý.", "Khi đang trong phiên focus."],
    ["tired", "Mệt", "Lumi nhắc nghỉ nhẹ nhàng.", "Khi người học báo mệt."],
    ["sleepy", "Buồn ngủ", "Lumi gợi ý một bước thật nhỏ.", "Khi người học buồn ngủ."],
    ["procrastinating", "Trì hoãn", "Lumi không trách, chỉ rủ bắt đầu 5 phút.", "Khi chưa muốn bắt đầu."],
    ["encouragement", "Động viên", "Lumi cổ vũ mà không gây áp lực.", "Khi sắp bỏ cuộc."],
    ["achievement", "Ăn mừng thành tích", "Lumi vui cùng dấu mốc vừa mở.", "Khi mở khóa thành tích."],
    ["mistake", "An ủi lỗi sai", "Lumi giúp nhìn lỗi sai như manh mối.", "Khi làm sai hoặc điểm thấp."],
    ["comeback", "Quay lại", "Lumi chào mừng Ong trở lại.", "Sau nhiều ngày nghỉ."],
    ["streak", "Giữ chuỗi", "Lumi ghi nhận sự đều đặn.", "Khi duy trì streak."],
    ["level_up", "Lên cấp", "Lumi chúc mừng cấp độ mới.", "Khi lên level."],
    ["deep_focus", "Hiểu sâu", "Lumi khuyến khích giải thích tận gốc.", "Khi học sâu."],
    ["break", "Nghỉ", "Lumi nhắc nghỉ cũng là một phần của học.", "Khi vào thời gian nghỉ."],
    ["almost_done", "Gần xong", "Lumi ở cạnh trong những phút cuối.", "Khi còn ít thời gian."],
    ["completed", "Hoàn thành", "Lumi ăn mừng một phiên đã xong.", "Khi hoàn thành Pomodoro hoặc nhiệm vụ."],
  ].map(([id, name, description, condition]) => ({ id, name, description, condition, enabled: true, createdAt: new Date().toISOString() })),
  mascotVoiceLines: [],
  wheelRewards: [
    { id: "starter-xp-20", label: "Mẫu khởi đầu · +20 XP", kind: "xp", value: 20, probability: 45, color: "#22d3ee" },
    { id: "starter-fragment-1", label: "Mẫu khởi đầu · 1 mảnh ghép", kind: "fragment", value: 1, probability: 30, color: "#f4b942" },
    { id: "starter-ticket-1", label: "Mẫu khởi đầu · +1 vé quay", kind: "ticket", value: 1, probability: 25, color: "#86efac" },
  ],
  wheelTicketsPerAchievement: 1,
  dailyFragmentCap: 10,
  collectionConfig: {
    tierValues: [
      { tier: "I", label: "Cấp I · Phổ thông", value: 1, rarity: "common", enabled: true },
      { tier: "II", label: "Cấp II · Thường", value: 3, rarity: "common", enabled: true },
      { tier: "III", label: "Cấp III · Hiếm", value: 8, rarity: "rare", enabled: true },
      { tier: "IV", label: "Cấp IV · Quý", value: 20, rarity: "special", enabled: true },
      { tier: "V", label: "Cấp V · Sử thi", value: 50, rarity: "special", enabled: true },
      { tier: "VI", label: "Cấp VI · Huyền thoại", value: 120, rarity: "legendary", enabled: true },
    ],
    ticketExchange: { fragmentValue: 10, tickets: 1, enabled: true },
    shopItems: [],
    rewardSources: [
      { id: "source-study-session", kind: "studySession", label: "Phiên học hoàn thành", description: "Nhận mảnh khi hoàn thành phiên học; bị giới hạn theo ngày.", enabled: true, dailyCap: 3, rewards: [{ tier: "I", amount: 1 }] },
      { id: "source-pomodoro-10", kind: "pomodoroMilestone", label: "Mốc 10 Pomodoro", description: "Thưởng một lần khi tổng số Pomodoro hoàn thành chạm mốc.", enabled: true, claimLimit: 1, milestone: 10, rewards: [{ tier: "II", amount: 1 }] },
      { id: "source-quiz-complete", kind: "quiz", label: "Hoàn thành đề", description: "Thưởng cho mỗi đề hoàn thành; giới hạn theo ngày.", enabled: true, dailyCap: 2, rewards: [{ tier: "I", amount: 1 }] },
      { id: "source-deep-review", kind: "deepReview", label: "Deep Review", description: "Thưởng khi hoàn thành phiên review sâu.", enabled: true, dailyCap: 2, rewards: [{ tier: "II", amount: 1 }] },
      { id: "source-streak-7", kind: "streak", label: "Streak 7 ngày", description: "Thưởng một lần ở mốc streak.", enabled: true, claimLimit: 1, milestone: 7, rewards: [{ tier: "III", amount: 1 }] },
    ],
    events: [],
  },
  achievementOverrides: [],
  levelDefinitions: DEFAULT_LEVEL_DEFINITIONS,
  customAchievements: [
    { id: "starter-5-pomodoros", name: "Mẫu khởi đầu · Nhịp tập trung", description: "Hoàn thành 5 phiên Pomodoro.", metric: "pomodoroSessions", threshold: 5, rewardXp: 50, rewardFragments: 0, title: "Người giữ nhịp", titleMeaning: "Bền bỉ duy trì từng phiên học.", enabled: true },
    { id: "starter-25-cards", name: "Mẫu khởi đầu · Bộ thẻ đầu tiên", description: "Học thuộc 25 Flashcard.", metric: "learnedCards", threshold: 25, rewardXp: 75, rewardFragments: 1, title: "Người gom kiến thức", titleMeaning: "Tích lũy từng mảnh hiểu biết.", enabled: true },
    { id: "starter-3-quizzes", name: "Mẫu khởi đầu · Ba lần chinh phục", description: "Hoàn thành 3 bài kiểm tra.", metric: "completedQuizzes", threshold: 3, rewardXp: 60, rewardFragments: 0, enabled: true },
  ],
  updatedAt: new Date().toISOString(),
});

export const XP_PER_LEVEL = 300;
export const DEFAULT_LEVEL_DEFINITIONS: LevelDefinition[] = [
  ["🌱", "Bắt đầu"], ["🌿", "Đang lớn"], ["🌳", "Bền bỉ"], ["🐝", "Vào guồng"], ["👑", "Làm chủ"], ["🔥", "Giữ lửa"], ["💡", "Soi sáng"], ["🧠", "Hiểu sâu"], ["🏛️", "Tích lũy"], ["🌟", "Tỏa sáng"], ["🪽", "Bay xa"], ["♾️", "Không giới hạn"],
].map(([icon, name], index) => ({ id: `level-${index + 1}`, icon, name, enabled: true }));
export const levelForXp = (xp: number) => Math.max(1, Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1);
export const xpForNextLevel = (level: number) => Math.max(XP_PER_LEVEL, Math.max(1, level) * XP_PER_LEVEL);

export const deepLearningXpForAttempt = (attempt: QuizAttempt, quiz: Quiz, thoughts: Record<string, string> = {}) => {
  const questionById = new Map(quiz.questions.map((question) => [question.id, question]));
  let xp = 0;
  for (const question of quiz.questions) {
    const thought = (thoughts[question.id] ?? "").trim();
    const answer = attempt.answers?.find((item: any) => item?.questionId === question.id || item?.id === question.id) as any;
    const isCorrect = answer?.isCorrect === true || answer?.correct === true;
    if (isCorrect) xp += 1;
    if (thought.length >= 24) xp += 3;
    if (thought.length >= 70) xp += 5;
    if (attempt.certainty?.[question.id] === "wrong" && isCorrect) xp += 3;
    if (attempt.certainty?.[question.id] === "unsure" && thought.length >= 24) xp += 4;
    void questionById;
  }
  return xp;
};

export const dailyLearningSummary = (profile: ProfileState, date = new Date()) => {
  const key = date.toISOString().slice(0, 10);
  const activities = profile.studyActivity.filter((item) => item.occurredAt.slice(0, 10) === key);
  const deepEvents = (profile.deepLearningEvents ?? []).filter((item) => item.occurredAt.slice(0, 10) === key);
  return { started: activities.length > 0, activityCount: activities.length, deepCount: deepEvents.length, xpEarned: activities.reduce((sum, item) => sum + Math.max(0, item.xpEarned), 0), pomodoros: activities.filter((item) => item.kind === "pomodoro").length, correctedMistakes: deepEvents.filter((item) => item.kind === "selfFoundError" || item.kind === "retryWrong").length };
};

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
    currentStreak: profile.currentStreak,
    bestStreak: profile.bestStreak,
    deepFocusSessions: profile.attempts.filter((attempt) => attempt.mode === "deep").length,
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
  const titleGroupLabels = ["Khó", "Khó hơn", "Rất khó", "Cực khó", "Hiếm", "Rất hiếm", "Tối hiếm", "Đỉnh cao"] as const;
const titleCulturalContext = (seed: string, qualifier: string, specialIndex: number) => {
  const references = [
    { quote: "Có công mài sắt, có ngày nên kim.", explanation: "Lấy cảm hứng từ hình ảnh kiên trì từng chút để đạt thành quả lớn." },
    { quote: "Nước chảy đá mòn.", explanation: "Lấy cảm hứng từ ý niệm tiến bộ bền bỉ qua những nỗ lực đều đặn." },
    { quote: "Kiến tha lâu đầy tổ.", explanation: "Lấy cảm hứng từ việc tích lũy từng phần nhỏ thành nền tảng vững chắc." },
    { quote: `Tinh thần ${seed.toLowerCase()}`, explanation: `Tên được xây dựng như một hình tượng học tập cho nhánh ${qualifier.toLowerCase()}, không khẳng định đây là thành ngữ hay tục ngữ cổ.` },
  ];
  return references[specialIndex % references.length];
};

export function generateAchievements(): Achievement[] {
  const metrics: AchievementMetric[] = ["learnedCards", "completedQuizzes", "xp", "completedSets", "fragments", "pomodoroSessions"];
  const result: Achievement[] = [];
  ranks.forEach(([icon, rankName, difficulty], rank) => {
    for (let withinRank = 0; withinRank < 100; withinRank += 1) {
      const index = rank * 100 + withinRank;
      const metric = metrics[index % metrics.length];
      const topic = achievementTopics[index % achievementTopics.length];
      const topicTags: Record<AchievementTopicId, string[]> = {
        study: ["kiến thức", "ôn tập"], pomodoro: ["tập trung", "thời gian"], discipline: ["bền bỉ", "thói quen"],
        "deep-understanding": ["giải thích", "sửa lỗi"], exam: ["đề", "kết quả"], journal: ["phản tư", "ghi chép"],
        "anti-procrastination": ["bắt đầu", "quay lại"], journey: ["mốc đường", "tiến bộ"], collection: ["mảnh ghép", "lịch sử"],
      };
      const growth = Math.pow(1.055, withinRank) * Math.pow(rank + 1, 1.55);
      const base = metric === "xp" ? 250 : metric === "learnedCards" ? 10 : metric === "completedQuizzes" ? 3 : metric === "completedSets" ? 2 : metric === "pomodoroSessions" ? 10 : 3;
      const specialIndex = index - 500;
      const specialStep = Math.floor(Math.max(0, specialIndex) / metrics.length);
      const threshold = index >= 500 ? Math.max(1, Math.round(base * Math.pow(1.055, specialStep)) + specialStep) : Math.max(1, Math.round(base * growth));
      const titleSeed = titleSeeds[specialIndex % titleSeeds.length];
      const qualifier = titleQualifiers[Math.floor(specialIndex / titleSeeds.length) % titleQualifiers.length];
      const title = index === 899 ? "Người Giữ Ngọn Lửa Tri Thức" : index >= 500 ? `${titleSeed} · ${qualifier}` : null;
      const titleGroup = title ? Math.floor(specialIndex / 50) + 1 : null;
      const titleGroupLabel = title ? titleGroupLabels[Math.min(7, (titleGroup ?? 1) - 1)] : null;
      const titleContext = title ? titleCulturalContext(titleSeed, qualifier, specialIndex) : null;
      const difficultyLabel = title ? titleGroupLabel : rank === 8 ? "Huyền thoại" : difficulty;
      result.push({
        id: `rank-${rank + 1}-${withinRank + 1}`,
        achievementCode: `ACH-${String(index + 1).padStart(3, "0")}`,
        rank: rank + 1,
        rankName,
        level: rank + 1,
        levelLabel: rankName,
        group: rankName,
        topic: topic.id,
        topicLabel: topic.label,
        tags: [...topicTags[topic.id], difficultyLabel ?? difficulty],
        icon,
        name: `${rankName} ${withinRank + 1}`,
        description: `Đạt ${threshold.toLocaleString("vi-VN")} ${metricLabels[metric]}.`,
        metric,
        conditionType: metric,
        conditionParameters: { target: threshold },
        conditions: [],
        threshold,
        rewardXp: title ? 100 + (titleGroup ?? 1) * 75 + Math.floor(specialIndex / 10) * 10 : 20 + rank * 25 + Math.floor(withinRank / 10) * 5,
        rewardFragments: title ? (titleGroup ?? 1) + 1 : withinRank % 20 === 19 ? 1 : 0,
        rewardType: title ? "mixed" : withinRank % 20 === 19 ? "fragment" : "xp",
        rewardAmount: 20 + rank * 25 + Math.floor(withinRank / 10) * 5,
        pieceReward: title ? (titleGroup ?? 1) + 1 : withinRank % 20 === 19 ? 1 : 0,
        pieceTier: title ? ((titleGroup ?? 1) >= 7 ? "IV" : (titleGroup ?? 1) >= 5 ? "III" : (titleGroup ?? 1) >= 3 ? "II" : "I") : rank >= 8 ? "IV" : rank >= 6 ? "III" : rank >= 3 ? "II" : "I",
        title,
        titleMeaning: title ? index === 899 ? "Danh hiệu tối thượng dành cho người đã đi hết hành trình, giữ lửa học tập và truyền cảm hứng cho những chặng đường tiếp theo." : titleMeaning(titleSeed, qualifier, specialIndex) : null,
        titleSignificance: title ? `Ghi nhận chặng đường ${qualifier.toLowerCase()} của Ong; giá trị nằm ở tiến bộ bền bỉ chứ không phải so sánh với người khác.` : null,
        titleInspiration: title ? titleCulturalContext(titleSeed, qualifier, specialIndex).quote : null,
        titleExplanation: title ? titleCulturalContext(titleSeed, qualifier, specialIndex).explanation : null,
        titleSourceStatus: title ? "inspired" : "not_applicable",
        titleGroup,
        titleGroupLabel,
        source_type: title ? "inspired" : "not_applicable",
        source_text: titleContext?.quote ?? null,
        source_note: titleContext?.explanation ?? null,
        rewardCategories: title ? ["achievement_points", "history_fragment", "exchange_ticket", "cosmetic_item"] : ["achievement_points"],
        cosmeticReward: title ? `Khung hồ sơ ${qualifier}` : null,
        exchangeTicketReward: title ? Math.max(1, Math.floor((titleGroup ?? 1) / 2)) : 0,
        difficulty: title ? ((titleGroup ?? 1) >= 7 ? "Huyền thoại" : (titleGroup ?? 1) >= 5 ? "Cực khó" : (titleGroup ?? 1) >= 3 ? "Rất khó" : "Khó") : rank === 8 ? "Huyền thoại" : difficulty,
        badgeLabel: `${rankName} · Huy hiệu ${withinRank + 1}`,
        encouragement: index === 899 ? "Ong đã đi hết hành trình 900 mốc — không phải vì con đường kết thúc, mà vì bạn đã chứng minh mình có thể đi rất xa." : title ? "Ong đã bay thêm một chặng dài trên hành trình tri thức." : "Mỗi bước học đều làm nền cho bước tiến tiếp theo.",
        progress: 0,
        currentValue: 0,
        remaining: threshold,
        animation: index === 899 ? "legendary" : rank >= 7 ? "glow" : "spark",
        unlockedAt: null,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        enabled: true,
      });
    }
  });
  return result;
}

export function advancedAchievementCards(profile: ProfileState): Achievement[] {
  const activities = [...profile.studyActivity].sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt));
  const completed = activities.filter((item) => item.kind === "pomodoro" || item.kind === "quiz");
  let comebackCount = 0;
  for (let index = 1; index < activities.length; index += 1) {
    const gap = Date.parse(activities[index].occurredAt) - Date.parse(activities[index - 1].occurredAt);
    if (gap >= 3 * 86400000) comebackCount += 1;
  }
  const retryCount = profile.deepLearningEvents?.filter((event) => event.kind === "retryWrong").length ?? 0;
  const fixedErrorCount = new Set((profile.deepLearningEvents ?? []).filter((event) => event.kind === "selfFoundError" || event.kind === "retryWrong").map((event) => event.sourceId).filter(Boolean)).size;
  const now = Date.now();
  const weekMs = 7 * 86400000;
  const recentMinutes = activities.filter((item) => now - Date.parse(item.occurredAt) <= weekMs).reduce((sum, item) => sum + item.durationSeconds, 0);
  const previousMinutes = activities.filter((item) => { const age = now - Date.parse(item.occurredAt); return age > weekMs && age <= weekMs * 2; }).reduce((sum, item) => sum + item.durationSeconds, 0);
  const cards = [
    { id: "advanced-comeback", icon: "🌱", name: "Quay lại sau khi bỏ cuộc", description: "Ong đã quay lại học sau một khoảng nghỉ, không biến việc dừng lại thành thất bại vĩnh viễn.", threshold: 1, currentValue: comebackCount, rewardXp: 20, encouragement: "Bắt đầu lại cũng là một dạng can đảm." },
    { id: "advanced-error-to-knowledge", icon: "🔧", name: "Biến lỗi thành kiến thức", description: "Ong đã xem lại lỗi và thực hiện hành vi học sâu để sửa nó.", threshold: 5, currentValue: retryCount, rewardXp: 15, encouragement: "Một lỗi được sửa là một mảnh kiến thức được giữ lại." },
    { id: "advanced-error-recovery", icon: "🛡️", name: "Đã vượt qua lỗi cũ", description: "Ong đã ghi nhận và xử lý lại nhiều lỗi thay vì né tránh chúng.", threshold: 3, currentValue: fixedErrorCount, rewardXp: 25, encouragement: "Ong không cần hoàn hảo, chỉ cần tiến bộ thật." },
    { id: "advanced-self-improvement", icon: "📈", name: "Tốt hơn chính mình", description: "Thời lượng học tuần này cao hơn tuần trước dựa trên lịch sử học đã lưu.", threshold: 1, currentValue: recentMinutes > previousMinutes && completed.length > 0 ? 1 : 0, rewardXp: 20, encouragement: "Ong đang so sánh với chính mình của ngày hôm qua." },
  ];
  return cards.map((card) => { const now = new Date().toISOString(); const progress = Math.min(100, Math.round((card.currentValue / card.threshold) * 100)); return ({ ...card, achievementCode: `ADV-${card.id.toUpperCase()}`, rank: 7, rankName: "Tiến bộ", level: 7, levelLabel: "Vô Cực", group: "Tiến bộ", topic: "journey" as const, topicLabel: "🏆 Thành tựu & hành trình" as const, tags: ["tiến bộ", "phản tư"], metric: "xp" as const, conditionType: "xp" as const, conditionParameters: { target: card.threshold }, conditions: [], rewardFragments: 0, rewardType: "xp" as const, rewardAmount: card.rewardXp, pieceReward: 0, pieceTier: "I" as const, title: null, titleMeaning: null, difficulty: "Khó" as const, badgeLabel: "Thành tích tiến bộ", progress, currentValue: card.currentValue, remaining: Math.max(0, card.threshold - card.currentValue), animation: "glow" as const, unlockedAt: profile.achievementUnlockDates[card.id] ?? null, createdAt: now, updatedAt: now, evidence: [] }); });
}

const conditionLabels: Record<AchievementConditionType, string> = {
  xp: "XP tích lũy",
  learnedCards: "Flashcard đã nhớ",
  completedQuizzes: "Bài kiểm tra hoàn thành",
  completedSets: "Bộ Flashcard hoàn thành",
  fragments: "Mảnh ghép sở hữu",
  pomodoroSessions: "Phiên Pomodoro hoàn thành",
  currentStreak: "Streak hiện tại",
  bestStreak: "Streak tốt nhất",
  studySeconds: "Thời gian học",
  deepFocusSessions: "Phiên Deep Focus",
};

const conditionValueForProfile = (profile: ProfileState, type: AchievementConditionType) => {
  const stats = statsForProfile(profile) as Record<string, number>;
  return Math.max(0, stats[type] ?? 0);
};

const conditionDefinitionsFor = (achievement: Achievement) => {
  if (achievement.rank === 9 && achievement.title) return [
    { id: `${achievement.id}-streak`, label: "Streak", type: "bestStreak" as const, target: 30 },
    { id: `${achievement.id}-time`, label: "Thời gian học", type: "studySeconds" as const, target: 30 * 60 * 60 },
    { id: `${achievement.id}-sessions`, label: "Phiên học", type: "pomodoroSessions" as const, target: 50 },
    { id: `${achievement.id}-deep`, label: "Deep Focus", type: "deepFocusSessions" as const, target: 10 },
  ];
  return [{ id: `${achievement.id}-primary`, label: conditionLabels[achievement.conditionType], type: achievement.conditionType, target: achievement.threshold }];
};

const withAchievementConditions = (profile: ProfileState, achievement: Achievement) => {
  const conditions = conditionDefinitionsFor(achievement).map((definition) => {
    const currentProgress = conditionValueForProfile(profile, definition.type);
    const targetProgress = definition.target;
    return { id: definition.id, label: definition.label, type: definition.type, parameters: { target: targetProgress }, currentProgress, targetProgress, progressPercentage: Math.min(100, Math.round(currentProgress / Math.max(1, targetProgress) * 100)), remaining: Math.max(0, targetProgress - currentProgress), met: currentProgress >= targetProgress };
  });
  const progress = Math.min(...conditions.map((condition) => condition.progressPercentage));
  const primary = conditions.find((condition) => condition.type === achievement.conditionType) ?? conditions[0];
  return { ...achievement, conditions, progress, currentValue: primary.currentProgress, threshold: primary.targetProgress, remaining: Math.max(0, primary.targetProgress - primary.currentProgress) };
};

export function allAchievementsWithProgress(profile: ProfileState, config: AppConfig): Achievement[] {
  const stats = statsForProfile(profile) as Record<AchievementMetric, number>;
  const overrides = new Map(config.achievementOverrides.map((item) => [item.achievementId, item]));
  const standard = generateAchievements()
    .map((achievement) => {
      const merged = { ...achievement, ...overrides.get(achievement.id) };
      const withConditions = withAchievementConditions(profile, merged);
      return { ...withConditions, unlockedAt: profile.achievementUnlockDates[merged.id] ?? null, evidence: achievementEvidenceFor(profile, { ...withConditions, unlockedAt: profile.achievementUnlockDates[merged.id] ?? null } as Achievement) };
    })
    .filter((achievement) => achievement.enabled !== false);
  const customs: Achievement[] = config.customAchievements
    .filter((item) => item.enabled)
    .map((item) => {
      const currentValue = Math.max(0, stats[item.metric] ?? 0);
      return {
      id: item.id,
      achievementCode: `CUSTOM-${item.id.toUpperCase()}`,
      rank: 9,
      rankName: "Tùy chỉnh",
      level: 9,
      levelLabel: "Huyền Thoại",
      group: "Tùy chỉnh",
      topic: "journey",
      topicLabel: "🏆 Thành tựu & hành trình",
      tags: ["admin", "tùy chỉnh"],
      icon: "🏆",
      name: item.name,
      description: item.description,
      metric: item.metric,
      conditionType: item.metric,
      conditionParameters: { target: item.threshold },
      conditions: [],
      threshold: item.threshold,
      rewardXp: item.rewardXp,
      rewardFragments: item.rewardFragments,
      rewardType: item.title?.trim() ? "mixed" : item.rewardFragments > 0 ? "fragment" : "xp",
      rewardAmount: item.rewardXp,
      pieceReward: item.rewardFragments,
      pieceTier: "I",
      title: item.title?.trim() || null,
      titleMeaning: item.titleMeaning?.trim() || null,
      titleGroup: item.title?.trim() ? Math.min(8, Math.max(1, item.titleGroup ?? 1)) : null,
      titleGroupLabel: item.title?.trim() ? titleGroupLabels[Math.min(7, Math.max(0, (item.titleGroup ?? 1) - 1))] : null,
      source_type: item.title?.trim() ? item.source_type ?? "inspired" : "not_applicable",
      source_text: item.title?.trim() ? item.source_text?.trim() || item.titleMeaning?.trim() || null : null,
      source_note: item.title?.trim() ? item.source_note?.trim() || "Lấy cảm hứng từ mô tả do Admin cung cấp; chưa khẳng định là nguồn nguyên văn." : null,
      difficulty: "Khó",
      badgeLabel: "Thành tích tùy chỉnh",
      encouragement: "Một cột mốc riêng đang được mở khóa.",
      progress: Math.min(100, Math.round((currentValue / Math.max(1, item.threshold)) * 100)),
      currentValue,
      remaining: Math.max(0, item.threshold - currentValue),
      animation: "spark",
      unlockedAt: profile.achievementUnlockDates[item.id] ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evidence: achievementEvidenceFor(profile, { id: item.id, achievementCode: `CUSTOM-${item.id.toUpperCase()}`, rank: 9, rankName: "Tùy chỉnh", group: "Tùy chỉnh", icon: "🏆", name: item.name, description: item.description, metric: item.metric, threshold: item.threshold, rewardXp: item.rewardXp, rewardFragments: item.rewardFragments, title: item.title?.trim() || null, titleMeaning: item.titleMeaning?.trim() || null, difficulty: "Khó", badgeLabel: "Thành tích tùy chỉnh", encouragement: "Một cột mốc riêng đang được mở khóa.", progress: Math.min(100, Math.round((currentValue / Math.max(1, item.threshold)) * 100)), currentValue, remaining: Math.max(0, item.threshold - currentValue), animation: "spark", unlockedAt: profile.achievementUnlockDates[item.id] ?? null } as Achievement),
    };
    });
  return [...standard, ...customs, ...advancedAchievementCards(profile)];
}

export const achievementEvidenceFor = (profile: ProfileState, achievement: Achievement): AchievementEvidence[] => {
  const stored = profile.achievementEvidence?.[achievement.id] ?? [];
  if (stored.length) return stored;
  const stats = statsForProfile(profile) as Record<AchievementMetric, number>;
  const evidence: AchievementEvidence[] = [{ id: `${achievement.id}-metric`, achievementId: achievement.id, label: `${metricLabels[achievement.metric]} đã ghi nhận`, value: Math.max(0, stats[achievement.metric] ?? 0), source: "profile" }];
  const completedPomodoros = profile.pomodoroHistory.filter((session) => session.status === "completed").length;
  if (achievement.metric === "pomodoroSessions") evidence.push({ id: `${achievement.id}-pomodoro`, achievementId: achievement.id, label: "Pomodoro đã hoàn thành", value: completedPomodoros, source: "studyActivity" });
  const deepCount = profile.deepLearningEvents?.length ?? 0;
  if (deepCount > 0) evidence.push({ id: `${achievement.id}-deep`, achievementId: achievement.id, label: "Lần học hiểu sâu", value: deepCount, source: "deepLearning" });
  if (profile.bestStreak > 0) evidence.push({ id: `${achievement.id}-streak`, achievementId: achievement.id, label: "Chuỗi học tốt nhất", value: profile.bestStreak, source: "streak" });
  return evidence;
};

export const nearestAchievements = (profile: ProfileState, config: AppConfig, limit = 3): Achievement[] => allAchievementsWithProgress(profile, config)
  .filter((achievement) => achievement.currentValue < achievement.threshold)
  .sort((a, b) => (b.progress - a.progress) || (a.remaining - b.remaining))
  .slice(0, Math.max(1, limit));

export function computedAchievements(profile: ProfileState, config: AppConfig): Achievement[] {
  return allAchievementsWithProgress(profile, config).filter((achievement) => achievement.currentValue >= achievement.threshold);
}

export function selectEarnedTitle(profile: ProfileState, config: AppConfig, achievementId: string) {
  const achievement = allAchievementsWithProgress(profile, config).find((item) => item.id === achievementId);
  const isEarned = Boolean(achievement?.title && achievement.enabled !== false && profile.unlockedAchievementIds.includes(achievement.id));
  if (!achievement || !isEarned) return { profile, selected: null as Achievement | null };
  return { profile: { ...profile, activeTitle: achievement.id }, selected: achievement };
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
  const dayKey = activity.occurredAt.slice(0, 10);
  const sourceId = activity.kind === "pomodoro" ? "source-study-session" : activity.kind === "quiz" ? "source-quiz-complete" : "source-study-session";
  const sourceRule = config.collectionConfig?.rewardSources?.find((rule) => rule.id === sourceId);
  const sourceReward = sourceRule ? grantFragmentSourceReward(config, profile, sourceRule, activity.id, activity.occurredAt) : { profile, granted: false, amount: 0 };
  const milestoneRule = activity.kind === "pomodoro" ? config.collectionConfig?.rewardSources?.find((rule) => rule.kind === "pomodoroMilestone" && rule.milestone && (previousPomodoros + 1) >= rule.milestone && (previousPomodoros + 1) % rule.milestone === 0) : undefined;
  const milestoneReward = milestoneRule ? grantFragmentSourceReward(config, sourceReward.profile, milestoneRule, `${activity.id}:milestone:${milestoneRule.milestone}`, activity.occurredAt) : { profile: sourceReward.profile, granted: false, amount: 0 };
  const rewardProfile = milestoneReward.profile;
  const fragmentReward = sourceReward.amount + milestoneReward.amount;
  const next: ProfileState = {
    ...updateStudyStreak(rewardProfile, activity.occurredAt),
    xp: profile.xp + xpEarned,
    level: levelForXp(profile.xp + xpEarned),
    streakShields: nextStreakShield(profile, activity.occurredAt),
    studyActivity: [...profile.studyActivity, { ...activity, quantity, xpEarned }],
    fragments: fragmentReward ? { ...rewardProfile.fragments, general: (rewardProfile.fragments.general ?? 0) + fragmentReward } : rewardProfile.fragments,
    fragmentLedger: rewardProfile.fragmentLedger, 
    fragmentRewardClaims: rewardProfile.fragmentRewardClaims,
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
    fragmentLedger: source.fragmentLedger && typeof source.fragmentLedger === "object" ? Object.fromEntries((Object.entries(source.fragmentLedger) as Array<[FragmentTier, unknown]>).filter(([tier]) => ["I", "II", "III", "IV", "V", "VI"].includes(tier)).map(([tier, value]) => [tier, Math.max(0, Math.floor(Number(value) || 0))])) as Partial<Record<FragmentTier, number>> : {},
    unlockedAchievementIds: Array.isArray(source.unlockedAchievementIds) ? source.unlockedAchievementIds : [],
    ownedBadges: Array.isArray(source.ownedBadges) ? source.ownedBadges : [],
    inventory: Array.isArray(source.inventory) ? source.inventory : [],
    achievementUnlockDates: source.achievementUnlockDates && typeof source.achievementUnlockDates === "object" ? source.achievementUnlockDates : {},
    animationsEnabled: source.animationsEnabled !== false,
    popupsEnabled: source.popupsEnabled !== false,
    emotionTheme: ["calm", "happy", "tired", "sad", "stressed", "lazy", "proud", "focused", "hopeful", "overwhelmed", "sleepy", "excited", "lonely", "confident", "curious", "comeback"].includes(String(source.emotionTheme)) ? source.emotionTheme as ProfileState["emotionTheme"] : "calm",
    companionEmotionMedia: source.companionEmotionMedia && typeof source.companionEmotionMedia === "object" ? Object.fromEntries(Object.entries(source.companionEmotionMedia).flatMap(([emotion, value]) => {
      if (!["calm", "happy", "tired", "sad", "stressed", "lazy", "proud", "focused", "hopeful", "overwhelmed", "sleepy", "excited", "lonely", "confident", "curious", "comeback"].includes(emotion) || !value || typeof value !== "object") return [];
      const media = value as Partial<CompanionEmotionMedia>;
      const mascotImageUrl = media.mascotImageUrl ? String(media.mascotImageUrl) : undefined;
      const lumiImageUrl = media.lumiImageUrl ? String(media.lumiImageUrl) : undefined;
      const lumiVoiceUrl = typeof media.lumiVoiceUrl === "string" && media.lumiVoiceUrl.trim() ? media.lumiVoiceUrl : undefined;
      const recordingIds = new Set<string>();
      const lumiVoiceRecordings = Array.isArray(media.lumiVoiceRecordings) ? media.lumiVoiceRecordings.flatMap((entry, index) => {
        if (!entry || typeof entry !== "object") return [];
        const recording = entry as Partial<LumiVoiceRecording>;
        const url = typeof recording.url === "string" && recording.url.trim() ? recording.url : "";
        const id = typeof recording.id === "string" && recording.id.trim() ? recording.id : "";
        if (!url || !id || recordingIds.has(id)) return [];
        recordingIds.add(id);
        return [{ id, url, label: typeof recording.label === "string" && recording.label.trim() ? recording.label.slice(0, 80) : `Bản thu Lumi ${index + 1}`, createdAt: typeof recording.createdAt === "string" && recording.createdAt ? recording.createdAt : new Date(0).toISOString() }];
      }) : [];
      if (!lumiVoiceRecordings.length && lumiVoiceUrl) lumiVoiceRecordings.push({ id: `legacy-${emotion}`, url: lumiVoiceUrl, label: "Bản thu Lumi đã lưu", createdAt: new Date(0).toISOString() });
      const favoriteLumiVoiceId = lumiVoiceRecordings.some((recording) => recording.id === media.favoriteLumiVoiceId) ? media.favoriteLumiVoiceId : undefined;
      return mascotImageUrl || lumiImageUrl || lumiVoiceUrl || lumiVoiceRecordings.length ? [[emotion, { mascotImageUrl, lumiImageUrl, lumiVoiceUrl, lumiVoiceRecordings, favoriteLumiVoiceId }]] : [];
    })) as Partial<Record<EmotionThemeId, CompanionEmotionMedia>> : {},
    showMascot: source.showMascot !== false,
    showLumi: source.showLumi !== false,
    defaultAmbientScene: ["morning", "rain", "snow", "leaves", "storm"].includes(String(source.defaultAmbientScene)) ? source.defaultAmbientScene as AmbientScenePreference : base.defaultAmbientScene,
    audioMixer: {
      ambientSceneVolumes: Object.fromEntries((["morning", "rain", "snow", "leaves", "storm"] as AmbientScenePreference[]).map((scene) => [scene, Math.max(0, Math.min(100, Number(source.audioMixer?.ambientSceneVolumes?.[scene] ?? base.audioMixer!.ambientSceneVolumes[scene]) || 0))])) as AudioMixerSettings["ambientSceneVolumes"],
      pomodoroLayers: source.audioMixer?.pomodoroLayers && typeof source.audioMixer.pomodoroLayers === "object" ? Object.fromEntries(Object.entries(source.audioMixer.pomodoroLayers).map(([id, level]) => [id, Math.max(0, Math.min(100, Number(level) || 0))])) : {},
      pomodoroBackground: Math.max(0, Math.min(100, Number(source.audioMixer?.pomodoroBackground ?? base.audioMixer!.pomodoroBackground) || 0)),
      pomodoroBell: Math.max(0, Math.min(100, Number(source.audioMixer?.pomodoroBell ?? base.audioMixer!.pomodoroBell) || 0)),
      lumi: Math.max(0, Math.min(100, Number(source.audioMixer?.lumi ?? base.audioMixer!.lumi) || 0)),
    },
    weeklyPomodoroGoalMinutes: Math.max(30, Math.min(10_080, Math.round(Number(source.weeklyPomodoroGoalMinutes ?? base.weeklyPomodoroGoalMinutes ?? 300) || base.weeklyPomodoroGoalMinutes || 300))),
    currentStreak: Math.max(0, Number(source.currentStreak) || 0),
    bestStreak: Math.max(0, Number(source.bestStreak) || 0),
    streakShields: Math.max(0, Math.min(3, Number(source.streakShields) || 0)),
    achievementMoments: Array.isArray(source.achievementMoments) ? source.achievementMoments.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<AchievementMoment>) : null; if (!item?.id || !item.achievementId) return []; return [{ id: String(item.id), achievementId: String(item.achievementId), createdAt: String(item.createdAt ?? new Date(0).toISOString()), note: String(item.note ?? ""), feeling: String(item.feeling ?? "Tự hào"), mascotVariant: "hoodie" as const, photoUrl: item.photoUrl ? String(item.photoUrl) : undefined, deletedAt: item.deletedAt ? String(item.deletedAt) : undefined }]; }) : [],
    characterProgress: source.characterProgress && typeof source.characterProgress === "object" ? Object.fromEntries(Object.entries(source.characterProgress).flatMap(([characterId, value]) => { const item = value && typeof value === "object" ? (value as Partial<CharacterProgress>) : {}; if (!characterId) return []; const collected = Array.isArray(item.collectedPieceIds) ? item.collectedPieceIds.map(String) : []; const used = Array.isArray(item.usedPieceIds) ? item.usedPieceIds.map(String) : []; const status: CharacterUnlockStatus = item.status === "unlocked" || item.status === "ready" || item.status === "assembling" ? item.status : collected.length ? "assembling" : "locked"; return [[characterId, { characterId, collectedPieceIds: Array.from(new Set(collected)), usedPieceIds: Array.from(new Set(used)), status, assembledAt: item.assembledAt ? String(item.assembledAt) : null, unlockedAt: item.unlockedAt ? String(item.unlockedAt) : null } as CharacterProgress]]; })) : {},
    pomodoroHistory: Array.isArray(source.pomodoroHistory) ? source.pomodoroHistory.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<PomodoroSession>) : null; if (!item?.id) return []; return [{ id: String(item.id), startedAt: String(item.startedAt ?? new Date(0).toISOString()), endedAt: String(item.endedAt ?? new Date(0).toISOString()), durationMinutes: Math.max(1, Number(item.durationMinutes) || 1), subject: String(item.subject ?? ""), topic: String(item.topic ?? ""), sessionNumber: Math.max(1, Number(item.sessionNumber) || 1), totalSessions: Math.max(1, Number(item.totalSessions) || 1), mode: item.mode === "shortBreak" || item.mode === "longBreak" ? item.mode : "focus", status: item.status === "abandoned" || item.status === "skipped" ? item.status : "completed" }]; }) : [],
    aiImportHistory: Array.isArray(source.aiImportHistory) ? source.aiImportHistory.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<AiImportRecord>) : null; if (!item?.id || !item.title) return []; return [{ id: String(item.id), title: String(item.title), createdAt: String(item.createdAt ?? new Date(0).toISOString()), target: item.target === "quiz" || item.target === "both" || item.target === "practice" ? item.target : "flashcards", questionCount: Math.max(0, Number(item.questionCount) || 0), flashcardCount: Math.max(0, Number(item.flashcardCount) || 0), prompt: String(item.prompt ?? ""), rawData: String(item.rawData ?? ""), quizId: item.quizId ? String(item.quizId) : undefined, flashcardSetId: item.flashcardSetId ? String(item.flashcardSetId) : undefined }]; }) : [],
    wrongAnswerReviews: Array.isArray(source.wrongAnswerReviews) ? source.wrongAnswerReviews.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<WrongAnswerReview>) : null; if (!item?.id || !item.attemptId || !item.questionId) return []; return [{ id: String(item.id), attemptId: String(item.attemptId), questionId: String(item.questionId), question: String(item.question ?? ""), learnerAnswer: String(item.learnerAnswer ?? ""), correctAnswer: String(item.correctAnswer ?? ""), whyWrong: String(item.whyWrong ?? ""), knowledgeGap: String(item.knowledgeGap ?? ""), correctThinking: Array.isArray(item.correctThinking) ? item.correctThinking.map(String) : [], commonMistake: String(item.commonMistake ?? ""), retryQuestion: String(item.retryQuestion ?? ""), retryAnswer: String(item.retryAnswer ?? ""), source: String(item.source ?? "Chưa cung cấp"), needsVerification: item.needsVerification === true, createdAt: String(item.createdAt ?? new Date(0).toISOString()) }]; }) : [],
  };
  merged.procrastinationEvents = Array.isArray(source.procrastinationEvents) ? source.procrastinationEvents : [];
  merged.avoidanceReasons = Array.isArray(source.avoidanceReasons) ? source.avoidanceReasons : [];
  merged.taskCombos = Array.isArray(source.taskCombos) ? source.taskCombos : [];
  merged.deepLearningEvents = Array.isArray(source.deepLearningEvents) ? source.deepLearningEvents : [];
  merged.achievementEvidence = source.achievementEvidence && typeof source.achievementEvidence === "object" ? source.achievementEvidence : {};
  merged.mascotVoiceLines = Array.isArray(source.mascotVoiceLines) ? source.mascotVoiceLines.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<MascotVoiceLine>) : null; if (!item?.id || !item.text) return []; return [{ id: String(item.id), state: String(item.state ?? "achievement"), emotion: item.emotion ? String(item.emotion) as EmotionThemeId : undefined, text: String(item.text), audioUrl: item.audioUrl ? String(item.audioUrl) : undefined, source: item.source === "admin" ? "admin" : "learner", enabled: item.enabled !== false, createdAt: item.createdAt ? String(item.createdAt) : undefined, deletedAt: item.deletedAt ? String(item.deletedAt) : undefined }]; }) : [];
  merged.level = levelForXp(merged.xp);
  return merged;
}

export function limitFlashcards<T>(cards: T[], limit = 27): T[] {
  return cards.slice(0, Math.max(0, Math.min(27, limit)));
}
