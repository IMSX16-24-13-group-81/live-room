<script lang="ts">
  import { buildings } from "$lib/data/buildings"
  import type { Room } from "$lib/data/protocols"
  import { getDataPointsForRoom } from "$lib/helpers"
  import SelectRoomTile from "./SelectRoomTile.svelte"
  import Spacer from "./Spacer.svelte"

  export let rooms: Room[]
  export let selectedRoomID: string | undefined
  export let onRoomSelected: (roomID: string) => void

  const handleRoomSelect = (roomID: string) => {
    onRoomSelected(roomID)

   /* const updateLineChartData = async (roomID: string) => {
    const points = await getDataPointsForRoom(roomID)
    currentLineChartData = {
      points,
    } 
  }

  //Svelte trick "$:" and if statement
  $: if (selectedRoomID) {
    console.log("THIS RUNS")
    updateLineChartData(selectedRoomID)
  } else {
    currentLineChartData = undefined */
  } 
</script>

<div class="flex flex-col w-full items-center">
  {#each buildings as building}
    <Spacer height={25} />
    <h2 class="text-content font-bold tracking-tighter leading-none">{building.name}</h2>
    <Spacer height={10} />
    <div class="flex w-full pl-4 gap-4 items-center flex-wrap justify-center">
      {#each rooms.filter((room) => room.buildingId === building.id) as room}
        <SelectRoomTile
          {room}
          selectedRoomID={selectedRoomID}
          on:click={() => handleRoomSelect(room.id)}
        />
      {/each}
    </div>
  {/each}
</div>
