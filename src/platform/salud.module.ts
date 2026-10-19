import { Module } from '@nestjs/common';
import { CheckHealthUseCase } from '../contexts/salud/application/use-cases/check-health.use-case.js';
import { DatabaseProbe } from '../contexts/salud/domain/ports/database-probe.port.js';
import { DatabaseProbeAdapter } from '../contexts/salud/infrastructure/adapters/database-probe.adapter.js';
import { HealthController } from '../contexts/salud/presentation/http/health.controller.js';
import { DATABASE } from './database.module.js';
import type { AppDatabase } from './database.provider.js';

/** Wiring of the salud context: the only place where ports meet adapters. Domain and application stay free of Nest. */
@Module({
  controllers: [HealthController],
  providers: [
    { provide: DatabaseProbe, useFactory: (db: AppDatabase) => new DatabaseProbeAdapter(db), inject: [DATABASE] },
    { provide: CheckHealthUseCase, useFactory: (probe: DatabaseProbe) => new CheckHealthUseCase(probe), inject: [DatabaseProbe] },
  ],
})
export class SaludModule {}
