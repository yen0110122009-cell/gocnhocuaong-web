CREATE TABLE `study_companion_draft_versions` (
	`id` varchar(64) NOT NULL,
	`accountId` varchar(64) NOT NULL,
	`version` int NOT NULL,
	`data` text NOT NULL,
	`deviceLabel` varchar(120),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `study_companion_draft_versions_id` PRIMARY KEY(`id`),
	CONSTRAINT `study_companion_draft_versions_account_version_idx` UNIQUE(`accountId`,`version`)
);
--> statement-breakpoint
CREATE TABLE `study_companion_drafts` (
	`accountId` varchar(64) NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`data` text NOT NULL,
	`deviceLabel` varchar(120),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `study_companion_drafts_accountId` PRIMARY KEY(`accountId`)
);
--> statement-breakpoint
ALTER TABLE `study_companion_draft_versions` ADD CONSTRAINT `study_companion_draft_versions_accountId_study_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `study_companion_drafts` ADD CONSTRAINT `study_companion_drafts_accountId_study_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `study_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `study_companion_draft_versions_account_created_idx` ON `study_companion_draft_versions` (`accountId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `study_companion_drafts_version_idx` ON `study_companion_drafts` (`version`);