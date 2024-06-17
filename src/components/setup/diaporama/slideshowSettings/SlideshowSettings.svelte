<script lang="ts">
  import type Exercice from '../../../../exercices/Exercice'
  import type { DataFromSettings, TransitionsBetweenQuestions } from '../types'
  import type { NumberRange } from '../../../../lib/types'
  import DisplaySettings from './presentationalComponents/DisplaySettings.svelte'
  import ExercisesSettings from './presentationalComponents/ExercisesSettings.svelte'
  import GlobalDurationSettings from './presentationalComponents/GlobalDurationSettings.svelte'
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
  export let transitionSounds: { 0: HTMLAudioElement; 1: HTMLAudioElement; 2: HTMLAudioElement; 3: HTMLAudioElement; }

  const dispatch: (type: string, detail?: DataFromSettings) => void = createEventDispatcher()
  const settings: DataFromSettings = {
    currentQuestion: -1,
    durationGlobal: undefined,
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

  let divTableDurationsQuestions: HTMLDivElement
  let durationGlobal = $globalOptions.durationGlobal
  let isSameDurationForAll = !!$globalOptions.durationGlobal
  let previousDurationGlobal = 10 // Utile si on décoche puis recoche "Même durée pour toutes les questions"
  let stringDureeTotale = '0'

  let firstExercisesUpdate = true
  settings.durationGlobal = isSameDurationForAll ? durationGlobal : undefined

  $: if (exercises && exercises.length > 0) {
    updateDisplayedTotalDuration()
    if (firstExercisesUpdate) {
      applyRandomSelectionOfExercises()
      firstExercisesUpdate = false
    }
  }

  $: if (divTableDurationsQuestions) {
    mathaleaRenderDiv(divTableDurationsQuestions)
  }

  $: {
    if (durationGlobal) previousDurationGlobal = durationGlobal
    if (isSameDurationForAll) {
      if (previousDurationGlobal) {
        durationGlobal = previousDurationGlobal
      } else if (durationGlobal === undefined) {
        durationGlobal = 10
      }
    } else {
      durationGlobal = undefined
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
    dispatchUpdateSettings()
  }

  function updateQuestionsOrder (isQuestionsShuffled: boolean) {
    $questionsOrder.isQuestionsShuffled = isQuestionsShuffled
    dispatchUpdateSettings()
  }

  function updateSelectedExercises (newSelectedExercises: InterfaceSelectedExercises) {
    selectedExercises.set(newSelectedExercises)
    applyRandomSelectionOfExercises()
    globalOptions.update((l) => {
      l.choice = $selectedExercises.count
      return l
    })
    dispatchUpdateSettings()
  }

  function updateManualMode (isManualModeActive: boolean) {
    settings.isManualModeActive = isManualModeActive
    dispatchUpdateSettings()
  }

  function updateIsSameDurationForAll (newIsSameDurationForAll: boolean) {
    isSameDurationForAll = newIsSameDurationForAll
    dispatchUpdateSettings()
  }

  function updateDurationGlobal (newDurationGlobal: number | undefined) {
    durationGlobal = newDurationGlobal
    dispatchUpdateSettings()
  }

  function start () {
    settings.currentQuestion = 0
    dispatchUpdateSettings()
  }

  function dispatchUpdateSettings () {
    globalOptions.update((l) => {
      l.durationGlobal = durationGlobal
      return l
    })
    dispatch('updateSettings', settings)
  }

  async function updateDisplayedTotalDuration () {
    stringDureeTotale = formattedTimeStamp(getTotalDuration())
    await tick()
    if (divTableDurationsQuestions) {
      mathaleaRenderDiv(divTableDurationsQuestions)
    }
  }

  function applyRandomSelectionOfExercises () {
    if ($selectedExercises.count) {
      $selectedExercises.indexes = [...listOfRandomIndexes(exercises.length, $selectedExercises.count!)]
    } else {
      $selectedExercises.indexes = [...Array(exercises.length).keys()]
    }
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

</script>

<div
  id="start"
  class="flex flex-col h-screen scrollbar-hide bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus"
>
  <NavBar subtitle="Réglages du diaporama" subtitleType="export" handleLanguage={() => {}} locale={$referentielLocale} />
  <div class="flex flex-row w-full justify-center items-start mx-20 mt-10">
    <!-- Left Side -->
    <div class="flex flex-col w-1/5 justify-start">
      <DisplaySettings />
      <NbOfViewsSettings nbOfViews={settings.nbOfVues} {updateNbOfViews} />
      <TransitionSettings {transitionSounds} transitionsBetweenQuestions={settings.transitionsBetweenQuestions} {updateTransition} />
      <OrderSettings isQuestionsShuffled={$questionsOrder.isQuestionsShuffled} {updateQuestionsOrder} />
      <SelectedExercisesSettings {exercises} selectedExercises={$selectedExercises} {updateSelectedExercises} />
      <LinksSettings QRCodeWidth={settings.QRCodeWidth} formatQRCodeIndex={settings.formatQRCodeIndex} />
    </div>
    <!-- Right Side -->
    <div class="flex flex-col w-4/6 justify-start">
      <GlobalDurationSettings
        {exercises}
        isManualModeActive={settings.isManualModeActive}
        {updateManualMode}
        {isSameDurationForAll}
        {updateIsSameDurationForAll}
        {durationGlobal}
        {updateDurationGlobal}
      />
      <div
        class="flex flex-col min-w-full h-[100vh] px-4 align-middle"
        bind:this={divTableDurationsQuestions}
      >
        <ExercisesSettings
          {exercises}
          selectedExercises={$selectedExercises}
          isManualModeActive={settings.isManualModeActive}
          {stringDureeTotale}
          {updateExercises}
          {isSameDurationForAll}
        />
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
