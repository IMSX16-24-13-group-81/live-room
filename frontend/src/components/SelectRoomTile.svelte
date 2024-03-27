<script lang="ts">
  import type { Room } from "$lib/data/protocols"

  export let room: Room
  export let selectedRooms: Set<string>

  let isSelected = false

  const onTileClicked = () => {
    if (selectedRooms.has(room.id)) {
      selectedRooms.delete(room.id)
      isSelected = false
    } else {
      selectedRooms.add(room.id)
      isSelected = true
    }
  }
</script>

<button on:click={() => onTileClicked()} class="p-1 pl-4 pr-4 rounded-full transition hover:brightness-75 {isSelected ? 'bg-dark text-white' : 'bg-dark/10'}">
  <p class="text-content font-medium">{room.name}</p>
</button>
