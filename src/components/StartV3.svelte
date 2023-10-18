<script lang="ts">
  import {
    exercicesParams,
    globalOptions,
    darkMode,
    isSideMenuVisible,
    callerComponent,
    bibliothequeSectionContent
  } from './store'
  import {
    mathaleaUpdateExercicesParamsFromUrl,
    mathaleaUpdateUrlFromExercicesParams
  } from '../lib/mathalea'
  import { flip } from 'svelte/animate'
  import { onMount, setContext } from 'svelte'
  import Exercice from './exercice/Exercice.svelte'
  import Button from './forms/Button.svelte'
  import ButtonsDeck from './outils/ButtonsDeck.svelte'
  import NavBarV2 from './header/NavBarV2.svelte'
  import TwoStatesIcon from './icons/TwoStatesIcon.svelte'
  import Footer from './Footer.svelte'
  import LatexIcon from './icons/LatexIcon.svelte'
  import AmcIcon from './icons/AmcIcon.svelte'
  import MoodleIcon from './icons/MoodleIcon.svelte'
  import ChipsList from './setup/ChipsList.svelte'
  import referentielRessources from '../json/referentielRessources.json'
  import { toMap } from './utils/toMap'
  import type { ReferentielForList } from '../lib/types'
  import handleCapytale from '../lib/handleCapytale'

  let divExercices: HTMLDivElement
  let isNavBarVisible: boolean = true
  let chipsListDisplayed: boolean = false
  $: isMenuOpen = $isSideMenuVisible

  /**
   * Gestion des référentiels
   */
  import {
    type JSONReferentielObject,
    type ReferentielInMenu,
    type AppTierceGroup
  } from '../lib/types/referentiels'
  import referentielAlea from '../json/referentiel2022.json'
  import referentielStatic from '../json/referentielStatic.json'
  const baseReferentiel: JSONReferentielObject = {
    ...referentielAlea,
    static: { ...referentielStatic }
  }
  import referentielProfs from '../json/referentielProfs.json'
  const referentielOutils: JSONReferentielObject = { ...referentielProfs }
  import SideMenuBis from './sidebar/SideMenuBis.svelte'
  const referentielHtml: JSONReferentielObject = { ...referentielRessources }
  const referentiels: ReferentielInMenu[] = [
    {
      title: 'Exercices',
      referentiel: baseReferentiel
    },
    {
      title: 'Outils',
      referentiel: referentielOutils
    },
    {
      title: 'Vos ressources',
      referentiel: referentielHtml
    }
  ]
  // for (const [key, value] of Object.entries(rawRessourcesReferentiel)) {
  //   ressourcesReferentiel.content.push(value)
  // }
  // Contexte pour le modal des apps tierces
  import ModalGridOfCards from './modal/ModalGridOfCards.svelte'
  let thirdAppsChoiceModal: ModalGridOfCards
  import appsTierce from '../json/referentielAppsTierceV2.json'
  const appsTierceReferentielArray: AppTierceGroup[] = Object.values(appsTierce)
  import Card from './ui/Card.svelte'
  let showThirdAppsChoiceDialog = false
  let appsTierceInExercisesList: string[]
  $: {
    appsTierceInExercisesList = []
    const uuidList: string[] = []
    for (const entry of $exercicesParams) {
      uuidList.push(entry.uuid)
    }
    for (const group of appsTierceReferentielArray) {
      for (const app of group.liste) {
        if (uuidList.includes(app.uuid)) {
          appsTierceInExercisesList.push(app.uuid)
        }
      }
    }
    appsTierceInExercisesList = appsTierceInExercisesList
  }
  setContext('thirdAppsChoiceContext', {
    toggleThirdAppsChoiceDialog: () => {
      showThirdAppsChoiceDialog = !showThirdAppsChoiceDialog
      if (showThirdAppsChoiceDialog === false) {
        thirdAppsChoiceModal.closeModal()
      }
    }
  })
  // Contexte pour la bibliothèque de statiques
  import referentielBibliotheque from '../json/referentielBibliotheque.json'
  import BreadcrumbHeader from './sidebar/BreadcrumbHeader.svelte'
  import ImageCard from './ui/ImageCard.svelte'
  const bibliothequeReferentielArray = Array.from(
    toMap({ ...referentielBibliotheque }),
    ([key, obj]) => ({ key, obj })
  )
  const bibliothequeReferentielForSideMenu: ReferentielForList = {
    name: 'statiques',
    title: 'Exercices non aléatoires',
    content: [...bibliothequeReferentielArray],
    type: 'bibliotheque',
    activated: false
  }
  let showBibliothequeChoiceDialog = false
  let bibliothequeChoiceModal: ModalGridOfCards
  let bibliothequeUuidInExercisesList: string[]
  let bibliothequePathToSection: string[]
  $: {
    bibliothequeUuidInExercisesList = []
    const uuidList: string[] = []
    for (const entry of $exercicesParams) {
      uuidList.push(entry.uuid)
    }
    for (const exo of $bibliothequeSectionContent) {
      if (uuidList.includes(exo.uuid)) {
        bibliothequeUuidInExercisesList.push(exo.uuid)
      }
    }
    bibliothequeUuidInExercisesList = bibliothequeUuidInExercisesList
  }
  setContext('bibliothequeChoiceContext', {
    toggleBibliothequeChoiceDialog: (path: string[]) => {
      bibliothequePathToSection = path
      showBibliothequeChoiceDialog = !showBibliothequeChoiceDialog
      if (showBibliothequeChoiceDialog === false) {
        bibliothequeChoiceModal.closeModal()
      }
    }
  })

  /**
   * Démarrage
   */
  // À la construction du component ou à la navigation dans l'historique du navigateur
  // on met à jour l'url headerStart
  onMount(() => {
    // On analyse l'url pour mettre à jour l'affichage
    urlToDisplay()
    if ($globalOptions.recorder === 'capytale') {
      handleCapytale()
    }
    // Réglage du vecteur de translation pour le dé au loading
    const root = document.documentElement
    root.style.setProperty('--vect', 'calc((100vw / 10) * 0.5)')
  })
  addEventListener('popstate', urlToDisplay)

  /**
   * Gestion de l'URL
   */
  // Récupération des informations de l'URL
  let isInitialUrlHandled = false
  function urlToDisplay () {
    const urlOptions = mathaleaUpdateExercicesParamsFromUrl()
    globalOptions.update(() => {
      return urlOptions
    })
    isInitialUrlHandled = true
    zoom = Number(urlOptions.z)
  }
  // Mise à jour de l'URL dès que l'on change exercicesParams (sauf pour l'URL d'arrivée sur la page)
  $: {
    if (isInitialUrlHandled) {
      mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    }
    if ($globalOptions.v === 'l') {
      // $isSideMenuVisible = false
      isNavBarVisible = false
    } else if ($globalOptions.v === 'l2') {
      // $isSideMenuVisible = false
      isNavBarVisible = true
    } else if ($globalOptions.v === 'eleve') {
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
  let expanding: string | null = null
  let sidebarWidth = 400
  function stopResizing () {
    expanding = null
  }

  function startResizing (type: string) {
    expanding = type
  }

  function resizing (event: MouseEvent) {
    if (!expanding) return
    event.preventDefault()
    sidebarWidth = event.pageX
  }

  /**
   * Gestion de la taille des éléments affichés
   */

  let zoom: number = 1
  function zoomMinus () {
    // zoom -= 0.1
    zoom = Number.parseFloat((zoom - 0.1).toFixed(1))
    updateSize()
  }

  function zoomPlus () {
    // zoom += 0.1
    zoom = Number.parseFloat((zoom + 0.1).toFixed(1))
    updateSize()
  }

  function updateSize () {
    globalOptions.update((params) => {
      params.z = zoom.toString()
      return params
    })
    const scratchDivs = document.getElementsByClassName('scratchblocks')
    for (const scratchDiv of scratchDivs) {
      const svgDivs = scratchDiv.getElementsByTagName('svg')
      for (const svg of svgDivs) {
        if (svg.hasAttribute('data-width') === false) {
          const originalWidth = svg.getAttribute('width')
          svg.dataset.width = originalWidth
        }
        if (svg.hasAttribute('data-height') === false) {
          const originalHeight = svg.getAttribute('height')
          svg.dataset.height = originalHeight
        }
        const w =
          Number(svg.getAttribute('data-width')) * Number($globalOptions.z)
        const h =
          Number(svg.getAttribute('data-height')) * Number($globalOptions.z)
        svg.setAttribute('width', w.toString())
        svg.setAttribute('height', h.toString())
      }
    }
  }

  /**
   * Gestion des données
   */
  function newDataForAll () {
    // console.log($globalOptions, $exercicesParams)
    const newDataForAll = new window.Event('newDataForAll', {
      bubbles: true
    })
    document.dispatchEvent(newDataForAll)
  }

  /**
   * Gestion de l'interactivité
   */
  let setAllInteractifClicked: boolean = false
  function setAllInteractif () {
    const setAllInteractif = new window.Event('setAllInteractif', {
      bubbles: true
    })
    setAllInteractifClicked = true
    document.dispatchEvent(setAllInteractif)
  }

  function removeAllInteractif () {
    const removeAllInteractif = new window.Event('removeAllInteractif', {
      bubbles: true
    })
    setAllInteractifClicked = false
    document.dispatchEvent(removeAllInteractif)
  }

  /**
   *  Gestion du plain écran
   */
  function quitFullScreen () {
    globalOptions.update((params) => {
      delete params.v
      return params
    })
  }

  function fullScreen () {
    globalOptions.update((params) => {
      params.v = 'l'
      return params
    })
  }
</script>

<svelte:window on:mouseup={stopResizing} />
<div
  class="z-0 {$darkMode.isActive ? 'dark' : ''}"
  id="startComponent"
  on:mousemove={resizing}
  role="menu"
  tabindex="0"
>
  <div
    class="flex flex-col scrollbar-hide w-full h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  >
    <!-- Entête -->
    {#if isNavBarVisible}
      <div
        id="headerStart"
        class="sticky top-0 shrink-0 z-0 h-28 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden"
      >
        <NavBarV2 subtitle="Conception de document" subtitleType="design" />
      </div>
    {/if}

    <!-- Affichage Partie Gauche : Menu + Contenu -->
    <div
      class="z-40 flex-1 relative flex flex-col md:flex-row h-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    >
      <!-- Menu Choix Exos et Ressources -->
      <div class="z-40 mt-6 sm:mt-0">
        <div
          id="choiceMenuWrapper"
          class="{$globalOptions.v !== 'l'
            ? 'sm:h-[calc(100vh-7rem)]'
            : 'sm:h-screen'} sticky top-0 z-40 overflow-y-auto overscroll-contain bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
        >
          <SideMenuBis
            {referentiels}
            bind:isMenuOpen
            bind:sidebarWidth
            isMenuCloseable={$exercicesParams.length !== 0}
          />
        </div>
      </div>

      <!-- Dragbar -->
      <div
        id="dragbar"
        class="hidden {isMenuOpen
          ? 'md:flex'
          : 'md:hidden'} w-[4px] z-0 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hover:bg-coopmaths-action dark:hover:bg-coopmathsdark-action hover:cursor-col-resize overflow-y-auto"
        on:mousedown={startResizing.bind(this, 'moving')}
        role="menu"
        tabindex="0"
      />

      <!-- Affichage Partie Droite -->
      <div
        class="w-full h-screen {$globalOptions.v !== 'l'
          ? 'sm:h-[calc(100vh-7rem)]'
          : 'sm:h-screen'} z-40 sticky top-0 overflow-y-auto overscroll-contain px-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      >
        <!-- Barre de boutons  -->
        <div
          style="--sidebarWidth:{sidebarWidth}; --isMenuOpen:{isMenuOpen
            ? 1
            : 0}"
          class="{$exercicesParams.length === 0
            ? 'hidden'
            : 'relative z-50 flex flex-col justify-center items-center md:fixed  md:right-0 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas'}
            {$globalOptions.v !== 'l' ? 'md:top-28' : 'md:top-0'} transition-all duration-500 transform"
          id="barre-boutons"
        >
          <!-- Commande d'ouverture/fermeture du menu -->
          <div
            class="absolute left-0 top-0 h-10 w-10 rounded-r-lg border-l border-coopmaths-canvas-dark dark:border-coopmathsdark-canvas-dark bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark hidden min-[900px]:flex justify-center items-center"
          >
          <Button
          title=""
          icon="{isMenuOpen
            ? 'bx-x'
            : 'bx-right-arrow-alt'}"
          class="absolute right-2 top-1 text-2xl"
          on:click={() => {
            isMenuOpen = !isMenuOpen
          }}
        />
        </div>
          <ButtonsDeck barWidthPercentage={80}>
            <div
              slot="setup-buttons"
              class="flex flex-row justify-start items-center space-x-4"
            >
              <div
                class="tooltip tooltip-bottom"
                data-tip="Réduire la taille du texte"
              >
                <Button
                  title=""
                  icon="bx-zoom-out"
                  class="flex items-center text-3xl"
                  on:click={zoomMinus}
                />
              </div>
              <div
                class="tooltip tooltip-bottom"
                data-tip="Augmenter la taille du texte"
              >
                <Button
                  title=""
                  icon="bx-zoom-in"
                  class="flex items-center text-3xl"
                  on:click={zoomPlus}
                />
              </div>
              <button
                type="button"
                on:click={() => {
                  setAllInteractifClicked
                    ? removeAllInteractif()
                    : setAllInteractif()
                  // handleMenuVisibility("settings")
                }}
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip={setAllInteractifClicked
                  ? "Supprimer l'interactivité"
                  : 'Tous les exercices en interactif'}
              >
                <div class="px-2">
                  <TwoStatesIcon
                    isOnStateActive={setAllInteractifClicked}
                    size={7}
                  />
                </div>
              </button>
              <div class="tooltip tooltip-bottom" data-tip="Réorganisation">
                <Button
                  title=""
                  icon="bx-transfer"
                  class="flex items-center text-3xl rotate-90"
                  on:click={() => {
                    chipsListDisplayed = !chipsListDisplayed
                  }}
                />
              </div>
              <div class="tooltip tooltip-bottom" data-tip="Nouveaux énoncés">
                <Button
                  title=""
                  icon="bx-refresh"
                  class="flex items-center text-3xl"
                  on:click={newDataForAll}
                />
              </div>
              <div
                class="tooltip tooltip-bottom"
                data-tip="Supprimer tous les exercices"
              >
                <Button
                  title=""
                  icon="bx-trash"
                  class="text-3xl"
                  on:click={() => {
                    $exercicesParams.length = 0
                    isMenuOpen = true
                  }}
                />
              </div>
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip={$globalOptions.v !== 'l'
                  ? 'Plein écran'
                  : 'Quitter le plein écran'}
                on:click={() => {
                  // handleMenuVisibility("settings")
                  if ($globalOptions.v === 'l') {
                    quitFullScreen()
                  } else {
                    fullScreen()
                  }
                }}
              >
                <div class="px-2">
                  <TwoStatesIcon isOnStateActive={$globalOptions.v !== 'l'}>
                    <i
                      slot="icon_to_switch_on"
                      class="bx bx-exit-fullscreen text-3xl hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                    />
                    <i
                      slot="icon_to_switch_off"
                      class="bx bx-fullscreen text-3xl hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                    />
                  </TwoStatesIcon>
                </div>
              </button>
            </div>
            <div
              slot="export-buttons"
              class="flex flex-row justify-end items-center space-x-4"
            >
              <div class="tooltip tooltip-bottom" data-tip="Diaporama">
                <Button
                  title=""
                  icon="bx-slideshow"
                  class="flex items-center text-3xl"
                  on:click={() => {
                    $callerComponent = ''
                    // handleMenuVisibility("export")
                    globalOptions.update((params) => {
                      params.v = 'diaporama'
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
                  $callerComponent = ''
                  // handleMenuVisibility("export")
                  globalOptions.update((params) => {
                    params.v = 'confeleve'
                    return params
                  })
                }}
              >
                <div
                  class="relative hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                >
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
                  $callerComponent = ''
                  globalOptions.update((params) => {
                    params.v = 'latex'
                    return params
                  })
                }}
              >
                <LatexIcon
                  class="w-7 h-7 hover:fill-coopmaths-action-lightest fill-coopmaths-action dark:fill-coopmathsdark-action dark:hover:fill-coopmathsdark-action-lightest"
                />
              </button>
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="AMC"
                on:click={() => {
                  // handleMenuVisibility("export")
                  $callerComponent = ''
                  globalOptions.update((params) => {
                    params.v = 'amc'
                    return params
                  })
                }}
              >
                <AmcIcon
                  class="w-7 h-7 hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                />
              </button>
              <button
                type="button"
                class="tooltip tooltip-bottom tooltip-neutral"
                data-tip="Moodle"
                on:click={() => {
                  // handleMenuVisibility("export")
                  $callerComponent = ''
                  globalOptions.update((params) => {
                    params.v = 'moodle'
                    return params
                  })
                }}
              >
                <MoodleIcon
                  class="w-7 h-7 hover:text-coopmaths-action-lightest text-coopmaths-action dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
                />
              </button>
            </div>
          </ButtonsDeck>
          <!-- Barre des chips -->
          <div
            class="{chipsListDisplayed
              ? 'absolute top-20 sm:top-[3.25rem] right-8 flex flex-row justify-start items-center w-full p-6 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'
              : 'hidden'} "
          >
            <ChipsList />
          </div>
        </div>
        <!-- Affichage des exercices -->
        {#if $exercicesParams.length !== 0}
          <div
            id="exercisesWrapper"
            class="flex flex-col justify-between h-full mt-0 sm:mt-28 {chipsListDisplayed
              ? 'xl:mt-32'
              : 'xl:mt-24'}"
            bind:this={divExercices}
          >
            <div class="flex-1">
              <div class="flex flex-col h-full md:mt-9 lg:mt-0">
                {#each $exercicesParams as paramsExercice, i (paramsExercice)}
                  <div
                    id="exo{i}"
                    animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}
                  >
                    <Exercice
                      {paramsExercice}
                      indiceExercice={i}
                      indiceLastExercice={$exercicesParams.length}
                    />
                  </div>
                {/each}
                <!-- Pied de page -->
              </div>
            </div>
            <Footer />
          </div>
        {:else}
          <div class="relative flex-1 h-full">
            <div
              class="flex flex-col justify-between h-full text-coopmaths-corpus dark:text-coopmathsdark-corpus md:px-10 py-6 md:py-40"
            >
              <div
                class="animate-pulse flex flex-col md:flex-row justify-start space-x-6 items-center"
              >
                <div class="mt-[10px]">
                  <div class="hidden md:inline-flex">
                    <i class="bx bx-chevron-left text-[50px]" />
                  </div>
                  <div class="inline-flex md:hidden">
                    <i class="bx bx-chevron-up text-[50px]" />
                  </div>
                </div>
                <div class="font-extralight text-[50px]">
                  Sélectionner les exercices
                </div>
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
  <ModalGridOfCards
    bind:this={thirdAppsChoiceModal}
    bind:displayModal={showThirdAppsChoiceDialog}
  >
    <div slot="header">Applications</div>
    <div slot="content">
      <div class="p2">
        {#each appsTierceReferentielArray as group}
          <div class="mx-2 pt-8">
            <div class="font-bold text-2xl text-coopmaths-struct py-4">
              {group.rubrique}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              {#each group.liste as app}
                <Card
                  application={app}
                  selected={appsTierceInExercisesList.includes(app.uuid)}
                />
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </ModalGridOfCards>
  <ModalGridOfCards
    bind:this={bibliothequeChoiceModal}
    bind:displayModal={showBibliothequeChoiceDialog}
  >
    <div slot="header">
      <BreadcrumbHeader path={bibliothequePathToSection} />
    </div>
    <div slot="content">
      <div class="mx-2 pt-8">
        {#if $bibliothequeSectionContent.length === 0}
          <div>Pas d'exercices dans cette section</div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each $bibliothequeSectionContent as exercise}
              <ImageCard
                {exercise}
                selected={bibliothequeUuidInExercisesList.includes(
                  exercise.uuid
                )}
              />
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </ModalGridOfCards>
</div>

<style>
  @media (min-width: 768px) {
    #barre-boutons {
      width: calc(
        100% -
          (
            var(--isMenuOpen) * var(--sidebarWidth) * 1px + (var(--isMenuOpen)) *
              16px
          )
      );
    }
  }
  @media (max-width: 768px) {
    #barre-boutons {
      width: 100vw;
    }
  }
</style>
