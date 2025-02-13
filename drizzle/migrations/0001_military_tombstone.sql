PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`external_id` text NOT NULL,
	`channel` text NOT NULL,
	`to` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'processing' NOT NULL,
	`timestamp` text DEFAULT '2025-02-13T04:18:06.513Z'
);
--> statement-breakpoint
INSERT INTO `__new_notifications`("id", "external_id", "channel", "to", "body", "status", "timestamp") SELECT "id", "external_id", "channel", "to", "body", "status", "timestamp" FROM `notifications`;--> statement-breakpoint
DROP TABLE `notifications`;--> statement-breakpoint
ALTER TABLE `__new_notifications` RENAME TO `notifications`;--> statement-breakpoint
PRAGMA foreign_keys=ON;