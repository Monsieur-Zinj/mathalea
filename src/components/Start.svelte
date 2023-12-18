<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import {
    bibliothequeDisplayedContent,
    bibliothequePathToSection,
    callerComponent,
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
  import { Sidenav, Collapse, Ripple, initTE } from 'tw-elements'
  import { flip } from 'svelte/animate'
  import { fly, blur } from 'svelte/transition'
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
  import Button from './forms/Button.svelte'
  import ButtonsDeck from './ui/ButtonsDeck.svelte'
  import TwoStatesIcon from './icons/TwoStatesIcon.svelte'
  import LatexIcon from './icons/LatexIcon.svelte'
  import AmcIcon from './icons/AmcIcon.svelte'
  import MoodleIcon from './icons/MoodleIcon.svelte'
  import Footer from './Footer.svelte'
  import ChipsList from './ui/ChipsList.svelte'
  import Keyboard from './keyboard/KeyboardV2.svelte'

  let divExercices: HTMLDivElement
  let isNavBarVisible: boolean = true
  let chipsListDisplayed: boolean = false
  let sidenavOpen: boolean = false
  let innerWidth = 0
  $: mdBreakpointDetection = innerWidth < 768
  /**
   * Démarrage
   */
  // À la construction du component ou à la navigation dans l'historique du navigateur
  // on met à jour l'url headerStart
  onMount(() => {
    initTE({ Sidenav, Collapse, Ripple })
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

<svelte:window bind:innerWidth />
<div
  class="{$darkMode.isActive
    ? 'dark'
    : ''} relative flex w-screen h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  id="startComponent"
>
  <div class="flex-1 flex flex-col w-full md:overflow-hidden">
    <header
      class="md:sticky md:top-0 md:z-50 flex flex-col scrollbar-hide w-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
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
      <!-- Barre de boutons en mode non-smartphone  -->
      <div
        class="hidden md:flex {$exercicesParams.length !== 0
          ? 'xl:h-[50px] md:h-[100px]'
          : 'h-0'}"
      >
        <div
          class={$exercicesParams.length === 0
            ? 'hidden'
            : 'relative w-full flex flex-col justify-center items-center bg-coopmaths-canvas dark:bg-coopmathsdark-canvas'}
          id="barre-boutons"
        >
          <div
            class="hidden md:flex justify-center items-center absolute left-0 bottom-0 h-10 w-10 bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark"
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
          <ButtonsDeck class="md:pl-10" {chipsListDisplayed}>
            <!-- Bouton de réglages de la page -->
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
            <!-- Boutons d'export -->
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
        </div>
      </div>
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
              <SideMenu />
            </div>
          </div>
          <!-- Barre de boutons en mode smartphone -->
          <div class="md:hidden">
            <div
              class={$exercicesParams.length === 0
                ? 'hidden'
                : 'w-full flex flex-col justify-center items-center bg-coopmaths-canvas dark:bg-coopmathsdark-canvas'}
              id="barre-boutons"
            >
              <ButtonsDeck class="md:pl-10" {chipsListDisplayed}>
                <!-- Bouton de réglages de la page -->
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
                  <div
                    class="tooltip tooltip-bottom"
                    data-tip="Nouveaux énoncés"
                  >
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
                <!-- Boutons d'export -->
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
                        indiceLastExercice={$exercicesParams.length}
                      />
                    </div>
                  {/each}
                </div>
              </div>
            {:else}
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
        <Footer />
      </div>
    {:else}
      <!-- ====================================================================================
                     MODE NORMAL
    ========================================================================================= -->
      <!-- Menu choix + Exos en mode non-smartphone -->
      <div
        class="relative hidden md:flex w-full h-full bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
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
            <SideMenu />
          </div>
        </nav>
        <!-- Affichage exercices -->
        <main
          id="exercisesPart"
          class="absolute right-0 top-0 hidden md:flex flex-col w-full h-full px-6 !pl-[400px] bg-coopmaths-canvas dark:bg-coopmathsdark-canvas overflow-x-hidden overflow-y-auto"
        >
          {#if $exercicesParams.length !== 0}
            <div
              id="exercisesWrapper"
              class="flex flex-col h-full justify-between pl-4"
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
                      indiceLastExercice={$exercicesParams.length}
                    />
                  </div>
                {/each}
              </div>
              <div class="hidden md:flex items-center justify-center">
                <Footer />
              </div>
              <Keyboard/>

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
                <div class="flex items-center justify-center">
                  <Footer />
                </div>
              </div>
            </div>
          {/if}
        </main>
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
    <i class="bx bx-chevrons-up" />
  </button>
  <!-- Barre des chips -->
  {#if chipsListDisplayed}
    <div
    in:fly={{ y: -1000 }} out:blur
      id="exoChipsList"
      class="z-[1090] fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-2/3 flex flex-row justify-start items-center p-8 rounded-md shadow-2xl bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark p"
    >
      <ChipsList bind:chipsListDisplayed={chipsListDisplayed}/>
    </div>
  {/if}
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

<style>
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
