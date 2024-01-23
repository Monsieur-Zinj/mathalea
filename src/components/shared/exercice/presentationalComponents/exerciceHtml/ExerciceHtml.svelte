<script lang="ts">
  import { onMount } from 'svelte'
  import HeaderExerciceVueProf from '../../shared/headerExerciceVueProf/HeaderExerciceVueProf.svelte'
  import type TypeExercice from '../../../../../exercices/Exercice'
  import HeaderExerciceVueEleve from '../shared/HeaderExerciceVueEleve.svelte'
  import type { VueType } from '../../../../../lib/types'
  import { globalOptions, isMenuNeededForExercises } from '../../../../../lib/stores/generalStore'
  export let vue: VueType | undefined
  export let exercise: TypeExercice
  export let indiceExercice: number
  export let indiceLastExercice: number

  let divExercice: HTMLDivElement

  const headerExerciceProps = {
    title: exercise.titre,
    id: '',
    indiceExercice,
    indiceLastExercice,
    interactifReady: false,
    randomReady: true,
    settingsReady: false,
    correctionReady: false
  }

  onMount(async () => {
    if (exercise.html != null) {
      divExercice.appendChild(exercise.html)
    }
    const exercicesAffiches = new window.Event('addedToDom', { bubbles: true })
    divExercice.children[0].dispatchEvent(exercicesAffiches)
  })

  $: {
    headerExerciceProps.indiceExercice = indiceExercice
    headerExerciceProps.indiceLastExercice = indiceLastExercice
  }
</script>

{#if vue === 'eleve'}
  <HeaderExerciceVueEleve
    {...headerExerciceProps}
    isMenuNeededForExercises={$isMenuNeededForExercises}
    presMode={$globalOptions.presMode}
  />
{:else}
  <HeaderExerciceVueProf {...headerExerciceProps} />
{/if}
<section id="insert-html-{indiceExercice}" class="mt-6 mb-2 ml-2 lg:mx-5">
  <div bind:this={divExercice} />
</section>
