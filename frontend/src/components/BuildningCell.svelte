<script>
  import Spacer from "./Spacer.svelte"
</script>

<div class="bg-dark/20 rounded-md w-full h-[140px] hover:opacity-80 overflow-clip relative transition">
  <div class="gradient w-full h-full absolute top-0 bottom-0 left-0 right-0 bg-dark/50 flex flex-col p-2">
    <Spacer />
    <h4 class="font-extrabold text-white text-[1rem] leading-none">EDIT-Huset</h4>
    <h4 class="font-light text-white text-smallContent">The address to the building</h4>
  </div>
  <img src="/buildingBlue.jpeg" alt="Building" class="w-full h-full object-cover" />
</div>

<style>
  .gradient {
    background: linear-gradient(180deg, rgba(0, 63, 84, 0) 0%, #003f54 100%);
  }
</style>
