<script>
  import Spacer from "../../components/Spacer.svelte"
  import RoomCell from "../../components/building-page/RoomCell.svelte"
</script>

<div class="flex flex-col w-full">
  <h2 class="text-header font-extrabold tracking-tighter leading-none">EDIT-Huset</h2>
  <p class="font-light">See the current availability of rooms.</p>
  <Spacer height={20} />
  <div class="flex flex-col gap-3">
    {#each new Array(Math.round(Math.random() * 30)).fill(0) as _}
      <RoomCell />
    {/each}
  </div>
</div>
