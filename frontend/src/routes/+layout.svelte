<script>
  import STD from "$lib/STD"
  import { onMount } from "svelte"
  import "../app.css"
  import Footer from "../components/Footer.svelte"
  import Navbar from "../components/Navbar.svelte"
  import Spacer from "../components/Spacer.svelte"
  import { setupWebsocket } from "../lib/websocket"

  onMount(() => {
    setupWebsocket()
  })
</script>

<Navbar />

<div class="pt-[70px] pb-[30px] {STD.paddingStyle} flex flex-col items-center">
  <slot />
  <Spacer height={50} />
  <Footer />
</div>
