
<!-- THis file sets up the service page. Curerntly, only the frontend works, nothing gets written to the server -->

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
    import { buildings } from "$lib/data/buildings"
  
    export let data: PageData
  
    let showIncorrectToken = false
    let hasAuthenticated = false
  
    //Placeholder variable
    const correctToken = "1"
  
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


    // Form data
  let formData = {
    name: "",
    roomId: "",
    selectedBuilding: "",
  };

  // Function to handle form submission
  async function handleSubmit() {
    if (!formData.name || !formData.selectedBuilding) {
      alert("Please fill out the required fields.");
      return;
    }

    // Simulate sending data to a server
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Form submitted successfully!");
    } catch (error) {
      alert("Failed to submit form. Please try again.");
    }

    console.log(formData);
  }
  </script>
  
  <img src={"/chalmersLogo.svg"} alt="Chalmers University Logo" class="w-[110px]" />
  <Spacer height={10} />
  <h2 class="text-header font-extrabold tracking-tighter leading-none">SERVICE</h2>
  <p class="font-medium text-smallHeader opacity-50 text-center">Manage and register hardware.</p>
  {#if hasAuthenticated === false}
    <Spacer height={40} />
    <img src={"/servicepage.png"} alt="Connection illustration" class="max-w-[160px]"/>
    <Spacer height={45} />
    <div class="w-full max-w-[600px]">
      <TextField placeholder={"your-access-key-here"} example={"Access Key"} bind:value={tokenString} />
    </div>
  
    <Spacer height={10} />
    <p class="font-light text-smallContent max-w-[600px] text-center">
      This page is only for Chalmers personnel. If you want to use it, make sure to get an access token.
    </p>
  
    <Spacer height={30} />
    <CustomButton text={"SIGN IN"} disabled={tokenString === ""} on:click={() => testAccess()} />
    <Spacer height={10} />  
    {#if showIncorrectToken}
      <p class="font-bold text-content text-red-500">Incorrect Token</p>
    {/if}
  {:else}
    <Spacer height={40} />
   
    <Spacer height={40} />
    <h2 class="text-mediumHeader font-extrabold tracking-tighter leading-none">Register new sensor</h2>
    <Spacer height={25} />

<!-- Form for registration of new sensor-->
<form on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="building" class="block font-bold text-[0.85rem]">Select Building:</label>
    <select
      bind:value={formData.selectedBuilding}
      required
      class="rounded-md bg-dark/10 p-3 w-full text-content self-stretch font-medium border-transparent focus:outline-none focus:border-text placeholder-dark/70">
      <option value="" disabled>Click to view</option>
      {#each buildings as option}
        <option value={option.name}>{option.name}</option>
      {/each}
    </select>
    </div>
    <div>
      <Spacer height = {10} />
      <label for="name" class="block font-bold text-[0.85rem]">Room ID as written in Campus Maps: </label>
      <TextField bind:value={formData.name} placeholder="Eg: EG-4201A" example="" />
    </div>
    <div>
      <Spacer height = {10} />
      <label for="MAC" class="block font-bold text-[0.85rem]">MAC address for new sensor: </label>
      <TextField bind:value={formData.roomId} placeholder="Eg: 00:00:AA:AA:00:FF" example="" />
    </div>
  
    <Spacer height = {20} />
    <div class="flex justify-center">
      <CustomButton text={"REGISTER NEW SENSOR"} disabled={tokenString === ""} />
    </div> 
  </form>   

<!--Footer-->
    <Spacer height={100} />
    <div class="w-full bg-dark/[0.07] rounded-lg p-8 flex flex-col items-center">
      <h2 class="text-smallHeader font-medium leading-none">NEED HELP?</h2>
      <h2 class="text-mediumHeader tablet:text-header font-bold leading-tight">Contact developers</h2>
      <p class="text-content font-light leading-none text-center max-w-[700px]">
        Have you discovered something that needs some love and care? Isn't the registration service working? Please contact us and we will see what we can do!
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