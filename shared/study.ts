export type StudyRole = "Member" | "Admin" | "Founder";

import { grantFragmentSourceReward } from "./fragmentSystem";
import { normalizeCosmeticPaletteId, type CosmeticPaletteId } from "./colorPalettes";

export const EDUCATION_LEVELS = ["Mẫu giáo", "Tiểu học", "THCS", "THPT", "Đại học/Sinh viên", "Khóa học tự do"] as const;
export type EducationLevel = typeof EDUCATION_LEVELS[number];

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
  purpose?: string;
  grade?: string;
  topic: string;
  educationLevel?: EducationLevel;
  course?: string;
  difficulty: "Cơ bản" | "Trung bình" | "Nâng cao";
  createdAt: string;
  studyCount: number;
  cards: Flashcard[];
};
export type LearningMaterialTrashEntry<T> = {
  item: T;
  deletedAt: string;
  originalIndex: number;
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

export type QuizMode = "test" | "review";
export type QuizTimerMode = "timed" | "unlimited";

export type Quiz = {
  id: string;
  title: string;
  subject: string;
  purpose?: string;
  grade?: string;
  topic: string;
  educationLevel?: EducationLevel;
  course?: string;
  difficulty: "Cơ bản" | "Trung bình" | "Nâng cao";
  durationMinutes: number;
  createdAt: string;
  questions: QuizQuestion[];
  mode?: QuizMode;
  timerMode?: QuizTimerMode;
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
export type CosmeticThemeId = CosmeticPaletteId;
export type FestiveThemeOptions = { enableThemeTone: boolean; enableAmbientAudio: boolean; enableVFX: boolean };
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
  subject?: string;
  purpose?: string;
  grade?: string;
  topic?: string;
  course?: string;
  educationLevel?: EducationLevel;
  difficulty?: "Cơ bản" | "Trung bình" | "Nâng cao";
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
export type AmbientScenePreference = "morning" | "rain" | "snow" | "leaves" | "storm" | "summer" | "spring" | "tet" | "halloween" | "desert" | "night" | "naturepark" | "sunrise" | "mountainsunset" | "meteorice" | "galaxy" | "cityday" | "citysunset" | "citydusk" | "citynight" | "bridgefog" | "urbanfog" | "sparklers" | "fireworks" | "forest" | "sunset" | "space" | "crescentmoon" | "ocean" | "neon" | "sakura" | "autumn" | "festival" | "volcano" | "deepocean" | "magicforest" | "spacestation" | "flowerfield" | "fairytale" | "circus" | "prehistoric" | "cyberrace" | "foodfestival" | "diamondmine" | "f1race" | "candykingdom" | "travel" | "tropical" | "sweet_strawberry" | "black_ribbon" | "library_chill" | "after_school" | "classic_academy" | "cyber_highschool" | "mystic_fog" | "cosmic_space" | "warm_night_coffee" | "fresh_morning" | "rainy_day" | "volcano_lava" | "deep_ocean" | "magic_forest" | "space_station" | "flower_field" | "fairytale_castle" | "circus_fun" | "prehistoric_era" | "cyberpunk_racetrack" | "food_festival" | "spring_freshness" | "winter_snowman" | "rainy_season" | "stormy_season" | "morning_chill" | "pixel" | "pirate" | "sports" | "disco" | "laboratory" | "egypt" | "steampunk" | "art" | "ninja" | "coffee" | "ai" | "teddy" | "spring-blossom" | "summer-beach" | "autumn-leave" | "winter-snow" | "halloween-spooky" | "lunar-new-year" | "thunder-storm" | "rainy-day" | "sunny-day" | "foggy-morning" | "lofi-rain-chill" | "magic-chess" | "arcade-retro" | "aurora-borealis" | "mini-hologram-cosmos" | "hanoi-old-quarter" | "mekong-delta" | "oriental-wuxia" | "masculine-cyber" | "earth-element" | "air-wind-element" | "water-element" | "mid-autumn" | "vpa-day" | "liberation-day" | "dien-bien-phu-victory" | "youth-volunteers" | "hung-kings-festival" | "girly-pastel" | "fire-element" | "windy-dust" | "rainy-ripple" | "vietnam-heroes" | "teachers-day" | "xmas-holiday" | "ghost-month" | "halloween-night" | "tet-vietnam" | "autumn-maple" | "summer-ocean" | "fairy-tale" | "tet-nguyen-dan" | "gio-to-hung-vuong" | "ngay-thanh-nien-26-3" | "giai-phong-30-4" | "thuong-binh-liet-si-27-7" | "cach-mang-19-8" | "quoc-khanh-2-9" | "tet-trung-thu" | "nha-giao-viet-nam-20-11" | "quoc-te-phu-nu-8-3" | "tet-doan-ngo-5-5" | "vu-lan-bao-hieu" | "phu-nu-viet-nam-20-10" | "quan-doi-nhan-dan-22-12";
export const AMBIENT_SCENE_IDS = ["morning", "rain", "snow", "leaves", "storm", "summer", "spring", "tet", "halloween", "desert", "night", "naturepark", "sunrise", "mountainsunset", "meteorice", "galaxy", "cityday", "citysunset", "citydusk", "citynight", "bridgefog", "urbanfog", "sparklers", "fireworks", "forest", "sunset", "space", "crescentmoon", "ocean", "neon", "sakura", "autumn", "festival", "volcano", "deepocean", "magicforest", "spacestation", "flowerfield", "fairytale", "circus", "prehistoric", "cyberrace", "foodfestival", "diamondmine", "f1race", "candykingdom", "travel", "tropical", "sweet_strawberry", "black_ribbon", "library_chill", "after_school", "classic_academy", "cyber_highschool", "mystic_fog", "cosmic_space", "warm_night_coffee", "fresh_morning", "rainy_day", "volcano_lava", "deep_ocean", "magic_forest", "space_station", "flower_field", "fairytale_castle", "circus_fun", "prehistoric_era", "cyberpunk_racetrack", "food_festival", "spring_freshness", "winter_snowman", "rainy_season", "stormy_season", "morning_chill", "pixel", "pirate", "sports", "disco", "laboratory", "egypt", "steampunk", "art", "ninja", "coffee", "ai", "teddy", "spring-blossom", "summer-beach", "autumn-leave", "winter-snow", "halloween-spooky", "lunar-new-year", "thunder-storm", "rainy-day", "sunny-day", "foggy-morning", "summer-ocean", "autumn-maple", "tet-vietnam", "halloween-night", "ghost-month", "xmas-holiday", "teachers-day", "vietnam-heroes", "rainy-ripple", "windy-dust", "fire-element", "girly-pastel", "hung-kings-festival", "youth-volunteers", "dien-bien-phu-victory", "liberation-day", "vpa-day", "mid-autumn", "water-element", "air-wind-element", "earth-element", "masculine-cyber", "oriental-wuxia", "mekong-delta", "hanoi-old-quarter", "mini-hologram-cosmos", "aurora-borealis", "arcade-retro", "magic-chess", "lofi-rain-chill", "fairy-tale", "tet-nguyen-dan", "gio-to-hung-vuong", "ngay-thanh-nien-26-3", "giai-phong-30-4", "thuong-binh-liet-si-27-7", "cach-mang-19-8", "quoc-khanh-2-9", "tet-trung-thu", "nha-giao-viet-nam-20-11", "quoc-te-phu-nu-8-3", "tet-doan-ngo-5-5", "vu-lan-bao-hieu", "phu-nu-viet-nam-20-10", "quan-doi-nhan-dan-22-12"] as const satisfies readonly AmbientScenePreference[];
export type SceneEffectPreferences = { leaves: number; snow: number; puddles: number; snowmanX: number; snowmanY: number };
export type AppearanceEmojiPet = {
  emoji: string;
  x: number;
  y: number;
  /** Trường chuẩn hiện tại cho chế độ đi dạo tự do. */
  roam?: boolean;
  /** Tương thích bản lưu cũ/bản thử nghiệm từng dùng tên này. */
  roamingEnabled?: boolean;
};
export type SceneTimeRule = { id: string; label: string; scene: AmbientScenePreference; startHour: number; endHour: number };
export type SceneAutomationSettings = { enabled: boolean; applyFixedHolidays: boolean; timeRules: SceneTimeRule[] };
export type LumiVoiceRecording = { id: string; url: string; label: string; createdAt: string; /** Thời điểm người học sửa tên, ảnh hoặc nhãn của bản thu. */ updatedAt?: string; /** Ảnh Lumi được gắn với bản thu khi lưu. */ imageUrl?: string; /** Nhãn màu trực quan do người học chọn để phân loại bản thu. */ colorLabel?: string };
export type LumiVoiceRecordingTrashEntry = { recording: LumiVoiceRecording; deletedAt: string; originalIndex: number; previousFavoriteId?: string };
export const LUMI_VOICE_TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
export type LumiCongratulationMessage = { id: string; text: string; createdAt: string; updatedAt: string; audioUrl?: string; audioMimeType?: string; audioDurationSeconds?: number };
export type WeeklyPomodoroGoalCompletion = { weekKey: string; completedAt: string; goalMinutes: number; achievedMinutes: number };
export const POMODORO_ALERT_EVENT_IDS = ["startFocus", "endFocus", "startBreak", "endBreak"] as const;
export type PomodoroAlertEventId = typeof POMODORO_ALERT_EVENT_IDS[number];
export const POMODORO_ALERT_SOUND_IDS = ["digital_bell", "loud_alarm", "marimba", "school_bell", "crystal_gong", "soft_chime", "retro_beep", "victory_fanfare", "wood_tap", "whistle_up"] as const;
export type PomodoroAlertSoundId = typeof POMODORO_ALERT_SOUND_IDS[number];
export type PomodoroAlertEventSettings = { enabled: boolean; soundId: PomodoroAlertSoundId };
export type PomodoroAlertSettings = { masterVolume: number; events: Record<PomodoroAlertEventId, PomodoroAlertEventSettings> };
export const LUMI_WATER_ALERT_SOUND_IDS = ["water_drop", "soft_chime", "wind_chime", "wood_block", "cute_beep"] as const;
export type LumiWaterAlertSoundId = typeof LUMI_WATER_ALERT_SOUND_IDS[number];
export type LumiWaterScheduleMode = "interval" | "clock";
export type LumiWaterSettings = { enabled: boolean; intervalMinutes: number; soundId: LumiWaterAlertSoundId; scheduleMode?: LumiWaterScheduleMode; dailyTime?: string };
export const DEFAULT_LUMI_WATER_SETTINGS: LumiWaterSettings = { enabled: true, intervalMinutes: 45, soundId: "water_drop", scheduleMode: "interval", dailyTime: "09:00" };
export function normalizeLumiWaterSettings(value: unknown): LumiWaterSettings {
  const source = value && typeof value === "object" ? value as Partial<LumiWaterSettings> : {};
  const rawInterval = Number(source.intervalMinutes);
  const dailyTime = typeof source.dailyTime === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(source.dailyTime) ? source.dailyTime : DEFAULT_LUMI_WATER_SETTINGS.dailyTime;
  return {
    enabled: source.enabled !== false,
    intervalMinutes: Number.isFinite(rawInterval) ? Math.max(5, Math.min(180, Math.round(rawInterval))) : DEFAULT_LUMI_WATER_SETTINGS.intervalMinutes,
    soundId: LUMI_WATER_ALERT_SOUND_IDS.includes(source.soundId as LumiWaterAlertSoundId) ? source.soundId as LumiWaterAlertSoundId : DEFAULT_LUMI_WATER_SETTINGS.soundId,
    scheduleMode: source.scheduleMode === "clock" ? "clock" : "interval",
    dailyTime,
  };
}
export const DEFAULT_POMODORO_ALERT_SETTINGS: PomodoroAlertSettings = {
  masterVolume: 1.2,
  events: {
    startFocus: { enabled: true, soundId: "whistle_up" },
    endFocus: { enabled: true, soundId: "victory_fanfare" },
    startBreak: { enabled: true, soundId: "soft_chime" },
    endBreak: { enabled: true, soundId: "loud_alarm" },
  },
};
export function normalizePomodoroAlertSettings(value: unknown): PomodoroAlertSettings {
  const source = value && typeof value === "object" ? value as Partial<PomodoroAlertSettings> : {};
  const rawMasterVolume = Number(source.masterVolume);
  const masterVolume = Number.isFinite(rawMasterVolume) ? Math.max(0, Math.min(2, rawMasterVolume)) : DEFAULT_POMODORO_ALERT_SETTINGS.masterVolume;
  const rawEvents = source.events && typeof source.events === "object" ? source.events as Partial<Record<PomodoroAlertEventId, Partial<PomodoroAlertEventSettings>>> : {};
  return {
    masterVolume,
    events: POMODORO_ALERT_EVENT_IDS.reduce((events, eventId) => {
      const current = rawEvents[eventId];
      const fallback = DEFAULT_POMODORO_ALERT_SETTINGS.events[eventId];
      events[eventId] = {
        enabled: current?.enabled !== false,
        soundId: POMODORO_ALERT_SOUND_IDS.includes(current?.soundId as PomodoroAlertSoundId) ? current!.soundId as PomodoroAlertSoundId : fallback.soundId,
      };
      return events;
    }, {} as Record<PomodoroAlertEventId, PomodoroAlertEventSettings>),
  };
}
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
  /** Tỷ lệ riêng cho preset Pomodoro Bình minh & Bão nhẹ. */
  pomodoroAmbientMix?: { morning: number; storm: number };
  pomodoroBackground: number;
  pomodoroBell: number;
  /** Âm báo Web Audio riêng cho bốn mốc Pomodoro; không phải âm nền. */
  pomodoroAlerts: PomodoroAlertSettings;
  /** Âm thanh môi trường tổng thể (mưa, chim, lá, tuyết). */
  environment: number;
  /** Nhạc nền do người dùng chọn, tách khỏi ambience. */
  music: number;
  /** Hiệu ứng UI/chuyển cảnh/chúc mừng. */
  uiEffects: number;
  lumi: number;
  ong: number;
  memberVoice: number;
};
export type PersonalPomodoroAmbientPreset = { id: string; name: string; morning: number; storm: number; createdAt: string; updatedAt: string };
export type PersonalAudioCategory = "emotion" | "season" | "weather" | "pomodoro" | "lumi" | "ong" | "member" | "background";
export type AudioPreviewSpeed = 0.5 | 1 | 1.5 | 2;
export type PersonalAudioSource = "user_upload" | "external_url" | "built_in";
export type AudioHealthStatus = "unknown" | "checking" | "ok" | "error";
export type PersonalAudioAsset = {
  id: string;
  name: string;
  description?: string;
  /** Nhãn tùy chỉnh để tìm kiếm và phân loại nhanh. */
  tags?: string[];
  url: string;
  source: PersonalAudioSource;
  category: PersonalAudioCategory;
  target: string;
  enabled: boolean;
  isDefault?: boolean;
  volume: number;
  /** Thời lượng đọc được từ metadata audio, tính bằng giây. */
  durationSeconds?: number;
  /** Biên độ đã lấy mẫu để vẽ waveform; chỉ lưu metadata nhẹ, không lưu bytes. */
  waveform?: number[];
  /** Thứ tự phát trong thư viện, nhỏ hơn sẽ phát trước. */
  sortOrder?: number;
  /** Nhóm/chủ đề do thành viên đặt, ví dụ: "Đêm mưa" hoặc "Tập trung". */
  group?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  healthStatus?: AudioHealthStatus;
  healthCheckedAt?: string;
  healthMessage?: string;
};
export type AudioGroupPreset = {
  id: string;
  name: string;
  audioAssetIds: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};
export type PersonalStudyPreset = {
  id: string;
  name: string;
  emotion?: EmotionThemeId;
  ambientScene?: AmbientScenePreference;
  audioAssetIds: string[];
  companionMode: "lumi" | "ong" | "both" | "hidden";
  focusMode: boolean;
  createdAt: string;
  updatedAt: string;
};
export type PersonalStudyPresetSchedule = {
  id: string;
  dayOfWeek: number;
  presetId: string;
  enabled: boolean;
  updatedAt: string;
};
export type PersonalStudyPresetTimeRule = {
  id: string;
  startTime: string;
  endTime: string;
  presetId: string;
  daysOfWeek?: number[];
  enabled: boolean;
  updatedAt: string;
};
export type PersonalStudyPresetPomodoroRule = {
  id: string;
  mode: "focus" | "shortBreak" | "longBreak";
  presetId: string;
  enabled: boolean;
  priority: number;
  updatedAt: string;
};
export type PersonalStudyPresetHistory = {
  id: string;
  presetId: string;
  presetName: string;
  snapshot: PersonalStudyPreset;
  changedAt: string;
  reason?: string;
};
export type AudioActionLog = {
  id: string;
  occurredAt: string;
  action: "create" | "update" | "delete" | "restore" | "apply" | "autoApply";
  entityType: "preset" | "asset";
  entityId: string;
  entityName: string;
  summary: string;
  snapshot?: PersonalStudyPreset | PersonalAudioAsset;
  previousSnapshot?: PersonalStudyPreset | PersonalAudioAsset;
};

export type StudyCornerSettings = {
  lightMode: "day" | "sunset" | "night";
  lampOn: boolean;
  lampIntensity: number;
  windowOpen: boolean;
  curtainOpen: boolean;
  laptopOpen: boolean;
  bookOpen: boolean;
  ambientEnabled: boolean;
  ambientVolume: number;
};

export type StudyCornerSeason = "spring" | "summer" | "autumn" | "winter";
export type StudyCornerWeather = "sunny" | "partlyCloudy" | "cloudy" | "rain" | "storm" | "fog" | "snow";
export type StudyCornerAdaptiveEmotion = "neutral" | "calm" | "happy" | "motivated" | "focused" | "sad" | "tired" | "relaxed" | "energetic";
export type StudyCornerColorProfile = "auto" | "spring" | "summer" | "autumn" | "winter" | "calm" | "happy" | "motivated" | "focused" | "sad" | "tired";
export type StudyCornerWeatherStage = "clear" | "cloudsGathering" | "drizzle" | "steadyRain" | "heavyRain" | "stormBreak" | "afterRain" | "snowFall";
export type StudyCornerWindowScene = "garden" | "city" | "park" | "neighborhood" | "sunrise" | "sunset" | "cityNight";
export type StudyCornerAudioZone = "outside" | "room" | "desk";
export type StudyCornerAudioZones = Record<StudyCornerAudioZone, { enabled: boolean; volume: number; assetId?: string }>;
export type StudyCornerPlantState = { variety: "monstera" | "fern" | "succulent"; sway: number; hydration: number; leafTone: "fresh" | "autumn" | "winter"; lastUpdatedAt: string };
export type StudyCornerEnvironment = {
  mode: "auto" | "manual";
  season: StudyCornerSeason;
  weather: StudyCornerWeather;
  weatherStage: StudyCornerWeatherStage;
  weatherProgress: number;
  emotion: StudyCornerAdaptiveEmotion;
  colorProfile: StudyCornerColorProfile;
  lightOverride: "auto" | "day" | "sunset" | "night";
  windowScene: StudyCornerWindowScene;
  plantState: StudyCornerPlantState;
  audioZones: StudyCornerAudioZones;
  soundEnabled: boolean;
  soundVolume: number;
  thunderEnabled: boolean;
  effectsEnabled: boolean;
  reduceMotion: boolean;
  selectedPresetId?: string;
};
export type StudyCornerRoomSnapshot = {
  version: 1;
  savedAt: string;
  settings: StudyCornerSettings;
  environment: StudyCornerEnvironment;
};
export const DEFAULT_STUDY_CORNER_ENVIRONMENT: StudyCornerEnvironment = {
  mode: "auto",
  season: "spring",
  weather: "sunny",
  weatherStage: "clear",
  weatherProgress: 0,
  emotion: "neutral",
  colorProfile: "auto",
  lightOverride: "auto",
  windowScene: "garden",
  plantState: { variety: "monstera", sway: 35, hydration: 70, leafTone: "fresh", lastUpdatedAt: "1970-01-01T00:00:00.000Z" },
  audioZones: { outside: { enabled: true, volume: 38 }, room: { enabled: true, volume: 24 }, desk: { enabled: true, volume: 18 } },
  soundEnabled: false,
  soundVolume: 35,
  thunderEnabled: false,
  effectsEnabled: true,
  reduceMotion: false,
};

export type StudyPlanReward = "fragment";

export type StudyPlanItem = {
  id: string;
  title: string;
  subject?: string;
  course?: string;
  scheduledFor: string;
  cadence: "day" | "week";
  completed: boolean;
  completedAt?: string;
  /** Dấu nhận thưởng một lần; bỏ tick không làm mất hay cấp lại phần thưởng. */
  rewardGrantedAt?: string;
  reward: StudyPlanReward;
  rewardAmount: number;
  notes?: string;
};

export type ProfileState = {
  xp: number;
  level: number;
  flashcardSets: FlashcardSet[];
  quizzes: Quiz[];
  flashcardSetTrash?: LearningMaterialTrashEntry<FlashcardSet>[];
  quizTrash?: LearningMaterialTrashEntry<Quiz>[];
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
  /** Ba lựa chọn độc lập của theme lễ hội; không ảnh hưởng linh vật emoji cá nhân. */
  festiveThemeOptions?: FestiveThemeOptions;
  activeCosmeticBackground?: CosmeticBackgroundId;
  achievementUnlockDates: Record<string, string>;
  soundEnabled: boolean;
  animationsEnabled?: boolean;
  popupsEnabled?: boolean;
  emotionTheme?: EmotionThemeId;
  companionEmotionMedia?: Partial<Record<EmotionThemeId, CompanionEmotionMedia>>;
  /** Bản thu Lumi đã xóa mềm, tách riêng theo cảm xúc để có thể khôi phục. */
  lumiVoiceRecordingTrash?: Partial<Record<EmotionThemeId, LumiVoiceRecordingTrashEntry[]>>;
  showMascot?: boolean;
  showLumi?: boolean;
  defaultAmbientScene?: AmbientScenePreference;
  /** Danh sách theme/cảnh người dùng yêu thích, không giới hạn số lượng. */
  favoriteAmbientScenes?: AmbientScenePreference[];
  sceneEffectPreferences?: SceneEffectPreferences;
  /** Linh vật emoji do người dùng chọn trong phần Giao diện & tone màu. */
  appearanceEmojiPet?: AppearanceEmojiPet;
  sceneAutomation?: SceneAutomationSettings;
  audioMixer?: AudioMixerSettings;
  /** Các preset cá nhân lưu tỷ lệ hai ambient Pomodoro. */
  personalPomodoroAmbientPresets?: PersonalPomodoroAmbientPreset[];
  /** Các tốc độ preview do người dùng tùy chỉnh theo từng loại tệp. */
  audioPreviewSpeedPresets?: Partial<Record<PersonalAudioCategory, AudioPreviewSpeed[]>>;
  personalAudioAssets?: PersonalAudioAsset[];
  personalAudioTrash?: PersonalAudioAsset[];
  audioGroupPresets?: AudioGroupPreset[];
  personalStudyPresets?: PersonalStudyPreset[];
  personalStudyPresetSchedule?: PersonalStudyPresetSchedule[];
  personalStudyPresetTimeRules?: PersonalStudyPresetTimeRule[];
  personalStudyPresetPomodoroRules?: PersonalStudyPresetPomodoroRule[];
  personalStudyPresetHistory?: PersonalStudyPresetHistory[];
  audioActionLogs?: AudioActionLog[];
  activePersonalStudyPresetId?: string;
  studyCornerSettings?: StudyCornerSettings;
  studyCornerEnvironment?: StudyCornerEnvironment;
  studyCornerRoomSnapshot?: StudyCornerRoomSnapshot;
  companionMode?: PersonalStudyPreset["companionMode"];
  autoNightMode?: boolean;
  focusMode?: boolean;
  weeklyPomodoroGoalMinutes?: number;
  weeklyPomodoroGoalCompletions?: WeeklyPomodoroGoalCompletion[];
  lumiCongratulationMessages?: Partial<Record<EmotionThemeId, LumiCongratulationMessage[]>>;
  /** Cách Lumi đồng hành trong phiên Pomodoro; có thể tắt hoàn toàn lời nhắc. */
  pomodoroLumiSupportMode?: "comfort" | "encouragement" | "off";
  /** Cho phép giọng đọc lời thoại Lumi bằng Web Speech API. */
  lumiSpeechEnabled?: boolean;
  /** Nhắc uống nước độc lập với âm nền, chỉ phát âm báo được chọn. */
  lumiWaterSettings?: LumiWaterSettings;
  /** Kế hoạch ngày-tuần thay thế luồng Thành tích/Cấp độ trên giao diện học tập. */
  studyPlanItems?: StudyPlanItem[];
  /** Mảnh ghép nhận trực tiếp từ các mục Kế hoạch đã hoàn tất. */
  planFragments?: number;
  /** Vé quay nhận trực tiếp từ các mục Kế hoạch đã hoàn tất. */
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
  /** Hoạt động người học chọn trước khi bắt đầu, ví dụ ôn lý thuyết hoặc làm bài tập. */
  activity?: string;
  /** Ghi chú tự do của phiên học, được hiển thị trong Lịch sử học. */
  notes?: string;
  /** Các mục Kế hoạch đã được liên kết với phiên, giữ ID để không mất ngữ cảnh. */
  checkedPlanItemIds?: string[];
  /** Ảnh chụp nhãn mục Kế hoạch tại thời điểm lưu lịch sử. */
  checkedPlanTitles?: string[];
  sessionNumber: number;
  totalSessions: number;
  mode: "focus" | "shortBreak" | "longBreak";
  status: "completed" | "abandoned" | "skipped";
  /** Preset âm thanh và snapshot tỷ lệ ambient tại thời điểm phiên được ghi. */
  audioPresetId?: string;
  audioPresetName?: string;
  audioAmbientMix?: { morning: number; storm: number };
};

export type StudyAccount = {
  id: string;
  name: string;
  code: string;
  role: StudyRole;
  locked: boolean;
  createdAt: string;
  /** Phiên khách chỉ tồn tại trong bộ nhớ trình duyệt và không được ghi vào tài khoản hay hồ sơ học tập. */
  isGuest?: boolean;
  /** Mốc hoạt động xác thực gần nhất, chỉ hiển thị cho khu vực quản trị. */
  lastActiveAt?: string;
  /** Mốc đăng xuất gần nhất, chỉ hiển thị cho khu vực quản trị. */
  lastSignedOutAt?: string;
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
  flashcardSetTrash: [],
  quizTrash: [],
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
  lumiVoiceRecordingTrash: {},
  pomodoroLumiSupportMode: "encouragement",
  lumiSpeechEnabled: true,
  lumiWaterSettings: DEFAULT_LUMI_WATER_SETTINGS,
  studyPlanItems: [],
  planFragments: 0,
  showMascot: true,
  showLumi: true,
  defaultAmbientScene: undefined,
  festiveThemeOptions: { enableThemeTone: true, enableAmbientAudio: true, enableVFX: true },
  favoriteAmbientScenes: [],
  sceneEffectPreferences: { leaves: 28, snow: 62, puddles: 64, snowmanX: 90, snowmanY: 5 },
  sceneAutomation: { enabled: false, applyFixedHolidays: true, timeRules: [{ id: "morning", label: "Buổi sáng", scene: "morning", startHour: 5, endHour: 11 }, { id: "summer-day", label: "Ban ngày", scene: "summer", startHour: 11, endHour: 17 }, { id: "spring-evening", label: "Buổi tối", scene: "spring", startHour: 17, endHour: 22 }, { id: "night", label: "Đêm", scene: "night", startHour: 22, endHour: 5 }] },
  audioMixer: { ambientSceneVolumes: { morning: 45, rain: 42, snow: 32, leaves: 36, storm: 38, summer: 36, spring: 34, tet: 38, halloween: 30, desert: 28, night: 30, naturepark: 35, sunrise: 36, mountainsunset: 32, meteorice: 28, galaxy: 28, cityday: 34, citysunset: 32, citydusk: 30, citynight: 29, bridgefog: 26, urbanfog: 26, sparklers: 34, fireworks: 38, forest: 34, sunset: 31, space: 28, crescentmoon: 27, ocean: 36, neon: 30, sakura: 34, autumn: 32, festival: 38, volcano: 34, deepocean: 32, magicforest: 31, spacestation: 29, flowerfield: 35, fairytale: 32, circus: 38, prehistoric: 31, cyberrace: 36, foodfestival: 34, diamondmine: 34, f1race: 38, candykingdom: 34, travel: 36, tropical: 38, rainy_season: 42, stormy_season: 38, morning_chill: 40, pixel: 34, pirate: 36, sports: 36, disco: 34, laboratory: 30, egypt: 30, steampunk: 32, art: 34, ninja: 30, coffee: 36, ai: 30, teddy: 32, sweet_strawberry: 35, black_ribbon: 30, library_chill: 34, after_school: 40, classic_academy: 30, cyber_highschool: 35, mystic_fog: 26, cosmic_space: 28, warm_night_coffee: 36, fresh_morning: 40, rainy_day: 35, volcano_lava: 38, deep_ocean: 34, magic_forest: 30, space_station: 28, flower_field: 36, fairytale_castle: 32, circus_fun: 38, prehistoric_era: 30, cyberpunk_racetrack: 32, food_festival: 36, spring_freshness: 35, winter_snowman: 30, "spring-blossom": 35, "summer-beach": 40, "autumn-leave": 35, "winter-snow": 30, "halloween-spooky": 35, "lunar-new-year": 35, "thunder-storm": 45, "rainy-day": 35, "sunny-day": 30, "foggy-morning": 25, "summer-ocean": 35, "autumn-maple": 35, "tet-vietnam": 35, "halloween-night": 35, "ghost-month": 35, "xmas-holiday": 35, "teachers-day": 35, "vietnam-heroes": 35, "rainy-ripple": 35, "windy-dust": 35, "fire-element": 35, "girly-pastel": 35, "hung-kings-festival": 35, "youth-volunteers": 35, "dien-bien-phu-victory": 35, "liberation-day": 35, "vpa-day": 35, "mid-autumn": 35, "water-element": 35, "air-wind-element": 35, "earth-element": 35, "masculine-cyber": 35, "oriental-wuxia": 35, "mekong-delta": 35, "hanoi-old-quarter": 35, "mini-hologram-cosmos": 35, "aurora-borealis": 35, "arcade-retro": 35, "magic-chess": 35, "lofi-rain-chill": 35, "fairy-tale": 30, "tet-nguyen-dan": 35, "gio-to-hung-vuong": 35, "ngay-thanh-nien-26-3": 35, "giai-phong-30-4": 35, "thuong-binh-liet-si-27-7": 30, "cach-mang-19-8": 35, "quoc-khanh-2-9": 35, "tet-trung-thu": 35, "nha-giao-viet-nam-20-11": 35, "quoc-te-phu-nu-8-3": 35, "tet-doan-ngo-5-5": 35, "vu-lan-bao-hieu": 30, "phu-nu-viet-nam-20-10": 35, "quan-doi-nhan-dan-22-12": 35 }, pomodoroLayers: {}, pomodoroAmbientMix: { morning: 55, storm: 45 }, pomodoroBackground: 40, pomodoroBell: 70, pomodoroAlerts: DEFAULT_POMODORO_ALERT_SETTINGS, environment: 35, music: 30, uiEffects: 28, lumi: 75, ong: 75, memberVoice: 75 },
  audioPreviewSpeedPresets: {},
  personalAudioAssets: [],
  personalAudioTrash: [],
  personalStudyPresets: [],
  personalStudyPresetTimeRules: [],
  personalStudyPresetPomodoroRules: [],
  personalStudyPresetHistory: [],
  audioActionLogs: [],
  activePersonalStudyPresetId: undefined,
  studyCornerSettings: { lightMode: "day", lampOn: false, lampIntensity: 62, windowOpen: true, curtainOpen: true, laptopOpen: true, bookOpen: true, ambientEnabled: false, ambientVolume: 35 },
  studyCornerEnvironment: { ...DEFAULT_STUDY_CORNER_ENVIRONMENT, plantState: { ...DEFAULT_STUDY_CORNER_ENVIRONMENT.plantState }, audioZones: { ...DEFAULT_STUDY_CORNER_ENVIRONMENT.audioZones } },
  studyCornerRoomSnapshot: undefined,
  companionMode: "both",
  autoNightMode: false,
  focusMode: false,
  weeklyPomodoroGoalMinutes: 300,
  weeklyPomodoroGoalCompletions: [],
  lumiCongratulationMessages: {},
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
  wheelRewards: [],
  wheelTicketsPerAchievement: 0,
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
    rewardSources: [],
    events: [{
      id: "sample-weekly-plan-event",
      name: "Event mẫu · Tuần kế hoạch đầu tiên",
      description: "Event tham khảo để kiểm tra cách hiển thị nhiệm vụ và phần thưởng của Kế hoạch. Admin có thể sửa hoặc lưu trữ event này.",
      startsAt: "2026-08-01T00:00:00.000Z",
      endsAt: "2026-12-31T23:59:59.000Z",
      status: "active",
      difficulty: "Dễ",
      objective: "Hoàn thành 3 phiên học có chủ đích trong tuần.",
      tasks: [{ id: "sample-weekly-plan-task", title: "Hoàn thành 3 phiên học", description: "Ghi nhận ba phiên học hoặc Pomodoro hoàn tất trong tuần.", target: 3, metric: "studySession" }],
      rewards: [{ type: "ticket", amount: 1, label: "1 vé kế hoạch" }],
      fragmentRewards: [{ tier: "I", amount: 2, label: "2 mảnh ghép Cấp I" }],
      participationConditions: [],
      claimLimit: 1,
      approvalStatus: "approved",
      aiDraft: false,
      createdAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-01T00:00:00.000Z",
    }],
  },
  achievementOverrides: [],
  levelDefinitions: [],
  customAchievements: [],
  updatedAt: new Date().toISOString(),
});

export const XP_PER_LEVEL = 300;
/** Giữ export rỗng để dữ liệu cấp độ cũ không được sinh lại từ hợp đồng tương thích. */
export const DEFAULT_LEVEL_DEFINITIONS: LevelDefinition[] = [];

/** Duy trì tương thích kiểu dữ liệu cũ nhưng không cho dữ liệu Thành tích/Danh hiệu quay lại cấu hình đang dùng. */
export function purgeLegacyAchievementConfig(config: AppConfig): AppConfig {
  return {
    ...config,
    collectionConfig: config.collectionConfig ? { ...config.collectionConfig, rewardSources: [] } : config.collectionConfig,
    achievementOverrides: [],
    customAchievements: [],
    deletedAchievementIds: [],
    deletedTitleIds: [],
    levelDefinitions: [],
    wheelRewards: [],
    wheelTicketsPerAchievement: 0,
  };
}
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
  // Catalog cũ chỉ được giữ trong mã để đọc dữ liệu lịch sử tương thích; không sinh dữ liệu mới.
  return [];
  /* Legacy catalog retained below for backward-compatible TypeScript structures. */
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
  // Không còn tạo Thành tích/Danh hiệu từ dữ liệu học tập hiện hành.
  return [];
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
  const normalizedQuizzes: Quiz[] = Array.isArray(source.quizzes) ? source.quizzes.flatMap((value) => {
    if (!value || typeof value !== "object") return [];
    const quiz = value as Partial<Quiz>;
    if (!quiz.id || !quiz.title || !Array.isArray(quiz.questions)) return [];
    const mode: QuizMode = quiz.mode === "review" ? "review" : "test";
    const timerMode: QuizTimerMode = quiz.timerMode === "unlimited" || mode === "review" ? "unlimited" : "timed";
    return [{ ...quiz, id: String(quiz.id), title: String(quiz.title), subject: String(quiz.subject ?? ""), purpose: typeof quiz.purpose === "string" && quiz.purpose.trim() ? quiz.purpose.trim().slice(0, 240) : undefined, grade: typeof quiz.grade === "string" && quiz.grade.trim() ? quiz.grade.trim().slice(0, 80) : undefined, topic: String(quiz.topic ?? ""), course: typeof quiz.course === "string" && quiz.course.trim() ? quiz.course.trim().slice(0, 100) : undefined, educationLevel: EDUCATION_LEVELS.includes(quiz.educationLevel as EducationLevel) ? quiz.educationLevel as EducationLevel : undefined, difficulty: quiz.difficulty ?? "Trung bình", durationMinutes: Math.max(0, Number(quiz.durationMinutes) || 0), createdAt: String(quiz.createdAt ?? new Date(0).toISOString()), questions: quiz.questions as QuizQuestion[], mode, timerMode } as Quiz];
  }) : [];
  const merged: ProfileState = {
    ...base,
    ...source,
    xp: 0,
    flashcardSets: Array.isArray(source.flashcardSets) ? source.flashcardSets.flatMap((value) => {
      if (!value || typeof value !== "object") return [];
      const set = value as Partial<FlashcardSet>;
      if (!set.id || !set.title || !Array.isArray(set.cards)) return [];
      return [{ ...set, id: String(set.id), title: String(set.title), subject: String(set.subject ?? ""), purpose: typeof set.purpose === "string" && set.purpose.trim() ? set.purpose.trim().slice(0, 240) : undefined, grade: typeof set.grade === "string" && set.grade.trim() ? set.grade.trim().slice(0, 80) : undefined, topic: String(set.topic ?? ""), course: typeof set.course === "string" && set.course.trim() ? set.course.trim().slice(0, 100) : undefined, educationLevel: EDUCATION_LEVELS.includes(set.educationLevel as EducationLevel) ? set.educationLevel as EducationLevel : undefined, difficulty: set.difficulty ?? "Trung bình", createdAt: String(set.createdAt ?? new Date(0).toISOString()), studyCount: Math.max(0, Number(set.studyCount) || 0), cards: set.cards as Flashcard[] } as FlashcardSet];
    }) : [],
    quizzes: normalizedQuizzes,
    flashcardSetTrash: Array.isArray(source.flashcardSetTrash) ? source.flashcardSetTrash : [],
    quizTrash: Array.isArray(source.quizTrash) ? source.quizTrash : [],
    attempts: Array.isArray(source.attempts) ? source.attempts.flatMap((value) => { const attempt = value && typeof value === "object" ? (value as Partial<QuizAttempt>) : null; if (!attempt?.id || !attempt.quizId) return []; return [{ id: String(attempt.id), quizId: String(attempt.quizId), completedAt: String(attempt.completedAt ?? new Date(0).toISOString()), correct: Math.max(0, Number(attempt.correct) || 0), total: Math.max(0, Number(attempt.total) || 0), accuracy: Math.max(0, Math.min(100, Number(attempt.accuracy) || 0)), durationSeconds: Math.max(0, Number(attempt.durationSeconds) || 0), answers: Array.isArray(attempt.answers) ? attempt.answers : [] }]; }) : [],
    studyActivity: Array.isArray(source.studyActivity) ? source.studyActivity.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<StudyActivity>) : null; if (!item?.id || (item.kind !== "flashcard" && item.kind !== "quiz" && item.kind !== "wheel" && item.kind !== "pomodoro")) return []; return [{ id: String(item.id), occurredAt: String(item.occurredAt ?? new Date(0).toISOString()), kind: item.kind, quantity: Math.max(0, Number(item.quantity) || 0), durationSeconds: Math.max(0, Number(item.durationSeconds) || 0), xpEarned: Math.max(0, Number(item.xpEarned) || 0), correct: item.correct === undefined ? undefined : Math.max(0, Number(item.correct) || 0), total: item.total === undefined ? undefined : Math.max(0, Number(item.total) || 0) }]; }) : [],
    studyPlanItems: Array.isArray(source.studyPlanItems) ? (() => {
      const seenPlanIds = new Set<string>();
      return source.studyPlanItems.flatMap((value) => {
      const item = value && typeof value === "object" ? (value as Partial<StudyPlanItem>) : null;
      if (!item?.id || !item.title) return [];
      const id = String(item.id);
      if (seenPlanIds.has(id)) return [];
      seenPlanIds.add(id);
      return [{
        id,
        title: String(item.title).slice(0, 160),
        subject: typeof item.subject === "string" && item.subject.trim() ? item.subject.trim().slice(0, 80) : undefined,
        course: typeof item.course === "string" && item.course.trim() ? item.course.trim().slice(0, 100) : undefined,
        scheduledFor: typeof item.scheduledFor === "string" && item.scheduledFor ? item.scheduledFor.slice(0, 10) : new Date().toISOString().slice(0, 10),
        cadence: item.cadence === "week" ? "week" : "day",
        completed: item.completed === true,
        completedAt: typeof item.completedAt === "string" && item.completedAt ? item.completedAt : undefined,
        rewardGrantedAt: typeof item.rewardGrantedAt === "string" && item.rewardGrantedAt ? item.rewardGrantedAt : undefined,
        reward: "fragment",
        rewardAmount: Math.max(1, Math.min(9, Math.floor(Number(item.rewardAmount) || 1))),
        notes: typeof item.notes === "string" && item.notes.trim() ? item.notes.trim().slice(0, 500) : undefined,
      } satisfies StudyPlanItem];
      });
    })() : [],
    planFragments: Math.max(0, Math.floor(Number(source.planFragments) || 0)) + Math.max(0, Math.floor(Number((source as { planTickets?: unknown }).planTickets) || 0)),
    fragments: source.fragments && typeof source.fragments === "object" ? source.fragments : {},
    fragmentLedger: source.fragmentLedger && typeof source.fragmentLedger === "object" ? Object.fromEntries((Object.entries(source.fragmentLedger) as Array<[FragmentTier, unknown]>).filter(([tier]) => ["I", "II", "III", "IV", "V", "VI"].includes(tier)).map(([tier, value]) => [tier, Math.max(0, Math.floor(Number(value) || 0))])) as Partial<Record<FragmentTier, number>> : {},
    level: 1,
    unlockedAchievementIds: [],
    ownedBadges: [],
    activeTitle: null,
    inventory: Array.isArray(source.inventory) ? source.inventory : [],
    achievementUnlockDates: {},
    achievementEvidence: {},
    animationsEnabled: source.animationsEnabled !== false,
    popupsEnabled: source.popupsEnabled !== false,
    pomodoroLumiSupportMode: ["comfort", "encouragement", "off"].includes(String(source.pomodoroLumiSupportMode)) ? source.pomodoroLumiSupportMode as ProfileState["pomodoroLumiSupportMode"] : "encouragement",
    lumiSpeechEnabled: source.lumiSpeechEnabled !== false,
    lumiWaterSettings: normalizeLumiWaterSettings(source.lumiWaterSettings),
    activeCosmeticTheme: normalizeCosmeticPaletteId(source.activeCosmeticTheme),
    festiveThemeOptions: {
      enableThemeTone: source.festiveThemeOptions?.enableThemeTone !== false,
      enableAmbientAudio: source.festiveThemeOptions?.enableAmbientAudio !== false,
      enableVFX: source.festiveThemeOptions?.enableVFX !== false,
    },
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
        return [{ id, url, label: typeof recording.label === "string" && recording.label.trim() ? recording.label.slice(0, 80) : `Bản thu Lumi ${index + 1}`, createdAt: typeof recording.createdAt === "string" && recording.createdAt ? recording.createdAt : new Date(0).toISOString(), updatedAt: typeof recording.updatedAt === "string" && recording.updatedAt ? recording.updatedAt : undefined, imageUrl: typeof recording.imageUrl === "string" && recording.imageUrl.trim() ? recording.imageUrl : lumiImageUrl, colorLabel: typeof recording.colorLabel === "string" && ["red", "orange", "yellow", "green", "blue", "purple", "pink", "gray"].includes(recording.colorLabel) ? recording.colorLabel : undefined }];
      }) : [];
      if (!lumiVoiceRecordings.length && lumiVoiceUrl) lumiVoiceRecordings.push({ id: `legacy-${emotion}`, url: lumiVoiceUrl, label: "Bản thu Lumi đã lưu", createdAt: new Date(0).toISOString(), updatedAt: undefined, imageUrl: lumiImageUrl, colorLabel: undefined });
      const favoriteLumiVoiceId = lumiVoiceRecordings.some((recording) => recording.id === media.favoriteLumiVoiceId) ? media.favoriteLumiVoiceId : undefined;
      return mascotImageUrl || lumiImageUrl || lumiVoiceUrl || lumiVoiceRecordings.length ? [[emotion, { mascotImageUrl, lumiImageUrl, lumiVoiceUrl, lumiVoiceRecordings, favoriteLumiVoiceId }]] : [];
    })) as Partial<Record<EmotionThemeId, CompanionEmotionMedia>> : {},
    lumiVoiceRecordingTrash: source.lumiVoiceRecordingTrash && typeof source.lumiVoiceRecordingTrash === "object" ? Object.fromEntries(Object.entries(source.lumiVoiceRecordingTrash).flatMap(([emotion, entries]) => {
      if (!["calm", "happy", "tired", "sad", "stressed", "lazy", "proud", "focused", "hopeful", "overwhelmed", "sleepy", "excited", "lonely", "confident", "curious", "comeback"].includes(emotion) || !Array.isArray(entries)) return [];
      const ids = new Set<string>();
      const normalized = entries.flatMap((entry, index) => {
        if (!entry || typeof entry !== "object") return [];
        const candidate = entry as Partial<LumiVoiceRecordingTrashEntry>;
        const recording = candidate.recording as Partial<LumiVoiceRecording> | undefined;
        const id = typeof recording?.id === "string" && recording.id.trim() ? recording.id.trim() : "";
        const url = typeof recording?.url === "string" && recording.url.trim() ? recording.url.trim() : "";
        if (!id || !url || ids.has(id)) return [];
        ids.add(id);
        return [{ recording: { id, url, label: typeof recording?.label === "string" && recording.label.trim() ? recording.label.slice(0, 80) : `Bản thu Lumi ${index + 1}`, createdAt: typeof recording?.createdAt === "string" && recording.createdAt ? recording.createdAt : new Date(0).toISOString(), updatedAt: typeof recording?.updatedAt === "string" && recording.updatedAt ? recording.updatedAt : undefined, imageUrl: typeof recording?.imageUrl === "string" && recording.imageUrl.trim() ? recording.imageUrl : undefined, colorLabel: typeof recording?.colorLabel === "string" && ["red", "orange", "yellow", "green", "blue", "purple", "pink", "gray"].includes(recording.colorLabel) ? recording.colorLabel : undefined }, deletedAt: typeof candidate.deletedAt === "string" && candidate.deletedAt ? candidate.deletedAt : new Date(0).toISOString(), originalIndex: Math.max(0, Number.isFinite(Number(candidate.originalIndex)) ? Math.floor(Number(candidate.originalIndex)) : 0), previousFavoriteId: typeof candidate.previousFavoriteId === "string" && candidate.previousFavoriteId ? candidate.previousFavoriteId : undefined }];
      });
      const retentionCutoff = Date.now() - LUMI_VOICE_TRASH_RETENTION_MS;
      const retained = normalized.filter((entry) => {
        const deletedAt = Date.parse(entry.deletedAt);
        return Number.isFinite(deletedAt) && deletedAt > retentionCutoff;
      });
      return retained.length ? [[emotion, retained.slice(0, 200)]] : [];
    })) as Partial<Record<EmotionThemeId, LumiVoiceRecordingTrashEntry[]>> : {},
    showMascot: source.showMascot !== false,
    showLumi: source.showLumi !== false,
    defaultAmbientScene: AMBIENT_SCENE_IDS.includes(String(source.defaultAmbientScene) as AmbientScenePreference) ? source.defaultAmbientScene as AmbientScenePreference : base.defaultAmbientScene,
    sceneEffectPreferences: {
      leaves: Math.max(0, Math.min(100, Number(source.sceneEffectPreferences?.leaves ?? base.sceneEffectPreferences!.leaves) || 0)),
      snow: Math.max(0, Math.min(100, Number(source.sceneEffectPreferences?.snow ?? base.sceneEffectPreferences!.snow) || 0)),
      puddles: Math.max(0, Math.min(100, Number(source.sceneEffectPreferences?.puddles ?? base.sceneEffectPreferences!.puddles) || 0)),
      snowmanX: Math.max(4, Math.min(96, Number(source.sceneEffectPreferences?.snowmanX ?? base.sceneEffectPreferences!.snowmanX) || 0)),
      snowmanY: Math.max(2, Math.min(35, Number(source.sceneEffectPreferences?.snowmanY ?? base.sceneEffectPreferences!.snowmanY) || 0)),
    },
    appearanceEmojiPet: (() => {
      const candidate = source.appearanceEmojiPet as Partial<AppearanceEmojiPet> | undefined;
      const allowed = ["snowman", "🐝", "🐼", "🦊", "🐱", "🐸", "🦄", "🐳", "🦉", "🐰", "🐯", "🦋", "🌵"];
      if (!candidate || !allowed.includes(String(candidate.emoji))) return undefined;
      const roamingEnabled = candidate.roam === true || candidate.roamingEnabled === true;
      return {
        emoji: String(candidate.emoji),
        x: Math.max(4, Math.min(96, Number(candidate.x) || 50)),
        y: Math.max(7, Math.min(90, Number(candidate.y) || 72)),
        roam: roamingEnabled,
        roamingEnabled,
      };
    })(),
    favoriteAmbientScenes: Array.isArray(source.favoriteAmbientScenes)
      ? (source.favoriteAmbientScenes.filter((scene, index, list) => typeof scene === "string" && AMBIENT_SCENE_IDS.includes(scene as AmbientScenePreference) && list.indexOf(scene) === index) as AmbientScenePreference[])
      : [],
    sceneAutomation: {
      enabled: source.sceneAutomation?.enabled === true,
      applyFixedHolidays: source.sceneAutomation?.applyFixedHolidays !== false,
      timeRules: Array.isArray(source.sceneAutomation?.timeRules) ? source.sceneAutomation.timeRules.flatMap((rule, index) => {
        if (!rule || typeof rule !== "object") return [];
        const candidate = rule as Partial<SceneTimeRule>;
        if (!candidate.id || !AMBIENT_SCENE_IDS.includes(String(candidate.scene) as AmbientScenePreference)) return [];
        return [{ id: String(candidate.id).slice(0, 80), label: typeof candidate.label === "string" && candidate.label.trim() ? candidate.label.trim().slice(0, 60) : `Khung giờ ${index + 1}`, scene: candidate.scene as AmbientScenePreference, startHour: Math.max(0, Math.min(23, Math.floor(Number(candidate.startHour) || 0))), endHour: Math.max(0, Math.min(23, Math.floor(Number(candidate.endHour) || 0)))}];
      }).slice(0, 12) : base.sceneAutomation!.timeRules,
    },
    audioMixer: {
      ambientSceneVolumes: Object.fromEntries(AMBIENT_SCENE_IDS.map((scene) => [scene, Math.max(0, Math.min(100, Number(source.audioMixer?.ambientSceneVolumes?.[scene] ?? base.audioMixer!.ambientSceneVolumes[scene]) || 0))])) as AudioMixerSettings["ambientSceneVolumes"],
      pomodoroLayers: source.audioMixer?.pomodoroLayers && typeof source.audioMixer.pomodoroLayers === "object" ? Object.fromEntries(Object.entries(source.audioMixer.pomodoroLayers).map(([id, level]) => [id, Math.max(0, Math.min(100, Number(level) || 0))])) : {},
      pomodoroAmbientMix: {
        morning: Math.max(0, Math.min(100, Number(source.audioMixer?.pomodoroAmbientMix?.morning ?? base.audioMixer!.pomodoroAmbientMix!.morning) || 0)),
        storm: Math.max(0, Math.min(100, Number(source.audioMixer?.pomodoroAmbientMix?.storm ?? base.audioMixer!.pomodoroAmbientMix!.storm) || 0)),
      },
      pomodoroBackground: Math.max(0, Math.min(100, Number(source.audioMixer?.pomodoroBackground ?? base.audioMixer!.pomodoroBackground) || 0)),
      pomodoroBell: Math.max(0, Math.min(100, Number(source.audioMixer?.pomodoroBell ?? base.audioMixer!.pomodoroBell) || 0)),
      pomodoroAlerts: normalizePomodoroAlertSettings(source.audioMixer?.pomodoroAlerts),
      environment: Math.max(0, Math.min(100, Number(source.audioMixer?.environment ?? base.audioMixer!.environment) || 0)),
      music: Math.max(0, Math.min(100, Number(source.audioMixer?.music ?? base.audioMixer!.music) || 0)),
      uiEffects: Math.max(0, Math.min(100, Number(source.audioMixer?.uiEffects ?? base.audioMixer!.uiEffects) || 0)),
      lumi: Math.max(0, Math.min(100, Number(source.audioMixer?.lumi ?? base.audioMixer!.lumi) || 0)),
      ong: Math.max(0, Math.min(100, Number(source.audioMixer?.ong ?? base.audioMixer!.ong) || 0)),
      memberVoice: Math.max(0, Math.min(100, Number(source.audioMixer?.memberVoice ?? base.audioMixer!.memberVoice) || 0)),
    },
    audioPreviewSpeedPresets: Object.fromEntries((Object.keys({ emotion: true, season: true, weather: true, pomodoro: true, lumi: true, ong: true, member: true, background: true }) as PersonalAudioCategory[]).flatMap((category) => {
      const values = source.audioPreviewSpeedPresets?.[category];
      if (!Array.isArray(values)) return [];
      const speeds = values.filter((value): value is AudioPreviewSpeed => [0.5, 1, 1.5, 2].includes(Number(value))).map(Number).filter((value, index, list) => list.indexOf(value) === index) as AudioPreviewSpeed[];
      return speeds.length ? [[category, speeds]] : [];
    })) as Partial<Record<PersonalAudioCategory, AudioPreviewSpeed[]>>,
    personalAudioAssets: Array.isArray(source.personalAudioAssets) ? source.personalAudioAssets.flatMap((value) => {
      const asset = value && typeof value === "object" ? value as Partial<PersonalAudioAsset> : null;
      const id = typeof asset?.id === "string" && asset.id.trim() ? asset.id.trim() : "";
      const name = typeof asset?.name === "string" && asset.name.trim() ? asset.name.trim().slice(0, 100) : "";
      const url = typeof asset?.url === "string" && /^(https?:\/\/|\/manus-storage\/)/.test(asset.url.trim()) ? asset.url.trim() : "";
      const category = asset?.category;
      const sourceType = asset?.source;
      if (!id || !name || !url || !["emotion", "season", "weather", "pomodoro", "lumi", "ong", "member", "background"].includes(String(category)) || !["user_upload", "external_url", "built_in"].includes(String(sourceType))) return [];
      return [{ id, name, description: typeof asset?.description === "string" && asset.description.trim() ? asset.description.trim().slice(0, 280) : undefined, tags: Array.isArray(asset?.tags) ? asset.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim())).map((tag) => tag.trim().slice(0, 32)).slice(0, 12) : [], url, source: sourceType as PersonalAudioSource, category: category as PersonalAudioCategory, target: typeof asset?.target === "string" && asset.target.trim() ? asset.target.trim().slice(0, 80) : "general", enabled: asset?.enabled !== false, isDefault: asset?.isDefault === true, volume: Math.max(0, Math.min(100, Number(asset?.volume) || 0)), durationSeconds: Number.isFinite(Number(asset?.durationSeconds)) && Number(asset?.durationSeconds) > 0 ? Math.min(86400, Number(asset?.durationSeconds)) : undefined, waveform: Array.isArray(asset?.waveform) ? asset.waveform.filter((value): value is number => typeof value === "number" && Number.isFinite(value)).map((value) => Math.max(0, Math.min(1, value))).slice(0, 96) : undefined, sortOrder: Number.isFinite(Number(asset?.sortOrder)) ? Math.max(0, Math.min(999999, Math.round(Number(asset?.sortOrder)))) : undefined, group: typeof asset?.group === "string" && asset.group.trim() ? asset.group.trim().slice(0, 60) : undefined, createdAt: typeof asset?.createdAt === "string" && asset.createdAt ? asset.createdAt : new Date(0).toISOString(), updatedAt: typeof asset?.updatedAt === "string" && asset.updatedAt ? asset.updatedAt : new Date(0).toISOString(), healthStatus: ["unknown", "checking", "ok", "error"].includes(String(asset?.healthStatus)) ? asset?.healthStatus as AudioHealthStatus : "unknown", healthCheckedAt: typeof asset?.healthCheckedAt === "string" ? asset.healthCheckedAt : undefined, healthMessage: typeof asset?.healthMessage === "string" ? asset.healthMessage.slice(0, 180) : undefined }];
    }).filter((asset, index, assets) => assets.findIndex((candidate) => candidate.id === asset.id) === index).slice(0, 300) : [],
    personalAudioTrash: Array.isArray(source.personalAudioTrash) ? source.personalAudioTrash.flatMap((value) => {
      const asset = value && typeof value === "object" ? value as Partial<PersonalAudioAsset> : null;
      const id = typeof asset?.id === "string" && asset.id.trim() ? asset.id.trim() : "";
      const name = typeof asset?.name === "string" && asset.name.trim() ? asset.name.trim().slice(0, 100) : "";
      const url = typeof asset?.url === "string" && /^(https?:\/\/|\/manus-storage\/)/.test(asset.url.trim()) ? asset.url.trim() : "";
      const category = asset?.category;
      const sourceType = asset?.source;
      const deletedAt = typeof asset?.deletedAt === "string" && !Number.isNaN(Date.parse(asset.deletedAt)) ? asset.deletedAt : "";
      if (!id || !name || !url || !deletedAt || Date.now() - Date.parse(deletedAt) > 30 * 24 * 60 * 60 * 1000 || !["emotion", "season", "weather", "pomodoro", "lumi", "ong", "member", "background"].includes(String(category)) || !["user_upload", "external_url", "built_in"].includes(String(sourceType))) return [];
      return [{ id, name, description: typeof asset?.description === "string" && asset.description.trim() ? asset.description.trim().slice(0, 280) : undefined, tags: Array.isArray(asset?.tags) ? asset.tags.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim())).map((tag) => tag.trim().slice(0, 32)).slice(0, 12) : [], url, source: sourceType as PersonalAudioSource, category: category as PersonalAudioCategory, target: typeof asset?.target === "string" && asset.target.trim() ? asset.target.trim().slice(0, 80) : "general", enabled: false, isDefault: false, volume: Math.max(0, Math.min(100, Number(asset?.volume) || 0)), durationSeconds: Number.isFinite(Number(asset?.durationSeconds)) && Number(asset?.durationSeconds) > 0 ? Math.min(86400, Number(asset?.durationSeconds)) : undefined, waveform: Array.isArray(asset?.waveform) ? asset.waveform.filter((value): value is number => typeof value === "number" && Number.isFinite(value)).map((value) => Math.max(0, Math.min(1, value))).slice(0, 96) : undefined, sortOrder: Number.isFinite(Number(asset?.sortOrder)) ? Math.max(0, Math.min(999999, Math.round(Number(asset?.sortOrder)))) : undefined, group: typeof asset?.group === "string" && asset.group.trim() ? asset.group.trim().slice(0, 60) : undefined, createdAt: typeof asset?.createdAt === "string" && asset.createdAt ? asset.createdAt : new Date(0).toISOString(), updatedAt: typeof asset?.updatedAt === "string" && asset.updatedAt ? asset.updatedAt : new Date(0).toISOString(), healthStatus: ["unknown", "checking", "ok", "error"].includes(String(asset?.healthStatus)) ? asset?.healthStatus as AudioHealthStatus : "unknown", healthCheckedAt: typeof asset?.healthCheckedAt === "string" ? asset.healthCheckedAt : undefined, healthMessage: typeof asset?.healthMessage === "string" ? asset.healthMessage.slice(0, 180) : undefined, deletedAt }];
    }).filter((asset, index, assets) => assets.findIndex((candidate) => candidate.id === asset.id) === index).slice(0, 300) : [],
    audioGroupPresets: Array.isArray(source.audioGroupPresets) ? source.audioGroupPresets.flatMap((value) => {
      const preset = value && typeof value === "object" ? value as Partial<AudioGroupPreset> : null;
      const id = typeof preset?.id === "string" && preset.id.trim() ? preset.id.trim() : "";
      const name = typeof preset?.name === "string" && preset.name.trim() ? preset.name.trim().slice(0, 80) : "";
      if (!id || !name) return [];
      return [{ id, name, audioAssetIds: Array.isArray(preset?.audioAssetIds) ? preset.audioAssetIds.filter((assetId): assetId is string => typeof assetId === "string" && assetId.trim().length > 0).slice(0, 120) : [], enabled: preset?.enabled !== false, createdAt: typeof preset?.createdAt === "string" && preset.createdAt ? preset.createdAt : new Date(0).toISOString(), updatedAt: typeof preset?.updatedAt === "string" && preset.updatedAt ? preset.updatedAt : new Date(0).toISOString() }];
    }).filter((preset, index, presets) => presets.findIndex((candidate) => candidate.id === preset.id) === index).slice(0, 100) : [],
    personalPomodoroAmbientPresets: Array.isArray(source.personalPomodoroAmbientPresets) ? source.personalPomodoroAmbientPresets.flatMap((value) => {
      const preset = value && typeof value === "object" ? value as Partial<PersonalPomodoroAmbientPreset> : null;
      const id = typeof preset?.id === "string" && preset.id.trim() ? preset.id.trim() : "";
      const name = typeof preset?.name === "string" && preset.name.trim() ? preset.name.trim().slice(0, 60) : "";
      if (!id || !name) return [];
      return [{ id, name, morning: Math.max(0, Math.min(100, Math.round(Number(preset?.morning)))), storm: Math.max(0, Math.min(100, Math.round(Number(preset?.storm)))), createdAt: typeof preset?.createdAt === "string" && preset.createdAt ? preset.createdAt : new Date(0).toISOString(), updatedAt: typeof preset?.updatedAt === "string" && preset.updatedAt ? preset.updatedAt : new Date(0).toISOString() }];
    }).filter((preset, index, presets) => presets.findIndex((candidate) => candidate.id === preset.id) === index).slice(0, 50) : [],
    personalStudyPresets: Array.isArray(source.personalStudyPresets) ? source.personalStudyPresets.flatMap((value) => {
      const preset = value && typeof value === "object" ? value as Partial<PersonalStudyPreset> : null;
      const id = typeof preset?.id === "string" && preset.id.trim() ? preset.id.trim() : "";
      const name = typeof preset?.name === "string" && preset.name.trim() ? preset.name.trim().slice(0, 80) : "";
      if (!id || !name) return [];
      return [{ id, name, emotion: ["calm", "happy", "tired", "sad", "stressed", "lazy", "proud", "focused", "hopeful", "overwhelmed", "sleepy", "excited", "lonely", "confident", "curious", "comeback"].includes(String(preset?.emotion)) ? preset?.emotion as EmotionThemeId : undefined, ambientScene: AMBIENT_SCENE_IDS.includes(String(preset?.ambientScene) as AmbientScenePreference) ? preset?.ambientScene as AmbientScenePreference : undefined, audioAssetIds: Array.isArray(preset?.audioAssetIds) ? preset!.audioAssetIds.filter((id): id is string => typeof id === "string" && id.trim().length > 0).slice(0, 80) : [], companionMode: ["lumi", "ong", "both", "hidden"].includes(String(preset?.companionMode)) ? preset?.companionMode as PersonalStudyPreset["companionMode"] : "both", focusMode: preset?.focusMode === true, createdAt: typeof preset?.createdAt === "string" && preset.createdAt ? preset.createdAt : new Date(0).toISOString(), updatedAt: typeof preset?.updatedAt === "string" && preset.updatedAt ? preset.updatedAt : new Date(0).toISOString() }];
    }).filter((preset, index, presets) => presets.findIndex((candidate) => candidate.id === preset.id) === index).slice(0, 100) : [],
    personalStudyPresetSchedule: Array.isArray(source.personalStudyPresetSchedule) ? source.personalStudyPresetSchedule.flatMap((value) => {
      const item = value && typeof value === "object" ? value as Partial<PersonalStudyPresetSchedule> : null;
      const id = typeof item?.id === "string" && item.id.trim() ? item.id.trim() : "";
      const presetId = typeof item?.presetId === "string" && item.presetId.trim() ? item.presetId.trim() : "";
      const dayOfWeek = Math.max(0, Math.min(6, Math.round(Number(item?.dayOfWeek))));
      if (!id || !presetId || !Number.isFinite(dayOfWeek)) return [];
      return [{ id, presetId, dayOfWeek, enabled: item?.enabled !== false, updatedAt: typeof item?.updatedAt === "string" && item.updatedAt ? item.updatedAt : new Date(0).toISOString() }];
    }).filter((item, index, items) => items.findIndex((candidate) => candidate.dayOfWeek === item.dayOfWeek) === index).slice(0, 7) : [],
    personalStudyPresetTimeRules: Array.isArray(source.personalStudyPresetTimeRules) ? source.personalStudyPresetTimeRules.flatMap((value) => {
      const item = value && typeof value === "object" ? value as Partial<PersonalStudyPresetTimeRule> : null;
      const id = typeof item?.id === "string" && item.id.trim() ? item.id.trim() : "";
      const presetId = typeof item?.presetId === "string" && item.presetId.trim() ? item.presetId.trim() : "";
      const startTime = typeof item?.startTime === "string" && /^([01]\\d|2[0-3]):[0-5]\\d$/.test(item.startTime) ? item.startTime : "";
      const endTime = typeof item?.endTime === "string" && /^([01]\\d|2[0-3]):[0-5]\\d$/.test(item.endTime) ? item.endTime : "";
      if (!id || !presetId || !startTime || !endTime) return [];
      const daysOfWeek = Array.isArray(item?.daysOfWeek) ? item!.daysOfWeek.filter((day): day is number => Number.isFinite(Number(day)) && Number(day) >= 0 && Number(day) <= 6).map((day) => Math.round(Number(day))).slice(0, 7) : undefined;
      return [{ id, startTime, endTime, presetId, daysOfWeek, enabled: item?.enabled !== false, updatedAt: typeof item?.updatedAt === "string" && item.updatedAt ? item.updatedAt : new Date(0).toISOString() }];
    }).filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index).slice(0, 50) : [],
    personalStudyPresetPomodoroRules: Array.isArray(source.personalStudyPresetPomodoroRules) ? source.personalStudyPresetPomodoroRules.flatMap((value) => {
      const item = value && typeof value === "object" ? value as Partial<PersonalStudyPresetPomodoroRule> : null;
      const id = typeof item?.id === "string" && item.id.trim() ? item.id.trim() : "";
      const presetId = typeof item?.presetId === "string" && item.presetId.trim() ? item.presetId.trim() : "";
      const mode = item?.mode;
      if (!id || !presetId || !["focus", "shortBreak", "longBreak"].includes(String(mode))) return [];
      return [{ id, presetId, mode: mode as PersonalStudyPresetPomodoroRule["mode"], enabled: item?.enabled !== false, priority: Math.max(0, Math.min(999, Math.round(Number(item?.priority) || 0))), updatedAt: typeof item?.updatedAt === "string" && item.updatedAt ? item.updatedAt : new Date(0).toISOString() }];
    }).filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index).sort((a, b) => a.priority - b.priority).slice(0, 30) : [],
    personalStudyPresetHistory: Array.isArray(source.personalStudyPresetHistory) ? source.personalStudyPresetHistory.flatMap((value) => {
      const item = value && typeof value === "object" ? value as Partial<PersonalStudyPresetHistory> : null;
      const id = typeof item?.id === "string" && item.id.trim() ? item.id.trim() : "";
      const presetId = typeof item?.presetId === "string" && item.presetId.trim() ? item.presetId.trim() : "";
      const presetName = typeof item?.presetName === "string" && item.presetName.trim() ? item.presetName.trim().slice(0, 80) : "";
      const changedAt = typeof item?.changedAt === "string" && !Number.isNaN(Date.parse(item.changedAt)) ? item.changedAt : "";
      const snapshot = item?.snapshot && typeof item.snapshot === "object" ? item.snapshot as PersonalStudyPreset : null;
      if (!id || !presetId || !presetName || !changedAt || !snapshot || snapshot.id !== presetId) return [];
      return [{ id, presetId, presetName, snapshot, changedAt, reason: typeof item?.reason === "string" && item.reason.trim() ? item.reason.trim().slice(0, 160) : undefined }];
    }).filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index).sort((a, b) => Date.parse(b.changedAt) - Date.parse(a.changedAt)).slice(0, 100) : [],
    audioActionLogs: Array.isArray(source.audioActionLogs) ? source.audioActionLogs.flatMap((value) => {
      const item = value && typeof value === "object" ? value as Partial<AudioActionLog> : null;
      const id = typeof item?.id === "string" && item.id.trim() ? item.id.trim() : "";
      const entityId = typeof item?.entityId === "string" && item.entityId.trim() ? item.entityId.trim() : "";
      const entityName = typeof item?.entityName === "string" && item.entityName.trim() ? item.entityName.trim().slice(0, 100) : "";
      const occurredAt = typeof item?.occurredAt === "string" && !Number.isNaN(Date.parse(item.occurredAt)) ? item.occurredAt : "";
      const action = item?.action;
      const entityType = item?.entityType;
      if (!id || !entityId || !entityName || !occurredAt || !["create", "update", "delete", "restore", "apply", "autoApply"].includes(String(action)) || !["preset", "asset"].includes(String(entityType))) return [];
      return [{ id, occurredAt, action: action as AudioActionLog["action"], entityType: entityType as AudioActionLog["entityType"], entityId, entityName, summary: typeof item?.summary === "string" ? item.summary.slice(0, 200) : "Thao tác audio", snapshot: item?.snapshot && typeof item.snapshot === "object" ? item.snapshot as AudioActionLog["snapshot"] : undefined, previousSnapshot: item?.previousSnapshot && typeof item.previousSnapshot === "object" ? item.previousSnapshot as AudioActionLog["previousSnapshot"] : undefined }];
    }).filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index).sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt)).slice(0, 200) : [],
    activePersonalStudyPresetId: typeof source.activePersonalStudyPresetId === "string" && source.personalStudyPresets?.some((preset) => preset && typeof preset === "object" && (preset as Partial<PersonalStudyPreset>).id === source.activePersonalStudyPresetId) ? source.activePersonalStudyPresetId : undefined,
    studyCornerEnvironment: {
      ...DEFAULT_STUDY_CORNER_ENVIRONMENT,
      ...(source.studyCornerEnvironment && typeof source.studyCornerEnvironment === "object" ? source.studyCornerEnvironment : {}),
      mode: source.studyCornerEnvironment?.mode === "manual" ? "manual" : "auto",
      season: ["spring", "summer", "autumn", "winter"].includes(String(source.studyCornerEnvironment?.season)) ? source.studyCornerEnvironment!.season as StudyCornerSeason : DEFAULT_STUDY_CORNER_ENVIRONMENT.season,
      weather: ["sunny", "partlyCloudy", "cloudy", "rain", "storm", "fog", "snow"].includes(String(source.studyCornerEnvironment?.weather)) ? source.studyCornerEnvironment!.weather as StudyCornerWeather : DEFAULT_STUDY_CORNER_ENVIRONMENT.weather,
      weatherStage: ["clear", "cloudsGathering", "drizzle", "steadyRain", "heavyRain", "stormBreak", "afterRain", "snowFall"].includes(String(source.studyCornerEnvironment?.weatherStage)) ? source.studyCornerEnvironment!.weatherStage as StudyCornerWeatherStage : DEFAULT_STUDY_CORNER_ENVIRONMENT.weatherStage,
      weatherProgress: Math.max(0, Math.min(100, Number(source.studyCornerEnvironment?.weatherProgress ?? 0) || 0)),
      emotion: ["neutral", "calm", "happy", "motivated", "focused", "sad", "tired", "relaxed", "energetic"].includes(String(source.studyCornerEnvironment?.emotion)) ? source.studyCornerEnvironment!.emotion as StudyCornerAdaptiveEmotion : "neutral",
      windowScene: ["garden", "city", "park", "neighborhood", "sunrise", "sunset", "cityNight"].includes(String(source.studyCornerEnvironment?.windowScene)) ? source.studyCornerEnvironment!.windowScene as StudyCornerWindowScene : DEFAULT_STUDY_CORNER_ENVIRONMENT.windowScene,
      plantState: { ...DEFAULT_STUDY_CORNER_ENVIRONMENT.plantState, variety: ["monstera", "fern", "succulent"].includes(String(source.studyCornerEnvironment?.plantState?.variety)) ? source.studyCornerEnvironment!.plantState!.variety as StudyCornerPlantState["variety"] : DEFAULT_STUDY_CORNER_ENVIRONMENT.plantState.variety, sway: Math.max(0, Math.min(100, Number(source.studyCornerEnvironment?.plantState?.sway ?? 35) || 0)), hydration: Math.max(0, Math.min(100, Number(source.studyCornerEnvironment?.plantState?.hydration ?? 70) || 0)), leafTone: ["fresh", "autumn", "winter"].includes(String(source.studyCornerEnvironment?.plantState?.leafTone)) ? source.studyCornerEnvironment!.plantState!.leafTone as StudyCornerPlantState["leafTone"] : DEFAULT_STUDY_CORNER_ENVIRONMENT.plantState.leafTone, lastUpdatedAt: typeof source.studyCornerEnvironment?.plantState?.lastUpdatedAt === "string" ? source.studyCornerEnvironment!.plantState!.lastUpdatedAt : DEFAULT_STUDY_CORNER_ENVIRONMENT.plantState.lastUpdatedAt },
      audioZones: { outside: { ...DEFAULT_STUDY_CORNER_ENVIRONMENT.audioZones.outside, ...(source.studyCornerEnvironment?.audioZones?.outside && typeof source.studyCornerEnvironment.audioZones.outside === "object" ? source.studyCornerEnvironment.audioZones.outside : {}), volume: Math.max(0, Math.min(100, Number(source.studyCornerEnvironment?.audioZones?.outside?.volume ?? 38) || 0)) }, room: { ...DEFAULT_STUDY_CORNER_ENVIRONMENT.audioZones.room, ...(source.studyCornerEnvironment?.audioZones?.room && typeof source.studyCornerEnvironment.audioZones.room === "object" ? source.studyCornerEnvironment.audioZones.room : {}), volume: Math.max(0, Math.min(100, Number(source.studyCornerEnvironment?.audioZones?.room?.volume ?? 24) || 0)) }, desk: { ...DEFAULT_STUDY_CORNER_ENVIRONMENT.audioZones.desk, ...(source.studyCornerEnvironment?.audioZones?.desk && typeof source.studyCornerEnvironment.audioZones.desk === "object" ? source.studyCornerEnvironment.audioZones.desk : {}), volume: Math.max(0, Math.min(100, Number(source.studyCornerEnvironment?.audioZones?.desk?.volume ?? 18) || 0)) } },
      colorProfile: ["auto", "spring", "summer", "autumn", "winter", "calm", "happy", "motivated", "focused", "sad", "tired"].includes(String(source.studyCornerEnvironment?.colorProfile)) ? source.studyCornerEnvironment!.colorProfile as StudyCornerColorProfile : "auto",
      lightOverride: ["auto", "day", "sunset", "night"].includes(String(source.studyCornerEnvironment?.lightOverride)) ? source.studyCornerEnvironment!.lightOverride as StudyCornerEnvironment["lightOverride"] : "auto",
      soundEnabled: source.studyCornerEnvironment?.soundEnabled === true,
      soundVolume: Math.max(0, Math.min(100, Number(source.studyCornerEnvironment?.soundVolume ?? 35) || 0)),
      thunderEnabled: source.studyCornerEnvironment?.thunderEnabled === true,
      effectsEnabled: source.studyCornerEnvironment?.effectsEnabled !== false,
      reduceMotion: source.studyCornerEnvironment?.reduceMotion === true,
      selectedPresetId: typeof source.studyCornerEnvironment?.selectedPresetId === "string" ? source.studyCornerEnvironment.selectedPresetId : undefined,
    },
    studyCornerRoomSnapshot: source.studyCornerRoomSnapshot && typeof source.studyCornerRoomSnapshot === "object" ? source.studyCornerRoomSnapshot as ProfileState["studyCornerRoomSnapshot"] : undefined,
    companionMode: ["lumi", "ong", "both", "hidden"].includes(String(source.companionMode)) ? source.companionMode as PersonalStudyPreset["companionMode"] : "both",
    autoNightMode: source.autoNightMode === true,
    focusMode: source.focusMode === true,
    weeklyPomodoroGoalMinutes: Math.max(30, Math.min(10_080, Math.round(Number(source.weeklyPomodoroGoalMinutes ?? base.weeklyPomodoroGoalMinutes ?? 300) || base.weeklyPomodoroGoalMinutes || 300))),
    weeklyPomodoroGoalCompletions: Array.isArray(source.weeklyPomodoroGoalCompletions) ? source.weeklyPomodoroGoalCompletions.flatMap((value) => {
      const item = value && typeof value === "object" ? value as Partial<WeeklyPomodoroGoalCompletion> : null;
      const safeItem = item ?? {};
      const weekKey = typeof safeItem.weekKey === "string" && /^\d{4}-W\d{2}$/.test(safeItem.weekKey) ? safeItem.weekKey : "";
      if (!weekKey) return [];
      return [{ weekKey, completedAt: typeof safeItem.completedAt === "string" && safeItem.completedAt ? safeItem.completedAt : new Date(0).toISOString(), goalMinutes: Math.max(30, Math.min(10_080, Math.round(Number(safeItem.goalMinutes) || 30))), achievedMinutes: Math.max(0, Math.round(Number(safeItem.achievedMinutes) || 0)) }];
    }).filter((item, index, items) => items.findIndex((candidate) => candidate.weekKey === item.weekKey) === index).slice(0, 104) : [],
    lumiCongratulationMessages: source.lumiCongratulationMessages && typeof source.lumiCongratulationMessages === "object" ? Object.fromEntries(Object.entries(source.lumiCongratulationMessages).flatMap(([emotion, values]) => {
      if (!["calm", "happy", "tired", "sad", "stressed", "lazy", "proud", "focused", "hopeful", "overwhelmed", "sleepy", "excited", "lonely", "confident", "curious", "comeback"].includes(emotion) || !Array.isArray(values)) return [];
      const ids = new Set<string>();
      const messages = values.flatMap((value) => {
        const message = value && typeof value === "object" ? value as Partial<LumiCongratulationMessage> : null;
        const safeMessage = message ?? {};
        const id = typeof safeMessage.id === "string" && safeMessage.id.trim() ? safeMessage.id : "";
        const text = typeof safeMessage.text === "string" ? safeMessage.text.trim().slice(0, 320) : "";
        if (!id || !text || ids.has(id)) return [];
        ids.add(id);
        const createdAt = typeof safeMessage.createdAt === "string" && safeMessage.createdAt ? safeMessage.createdAt : new Date(0).toISOString();
        const audioUrl = typeof safeMessage.audioUrl === "string" && /^(data:audio\/|blob:|https?:\/\/|\/manus-storage\/)/i.test(safeMessage.audioUrl.trim()) ? safeMessage.audioUrl.trim() : undefined;
        const audioMimeType = typeof safeMessage.audioMimeType === "string" && safeMessage.audioMimeType.trim().startsWith("audio/") ? safeMessage.audioMimeType.trim().slice(0, 120) : undefined;
        const audioDurationSeconds = Number.isFinite(Number(safeMessage.audioDurationSeconds)) ? Math.max(0, Math.min(3_600, Number(safeMessage.audioDurationSeconds))) : undefined;
        return [{ id, text, createdAt, updatedAt: typeof safeMessage.updatedAt === "string" && safeMessage.updatedAt ? safeMessage.updatedAt : createdAt, ...(audioUrl ? { audioUrl } : {}), ...(audioMimeType ? { audioMimeType } : {}), ...(audioDurationSeconds !== undefined ? { audioDurationSeconds } : {}) }];
      }).slice(0, 30);
      return messages.length ? [[emotion, messages]] : [];
    })) as Partial<Record<EmotionThemeId, LumiCongratulationMessage[]>> : {},
    currentStreak: Math.max(0, Number(source.currentStreak) || 0),
    bestStreak: Math.max(0, Number(source.bestStreak) || 0),
    streakShields: Math.max(0, Math.min(3, Number(source.streakShields) || 0)),
    achievementMoments: [],
    characterProgress: source.characterProgress && typeof source.characterProgress === "object" ? Object.fromEntries(Object.entries(source.characterProgress).flatMap(([characterId, value]) => { const item = value && typeof value === "object" ? (value as Partial<CharacterProgress>) : {}; if (!characterId) return []; const collected = Array.isArray(item.collectedPieceIds) ? item.collectedPieceIds.map(String) : []; const used = Array.isArray(item.usedPieceIds) ? item.usedPieceIds.map(String) : []; const status: CharacterUnlockStatus = item.status === "unlocked" || item.status === "ready" || item.status === "assembling" ? item.status : collected.length ? "assembling" : "locked"; return [[characterId, { characterId, collectedPieceIds: Array.from(new Set(collected)), usedPieceIds: Array.from(new Set(used)), status, assembledAt: item.assembledAt ? String(item.assembledAt) : null, unlockedAt: item.unlockedAt ? String(item.unlockedAt) : null } as CharacterProgress]]; })) : {},
    pomodoroHistory: Array.isArray(source.pomodoroHistory) ? source.pomodoroHistory.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<PomodoroSession>) : null; if (!item?.id) return []; const checkedPlanItemIds = Array.isArray(item.checkedPlanItemIds) ? Array.from(new Set(item.checkedPlanItemIds.map(String).map((id) => id.trim()).filter(Boolean))).slice(0, 30) : undefined; const checkedPlanTitles = Array.isArray(item.checkedPlanTitles) ? Array.from(new Set(item.checkedPlanTitles.map(String).map((title) => title.trim().slice(0, 180)).filter(Boolean))).slice(0, 30) : undefined; return [{ id: String(item.id), startedAt: String(item.startedAt ?? new Date(0).toISOString()), endedAt: String(item.endedAt ?? new Date(0).toISOString()), durationMinutes: Math.max(1, Number(item.durationMinutes) || 1), subject: String(item.subject ?? ""), topic: String(item.topic ?? ""), activity: typeof item.activity === "string" && item.activity.trim() ? item.activity.trim().slice(0, 120) : undefined, notes: typeof item.notes === "string" && item.notes.trim() ? item.notes.trim().slice(0, 2_000) : undefined, checkedPlanItemIds, checkedPlanTitles, sessionNumber: Math.max(1, Number(item.sessionNumber) || 1), totalSessions: Math.max(1, Number(item.totalSessions) || 1), mode: item.mode === "shortBreak" || item.mode === "longBreak" ? item.mode : "focus", status: item.status === "abandoned" || item.status === "skipped" ? item.status : "completed", audioPresetId: item.audioPresetId ? String(item.audioPresetId) : undefined, audioPresetName: item.audioPresetName ? String(item.audioPresetName) : undefined, audioAmbientMix: item.audioAmbientMix && typeof item.audioAmbientMix === "object" ? { morning: Math.max(0, Math.min(100, Number(item.audioAmbientMix.morning) || 0)), storm: Math.max(0, Math.min(100, Number(item.audioAmbientMix.storm) || 0)) } : undefined }]; }) : [],
    aiImportHistory: Array.isArray(source.aiImportHistory) ? source.aiImportHistory.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<AiImportRecord>) : null; if (!item?.id || !item.title) return []; return [{ id: String(item.id), title: String(item.title), subject: typeof item.subject === "string" ? item.subject.trim().slice(0, 160) : undefined, purpose: typeof item.purpose === "string" ? item.purpose.trim().slice(0, 240) : undefined, grade: typeof item.grade === "string" ? item.grade.trim().slice(0, 80) : undefined, topic: typeof item.topic === "string" ? item.topic.trim().slice(0, 180) : undefined, course: typeof item.course === "string" ? item.course.trim().slice(0, 100) : undefined, educationLevel: EDUCATION_LEVELS.includes(item.educationLevel as EducationLevel) ? item.educationLevel as EducationLevel : undefined, difficulty: item.difficulty === "Cơ bản" || item.difficulty === "Nâng cao" ? item.difficulty : "Trung bình", createdAt: String(item.createdAt ?? new Date(0).toISOString()), target: item.target === "quiz" || item.target === "both" || item.target === "practice" ? item.target : "flashcards", questionCount: Math.max(0, Number(item.questionCount) || 0), flashcardCount: Math.max(0, Number(item.flashcardCount) || 0), prompt: String(item.prompt ?? ""), rawData: String(item.rawData ?? ""), quizId: item.quizId ? String(item.quizId) : undefined, flashcardSetId: item.flashcardSetId ? String(item.flashcardSetId) : undefined }]; }) : [],
    wrongAnswerReviews: Array.isArray(source.wrongAnswerReviews) ? source.wrongAnswerReviews.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<WrongAnswerReview>) : null; if (!item?.id || !item.attemptId || !item.questionId) return []; return [{ id: String(item.id), attemptId: String(item.attemptId), questionId: String(item.questionId), question: String(item.question ?? ""), learnerAnswer: String(item.learnerAnswer ?? ""), correctAnswer: String(item.correctAnswer ?? ""), whyWrong: String(item.whyWrong ?? ""), knowledgeGap: String(item.knowledgeGap ?? ""), correctThinking: Array.isArray(item.correctThinking) ? item.correctThinking.map(String) : [], commonMistake: String(item.commonMistake ?? ""), retryQuestion: String(item.retryQuestion ?? ""), retryAnswer: String(item.retryAnswer ?? ""), source: String(item.source ?? "Chưa cung cấp"), needsVerification: item.needsVerification === true, createdAt: String(item.createdAt ?? new Date(0).toISOString()) }]; }) : [],
  };
  merged.procrastinationEvents = Array.isArray(source.procrastinationEvents) ? source.procrastinationEvents : [];
  merged.avoidanceReasons = Array.isArray(source.avoidanceReasons) ? source.avoidanceReasons : [];
  merged.taskCombos = Array.isArray(source.taskCombos) ? source.taskCombos : [];
  merged.deepLearningEvents = Array.isArray(source.deepLearningEvents) ? source.deepLearningEvents : [];
  merged.achievementEvidence = {};
  merged.mascotVoiceLines = Array.isArray(source.mascotVoiceLines) ? source.mascotVoiceLines.flatMap((value) => { const item = value && typeof value === "object" ? (value as Partial<MascotVoiceLine>) : null; if (!item?.id || !item.text) return []; return [{ id: String(item.id), state: String(item.state ?? "achievement"), emotion: item.emotion ? String(item.emotion) as EmotionThemeId : undefined, text: String(item.text), audioUrl: item.audioUrl ? String(item.audioUrl) : undefined, source: item.source === "admin" ? "admin" : "learner", enabled: item.enabled !== false, createdAt: item.createdAt ? String(item.createdAt) : undefined, deletedAt: item.deletedAt ? String(item.deletedAt) : undefined }]; }) : [];
  merged.achievementRewardClaims = {};
  merged.level = 1;
  return merged;
}

export function limitFlashcards<T>(cards: T[], limit = 27): T[] {
  return cards.slice(0, Math.max(0, Math.min(27, limit)));
}
