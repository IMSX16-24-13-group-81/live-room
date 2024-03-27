<div class="flex w-full h-[200px] gap-2 max-w-[200px] items-end">
  <div class="h-[30%] w-full border-[3px] border-primary bg-primary/10 rounded-lg animate-opacity" />
  <div class="h-[60%] w-full border-[3px] border-dark bg-dark/10 rounded-lg animate-opacity" />
  <div class="h-[90%] w-full border-[3px] border-primary bg-primary/10 rounded-lg animate-opacity" />
  <div class="h-[30%] w-full border-[3px] border-dark bg-dark/10 rounded-lg animate-opacity" />
  <div class="h-[70%] w-full border-[3px] border-primary bg-primary/10 rounded-lg animate-opacity" />
</div>

<style>
  /* Define the keyframes for the opacity animation */
  @keyframes fadeAnimation {
    0%,
    100% {
      filter: brightness(1.2);
    }
    50% {
      filter: brightness(0.8);
    }
  }

  /* Apply the animation to an element */
  .animate-opacity {
    animation: fadeAnimation 2s ease-in-out infinite;
  }
</style>
