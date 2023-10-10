<script lang="ts">
  import { onMount } from 'svelte'
  import {
    isExerciceItemInReferentiel,
    type JSONReferentielEnding
  } from '../../lib/types/referentiels'
  import renderMathInElement from 'katex/dist/contrib/auto-render.js'

  export let ending: JSONReferentielEnding
  export let nestedLevelCount: number

  let nomDeExercice: HTMLDivElement
  onMount(() => {
    if (nomDeExercice && nomDeExercice.innerHTML.includes('$')) {
      renderMathInElement(nomDeExercice, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '$', right: '$', display: false }
        ],
        // Les accolades permettent d'avoir une formule non coupée
        preProcess: (chaine: string) =>
          '{' + chaine.replaceAll(String.fromCharCode(160), '\\,') + '}',
        throwOnError: true,
        errorColor: '#CC0000',
        strict: 'warn',
        trust: false
      })
    }
  })

  /* --------------------------------------------------------------
    Gestions des icônes en début de ligne
   --------------------------------------------------------------- */
  let icon = 'bxs-message-alt'
  let rotation = '-rotate-90'
  let mouseIsOut = true
  function handleMouseOver () {
    icon = 'bx-trash'
    rotation = 'rotate-0'
    mouseIsOut = false
  }
  function handleMouseOut () {
    icon = 'bxs-message-alt'
    rotation = '-rotate-90'
    mouseIsOut = true
  }
</script>

<div
  class="relative flex flex-row mr-4 items-center text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
  ml-{nestedLevelCount * 2}"
  style="padding-left: {(nestedLevelCount * 2) / 4}rem"
>
  <div
    class="ml-[3px] pl-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest flex-1"
    bind:this={nomDeExercice}
  >
    {#if isExerciceItemInReferentiel(ending)}
      <div class="text-coopmath-corpus">{ending.id}-{ending.titre}</div>
    {:else}
      {ending.uuid}
    {/if}
  </div>
</div>
