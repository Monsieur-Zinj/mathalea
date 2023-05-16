<script lang="ts">
  import Exercice from "./exercice/Exercice.svelte"
  import NavBarV2 from "./header/NavBarV2.svelte"
  import Footer from "./Footer.svelte"
  import { exercicesParams, globalOptions, darkMode, isExportMenuVisible, isSettingsMenuVisible, isSideMenuVisible, selectedExercises, isInIframe } from "./store"
  import referentiel from "../json/referentielProfs.json"
  import { onMount } from "svelte"
  import { toMap } from "./utils/toMap"
  import { mathaleaUpdateExercicesParamsFromUrl, mathaleaUpdateUrlFromExercicesParams } from "../lib/mathalea"
  import EntreeListeOutils from "./outils/EntreeListeOutils.svelte"

  //   const entrees = toMap(referentiel)
  let isMenuOpen: boolean = true
  let arrayReferentiel = []
  for (const [key, value] of Object.entries(referentiel)) {
    arrayReferentiel.push(value)
  }
  let isNavBarVisible: boolean = true
  let zoom: number = 1

  // Récupération des informations de l'URL
  let isInitialUrlHandled = false
  function urlToDisplay() {
    const urlOptions = mathaleaUpdateExercicesParamsFromUrl()
    globalOptions.update(() => {
      return urlOptions
    })
    isInitialUrlHandled = true
    zoom = Number(urlOptions.z)
  }

  // À la construction du component ou à la navigation dans l'historique du navigateur
  // on met à jour l'url headerStart
  onMount(() => {
    // On analyse l'url pour mettre à jour l'affichage
    urlToDisplay()
  })
  $: {
    if (isInitialUrlHandled) mathaleaUpdateUrlFromExercicesParams($exercicesParams)
  }
</script>

<div class="scrollbar-hide h-screen {$darkMode.isActive ? 'dark' : ''} bg-coopmaths-canvas dark:bg-coopmathsdark-canvas" id="startComponent">
  <!-- <Header /> -->
  {#if isNavBarVisible}
    <div id="headerStart" class="shrink-0 z-40 h-28 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden">
      <NavBarV2 subtitle="Outils pour la classe" subtitleType="design" />
    </div>
  {/if}
  <aside
    class="relative {isMenuOpen
      ? '-translate-x-0'
      : '-translate-x-full'} transition-all duration-500 transform w-72 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark min-h-full h-screen flex flex-col items-center pb-2"
  >
    <div class="w-full flex justify-start font-bold text-xl text-coopmaths-struct px-4 pt-5 pb-2">Choix des outils</div>
    <ul class="pl-4 flex flex-col">
      {#each arrayReferentiel as item, i}
        <li>
          <EntreeListeOutils outil={item} />
        </li>
      {/each}
    </ul>
    <div
      class="absolute top-0 -right-10 {isMenuOpen
        ? '-translate-x-full'
        : 'translate-x-0'}  transition-all duration-500 transform inline-flex justify-center items-center rounded-r-sm h-10 w-10 bg-coopmaths-canvas-dark"
    >
      <button
        type="button"
        on:click={() => {
          isMenuOpen = !isMenuOpen
        }}><i class="bx {isMenuOpen ? 'bx-x' : 'bx-right-arrow-alt'} scale-150 text-coopmaths-action" /></button
      >
    </div>
  </aside>
</div>
