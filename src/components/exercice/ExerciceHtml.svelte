<script lang="ts">
  import { onMount } from 'svelte'
  import HeaderExercice from './HeaderExercice.svelte'
  import type TypeExercice from '../utils/typeExercice'
  import { globalOptions } from '../store'
  import HeaderExerciceVueEleve from './HeaderExerciceVueEleve.svelte'
  export let exercice: TypeExercice
  export let indiceExercice: number
  export let indiceLastExercice: number

  let divExercice: HTMLDivElement

  const headerExerciceProps = {
    title: exercice.titre,
    id: '',
    indiceExercice,
    indiceLastExercice,
    interactifReady: false,
    randomReady: true,
    settingsReady: false,
    correctionReady: false
  }

  onMount(async () => {
    divExercice.appendChild(exercice.html)
    const exercicesAffiches = new window.Event('addedToDom', { bubbles: true })
    divExercice.children[0].dispatchEvent(exercicesAffiches)
  })

  $: {
    headerExerciceProps.indiceExercice = indiceExercice
    headerExerciceProps.indiceLastExercice = indiceLastExercice
  }
</script>

{#if $globalOptions.v === 'eleve'}
  <HeaderExerciceVueEleve {...headerExerciceProps} />
{:else}
  <HeaderExercice {...headerExerciceProps} />
{/if}
<section id="insert-html-{indiceExercice}" class="mt-6 mb-2 ml-2 lg:mx-5">
  <div bind:this={divExercice} />
</section>
