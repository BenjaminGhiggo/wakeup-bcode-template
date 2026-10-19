import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckHealthUseCase } from '../../application/use-cases/check-health.use-case.js';
import { HealthResponseDto } from './health.dto.js';

@ApiTags('salud')
@Controller('health')
export class HealthController {
  constructor(private readonly checkHealth: CheckHealthUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Service and database health' })
  @ApiOkResponse({ type: HealthResponseDto })
  get(): Promise<HealthResponseDto> {
    return this.checkHealth.execute();
  }
}
