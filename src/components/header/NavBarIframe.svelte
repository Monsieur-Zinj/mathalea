<nav class="p-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
  <!-- container -->
  <div
    class="flex flex-col md:flex-row justify-between items-start w-full mx-auto md:space-x-6"
  >
    <div
      class="flex flex-row justify-start md:items-end space-x-0 md:space-x-2"
    >
      <!-- logo -->
      <div
        class="text-5xl md:text-4xl font-logo9 tracking-tighter font-black text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        MathALÉA
      </div>
      <div
        class="flex flex-row font-light text-sm text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest"
      >
        <span class="font-light font-sans mr-1 tracking-normal">par</span>
        <a
          href="https://coopmaths.fr"
          target="_blank"
          rel="noreferrer"
          class="font-extrabold font-logo9 tracking-tighter text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest"
          >CoopMaths</a
        >
      </div>
    </div>
    {#if $$slots.buttons}
      <div class="w-full flex flex-row">
        <slot name="buttons" />
      </div>
    {/if}
  </div>
</nav>
