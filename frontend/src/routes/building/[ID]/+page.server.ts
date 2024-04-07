import { getBuildingByID, getRoomsByBuildingID } from "$lib/helpers"
import { error } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load = (async ({ params }) => {
  const buildingID = params.ID
  const building = getBuildingByID(buildingID)

  if (!building) {
    throw error(404, {
      message: "Not found",
    })
  }

  const rooms = await getRoomsByBuildingID(buildingID)

  return {
    building,
    rooms,
  }
}) satisfies PageServerLoad
