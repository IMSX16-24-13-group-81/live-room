<script lang="ts">
  import type { LineChartData } from "$lib/data/protocols"
  import { getExampleLineChartData } from "$lib/helpers"
  import CustomButton from "../../components/CustomButton.svelte"
  import RoomSelector from "../../components/RoomSelector.svelte"
  import Spacer from "../../components/Spacer.svelte"
  import StatsIllustration from "../../components/StatsIllustration.svelte"
  import TextField from "../../components/TextField.svelte"
  import LineChart from "../../components/lineChart/LineChart.svelte"
  import type { PageData } from "./$types"

  export let data: PageData

  let showIncorrectToken = false
  let hasAuthenticated = false

  let currentLineChartData: LineChartData | undefined

  $: if (currentLineChartData) {
    console.log("FROM OUTSIDE WAS UPDATED")
  }

  //Placeholder variable
  const correctToken = "placeholder-token"

  let tokenString = ""

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
<p class="font-medium text-smallHeader opacity-50 text-center">Explore when and where from a single place.</p>
{#if hasAuthenticated === false}
  <Spacer height={50} />
  <StatsIllustration />
  <Spacer height={50} />
  <div class="w-full max-w-[600px]">
    <TextField placeholder={"your-access-key-here"} example={"Access Key"} bind:value={tokenString} />
  </div>

  <Spacer height={10} />
  <p class="font-light text-smallContent max-w-[600px] text-center">
    This page is only for people with authentication. If you want to use it, make sure to get an access token.
  </p>

  <Spacer height={40} />
  <CustomButton text={"SEE DATA"} disabled={tokenString === ""} on:click={() => testAccess()} />

  <Spacer height={10} />

  {#if showIncorrectToken}
    <p class="font-bold text-content text-red-500">Incorrect Token</p>
  {/if}
{:else}
  <Spacer height={40} />
  <LineChart
    data={currentLineChartData ?? getExampleLineChartData()}
    realData={!!currentLineChartData}
    noPoints={currentLineChartData ? currentLineChartData?.points.length === 0 : false}
  />
  <Spacer height={40} />
  <h2 class="text-mediumHeader font-extrabold tracking-tighter leading-none">Select Rooms</h2>
  <h2 class="text-content font-light tracking-tighter leading-none text-center">
    Data from the rooms selected will be shown in the line chart.
  </h2>
  <Spacer height={20} />
  <div class="flex">
    <RoomSelector rooms={data.allRooms} bind:currentLineChartData />
  </div>

  <Spacer height={100} />
  <div class="w-full bg-dark/[0.07] rounded-lg p-8 flex flex-col items-center">
    <h2 class="text-smallHeader font-medium leading-none">WANT FULL CONTROL?</h2>
    <h2 class="text-mediumHeader tablet:text-header font-bold leading-tight">GET RAW DATA</h2>
    <p class="text-content font-light leading-none text-center max-w-[700px]">
      If you are from Chalmers administration, you could request access to the raw data from PostgreSQL and InfluxDB.
      This allows for more fine grain control that enables you to find exactly what you are looking for.
    </p>
    <Spacer height={20} />
    <p class="text-content font-light leading-none text-center max-w-[700px]">
      Contact: <span class="font-bold">elladah@chalmers.se</span>
    </p>
    <Spacer height={40} />
    <img src={"/stats-pattern.svg"} alt="Pattern illustration" class="w-full max-w-[400px] object-contain" />
    <Spacer height={40} />
  </div>
{/if}
