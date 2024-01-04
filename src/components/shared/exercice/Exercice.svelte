<script lang="ts">
  import {
    mathaleaHandleParamOfOneExercice,
    mathaleaLoadExerciceFromUuid
  } from '../../../lib/mathalea'
  import { SvelteComponent, onMount } from 'svelte'
  import { globalOptions } from '../../../lib/stores/generalStore'
  import type { InterfaceParams } from '../../../lib/types'
  import uuidToUrl from '../../../json/uuidsToUrl.json'
  import ExerciceMathaleaVueEleve from './exerciceMathaleaVueEleve/ExerciceMathaleaVueEleve.svelte'
  import ExerciceStatic from './exerciceStatic/ExerciceStatic.svelte'
  import type Exercice from '../../../exercices/ExerciceTs'
  import ExerciceHtml from './presentationalComponents/exerciceHtml/ExerciceHtml.svelte'
  import ExerciceMathaleaVueProf from './exerciceMathaleaVueProf/ExerciceMathaleaVueProf.svelte'

  export let paramsExercice: InterfaceParams
  export let indiceExercice: number
  export let indiceLastExercice: number
  export let isCorrectionVisible = false

  let exercise: Exercice
  let typeExercice:
    | 'mathaleaVueProf'
    | 'mathaleaVueEleve'
    | 'static'
    | 'html'
    | 'svelte'
  let ComponentExercice: typeof SvelteComponent

  onMount(async () => {
    const urlExercice = uuidToUrl[paramsExercice.uuid as keyof typeof uuidToUrl]
    if (
      paramsExercice.uuid.startsWith('crpe-') ||
      paramsExercice.uuid.startsWith('dnb_') ||
      paramsExercice.uuid.startsWith('e3c_') ||
      paramsExercice.uuid.startsWith('bac_') ||
      paramsExercice.uuid.startsWith('2nd_')
    ) {
      typeExercice = 'static'
    } else if (urlExercice && urlExercice.includes('.svelte')) {
      typeExercice = 'svelte'
      // Pour l'instant tous les exercices Svelte doivent être dans le dossier src/exercicesInteractifs
      ComponentExercice = (
        await import(
          '../../exercicesInteractifs/' +
            urlExercice.replace('.svelte', '') +
            '.svelte'
        )
      ).default
    } else {
      exercise = await mathaleaLoadExerciceFromUuid(paramsExercice.uuid)
      if (exercise === undefined) return
      if (exercise.typeExercice && exercise.typeExercice.includes('html')) {
        typeExercice = 'html'
      } else {
        if ($globalOptions.v === 'eleve') {
          typeExercice = 'mathaleaVueEleve'
        } else {
          typeExercice = 'mathaleaVueProf'
        }
      }
      exercise.numeroExercice = indiceExercice
      mathaleaHandleParamOfOneExercice(exercise, paramsExercice)
      if (paramsExercice.duration) exercise.duree = paramsExercice.duration
    }
  })
</script>

{#if typeExercice === 'static'}
  <ExerciceStatic
    {indiceExercice}
    {indiceLastExercice}
    uuid={paramsExercice.uuid}
  />
{:else if typeExercice === 'html'}
  <ExerciceHtml
    vue={$globalOptions.v}
    {exercise}
    {indiceExercice}
    {indiceLastExercice}
  />
{:else if typeExercice === 'svelte'}
  <svelte:component
    this={ComponentExercice}
    {indiceExercice}
    {indiceLastExercice}
  />
{:else if typeExercice === 'mathaleaVueEleve'}
  <ExerciceMathaleaVueEleve
    {exercise}
    exerciseIndex={indiceExercice}
    {indiceLastExercice}
    {isCorrectionVisible}
  />
{:else if typeExercice === 'mathaleaVueProf'}
  <ExerciceMathaleaVueProf
    exercice={exercise}
    {indiceExercice}
    {indiceLastExercice}
    {isCorrectionVisible}
  />
{/if}

<style>
</style>
