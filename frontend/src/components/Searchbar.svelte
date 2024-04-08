<script lang="ts">
  import type { Room } from "$lib/data/protocols"
  import IconButton from "./IconButton.svelte"
  import SmallRoomCell from "./SmallRoomCell.svelte"

  export let rooms: Room[]

  let query = ""
  let isActive = false
  let filteredRooms: Room[] = []

  $: if (query !== null) {
    isActive = query !== ""
    filteredRooms = rooms.filter((room) => room.name.toLowerCase().includes(query.toLowerCase()))
  }
</script>

<div class="relative w-[100%] tablet:w-[60%] z-20">
  <div class="relative flex justify-between self-center w-full bg-[#EDF2F3] p-1 pl-4 pr-4 rounded-full">
    <input bind:value={query} type="text" placeholder="Search for a room" class="appearance-none border-transparent focus:outline-none w-full bg-transparent font-medium text-[16px] tablet:text-content" />
    <IconButton iconName={"searchIcon.svg"} />
  </div>
  <div class="w-full p-2 max-h-[400px] bg-white absolute top-[50px] left-0 right-0 -z-10 rounded-2xl shadow-xl shadow-dark/10 flex flex-col gap-2 overflow-y-scroll scroll-container transition duration-300 {!isActive ? 'opacity-0 pointer-events-none translate-y-5' : 'opacity-100 translate-y-0'}">
    {#each filteredRooms as room}
      <SmallRoomCell {room} />
    {/each}
    {#if filteredRooms.length === 0}
      <p class="text-content font-bold p-2 opacity-50">No rooms match the query: "{query}"</p>
    {/if}
  </div>
</div>

<button on:click={() => (isActive = false)} class="absolute top-0 right-0 left-0 bottom-0 bg-dark/20 z-10 transition duration-300 {!isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}" />

<style>
  /* For Webkit (Chrome, Safari, etc.) */
  .scroll-container::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
  }

  .scroll-container {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    overflow-y: scroll; /* Add vertical scroll */
    overflow-x: scroll; /* Add horizontal scroll, if needed */
  }
</style>
