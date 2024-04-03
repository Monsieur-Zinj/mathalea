<script lang="ts">
  import { onDestroy } from 'svelte'
  import {
    isExerciceItemInReferentiel,
    resourceHasMonth,
    resourceHasPlace,
    isTool,
    type JSONReferentielEnding,
    isGeoDynamic
  } from '../../../../../../lib/types/referentiels'
  import katex from 'katex/dist/katex.js'
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  import { changes, exercicesParams, globalOptions } from '../../../../../../lib/stores/generalStore'
  import type { InterfaceParams } from '../../../../../../lib/types'
  import { isLessThanAMonth } from '../../../../../../lib/types/dates'
  import NoInteractivityIcon from '../../../../../shared/icons/NoInteractivityIcon.svelte'

  export let ending: JSONReferentielEnding
  export let nestedLevelCount: number

  let nomDeExercice: HTMLDivElement
  let selectedCount: number
  /* --------------------------------------------------------------
    Gestions des exercices via la liste
   --------------------------------------------------------------- */
  /**
   * Compare un code à UUID courante
   * @param {string} code le code de l'UUID à comparer à l'UUID courante
   * @returns {boolean} `true` si les deux chaînes sont égales
   */
  const compareCodes = (code: string): boolean => {
    return code === ending.uuid
  }
  /**
   * Compte le nombre de fois où la ressource a été sélectionnée
   * @returns {number} nb d'occurences
   */
  const countOccurences = (): number => {
    return $exercicesParams.map((item) => item.uuid).filter(compareCodes).length
  }
  // on compte réactivement le nombre d'occurences
  // de l'exercice dans la liste des sélectionnés
  const unsubscribeToExerciceParams = exercicesParams.subscribe(() => {
    selectedCount = countOccurences()
  })

  let endingTitre = ''

  $: {
    if (isExerciceItemInReferentiel(ending)) {
      endingTitre = ending.titre
      if (endingTitre.includes('$')) {
        const regexp = /(['$])(.*?)\1/g
        const matchs = endingTitre.match(regexp)
        matchs?.forEach(match => {
          endingTitre = endingTitre.replace(match, katex.renderToString(match.replaceAll('$', '')))
        })
      }
    }
    selectedCount = countOccurences()
  }

  onDestroy(unsubscribeToExerciceParams)

  /**
   * Ajouter l'exercice courant à la liste
   */
  function addToList () {
    const newExercise = {
      uuid: ending.uuid,
      interactif: isGeoDynamic(ending) ? '1' : '0'
    } as InterfaceParams
    if (isExerciceItemInReferentiel(ending) || isTool(ending)) {
      newExercise.id = ending.id
    }
    if ($globalOptions.recorder === 'capytale') {
      newExercise.interactif = '1'
    }
    exercicesParams.update((list) => [...list, newExercise])
    $changes++
  }
  /**
   * Retirer l'exercice de la liste (si plusieurs occurences
   * la première est retirée)
   */
  function removeFromList () {
    const matchingIndex = $exercicesParams
      .map((item) => item.uuid)
      .findIndex(compareCodes)
    exercicesParams.update((list) => [
      ...list.slice(0, matchingIndex),
      ...list.slice(matchingIndex + 1)
    ])
    $changes--
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

<!--
  @component
  Composant destiné à afficher les terminaisons des branches d'un référentiel.

  #### Paramètres
  **ending** (_JSONReferentielEnding_) : l'objet représentant la terminaison
  **nestedLevelCount** (_number_) : compteur du niveau d'imbrication (utilisé pour la mise en page)
 -->
<div
  class={`${$$props.class || ''} w-full flex flex-row mr-4 text-start items-start text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark`}
  style="padding-left: {(nestedLevelCount * 2) / 6}rem"
>
  <div
    class="w-full relative inline-flex text-start justify-start items-start hover:bg-coopmaths-action-light dark:hover:bg-coopmathsdark-action-light dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bg-coopmaths-canvas-darkest dark:bg-coopmathsdark-canvas-darkest cursor-pointer"
  >
    <button
      type="button"
      on:click={addToList}
      class="ml-[3px] pl-2 pr-4 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest flex-1"
    >
      <div bind:this={nomDeExercice} class="flex flex-row justify-start">
        {#if isExerciceItemInReferentiel(ending)}
          <!-- Exercice MathALÉA -->
          <div
            class="text-start text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest"
          >
            <span class="font-bold">{ending.id} - </span>{@html endingTitre}
            {#if isLessThanAMonth(ending.datePublication)}
              &nbsp;<span
                class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-warn-dark dark:bg-coopmathsdark-warn-dark text-coopmaths-canvas dark:text-coopmathsdark-canvas text-[0.6rem] px-2 ml-2 font-semibold leading-normal"
              >
                NEW
              </span>
            {/if}
            {#if isLessThanAMonth(ending.dateModification)}
              &nbsp;<span
                class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-struct-light dark:bg-coopmathsdark-struct-light text-coopmaths-canvas dark:text-coopmathsdark-canvas text-[0.6rem] px-2 ml-2 font-semibold leading-normal"
              >
                MAJ
              </span>
            {/if}
            {#if !ending.features.interactif?.isActive}
              &nbsp;<span
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="Pas d'interactivité"
              >
                <NoInteractivityIcon
                  class="inline-flex h-3 w-3 text-coopmaths-warn-dark dark:text-coopmathsdark-warn-dark fill-coopmaths-warn-dark dark:fill-coopmathsdark-warn-dark stroke-coopmaths-warn-dark dark:stroke-coopmathsdark-warn-dark"
                />
              </span>
            {/if}
          </div>
        {:else if resourceHasPlace(ending)}
          <!-- Exercices d'annales -->
          <div class="text-start">
            <span class="font-bold">
              {ending.typeExercice.toUpperCase()}
              {#if resourceHasMonth(ending)}
                {ending.mois}
              {/if}
              {ending.annee} {ending.lieu}
              {#if ending.jour !== undefined}
                [{ending.jour === 'J1' ? 'Sujet 1' : 'Sujet 2'}]
              {/if}
              - {ending.numeroInitial}
            </span>
            <div class="pl-2">
              {#each ending.tags as tag}
                <span
                  class="inline-flex flex-wrap items-center justify-center rounded-full bg-coopmaths-struct-light dark:bg-coopmathsdark-struct-light text-coopmaths-canvas dark:text-coopmathsdark-canvas text-[0.6rem] px-2 py-px leading-snug font-semibold mr-1"
                >
                  {tag}
                </span>
              {/each}
            </div>
          </div>
        {:else if isTool(ending)}
          <!-- Outils -->
          <div
            class="text-start text-coopmaths-corpus dark:text-coopmathsdark-corpus bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-canvas dark:hover:bg-coopmathsdark-canvas-darkest"
          >
            <span class="font-bold">{ending.id} - </span>{ending.titre}
          </div>
        {:else}
          <!-- Exercice de la bibliothèque -->
          <div
            class="text-start text-coopmaths-corpus dark:text-coopmathsdark-corpus"
          >
            <span class="font-bold">{ending.uuid}</span>
          </div>
        {/if}
      </div>
    </button>

    <!-- Bouton en début de ligne pour visualiser si l'exo est sélectionné,
        combien de fois et pour éventuellement le retirer de la sélection -->
    {#if selectedCount >= 1}
      <button
        type="button"
        class="absolute -left-4 -top-[0.15rem]"
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
        class="absolute -left-3 -top-0 text-[0.6rem] font-bold text-coopmaths-canvas dark:text-coopmathsdark-canvas-dark"
      >
        {selectedCount}
      </div>
    {/if}
  </div>
</div>
