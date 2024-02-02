<script>
  import STD from "$lib/STD"
  import "../app.css"
  import Navbar from "../components/Navbar.svelte"
</script>

<Navbar />

<div class="p-[50px] {STD.paddingStyle} flex flex-col items-center">
  <slot />
</div>
