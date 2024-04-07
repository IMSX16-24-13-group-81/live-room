<script lang="ts">
  export let iconName: string
</script>

<button on:click class="p-[0.5rem] rounded-full transition active:bg-dark/20 hover:bg-dark/10">
  <img class="w-[1.3rem] h-[1.3rem]" src="/{iconName}" alt="icon" />
</button>
