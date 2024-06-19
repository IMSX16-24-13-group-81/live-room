import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString:
      process.env.PG_CONNECTION_STRING ||
      'postgresql://postgres:123@127.0.0.1:5432/liveinfo'
  }
} satisfies Config;
