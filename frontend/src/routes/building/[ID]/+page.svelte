<script lang="ts">
  import Spacer from "../../../components/Spacer.svelte"
  import RoomCell from "../../../components/building-page/RoomCell.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<div class="flex flex-col w-full">
  <h2 class="text-header font-extrabold tracking-tighter leading-none">{data.building.name}</h2>
  <h2 class="text-smallHeader font-medium tracking-tighter leading-none">{data.building.address}</h2>
  <Spacer height={20} />
  <h2 class="text-content font-bold tracking-tighter leading-none">Description</h2>
  <h2 class="text-content font-light tracking-tighter leading-none">{data.building.description}</h2>
  <Spacer height={20} />
  <div class="flex flex-col gap-3">
    {#each new Array(Math.round(Math.random() * 30)).fill(0) as _}
      <RoomCell />
    {/each}
  </div>
</div>
