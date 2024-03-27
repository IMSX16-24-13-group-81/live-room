<script lang="ts">
  export let placeholder: string
  export let example: string = ""

  export let value: string
  export let isPassword: boolean = false
</script>

<div class="rounded-md bg-dark/10 p-3 w-full">
  <p class="font-bold text-[0.85rem]">{example}</p>
  {#if !isPassword}
    <input bind:value {placeholder} class="appearance-none text-content self-stretch font-medium border-transparent focus:outline-none focus:outline-0 focus:border-text bg-transparent placeholder-dark/70 w-full" />
  {:else}
    <input type="password" bind:value {placeholder} class="appearance-none text-content self-stretch font-medium border-transparent focus:outline-none focus:outline-0 focus:border-text bg-transparent placeholder-dark/70 w-full" />
  {/if}
</div>
