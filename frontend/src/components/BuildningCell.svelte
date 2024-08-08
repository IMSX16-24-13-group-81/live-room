<script lang="ts">
  import { onMount } from "svelte";
  import type { Building } from "$lib/data/protocols"
  import Spacer from "./Spacer.svelte"
  import { RoomStatus } from "$lib/data/protocols";

  export let building: Building
  export let getAvailableRoomsCount: (buildingId: string) => Promise<{ availableRooms: number}>
  const urls: string[] = ["/buildingBlue.jpeg", "/buildingGreen.jpeg", "/buildingGrey.jpeg", "/buildingPurple.jpeg"]

  let availableRooms = 0;

  // Fetch available and total rooms on mount
  onMount(async () => {
    const { availableRooms: availRooms} = await getAvailableRoomsCount(building.id);
    availableRooms = availRooms;
  })
</script>

<a href="building/{building.id}" class="bg-dark/20 rounded-md w-full h-[140px] hover:opacity-80 overflow-clip relative transition { building.id !== "4" ? "saturate-[0.15]":"" }">
  <div class="gradient w-full h-full absolute top-0 bottom-0 left-0 right-0 bg-dark/50 flex flex-col p-2">
    <Spacer />
    <h4 class="font-extrabold text-white text-[1rem] leading-none">{building.name} - {availableRooms} available</h4>
    <h4 class="font-light text-white text-smallContent">{building.address}</h4>
  </div>
  <img src={urls[Math.round(Math.random() * (urls.length - 1))]} alt="Building" class="w-full h-full object-cover" />
</a>

<style>
  .gradient {
    background: linear-gradient(180deg, rgba(0, 63, 84, 0) 0%, #003f54 100%);
  }
</style>
