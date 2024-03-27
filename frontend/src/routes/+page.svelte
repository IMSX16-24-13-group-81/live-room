<script lang="ts">
  import { buildings } from "$lib/data/buildings"
  import BuildningCell from "../components/BuildningCell.svelte"
  import Searchbar from "../components/Searchbar.svelte"
  import Spacer from "../components/Spacer.svelte"
  import RoomCell from "../components/building-page/RoomCell.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<img src={"/chalmersLogo.svg"} alt="Chalmers University Logo" class="w-[110px]" />
<Spacer height={10} />
<h2 class="text-header font-extrabold tracking-tighter leading-none">FIND A ROOM</h2>
<p class="font-light">See Available Rooms In Real Time</p>
<Spacer height={20} />
<Searchbar />
<Spacer height={40} />
<p class="font-medium text-smallContent opacity-50">Navigate rooms by building.</p>
<Spacer height={10} />
<div class="w-full grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-4">
  {#each buildings as building}
    <BuildningCell {building} />
  {/each}
</div>

<Spacer height={70} />
<h2 class="text-mediumHeader font-extrabold tracking-tighter leading-none">Recently Available</h2>
<p class="font-light">Maybe you are waiting for a special place? Well if yes, perhaps this could help you!</p>
<Spacer height={30} />
<div class="flex flex-col gap-3 w-full">
  {#each data.freeRooms as room}
    <RoomCell {room} />
  {/each}
</div>
<Spacer height={70} />
<div class="w-full bg-dark/[0.07] rounded-xl p-8 flex flex-col items-center">
  <p class="text-smallContent tablet:text-content font-medium opacity-50 leading-tight italic text-center">Bibbidi-Bobbidi-Boo, here's one found, but now there are two.</p>
  <Spacer height={5} />
  <h2 class="text-mediumHeader font-bold leading-tight">HOW DOES IT WORK?</h2>
  <Spacer height={5} />
  <p class="text-content font-light max-w-[700px]">How can the website know what rooms are used? The rooms presented in this application are equiped with a device that combines a PIR-sensor and a radar. These are chosen to measure presence but with privacy in mind. They have no capability of identifing you as an individual, they can only measure if there is someone in the room. It is of high priority for this project that everyone feel comfortable with the technology used. If you have any questions or suggestions you are welcome to contact us.</p>
  <Spacer height={20} />
  <p class="text-content font-light leading-none text-center max-w-[700px]">Contact: <span class="font-bold">placeholder-email@domain.com</span></p>
  <Spacer height={40} />
  <img src={"/privacy.png"} alt="Pattern illustration" class="max-w-[150px] object-contain pulse-animation" />
</div>

<style>
  @keyframes fadeAnimation {
    0%,
    100% {
      filter: brightness(1.2);
    }
    50% {
      filter: brightness(0.95);
    }
  }

  .pulse-animation {
    animation: fadeAnimation 4s ease-in-out infinite;
  }
</style>
