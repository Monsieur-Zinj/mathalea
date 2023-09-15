<script lang="ts">
  import HeaderExercice from './HeaderExercice.svelte'
  import referentielStatic from '../../json/referentielStatic.json'
  import { globalOptions, exercicesParams } from '../store'
  import Exercice from "../../exercices/ExerciceTs.js";

  export let uuid: string
  export let indiceExercice: number
  export let indiceLastExercice: number
interface ExoStatic extends Exercice {
    png: string | string[]
  pngCor: string | string[]
  mois: string
  annee: string
  lieu: string
  typeExercice: string
  uuid: string
  numeroInitial: string
}
function getExerciceByUuid (root: object, targetUUID: string): ExoStatic | null {
  if ('uuid' in root) {
    if (root.uuid === targetUUID) {
      return root
    }
  }
  for (const child in root) {
    if (child in root) {
      if (typeof root[child] !== 'object') continue
      const foundObject = getExerciceByUuid(root[child], targetUUID)
      if (foundObject) {
        return foundObject
      }
    }
  }

  return null
}

  const exercice = getExerciceByUuid(referentielStatic, uuid)

  let isCorrectionVisible = false
  let isContentVisible = true
  $: zoomFactor = $globalOptions.z
if (exercice!= null) {
  if (typeof exercice.png === 'string') exercice.png = [exercice.png]
  if (typeof exercice.pngCor === 'string') exercice.pngCor = [exercice.pngCor]
  const id: string = $exercicesParams[indiceExercice]?.id ? String(exercice.id).replace('.js', '') : ''
  const headerExerciceProps = {title: '', id, isInteractif: false, settingsReady: false, interactifReady: false, randomReady: false, correctionReady: $globalOptions.isSolutionAccessible}
  if (exercice.typeExercice !== undefined) {
    headerExerciceProps.title = `${exercice.typeExercice.toUpperCase()} - ${exercice.mois || ''} ${exercice.annee} - ${exercice.lieu} - ${exercice.numeroInitial}`
  } else {
    headerExerciceProps.title = exercice.uuid
  }
}
</script>

<HeaderExercice
  {...headerExerciceProps}
  {indiceExercice}
  {indiceLastExercice}
  on:clickCorrection={(event) => {
    isCorrectionVisible = event.detail.isCorrectionVisible
  }}
  on:clickVisible={(event) => {
    isContentVisible = event.detail.isVisible
    isCorrectionVisible = event.detail.isVisible
  }}
/>

<div class="p-4">
  {#if isContentVisible}
    {#if exercice}
    {#each exercice.png as url}
      <img src={url} style="width: calc(100% * {zoomFactor}" alt="énoncé" />
    {/each}
      {/if}
  {/if}

  {#if isCorrectionVisible}
    <div
      class="relative border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus mt-6 lg:mt-2 mb-6 py-2 pl-4"
      id="correction{indiceExercice}"
    >
      <div class="container">
        {#if exercice}
        {#each exercice.pngCor as url}
          <img src={url} class="p-2" style="width: calc(100% * {zoomFactor}" alt="correction" />
        {/each}
          {/if}
      </div>
      <!-- <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct top-0 left-0 border-b-[3px] w-10" /> -->
      <div
        class="absolute flex flex-row py-[1.5px] px-3 rounded-t-md justify-center items-center -left-[3px] -top-[15px] bg-coopmaths-struct dark:bg-coopmathsdark-struct font-semibold text-xs text-coopmaths-canvas dark:text-coopmathsdark-canvas"
      >
        Correction
      </div>
      <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct bottom-0 left-0 border-b-[3px] w-4" />
    </div>
  {/if}
</div>
