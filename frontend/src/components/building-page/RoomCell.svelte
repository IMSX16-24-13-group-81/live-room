<script>
  import IconButton from "../IconButton.svelte"
  import Spacer from "../Spacer.svelte"

  let isAvailable = Math.random() < 0.5
</script>

<div class="bg-dark/10 w-full flex flex-col tablet:flex-row items-center p-2 rounded-md">
  <div class="flex flex-col self-start tablet:self-center">
    <p class="font-bold">EG-{1000 + Math.round(Math.random() * 5000)}</p>
    <p class="font-light text-smallContent">This is a description that tells the user about the room.</p>
  </div>
  <Spacer />
  <div class="flex gap-1 items-center self-end tablet:self-center">
    <Spacer />
    <p class="{isAvailable ? ' text-[#009760]' : 'text-[#97005A]'} font-bold text-smallContent">
      {isAvailable ? "AVAILABLE" : "USED"}
    </p>
    <IconButton iconName={"campusmaps.svg"} />
    <IconButton iconName={"timeedit.svg"} />
  </div>
</div>
