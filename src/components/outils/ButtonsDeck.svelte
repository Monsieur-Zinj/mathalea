<script lang="ts">
  export let setupButtonsList = [{ bxName: 'bx-zoom-in' }, { bxName: 'bx-zoom-out' }, { bxName: 'bx-refresh' }, { bxName: 'bx-trash' }, { bxName: 'bx-fullScreen' }]
  export let exportButtonsList = [{ bxName: 'bx-slideshow' }, { bxName: 'bxs-graduation' }]
  export let barWidthPercentage: number = 70
</script>

<div style={`width: ${barWidthPercentage}% ;`} class="flex flex-col md:flex-row justify-start items-start sm:justify-center sm:items-center">
  <div class="w-full z-40 flex flex-col xl:flex-row px-4 py-2 justify-between items-center bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <div id="setupButtonsBar">
      <slot name="setup-buttons">
        {#each setupButtonsList as button}
          <i class="bx bx-sm px-2 {button.bxName} hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
        {/each}
      </slot>
    </div>
    {#if $$slots.input}
      <div id="input">
        <slot name="input" />
      </div>
    {/if}
    {#if $$slots['export-buttons']}
      <div id="exportButtonsBar">
        <slot name="export-buttons">
          {#each exportButtonsList as button}
            <i class="bx bx-sm px-2 {button.bxName} hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
          {/each}
        </slot>
      </div>
    {/if}
  </div>
</div>
