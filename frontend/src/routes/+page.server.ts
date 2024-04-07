import { getAllRooms, getBuildingByID, getRoomsByBuildingID } from "$lib/helpers"
import type { PageServerLoad } from "./$types"

export const load = (async ({ params }) => {
  const allRooms = await getAllRooms()
  const freeRooms = allRooms.filter((room) => room.isAvailable === true)

  return {
    allRooms,
    freeRooms,
  }
}) satisfies PageServerLoad
