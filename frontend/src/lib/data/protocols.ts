export interface Building {
  id: string
  name: string
  description: string
  address: string
}

export enum RoomStatus {
  Unknown = 0,
  Occupied = 1,
  Empty = 2
}

export interface Room {
  id: string;
  buildingId: string;
  name: string;
  description: string;
  state: RoomStatus;
}

export interface Point {
  time: number //Integer since 1970 in milliseconds
  y: number //Number of people in a room as an integer
}

export interface LineChartData {
  points: Point[]
}
