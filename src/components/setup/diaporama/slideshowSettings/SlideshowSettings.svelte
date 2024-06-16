<script lang="ts">
  import type Exercice from '../../../../exercices/Exercice'
  import type { DataFromSettings, TransitionsBetweenQuestions } from '../types'
  import type { NumberRange } from '../../../../lib/types'
  import DisplaySettings from './presentationalComponents/DisplaySettings.svelte'
  import LinksSettings from './presentationalComponents/LinksSettings.svelte'
  import NbOfViewsSettings from './presentationalComponents/NbOfViewsSettings.svelte'
  import OrderSettings from './presentationalComponents/OrderSettings.svelte'
  import SelectedExercisesSettings from './presentationalComponents/SelectedExercisesSettings.svelte'
  import TransitionSettings from './presentationalComponents/TransitionSettings.svelte'
  import NavBar from '../../../shared/header/NavBar.svelte'
  import { createEventDispatcher, tick } from 'svelte'
  import { listOfRandomIndexes } from '../../../../lib/components/shuffle'
  import { formattedTimeStamp } from '../../../../lib/components/time'
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import {
    questionsOrder,
    selectedExercises,
    globalOptions,

    type InterfaceSelectedExercises

  } from '../../../../lib/stores/generalStore'
  import { referentielLocale } from '../../../../lib/stores/languagesStore'

  export let exercises: Exercice[]
  export let updateExercises: () => void
  export let handleChangeDurationGlobal: (durationGlobal: number | undefined) => void
  export let transitionSounds: { 0: HTMLAudioElement; 1: HTMLAudioElement; 2: HTMLAudioElement; 3: HTMLAudioElement; }

  const dispatch: (type: string, detail?: DataFromSettings) => void = createEventDispatcher()
  const settings: DataFromSettings = {
    currentQuestion: -1,
    formatQRCodeIndex: 0,
    isManualModeActive: false,
    QRCodeWidth: 100,
    nbOfVues: $globalOptions.nbVues || 1,
    timer: $globalOptions.durationGlobal ?? 10,
    transitionsBetweenQuestions: {
      isActive: $globalOptions.trans || false,
      isNoisy: true,
      isQuestThenSolModeActive: false,
      questThenQuestAndSolDisplay: false,
      tune: $globalOptions.sound || '1'
    }
  }
  let stringDureeTotale = '0'
  let divTableDurationsQuestions: HTMLDivElement
  let durationGlobal = $globalOptions.durationGlobal
  let previousDurationGlobal = 10 // Utile si on décoche puis recoche "Même durée pour toutes les questions"
  let isSameDurationForAll = !!$globalOptions.durationGlobal

  function applyRandomSelectionOfExercises () {
    if ($selectedExercises.count) {
      $selectedExercises.indexes = [...listOfRandomIndexes(exercises.length, $selectedExercises.count!)]
    } else {
      $selectedExercises.indexes = [...Array(exercises.length).keys()]
    }
  }

  $: if (exercises && exercises.length > 0) {
    updateDisplayedTotalDuration()
    applyRandomSelectionOfExercises()
  }

  $: {
    if (divTableDurationsQuestions) {
      mathaleaRenderDiv(divTableDurationsQuestions)
    }
    if (durationGlobal) previousDurationGlobal = durationGlobal
    if (isSameDurationForAll && previousDurationGlobal) {
      durationGlobal = previousDurationGlobal
    }
    if (isSameDurationForAll && typeof durationGlobal === 'undefined') {
      durationGlobal = 10
    } else if (!isSameDurationForAll) {
      durationGlobal = undefined
    }
  }

function updateDurations () {
  handleChangeDurationGlobal(isSameDurationForAll ? durationGlobal : undefined)
}

/**
 * Calcule le nombre total de questions
 */
$: getTotalNbOfQuestions = () => {
  let sum = 0
  for (const [i, exercice] of exercises.entries()) {
    if ($selectedExercises.count) {
      if ($selectedExercises.indexes.includes(i)) {
        sum += exercice.nbQuestions
      }
    } else {
      sum += exercice.nbQuestions
    }
  }
  return sum
}

function handleCheckManualMode () {
  settings.isManualModeActive = !settings.isManualModeActive
}

function updateData () {
  globalOptions.update((l) => {
    l.durationGlobal = durationGlobal
    return l
  })
  dispatch('updateData', settings)
}

/**
 * Calcule la durée totale du diaporama
 * (durée par question x nombre de questions)
 */
function getTotalDuration () {
  let sum = 0
  for (const [i, exercice] of exercises.entries()) {
    if ($selectedExercises.count) {
      if ($selectedExercises.indexes.includes(i)) {
        sum +=
          (isSameDurationForAll
            ? durationGlobal ?? 10
            : exercice.duration ?? 10) * exercice.nbQuestions
      }
    } else {
      sum +=
        (isSameDurationForAll
          ? durationGlobal ?? 10
          : exercice.duration ?? 10) * exercice.nbQuestions
    }
  }
  return sum
}

async function updateDisplayedTotalDuration () {
  stringDureeTotale = formattedTimeStamp(getTotalDuration())
  await tick()
  if (divTableDurationsQuestions) {
    mathaleaRenderDiv(divTableDurationsQuestions)
  }
}

function updateNbOfViews (nbOfViews: NumberRange<1, 4>) {
  settings.nbOfVues = nbOfViews
  globalOptions.update((l) => {
    l.nbVues = nbOfViews
    return l
  })
}

function updateTransition (transitionsBetweenQuestions: TransitionsBetweenQuestions) {
  settings.transitionsBetweenQuestions = transitionsBetweenQuestions
  updateData()
}

function updateQuestionsOrder (isQuestionsShuffled: boolean) {
  $questionsOrder.isQuestionsShuffled = isQuestionsShuffled
  updateData()
}

function updateSelectedExercises (newSelectedExercises: InterfaceSelectedExercises) {
  selectedExercises.set(newSelectedExercises)
  applyRandomSelectionOfExercises()
  globalOptions.update((l) => {
    l.choice = $selectedExercises.count
    return l
  })
  getTotalNbOfQuestions()
  updateData()
}

function start () {
  settings.currentQuestion = 0
  updateData()
}

</script>

<div
  id="start"
  class="flex flex-col h-screen scrollbar-hide bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus"
>
<NavBar subtitle="Réglages du diaporama" subtitleType="export" handleLanguage={() => {}} locale={$referentielLocale} />
<div class="flex flex-row w-full justify-center items-start mx-20 mt-10">
  <!-- Multivue + Liens -->
  <div class="flex flex-col w-1/5 justify-start">
    <DisplaySettings />
    <NbOfViewsSettings nbOfViews={settings.nbOfVues} {updateNbOfViews} />
    <TransitionSettings {transitionSounds} transitionsBetweenQuestions={settings.transitionsBetweenQuestions} {updateTransition} />
    <OrderSettings isQuestionsShuffled={$questionsOrder.isQuestionsShuffled} {updateQuestionsOrder} />
    <SelectedExercisesSettings {exercises} selectedExercises={$selectedExercises} {updateSelectedExercises} />
    <LinksSettings QRCodeWidth={settings.QRCodeWidth} formatQRCodeIndex={settings.formatQRCodeIndex} />
  </div>
  <!-- Tableau réglages -->
  <div class="flex flex-col w-4/6 justify-start">
    <div
      class="flex flex-col lg:flex-row px-4 pb-4 w-full justify-start lg:justify-between lg:items-center"
    >
      <div
        class="flex text-lg font-bold text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        Durées et nombres de questions
      </div>
      <div class="flex items-center">
        <input
          id="diaporama-defilement-manuel-checkbox"
          aria-describedby="diaporama-defilement-manuel-checkbox"
          type="checkbox"
          checked={settings.isManualModeActive}
          class="bg-coopmaths-canvas border-coopmaths-action text-coopmaths-action dark:bg-coopmathsdark-canvas dark:border-coopmathsdark-action dark:text-coopmathsdark-action focus:ring-3 focus:ring-coopmaths-action h-4 w-4 rounded"
          on:change={handleCheckManualMode}
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
          {exercises.length === 1 || settings.isManualModeActive
            ? 'border-opacity-30 dark:border-opacity-30'
            : 'border-opacity-100 dark:border-opacity-100'} focus:ring-3 focus:ring-coopmaths-action h-4 w-4 rounded"
          bind:checked={isSameDurationForAll}
          on:change={updateDurations}
          disabled={exercises.length === 1 || settings.isManualModeActive}
        />
        <label
          for="diaporama-meme-duree-checkbox"
          class="ml-3 font-medium text-coopmaths-corpus dark:text-coopmathsdark-corpus
          {exercises.length === 1 || settings.isManualModeActive
            ? 'text-opacity-30 dark:text-opacity-30'
            : 'text-opacity-100 dark:text-opacity-100'} "
        >
          Même durée pour toutes les questions
          <input
            type="number"
            id="diaporama-meme-duree-input"
            min="1"
            on:change={() => handleChangeDurationGlobal(durationGlobal)}
            bind:value={durationGlobal}
            class="ml-3 w-20 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border {isSameDurationForAll
              ? ''
              : 'border-transparent'} border-coopmaths-action dark:border-coopmathsdark-action focus:border-1 focus:border-coopmaths-action dark:focus:border-coopmathsdark-action focus:outline-0 focus:ring-0 disabled:opacity-30"
            disabled={!isSameDurationForAll || settings.isManualModeActive}
          />
        </label>
      </div>
    </div>

    <div
      class="flex flex-col min-w-full h-[100vh] px-4 align-middle"
      bind:this={divTableDurationsQuestions}
    >
      <div
        class="table-wrp block shadow ring-1 ring-coopmaths-struct dark:ring-coopmathsdark-struct ring-opacity-10 dark:ring-opacity-20 md:rounded-lg"
      >
        <table
          class="table-fixed min-w-full divide-y divide-coopmaths-struct dark:divide-coopmathsdark-struct divide-opacity-10 dark:divide-opacity-20"
        >
          <thead
            class="bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark sticky top-0"
          >
            <th
              scope="col"
              class="py-3.5 pl-4 pr-3 w-4/6 text-left text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct sm:pl"
            >
              Exercices<span
                class="pl-2 font-extralight text-opacity-60 {$selectedExercises.count
                  ? ''
                  : 'invisible'}"
                >({$selectedExercises.count} parmi {exercises.length})</span
              >
            </th>
            <th
              scope="col"
              class="py-3.5 pl-4 pr-3 w-1/6 text-center text-sm font-semibold text-coopmaths-struct dark:text-coopmathsdark-struct"
            >
              <div class={settings.isManualModeActive ? 'opacity-20' : ''}>
                Durées par question (s)
              </div>
              <div
                class=" text-coopmaths-struct-light dark:text-coopmathsdark-struct-light font-light text-xs"
              >
                {#if !settings.isManualModeActive}
                  Durée diapo :<span class="font-light ml-1"
                    >{stringDureeTotale}</span
                  >
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
              <div
                class="text-coopmaths-struct-light dark:text-coopmathsdark-struct-light font-light text-xs"
              >
                Total :<span class="font-light ml-1"
                  >{getTotalNbOfQuestions()}</span
                >
              </div>
            </th>
          </thead>
          <tbody class="overflow-y-auto" id="exercisesList">
            {#each exercises as exercice, i}
              <tr>
                <td
                  class="whitespace-normal px-3 py-4 text-sm text-coopmaths-corpus dark:text-coopmathsdark-corpus"
                >
                  <span
                    class="{$selectedExercises.count &&
                    $selectedExercises.indexes.includes(i)
                      ? ''
                      : 'invisible'} pr-2"
                    ><i
                      class="bx text-xs bxs-circle text-coopmaths-warn-lightest dark:text-coopmathsdark-warn-lightest"
                    /></span
                  >
                  {exercice.id} - {exercice.titre}
                </td>
                <td class="whitespace-normal px-3 py-4 text-sm">
                  <span class="flex justify-center">
                    <input
                      type="number"
                      id="diaporama-exo-duration-{i}"
                      min="1"
                      on:change={updateDurations}
                      bind:value={exercice.duration}
                      class="ml-3 w-16 h-8 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas border-1 border-coopmaths-action dark:border-coopmathsdark-action focus:border-1 focus:border-coopmaths-action-lightest dark:focus:border-coopmathsdark-action-lightest focus:outline-0 focus:ring-0 disabled:opacity-30"
                      disabled={isSameDurationForAll || settings.isManualModeActive}
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

      <div class="flex flex-row items-center justify-end w-full my-4">
        <button
          type="button"
          id="diaporama-play-button"
          class="animate-pulse inline-flex items-center justify-center shadow-2xl w-2/12 bg-coopmaths-action hover:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest font-extrabold text-coopmaths-canvas dark:text-coopmathsdark-canvas text-3xl py-4 rounded-lg"
          on:click={start}
          on:keydown={start}
        >
          Play<i class="bx bx-play" />
        </button>
      </div>
    </div>
  </div>
</div>
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
