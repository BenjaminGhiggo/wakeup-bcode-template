import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';

export type AppDatabase = PgDatabase<PgQueryResultHKT>;
export type DatabaseMode = 'postgres' | 'http' | 'pglite';

export interface DatabaseHandle {
  db: AppDatabase;
  mode: DatabaseMode;
  close: () => Promise<void>;
}
