<script lang="ts">
  import { exercicesParams, globalOptions } from "./store"
  import SideMenu from "./sidebar/SideMenu.svelte"
  import SideMenuList from "./sidebar/SideMenuList.svelte"
  import { mathaleaUpdateExercicesParamsFromUrl, mathaleaUpdateUrlFromExercicesParams, mathaleaGenerateSeed } from "../lib/mathalea"
  import { buildUrlAddendumForEsParam } from "./utils/urls"
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
  import FormRadio from "./forms/FormRadio.svelte"
  import ButtonToggle from "./forms/ButtonToggle.svelte"

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

  // Gestion de la graine
  let isDataRandom: boolean = false
  function handleSeed() {
    for (const param of $exercicesParams) {
      if (!isDataRandom && param.alea === undefined) {
        param.alea = mathaleaGenerateSeed()
      } else {
        param.alea = undefined
      }
    }
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
  }

  function handleEleveVueSetUp() {
    handleSeed()
    let url = document.URL.split("?")[0]
    for (const [i, exo] of $exercicesParams.entries()) {
      if (i === 0) {
        url += `?uuid=${exo.uuid}&id=${exo.id}`
      } else {
        url += `&uuid=${exo.uuid}&id=${exo.id}`
      }
      if (exo.alea) {
        url += `&alea=${exo.alea}`
      }
    }
    url += "&v=eleve"
    url += "&title=" + $globalOptions.title
    url += "&es=" + buildUrlAddendumForEsParam(false)
    window.open(url, "_blank").focus()
  }
</script>

<svelte:window on:mouseup={stopResizing} />

<div class="scrollbar-hide h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas" id="startComponent" on:mousemove={resizing}>
  <!-- En-tête -->
  <div id="headerCapytale" class="bg-coopmaths-canvas">
    <NavBarIframe>
      <div slot="buttons" class="w-full">
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
      </div>
    </NavBarIframe>
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
    <div slot="content">
      <div class="pt-2 pl-2 grid grid-flow-row md:grid-cols-2 gap-4">
        <div class="pb-2">
          <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Titre</div>
          <div class="pl-4 flex flex-col">
            <input
              type="text"
              class="w-1/2 text-sm bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus border-1 border-coopmaths-action dark:border-coopmathsdark-action font-light focus:border-1 focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0"
              bind:value={$globalOptions.title}
            />
            <div class="mt-1 text-coopmaths-corpus font-light italic text-xs {$globalOptions.title.length === 0 ? '' : 'invisible'}">Pas de bandeau si laissé vide.</div>
          </div>
        </div>
        <div class="pb-2">
          <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Présentation</div>
          <FormRadio
            title="présentation"
            bind:valueSelected={$globalOptions.presMode}
            labelsValues={[
              { label: "Tous les exercices sur une page", value: "liste_exos" },
              { label: "Une page par exercice", value: "un_exo_par_page", isDisabled: $exercicesParams.length === 1 },
              { label: "Toutes les questions sur une page", value: "liste_questions" },
              { label: "Une page par question", value: "une_question_par_page" },
            ]}
          />
        </div>
        <div class="pb-2">
          <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Interactivité</div>
          <FormRadio
            title="Interactif"
            bind:valueSelected={$globalOptions.setInteractive}
            labelsValues={[
              { label: "Laisser tel quel", value: "2" },
              { label: "Tout interactif", value: "1" },
              { label: "Pas d'interactivité", value: "0" },
            ]}
          />
          <div class="pl-2 pt-2">
            <ButtonToggle
              isDisabled={$globalOptions.setInteractive === "0"}
              titles={["Les élèves peuvent modifier l'interactivité", "Les élèves ne peuvent pas modifier l'interactivité"]}
              bind:value={$globalOptions.isInteractiveFree}
            />
          </div>
          <div class="pl-2 pt-2">
            <ButtonToggle
              isDisabled={$globalOptions.setInteractive === "0"}
              titles={["Les élèves peuvent répondre une seule fois", "Les élèves peuvent répondre plusieurs fois"]}
              bind:value={$globalOptions.oneShot}
            />
          </div>
        </div>
        <div class="pb-2">
          <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Données</div>
          <div class="flex justify-start-items-center pl-2 font-light text-sm text-coopmaths-corpus-light">Tous les élèves auront des pages :</div>
          <div class="flex flex-row justify-start items-center px-4">
            <ButtonToggle titles={["identiques", "différentes"]} bind:value={isDataRandom} on:click={handleSeed} />
          </div>
        </div>
        <div class="pb-2">
          <div class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light {$globalOptions.setInteractive !== '0' ? 'text-opacity-20' : 'text-opacity-100'}">
            Correction
          </div>
          <div class="flex flex-row justify-start items-center px-4">
            <ButtonToggle titles={["Accès aux corrections", "Pas de corrections"]} isDisabled={$globalOptions.setInteractive !== "0"} bind:value={$globalOptions.isSolutionAccessible} />
          </div>
        </div>
      </div>

      <div class="flex flex-row justify-end">
        <div class="pt-4 pb-8 px-4">
          <Button on:click={handleEleveVueSetUp} title="Visualiser" />
        </div>
      </div>
    </div>
  </ModalSettingsCapytale>
</div>

<style>
  #exercisesWrapper {
    height: calc(100vh - 4rem);
    min-height: 100%;
  }
</style>
