<script lang="ts">
  import { exercicesParams } from "../store"
  export let ressource
</script>

<div class="relative flex flex-row mr-4 text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas dark:bg-coopmathsdark-canvas ml-2">
  <div
    class="flex-1 hover:bg-coopmaths-action-light dark:hover:bg-coopmathsdark-action-light dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest cursor-pointer"
  >
    <div class="ml-[3px] pl-2 py-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest flex-1">
      <div class="text-coopmaths-corpus dark:text-coopmathsdark-corpus">
        {ressource.titre}
      </div>
    </div>
  </div>
  <!-- {#if selectedCount >= 1}
    <button
      type="button"
      class="absolute -left-4"
      on:mouseover={handleMouseOver}
      on:focus={handleMouseOver}
      on:mouseout={handleMouseOut}
      on:blur={handleMouseOut}
      on:click={removeFromList}
      on:keydown={removeFromList}><i class="text-coopmaths-action-light dark:text-coopmathsdark-action-light text-base bx {icon} {rotation}" /></button
    >
  {/if} -->
  <!-- {#if selectedCount >= 2 && mouseIsOut}
    <div class="absolute -left-[12.5px] text-[0.6rem] font-bold text-coopmaths-canvas dark:text-coopmathsdark-canvas-dark">{selectedCount}</div>
  {/if} -->
</div>
