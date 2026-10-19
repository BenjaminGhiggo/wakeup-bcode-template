import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { sql } from 'drizzle-orm';
import { DATABASE_HANDLE } from './database.tokens.js';
import type { DatabaseHandle } from './database.types.js';
import { HealthResponseDto } from './health.dto.js';

/** Platform-level endpoint (no business context): service and database health. */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@Inject(DATABASE_HANDLE) private readonly handle: DatabaseHandle) {}

  @Get()
  @ApiOperation({ summary: 'Service and database health' })
  @ApiOkResponse({ type: HealthResponseDto })
  async get(): Promise<HealthResponseDto> {
    const databaseReachable = await this.handle.db.execute(sql`select 1`).then(
      () => true,
      () => false,
    );

    return { status: databaseReachable ? 'ok' : 'degraded', database: this.handle.mode, databaseReachable };
  }
}
