<script lang="ts">
  import { buildings } from "$lib/data/buildings";
  import BuildningCell from "../components/BuildningCell.svelte";
  import Searchbar from "../components/Searchbar.svelte";
  import Spacer from "../components/Spacer.svelte";
  import RoomCell from "../components/building-page/RoomCell.svelte";
  import type { PageData } from "./$types";
  import { getAllRooms, getRoomsByBuildingID } from "../lib/helpers";
  import STD from "$lib/STD";
  import { onDestroy, onMount } from "svelte";
  import { RoomStatus } from "$lib/data/protocols";
    import RoomSelector from "../components/RoomSelector.svelte";

  export let data: PageData;

  const interval = setInterval(async () => {
    const allRooms = await getAllRooms();
    data = { allRooms, freeRooms: allRooms.filter((room) => room.state === RoomStatus.Empty) };
  }, STD.pollingInterval);

  onDestroy(() => {
    clearInterval(interval);
  });

  onMount(() => {
    document.title = 'Find a Room | Live info on Chalmers group rooms';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Check the occupancy status of Chalmers group rooms, find an available room or check statistics');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = 'Check the occupancy status of various buildings on our start page.';
      document.head.appendChild(newMetaDescription);
    }
  });


    // Add helper function to get available rooms for a building
    const getAvailableRoomsCount = async (buildingId: string): Promise<{ availableRooms: number}>  => {
    const rooms = await getRoomsByBuildingID(buildingId);
    const availableRooms = rooms.filter(room => room.state === RoomStatus.Empty).length;
    return { availableRooms};
  };
</script>
<img src={"/chalmersLogo.svg"} alt="Chalmers University Logo" class="w-[110px]" />
<Spacer height={10} />
<h2 class="text-header font-extrabold tracking-tighter leading-none">FIND A ROOM</h2>
<p class="font-light">See Available Rooms In Real Time</p>
<Spacer height={15} />
<div class="center">
  {#if data.freeRooms.length === 0}
    <h2 class="text-mediumHeader font-extrabold tracking-tighter text-center leading-none">No places are currently available</h2>
  {:else}
    <h2 class="text-mediumHeader font-extrabold tracking-tighter text-center leading-none">{data.freeRooms.length} places are currently available</h2>
  {/if}
</div>
<Spacer height={15} />
<Searchbar rooms={data.allRooms} />
<!-- Feedback button -->
<!-- <Spacer height={10} /> -->
<!-- <a
  href="https://forms.gle/kCgvct5wckKfyEts8"
  class=" bg-primary p-2 pl-4 pr-4 rounded-full hover:brightness-[0.8] transition"
>
  <p class="text-white font-medium text-smallContent">Give us feedback!</p>
</a> -->

<Spacer height={30} />
<p class="font-medium text-smallContent opacity-50">Navigate rooms by building.</p>
<Spacer height={10} />
<div class="w-full grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-4">
  {#each buildings as building}
    <BuildningCell {building} getAvailableRoomsCount={getAvailableRoomsCount}/>
  {/each}
</div>

<Spacer height={70} />
<h2 class="text-mediumHeader font-extrabold tracking-tighter leading-none">Recently Available</h2>
<p class="font-light text-center">
  Maybe you are waiting for a special place? Well if yes, perhaps this could help you!
</p>
<Spacer height={30} />
<div class="flex flex-col gap-3 w-full">
  {#if data.freeRooms.length === 0}
    <p class="text-smallHeader font-bold opacity-30 text-center">No rooms are currently available.</p>
  {/if}
  {#each data.freeRooms as room}
    <RoomCell {room} />
  {/each}
</div>
<Spacer height={70} />
<div class="w-full bg-dark/[0.07] rounded-xl p-8 flex flex-col items-center">
  <!--<p class="text-smallContent tablet:text-content font-medium opacity-50 leading-tight italic text-center">
    Bibbidi-Bobbidi-Boo, here's one found, but now there are two.
  </p>
  <Spacer height={5} />-->
  <h2 class="text-mediumHeader font-bold leading-tight text-center">HOW DOES IT WORK?</h2>
  <Spacer height={10} />
  <p class="text-content font-light max-w-[700px]">
    How can the website know what rooms are used? The rooms presented in this application are equiped with a device that
    use an IR-sensor. This sensor is chosen to measure presence but with privacy in mind. It has no
    capability of identifing you as an individual, it can only measure if there is someone passing through the door. It is of high
    priority for this project that everyone feel comfortable with the technology used. If you have any questions or
    suggestions you are welcome to contact us.
  </p>
  <Spacer height={20} />
  <a
  href="https://forms.office.com/e/nD4aFBBjhZ"
  class=" bg-primary p-2 pl-5 pr-5 rounded-full hover:brightness-[0.8] transition"
>
  <p class="text-white font-medium text-smallHeader">Contact us!</p>
</a>
 <!-- <p class="text-content font-light leading-none text-center max-w-[700px]">
    Contact: <span class="font-bold">elladah@chalmers.se</span>
  </p> -->
  <Spacer height={40} />
  <img src={"/privacy.png"} alt="Pattern illustration" class="max-w-[150px] object-contain pulse-animation" />
  <Spacer height={10} />
</div>

<style>
  @keyframes fadeAnimation {
    0%,
    100% {
      filter: brightness(1.3);
    }
    50% {
      filter: brightness(0.95);
    }
  }

  .pulse-animation {
    animation: fadeAnimation 4s ease-in-out infinite;
  }
</style>
