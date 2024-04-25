import { buildings } from "./data/buildings"
import type { Building, LineChartData, Point, Room } from "./data/protocols"
import { env } from "$env/dynamic/public"

export const getBuildingByID = (id: string): Building | undefined => {
  const matchingBuildings = buildings.filter((building) => building.id === id)
  if (matchingBuildings.length > 1 || matchingBuildings.length === 0) return undefined
  return matchingBuildings[0]
}

export const getRoomsByBuildingID = async (id: string): Promise<Room[]> => {
  const backendURL = env.PUBLIC_BACKEND_URL || undefined

  try {
    const response = await fetch(`${backendURL}/api/rooms/${id}`)

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
  const backendURL = env.PUBLIC_BACKEND_URL || undefined

  try {
    const response = await fetch(`${backendURL}/api/rooms`)

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

export const getDataPointsForRoom = async (id: string): Promise<Point[]> => {
  const backendURL = env.PUBLIC_BACKEND_URL || undefined

  try {
    const response = await fetch(`${backendURL}/api/rooms/occupants/history/${id}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const points: Point[] = await response.json()
    return points
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

export const createVector = (
  start: number,
  stop: number,
  numOfSteps: number,
  withStart: boolean = true,
  withEnd: boolean = true
): number[] => {
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
  const numPoints = 100
  return {
    points: new Array(100).fill(0).map((_, i) => {
      return {
        time: new Date().getTime() + i * 86400 * 1000,
        y: 1 + Math.round((1 + Math.sin(((2 * Math.PI * i) / numPoints) * 5)) * 8 * Math.random()),
      }
    }),
  }
}

//Binary search to find point

export const findIndex = (list: number[], value: number): number => {
  let start = 0
  let end = list.length - 1

  while (true) {
    const middleIndex = Math.floor((start + end) / 2)
    const middleValue = list[middleIndex]
    if (start == end) return middleIndex
    if (middleValue >= value) {
      end = middleIndex
    } else {
      start = middleIndex + 1
    }
  }
}

export const formatDateTime = (date: Date) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayName = days[date.getDay()]
  const monthName = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${dayName}, ${monthName} ${day}, ${year} ${hours}:${minutes}`
}
