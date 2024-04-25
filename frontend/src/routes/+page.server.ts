import { getAllRooms } from "$lib/helpers"
import { RoomStatus } from "../lib/data/protocols"
import type { PageServerLoad } from "./$types"

export const load = (async ({ params }) => {
  const allRooms = await getAllRooms()
  const freeRooms = allRooms.filter((room) => room.state === RoomStatus.Empty)

  return {
    allRooms,
    freeRooms,
  }
}) satisfies PageServerLoad
