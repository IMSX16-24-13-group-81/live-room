import { serial, text, pgTable } from 'drizzle-orm/pg-core';

export const buildings = pgTable('buildings', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description')
});

export const rooms = pgTable('rooms', {
  name: text('name').primaryKey(),
  building: serial('building').references(() => buildings.id),
  coordinates: text('coordinates'),
  description: text('description')
});

export const sensors = pgTable('sensors', {
  id: text('id').primaryKey(),
  room: serial('room').references(() => rooms.name),
});
