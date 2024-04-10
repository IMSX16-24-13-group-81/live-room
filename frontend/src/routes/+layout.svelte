<script>
  import STD from "$lib/STD"
  import "../app.css"
  import Footer from "../components/Footer.svelte"
  import Navbar from "../components/Navbar.svelte"
  import Spacer from "../components/Spacer.svelte"
</script>

<Navbar />

<div class="pt-[70px] pb-[30px] {STD.paddingStyle} flex flex-col items-center min-h-[100vh]">
  <slot />
  <Spacer />
  <Spacer height={50} />
  <Footer />
</div>
