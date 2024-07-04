<script lang="ts">
  import type Exercice from '../../../../exercices/Exercice'
  import { type DataFromSettings } from '../types'
  import { type NumberRange } from '../../../../lib/types'
  import DisplaySettings from './presentationalComponents/DisplaySettings.svelte'
  import ExercisesSettings from './presentationalComponents/ExercisesSettings.svelte'
  import GlobalDurationSettings from './presentationalComponents/GlobalDurationSettings.svelte'
  import LinksSettings from './presentationalComponents/LinksSettings.svelte'
  import NbOfViewsSettings from './presentationalComponents/NbOfViewsSettings.svelte'
  import OrderSettings from './presentationalComponents/OrderSettings.svelte'
  import SelectedExercisesSettings from './presentationalComponents/SelectedExercisesSettings.svelte'
  import TransitionSettings from './presentationalComponents/TransitionSettings.svelte'
  import NavBar from '../../../shared/header/NavBar.svelte'
  import { createEventDispatcher } from 'svelte'
  import { mathaleaHandleComponentChange, mathaleaRenderDiv } from '../../../../lib/mathalea'
  import { globalOptions } from '../../../../lib/stores/generalStore'
  import { referentielLocale } from '../../../../lib/stores/languagesStore'
  import { isIntegerInRange0to4 } from '../../../../lib/types/integerInRange'

  export let exercises: Exercice[]
  export let updateExercises: (updatedExercises: Exercice[]) => void
  export let transitionSounds: { 0: HTMLAudioElement; 1: HTMLAudioElement; 2: HTMLAudioElement; 3: HTMLAudioElement; }

  const dispatch: (type: string, detail?: DataFromSettings) => void = createEventDispatcher()
  const settings: DataFromSettings = {
    currentQuestion: -1,
    formatQRCodeIndex: 0,
    QRCodeWidth: 100
  }

  let divTableDurationsQuestions: HTMLDivElement

  $: if (divTableDurationsQuestions) {
    mathaleaRenderDiv(divTableDurationsQuestions)
  }

  function goToOverview () {
    dispatch('updateSettings', settings)
    mathaleaHandleComponentChange('diaporama', 'overview')
  }

  function updateNbOfViews (nbVues: NumberRange<1, 4>) {
    $globalOptions.nbVues = nbVues
  }

  function updateFlow (flow: 0 | 1 | 2) {
    $globalOptions.flow = flow
  }

  function updateScreenBetweenSlides (screenBetweenSlides: boolean) {
    $globalOptions.screenBetweenSlides = screenBetweenSlides
  }

  function updateTune (tune: -1 | 0 | 1 | 2 | 3) {
    const soundCandidate = tune + 1
    if (isIntegerInRange0to4(soundCandidate)) {
      $globalOptions.sound = soundCandidate
    }
  }

  function updateQuestionsOrder (isQuestionsOrdered: boolean) {
    $globalOptions.shuffle = !isQuestionsOrdered
  }

  function updateSelect (selectedExercisesIndexes: number[] | undefined) {
    $globalOptions.select = selectedExercisesIndexes
  }

  function updateManualMode (isManualModeActive: boolean) {
    $globalOptions.manualMode = isManualModeActive
  }

  function updateDurationGlobal (durationGlobal: number | undefined) {
    $globalOptions.durationGlobal = durationGlobal
  }

  function start () {
    settings.currentQuestion = 0
    dispatch('updateSettings', settings)
  }

</script>

<div
  id="start"
  class="flex flex-col h-screen scrollbar-hide
    bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
    text-coopmaths-corpus dark:text-coopmathsdark-corpus"
>
  <NavBar subtitle="Réglages du diaporama" subtitleType="export" handleLanguage={() => {}} locale={$referentielLocale} />
  <div class="flex flex-row justify-center items-start w-full mx-20 mt-10">
    <!-- Left Side -->
    <div class="flex flex-col justify-start w-1/5">
      <DisplaySettings {goToOverview} />
      <NbOfViewsSettings nbOfViews={$globalOptions.nbVues ?? 1} {updateNbOfViews} />
      <TransitionSettings
        {transitionSounds}
        screenBetweenSlides={!!$globalOptions.screenBetweenSlides}
        sound={$globalOptions.sound ?? 0}
        {updateFlow}
        {updateScreenBetweenSlides}
        {updateTune}
        questionThenCorrectionToggle={$globalOptions.flow === 1 || $globalOptions.flow === 2}
        questionWithCorrectionToggle={$globalOptions.flow === 2}
      />
      <OrderSettings isQuestionsOrdered={!$globalOptions.shuffle} {updateQuestionsOrder} />
      <SelectedExercisesSettings
        {exercises}
        selectedExercisesIndexes={$globalOptions.select ?? []}
        {updateSelect}
      />
      <LinksSettings QRCodeWidth={settings.QRCodeWidth} formatQRCodeIndex={settings.formatQRCodeIndex} />
    </div>
    <!-- Right Side -->
    <div class="flex flex-col justify-start w-4/6">
      <GlobalDurationSettings
        {exercises}
        isManualModeActive={!!$globalOptions.manualMode}
        {updateManualMode}
        durationGlobal={$globalOptions.durationGlobal}
        {updateDurationGlobal}
      />
      <div
        class="flex flex-col align-middle min-w-full h-[100vh] px-4"
        bind:this={divTableDurationsQuestions}
      >
        <ExercisesSettings
          {exercises}
          isManualModeActive={!!$globalOptions.manualMode}
          {updateExercises}
          durationGlobal={$globalOptions.durationGlobal}
          selectedExercisesIndexes={$globalOptions.select ?? []}
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
