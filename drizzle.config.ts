import { defineConfig } from 'drizzle-kit';

// Tables live in each context: src/contexts/<ctx>/infrastructure/schema/*.schema.ts
// `npm run db:generate` writes the SQL migrations to drizzle/ (the same files serve PGlite and PostgreSQL).
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/contexts/*/infrastructure/schema/*.schema.ts',
  out: './drizzle',
});
