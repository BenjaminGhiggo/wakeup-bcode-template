import { Global, Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { createDatabase, type DatabaseHandle } from './database.provider.js';

export const DATABASE_HANDLE = 'DATABASE_HANDLE';
export const DATABASE = 'DATABASE';

class DatabaseLifecycle implements OnApplicationShutdown {
  constructor(@Inject(DATABASE_HANDLE) private readonly handle: DatabaseHandle) {}

  onApplicationShutdown(): Promise<void> {
    return this.handle.close();
  }
}

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
