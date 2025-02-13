import { createClient } from '@libsql/client';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Create database client
const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN, // Required for remote DBs like Turso
});

// Initialize Drizzle ORM
export const db = drizzle(client, { schema });
