import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module.js';
import { HealthModule } from './health.module.js';

/** Add one module per bounded context here (src/platform/<ctx>.module.ts), next to DatabaseModule and HealthModule. */
@Module({ imports: [DatabaseModule, HealthModule] })
export class AppModule {}
