import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

/** OpenAPI contract at /openapi.json and the interactive Scalar client at /docs (outside the /api prefix). */
export function setupOpenApi(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Generated from the controllers and DTOs')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.getHttpAdapter().get('/openapi.json', (_request: unknown, response: { json: (body: unknown) => void }) => {
    response.json(document);
  });
  app.getHttpAdapter().get('/', (_request: unknown, response: { redirect: (url: string) => void }) => {
    response.redirect('/docs'); // the preview of a bare API opens on its documentation
  });
  app.use('/docs', apiReference({ content: document }));
}
