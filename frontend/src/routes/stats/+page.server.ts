import { getAllRooms, addRooms } from "$lib/helpers"
import type { PageServerLoad } from "./$types"

export const load = (async ({ params }) => {
  const allRooms = await getAllRooms()
  const add = await addRooms()

  return {
    allRooms, add
  }
}) satisfies PageServerLoad
