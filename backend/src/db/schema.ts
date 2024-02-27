import { serial, text, pgTable } from "drizzle-orm/pg-core"

export const buildings = pgTable("buildings", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
})
