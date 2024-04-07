<script lang="ts">
  export let text: string
  export let disabled: boolean = false
</script>

<button {disabled} on:click class="flex p-2 pl-6 pr-6 bg-primary rounded-full hover:brightness-90 transition {disabled ? 'opacity-30 pointer-events-none' : ''}">
  <p class="text-content font-medium tracking-wide text-white">{text}</p>
</button>
