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
<div class={$darkMode.isActive ? "dark" : ""} id="startComponent" on:mousemove={resizing}>
  <div class="scrollbar-hide w-full h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <!-- Entête -->
    {#if isNavBarVisible}
      <div id="headerStart" class="shrink-0 z-40 h-28 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden">
        <NavBarV2 subtitle="Conception de document" subtitleType="design" />
      </div>
    {/if}

    <!-- Menu + Contenu -->
    <div class="flex flex-col md:flex-row bg-coopmaths-canvas">
      <!-- Menu Choix Exos et Ressources -->
      <div class="mt-6 sm:mt-0">
        <div id="choiceMenuWrapper">
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
          : 'md:hidden'} w-[4px] bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-action dark:hover:bg-coopmathsdark-action hover:cursor-col-resize"
        on:mousedown={startResizing.bind(this, "moving")}
      />
    </div>
  </div>
</div>
