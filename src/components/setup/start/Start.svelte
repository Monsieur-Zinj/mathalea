<script lang="ts">
  //
  //
  // /!\ Il reste à traiter ReferentielEnding.svelte qui contient encore des accès au generalStore
  //     Il faut faire remonter les demandes à Start.svelte pour qu'il reste le seul avec ces accès
  //        et faire en sorte que ReferentielEnding.svelte ne gère que de l'affichage en bon presentationalComponent
  // /!\ Chip.svelte, SearchInput.svelte et Filtres.svelte contiennet encore des createEventDispatcher, dans l'idéal il
  //     faudrait plutôtqu'ils fassent remonter les changements jusqu'à SideMenu.svelte via une {function} pour qu'ils
  //     les fassent redescendre ensuite par des {attributs}
  //
  import { onDestroy, onMount, setContext, tick } from 'svelte'
  import {
    callerComponent,
    darkMode,
    exercicesParams,
    globalOptions
  } from '../../../lib/stores/generalStore'
  import {
    localisedIDToUuid,
    referentielLocale
  } from '../../../lib/stores/languagesStore'
  import SideMenu from './presentationalComponents/sideMenu/SideMenu.svelte'
  import { Sidenav, Collapse, Ripple, initTE } from 'tw-elements'
  import { type AppTierceGroup } from '../../../lib/types/referentiels'
  import BasicClassicModal from '../../shared/modal/BasicClassicModal.svelte'
  import appsTierce from '../../../json/referentielAppsTierce.json'
  import Footer from '../../Footer.svelte'
  import ModalThirdApps from './presentationalComponents/ModalThirdApps.svelte'
  import ButtonBackToTop from './presentationalComponents/ButtonBackToTop.svelte'
  import Header from './presentationalComponents/header/Header.svelte'
  import HeaderButtons from './presentationalComponents/header/headerButtons/HeaderButtons.svelte'
  import Exercices from './presentationalComponents/Exercices.svelte'
  import Placeholder from './presentationalComponents/Placeholder.svelte'
  import type { InterfaceGlobalOptions, InterfaceParams, VueType } from 'src/lib/types'
  import Keyboard from '../../keyboard/Keyboard.svelte'
  import { SM_BREAKPOINT } from '../../keyboard/lib/sizes'
  import type { Language } from '../../../lib/types/languages'
  import { isLanguage } from '../../../lib/types/languages'
  import { get } from 'svelte/store'
  import { mathaleaUpdateExercicesParamsFromUrl, mathaleaUpdateUrlFromExercicesParams } from '../../../lib/mathalea'
  import handleCapytale from '../../../lib/handleCapytale'
  import { canOptions } from '../../../lib/stores/canStore'
  import { buildEsParams } from '../../../lib/components/urls'
  import ModalCapytalSettings from './presentationalComponents/modalCapytalSettings/ModalCapytalSettings.svelte'
  import type { CanOptions } from '../../../lib/types/can'
  import SideMenuWrapper from './presentationalComponents/header/SideMenuWrapper.svelte'

  let isNavBarVisible: boolean = true
  let innerWidth = 0
  let isBackToTopButtonVisible = false
  let selectedThirdApps: string[]
  let thirdAppsChoiceModal: BasicClassicModal
  let showThirdAppsChoiceDialog = false
  let isMd: boolean
  let localeValue: Language = get(referentielLocale)
  let isSidenavOpened: boolean = true

  const unsubscribeToReferentielLocale = referentielLocale.subscribe(
    (value) => {
      localeValue = value
    }
  )

  onMount(async () => {
    initTE({ Sidenav, Collapse, Ripple })
    await tick() // globalOptions n'est pas encore initialisé si on n'attend pas
    if ($globalOptions.recorder === 'capytale') {
      handleCapytale()
      globalOptions.update((params) => {
        params.presMode = 'un_exo_par_page'
        params.isDataRandom = true
        params.isTitleDisplayed = true
        if ($globalOptions.v === 'eleve') {
          params.isInteractiveFree = false
        }
        return params
      })
    }
    addScrollListener()
  })

  onDestroy(() => {
    unsubscribeToReferentielLocale()
  })

  // Spécifique à Capytale
  let isSettingsDialogDisplayed = false
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

  function toggleCan () {
    if ($canOptions.isChoosen) {
      $globalOptions.setInteractive = '1'
    }
  }

  function showSettingsDialog () {
    isSettingsDialogDisplayed = true
  }

  const handleLanguage = (lang: string) => {
    // on se déplace circulairement dans le tableau allowedLanguages
    // idée prise ici :https://dev.to/turneremma21/circular-access-of-array-in-javascript-j52
    if (!isLanguage(lang)) {
      throw new Error(`${lang} is not allowed as language.`)
    } else {
      referentielLocale.set(lang)
      const currentRefToUuid = localisedIDToUuid[get(referentielLocale)]
      exercicesParams.update((list) => {
        for (let i = 0; i < list.length; i++) {
          const localeID = (
            Object.keys(currentRefToUuid) as (keyof typeof currentRefToUuid)[]
          ).find((key) => {
            return currentRefToUuid[key] === list[i].uuid
          })
          const frenchID = (
            Object.keys(
              localisedIDToUuid['fr-FR']
            ) as (keyof (typeof localisedIDToUuid)['fr-FR'])[]
          ).find((key) => {
            return localisedIDToUuid['fr-FR'][key] === list[i].uuid
          })
          list[i].id = localeID !== undefined && localeID.length !== 0 ? localeID : frenchID
        }
        return list
      })
      const event = new window.Event('languageHasChanged', {
        bubbles: true
      })
      document.dispatchEvent(event)
      mathaleaUpdateUrlFromExercicesParams()
    }
  }

  $: {
    isNavBarVisible = $globalOptions.v !== 'l'
    updateSelectedThirdApps()
    isMd = innerWidth >= SM_BREAKPOINT
  }

  function addScrollListener () {
    function updateBackToTopButtonVisibility () {
      isBackToTopButtonVisible =
        document.body.scrollTop > 500 ||
        document.documentElement.scrollTop > 500
    }
    window.addEventListener('scroll', () => updateBackToTopButtonVisibility())
  }

  function updateSelectedThirdApps () {
    const appsTierceReferentielArray: AppTierceGroup[] =
      Object.values(appsTierce)
    const uuidList: string[] = $exercicesParams.map(
      (exerciceParams) => exerciceParams.uuid
    )
    selectedThirdApps = []
    for (const group of appsTierceReferentielArray) {
      for (const app of group.liste) {
        if (uuidList.includes(app.uuid)) {
          selectedThirdApps.push(app.uuid)
        }
      }
    }
  }

  function zoomUpdate (plusMinus: '+' | '-') {
    let zoom = Number($globalOptions.z)
    if (plusMinus === '+') zoom = Number.parseFloat((zoom + 0.1).toFixed(1))
    if (plusMinus === '-') zoom = Number.parseFloat((zoom - 0.1).toFixed(1))
    globalOptions.update((params) => {
      params.z = zoom.toString()
      return params
    })
  }

  function setAllInteractive (isAllInteractive: boolean) {
    const eventName = isAllInteractive ? 'setAllInteractif' : 'removeAllInteractif'
    const event = new window.Event(eventName, { bubbles: true })
    document.dispatchEvent(event)
  }

  function newDataForAll () {
    const newDataForAll = new window.Event('newDataForAll', { bubbles: true })
    document.dispatchEvent(newDataForAll)
  }

  function trash () {
    exercicesParams.set([])
    toggleSidenav(true)
  }

  function setFullScreen (isFullScreen: boolean) {
    globalOptions.update((params) => {
      isFullScreen ? (params.v = 'l') : delete params.v
      return params
    })
  }

  function handleExport (vue: VueType) {
    $callerComponent = ''
    globalOptions.update((params) => {
      params.v = vue
      return params
    })
  }

  function addExercise (uuid: string, id: string) {
    const newExercise: InterfaceParams = { uuid, id }
    if ($globalOptions.recorder === 'capytale') {
      newExercise.interactif = '1'
    }
    exercicesParams.update((list) => [...list, newExercise])
  }

  function backToTop () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function importExercises (urlFeuilleEleve: string) {
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
        globalOptions.set(options)
      } else {
        alert('URL non valide !')
      }
      // On maintient Capytale car l'import d'une url non valide créé un objet globalOptions vide
      $globalOptions.recorder = 'capytale'
    }
  }

  /**
   * Gestion des référentiels
   */
  // Contexte pour le modal des apps tierces
  setContext('thirdAppsChoiceContext', {
    toggleThirdAppsChoiceDialog: () => {
      showThirdAppsChoiceDialog = !showThirdAppsChoiceDialog
      if (showThirdAppsChoiceDialog === false && thirdAppsChoiceModal) {
        thirdAppsChoiceModal.closeModal()
      }
    }
  })

  function updateParams (params: { globalOptions: InterfaceGlobalOptions; canOptions: CanOptions }) {
    canOptions.set(params.canOptions)
    globalOptions.set(params.globalOptions) // en dernier car c'est sa modification qui déclenche la mise à jour de l'url dans App.svelte qui prévient ensuite Capytale d'une mise à jour
  }

  function toggleSidenav (forceOpening: boolean): void {
    const sidenav = Sidenav.getOrCreateInstance(document.getElementById('choiceSideMenuWrapper'))
    if (!sidenav) return
    if (forceOpening) {
      if (!isSidenavOpened) {
        sidenav.toggle()
        isSidenavOpened = !isSidenavOpened
      }
    } else {
      sidenav.toggle()
      isSidenavOpened = !isSidenavOpened
    }
  }
</script>

<svelte:window bind:innerWidth />
<div
  class="{$darkMode.isActive
    ? 'dark'
    : ''} relative flex w-screen h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  id="startComponent"
>
  <div class="flex-1 flex flex-col w-full md:overflow-hidden">
    <Header
      {isNavBarVisible}
      isExerciseDisplayed={$exercicesParams.length !== 0}
      {zoomUpdate}
      {setAllInteractive}
      {newDataForAll}
      {trash}
      {setFullScreen}
      {handleExport}
      locale={localeValue}
      {handleLanguage}
      isCapytale={$globalOptions.recorder === 'capytale'}
      {buildUrlAndOpenItInNewTab}
      {showSettingsDialog}
      {importExercises}
      isExercisesListEmpty={$exercicesParams.length === 0}
      {isSidenavOpened}
      {toggleSidenav}
    />
    {#if isMd}
      <!-- ====================================================================================
                    MODE NORMAL
  ========================================================================================= -->
      <!-- Menu choix + Exos en mode non-smartphone -->
      <div
        class="relative flex w-full h-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      >
        {#if $globalOptions.recorder === 'capytale'}
          <SideMenuWrapper
            isCapytale={true}
            {isSidenavOpened}
            {toggleSidenav}
          />
        {/if}
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
          class="absolute right-0 top-0 flex flex-col w-full h-full px-6 overflow-x-hidden overflow-y-auto
            {$globalOptions.recorder === 'capytale' ? '!pl-[425px]' : '!pl-[400px]'}
            bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
        >
          {#if $exercicesParams.length !== 0}
            <Exercices
              exercicesParams={$exercicesParams}
              on:exerciseRemoved={() => {
                if ($exercicesParams.length === 0) {
                  toggleSidenav(true)
                }
              }}
            />
          {:else}
            <Placeholder text="Sélectionner les exercices" />
          {/if}
        </main>
      </div>
    {:else}
      <!-- ====================================================================================
                  MODE SMARTPHONE
========================================================================================= -->
      <div
        class="flex flex-col h-full justify-between bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      >
        <!-- Menu choix en mode smartphone -->
        <div>
          <div
            class="w-full flex flex-col bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
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
          <!-- Barre de boutons en mode smartphone -->
          <div
            class={$exercicesParams.length === 0
              ? 'hidden'
              : 'w-full flex flex-col justify-center items-center bg-coopmaths-canvas dark:bg-coopmathsdark-canvas'}
            id="barre-boutons"
          >
            <HeaderButtons
              {zoomUpdate}
              {setAllInteractive}
              {newDataForAll}
              {trash}
              {setFullScreen}
              {handleExport}
            />
          </div>
          <!-- Affichage exercices en mode smartphone -->
          <main
            id="exercisesPart"
            class="flex w-full px-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
          >
            {#if $exercicesParams.length !== 0}
              <Exercices exercicesParams={$exercicesParams} />
            {:else}
              <Placeholder text="Sélectionner les exercices" />
            {/if}
          </main>
        </div>
        <Footer />
      </div>
    {/if}
  </div>
  <Keyboard />
</div>
<ButtonBackToTop {isBackToTopButtonVisible} {backToTop} />
<ModalThirdApps
  {thirdAppsChoiceModal}
  {showThirdAppsChoiceDialog}
  appsTierceInExercisesList={selectedThirdApps}
/>
<ModalCapytalSettings
  bind:isSettingsDialogDisplayed={isSettingsDialogDisplayed}
  globalOptions={$globalOptions}
  canOptions={$canOptions}
  {toggleCan}
  {buildUrlAndOpenItInNewTab}
  {updateParams}
/>

<style>
  @media (min-width: 768px) {
    #barre-boutons {
      width: calc(100% - (var(--isMenuOpen) * var(--sidebarWidth) * 1px + (var(--isMenuOpen)) * 16px));
    }
  }
  @media (max-width: 768px) {
    #barre-boutons {
      width: 100vw;
    }
  }
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: #cccccc;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #dddddd;
  }
  ::-webkit-scrollbar-track {
    background: #ffffff;
    border-radius: 10px;
    box-shadow: inset 7px 10px 12px #f0f0f0;
  }
</style>
