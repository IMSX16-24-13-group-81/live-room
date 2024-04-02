import { serial, text, pgTable } from 'drizzle-orm/pg-core';

export const buildings = pgTable('buildings', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description')
});

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  name: text('name'),
  coordiates: text('coordiates')
});

export const sensors = pgTable('sensors', {
  id: text('id').primaryKey(),
  room: serial('room').references(() => rooms.id),
});
