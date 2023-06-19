<script lang="ts">
  import { exercicesParams, globalOptions, darkMode, isSideMenuVisible, callerComponent } from "./store"
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
  import InteractivityIcon from "./icons/TwoStatesIcon.svelte"
  import FullScreenIcon from "./icons/TwoStatesIcon.svelte"
  import Footer from "./Footer.svelte"
  import SideMenuList from "./sidebar/SideMenuList.svelte"
  import LatexIcon from "./icons/LatexIcon.svelte"
  import AmcIcon from "./icons/AmcIcon.svelte"
  import MoodleIcon from "./icons/MoodleIcon.svelte"
  import ChipsList from "./setup/ChipsList.svelte"

  let isNavBarVisible: boolean = true
  let chipsListDisplayed: boolean = false
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
  // Construction pour affichage dans SideMenu du tableau des entrées du référentiel
  let itemsSelected: string[] = []
  let arrayReferentielFiltre = updateReferentiel(false, false, itemsSelected)
  // sideMenuListReferentiel.content = [...arrayReferentielFiltre]
  $: sideMenuListReferentiel = { title: "Choix des exercices", content: [...arrayReferentielFiltre], type: "exercices" }

  /**
   * Gestion des filtres
   */
  let isInteractiveOnlySelected: boolean = false
  let isAmcOnlySelected: boolean = false
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

  /**
   * Gestion de l'interactivité
   */
  let setAllInteractifClicked: boolean = false
  function setAllInteractif() {
    const setAllInteractif = new window.Event("setAllInteractif", {
      bubbles: true,
    })
    setAllInteractifClicked = true
    document.dispatchEvent(setAllInteractif)
  }

  function removeAllInteractif() {
    const removeAllInteractif = new window.Event("removeAllInteractif", {
      bubbles: true,
    })
    setAllInteractifClicked = false
    document.dispatchEvent(removeAllInteractif)
  }

  /**
   *  Gestion du plain écran
   */
  function quitFullScreen() {
    globalOptions.update((params) => {
      delete params.v
      return params
    })
  }

  function fullScreen() {
    globalOptions.update((params) => {
      params.v = "l"
      return params
    })
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

    <!-- Affichage Partie Gauche : Menu + Contenu -->
    <div class="flex-1 relative flex grow flex-col md:flex-row h-full sm:overflow-y-hidden bg-coopmaths-canvas">
      <!-- Menu Choix Exos et Ressources -->
      <div class="mt-6 sm:mt-0">
        <div id="choiceMenuWrapper" class="flex-1 sm:overflow-y-hidden">
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

      <!-- Affichage Partie Droite -->
      <div class="flex-1 overflow-y-auto w-full min-h-full px-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
        <!-- Barre de boutons  -->
        <div
          style="--sidebarWidth:{sidebarWidth}; --isMenuOpen:{isMenuOpen ? 1 : 0}"
          class={$exercicesParams.length === 0 ? "hidden" : "z-50 flex flex-col justify-center items-center md:absolute md:top-0 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"}
          id="barre-boutons"
        >
          <ButtonsDeck barWidthPercentage={80}>
            <div slot="setup-buttons" class="flex flex-row justify-start items-center space-x-4">
              <div class="tooltip tooltip-bottom" data-tip="Réduire la taille du texte">
                <Button title="" icon="bx-zoom-out" classDeclaration="flex items-center text-3xl" on:click={zoomMinus} />
              </div>
              <div class="tooltip tooltip-bottom" data-tip="Augmenter la taille du texte">
                <Button title="" icon="bx-zoom-in" classDeclaration="flex items-center text-3xl" on:click={zoomPlus} />
              </div>
              <button
                type="button"
                on:click={() => {
                  setAllInteractifClicked ? removeAllInteractif() : setAllInteractif()
                  // handleMenuVisibility("settings")
                }}
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip={setAllInteractifClicked ? "Supprimer l'interactivité" : "Tous les exercices en interactif"}
              >
                <div class="px-2">
                  <InteractivityIcon isOnStateActive={setAllInteractifClicked} size={7} />
                </div>
              </button>
              <div class="tooltip tooltip-bottom" data-tip="Réorganisation">
                <Button
                  title=""
                  icon="bx-transfer"
                  classDeclaration="flex items-center text-3xl rotate-90"
                  on:click={() => {
                    chipsListDisplayed = !chipsListDisplayed
                  }}
                />
              </div>
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
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip={$globalOptions.v !== "l" ? "Plein écran" : "Quitter le plein écran"}
                on:click={() => {
                  // handleMenuVisibility("settings")
                  if ($globalOptions.v === "l") {
                    quitFullScreen()
                  } else {
                    fullScreen()
                  }
                }}
              >
                <div class="px-2">
                  <FullScreenIcon isOnStateActive={$globalOptions.v !== "l"}>
                    <i
                      slot="icon_to_switch_on"
                      class="bx bx-exit-fullscreen text-3xl hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                    />
                    <i
                      slot="icon_to_switch_off"
                      class="bx bx-fullscreen text-3xl hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                    />
                  </FullScreenIcon>
                </div>
              </button>
            </div>
            <div slot="export-buttons" class="flex flex-row justify-end items-center space-x-4">
              <div class="tooltip tooltip-bottom" data-tip="Diaporama">
                <Button
                  title=""
                  icon="bx-slideshow"
                  classDeclaration="flex items-center text-3xl"
                  on:click={() => {
                    $callerComponent = ""
                    // handleMenuVisibility("export")
                    globalOptions.update((params) => {
                      params.v = "diaporama"
                      return params
                    })
                  }}
                />
              </div>
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="Lien pour les élèves"
                on:click={() => {
                  $callerComponent = ""
                  // handleMenuVisibility("export")
                  globalOptions.update((params) => {
                    params.v = "confeleve"
                    return params
                  })
                }}
              >
                <div class="relative hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest">
                  <i class="bx text-3xl bx-link" />
                  <div class="absolute -bottom-1 -right-1">
                    <i class="scale-75 bx bx-xs bxs-graduation" />
                  </div>
                </div>
              </button>
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="LaTeX"
                on:click={() => {
                  // handleMenuVisibility("export")
                  $callerComponent = ""
                  globalOptions.update((params) => {
                    params.v = "latex"
                    return params
                  })
                }}
              >
                <LatexIcon class="w-7 h-7 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest" />
              </button>
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="AMC"
                on:click={() => {
                  // handleMenuVisibility("export")
                  $callerComponent = ""
                  globalOptions.update((params) => {
                    params.v = "amc"
                    return params
                  })
                }}
              >
                <AmcIcon class="w-7 h-7 hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
              </button>
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="LaTeX"
                on:click={() => {
                  // handleMenuVisibility("export")
                  $callerComponent = ""
                  globalOptions.update((params) => {
                    params.v = "moodle"
                    return params
                  })
                }}
              >
                <MoodleIcon class="w-7 h-7 hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest" />
              </button>
            </div>
          </ButtonsDeck>

          <!-- Barre des chips -->
          <div class="{chipsListDisplayed ? 'flex flex-row justify-start items-center w-full p-6 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark' : 'hidden'} ">
            <ChipsList />
          </div>
        </div>
        <!-- Affichage des exercices -->
        {#if $exercicesParams.length !== 0}
          <div id="exercisesWrapper" class="flex flex-col justify-between h-full mt-0 sm:mt-28 xl:mt-14" bind:this={divExercices}>
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

<style>
  @media (min-width: 768px) {
    #barre-boutons {
      width: calc(96vw - (var(--isMenuOpen) * var(--sidebarWidth) * 1px + (1 - var(--isMenuOpen)) * 20px));
    }
  }
  @media (max-width: 768px) {
    #barre-boutons {
      width: 90vw;
    }
  }
</style>
