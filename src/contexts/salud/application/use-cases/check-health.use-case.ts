import { DatabaseProbe } from '../../domain/ports/database-probe.port.js';

export interface HealthReport {
  status: 'ok' | 'degraded';
  database: boolean;
}

export class CheckHealthUseCase {
  constructor(private readonly probe: DatabaseProbe) {}

  async execute(): Promise<HealthReport> {
    const database = await this.probe.ping().catch(() => false);

    return { status: database ? 'ok' : 'degraded', database };
  }
}
