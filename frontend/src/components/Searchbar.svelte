<script>
  import IconButton from "./IconButton.svelte"
</script>

<div class="flex justify-between self-center w-[100%] tablet:w-[60%] bg-dark/10 p-1 pl-4 pr-4 rounded-full">
  <input type="text" placeholder="Search for a room" class="appearance-none border-transparent focus:outline-none w-full bg-transparent text-smallContent" />
  <IconButton iconName={"searchIcon.svg"} />
</div>
