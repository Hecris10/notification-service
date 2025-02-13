import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';

// Define Zod schema for validation
export const NotificationSchema = z.object({
  id: z.string().min(3),
  externalId: z.string().min(3),
  channel: z.enum(['sms', 'whatsApp']),
  to: z.string().min(10),
  body: z.string().min(1),
  status: z
    .enum(['processing', 'rejected', 'sent', 'delivered', 'viewed'])
    .default('processing'), // Set default status
  timestamp: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
});

// Define Drizzle Table Schema
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  externalId: text('external_id').notNull(),
  channel: text('channel').notNull(),
  to: text('to').notNull(),
  body: text('body').notNull(),
  status: text('status').notNull().default('processing'), // Set default in database
  timestamp: text('timestamp').default(new Date().toISOString()),
});
