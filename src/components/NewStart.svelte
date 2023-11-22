<script lang="ts">
  import { onMount } from 'svelte'
  import {
    darkMode,
    exercicesParams,
    globalOptions
  } from './stores/generalStore'
  import {
    mathaleaUpdateExercicesParamsFromUrl,
    mathaleaUpdateUrlFromExercicesParams
  } from '../lib/mathalea'
  import handleCapytale from '../lib/handleCapytale'
  import NavBar from './header/NavBar.svelte'

  let divExercices: HTMLDivElement
  let isNavBarVisible: boolean = true
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
</script>

<div class={$darkMode.isActive ? 'dark' : ''} id="startComponent">
  <div
    class="flex flex-col scrollbar-hide w-full h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
  >
    <!-- Entête -->
    {#if isNavBarVisible}
      <div
        id="headerStart"
        class="sticky top-0 shrink-0 z-0 h-28 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas print-hidden"
      >
        <NavBar subtitle="Conception de document" subtitleType="design" />
      </div>
    {/if}
  </div>
</div>
