<script lang="ts">
  import type Exercice from '../../../../../exercices/Exercice'

  export let exercises: Exercice[]
  export let isManualModeActive: boolean
  export let updateManualMode: (isManualModeActive: boolean) => void
  export let durationGlobal: number | undefined
  export let updateDurationGlobal: (durationGlobal: number | undefined) => void

  let previousDurationGlobal = durationGlobal || 10
  let isSameDurationForAll = !!durationGlobal
  function handleChangeIsSameDurationForAll () {
    if (isSameDurationForAll) {
      updateDurationGlobal(previousDurationGlobal)
    } else {
      updateDurationGlobal(undefined)
    }
  }

</script>

<div class="flex flex-col lg:flex-row px-4 pb-4 w-full justify-start lg:justify-between lg:items-center">
  <div class="flex text-lg font-bold text-coopmaths-struct dark:text-coopmathsdark-struct">
    Durées et nombres de questions
  </div>
  <div class="flex items-center">
    <input
      id="diaporama-defilement-manuel-checkbox"
      aria-describedby="diaporama-defilement-manuel-checkbox"
      type="checkbox"
      checked={isManualModeActive}
      class="bg-coopmaths-canvas border-coopmaths-action text-coopmaths-action dark:bg-coopmathsdark-canvas dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action h-4 w-4 rounded"
      on:change={() => updateManualMode(!isManualModeActive)}
    />
    <label
      for="diaporama-defilement-manuel-checkbox"
      class="ml-3 mr-4 font-medium text-coopmaths-corpus dark:text-coopmathsdark-corpus"
    >
      Défilement manuel
    </label>
    <input
      id="diaporama-meme-duree-checkbox"
      aria-describedby="diaporama-meme-duree-checkbox"
      type="checkbox"
      class="bg-coopmaths-canvas border-coopmaths-action text-coopmaths-action dark:bg-coopmathsdark-canvas dark:border-coopmathsdark-action dark:text-coopmathsdark-action
      {exercises.length === 1 || isManualModeActive
        ? 'border-opacity-30 dark:border-opacity-30'
        : 'border-opacity-100 dark:border-opacity-100'} focus:ring-3 focus:ring-coopmaths-action h-4 w-4 rounded"
      bind:checked={isSameDurationForAll}
      on:change={handleChangeIsSameDurationForAll}
      disabled={exercises.length === 1 || isManualModeActive}
    />
    <label
      for="diaporama-meme-duree-checkbox"
      class="ml-3 font-medium text-coopmaths-corpus dark:text-coopmathsdark-corpus
      {exercises.length === 1 || isManualModeActive
        ? 'text-opacity-30 dark:text-opacity-30'
        : 'text-opacity-100 dark:text-opacity-100'} "
    >
      Même durée pour toutes les questions
      <input
        type="number"
        id="diaporama-meme-duree-input"
        min="1"
        on:change={() => updateDurationGlobal(previousDurationGlobal)}
        bind:value={previousDurationGlobal}
        class="ml-3 w-20 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border {isSameDurationForAll
          ? ''
          : 'border-transparent'} border-coopmaths-action dark:border-coopmathsdark-action focus:border-1 focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:opacity-30"
        disabled={!isSameDurationForAll || isManualModeActive}
      />
    </label>
  </div>
</div>
