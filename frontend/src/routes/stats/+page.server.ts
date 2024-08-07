import { getAllRooms } from "$lib/helpers"
import type { PageServerLoad } from "./$types"

export const load = (async ({ params }) => {
  const allRooms = await getAllRooms()
  return {
    allRooms
  }
}) satisfies PageServerLoad

//Call for statistics for certain dates and time
export const actions = {
  getRoomDataForRange: async ({ request }) => {
    const { startDateTime, endDateTime } = await request.json();
    
    // Use startDateTime and endDateTime to query the InfluxDB
    const lineChartData = await getRoomDataForRange(startDateTime, endDateTime);

    return {
      status: 200,
      body: {
        lineChartData
      }
    };
  }
};