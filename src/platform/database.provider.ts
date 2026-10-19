import { fileURLToPath } from 'node:url';
import type { DatabaseHandle } from './database.types.js';
import { runSeeders } from './seed.js';

export const MIGRATIONS_DIR = fileURLToPath(new URL('../../drizzle', import.meta.url));

/*
 * Composition root of persistence. The environment decides, nothing else changes (same Drizzle code, same SQL):
 *   DATABASE_URL       -> PostgreSQL over TCP (node-postgres)
 *   DATABASE_HTTP_URL  -> PostgreSQL behind an HTTP bridge (drizzle pg-proxy; bearer DATABASE_HTTP_TOKEN)
 *   neither            -> PGlite (PostgreSQL in WASM), in memory, migrations applied at startup + seed hook
 * Drivers are imported lazily, so an unused driver is never loaded (WebContainer runs PGlite only).
 */
export async function createDatabase(env: NodeJS.ProcessEnv = process.env): Promise<DatabaseHandle> {
  if (env.DATABASE_URL) {
    return createPostgres(env.DATABASE_URL);
  }

  if (env.DATABASE_HTTP_URL) {
    return createHttp(env.DATABASE_HTTP_URL, env.DATABASE_HTTP_TOKEN);
  }

  return createPglite();
}

async function createPostgres(connectionString: string): Promise<DatabaseHandle> {
  const { default: pg } = await import('pg');
  const { drizzle } = await import('drizzle-orm/node-postgres');
  const pool = new pg.Pool({ connectionString });

  return { db: drizzle(pool), mode: 'postgres', close: () => pool.end() };
}

async function createHttp(url: string, token: string | undefined): Promise<DatabaseHandle> {
  const { drizzle } = await import('drizzle-orm/pg-proxy');

  /* Bridge contract: POST { sql, params, method } -> 200 { rows }. For method "all" every row is an array of values. */
  const db = drizzle(async (sql, params, method) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ sql, params, method }),
    });

    if (!response.ok) {
      throw new Error(`Database bridge answered ${response.status}: ${await response.text()}`);
    }

    const { rows } = (await response.json()) as { rows: unknown[] };

    return { rows };
  });

  return { db, mode: 'http', close: async () => undefined };
}

async function createPglite(): Promise<DatabaseHandle> {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const client = new PGlite();
  const db = drizzle(client);

  await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
  await runSeeders(db);

  return { db, mode: 'pglite', close: () => client.close() };
}
