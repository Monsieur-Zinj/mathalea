<script lang="ts">
  import {
    exercicesParams,
    globalOptions,
    darkMode,
    bibliothequeDisplayedContent
  } from '../../../lib/stores/generalStore'
  import {
    mathaleaUpdateExercicesParamsFromUrl,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../lib/mathalea'
  import { flip } from 'svelte/animate'
  import { onMount, setContext } from 'svelte'
  import Exercice from '../../shared/exercice/Exercice.svelte'
  import ButtonIcon from '../../shared/forms/ButtonIcon.svelte'
  import ButtonText from '../../shared/forms/ButtonText.svelte'
  import ButtonsDeck from '../../shared/ui/ButtonsDeck.svelte'
  import Footer from '../../Footer.svelte'
  import SideMenu from '../start/presentationalComponents/sideMenu/SideMenu.svelte'
  import ModalSettingsCapytale from './ModalSettingsCapytale.svelte'
  import InputText from './InputText.svelte'
  import NavBarIframe from './NavBarIframe.svelte'
  import FormRadio from '../../shared/forms/FormRadio.svelte'
  import ButtonToggle from '../../shared/forms/ButtonToggle.svelte'
  import { Sidenav, Collapse, initTE } from 'tw-elements'

  import {
    type AppTierceGroup,
    isJSONReferentielEnding,
    type StaticItemInreferentiel,
    isStaticType
  } from '../../../lib/types/referentiels'
  import BasicClassicModal from '../../shared/modal/BasicClassicModal.svelte'
  import appsTierce from '../../../json/referentielAppsTierce.json'
  import Card from '../../shared/ui/Card.svelte'
  import { buildEsParams } from '../../../lib/components/urls'
  import ButtonWithTooltip from './ButtonWithTooltip.svelte'
  import type { InterfaceParams } from 'src/lib/types'
  import handleCapytale from '../../../lib/handleCapytale'
  import Keyboard from '../../keyboard/Keyboard.svelte'
  import { keyboardState } from '../../keyboard/stores/keyboardStore'
  import { canOptions } from '../../../lib/stores/canStore'
  import ButtonToggleAlt from '../../../components/shared/forms/ButtonToggleAlt.svelte'

  let divExercices: HTMLDivElement
  let isNavBarVisible: boolean = true
  let sidenavOpen: boolean = false
  let innerWidth = 0
  $: mdBreakpointDetection = innerWidth < 768

  /**
   * Gestion des référentiels
   */
  // Contexte pour le modal des apps tierces
  let thirdAppsChoiceModal: BasicClassicModal
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
  let bibliothequeChoiceModal: BasicClassicModal
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

  // Spécifique à Capytale
  let urlFeuilleEleve: string = ''
  let showSettingsDialog = false
  let modal: ModalSettingsCapytale
  function validateSettings () {
    modal.closeModal()
  }
  // Gestion de la graine
  function buildUrlAndOpenItInNewTab (status: 'eleve' | 'usual') {
    const url = new URL('https://coopmaths.fr/alea/')
    for (const ex of $exercicesParams) {
      url.searchParams.append('uuid', ex.uuid)
      if (ex.id !== undefined) url.searchParams.append('id', ex.id)
      if (ex.nbQuestions !== undefined) {
        url.searchParams.append('n', ex.nbQuestions.toString())
      }
      if (ex.duration !== undefined) {
        url.searchParams.append('d', ex.duration.toString())
      }
      if (ex.sup !== undefined) url.searchParams.append('s', ex.sup)
      if (ex.sup2 !== undefined) url.searchParams.append('s2', ex.sup2)
      if (ex.sup3 !== undefined) url.searchParams.append('s3', ex.sup3)
      if (ex.sup4 !== undefined) url.searchParams.append('s4', ex.sup4)
      if (ex.alea !== undefined) url.searchParams.append('alea', ex.alea)
      if (ex.interactif === '1') url.searchParams.append('i', '1')
      if (ex.cd !== undefined) url.searchParams.append('cd', ex.cd)
      if (ex.cols !== undefined) {
        url.searchParams.append('cols', ex.cols.toString())
      }
    }
    switch (status) {
      case 'eleve':
        if ($canOptions.isChoosen) {
          url.searchParams.append('v', 'can')
        } else {
          url.searchParams.append('v', 'eleve')
        }
        break
      default:
        break
    }
    url.searchParams.append('title', $globalOptions.title ?? '')
    const presMode =
      $exercicesParams.length === 1 ? 'liste_exos' : 'un_exo_par_page'
    url.searchParams.append(
      'es',
      buildEsParams(presMode)
    )

    if ($canOptions.isChoosen) {
      if ($canOptions.durationInMinutes !== 0) {
        url.searchParams.append('canD', $canOptions.durationInMinutes.toString())
      }
      if ($canOptions.subTitle !== '') {
        url.searchParams.append('canT', $canOptions.subTitle)
      }
      if ($canOptions.solutionsAccess) {
        url.searchParams.append('canSM', $canOptions.solutionsMode)
      }
    }
    window.open(url, '_blank')?.focus()
  }
  /**
   * Démarrage
   */
  // À la construction du component ou à la navigation dans l'historique du navigateur
  // on met à jour l'url headerStart
  onMount(() => {
    initTE({ Sidenav, Collapse })
    // On analyse l'url pour mettre à jour l'affichage
    urlToDisplay()
    if ($globalOptions.recorder === 'capytale') handleCapytale()
    globalOptions.update((params) => {
      params.presMode = 'un_exo_par_page'
      params.isDataRandom = true
      params.isTitleDisplayed = true
      if ($globalOptions.v === 'eleve') {
        params.isInteractiveFree = false
      }
      return params
    })
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
   * Gestion de la taille des éléments affichés
   */

  let zoom: number = 1
  function zoomOut () {
    // zoom -= 0.1
    zoom = Number.parseFloat((zoom - 0.1).toFixed(1))
    updateSize()
  }

  function zoomIn () {
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

function addExercise (uuid: string) {
  const newExercise: InterfaceParams = { uuid }
  if ($globalOptions.recorder === 'capytale') {
    newExercise.interactif = '1'
  }
  exercicesParams.update((list) => [...list, newExercise])
}

  /**
   * Gestion des données
   */
  function newDataForAll () {
    const newDataForAll = new window.Event('newDataForAll', {
      bubbles: true
    })
    document.dispatchEvent(newDataForAll)
  }

  function toggleCan () {
    if ($canOptions.isChoosen) {
      $globalOptions.setInteractive = '1'
    }
  }
</script>

<svelte:window bind:innerWidth />
<div
  class="z-0 {$darkMode.isActive
    ? 'dark'
    : ''} relative flex w-screen h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  id="startComponent"
>
  <div
    class="flex-1 flex flex-col scrollbar-hide w-full md:overflow-hidden bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  >
    <header
      class="md:sticky md:top-0 md:z-50 flex flex-col scrollbar-hide w-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    >
      <!-- Entête -->
      {#if isNavBarVisible}
        <div
          id="headerCapytale"
          class="bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden"
        >
          <NavBarIframe>
            <div slot="buttons" class="w-full">
              <ButtonsDeck class="mt-4 md:mt-0">
                <div
                  slot="setup-buttons"
                  class="flex flex-row justify-center items-center space-x-4"
                >
                  <div
                    class="tooltip tooltip-bottom"
                    data-tip="Réduire la taille du texte"
                  >
                    <ButtonIcon
                      icon="bx-zoom-out"
                      class="flex items-center text-3xl"
                      on:click={zoomOut}
                    />
                  </div>
                  <div
                    class="tooltip tooltip-bottom"
                    data-tip="Augmenter la taille du texte"
                  >
                    <ButtonIcon
                      icon="bx-zoom-in"
                      class="flex items-center text-3xl"
                      on:click={zoomIn}
                    />
                  </div>
                  <div
                    class="tooltip tooltip-bottom"
                    data-tip="Nouveaux énoncés"
                  >
                    <ButtonIcon
                      icon="bx-refresh"
                      class="flex items-center text-3xl"
                      on:click={newDataForAll}
                    />
                  </div>
                  <div
                    class="tooltip tooltip-bottom"
                    data-tip="Supprimer tous les exercices"
                  >
                    <ButtonIcon
                      icon="bx-trash"
                      class="text-3xl"
                      on:click={() => {
                        $exercicesParams.length = 0
                      }}
                    />
                  </div>
                </div>
                <div slot="input" class="flex flex-row items-center space-x-4">
                  <InputText
                    title="Importer les exercices d'une feuille élève"
                    placeholder="Lien"
                    bind:value={urlFeuilleEleve}
                    classAddenda="w-50"
                  />
                  <ButtonText
                    class="text-sm py-1 px-2 rounded-md h-7"
                    text="Ajouter"
                    disabled={urlFeuilleEleve.length === 0}
                    on:click={() => {
                      // exemple URL vue élève
                      // http://localhost:5173/alea/?uuid=01873&id=6C20&uuid=99522&id=6C22&uuid=64422&id=6C23&v=confeleve&v=eleve&title=&es=11101
                      let url = urlFeuilleEleve.replace('&v=confeleve', '')
                      url = url.replace('&v=eleve', '&recorder=capytale')
                      if (url.includes('v=can')) {
                        $canOptions.isChoosen = true
                      }
                      url = url.replace('&v=can', '&recorder=capytale')
                      url = url.replace(/es=\d/g, 'es=1') // Force la vue 1 page par exercice
                      if (url.includes('coopmaths.fr/alea')) {
                        const options = mathaleaUpdateExercicesParamsFromUrl(url)
                        if (options !== null) {
                          globalOptions.update(() => {
                            return options
                          })
                        } else {
                          alert('URL non valide !')
                        }
                        // On maintient Capytale car l'import d'une url non valide créé un objet globalOptions vide
                        $globalOptions.recorder = 'capytale'
                      }
                      urlFeuilleEleve = ''
                    }}
                  />
                </div>
                <div
                  slot="export-buttons"
                  class="flex flex-row justify-center items-center space-x-4"
                >
                  <div
                    class="tooltip tooltip-bottom"
                    data-tip="Régler l'affichage du mode élève"
                  >
                    <ButtonIcon
                      icon="bx-cog"
                      class="text-3xl"
                      disabled={$exercicesParams.length === 0}
                      on:click={() => {
                        showSettingsDialog = true
                      }}
                    />
                  </div>
                  <div>
                    <ButtonWithTooltip
                      tooltipTitle="Rejoindre MathALÉA"
                      tooltipPlacement="auto"
                      class="text-3xl"
                      isDisabled={$exercicesParams.length === 0}
                      on:click={() => {
                        buildUrlAndOpenItInNewTab('usual')
                      }}
                      title=""
                      icon="bx-log-out bx-rotate-180"
                    />
                  </div>
                </div>
              </ButtonsDeck>
            </div>
          </NavBarIframe>
        </div>
      {/if}
    </header>
    {#if mdBreakpointDetection}
      <!-- ====================================================================================
                     SMARTPHONE
    ========================================================================================= -->
      <div
        class="md:hidden flex flex-col h-full justify-between bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      >
        <!-- Menu choix en mode smartphone -->
        <div>
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
              <SideMenu {addExercise} />
            </div>
          </div>
          <!-- Affichage exercices en mode smartphone -->
          <div
            id="exercisesPartSmartPhone"
            class="flex md:hidden w-full px-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
          >
            {#if $exercicesParams.length !== 0}
              <div
                id="exercisesWrapperSmartPhone"
                class="flex flex-col w-full justify-between"
                bind:this={divExercices}
              >
                <div class="flex flex-col w-full md:mt-9 xl:mt-0">
                  {#each $exercicesParams as paramsExercice, i (paramsExercice)}
                    <div
                      id="exo{i}"
                      animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}
                    >
                      <Exercice
                        {paramsExercice}
                        indiceExercice={i}
                        indiceLastExercice={$exercicesParams.length - 1}
                      />
                    </div>
                  {/each}
                </div>
              </div>{:else}
              <div class="flex-1">
                <div
                  class="flex flex-col justify-between text-coopmaths-corpus dark:text-coopmathsdark-corpus md:px-10 py-6 md:py-40"
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
        </div>
        <Keyboard/>
        <div class="flex justify-center w-full {$keyboardState.isVisible ? 'mt-52' : ''}">
          <Footer />
        </div>
      </div>
    {:else}
      <!-- ====================================================================================
                     MODE NORMAL
    ========================================================================================= -->
      <!-- Menu choix + Exos en mode non-smartphone -->
      <div
        class="relative hidden md:flex w-full h-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      >
        <!-- bouton fermeture menu -->
        <div
          class="{$exercicesParams.length === 0
            ? 'hidden'
            : 'flex'} z-50 justify-center items-center absolute left-0 top-0 {!sidenavOpen
              ? 'translate-x-[400px]'
              : ' translate-x-0'} transition-transform ease-in-out h-10 w-10 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark rounded-r-md"
        >
          <button
            type="button"
            data-te-sidenav-toggle-ref
            data-te-target="#choiceSideMenuWrapper"
            aria-controls="#choiceSideMenuWrapper"
            aria-haspopup="true"
            on:click={() => {
              sidenavOpen = !sidenavOpen
              const instance = Sidenav.getOrCreateInstance(
                document.getElementById('choiceSideMenuWrapper')
              )
              instance.toggle()
            }}
          >
            <i
              class="bx {sidenavOpen
                ? 'bx-right-arrow-alt'
                : 'bx-x'} text-2xl text-coopmaths-action dark:text-coopmathsdark-action hover:text-coopmaths-action-lightest hover:dark:text-coopmathsdark-action-lightest"
            />
          </button>
        </div>
        <nav
          id="choiceSideMenuWrapper"
          class="absolute left-0 top-0 w-[400px] h-full z-[1035] -translate-x-full data-[te-sidenav-hidden='false']:translate-x-0 overflow-y-auto overscroll-contain bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
          data-te-sidenav-init
          data-te-sidenav-width="400"
          data-te-sidenav-hidden="false"
          data-te-sidenav-content="#exercisesPart"
          data-te-sidenav-position="absolute"
          data-te-sidenav-mode="side"
        >
          <div
            data-te-sidenav-menu-ref
            class="w-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
          >
            <SideMenu {addExercise} />
          </div>
        </nav>
        <!-- Affichage exercices -->
        <main
          id="exercisesPart"
          class="absolute right-0 top-0 hidden md:flex flex-col w-full h-full pt-6 px-6 !pl-[400px] bg-coopmaths-canvas dark:bg-coopmathsdark-canvas overflow-x-hidden overflow-y-auto"
        >
          {#if $exercicesParams.length !== 0}
            <div
              id="exercisesWrapper"
              class="flex flex-col h-full justify-between pl-4 relative"
              bind:this={divExercices}
            >
              <div class="flex flex-col md:mt-9 xl:mt-0">
                {#each $exercicesParams as paramsExercice, i (paramsExercice)}
                  <div
                    id="exo{i}"
                    animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}
                  >
                    <Exercice
                      {paramsExercice}
                      indiceExercice={i}
                      indiceLastExercice={$exercicesParams.length - 1}
                    />
                  </div>
                {/each}
              </div>
              <Keyboard/>
        <div class="flex justify-center w-full {$keyboardState.isVisible ? 'mt-52' : ''}">
          <Footer />
        </div>
            </div>
          {:else}
            <div class="relative flex-1 h-full">
              <div
                class="flex flex-col justify-between h-full text-coopmaths-corpus dark:text-coopmathsdark-corpus md:px-10 py-6"
              >
                <div class="bg-coopmaths-canvas">
                  <span class="text-coopmaths-canvas">&nbsp;</span>
                </div>
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
                <Keyboard/>
        <div class="flex justify-center w-full {$keyboardState.isVisible ? 'mt-52' : ''}">
          <Footer />
        </div>
              </div>
            </div>
          {/if}
        </main>
      </div>
    {/if}
  </div>
  <!-- Fenêtre de dialogue pour le choix des applications tierces -->
  <BasicClassicModal
    bind:this={thirdAppsChoiceModal}
    bind:isDisplayed={showThirdAppsChoiceDialog}
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
  </BasicClassicModal>
  <ModalSettingsCapytale bind:showSettingsDialog bind:this={modal}>
    <div slot="header">Réglages de l'affichage des exercices</div>
    <div slot="content">
      <div class="pt-2 pl-2 grid grid-flow-row lg:grid-cols-2 gap-4">
        <!-- <div class="pb-2">
          <div class="pl-2 pb-2 font-light text-2xl text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Présentation</div>
          <FormRadio
            isDisabled={true}
            title="présentation"
            bind:valueSelected={$globalOptions.presMode}
            labelsValues={[
              { label: 'Tous les exercices sur une page', value: 'liste_exos' },
              { label: 'Une page par exercice', value: 'un_exo_par_page', isDisabled: $exercicesParams.length === 1 },
              { label: 'Toutes les questions sur une page', value: 'liste_questions' },
              { label: 'Une page par question', value: 'une_question_par_page' }
            ]}
          />
        </div> -->
        <div class="pb-2">
          <div
            class="pl-2 pb-2 font-light text-2xl text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
          >
            Interactivité
          </div>
          <FormRadio
            title="Interactif"
            bind:valueSelected={$globalOptions.setInteractive}
            isDisabled={$canOptions.isChoosen}
            labelsValues={[
              { label: 'Laisser tel quel', value: '2' },
              { label: 'Tout interactif', value: '1' },
              { label: "Pas d'interactivité", value: '0' }
            ]}
          />
          <!-- <div class="pl-2 pt-2">
            <ButtonToggle
              isDisabled={$globalOptions.setInteractive === '0'}
              titles={["Les élèves peuvent modifier l'interactivité", "Les élèves ne peuvent pas modifier l'interactivité"]}
              bind:value={$globalOptions.isInteractiveFree}
            />
          </div> -->
          <div class="pl-2 pt-2">
            <ButtonToggle
              titles={[
                'Les élèves peuvent répondre une seule fois',
                'Les élèves peuvent répondre plusieurs fois'
              ]}
              bind:value={$globalOptions.oneShot}
            />
          </div>
        </div>
        <div class="pb-2">
          <div
            class="pl-2 pb-2 font-bold text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
          >
            Course aux nombres
          </div>
          <div class="flex flex-row justify-start items-center px-4">
            <div class="flex flex-col items-start justify-start space-y-2">
              <ButtonToggleAlt
                title={'Format CAN'}
                id={'config-eleve-format-can-toggle'}
                bind:value={$canOptions.isChoosen}
                on:toggle={toggleCan}
                explanations={[
                  'Les questions seront posées les unes à la suite des autres en temps limité.',
                  'Chaque exercice sera dans un onglet différent'
                ]}
              />
              <div class="flex justify-start flex-row items-center space-x-2">
                <div
                  class="text-coopmaths-corpus-light dark:text-coopmathsdark-corpus text-sm font-light {$canOptions.isChoosen
                    ? 'text-opacity-100 dark:text-opacity-100'
                    : 'text-opacity-10 dark:text-opacity-10'}"
                >
                  Durée :
                </div>
                <input
                  type="number"
                  id="config-eleve-can-duration-input"
                  class="w-1/5 h-6 text-sm bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus border border-coopmaths-action dark:border-coopmathsdark-action font-light focus:border focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:border-opacity-10 disabled:text-opacity-10 dark:disabled:border-opacity-10 dark:disabled:text-opacity-10"
                  bind:value={$canOptions.durationInMinutes}
                  disabled={!$canOptions.isChoosen}
                />
                <div
                  class="text-coopmaths-corpus-light dark:text-coopmathsdark-corpus text-sm font-light {$canOptions.isChoosen
                    ? 'text-opacity-100 dark:text-opacity-100'
                    : 'text-opacity-10 dark:text-opacity-10'}"
                >
                  minute{($canOptions.durationInMinutes !== undefined && $canOptions.durationInMinutes > 1) ? 's' : ''}.
                </div>
              </div>
              <div class="flex justify-start flex-row items-center space-x-2">
                <div
                  class="text-coopmaths-corpus-light dark:text-coopmathsdark-corpus text-sm font-light {$canOptions.isChoosen
                    ? 'text-opacity-100 dark:text-opacity-100'
                    : 'text-opacity-10 dark:text-opacity-10'}"
                >
                  Sous-titre :
                </div>
                <input
                  type="text"
                  id="config-eleve-can-duration-input"
                  class="w-1/2 h-6 text-sm bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus border border-coopmaths-action dark:border-coopmathsdark-action font-light focus:border focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:border-opacity-10 disabled:text-opacity-10 dark:disabled:border-opacity-10 dark:disabled:text-opacity-10"
                  bind:value={$canOptions.subTitle}
                  disabled={!$canOptions.isChoosen}
                />
              </div>

              <ButtonToggleAlt
                title={'Accès aux solutions'}
                id={'config-eleve-solutions-can-toggle'}
                bind:value={$canOptions.solutionsAccess}
                isDisabled={!$canOptions.isChoosen}
                explanations={[
                  'Les élèves auront accès aux solutions dans le format défini ci-dessous.',
                  "Les élèves n'auront pas accès aux solutions."
                ]}
              />

              <FormRadio
                title="can-solutions-config"
                bind:valueSelected={$canOptions.solutionsMode}
                isDisabled={!$canOptions.isChoosen || !$canOptions.solutionsAccess}
                labelsValues={[
                  {
                    label: 'Solutions rassemblées à la fin.',
                    value: 'gathered'
                  },
                  {
                    label: 'Solutions avec les questions.',
                    value: 'split'
                  }
                ]}
              />
            </div>
          </div>
        </div>
        <div class="pb-2">
          <div
            class="pl-2 pb-2 font-light text-2xl text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
          >
            Données
          </div>
          <div
            class="flex justify-start-items-center pl-2 font-light text-sm text-coopmaths-corpus-light disabled"
          >
            Tous les élèves auront des pages :
          </div>
          <div class="flex flex-row justify-start items-center px-4">
            <ButtonToggle
              titles={['différentes', 'identiques']}
              bind:value={$globalOptions.isDataRandom}
            />
          </div>
        </div>
        <div class="pb-2">
          <div
            class="pl-2 pb-2 font-light text-2xl text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
          >
            Affichage des titres
          </div>
          <!-- <div
            class="flex justify-start-items-center pl-2 font-light text-sm text-coopmaths-corpus-light disabled"
          >
            Tous les élèves auront des pages :
          </div> -->
          <div class="flex flex-row justify-start items-center px-4">
            <ButtonToggle
              titles={['Tous les titres sont affichés', 'Tous les titres sont masqués']}
              bind:value={$globalOptions.isTitleDisplayed}
            />
          </div>
        </div>
        <div class="pb-2">
          <div
            class="pl-2 pb-2 font-light text-2xl text-coopmaths-struct-light dark:text-coopmathsdark-struct-light"
          >
            Correction
          </div>
          <div class="flex flex-row justify-start items-center px-4">
            <ButtonToggle
              isDisabled={$canOptions.isChoosen}
              titles={['Accès aux corrections', 'Pas de corrections']}
              bind:value={$globalOptions.isSolutionAccessible}
            />
          </div>
        </div>
      </div>
    </div>

    <div slot="buttons" class="flex flex-row justify-end space-x-4 w-full">
      <div class="pt-4 pb-8 px-4">
        <ButtonText
          class="text-sm py-1 px-2 rounded-md h-7"
          on:click={validateSettings}
          text="Valider"
        />
      </div>
      <div class="pt-4 pb-8 px-4">
        <ButtonText
          class="text-sm py-1 px-2 rounded-md h-7"
          on:click={() => {
            buildUrlAndOpenItInNewTab('eleve')
          }}
          text="Aperçu"
        />
      </div>
    </div>
  </ModalSettingsCapytale>
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
