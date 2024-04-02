import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type OurPGDatabase = NodePgDatabase<typeof import('./db/schema')>;

export interface OccupantsWebsocketMessage {
  // sensorID should probabily be roomID in the future
  sensorId: string;
  occupants: number;
}

export enum RoomStatus {
  Occupied = 'occupied',
  Empty = 'empty',
  Unknown = 'unknown'
}

export interface SimplifiedRoomState {
  roomId: string;
  state: RoomStatus;
  occupants: number;
}

export interface SensorState {
  sensorId: string,
  occupants: number,
  reportedAt: Date
}
