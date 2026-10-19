import { sql } from 'drizzle-orm';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { DatabaseProbe } from '../../domain/ports/database-probe.port.js';

export class DatabaseProbeAdapter extends DatabaseProbe {
  constructor(private readonly db: PgDatabase<PgQueryResultHKT>) {
    super();
  }

  async ping(): Promise<boolean> {
    await this.db.execute(sql`select 1`);

    return true;
  }
}
