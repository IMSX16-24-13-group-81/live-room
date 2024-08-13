import { getDataPointsForRoom } from "$lib/helpers"
import { getAllRooms } from "$lib/helpers";
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  const allRooms = await getAllRooms();
  return {
    allRooms
  };
}; //satisfies PageServerLoad

//Call for statistics for certain dates and time
export const actions = {
  getRoomDataForRange: async ({ request }) => {
    const { startDateTime, endDateTime, roomID } = await request.json();
    
    // Use startDateTime and endDateTime to query the InfluxDB
    const startISO = new Date(startDateTime).toISOString();
    const endISO = new Date(endDateTime).toISOString();

    // Fetch room status history
    const lineChartData = await getDataPointsForRoom(roomID, startISO, endISO);

    return {
      status: 200,
      body: {
        lineChartData
      }
    };
  }
};