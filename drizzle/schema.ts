import { boolean, index, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const studyAccounts = mysqlTable("study_accounts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  normalizedName: varchar("normalizedName", { length: 160 }).notNull().unique(),
  code: varchar("code", { length: 48 }).notNull().unique(),
  role: mysqlEnum("role", ["Member", "Admin", "Founder"]).notNull().default("Member"),
  passwordHash: text("passwordHash"),
  locked: boolean("locked").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const studyProfiles = mysqlTable("study_profiles", {
  accountId: varchar("accountId", { length: 64 }).primaryKey(),
  data: text("data").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
});

export const studySessions = mysqlTable("study_sessions", {
  tokenHash: varchar("tokenHash", { length: 64 }).primaryKey(),
  accountId: varchar("accountId", { length: 64 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const studySettings = mysqlTable("study_settings", {
  id: varchar("id", { length: 40 }).primaryKey(),
  data: text("data").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().onUpdateNow(),
});

export const studyAchievementCatalog = mysqlTable("study_achievement_catalog", {
  id: varchar("id", { length: 96 }).primaryKey(),
  rank: int("rank").notNull(),
  rankName: varchar("rankName", { length: 80 }).notNull(),
  icon: varchar("icon", { length: 32 }).notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description").notNull(),
  metric: varchar("metric", { length: 48 }).notNull(),
  threshold: int("threshold").notNull(),
  rewardXp: int("rewardXp").notNull(),
  rewardFragments: int("rewardFragments").notNull(),
  titleId: varchar("titleId", { length: 96 }),
  titleMeaning: text("titleMeaning"),
  difficulty: varchar("difficulty", { length: 32 }).notNull(),
  badgeLabel: varchar("badgeLabel", { length: 120 }).notNull(),
  encouragement: text("encouragement").notNull(),
  animation: varchar("animation", { length: 32 }).notNull(),
  enabled: boolean("enabled").notNull().default(true),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ rankIdx: index("study_achievement_rank_idx").on(table.rank), titleIdx: index("study_achievement_title_idx").on(table.titleId) }));

export const studyTitleCatalog = mysqlTable("study_title_catalog", {
  id: varchar("id", { length: 96 }).primaryKey(),
  achievementId: varchar("achievementId", { length: 96 }).notNull().references(() => studyAchievementCatalog.id),
  name: varchar("name", { length: 180 }).notNull(),
  meaning: text("meaning").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ achievementIdx: uniqueIndex("study_title_achievement_idx").on(table.achievementId) }));

export const studyAchievementProgress = mysqlTable("study_achievement_progress", {
  accountId: varchar("accountId", { length: 64 }).notNull().references(() => studyAccounts.id),
  achievementId: varchar("achievementId", { length: 96 }).notNull().references(() => studyAchievementCatalog.id),
  progress: int("progress").notNull().default(0),
  unlockedAt: timestamp("unlockedAt"),
  claimedAt: timestamp("claimedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  primary: primaryKey({ columns: [table.accountId, table.achievementId], name: "study_achievement_progress_pk" }),
  accountIdx: index("study_achievement_progress_account_idx").on(table.accountId),
}));

export const studyPieceTypes = mysqlTable("study_piece_types", {
  id: varchar("id", { length: 96 }).primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  ordinal: int("ordinal").notNull(),
  unitValue: int("unitValue").notNull().default(1),
  enabled: boolean("enabled").notNull().default(true),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ ordinalIdx: index("study_piece_types_ordinal_idx").on(table.ordinal) }));

export const studyUserPieces = mysqlTable("study_user_pieces", {
  accountId: varchar("accountId", { length: 64 }).notNull().references(() => studyAccounts.id),
  pieceTypeId: varchar("pieceTypeId", { length: 96 }).notNull().references(() => studyPieceTypes.id),
  balance: int("balance").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  primary: primaryKey({ columns: [table.accountId, table.pieceTypeId], name: "study_user_pieces_pk" }),
  accountIdx: index("study_user_pieces_account_idx").on(table.accountId),
}));

export const studyPieceTransactions = mysqlTable("study_piece_transactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  accountId: varchar("accountId", { length: 64 }).notNull().references(() => studyAccounts.id),
  pieceTypeId: varchar("pieceTypeId", { length: 96 }).notNull().references(() => studyPieceTypes.id),
  delta: int("delta").notNull(),
  kind: varchar("kind", { length: 32 }).notNull(),
  idempotencyKey: varchar("idempotencyKey", { length: 160 }).notNull(),
  referenceType: varchar("referenceType", { length: 64 }),
  referenceId: varchar("referenceId", { length: 128 }),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  idempotencyIdx: uniqueIndex("study_piece_transactions_idempotency_idx").on(table.accountId, table.idempotencyKey),
  accountIdx: index("study_piece_transactions_account_idx").on(table.accountId, table.createdAt),
}));

export const studyAuditLogs = mysqlTable("study_audit_logs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  actorAccountId: varchar("actorAccountId", { length: 64 }).references(() => studyAccounts.id),
  targetAccountId: varchar("targetAccountId", { length: 64 }).references(() => studyAccounts.id),
  action: varchar("action", { length: 64 }).notNull(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: varchar("entityId", { length: 128 }),
  beforeData: text("beforeData"),
  afterData: text("afterData"),
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  targetIdx: index("study_audit_logs_target_idx").on(table.targetAccountId, table.createdAt),
  entityIdx: index("study_audit_logs_entity_idx").on(table.entityType, table.entityId),
}));

export const aiFlashcardSets = mysqlTable("ai_flashcard_sets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  accountId: varchar("accountId", { length: 64 }).notNull().references(() => studyAccounts.id),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  sourceDocumentUrl: text("sourceDocumentUrl"),
  cardCount: int("cardCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const aiFlashcards = mysqlTable("ai_flashcards", {
  id: varchar("id", { length: 64 }).primaryKey(),
  setId: varchar("setId", { length: 64 }).notNull().references(() => aiFlashcardSets.id),
  front: text("front").notNull(),
  back: text("back").notNull(),
  ordinal: int("ordinal").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const aiQuizSets = mysqlTable("ai_quiz_sets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  accountId: varchar("accountId", { length: 64 }).notNull().references(() => studyAccounts.id),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  sourceDocumentUrl: text("sourceDocumentUrl"),
  questionCount: int("questionCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const aiQuizQuestions = mysqlTable("ai_quiz_questions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  setId: varchar("setId", { length: 64 }).notNull().references(() => aiQuizSets.id),
  question: text("question").notNull(),
  options: text("options").notNull(), // JSON array
  correctOptionIndex: int("correctOptionIndex").notNull(),
  explanation: text("explanation"),
  ordinal: int("ordinal").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const pomodoroSessions = mysqlTable("pomodoro_sessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  accountId: varchar("accountId", { length: 64 }).notNull().references(() => studyAccounts.id),
  durationMinutes: int("durationMinutes").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  taskDescription: text("taskDescription"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const studyHistory = mysqlTable("study_history", {
  id: varchar("id", { length: 64 }).primaryKey(),
  accountId: varchar("accountId", { length: 64 }).notNull().references(() => studyAccounts.id),
  activityType: varchar("activityType", { length: 64 }).notNull(),
  activityId: varchar("activityId", { length: 128 }),
  xpEarned: int("xpEarned").notNull().default(0),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
