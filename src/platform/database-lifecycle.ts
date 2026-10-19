import { Inject, type OnApplicationShutdown } from '@nestjs/common';
import { DATABASE_HANDLE } from './database.tokens.js';
import type { DatabaseHandle } from './database.types.js';

export class DatabaseLifecycle implements OnApplicationShutdown {
  constructor(@Inject(DATABASE_HANDLE) private readonly handle: DatabaseHandle) {}

  onApplicationShutdown(): Promise<void> {
    return this.handle.close();
  }
}
