<script>
  import STD from "$lib/STD"
  import Spacer from "./Spacer.svelte"

  let open = false
  function ham_menu() {
    open =!open
  }
  function closeMenu() {
    open = false;
  }

</script>

<style>
  .menu {
    position: absolute;
    top: 100%;
    right: 0; 
    background-color: #EDF2F3;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
  .menu a {
    display: block;
    margin: 0.5rem 0;
  }
</style>

<div class="fixed z-20 flex items-center p-2 right-0 left-0 {STD.paddingStyle} bg-white/70 backdrop-blur-md">
  <a href="/"><img src="/logo.svg" alt="logo svg" class="w-8 h-8" /></a>
  <Spacer />
  <div class="relative">
    <button on:click={ham_menu}>
      <img src="/navIcon.svg" alt="Navigation menu icon" class="w-5 h-5" />
    </button>
    {#if open}
      <div class="menu">
        <a href="/service" on:click={closeMenu}><p class="font-medium text-content">Service</p></a>
        <Spacer height={4} />
        <a href="/stats" on:click={closeMenu}><p class="font-medium text-content">Statistics</p></a>
      </div>
    {/if}
  </div>
</div>


