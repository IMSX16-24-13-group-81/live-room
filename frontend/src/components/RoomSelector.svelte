<script lang="ts">
  import { buildings } from "$lib/data/buildings"
  import SelectRoomTile from "./SelectRoomTile.svelte"
  import Spacer from "./Spacer.svelte"

  export let selectedRooms: Set<string>
</script>

<div class="flex flex-col w-full items-center">
  {#each buildings as building}
    <Spacer height={25} />
    <h2 class="text-content font-bold tracking-tighter leading-none">{building.name}</h2>
    <Spacer height={10} />
    <div class="flex w-full pl-8 gap-4 items-center justify-center flex-wrap">
      {#each new Array(5).fill(0) as _}
        <SelectRoomTile bind:selectedRooms room={{ id: "", description: "lsdfjsdf", name: "alsdfjasf" }} />
      {/each}
    </div>
  {/each}
</div>
