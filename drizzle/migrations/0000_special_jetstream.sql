CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`external_id` text NOT NULL,
	`channel` text NOT NULL,
	`to` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'processing' NOT NULL,
	`timestamp` text DEFAULT '2025-02-13T04:16:27.301Z'
);
