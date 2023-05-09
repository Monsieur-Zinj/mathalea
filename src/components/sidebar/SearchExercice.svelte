<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { tick } from "svelte"
  import { exercicesParams } from "../store"
  import type { InterfaceReferentiel } from "../../lib/types"
  import EntreeRecherche from "./EntreeRecherche.svelte"
  import Button from "../forms/Button.svelte"
  import Filtres from "./Filtres.svelte"
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
  let filteredStaticList: InterfaceReferentiel[] = []
  let isCanInclusDansResultats: boolean
  let isFiltersDisplayed: boolean = false
  let isSearchInputDisplayed: boolean = false
  let isInputFocused = false
	function onFocusInput() { isInputFocused = true }
	function onBlurInput() { isInputFocused = false }

  let inputSearch: string = ""
  $: {
    referentiel = referentiel
    listeDesExercices = getAllExercices(referentiel)
    filteredList = listeDesExercices
      .filter((exercice) => filtre(exercice, inputSearch, true))
      .sort((exoA, exoB) => {
        const scoreA = exoA.id.startsWith("can") ? 1 : 0
        const scoreB = exoB.id.startsWith("can") ? 1 : 0
        return scoreA - scoreB
      }) // exos CAN à la fin de la liste
  }

  function buildStaticList() {
    const liste = listeDesExercices.filter((exercice) => filtreStatic(exercice, inputSearch))
    // retirer les doublons (le référentiel statique contient des classements par thèmes
    //  et années avec les mêmes exercices !!!)
    let alreadySelected: string[] = []
    filteredStaticList = liste.filter((exo) => {
      if (!alreadySelected.includes(exo.uuid)) {
        alreadySelected.push(exo.uuid)
        return true
      } else {
        return false
      }
    })
  }

  /**
   * Filtre pour les exercices statiques :
   * ### Méthode :
   * On cherche si l'exercice a un lieu. Dans ce cas, on regarde parmis tous les `tags` si un match le contenu de `inputSearch`
   * @param {InterfaceReferentiel} exercice exercice à filtrer
   * @param {string} inputSearch chaîne à chercher
   * @returns {boolean} `true` si les tags contienne un bout de la requête, `false` sinon
   * @author sylvain
   */
  const filtreStatic = (exercice, inputSearch: string) => {
    if (!inputSearch) {
      return false
    }
    if (exercice.lieu === undefined) {
      return false
    } else {
      for (const tag of exercice.tags) {
        if (tag.toLowerCase().includes(inputSearch.toLowerCase())) {
          return true
        }
      }
      return false
    }
  }

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
  function onKeyDown(event: KeyboardEvent) {
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

  function onKeyUp(event: KeyboardEvent) {
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
<div 
  class="flex flex-row space-x-2 justify-start items-center">
  <!-- <div class="font-bold text-large text-coopmaths-struct dark:text-coopmathsdark-struct">Recherche</div> -->
  <div class="relative flex flex-col w-full">
    <input
      type="text"
      id="searchInputField"
      class="w-full border border-coopmaths-action dark:border-coopmathsdark-action focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 focus:border-1 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-corpus-light dark:text-coopmathsdark-corpus-light text-sm"
      placeholder="🔍 Thème, identifiant..."
      bind:value={inputSearch}
      bind:this={searchField}
      on:focus={onFocusInput}
      on:blur={onBlurInput}
      on:input={() => {
        filteredStaticList.length = 0
        buildStaticList()
        // console.log(filteredStaticList)
      }}
    />
    <div
      class="absolute -bottom-4 {(matchOnFilteredList(inputSearch) !== null && isInputFocused)
        ? 'flex'
        : 'hidden'} items-center pl-1 italic font-extralight text-xs text-coopmaths-corpus-lightest dark:text-coopmathsdark-corpus-lightest"
    >
      Presser <span class="font-normal mx-1">Entrée</span> pour ajouter l'exercice
    </div>
  </div>
  <Button
    title=""
    icon="bx-filter-alt"
    on:click={() => {
      isFiltersDisplayed = !isFiltersDisplayed
    }}
  />
</div>
<div class="py-3">
  <Filtres isVisible={isFiltersDisplayed} on:filters />
</div>
<div class="{filteredList.length > 0 ? 'flex' : 'hidden'} flex-col my-3">
  <!-- <div class="mb-2 text-coopmaths-coprpus-light dark:text-coopmathsdark-coprpus-light text-sm font-light">
    Inclure les courses aux nombres :
    <input
      type="checkbox"
      class="ml-2 w-3 h-3 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action rounded disabled:opacity-30"
      bind:checked={isCanInclusDansResultats}
    />
  </div> -->
  {#each filteredList as exercice}
    <EntreeRecherche {exercice} />
  {/each}
</div>
<div class="{filteredStaticList.length > 0 ? 'flex' : 'hidden'} flex-col my-3">
  {#each filteredStaticList as exercice}
    <EntreeRecherche {exercice} />
  {/each}
</div>
