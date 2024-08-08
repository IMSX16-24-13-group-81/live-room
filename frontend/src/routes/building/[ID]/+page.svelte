<script lang="ts">
  import Spacer from "../../../components/Spacer.svelte";
  import RoomCell from "../../../components/building-page/RoomCell.svelte";
  import type { PageData } from "./$types";
  import { getRoomsByBuildingID } from "$lib/helpers";
  import STD from "$lib/STD";
  import { onDestroy, onMount } from "svelte";
  import { RoomStatus } from "$lib/data/protocols";

  export let data: PageData;
  //export let buildingId: string;

  const interval = setInterval(async () => {
    data.rooms = await getRoomsByBuildingID(data.building.id);
  }, STD.pollingInterval);

  onDestroy(() => {
    clearInterval(interval);
  });

  onMount(() => {
    document.title = `${data.building.name} - Find a Room`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `Find a free study room or group room in ${data.building.name}, Chalmers, Gothenburg.`);
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = `Check the current occupancy status of ${data.building.name}.`;
      document.head.appendChild(newMetaDescription);
    }
  });
</script>

<div class="flex flex-col w-full">
  <h2 class="text-header font-extrabold tracking-tighter leading-none">{data.building.name}</h2>
  <h2 class="text-smallHeader font-medium tracking-tighter leading-none">{data.building.address}</h2>
  <Spacer height={20} />
  <div class="flex flex-col tablet:flex-row gap-2">
    <div>
      <h2 class="text-content font-bold tracking-tighter leading-none">Description</h2>
      <h2 class="text-content font-light tracking-tighter leading-none">{data.building.description}</h2>
    </div>
    <Spacer />
    <div class="bg-dark/[0.07] p-2 pl-4 pr-4 rounded-md">
      <h4 class="text-content">
        <span class="font-bold text-dark">{data.rooms.filter((room) => room.state === RoomStatus.Empty).length}</span> of
        <span class="font-bold text-dark">{data.rooms.length}</span> Available
      </h4>
    </div>
  </div>

  <Spacer height={20} />
  <div class="flex flex-col gap-3">
    {#each data.rooms as room}
      <RoomCell {room} />
    {/each}
  </div>
</div>
