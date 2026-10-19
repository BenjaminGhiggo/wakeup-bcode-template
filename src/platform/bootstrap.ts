import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DomainErrorFilter } from './domain-error.filter.js';
import { setupOpenApi } from './openapi.js';

export async function bootstrap(): Promise<void> {
  // CORS stays off: in production the frontend and this API share one origin behind the gateway.
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainErrorFilter());
  app.enableShutdownHooks();
  setupOpenApi(app);

  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port, '0.0.0.0');
  console.log(`API on http://localhost:${port}/api  |  docs http://localhost:${port}/docs`);
}
