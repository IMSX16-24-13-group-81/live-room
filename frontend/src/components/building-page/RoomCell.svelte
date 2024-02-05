<script>
  import IconButton from "../IconButton.svelte"
  import Spacer from "../Spacer.svelte"

  let isAvailable = Math.random() < 0.5
</script>

<div class="bg-dark/10 w-full flex items-center gap-2 p-2 rounded-md">
  <div class="flex flex-col">
    <p class="font-bold">EG-{Math.round(Math.random() * 6000)}</p>
    <p class="font-light text-smallContent">This is a description that tells the user about the room.</p>
  </div>

  <Spacer />
  <p class="{isAvailable ? ' text-' : ''} font-bold capitalize text-smallContent">
    {isAvailable ? "Available" : "Used"}
  </p>
  <IconButton iconName={"campusmaps.svg"} />
  <IconButton iconName={"timeedit.svg"} />
</div>
