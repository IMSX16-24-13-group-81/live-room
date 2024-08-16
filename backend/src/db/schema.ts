import { serial, text, pgTable, numeric } from 'drizzle-orm/pg-core';

export const buildings = pgTable('buildings', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description')
});

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  building: serial('building').references(() => buildings.id),
  name: text('name'),
  coordinates: text('coordinates'),
  description: text('description')
});

export const sensors = pgTable('sensors', {
  id: text('id').primaryKey(),
  room: serial('room').references(() => rooms.id)
});

export const bigrooms = pgTable('bigrooms', {
  id: serial('id').primaryKey().references(() => rooms.id),
  buildings: serial('buildings').references(() => buildings.id),
  name: text('name'),
  places: numeric('places'),
  coordinates: text('coordinates'),
  description: text('description')
});