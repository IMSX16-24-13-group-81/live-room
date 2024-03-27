import { buildings } from "./data/buildings"
import type { Building } from "./data/protocols"

export const getBuildingByID = (id: string): Building | undefined => {
  const matchingBuildings = buildings.filter((building) => building.id === id)
  if (matchingBuildings.length > 1 || matchingBuildings.length === 0) return undefined
  return matchingBuildings[0]
}
