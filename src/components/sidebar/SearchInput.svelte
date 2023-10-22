<script lang="ts">
  import { onDestroy, tick } from 'svelte'
  import { stringToCriteria } from '../../lib/types/filters'
  import {
    isExerciceItemInReferentiel,
    isTool,
    type ExerciceItemInReferentiel,
    type ResourceAndItsPath,
    type ToolItemInReferentiel,
    type Level
  } from '../../lib/types/referentiels'
  import {
    exercicesParams,
    globalOptions
  } from '../store'
  import {
    allFilters,
    getSelectedFiltersObjects,
    handleUncheckingMutipleFilters
  } from '../filtersStore'
  import type { FilterObject, InterfaceParams } from '../../lib/types'
  import { getUniqueStringBasedOnTimeStamp, debounce } from '../utils/time'
  import Button from '../forms/Button.svelte'
  import FiltresBis from './FiltresBis.svelte'
  import Chip from '../forms/Chip.svelte'
  export let origin: ResourceAndItsPath[]
  export let results: ResourceAndItsPath[] = []
  let searchField: HTMLInputElement
  let inputSearch: string = ''
  let isFiltersVisible: boolean = false
  let selectedFilters: FilterObject<string | Level>[] = []

  function updateResults (input: string): void {
    if (input.length === 0) {
      results = []
    } else {
      results = [
        ...stringToCriteria(
          input,
          $allFilters.types.CAN.isSelected
        ).meetCriterion(origin)
      ]
    }
  }
  // maj de selectedFilters chaque fois que le store `allFilters` change
  const unsubscribeToFiltersStore = allFilters.subscribe(() => {
    selectedFilters = [...getSelectedFiltersObjects()]
  })
  onDestroy(() => {
    unsubscribeToFiltersStore()
  })
  const fetchResults = debounce<typeof updateResults>(updateResults, 500)
  $: {
    // on attend que le champ de recherche ne soit pas vide
    // ou que la chaîne saisie ne commence pas par une apostrophe ou un guillemet
    if (
      inputSearch.length !== 0 &&
      inputSearch.replace(/^[\s"']/, '').length !== 0
    ) {
      fetchResults(inputSearch)
    } else {
      results = []
    }
    results = results
  }
  // ===================================================================================
  //
  //                                Gestion du clavier
  //
  // ===================================================================================
  let isInputFocused = false
  function onFocusInput () {
    isInputFocused = true
  }
  function onBlurInput () {
    isInputFocused = false
  }
  // ================== Gestion du Ctrl + K et Enter  ==============================
  // Pour la gestion du clavier voir
  // source : https://svelte.dev/repl/48bd3726b74c4329a186838ce645099b?version=3.46.4
  let isCtrlDown: boolean = false
  let isKDown: boolean = false
  let isEnterDown: boolean = false
  /**
   * Si Ctrl+K afficher le champ de recherche avec focus
   */
  function onCtrklK () {
    getFocusOnSearchInput()
  }
  /**
   * Recherche si la chaîne de l'input correspond à une ID de la liste des résultats.
   * @returns {ExerciceItemInReferentiel|ToolItemInReferentiel|null} renvoie l'exercice trouvé ou `null`
   */
  function matchOnResultsList (
    idString: string
  ): ExerciceItemInReferentiel | ToolItemInReferentiel | null {
    for (const result of results) {
      if (
        isExerciceItemInReferentiel(result.resource) ||
        isTool(result.resource)
      ) {
        if (idString === result.resource.id) {
          return result.resource
        }
      }
    }
    return null
  }
  /**
   * Si Entrée et qu'un seul exercice matche alors on ajoute l'exercice à la liste
   */
  function onEnterDown () {
    const matchingResource = matchOnResultsList(inputSearch)
    if (matchingResource !== null) {
      const newExercise: InterfaceParams = {
        uuid: matchingResource.uuid
      }
      if ($globalOptions.recorder === 'capytale') {
        newExercise.interactif = '1'
      }
      exercicesParams.update((list) => [...list, newExercise])
    }
  }
  /**
   *
   * @param event
   */
  function onKeyDown (event: KeyboardEvent) {
    if (event.repeat) return
    switch (event.key) {
      case 'Control':
        isCtrlDown = true
        event.preventDefault()
        break
      case 'k':
        isKDown = true
        event.preventDefault()
        break
      case 'Enter':
        if (isInputFocused) {
          isEnterDown = true
        }
        event.preventDefault()
        break
    }
    if (isCtrlDown && isKDown) {
      onCtrklK()
    }
    if (isEnterDown) {
      onEnterDown()
    }
  }

  function onKeyUp (event: KeyboardEvent) {
    switch (event.key) {
      case 'Control':
        isCtrlDown = false
        event.preventDefault()
        break
      case 'k':
        isKDown = false
        event.preventDefault()
        break
      case 'Enter':
        isEnterDown = false
        break
    }
  }
  const getFocusOnSearchInput = async () => {
    await tick()
    searchField.focus()
  }
</script>

<!--
  @component
  Champ de texte pour recherche d'exercices
  ### Paramètres
  - **origin** (_ResourceAndItsPath[]_) : le référentiel à rechercher (déplier dans un tableau)
  - **result** (_ResourceAndItsPath[]_) : la liste des entrées correspondant au texte dans le champ de recherche
 -->
<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />
<div class="flex flex-col justify-start items-center">
  <div class="relative flex flex-col w-full">
    <input
      type="text"
      id="searchInputField-{getUniqueStringBasedOnTimeStamp()}"
      class="w-full border border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light text-sm"
      placeholder="🔍 Thème, identifiant..."
      bind:value={inputSearch}
      bind:this={searchField}
      on:focus={onFocusInput}
      on:blur={onBlurInput}
    />
    <!-- Invite pour presser Entrée lors d'un match input = ID d'exo -->
    <div
      class="absolute -bottom-6 {matchOnResultsList(inputSearch) !== null &&
      isInputFocused
        ? 'flex'
        : 'hidden'} items-center pl-1 italic font-extralight text-xs text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest"
    >
      Presser <span class="font-normal mx-1">Entrée</span> pour ajouter l'exercice
    </div>
    <!-- Bouton pour effacer l'input de recherche -->
    <Button
      title=""
      icon="bxs-tag-x"
      class="absolute right-2 top-1 text-2xl"
      isDisabled={inputSearch.length === 0}
      on:click={() => {
        inputSearch = ''
      }}
    />
    <!-- Bouton pour afficher les filtres -->
    <button
      type="button"
      class="absolute right-2 -bottom-6 text-sm text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
      on:click={() => {
        isFiltersVisible = !isFiltersVisible
      }}
    >
      Filtrer les exercices <i class="bx bx-filter-alt" />
    </button>
  </div>
  <!-- Chips des filtres -->
  <div
    class={selectedFilters.length === 0
      ? 'hidden'
      : 'flex w-full flex-row flex-wrap justify-start text-sm mt-6'}
  >
    {#each selectedFilters as filter}
      <Chip
        text={filter.content.title}
        textColor="canvas"
        bgColor="struct"
        isVisible={true}
        on:action={() => {
          $allFilters[filter.type][filter.key].isSelected = false
          handleUncheckingMutipleFilters(filter.key)
        }}
      />
    {/each}
  </div>
  <!-- Filtres -->
  <div class={isFiltersVisible ? 'flex flex-col w-full pt-6' : 'hidden'}>
    <FiltresBis class="mt-6" filterType="levels" />
    <FiltresBis class="mt-6" filterType="specs" />
    <FiltresBis class="mt-6" filterType="types" />
  </div>
</div>
