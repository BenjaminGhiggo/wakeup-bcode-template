import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module.js';
import { SaludModule } from './salud.module.js';

/** Add one module per bounded context here (src/platform/<ctx>.module.ts). */
@Module({ imports: [DatabaseModule, SaludModule] })
export class AppModule {}
