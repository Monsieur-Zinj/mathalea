<script lang="ts">
  import {
    mathaleaHandleParamOfOneExercice,
    mathaleaLoadExerciceFromUuid
  } from '../../lib/mathalea'
  import { SvelteComponent, onMount } from 'svelte'
  import { globalOptions } from '../store'
  import type { InterfaceParams } from '../../lib/types'
  import uuidToUrl from '../../json/uuidsToUrl.json'
  // import ExerciceMathalea from './ExerciceMathalea.svelte'
  import ExerciceVueEleve from './ExerciceVueEleve.svelte'
  import ExerciceStatic from './ExerciceStatic.svelte'
  import type Exercice from '../../exercices/ExerciceTs'
  import ExerciceHtml from './ExerciceHtml.svelte'
  import NewExerciceMathalea from './NewExerciceMathalea.svelte'

  export let paramsExercice: InterfaceParams
  export let indiceExercice: number
  export let indiceLastExercice: number
  export let isCorrectionVisible = false

  let exercice: Exercice
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
      exercice = await mathaleaLoadExerciceFromUuid(paramsExercice.uuid)
      if (exercice === undefined) return
      if (exercice.typeExercice && exercice.typeExercice.includes('html')) {
        typeExercice = 'html'
      } else {
        if ($globalOptions.v === 'eleve') {
          typeExercice = 'mathaleaVueEleve'
        } else {
          typeExercice = 'mathaleaVueProf'
        }
      }
      exercice.numeroExercice = indiceExercice
      mathaleaHandleParamOfOneExercice(exercice, paramsExercice)
      if (paramsExercice.duration) exercice.duree = paramsExercice.duration
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
  <ExerciceHtml {exercice} {indiceExercice} {indiceLastExercice} />
{:else if typeExercice === 'svelte'}
  <svelte:component
    this={ComponentExercice}
    {indiceExercice}
    {indiceLastExercice}
  />
{:else if typeExercice === 'mathaleaVueEleve'}
  <ExerciceVueEleve
    {exercice}
    {indiceExercice}
    {indiceLastExercice}
    {isCorrectionVisible}
  />
{:else if typeExercice === 'mathaleaVueProf'}
  <NewExerciceMathalea
    {exercice}
    {indiceExercice}
    {indiceLastExercice}
    {isCorrectionVisible}
  />
{/if}

<style>
</style>
