import type { Config } from "drizzle-kit"

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
} satisfies Config
