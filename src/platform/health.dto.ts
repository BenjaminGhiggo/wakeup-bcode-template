import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ enum: ['ok', 'degraded'], example: 'ok' })
  status!: 'ok' | 'degraded';

  @ApiProperty({ enum: ['pglite', 'postgres', 'http'], description: 'Active database driver', example: 'pglite' })
  database!: 'pglite' | 'postgres' | 'http';

  @ApiProperty({ description: 'Whether the database answered a query', example: true })
  databaseReachable!: boolean;
}
