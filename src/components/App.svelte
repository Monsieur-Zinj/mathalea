<script lang="ts">
  // import Start from './Start.svelte'
  import Diaporama from './Diaporama.svelte'
  import Apercu from './Apercu.svelte'
  import Eleve from './Eleve.svelte'
  import ConfigEleve from './ConfigEleve.svelte'
  import Latex from './Latex.svelte'
  import { freezeUrl, globalOptions, isInIframe } from './stores/generalStore'
  import { context } from '../modules/context.js'
  import {
    ElementButtonInstrumenpoche,
    ElementInstrumenpoche
  } from '../modules/ElementInstrumenpoche.js'
  import Amc from './Amc.svelte'
  import Moodle from './Moodle.svelte'
  import Capytale from './Capytale.svelte'
  import Test from './Test.svelte'
  import Start from './Start.svelte'

  context.versionMathalea = 3
  if (customElements.get('alea-instrumenpoche') === undefined) {
    customElements.define('alea-instrumenpoche', ElementInstrumenpoche)
    customElements.define(
      'alea-buttoninstrumenpoche',
      ElementButtonInstrumenpoche
    )
  }

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

  $: {
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
    // lorsque l'éditeur sera intégré à la v3, il faudra mettre à true cette propriété pour l'editeur
    context.isInEditor = false
  }
</script>

<div class="subpixel-antialiased">
  {#if $globalOptions.v === 'diaporama'}
    <Diaporama />
  {:else if $globalOptions.v === 'can'}
    <Apercu
 />
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
  <!-- {:else if $globalOptions.v === 'tools'}
    <OutilsProf /> -->
  {:else if $globalOptions.v === 'test'}
    <Test />
  {:else if $globalOptions.recorder === 'capytale'}
    <Capytale />
  {:else}
    <Start />
  {/if}
</div>
