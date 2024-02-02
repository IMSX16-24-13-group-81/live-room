<script>
  import STD from "$lib/STD"
  import Spacer from "./Spacer.svelte"
</script>

<div class="fixed z-20 flex items-center p-2 right-0 left-0 {STD.paddingStyle}">
  <img src={"/logo.svg"} alt="logo svg" class="w-8 h-8" />
  <Spacer />
  <button>
    <img src={"/navIcon.svg"} alt="Navigation menu icon" class="w-5 h-5" />
  </button>
</div>
