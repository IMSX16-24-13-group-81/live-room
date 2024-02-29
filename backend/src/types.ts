import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type OurPGDatabase = NodePgDatabase<
  typeof import('/Users/hugoolsson/Documents/Skola/Kandidatarbete/live-room/backend/src/db/schema')
>;

export interface OccupantsWebsocketMessage {
  // sensorID should probabily be roomID in the future
  sensorId: string;
  occupants: number;
}
