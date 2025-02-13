// src/database/drizzle.config.ts
import { drizzle } from 'drizzle-orm/sqlite3';
import { Database } from 'sqlite3';
import * as schema from './schemas/notification.schema';

const sqlite = new Database('./notifications.db');
export const db = drizzle(sqlite, { schema });
