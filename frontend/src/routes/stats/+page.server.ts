import { getAllRooms } from "$lib/helpers"
import {AddRooms} from "$lineChart/AddRoom"
import type { PageServerLoad } from "./$types"

export const load = (async ({ params }) => {
  const allRooms = await getAllRooms()
  const AddRooms = await handleSubmit();

  return {
    allRooms,
  }
}) satisfies PageServerLoad
