<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { tick } from "svelte"
  import { exercicesParams } from "../store"
  import type { InterfaceReferentiel } from "../../lib/types"
  import EntreeRecherche from "./EntreeRecherche.svelte"
  import Button from "../forms/Button.svelte"
  import Chip from "../forms/Chip.svelte"
  export let referentiel: object
  let searchField: HTMLInputElement

  /**
   * Renvoie tous les objets qui ont une clé uuid
   */
  export function getAllExercices(referentiel: object) {
    const exercices: InterfaceReferentiel[] = []
    function recursiveSearch(object: object) {
      Object.keys(object).forEach((key) => {
        // Les exercces "nouveaux" apparaissent en doublon dans le référentiel
        if (key === "Nouveautés") return
        //@ts-ignore
        const value = object[key]
        if (key === "uuid" && typeof value !== "object") {
          exercices.push(object as InterfaceReferentiel)
        } else if (typeof value === "object") {
          recursiveSearch(value)
        }
      })
    }
    recursiveSearch(referentiel)
    return exercices
  }

  let listeDesExercices = getAllExercices(referentiel)
  let filteredList: InterfaceReferentiel[]
  let isCanInclusDansResultats: boolean
  export let isAmcOnlySelected: boolean = false
  export let isInteractiveOnlySelected: boolean = false
  let isFiltersDisplayed: boolean = false
  let isSearchInputDisplayed: boolean = false

  $: {
    referentiel = referentiel
    listeDesExercices = getAllExercices(referentiel)
    filteredList = listeDesExercices.filter((exercice) => filtre(exercice, inputSearch, isCanInclusDansResultats))
  }
  let inputSearch: string = ""

  // function handlePressEnter(e: KeyboardEvent) {
  //   if (e.key === "Enter") {
  //     if (filteredList.length === 1) {
  //       addToList(filteredList[0])
  //     }
  //   }
  // }

  /**
   * Détermine si un exercice est dans les résultats de la recherche ou pas
   */
  function filtre(exercice: InterfaceReferentiel, inputSearch: string, isCanPossible: boolean) {
    // Les exercices statiques ont une année on les exclue de la recherche
    if (!inputSearch || exercice.annee) return false
    // Cela permet de trouver les problèmes de construction du dictionnaire
    if (!exercice.id) console.log("Manque id", exercice)
    if (inputSearch.includes("can")) {
      isCanInclusDansResultats = true
    }
    const inputs = inputSearch.split(" ")
    let results = []
    for (const input of inputs) {
      // Pour les exercices statiques exercice.titre n'existe pas
      try {
        results.push(exercice.titre && (exercice.titre.toLowerCase().includes(input.toLowerCase()) || exercice.id.toLowerCase().includes(input.toLowerCase())))
      } catch (error) {
        console.log(error)
      }
    }
    if (!isCanPossible) {
      // Pour les exercices statiques exercice.id n'existe pas
      results.push(exercice.id && !exercice.id.includes("can"))
    }
    return results.every((value) => value === true)
  }

  const dispatch = createEventDispatcher()

  function triggerAction() {
    dispatch("specific", {
      msg: "Action triggered !",
    })
  }

  // ================== Gestion du Ctrl + K et Enter  ==============================
  // POur la gestion du clavier voir
  // source : https://svelte.dev/repl/48bd3726b74c4329a186838ce645099b?version=3.46.4
  let isCtrlDown: boolean = false
  let isKDown: boolean = false
  let isEnterDown: boolean = false
  /**
   * Si Ctrl+K afficher le champ de recherche avec focus
   */
  function onCtrklK() {
    getSearchDisplayed()
  }
  function matchOnFilteredList(exoId: string) {
    for (let i = 0; i < filteredList.length; i++) {
      console.log("input[" + i + "]: " + inputSearch + " / id: " + filteredList[i].id)
      if (inputSearch === filteredList[i].id) {
        return i
      }
    }
    return null
  }
  /**
   * Si Entrée et qu'un seul exercice matche alors on ajoute l'exercice à la liste
   */
  function onEnterDown() {
    const matchingIndex = matchOnFilteredList(inputSearch)
    if (matchingIndex !== null) {
      console.log(filteredList[matchingIndex])
      const newExercise = {
        url: filteredList[matchingIndex].url,
        id: filteredList[matchingIndex].id,
        uuid: filteredList[matchingIndex].uuid,
      }
      exercicesParams.update((list) => [...list, newExercise])
      return
    }
  }
  /**
   *
   * @param event
   */
  function onKeyDown(event) {
    if (event.repeat) return
    switch (event.key) {
      case "Control":
        isCtrlDown = true
        event.preventDefault()
        break
      case "k":
        isKDown = true
        event.preventDefault()
        break
      case "Enter":
        isEnterDown = true
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

  function onKeyUp(event) {
    switch (event.key) {
      case "Control":
        isCtrlDown = false
        event.preventDefault()
        break
      case "k":
        isKDown = false
        event.preventDefault()
        break
      case "Enter":
        isEnterDown = false
        break
    }
  }

  const getSearchDisplayed = async () => {
    isSearchInputDisplayed = !isSearchInputDisplayed
    await tick()
    searchField.focus()
  }
</script>

<!-- <svelte:window on:keydown={handlePressEnter} /> -->
<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />
<div class="flex flex-row space-x-6 {isFiltersDisplayed ? 'mb-0' : 'mb-2'} justify-start items-center">
  <!-- <div class="font-bold text-large text-coopmaths-struct dark:text-coopmathsdark-struct">Recherche</div> -->
  <Button title="" icon="bx-search" on:click={getSearchDisplayed} />
  <Button
    title=""
    icon="bx-filter-alt"
    on:click={() => {
      isFiltersDisplayed = !isFiltersDisplayed
    }}
  />
  <div class="inline-flex justify-start text-sm">
    <Chip
      text="AMC"
      textColor="canvas"
      bgColor="struct"
      isVisible={isAmcOnlySelected}
      on:action={() => {
        isAmcOnlySelected = !isAmcOnlySelected
        triggerAction()
      }}
    />
    <Chip
      text="Interactif"
      textColor="canvas"
      bgColor="struct"
      isVisible={isInteractiveOnlySelected}
      on:action={() => {
        isInteractiveOnlySelected = !isInteractiveOnlySelected
        triggerAction()
      }}
    />
    <!-- <span class={isAmcOnlySelected ? "flex" : "hidden"}>AMC</span>
    <span class={isInteractiveOnlySelected ? "flex" : "hidden"}>Interactif</span> -->
  </div>
</div>
<div class="{isFiltersDisplayed ? 'flex' : 'hidden'} flex-col justify-start items-start mb-2">
  <div class="flex-row justify-start items-center pr-4 pl-6">
    <input
      id="checkbox-amc"
      aria-describedby="checkbox-amc"
      type="checkbox"
      class="w-3 h-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action rounded"
      bind:checked={isAmcOnlySelected}
      on:change={triggerAction}
    />
    <label for="checkbox-choice" class="ml-2 text-xs font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus"> Exercices compatibles AMC </label>
  </div>
  <div class="flex-row justify-start items-center pr-4 pl-6">
    <input
      id="checkbox-interactive"
      aria-describedby="checkbox-interactive"
      type="checkbox"
      class="w-3 h-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action rounded"
      bind:checked={isInteractiveOnlySelected}
      on:change={triggerAction}
    />
    <label for="checkbox-choice" class="ml-2 text-xs font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus"> Exercices interactifs </label>
  </div>
</div>
<div class="{isSearchInputDisplayed ? 'flex' : 'hidden'} flex-col">
  <div class="flex flex-col mb-4 w-full">
    <input
      type="text"
      id="searchInputField"
      class="w-full border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light text-sm"
      placeholder="Thème, identifiant..."
      bind:value={inputSearch}
      bind:this={searchField}
    />
    <div class="{matchOnFilteredList(inputSearch) !== null ? 'visible' : 'invisible'} pl-1 italic font-extralight text-xs text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest">
      Entrée pour ajouter l'exercice
    </div>
  </div>
  {#if inputSearch.length > 0}
    <div class="mb-4 text-coopmaths-struct-light dark:text-coopmathsdark-struct-light text-sm font-light">
      Inclure les courses aux nombres :
      <input
        type="checkbox"
        class="ml-2 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-2 border-transparent focus:border-2 text-coopmaths-action focus:border-coopmaths-action dark:text-coopmathsdark-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:opacity-30"
        bind:checked={isCanInclusDansResultats}
      />
    </div>
  {/if}

  {#each filteredList as exercice}
    <EntreeRecherche {exercice} />
  {/each}
</div>
