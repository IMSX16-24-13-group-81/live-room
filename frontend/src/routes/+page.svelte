<script>
  import BuildningCell from "../components/BuildningCell.svelte"
  import Searchbar from "../components/Searchbar.svelte"
  import Spacer from "../components/Spacer.svelte"
</script>

<Spacer height={20} />
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
  {#each new Array(10).fill(0) as _}
    <BuildningCell />
  {/each}
</div>
