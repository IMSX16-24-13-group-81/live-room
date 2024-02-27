import { serial, text, boolean, pgTable } from 'drizzle-orm/pg-core';

export const buildings = pgTable('buildings', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description')
});

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  name: text('name'),
  coordiates: text('coordiates'),
  available: boolean('available')
});
