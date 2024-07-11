<script lang="ts">
  import Diaporama from './setup/diaporama/Diaporama.svelte'
  import Eleve from './display/eleve/Eleve.svelte'
  import ConfigEleve from './setup/configEleve/ConfigEleve.svelte'
  import Latex from './setup/latex/Latex.svelte'
  import {
    darkMode,
    exercicesParams,
    freezeUrl,
    globalOptions,
    isInIframe
  } from '../lib/stores/generalStore'
  import { context } from '../modules/context.js'
  import {
    ElementButtonInstrumenpoche,
    ElementInstrumenpoche
  } from '../modules/ElementInstrumenpoche.js'
  import Amc from './setup/amc/Amc.svelte'
  import Anki from './setup/anki/Anki.svelte'
  import Moodle from './setup/moodle/Moodle.svelte'
  import Start from './setup/start/Start.svelte'
  import { onMount } from 'svelte'
  import {
    mathaleaUpdateExercicesParamsFromUrl,
    mathaleaUpdateUrlFromExercicesParams
  } from '../lib/mathalea'
  import Can from './display/can/Can.svelte'
  import { canOptions } from '../lib/stores/canStore'
  import type { CanSolutionsMode } from '../lib/types/can'
  import { updateReferentielLocaleFromURL } from '../lib/stores/languagesStore'

  let isInitialUrlHandled = false

  context.versionMathalea = 3
  if (customElements.get('alea-instrumenpoche') === undefined) {
    customElements.define('alea-instrumenpoche', ElementInstrumenpoche)
    customElements.define(
      'alea-buttoninstrumenpoche',
      ElementButtonInstrumenpoche
    )
  }

  // let InterfaceExercicesParams : any
  // exercicesParams.subscribe(value => {
  //   console.log('exercicesParams updated')
  //   if (InterfaceExercicesParams){
  //     if (JSON.stringify(InterfaceExercicesParams) !== JSON.stringify(value)){
  //       console.log('exercicesParams updated and difference')
  //       console.log(JSON.stringify(InterfaceExercicesParams))
  //     }
  //     InterfaceExercicesParams = value
  //   } else {
  //     InterfaceExercicesParams = value
  //   }
  //   console.log(JSON.stringify(value))
  // })

  // Gestion des recorders (Moodle, Capytale, etc. )
  // Lorsque la page d'accueil est dans un iFrame, l'URL est bloquée et les boutons d'exports cachés
  const url = new URL(window.location.href)
  const recorder = url.searchParams.get('recorder')
  if (recorder !== null) {
    isInIframe.set(true)
    freezeUrl.set(true)
  } else {
    isInIframe.set(false)
  }

  // Gestion des paramètres de la CAN
  const canDuration = url.searchParams.get('canD')
  if (canDuration !== null) {
    $canOptions.durationInMinutes = parseInt(canDuration)
  }
  const canSub = url.searchParams.get('canT')
  if (canSub !== null) {
    $canOptions.subTitle = canSub
  }
  const canSolAccess = url.searchParams.get('canSA')
  if (canSolAccess !== null) {
    $canOptions.solutionsAccess = canSolAccess === 'true'
  }
  const canSolMode = url.searchParams.get('canSM')
  if (canSolMode !== null) {
    $canOptions.solutionsMode = canSolMode as CanSolutionsMode
  }
  const canIsInteractive = url.searchParams.get('canI')
  if (canIsInteractive !== null) {
    $canOptions.isInteractive = canIsInteractive === 'true'
  }
  onMount(handleInitialUrl)

  $: {
    if (isInitialUrlHandled) {
      mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    }
    context.isDiaporama = $globalOptions.v === 'diaporama'
    if ($globalOptions.v === 'latex') {
      context.isHtml = false
    } else {
      context.isHtml = true
    }
    if ($globalOptions.v === 'confeleve') {
      context.isHtml = false
    }
    if ($globalOptions.v === 'amc') {
      context.isAmc = true
      context.isHtml = false
    } else {
      context.isAmc = false
    }
    context.vue = ''
    if ($globalOptions.v === 'diaporama') context.vue = 'diap' // for compatibility
    if ($globalOptions.v === 'latex') context.vue = 'latex' // for compatibility
    if ($globalOptions.v === 'can') context.vue = 'can' // for compatibility
    // lorsque l'éditeur sera intégré à la v3, il faudra mettre à true cette propriété pour l'editeur
    context.isInEditor = false
  }

  function handleInitialUrl () {
    updateReferentielLocaleFromURL()
    const urlOptions = mathaleaUpdateExercicesParamsFromUrl()
    globalOptions.update(() => {
      return urlOptions
    })
    isInitialUrlHandled = true
  }

  function isDevMode () {
    return window.location.href.startsWith('http://localhost')
  }
</script>

<div class=" {$darkMode.isActive
  ? 'dark'
  : ''} subpixel-antialiased bg-coopmaths-canvas dark:bg-coopmathsdark-canvas" id="appComponent">
  {#if $globalOptions.v === 'diaporama' || $globalOptions.v === 'overview'}
    <Diaporama />
  {:else if $globalOptions.v === 'can'}
    <Can />
  {:else if $globalOptions.v === 'eleve'}
    <Eleve />
  {:else if $globalOptions.v === 'latex'}
    <Latex />
  {:else if $globalOptions.v === 'confeleve'}
    <ConfigEleve />
  {:else if $globalOptions.v === 'amc'}
    <Amc />
  {:else if $globalOptions.v === 'moodle'}
    <Moodle />
  {:else if $globalOptions.v === 'anki'}
    <Anki />
  {:else}
    <Start />
  {/if}
</div>

{#if isDevMode()}
  <dialog
    id="notifDialog"
    class="rounded-xl p-6 bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg"
  ></dialog>
{/if}
