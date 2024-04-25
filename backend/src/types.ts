import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type OurPGDatabase = NodePgDatabase<typeof import('./db/schema')>;

export interface OccupantsWebsocketMessage {
  // sensorID should probabily be roomID in the future
  sensorId: string;
  occupants: number;
}

export enum RoomStatus {
  Unknown = 0,
  Occupied = 1,
  Empty = 2
}

export interface SimplifiedRoomState {
  id: string;
  buildingId: string;
  name: string;
  description: string | undefined;
  state: RoomStatus;
}

export interface RoomState {
  roomId: string;
  occupants: number;
}

export interface SensorState<T> {
  sensorId: string;
  reportedAt: Date;
  state: T;
}

export interface PirSensorState {
  sensorId: string;
  state: boolean;
}
