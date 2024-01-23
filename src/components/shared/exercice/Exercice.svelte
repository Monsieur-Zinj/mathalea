<script lang="ts">
  import {
    mathaleaHandleParamOfOneExercice,
    mathaleaLoadExerciceFromUuid
  } from '../../../lib/mathalea'
  import { SvelteComponent, onMount } from 'svelte'
  import { globalOptions } from '../../../lib/stores/generalStore'
  import type { InterfaceParams } from '../../../lib/types'
  import uuidToUrl from '../../../json/uuidsToUrl.json'
  import ExerciceStatic from './presentationalComponents/exerciceStatic/ExerciceStatic.svelte'
  import Exercice from '../../../exercices/Exercice'
  import ExerciceHtml from './presentationalComponents/exerciceHtml/ExerciceHtml.svelte'
  import ExerciceMathalea from './exerciceMathalea/ExerciceMathalea.svelte'

  export let paramsExercice: InterfaceParams
  export let indiceExercice: number
  export let indiceLastExercice: number
  export let isCorrectionVisible = false

  type ExerciseType = 'mathaleaVueProf' | 'mathaleaVueEleve' | 'static' | 'html' | 'svelte'

  let exercise: Exercice
  let exerciseType: ExerciseType
  let ComponentExercice: typeof SvelteComponent

  onMount(async () => {
    if (isStatic(paramsExercice.uuid)) {
      exerciseType = 'static'
    } else if (isSvelte(paramsExercice.uuid)) {
      exerciseType = 'svelte'
      ComponentExercice = await getSvelteComponent(paramsExercice)
    } else {
      exercise = await getExercise(paramsExercice)
      exerciseType = await getExerciseType(exercise)
    }
  })

  function isStatic (uuid: string) {
    return uuid.startsWith('crpe-') ||
      uuid.startsWith('dnb_') ||
      uuid.startsWith('e3c_') ||
      uuid.startsWith('bac_') ||
      uuid.startsWith('2nd_')
  }

  function isSvelte (uuid: string) {
    const urlExercice = uuidToUrl[uuid as keyof typeof uuidToUrl]
    return urlExercice && urlExercice.includes('.svelte')
  }

  async function getSvelteComponent (paramsExercice: InterfaceParams) {
    const urlExercice = uuidToUrl[paramsExercice.uuid as keyof typeof uuidToUrl]
    // Pour l'instant tous les exercices Svelte doivent être dans le dossier src/exercicesInteractifs
    return (await import('../../../exercicesInteractifs/' + urlExercice.replace('.svelte', '') + '.svelte')).default
  }

  async function getExercise (paramsExercice: InterfaceParams): Promise<Exercice> {
    const exercise = await mathaleaLoadExerciceFromUuid(paramsExercice.uuid)
    exercise.numeroExercice = indiceExercice
    mathaleaHandleParamOfOneExercice(exercise, paramsExercice)
    if (paramsExercice.duration) exercise.duree = paramsExercice.duration
    return exercise
  }

  async function getExerciseType (exercise: Exercice): Promise<ExerciseType> {
    if (exercise.typeExercice && exercise.typeExercice.includes('html')) {
      return 'html'
    } else {
      if ($globalOptions.v === 'eleve') {
        return 'mathaleaVueEleve'
      } else {
        return 'mathaleaVueProf'
      }
    }
  }
</script>

{#if exerciseType === 'static'}
  <ExerciceStatic
    {indiceExercice}
    {indiceLastExercice}
    uuid={paramsExercice.uuid}
    zoomFactor={$globalOptions.z ?? '1'}
    isSolutionAccessible={!!$globalOptions.isSolutionAccessible}
  />
{:else if exerciseType === 'html'}
  <ExerciceHtml
    vue={$globalOptions.v}
    {exercise}
    {indiceExercice}
    {indiceLastExercice}
  />
{:else if exerciseType === 'svelte'}
  <svelte:component
    this={ComponentExercice}
    {indiceExercice}
    {indiceLastExercice}
  />
{:else if exerciseType === 'mathaleaVueEleve'}
<ExerciceMathalea
  vue='eleve'
  {exercise}
  exerciseIndex={indiceExercice}
  {indiceLastExercice}
  {isCorrectionVisible}
/>
{:else if exerciseType === 'mathaleaVueProf'}
<ExerciceMathalea
  vue='prof'
  {exercise}
  exerciseIndex={indiceExercice}
  {indiceLastExercice}
  {isCorrectionVisible}
/>
{/if}

<style>
</style>
