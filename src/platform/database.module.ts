import { Global, Module } from '@nestjs/common';
import { DatabaseLifecycle } from './database-lifecycle.js';
import { createDatabase } from './database.provider.js';
import { DATABASE, DATABASE_HANDLE } from './database.tokens.js';
import type { DatabaseHandle } from './database.types.js';

@Global()
@Module({
  providers: [
    { provide: DATABASE_HANDLE, useFactory: () => createDatabase() },
    { provide: DATABASE, useFactory: (handle: DatabaseHandle) => handle.db, inject: [DATABASE_HANDLE] },
    DatabaseLifecycle,
  ],
  exports: [DATABASE, DATABASE_HANDLE],
})
export class DatabaseModule {}
