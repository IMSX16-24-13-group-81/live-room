import { buildings } from "./data/buildings"
import type { Building, LineChartData, Room } from "./data/protocols"

export const getBuildingByID = (id: string): Building | undefined => {
  const matchingBuildings = buildings.filter((building) => building.id === id)
  if (matchingBuildings.length > 1 || matchingBuildings.length === 0) return undefined
  return matchingBuildings[0]
}

export const getRoomsByBuildingID = async (id: string): Promise<Room[]> => {
  try {
    const response = await fetch(`http://localhost:8080/api/rooms/${id}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const rooms: Room[] = await response.json()
    return rooms
  } catch (error) {
    console.error("There has been a problem with the fetch operation:", error)
    return []
  }
}

export const getAllRooms = async (): Promise<Room[]> => {
  try {
    const response = await fetch(`http://localhost:8080/api/all_rooms`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const rooms: Room[] = await response.json()
    return rooms
  } catch (error) {
    console.error("There has been a problem with the fetch operation:", error)
    return []
  }
}

export const truncateString = (str: string, num: number) => {
  if (str.length > num) {
    return str.slice(0, num) + "..."
  } else {
    return str
  }
}

export const createVector = (start: number, stop: number, numOfSteps: number, withStart: boolean = true, withEnd: boolean = true): number[] => {
  let vector: number[] = []
  const stepSize = (stop - start) / (numOfSteps - 1)
  for (let i = 0; i < numOfSteps; i++) {
    vector.push(start + i * stepSize)
  }
  if (!withStart) vector.shift()
  if (!withEnd) vector.pop()
  return vector
}

export const getExampleLineChartData = (): LineChartData => {
  return {
    room: {
      id: "1",
      buildingId: "1",
      name: "Example room",
      description: "Some description",
      isAvailable: true,
    },
    points: new Array(100).fill(0).map((_, i) => {
      return {
        time: new Date().getTime() + i * 86400 * 1000,
        y: Math.round(Math.random() * 8),
      }
    }),
  }
}
