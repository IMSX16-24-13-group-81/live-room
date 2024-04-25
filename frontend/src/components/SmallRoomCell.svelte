<script lang="ts">
  import { RoomStatus, type Room } from "$lib/data/protocols"
  import Spacer from "./Spacer.svelte"

  export let room: Room
</script>

<div class="bg-dark/[0.07] w-full flex flex-row gap-2 items-center p-2 rounded-md">
  <p class="font-bold text-smallContent">{room.name}</p>
  <Spacer />
  <div class="p-[2px] pl-4 pr-4 {room.state === RoomStatus.Empty ? ' bg-[#009760]/15' : room.state === RoomStatus.Unknown ? 'bg-yellow-600/15' : 'bg-[#97005A]/15'} rounded-full">
    <p class="{room.state === RoomStatus.Empty ? ' text-[#009760]' : room.state === RoomStatus.Unknown ? 'text-yellow-600' : 'text-[#97005A]'} font-bold text-smallContent">
      {room.state === RoomStatus.Empty ? "Available" : room.state === RoomStatus.Unknown ? "Unknown" : "In Use"}
    </p>
  </div>
</div>
