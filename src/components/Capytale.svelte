<script lang="ts">
  import { exercicesParams, globalOptions } from "./store"
  import SideMenu from "./sidebar/SideMenu.svelte"
  import SideMenuList from "./sidebar/SideMenuList.svelte"
  import { mathaleaUpdateExercicesParamsFromUrl, mathaleaUpdateUrlFromExercicesParams } from "../lib/mathalea"
  import handleCapytale from "../lib/handleCapytale"
  import { flip } from "svelte/animate"
  import { onMount } from "svelte"
  import type { InterfaceReferentiel, ReferentielForList } from "src/lib/types"
  import { updateReferentiel } from "./utils/referentielsUtils"
  import Exercice from "./exercice/Exercice.svelte"
  import Button from "./forms/Button.svelte"
  import ButtonsDeck from "./outils/ButtonsDeck.svelte"
  import NavBarIframe from "./header/NavBarIframe.svelte"
  import ModalSettingsCapytale from "./modal/ModalSettingsCapytale.svelte"

  let showSettingsDialog = false
  let isMenuOpen: boolean = true
  let divExercices: HTMLDivElement
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
    handleCapytale()
  })
  $: {
    if (isInitialUrlHandled) mathaleaUpdateUrlFromExercicesParams($exercicesParams)
  }

  // Constitution du référentiel pour afficher les exercices
  let isInteractiveOnlySelected: boolean = false
  let isAmcOnlySelected: boolean = false
  // Construction pour affichage dans SideMenu du tableau des entrées du référentiel
  let sideMenuListReferentiel: ReferentielForList = { title: "Choix des exercices", content: [], type: "exercices" }
  let itemsSelected = []
  const arrayReferentielFiltre = updateReferentiel(false, false, itemsSelected)
  sideMenuListReferentiel.content = [...arrayReferentielFiltre]

  /**
   * Gestion du redimentionnement de la largeur du menu des choix
   */
  let expanding = null
  let sidebarWidth = 600
  let sbWidth = sidebarWidth
  function stopResizing() {
    expanding = null
  }

  function startResizing(type, event: MouseEvent) {
    expanding = type
  }

  function resizing(event: MouseEvent) {
    if (!expanding) return
    event.preventDefault()
    sidebarWidth = event.pageX
  }

  // Gestion du zoom
  let zoom: number = 1
  function zoomOut() {
    zoom -= 0.25
    updateSize()
  }

  function zoomIn() {
    zoom += 0.25
    updateSize()
  }

  function updateSize() {
    globalOptions.update((params) => {
      params.z = zoom.toString()
      return params
    })
  }

  // Gestion des nouvelles données pour tous les exercices
  function newDataForAll() {
    const newDataForAll = new window.Event("newDataForAll", {
      bubbles: true,
    })
    document.dispatchEvent(newDataForAll)
  }
</script>

<svelte:window on:mouseup={stopResizing} />

<div class="scrollbar-hide h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas" id="startComponent" on:mousemove={resizing}>
  <!-- En-tête -->
  <div id="headerCapytale" class="bg-coopmaths-canvas">
    <NavBarIframe />
  </div>
  <div class="flex flex-col md:flex-row w-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <!-- Sidebar -->
    <div id="choiceMenuWrapper" class="mt-6 md:mt-8 lg:mt-0">
      <SideMenu bind:isMenuOpen isMenuCloseable={$exercicesParams.length !== 0} bind:sidebarWidth referentiels={[sideMenuListReferentiel]} />
    </div>
    <!-- Dragbar -->
    <div
      id="dragbar"
      class="hidden {isMenuOpen
        ? 'md:flex'
        : 'md:hidden'} w-[4px] bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-action dark:hover:bg-coopmathsdark-action hover:cursor-col-resize"
      on:mousedown={startResizing.bind(this, "moving")}
    />
    <!-- Barre des boutons de réglages -->
    <div class="w-full">
      <ButtonsDeck>
        <div slot="setup-buttons" class="flex flex-row justify-start items-center space-x-4">
          <Button title="" icon="bx-zoom-out" classDeclaration="text-3xl" on:click={zoomOut} />
          <Button title="" icon="bx-zoom-in" classDeclaration="text-3xl" on:click={zoomIn} />
          <Button title="" icon="bx-refresh" classDeclaration="text-3xl" on:click={newDataForAll} />
          <Button
            title=""
            icon="bx-trash"
            classDeclaration="text-3xl"
            on:click={() => {
              $exercicesParams.length = 0
            }}
          />
        </div>
        <div slot="export-buttons" class="flex flex-row justify-start items-center space-x-4">
          <Button
            title=""
            icon="bx-cog"
            classDeclaration="text-3xl"
            isDisabled={$exercicesParams.length === 0}
            on:click={() => {
              showSettingsDialog = true
            }}
          />
        </div>
      </ButtonsDeck>
      <!-- Affichage des exercices -->
      {#if $exercicesParams.length !== 0}
        <div id="exercisesWrapper" class="relative flex flex-col px-6 w-full min-h-[calc(100vh-7rem)] overflow-y-auto" bind:this={divExercices}>
          <div class="flex-1 md:mt-9 lg:mt-0">
            {#each $exercicesParams as paramsExercice, i (paramsExercice)}
              <div id="exo{i}" animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}>
                <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length} />
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="relative flex flex-col h-[calc(100vh-7em)] justify-start text-coopmaths-corpus dark:text-coopmathsdark-corpus md:px-10 py-6 md:py-40">
          <div class="animate-pulse h-full flex flex-col md:flex-row justify-start space-x-6 items-center">
            <div class="mt-[10px]">
              <div class="hidden md:inline-flex"><i class="bx bx-chevron-left text-[50px]" /></div>
              <div class="inline-flex md:hidden"><i class="bx bx-chevron-up text-[50px]" /></div>
            </div>
            <div class="font-extralight text-[50px]">Sélectionner les exercices</div>
          </div>
        </div>
      {/if}
    </div>
  </div>
  <ModalSettingsCapytale bind:showSettingsDialog>
    <div slot="header">Réglages de l'affichage des exercices</div>
    <div slot="content">Blabla</div>
  </ModalSettingsCapytale>
</div>

<style>
  #exercisesWrapper {
    height: calc(100vh - 4rem);
    min-height: 100%;
  }
</style>
