<script lang="ts">
  import { onMount } from 'svelte'
  import {
    isExerciceItemInReferentiel,
    isResourceHasMonth,
    isResourceHasPlace,
    isTool,
    type JSONReferentielEnding
  } from '../../lib/types/referentiels'
  import renderMathInElement from 'katex/dist/contrib/auto-render.js'
  import { exercicesParams, globalOptions } from '../store'
  import type { InterfaceParams } from '../../lib/types'
  import { isLessThanAMonth } from '../../lib/types/dates'

  export let ending: JSONReferentielEnding
  export let nestedLevelCount: number
  const paddingTweak: number = ending.typeExercice === 'outil' || ending.typeExercice === 'html' ? nestedLevelCount + 3 : nestedLevelCount
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
    Gestions des exercices via la liste
   --------------------------------------------------------------- */
  const isPresent = (code: string) => {
    return code === ending.uuid
  }
  let selectedCount = 0
  let listeCodes: string[]
  // on compte réactivement le nombre d'occurences
  // de l'exercice dans la liste des sélectionnés
  $: {
    listeCodes = []
    for (const exo of $exercicesParams) {
      listeCodes.push(exo.uuid)
    }
    listeCodes = listeCodes
    selectedCount = listeCodes.filter(isPresent).length
  }
  /**
   * Ajouter l'exercice courant à la liste
   */
  function addToList () {
    const newExercise = {
      uuid: ending.uuid,
      interactif: '0'
    } as InterfaceParams
    if ($globalOptions.recorder === 'capytale') {
      newExercise.interactif = '1'
    }
    exercicesParams.update((list) => [...list, newExercise])
  }
  /**
   * Retirer l'exercice de la liste (si plusieurs occurences
   * la première est retirée)
   */
  function removeFromList () {
    const matchingIndex = listeCodes.findIndex(isPresent)
    exercicesParams.update((list) => [
      ...list.slice(0, matchingIndex),
      ...list.slice(matchingIndex + 1)
    ])
  }

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
  class="w-full relative flex flex-row mr-4 items-center text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark
  "
  style="padding-left: {(paddingTweak * 2) / 4}rem"
>
  <button
    class="w-full inline-flex text-start justify-start items-start hover:bg-coopmaths-action-light dark:hover:bg-coopmathsdark-action-light dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest cursor-pointer"
    on:click={addToList}
  >
    <div
      class="ml-[3px] pl-2 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest flex-1"
      bind:this={nomDeExercice}
    >
      {#if isExerciceItemInReferentiel(ending)}
        <!-- Exercice MathALÉA -->
        <div
          class="text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest"
        >
          <span class="font-bold">{ending.id} - </span>{ending.titre}
          {#if isLessThanAMonth(ending.datePublication)}
            &nbsp;<span
              class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-warn-dark dark:bg-coopmathsdark-warn-dark text-coopmaths-canvas dark:text-coopmathsdark-canvas text-[0.6rem] px-2 ml-2 font-semibold leading-normal"
              >NEW</span
            >
          {/if}
          {#if isLessThanAMonth(ending.dateModification)}
            &nbsp;<span
              class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-struct-light dark:bg-coopmathsdark-struct-light text-coopmaths-canvas dark:text-coopmathsdark-canvas text-[0.6rem] px-2 ml-2 font-semibold leading-normal"
              >MAJ</span
            >
          {/if}
        </div>
      {:else if isResourceHasPlace(ending)}
        <!-- Exercices d'annales -->
        <span class="font-bold">
          {ending.typeExercice.toUpperCase()}
          {#if isResourceHasMonth(ending)}
            {ending.mois}
          {/if}
          {ending.annee} - {ending.lieu} - {ending.numeroInitial}
        </span>
        <div>
          {#each ending.tags as tag}
            <span
              class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-struct-light dark:bg-coopmathsdark-struct-light text-coopmaths-canvas dark:text-coopmathsdark-canvas text-[0.6rem] px-2 py-px leading-snug font-semibold mr-1"
            >
              {tag}
            </span>
          {/each}
        </div>
      {:else if isTool(ending)}
        <!-- Outils -->
        <div
          class="text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest"
        >
          <span class="font-bold">{ending.id} - </span>{ending.titre}
        </div>
      {:else}
        <!-- Exercice de la bibliothèque -->
        <div class="text-coopmaths-corpus dark:text-coopmathsdark-corpus">
          <span class="font-bold">{ending.uuid}</span>
        </div>
      {/if}
    </div>
  </button>

  {#if selectedCount >= 1}
    <button
      type="button"
      class="absolute {nestedLevelCount === 4 ? 'left-4' : 'left-6'}"
      on:mouseover={handleMouseOver}
      on:focus={handleMouseOver}
      on:mouseout={handleMouseOut}
      on:blur={handleMouseOut}
      on:click={removeFromList}
      on:keydown={removeFromList}
    >
      <i
        class="text-coopmaths-action-light dark:text-coopmathsdark-action-light text-base bx {icon} {rotation}"
      />
    </button>
  {/if}
  {#if selectedCount >= 2 && mouseIsOut}
    <div
      class="absolute {nestedLevelCount === 4 ? 'left-5' : 'left-7'} text-[0.6rem] font-bold text-coopmaths-canvas dark:text-coopmathsdark-canvas-dark"
    >
      {selectedCount}
    </div>
  {/if}
</div>
