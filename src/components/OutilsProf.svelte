<script lang="ts">
  import Exercice from "./exercice/Exercice.svelte"
  import NavBarV2 from "./header/NavBarV2.svelte"
  import Footer from "./Footer.svelte"
  import { exercicesParams, globalOptions, darkMode, isExportMenuVisible, isSettingsMenuVisible, isSideMenuVisible, selectedExercises, isInIframe } from "./store"
  import referentiel from "../json/referentielProfs.json"
  import { flip } from "svelte/animate"
  import { onMount } from "svelte"
  import { mathaleaUpdateExercicesParamsFromUrl, mathaleaUpdateUrlFromExercicesParams } from "../lib/mathalea"
  import EntreeListeOutils from "./outils/EntreeListeOutils.svelte"
  import SideMenuOutils from "./outils/SideMenuOutils.svelte"

  //   const entrees = toMap(referentiel)
  let isMenuOpen: boolean = true
  let arrayReferentiel = []
  let divExercices: HTMLDivElement
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
  <div class="flex flex-col md:flex-row w-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <div class="w-full md:w-5/12 lg:w-4/12 xl:w-3/12 mt-6 md:mt-8 lg:mt-0">
      <SideMenuOutils referentiel={arrayReferentiel} />
    </div>
    <div class="w-full md:w-7/12 lg:w-8/12 xl:w-9/12">
      {#if $exercicesParams.length !== 0}
        <div id="exercisesWrapper" class="relative flex flex-col px-6 w-full min-h-[calc(100vh-7rem)] overflow-y-auto" bind:this={divExercices}>
          <div class="flex-1 md:mt-9 lg:mt-0">
            {#each $exercicesParams as paramsExercice, i (paramsExercice)}
              <div id="exo{i}" animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}>
                <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length} />
              </div>
            {/each}
          </div>
          <Footer />
        </div>
      {:else}
        <div class="relative flex flex-col h-[calc(100vh-7em)] justify-start text-coopmaths-corpus dark:text-coopmathsdark-corpus md:px-10 py-6 md:py-40">
          <div class="animate-pulse h-full flex flex-col md:flex-row justify-start space-x-6 items-center">
            <div class="mt-[10px]">
              <div class="hidden md:inline-flex"><i class="bx bx-chevron-left text-[50px]" /></div>
              <div class="inline-flex md:hidden"><i class="bx bx-chevron-up text-[50px]" /></div>
            </div>
            <div class="font-extralight text-[50px]">Sélectionner les outils</div>
          </div>
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2">
            <Footer />
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
