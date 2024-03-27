<script lang="ts">
  import type { Room } from "$lib/data/protocols"

  export let room: Room
  export let selectedRoomID: string | undefined

  $: isSelected = selectedRoomID === room.id

  const onTileClicked = () => {
    if (selectedRoomID === room.id) {
      selectedRoomID = undefined
    } else {
      selectedRoomID = room.id
    }
  }
</script>

<button on:click={() => onTileClicked()} class="p-1 pl-4 pr-4 rounded-full transition hover:brightness-75 {isSelected ? 'bg-dark text-white' : 'bg-dark/10'}">
  <p class="text-smallContent font-medium">{room.name}</p>
</button>
