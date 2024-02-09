<script lang="ts">
  export let height: number | undefined = undefined
  export let width: number | undefined = undefined
</script>

<div
  style="height: {height ? height + 'px' : ''}; width: {width ? width + 'px' : ''}"
  class={!height && !width ? "flex-1" : ""}
/>
