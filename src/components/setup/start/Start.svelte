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
  import { SvelteComponent, onDestroy, onMount, setContext } from 'svelte'
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
  import type { InterfaceParams, VueType } from 'src/lib/types'
  import Keyboard from '../../keyboard/Keyboard.svelte'
  import { SM_BREAKPOINT } from '../../keyboard/lib/sizes'
  import type { Language } from '../../../lib/types/languages'
  import { isLanguage } from '../../../lib/types/languages'
  import { get } from 'svelte/store'
  import { mathaleaUpdateUrlFromExercicesParams } from '../../../lib/mathalea'
    import handleCapytale from '../../../lib/handleCapytale'
    import ModalSettingsCapytale from '../capytale/ModalSettingsCapytale.svelte'
    import FormRadio from '../../shared/forms/FormRadio.svelte'
    import ButtonToggle from '../../shared/forms/ButtonToggle.svelte'
    import ButtonToggleAlt from '../../shared/forms/ButtonToggleAlt.svelte'
    import { canOptions } from '../../../lib/stores/canStore'
    import ButtonText from '../../shared/forms/ButtonText.svelte'
    import { buildEsParams } from '../../../lib/components/urls'

  interface HeaderComponent extends SvelteComponent {
    toggleMenu: (t: boolean) => void
  }

  let isNavBarVisible: boolean = true
  let innerWidth = 0
  let isBackToTopButtonVisible = false
  let selectedThirdApps: string[]
  let thirdAppsChoiceModal: BasicClassicModal
  let showThirdAppsChoiceDialog = false
  let isMd: boolean
  let headerComponent: HeaderComponent
  let localeValue: Language = get(referentielLocale)

  const unsubscribeToReferentielLocale = referentielLocale.subscribe(
    (value) => {
      localeValue = value
    }
  )

  onMount(() => {
    initTE({ Sidenav, Collapse, Ripple })
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
      // Réglage du vecteur de translation pour le dé au loading
      const root = document.documentElement
      root.style.setProperty('--vect', 'calc((100vw / 10) * 0.5)')
    }
    addScrollListener()
  })

  onDestroy(() => {
    unsubscribeToReferentielLocale()
  })

  // Spécifique à Capytale
  const urlFeuilleEleve: string = ''
  let isSettingsDialogDisplayed = false
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
    const eventName = isAllInteractive
      ? 'setAllInteractif'
      : 'removeAllInteractif'
    const event = new window.Event(eventName, {
      bubbles: true
    })
    document.dispatchEvent(event)
  }

  function newDataForAll () {
    const newDataForAll = new window.Event('newDataForAll', {
      bubbles: true
    })
    document.dispatchEvent(newDataForAll)
  }

  function trash () {
    exercicesParams.set([])
    headerComponent.toggleMenu(true)
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
      bind:this={headerComponent}
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
      {urlFeuilleEleve}
      {buildUrlAndOpenItInNewTab}
      {showSettingsDialog}
    />
    {#if isMd}
      <!-- ====================================================================================
                    MODE NORMAL
  ========================================================================================= -->
      <!-- Menu choix + Exos en mode non-smartphone -->
      <div
        class="relative flex w-full h-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      >
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
          class="absolute right-0 top-0 flex flex-col w-full h-full px-6 !pl-[400px] bg-coopmaths-canvas dark:bg-coopmathsdark-canvas overflow-x-hidden overflow-y-auto"
        >
          {#if $exercicesParams.length !== 0}
            <Exercices
              exercicesParams={$exercicesParams}
              on:exerciseRemoved={() => {
                if ($exercicesParams.length === 0) {
                  headerComponent.toggleMenu(true)
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
<ModalSettingsCapytale bind:showSettingsDialog={isSettingsDialogDisplayed} bind:this={modal}>
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
