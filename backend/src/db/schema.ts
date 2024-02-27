import { serial, text, pgTable } from 'drizzle-orm/pg-core';

export const building = pgTable('buildings', {
  id: serial('id'),
  name: text('name'),
  description: text('description')
});
