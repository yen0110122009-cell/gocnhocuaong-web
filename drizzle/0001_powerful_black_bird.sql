CREATE TABLE `ai_flashcard_sets` (
	`id` varchar(64) NOT NULL,
	`accountId` varchar(64) NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`sourceDocumentUrl` text,
	`cardCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_flashcard_sets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_flashcards` (
	`id` varchar(64) NOT NULL,
	`setId` varchar(64) NOT NULL,
	`front` text NOT NULL,
	`back` text NOT NULL,
	`ordinal` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_flashcards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_quiz_questions` (
	`id` varchar(64) NOT NULL,
	`setId` varchar(64) NOT NULL,
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correctOptionIndex` int NOT NULL,
	`explanation` text,
	`ordinal` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_quiz_sets` (
	`id` varchar(64) NOT NULL,
	`accountId` varchar(64) NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`sourceDocumentUrl` text,
	`questionCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_quiz_sets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pomodoro_sessions` (
	`id` varchar(64) NOT NULL,
	`accountId` varchar(64) NOT NULL,
	`durationMinutes` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`taskDescription` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pomodoro_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_accounts` (
	`id` varchar(64) NOT NULL,
	`name` varchar(120) NOT NULL,
	`normalizedName` varchar(160) NOT NULL,
	`code` varchar(48) NOT NULL,
	`role` enum('Member','Admin','Founder') NOT NULL DEFAULT 'Member',
	`passwordHash` text,
	`locked` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `study_accounts_normalizedName_unique` UNIQUE(`normalizedName`),
	CONSTRAINT `study_accounts_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `study_achievement_catalog` (
	`id` varchar(96) NOT NULL,
	`rank` int NOT NULL,
	`rankName` varchar(80) NOT NULL,
	`icon` varchar(32) NOT NULL,
	`name` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`metric` varchar(48) NOT NULL,
	`threshold` int NOT NULL,
	`rewardXp` int NOT NULL,
	`rewardFragments` int NOT NULL,
	`titleId` varchar(96),
	`titleMeaning` text,
	`difficulty` varchar(32) NOT NULL,
	`badgeLabel` varchar(120) NOT NULL,
	`encouragement` text NOT NULL,
	`animation` varchar(32) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_achievement_catalog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_achievement_progress` (
	`accountId` varchar(64) NOT NULL,
	`achievementId` varchar(96) NOT NULL,
	`progress` int NOT NULL DEFAULT 0,
	`unlockedAt` timestamp,
	`claimedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_achievement_progress_pk` PRIMARY KEY(`accountId`,`achievementId`)
);
--> statement-breakpoint
CREATE TABLE `study_audit_logs` (
	`id` varchar(64) NOT NULL,
	`actorAccountId` varchar(64),
	`targetAccountId` varchar(64),
	`action` varchar(64) NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityId` varchar(128),
	`beforeData` text,
	`afterData` text,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `study_audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_history` (
	`id` varchar(64) NOT NULL,
	`accountId` varchar(64) NOT NULL,
	`activityType` varchar(64) NOT NULL,
	`activityId` varchar(128),
	`xpEarned` int NOT NULL DEFAULT 0,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `study_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_piece_transactions` (
	`id` varchar(64) NOT NULL,
	`accountId` varchar(64) NOT NULL,
	`pieceTypeId` varchar(96) NOT NULL,
	`delta` int NOT NULL,
	`kind` varchar(32) NOT NULL,
	`idempotencyKey` varchar(160) NOT NULL,
	`referenceType` varchar(64),
	`referenceId` varchar(128),
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `study_piece_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `study_piece_transactions_idempotency_idx` UNIQUE(`accountId`,`idempotencyKey`)
);
--> statement-breakpoint
CREATE TABLE `study_piece_types` (
	`id` varchar(96) NOT NULL,
	`name` varchar(120) NOT NULL,
	`ordinal` int NOT NULL,
	`unitValue` int NOT NULL DEFAULT 1,
	`enabled` boolean NOT NULL DEFAULT true,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_piece_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_profiles` (
	`accountId` varchar(64) NOT NULL,
	`data` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_profiles_accountId` PRIMARY KEY(`accountId`)
);
--> statement-breakpoint
CREATE TABLE `study_sessions` (
	`tokenHash` varchar(64) NOT NULL,
	`accountId` varchar(64) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `study_sessions_tokenHash` PRIMARY KEY(`tokenHash`)
);
--> statement-breakpoint
CREATE TABLE `study_settings` (
	`id` varchar(40) NOT NULL,
	`data` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `study_title_catalog` (
	`id` varchar(96) NOT NULL,
	`achievementId` varchar(96) NOT NULL,
	`name` varchar(180) NOT NULL,
	`meaning` text NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`deletedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_title_catalog_id` PRIMARY KEY(`id`),
	CONSTRAINT `study_title_achievement_idx` UNIQUE(`achievementId`)
);
--> statement-breakpoint
CREATE TABLE `study_user_pieces` (
	`accountId` varchar(64) NOT NULL,
	`pieceTypeId` varchar(96) NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_user_pieces_pk` PRIMARY KEY(`accountId`,`pieceTypeId`)
);
--> statement-breakpoint
ALTER TABLE `ai_flashcard_sets` ADD CONSTRAINT `ai_flashcard_sets_accountId_study_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_flashcards` ADD CONSTRAINT `ai_flashcards_setId_ai_flashcard_sets_id_fk` FOREIGN KEY (`setId`) REFERENCES `ai_flashcard_sets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_quiz_questions` ADD CONSTRAINT `ai_quiz_questions_setId_ai_quiz_sets_id_fk` FOREIGN KEY (`setId`) REFERENCES `ai_quiz_sets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ai_quiz_sets` ADD CONSTRAINT `ai_quiz_sets_accountId_study_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pomodoro_sessions` ADD CONSTRAINT `pomodoro_sessions_accountId_study_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_achievement_progress` ADD CONSTRAINT `study_achievement_progress_accountId_study_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_achievement_progress` ADD CONSTRAINT `study_achievement_progress_achievementId_study_achievement_catalog_id_fk` FOREIGN KEY (`achievementId`) REFERENCES `study_achievement_catalog`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_audit_logs` ADD CONSTRAINT `study_audit_logs_actorAccountId_study_accounts_id_fk` FOREIGN KEY (`actorAccountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_audit_logs` ADD CONSTRAINT `study_audit_logs_targetAccountId_study_accounts_id_fk` FOREIGN KEY (`targetAccountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_history` ADD CONSTRAINT `study_history_accountId_study_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_piece_transactions` ADD CONSTRAINT `study_piece_transactions_accountId_study_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_piece_transactions` ADD CONSTRAINT `study_piece_transactions_pieceTypeId_study_piece_types_id_fk` FOREIGN KEY (`pieceTypeId`) REFERENCES `study_piece_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_title_catalog` ADD CONSTRAINT `study_title_catalog_achievementId_study_achievement_catalog_id_fk` FOREIGN KEY (`achievementId`) REFERENCES `study_achievement_catalog`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_user_pieces` ADD CONSTRAINT `study_user_pieces_accountId_study_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_user_pieces` ADD CONSTRAINT `study_user_pieces_pieceTypeId_study_piece_types_id_fk` FOREIGN KEY (`pieceTypeId`) REFERENCES `study_piece_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `study_achievement_rank_idx` ON `study_achievement_catalog` (`rank`);--> statement-breakpoint
CREATE INDEX `study_achievement_title_idx` ON `study_achievement_catalog` (`titleId`);--> statement-breakpoint
CREATE INDEX `study_achievement_progress_account_idx` ON `study_achievement_progress` (`accountId`);--> statement-breakpoint
CREATE INDEX `study_audit_logs_target_idx` ON `study_audit_logs` (`targetAccountId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `study_audit_logs_entity_idx` ON `study_audit_logs` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `study_piece_transactions_account_idx` ON `study_piece_transactions` (`accountId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `study_piece_types_ordinal_idx` ON `study_piece_types` (`ordinal`);--> statement-breakpoint
CREATE INDEX `study_user_pieces_account_idx` ON `study_user_pieces` (`accountId`);