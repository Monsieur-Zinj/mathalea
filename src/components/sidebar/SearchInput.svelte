<script lang="ts">
  import { tick } from 'svelte'
  import { stringToCriteria } from '../../lib/types/filters'
  import {
    isExerciceItemInReferentiel,
    isTool,
    type ExerciceItemInReferentiel,
    type ResourceAndItsPath,
    type ToolItemInReferentiel
  } from '../../lib/types/referentiels'
  import { exercicesParams, globalOptions, selectedFilters } from '../store'
  import type { InterfaceParams } from '../../lib/types'
  import { getUniqueStringBasedOnTimeStamp, debounce } from '../utils/time'
  import Button from '../forms/Button.svelte'
  export let origin: ResourceAndItsPath[]
  export let results: ResourceAndItsPath[] = []
  let searchField: HTMLInputElement
  let inputSearch: string = ''

  function updateResults (input: string): void {
    if (input.length === 0) {
      results = []
    } else {
      results = [
        ...stringToCriteria(
          input,
          $selectedFilters.types.CAN.isSelected
        ).meetCriterion(origin)
      ]
    }
  }
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
<div class="flex flex-col space-x-2 justify-start items-center">
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
    <div
      class="absolute -bottom-4 {matchOnResultsList(inputSearch) !== null &&
      isInputFocused
        ? 'flex'
        : 'hidden'} items-center pl-1 italic font-extralight text-xs text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest"
    >
      Presser <span class="font-normal mx-1">Entrée</span> pour ajouter l'exercice
    </div>
    <div>
      <Button
        title=""
        icon="bx-x"
        classDeclaration="absolute right-2 top-1 text-2xl"
        isDisabled={inputSearch.length === 0}
        on:click={() => {
          inputSearch = ''
        }}
      />
    </div>
  </div>
</div>
