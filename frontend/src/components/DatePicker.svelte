<script lang="ts">
    export let selectedDate: Date | null = null;
    export let label: string = "Select Date";
  
    const handleChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      selectedDate = new Date(target.value);
    };
  </script>
  
  <label>
    {label}
    <input type="date" on:change={handleChange} />
  </label>