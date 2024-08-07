<script lang="ts">
    export let selectedTime: string | null = null;
    export let label: string = "Select Time";
  
    const handleChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      selectedTime = target.value;
    };
  </script>
  
  <label>
    {label}
    <input type="time" on:change={handleChange} />
  </label>