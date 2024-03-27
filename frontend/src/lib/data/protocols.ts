export interface Building {
  id: string
  name: string
  description: string
  address: string
}

export interface Room {
  id: string
  buildingId: string
  name: string
  description: string
  isAvailable: boolean
}

export interface Point {
  time: number //Integer since 1970 in milliseconds
  y: number //Number of people in a room as an integer
}

export interface LineChartData {
  points: Point[]
  room: Room
}
