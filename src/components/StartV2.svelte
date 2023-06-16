<script lang="ts">
  import { exercicesParams, globalOptions, darkMode, isSideMenuVisible } from "./store"
  import SideMenu from "./sidebar/SideMenu.svelte"
  import { mathaleaUpdateExercicesParamsFromUrl, mathaleaUpdateUrlFromExercicesParams, mathaleaGenerateSeed } from "../lib/mathalea"
  import { buildUrlAddendumForEsParam } from "./utils/urls"
  import { flip } from "svelte/animate"
  import { onMount } from "svelte"
  import { updateReferentiel } from "./utils/referentielsUtils"
  import Exercice from "./exercice/Exercice.svelte"
  import Button from "./forms/Button.svelte"
  import ButtonsDeck from "./outils/ButtonsDeck.svelte"
  import NavBarV2 from "./header/NavBarV2.svelte"
  import Footer from "./Footer.svelte"

  let isNavBarVisible: boolean = true
  let divExercices: HTMLDivElement
  $: isMenuOpen = $isSideMenuVisible

  /**
   * Gestion du redimentionnement de la largeur du menu des choix
   */
  let expanding = null
  let sidebarWidth = 400
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
  /**
   * Gestion du référentiel
   */
  let isInteractiveOnlySelected: boolean = false
  let isAmcOnlySelected: boolean = false
  // Construction pour affichage dans SideMenu du tableau des entrées du référentiel
  let itemsSelected: string[] = []
  let arrayReferentielFiltre = updateReferentiel(false, false, itemsSelected)
  // sideMenuListReferentiel.content = [...arrayReferentielFiltre]
  $: sideMenuListReferentiel = { title: "Choix des exercices", content: [...arrayReferentielFiltre], type: "exercices" }

  /**
   * Gestion des filtres
   */
  function updateFilters(filters) {
    let itemsAccepted = [...filters.levels]
    if (filters.types.includes("static")) {
      itemsAccepted = [...itemsAccepted, "static"]
    }
    // console.log(itemsAccepted)
    isAmcOnlySelected = filters.types.includes("amc")
    isInteractiveOnlySelected = filters.types.includes("interactif")
    arrayReferentielFiltre = updateReferentiel(isAmcOnlySelected, isInteractiveOnlySelected, itemsAccepted)
  }
</script>

<svelte:window on:mouseup={stopResizing} />
<div class="scrollbar-hide {$darkMode.isActive ? 'dark' : ''}" id="startComponent" on:mousemove={resizing}>
  <div class="w-full h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <!-- Entête -->
    {#if isNavBarVisible}
      <div id="headerStart" class="shrink-0 z-50 h-28 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden">
        <NavBarV2 subtitle="Conception de document" subtitleType="design" />
      </div>
    {/if}

    <!-- Menu + Contenu -->
    <div class="flex flex-col md:flex-row bg-coopmaths-canvas">
      <!-- Menu Choix Exos et Ressources -->
      <div class="mt-6 sm:mt-0">
        <div id="choiceMenuWrapper" class="flex-1 overflow-y-auto">
          <SideMenu
            bind:isMenuOpen
            isMenuCloseable={$exercicesParams.length !== 0}
            bind:sidebarWidth
            referentiels={[sideMenuListReferentiel]}
            on:filters={(e) => {
              updateFilters(e.detail)
            }}
          />
        </div>
      </div>

      <!-- Dragbar -->
      <div
        id="dragbar"
        class="hidden {isMenuOpen
          ? 'md:flex'
          : 'md:hidden'} w-[4px] bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-action dark:hover:bg-coopmathsdark-action hover:cursor-col-resize overflow-y-auto"
        on:mousedown={startResizing.bind(this, "moving")}
      />

      <!-- Affichage des exercices -->
      <div class="w-full">
        {#if $exercicesParams.length !== 0}
          <div id="exercisesWrapper" class="relative flex flex-col w-full px-6 overflow-y-auto" bind:this={divExercices}>
            <div class="flex-1 md:mt-9 lg:mt-0">
              {#each $exercicesParams as paramsExercice, i (paramsExercice)}
                <div id="exo{i}" animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}>
                  <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length} />
                </div>
              {/each}
            </div>
          </div>
        {:else}
          <div class="relative flex flex-col justify-start text-coopmaths-corpus dark:text-coopmathsdark-corpus md:px-10 py-6 md:py-40">
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
  </div>
</div>
