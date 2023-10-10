<script lang="ts">
  import {
    isExerciceItemInReferentiel,
    type JSONReferentielEnding
  } from '../../lib/types/referentiels'

  export let ending: JSONReferentielEnding
  export let nestedLevelCount: number
</script>

<div
  class="relative flex flex-row mr-4 items-center text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas dark:bg-coopmathsdark-canvas ml-{nestedLevelCount *
    2}"
  style="padding-left: {(nestedLevelCount * 2) / 4}rem"
>
  {#if isExerciceItemInReferentiel(ending)}
    <div class="text-coopmath-corpus">{ending.id}-{ending.titre}</div>
  {:else}
    {ending.uuid}
  {/if}
</div>
