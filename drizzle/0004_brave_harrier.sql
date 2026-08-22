ALTER TABLE `study_accounts` ADD `lastActiveAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `study_accounts` ADD `lastSignedOutAt` timestamp;