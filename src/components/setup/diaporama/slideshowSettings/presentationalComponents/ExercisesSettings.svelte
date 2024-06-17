<script lang="ts">
  import type Exercice from '../../../../../exercices/Exercice'
  import type { InterfaceSelectedExercises } from '../../../../../lib/stores/generalStore'

  export let exercises: Exercice[]
  export let selectedExercises: InterfaceSelectedExercises
  export let isManualModeActive: boolean
  export let stringDureeTotale: string
  export let updateExercises: () => void
  export let isSameDurationForAll: boolean

  $: getTotalNbOfQuestions = () => {
    let sum = 0
    for (const [i, exercice] of exercises.entries()) {
      if (selectedExercises.count) {
        if (selectedExercises.indexes.includes(i)) {
          sum += exercice.nbQuestions
        }
      } else {
        sum += exercice.nbQuestions
      }
    }
    return sum
  }

</script>

<div class="table-wrp block shadow ring-1 ring-coopmaths-struct dark:ring-coopmathsdark-struct ring-opacity-10 dark:ring-opacity-20 md:rounded-lg">
  <table class="table-fixed min-w-full divide-y divide-coopmaths-struct dark:divide-coopmathsdark-struct divide-opacity-10 dark:divide-opacity-20">
    <thead class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark sticky top-0">
      <th
        scope="col"
        class="py-3.5 pl-4 pr-3 w-4/6 text-left text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct sm:pl"
      >
        Exercices<span
          class="pl-2 font-extralight text-opacity-60 {selectedExercises.count
            ? ''
            : 'invisible'}"
          >({selectedExercises.count} parmi {exercises.length})</span>
      </th>
      <th
        scope="col"
        class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        <div class={isManualModeActive ? 'opacity-20' : ''}>
          Durées par question (s)
        </div>
        <div class=" text-coopmaths-struct-light dark:text-coopmathsdark-struct-light font-light text-xs">
          {#if !isManualModeActive}
            Durée diapo :<span class="font-light ml-1">{stringDureeTotale}</span>
          {:else}
            <span class="font-light ml-1" />
          {/if}
        </div>
      </th>
      <th
        scope="col"
        class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        <div>Nombres de questions</div>
        <div class="text-coopmaths-struct-light dark:text-coopmathsdark-struct-light font-light text-xs">
          Total :<span class="font-light ml-1">{getTotalNbOfQuestions()}</span>
        </div>
      </th>
    </thead>
    <tbody class="overflow-y-auto" id="exercisesList">
      {#each exercises as exercice, i}
        <tr>
          <td class="whitespace-normal px-3 py-4 text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus">
            <span
              class="{selectedExercises.count &&
              selectedExercises.indexes.includes(i)
                ? ''
                : 'invisible'} pr-2"
            >
              <i class="bx text-xs bxs-circle text-coopmaths-warn-lightest dark:text-coopmathsdark-warn-lightest"/>
            </span>
            {exercice.id} - {exercice.titre}
          </td>
          <td class="whitespace-normal px-3 py-4 text-sm">
            <span class="flex justify-center">
              <input
                type="number"
                id="diaporama-exo-duration-{i}"
                min="1"
                bind:value={exercice.duration}
                on:change={updateExercises}
                class="ml-3 w-16 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-1 focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 disabled:opacity-30"
                disabled={isSameDurationForAll || isManualModeActive}
              />
            </span>
          </td>
          <td class="whitespace-normal px-3 py-4 text-sm">
            <span class="flex justify-center">
              <input
                type="number"
                id="diaporama-exo-nb-questions-{i}"
                min="1"
                bind:value={exercice.nbQuestions}
                on:change={updateExercises}
                class="ml-3 w-16 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-1 focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0"
              />
            </span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-wrp {
    max-height: 60%;
    overflow-y: auto;
    display: block;
  }
  thead {
    position: sticky;
    top: 0;
  }
</style>
