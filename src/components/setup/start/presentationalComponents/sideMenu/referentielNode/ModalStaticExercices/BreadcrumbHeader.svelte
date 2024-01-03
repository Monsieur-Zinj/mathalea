<script lang="ts">

  // ==============================================================================================
  //
  //                                        DEAD CODE
  //
  // ==============================================================================================

  export let path: string[] = []
</script>

<div class="flex justify-start items-center text-coopmaths-struct dark:text-coopmathsdark-struct">
  {#each path as step, i}
    <span>{step}</span>
    {#if i < path.length - 1}
      <span><i class="bx bx-chevron-right translate-y-1" /></span>
    {/if}
  {/each}
</div>
