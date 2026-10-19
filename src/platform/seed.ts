import type { AppDatabase } from './database.types.js';

export type Seeder = (db: AppDatabase) => Promise<void>;

/** Development data for the in-memory PGlite database (never runs against PostgreSQL). Add one seeder per context. */
export const SEEDERS: Seeder[] = [];

export async function runSeeders(db: AppDatabase): Promise<void> {
  for (const seed of SEEDERS) {
    await seed(db);
  }
}
