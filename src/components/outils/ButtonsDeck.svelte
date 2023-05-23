<script lang="ts">
  export let setupButtonsList = [{ bxName: "bx-zoom-in" }, { bxName: "bx-zoom-out" }, { bxName: "bx-refresh" }, { bxName: "bx-trash" }, { bxName: "bx-fullScreen" }]
  export let exportButtonsList = [{ bxName: "bx-slideshow" }, { bxName: "bxs-graduation" }]
</script>

<div class="flex justify-center">
  <div class="w-[70%] z-50 hidden md:flex md:flex-col xl:flex-row pl-4 py-2 justify-between items-center bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <div id="setupButtonsBar">
      <slot name="setup-buttons">
        {#each setupButtonsList as button}
          <i class="bx bx-sm px-2 {button.bxName} hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
        {/each}
      </slot>
    </div>
    <div id="exportButtonsBar">
      <slot name="export-buttons">
        {#each exportButtonsList as button}
          <i class="bx bx-sm px-2 {button.bxName} hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
        {/each}
      </slot>
    </div>
  </div>
</div>
