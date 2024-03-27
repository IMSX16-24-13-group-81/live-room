<script lang="ts">
  import CustomButton from "../../components/CustomButton.svelte"
  import RoomSelector from "../../components/RoomSelector.svelte"
  import Spacer from "../../components/Spacer.svelte"
  import StatsIllustration from "../../components/StatsIllustration.svelte"
  import TextField from "../../components/TextField.svelte"

  let showIncorrectToken = false
  let hasAuthenticated = false

  let selectedRooms: Set<string> = new Set()

  //Placeholder variable
  const correctToken = "hej-hej-hej"

  let tokenString = correctToken

  const testAccess = () => {
    if (tokenString === correctToken) {
      //OK
      hasAuthenticated = true
    } else {
      //Wrong token
      showIncorrectToken = true
      setTimeout(() => {
        showIncorrectToken = false
      }, 3000)
    }
  }
</script>

<img src={"/chalmersLogo.svg"} alt="Chalmers University Logo" class="w-[110px]" />
<Spacer height={10} />
<h2 class="text-header font-extrabold tracking-tighter leading-none">STATISTICS</h2>
<p class="font-medium text-smallHeader opacity-50">Explore when and where from a single place.</p>
{#if hasAuthenticated === false}
  <Spacer height={100} />
  <StatsIllustration />
  <Spacer height={50} />
  <div class="w-full max-w-[600px]">
    <TextField placeholder={"your-access-key-here"} example={"Access Key"} bind:value={tokenString} />
  </div>

  <Spacer height={10} />
  <p class="font-light text-smallContent max-w-[600px] text-center">This page is only for people with authentication. If you want to use it, make sure to get an access token.</p>

  <Spacer height={40} />
  <CustomButton text={"SEE DATA"} disabled={tokenString === ""} on:click={() => testAccess()} />

  <Spacer height={10} />

  {#if showIncorrectToken}
    <p class="font-bold text-content text-red-500">Incorrect Token</p>
  {/if}
{:else}
  <Spacer height={40} />
  <div class="bg-primary w-[800px] aspect-video"></div>
  <Spacer height={40} />
  <h2 class="text-mediumHeader font-extrabold tracking-tighter leading-none">Select Rooms</h2>
  <h2 class="text-content font-light tracking-tighter leading-none">Data from the rooms selected will be shown in the line chart.</h2>
  <Spacer height={20} />
  <RoomSelector bind:selectedRooms />
{/if}
