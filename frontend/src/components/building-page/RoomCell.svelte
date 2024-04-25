<script lang="ts">
  import { RoomStatus, type Room } from "$lib/data/protocols"
  import { truncateString } from "$lib/helpers"
  import IconButton from "../IconButton.svelte"
  import Spacer from "../Spacer.svelte"

  export let room: Room
</script>

<div class="bg-dark/[0.07] w-full flex flex-col tablet:flex-row gap-2 items-center p-2 rounded-md">
  <div class="flex flex-col self-start tablet:self-center">
    <p class="font-bold">{room.name}</p>
    <p class="font-light text-smallContent line-clamp-1">{truncateString(room.description, 100)}</p>
  </div>
  <Spacer />
  <div class="flex gap-1 items-center self-end tablet:self-center">
    <Spacer />
    <div class="p-[2px] pl-4 pr-4 {room.state === RoomStatus.Empty ? ' bg-[#009760]/15' : room.state === RoomStatus.Unknown ? 'bg-yellow-600/15' : 'bg-[#97005A]/15'} rounded-full">
      <p class="{room.state === RoomStatus.Empty ? ' text-[#009760]' : room.state === RoomStatus.Unknown ? 'text-yellow-600' : 'text-[#97005A]'} font-bold text-smallContent">
        {room.state === RoomStatus.Empty ? "Available" : room.state === RoomStatus.Unknown ? "Unknown" : "In Use"}
      </p>
    </div>
    <!--
    <IconButton iconName={"campusmaps.svg"} />
    <IconButton iconName={"timeedit.svg"} />
    -->
  </div>
</div>
