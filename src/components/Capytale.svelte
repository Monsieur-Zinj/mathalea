<script lang="ts">
  import { exercicesParams, globalOptions, darkMode, isSideMenuVisible, bibliothequeSectionContent } from './store'
  import SideMenu from './sidebar/SideMenu.svelte'
  import { mathaleaGenerateSeed, mathaleaUpdateExercicesParamsFromUrl, mathaleaUpdateUrlFromExercicesParams } from '../lib/mathalea'
  import { flip } from 'svelte/animate'
  import { onMount, setContext } from 'svelte'
  import { updateReferentiel } from './utils/referentielsUtils'
  import Exercice from './exercice/Exercice.svelte'
  import Button from './forms/Button.svelte'
  import ButtonsDeck from './outils/ButtonsDeck.svelte'
  import Footer from './Footer.svelte'
  import referentielRessources from '../json/referentielRessources.json'
  import { toMap } from './utils/toMap'
  import { toObject } from './utils/toObj'
  import type { ReferentielForList } from '../lib/types'
  import handleCapytale from '../lib/handleCapytale'
  import referentielStatic from '../json/referentielStatic.json'
  import NavBarIframe from './header/NavBarIframe.svelte'
  import InputText from './forms/InputText.svelte'
  import ModalSettingsCapytale from './modal/ModalSettingsCapytale.svelte'
  import FormRadio from './forms/FormRadio.svelte'
  import ButtonToggle from './forms/ButtonToggle.svelte'
  import referentielBibliotheque from '../json/referentielBibliotheque.json'
  import BreadcrumbHeader from './sidebar/BreadcrumbHeader.svelte'
  import ImageCard from './ui/ImageCard.svelte'
  import { buildUrlAddendumForEsParam } from './utils/urls'

  let isNavBarVisible: boolean = true
  const chipsListDisplayed: boolean = false
  let divExercices: HTMLDivElement
  $: isMenuOpen = $isSideMenuVisible

  // Spécifique à Capytale
  let urlFeuilleEleve: string = ''
  let showSettingsDialog = false
  let isInitialUrlHandled = false
  let modal: ModalSettingsCapytale
  function validateSettings () {
    modal.closeModal()
  }
  // Gestion de la graine
  let isDataRandom: boolean = false
  function handleSeed () {
    for (const param of $exercicesParams) {
      if (!isDataRandom && param.alea === undefined) {
        param.alea = mathaleaGenerateSeed()
      } else {
        param.alea = undefined
      }
    }
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
  }
  function handleEleveVueSetUp () {
    const url = new URL('https://coopmaths.fr/alea/')
    for (const ex of $exercicesParams) {
      url.searchParams.append('uuid', ex.uuid)
      if (ex.id !== undefined) url.searchParams.append('id', ex.id)
      if (ex.nbQuestions !== undefined) url.searchParams.append('n', ex.nbQuestions.toString())
      if (ex.duration !== undefined) url.searchParams.append('d', ex.duration.toString())
      if (ex.sup !== undefined) url.searchParams.append('s', ex.sup)
      if (ex.sup2 !== undefined) url.searchParams.append('s2', ex.sup2)
      if (ex.sup3 !== undefined) url.searchParams.append('s3', ex.sup3)
      if (ex.sup4 !== undefined) url.searchParams.append('s4', ex.sup4)
      if (ex.alea !== undefined) url.searchParams.append('alea', ex.alea)
      if (ex.interactif === '1') url.searchParams.append('i', '1')
      if (ex.cd !== undefined) url.searchParams.append('cd', ex.cd)
      if (ex.cols !== undefined) url.searchParams.append('cols', ex.cols.toString())
    }
    url.searchParams.append('v', 'eleve')
    url.searchParams.append('title', $globalOptions.title)
    url.searchParams.append('es', buildUrlAddendumForEsParam(false))
    window.open(url, '_blank').focus()
  }

  /**
   * Gestion des référentiels
   */
  // Construction pour affichage dans SideMenu du tableau des entrées du référentiel d'exos aléatoires
  const itemsSelected: string[] = []
  let arrayReferentielFiltre = updateReferentiel(false, false, itemsSelected)
  // sideMenuListReferentiel.content = [...arrayReferentielFiltre]
  $: exercisesReferentielForSideMenu = { name: 'aleatoires', title: 'Exercices aléatoires', content: [...arrayReferentielFiltre], type: 'exercices', activated: true }
  // Construction pour affichage dans SIdeMenu du tableau des entrées du référentiel
  // let arrayReferentiel: ReferentielForList = { title: "Choix des outils", content: [], type: "outils" }
  // for (const [key, value] of Object.entries(referentielOutils)) {
  //   arrayReferentiel.content.push(value)
  // }
  const ressourcesReferentielArray = Array.from(toMap({ ...referentielRessources }), ([key, obj]) => ({ key, obj }))
  const ressourcesReferentielForSideMenu: ReferentielForList = { name: 'ressources', title: 'Vos ressources', content: [...ressourcesReferentielArray], type: 'ressources', activated: true }
  // for (const [key, value] of Object.entries(rawRessourcesReferentiel)) {
  //   ressourcesReferentiel.content.push(value)
  // }
  // Contexte pour le modal des apps tierces
  import ModalGridOfCards from './modal/ModalGridOfCards.svelte'
  let thirdAppsChoiceModal: ModalGridOfCards
  import referentielAppsTierce from '../json/referentielAppsTierce.json'
  const appsTierceReferentielArray = Array.from(toMap({ ...referentielAppsTierce }), ([key, obj]) => ({ key, obj }))
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
      // console.log(typeof group)
      for (const app of group.obj.get('liste').entries()) {
        const appObj = toObject(app[1])
        if (uuidList.includes(appObj.uuid)) {
          appsTierceInExercisesList.push(appObj.uuid)
        }
        // console.log(appsTierceInExercisesList)
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
  const bibliothequeReferentielArray = Array.from(toMap({ ...referentielBibliotheque }), ([key, obj]) => ({ key, obj }))
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
    toggleBibliothequeChoiceDialog: (path) => {
      bibliothequePathToSection = path
      showBibliothequeChoiceDialog = !showBibliothequeChoiceDialog
      if (showBibliothequeChoiceDialog === false) {
        bibliothequeChoiceModal.closeModal()
      }
    }
  })
  // Construction du référentiel pour les entrées examens pour SideMenu
  const staticReferentielArray = Array.from(toMap({ ...referentielStatic }), ([key, obj]) => ({ key, obj }))
  const staticReferentielForSideMenu: ReferentielForList = { name: 'examens', title: "Annales d'examens", content: [...staticReferentielArray], type: 'examens', activated: true }
  // Construction du référentiel fictif pour les apps tierces pour SideMenu
  const appTierceReferentielForSideMenu: ReferentielForList = { name: 'apps', title: 'Applications', content: [], type: 'apps', activated: true }

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

  // Mise à jour de l'URL dès que l'on change exercicesParams (sauf pour l'URL d'arrivée sur la page)
  $: {
    if (isInitialUrlHandled) mathaleaUpdateUrlFromExercicesParams($exercicesParams)
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
  let expanding: HTMLElement = null
  let sidebarWidth = 400
  function stopResizing () {
    expanding = null
  }

  function startResizing (type: HTMLElement, event: MouseEvent) {
    expanding = type
  }

  function resizing (event: MouseEvent) {
    if (!expanding) return
    event.preventDefault()
    sidebarWidth = event.pageX
  }

  /**
   * Gestion des filtres
   */
  let isInteractiveOnlySelected: boolean = false
  let isAmcOnlySelected: boolean = false
  function updateFilters (filters) {
    let itemsAccepted = [...filters.levels]
    if (filters.types.includes('static')) {
      itemsAccepted = [...itemsAccepted, 'static']
    }
    isAmcOnlySelected = filters.types.includes('amc')
    isInteractiveOnlySelected = filters.types.includes('interactif')
    arrayReferentielFiltre = updateReferentiel(isAmcOnlySelected, isInteractiveOnlySelected, itemsAccepted)
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
        const w = Number(svg.getAttribute('data-width')) * Number($globalOptions.z)
        const h = Number(svg.getAttribute('data-height')) * Number($globalOptions.z)
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
  // Récupération des informations de l'URL
  function urlToDisplay () {
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

  // Gestion du zoom
  let zoom: number = 1
  function zoomOut () {
    zoom -= 0.25
    updateSize()
  }

  function zoomIn () {
    zoom += 0.25
    updateSize()
  }

  // Entrées dans le sideMenu à gauche
  const referentiels = $globalOptions.interfaceBeta
    ? [exercisesReferentielForSideMenu, staticReferentielForSideMenu, appTierceReferentielForSideMenu, ressourcesReferentielForSideMenu]
    : [exercisesReferentielForSideMenu, staticReferentielForSideMenu, appTierceReferentielForSideMenu, ressourcesReferentielForSideMenu]
</script>

<svelte:window on:mouseup={stopResizing} />
<div class={$darkMode.isActive ? 'dark' : ''} id="startComponent" on:mousemove={resizing} role="menu" tabindex="0">
  <div class="flex flex-col scrollbar-hide w-full h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <!-- Entête -->
    {#if isNavBarVisible}
    <div id="headerCapytale" class="bg-coopmaths-canvas">
      <NavBarIframe>
        <div slot="buttons" class="w-full">
          <ButtonsDeck>
            <div slot="setup-buttons" class="flex flex-row justify-center items-center space-x-4">
              <div class="tooltip tooltip-bottom" data-tip="Réduire la taille du texte"><Button title="" icon="bx-zoom-out" classDeclaration="flex items-center text-3xl" on:click={zoomOut} /></div>
              <div class="tooltip tooltip-bottom" data-tip="Augmenter la taille du texte"><Button title="" icon="bx-zoom-in" classDeclaration="flex items-center text-3xl" on:click={zoomIn} /></div>
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
            <div slot="input" class="flex flex-row items-center space-x-4">
              <InputText title="Importer les exercices d'une feuille élève" placeholder="Lien" bind:value={urlFeuilleEleve} classAddenda="w-50" />
              <Button
                classDeclaration="text-sm py-1 px-2 rounded-md h-7"
                title="Ajouter"
                icon=""
                isDisabled={urlFeuilleEleve.length === 0}
                on:click={() => {
                  // exemple URL vue élève
                  // http://localhost:5173/alea/?uuid=01873&id=6C20&uuid=99522&id=6C22&uuid=64422&id=6C23&v=confeleve&v=eleve&title=&es=11101
                  let url = urlFeuilleEleve.replace('&v=confeleve', '')
                  url = url.replace('&v=eleve', '&recorder=capytale')
                  const options = mathaleaUpdateExercicesParamsFromUrl(url)
                  if (options !== null) {
                    globalOptions.update(() => {
                      return options
                    })
                  } else {
                    alert('URL non valide !')
                  }
                  // console.log("Après chargement :")
                  // console.log($globalOptions)
                  urlFeuilleEleve = ''
                }}
              />
            </div>
            <div slot="export-buttons" class="flex flex-row justify-center items-center space-x-4">
              <div class="tooltip tooltip-bottom" data-tip="Régler l'affichage du mode élève">
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
            </div>
          </ButtonsDeck>
        </div>
      </NavBarIframe>
    </div>
    {/if}

    <!-- Affichage Partie Gauche : Menu + Contenu -->
    <div class="flex-1 relative flex flex-col md:flex-row h-full bg-coopmaths-canvas">
      <!-- Menu Choix Exos et Ressources -->
      <div class="mt-6 sm:mt-0">
        <div
          id="choiceMenuWrapper"
          class="{$globalOptions.v !== 'l' ? 'sm:h-[calc(100vh-7rem)]' : 'sm:h-screen'} sticky top-0 overflow-y-auto overscroll-contain bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
        >
          <SideMenu
            bind:isMenuOpen
            isMenuCloseable={$exercicesParams.length !== 0}
            bind:sidebarWidth
            referentiels={[exercisesReferentielForSideMenu, bibliothequeReferentielForSideMenu, staticReferentielForSideMenu, appTierceReferentielForSideMenu, ressourcesReferentielForSideMenu]}
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
        on:mousedown={startResizing.bind(this, 'moving')}
        role="menu"
        tabindex="0"
      />

      <!-- Affichage Partie Droite -->
      <div
        class="w-full h-screen {$globalOptions.v !== 'l'
          ? 'sm:h-[calc(100vh-7rem)]'
          : 'sm:h-screen'} sticky top-0 overflow-y-auto overscroll-contain px-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      >

        <!-- Affichage des exercices -->
        {#if $exercicesParams.length !== 0}
          <div id="exercisesWrapper" class="flex flex-col justify-between h-full mt-0 sm:mt-28 {chipsListDisplayed ? 'xl:mt-32' : 'xl:mt-24'}" bind:this={divExercices}>
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
  <ModalGridOfCards bind:this={thirdAppsChoiceModal} bind:displayModal={showThirdAppsChoiceDialog}>
    <div slot="header">Applications</div>
    <div slot="content">
      <div class="p2">
        {#each appsTierceReferentielArray as group}
          <div class="mx-2 pt-8">
            <div class="font-bold text-2xl text-coopmaths-struct py-4">{group.obj.get('rubrique')}</div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              {#each group.obj.get('liste').entries() as app, index}
                <Card application={toObject(app[1])} selected={appsTierceInExercisesList.includes(toObject(app[1]).uuid)} />
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </ModalGridOfCards>
  <ModalGridOfCards bind:this={bibliothequeChoiceModal} bind:displayModal={showBibliothequeChoiceDialog}>
    <div slot="header">
      <BreadcrumbHeader path={bibliothequePathToSection} />
    </div>
    <div slot="content">
      <div class="mx-2 pt-8">
        {#if $bibliothequeSectionContent.length === 0}
          <div>Pas d'exercices dans cette section</div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each $bibliothequeSectionContent as exercise, i}
              <ImageCard {exercise} selected={bibliothequeUuidInExercisesList.includes(exercise.uuid)} />
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </ModalGridOfCards>
  <ModalSettingsCapytale bind:showSettingsDialog bind:this={modal}>
    <div slot="header">Réglages de l'affichage des exercices</div>
    <div slot="content">
      <div class="pt-2 pl-2 grid grid-flow-row lg:grid-cols-2 gap-4">
        <div class="pb-2">
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
        </div>
        <div class="pb-2">
          <div class="pl-2 pb-2 font-light text-2xl text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Interactivité</div>
          <FormRadio
            title="Interactif"
            bind:valueSelected={$globalOptions.setInteractive}
            labelsValues={[
              { label: 'Laisser tel quel', value: '2' },
              { label: 'Tout interactif', value: '1' },
              { label: "Pas d'interactivité", value: '0' }
            ]}
          />
          <div class="pl-2 pt-2">
            <ButtonToggle
              isDisabled={$globalOptions.setInteractive === '0'}
              titles={["Les élèves peuvent modifier l'interactivité", "Les élèves ne peuvent pas modifier l'interactivité"]}
              bind:value={$globalOptions.isInteractiveFree}
            />
          </div>
          <div class="pl-2 pt-2">
            <ButtonToggle
              isDisabled={$globalOptions.setInteractive === '0'}
              titles={['Les élèves peuvent répondre une seule fois', 'Les élèves peuvent répondre plusieurs fois']}
              bind:value={$globalOptions.oneShot}
            />
          </div>
        </div>
        <div class="pb-2">
          <div class="pl-2 pb-2 font-light text-2xl text-coopmaths-struct-light dark:text-coopmathsdark-struct-light">Données</div>
          <div class="flex justify-start-items-center pl-2 font-light text-sm text-coopmaths-corpus-light">Tous les élèves auront des pages :</div>
          <div class="flex flex-row justify-start items-center px-4">
            <ButtonToggle titles={['identiques', 'différentes']} bind:value={isDataRandom} on:click={handleSeed} />
          </div>
        </div>
        <div class="pb-2">
          <div class="pl-2 pb-2 font-light text-2xl text-coopmaths-struct-light dark:text-coopmathsdark-struct-light {$globalOptions.setInteractive !== '0' ? 'text-opacity-20' : 'text-opacity-100'}">
            Correction
          </div>
          <div class="flex flex-row justify-start items-center px-4">
            <ButtonToggle titles={['Accès aux corrections', 'Pas de corrections']} isDisabled={$globalOptions.setInteractive !== '0'} bind:value={$globalOptions.isSolutionAccessible} />
          </div>
        </div>
      </div>
    </div>

    <div slot="buttons" class="flex flex-row justify-end space-x-4 w-full">
      <div class="pt-4 pb-8 px-4">
        <Button on:click={validateSettings} title="Valider" />
      </div>
      <div class="pt-4 pb-8 px-4">
        <Button on:click={handleEleveVueSetUp} title="Aperçu" />
      </div>
    </div>
  </ModalSettingsCapytale>
</div>

<style>
  @media (min-width: 768px) {
    #barre-boutons {
      width: calc(96vw - (var(--isMenuOpen) * var(--sidebarWidth) * 1px + (1 - var(--isMenuOpen)) * 20px));
    }
  }
  @media (max-width: 768px) {
    #barre-boutons {
      width: 100vw;
    }
  }
</style>
