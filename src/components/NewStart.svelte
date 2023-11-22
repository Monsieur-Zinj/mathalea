<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import {
    bibliothequeDisplayedContent,
    bibliothequePathToSection,
    darkMode,
    exercicesParams,
    globalOptions,
    isModalForStaticsVisible
  } from './stores/generalStore'
  import {
    mathaleaUpdateExercicesParamsFromUrl,
    mathaleaUpdateUrlFromExercicesParams
  } from '../lib/mathalea'
  import handleCapytale from '../lib/handleCapytale'
  import NavBar from './header/NavBar.svelte'
  import SideMenu from './sidebar/SideMenu.svelte'
  import { Collapse, Ripple, initTE } from 'tw-elements'
  import { flip } from 'svelte/animate'
  import Card from './ui/Card.svelte'
  import Exercice from './exercice/Exercice.svelte'
  import {
    type AppTierceGroup,
    isJSONReferentielEnding,
    type StaticItemInreferentiel,
    isStaticType
  } from '../lib/types/referentiels'
  import ModalGridOfCards from './modal/ModalGridOfCards.svelte'
  import appsTierce from '../json/referentielAppsTierceV2.json'
  import BreadcrumbHeader from './sidebar/BreadcrumbHeader.svelte'
  import CardForStatic from './ui/CardForStatic.svelte'
  import { doesImageExist } from './utils/images'

  let divExercices: HTMLDivElement
  let isNavBarVisible: boolean = true
  /**
   * Démarrage
   */
  // À la construction du component ou à la navigation dans l'historique du navigateur
  // on met à jour l'url headerStart
  onMount(() => {
    initTE({ Collapse, Ripple })
    // On analyse l'url pour mettre à jour l'affichage
    urlToDisplay()
    if ($globalOptions.recorder === 'capytale') {
      handleCapytale()
    }
    // Réglage du vecteur de translation pour le dé au loading
    const root = document.documentElement
    root.style.setProperty('--vect', 'calc((100vw / 10) * 0.5)')

    // Get the button
    const backToTopButton = document.getElementById('btn-back-to-top')

    // When the user scrolls down 500px from the top of the document, show the button

    const scrollFunction = () => {
      if (backToTopButton) {
        if (
          document.body.scrollTop > 500 ||
          document.documentElement.scrollTop > 500
        ) {
          backToTopButton.classList.remove('hidden')
        } else {
          backToTopButton.classList.add('hidden')
        }
      }
    }
    const backToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // When the user clicks on the button, scroll to the top of the document
    if (backToTopButton) {
      backToTopButton.addEventListener('click', backToTop)
    }

    window.addEventListener('scroll', scrollFunction)
  })

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
          svg.dataset.width = originalWidth ?? undefined
        }
        if (svg.hasAttribute('data-height') === false) {
          const originalHeight = svg.getAttribute('height')
          svg.dataset.height = originalHeight ?? undefined
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
   * Gestion des référentiels
   */
  // Contexte pour le modal des apps tierces
  let thirdAppsChoiceModal: ModalGridOfCards
  const appsTierceReferentielArray: AppTierceGroup[] = Object.values(appsTierce)
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

  /**
   * Gestion la bibliothèque de statiques
   */
  let bibliothequeChoiceModal: ModalGridOfCards
  let bibliothequeUuidInExercisesList: string[]
  $: {
    bibliothequeUuidInExercisesList = []
    const uuidList: string[] = []
    for (const entry of $exercicesParams) {
      uuidList.push(entry.uuid)
    }
    if ($bibliothequeDisplayedContent) {
      for (const item of Object.values($bibliothequeDisplayedContent)) {
        if (isJSONReferentielEnding(item) && uuidList.includes(item.uuid)) {
          bibliothequeUuidInExercisesList.push(item.uuid)
        }
      }
    }
    bibliothequeUuidInExercisesList = bibliothequeUuidInExercisesList
  }
  const buildBiblioToBeDisplayed = (): StaticItemInreferentiel[] => {
    const results: StaticItemInreferentiel[] = []
    if ($bibliothequeDisplayedContent) {
      Object.values($bibliothequeDisplayedContent).forEach((item) => {
        if (isStaticType(item)) {
          results.push(item)
        }
      })
    }
    return results
  }
</script>

<div class={$darkMode.isActive ? 'dark' : ''} id="startComponent">
  <div
    class="flex flex-col scrollbar-hide w-full h-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  >
    <!-- Entête -->
    {#if isNavBarVisible}
      <div
        id="headerStart"
        class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden"
      >
        <NavBar subtitle="Conception de document" subtitleType="design" />
      </div>
    {/if}
  </div>
  <!-- Mennu choix en mode smartphone -->
  <div
    class="md:hidden w-full flex flex-col bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
  >
    <button
      type="button"
      class="group w-full flex flex-row justify-between items-center p-4"
      data-te-collapse-init
      data-te-target="#choiceMenuWrapper"
      aria-expanded="true"
      aria-controls="choiceMenuWrapper"
    >
      <div
        class="text-lg font-bold text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
      >
        Choix des exercices
      </div>
      <i
        class="bx bxs-up-arrow rotate-0 group-[[data-te-collapse-collapsed]]:rotate-180 text-lg text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
      />
    </button>
    <div
      id="choiceMenuWrapper"
      class="!visible w-full overflow-y-auto overscroll-contain bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      data-te-collapse-item
      data-te-collapse-show
    >
      <SideMenu />
    </div>
  </div>
  <!-- Affichage exercices -->
  <div
    class="w-full overflow-y-auto overscroll-contain px-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  >
    {#if $exercicesParams.length !== 0}
      <div
        id="exercisesWrapper"
        class="flex flex-col justify-between h-full"
        bind:this={divExercices}
      >
        <div class="flex-1">
          <div class="flex flex-col h-full md:mt-9 xl:mt-0">
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
          </div>
        </div>
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
        </div>
      </div>
    {/if}
  </div>
  <!-- Back to top button -->
  <button
    type="button"
    data-te-ripple-init
    data-te-ripple-color="light"
    class="!fixed bottom-5 right-5 hidden rounded-full bg-transparent p-3 text-xl font-medium uppercase leading-tight text-coopmaths-action shadow-md transition duration-150 ease-in-out hover:text-coopmaths-action-lightest hover:shadow-lg focus:text-coopmaths-action-lightest focus:shadow-lg focus:outline-none focus:ring-0 active:text-coopmaths-action-lightest active:shadow-lg"
    id="btn-back-to-top"
  >
    <i class="bx bx-chevrons-up"></i>
  </button>
</div>

<!-- Fenêtre de dialogue pour le choix des applications tierces -->
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
<!-- Fenêtre de dialogue pour le choix des exercices de la bibliothèque statique -->
<ModalGridOfCards
  bind:this={bibliothequeChoiceModal}
  bind:displayModal={$isModalForStaticsVisible}
>
  <div slot="header">
    <BreadcrumbHeader path={$bibliothequePathToSection} />
  </div>
  <div slot="content">
    <div class="mx-2 pt-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each buildBiblioToBeDisplayed() as exercise}
          {#if doesImageExist(exercise.png)}
            <CardForStatic
              {exercise}
              selected={bibliothequeUuidInExercisesList.includes(exercise.uuid)}
            />
          {/if}
        {/each}
      </div>
    </div>
  </div>
</ModalGridOfCards>
