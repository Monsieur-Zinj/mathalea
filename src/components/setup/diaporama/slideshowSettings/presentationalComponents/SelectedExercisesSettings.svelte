<script lang="ts">
  import type { InterfaceSelectedExercises } from '../../../../../lib/stores/generalStore'
  import type Exercice from '../../../../../exercices/Exercice'

  export let exercises: Exercice[]
  export let selectedExercises: InterfaceSelectedExercises
  export let updateSelectedExercises: (selectedExercises: InterfaceSelectedExercises) => void

  let isActive: boolean = !!selectedExercises.count

</script>

<div class="pb-6">
  <div
    class="flex text-lg font-bold mb-1 text-coopmaths-struct dark:text-coopmathsdark-struct
    {exercises.length === 1 ? 'text-opacity-20' : 'text-opacity-100'}"
  >
    Choix aléatoire
  </div>
  <div class="flex flex-row justify-start items-center px-4">
    <input
      id="checkbox-choice-6"
      aria-describedby="checkbox-choice"
      type="checkbox"
      class="w-4 h-4 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas {exercises.length === 1
        ? 'border-opacity-10'
        : 'border-opacity-100'}
        border-coopmaths-action text-coopmaths-action dark:border-coopmathsdark-action dark:text-coopmathsdark-action
        focus:ring-3 focus:ring-coopmaths-action dark:focus:ring-coopmathsdark-action h-4 w-4 rounded"
      bind:checked={isActive}
      on:change={() => {
        selectedExercises.count = isActive ? exercises.length - 1 : undefined
        updateSelectedExercises(selectedExercises)
      }}
      disabled={exercises.length === 1}
    />
    <label
      for="checkbox-choice-6"
      class="ml-3 text-sm font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus {exercises.length === 1
        ? 'text-opacity-10 dark:text-opacity-10'
        : 'text-opacity-70 dark:text-opacity-70'}"
    >
      Seulement certains exercices de la liste
    </label>
  </div>
  <div class="pl-8">
    <input
      type="number"
      id="diaporama-nb-exos-dans-liste-input"
      min="1"
      max={exercises.length}
      bind:value={selectedExercises.count}
      on:change={() => updateSelectedExercises(selectedExercises)}
      class="ml-3 w-14 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-1 border-coopmaths-canvas-darkest focus:border-1 focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:opacity-0"
      disabled={!selectedExercises.count}
    />
    <span
      class="text-coopmaths-corpus dark:text-coopmathsdark-corpus {selectedExercises.count
        ? 'text-opacity-100 dark:text-opacity-100'
        : 'text-opacity-0 dark:text-opacity-0'}"
    >
      parmi {exercises.length}
    </span>
  </div>
</div>
