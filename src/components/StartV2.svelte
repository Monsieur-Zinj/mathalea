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
   * Démarrage
   */
  // À la construction du component ou à la navigation dans l'historique du navigateur
  // on met à jour l'url headerStart
  onMount(() => {
    // On analyse l'url pour mettre à jour l'affichage
    urlToDisplay()
    if ($globalOptions.recorder === "capytale") {
      handleCapytale()
    }
  })
  addEventListener("popstate", urlToDisplay)

  // Mise à jour de l'URL dès que l'on change exercicesParams (sauf pour l'URL d'arrivée sur la page)
  $: {
    if (isInitialUrlHandled) mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    if ($globalOptions.v === "l") {
      // $isSideMenuVisible = false
      isNavBarVisible = false
    } else if ($globalOptions.v === "l2") {
      // $isSideMenuVisible = false
      isNavBarVisible = true
    } else if ($globalOptions.v === "eleve") {
      // $isSideMenuVisible = false
      isNavBarVisible = false
    } else {
      // $isSideMenuVisible = true
      isNavBarVisible = true
    }
  }

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

  /**
   * Gestion de la taille des éléments affichés
   */

  let zoom: number = 1
  function zoomMinus() {
    // zoom -= 0.1
    zoom = Number.parseFloat((zoom - 0.1).toFixed(1))
    updateSize()
  }

  function zoomPlus() {
    // zoom += 0.1
    zoom = Number.parseFloat((zoom + 0.1).toFixed(1))
    updateSize()
  }

  function updateSize() {
    globalOptions.update((params) => {
      params.z = zoom.toString()
      return params
    })
    const scratchDivs = document.getElementsByClassName("scratchblocks")
    for (const scratchDiv of scratchDivs) {
      const svgDivs = scratchDiv.getElementsByTagName("svg")
      for (const svg of svgDivs) {
        if (svg.hasAttribute("data-width") === false) {
          const originalWidth = svg.getAttribute("width")
          svg.dataset.width = originalWidth
        }
        if (svg.hasAttribute("data-height") === false) {
          const originalHeight = svg.getAttribute("height")
          svg.dataset.height = originalHeight
        }
        const w = svg.getAttribute("data-width") * $globalOptions.z
        const h = svg.getAttribute("data-height") * $globalOptions.z
        svg.setAttribute("width", w)
        svg.setAttribute("height", h)
      }
    }
  }

  /**
   * Gestion des données
   */
  function newDataForAll() {
    // console.log($globalOptions, $exercicesParams)
    const newDataForAll = new window.Event("newDataForAll", {
      bubbles: true,
    })
    document.dispatchEvent(newDataForAll)
  }
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
</script>

<svelte:window on:mouseup={stopResizing} />
<div class={$darkMode.isActive ? "dark" : ""} id="startComponent" on:mousemove={resizing}>
  <div class="flex flex-col scrollbar-hide w-full h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <!-- Entête -->
    {#if isNavBarVisible}
      <div id="headerStart" class="sticky top-0 shrink-0 z-50 h-28 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden">
        <NavBarV2 subtitle="Conception de document" subtitleType="design" />
      </div>
    {/if}

    <!-- Menu + Contenu -->
    <div class="flex-1 flex grow flex-col md:flex-row h-full overflow-y-hidden bg-coopmaths-canvas">
      <!-- Menu Choix Exos et Ressources -->
      <div class="mt-6 sm:mt-0">
        <div id="choiceMenuWrapper" class="flex-1 overflow-y-hidden">
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
      <div class="flex-1 relative overflow-y-auto w-full min-h-full px-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
        <!-- Barre de boutons -->
        <div class="absolute top-0 w-full bg-coopmaths-canvas" id="barre-boutons">
          <ButtonsDeck>
            <div slot="setup-buttons" class="flex flex-row justify-start items-center space-x-4">
              <div class="tooltip tooltip-bottom" data-tip="Réduire la taille du texte"><Button title="" icon="bx-zoom-out" classDeclaration="flex items-center text-3xl" on:click={zoomMinus} /></div>
              <div class="tooltip tooltip-bottom" data-tip="Augmenter la taille du texte"><Button title="" icon="bx-zoom-in" classDeclaration="flex items-center text-3xl" on:click={zoomPlus} /></div>
              <div class="tooltip tooltip-bottom" data-tip="Nouveaux énoncés"><Button title="" icon="bx-refresh" classDeclaration="flex items-center text-3xl" on:click={newDataForAll} /></div>
              <div class="tooltip tooltip-bottom" data-tip="Supprimer tous les exercices">
                <Button
                  title=""
                  icon="bx-trash"
                  classDeclaration="text-3xl"
                  on:click={() => {
                    $exercicesParams.length = 0
                  }}
                />
              </div>
            </div>
          </ButtonsDeck>
        </div>
        <!-- Affichage des exercices -->
        {#if $exercicesParams.length !== 0}
          <div id="exercisesWrapper" class="flex flex-col justify-between h-full" bind:this={divExercices}>
            <div class="flex-1">
              <div class="flex flex-col h-full md:mt-9 lg:mt-0">
                {#each $exercicesParams as paramsExercice, i (paramsExercice)}
                  <div id="exo{i}" animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}>
                    <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length} />
                  </div>
                {/each}
                <!-- Pied de page -->
              </div>
            </div>
            <Footer />
          </div>
        {:else}
          <div class="relative flex-1 h-full">
            <div class="flex flex-col justify-between h-full text-coopmaths-corpus dark:text-coopmathsdark-corpus md:px-10 py-6 md:py-40">
              <div class="animate-pulse flex flex-col md:flex-row justify-start space-x-6 items-center">
                <div class="mt-[10px]">
                  <div class="hidden md:inline-flex"><i class="bx bx-chevron-left text-[50px]" /></div>
                  <div class="inline-flex md:hidden"><i class="bx bx-chevron-up text-[50px]" /></div>
                </div>
                <div class="font-extralight text-[50px]">Sélectionner les exercices</div>
              </div>
              <!-- Pied de page -->
              <div class="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Footer />
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
