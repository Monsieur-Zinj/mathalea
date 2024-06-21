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
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import { globalOptions } from '../../../../lib/stores/generalStore'
  import { referentielLocale } from '../../../../lib/stores/languagesStore'
  import { isIntegerInRange0to4 } from '../../../../lib/types/integerInRange'

  export let exercises: Exercice[]
  export let updateExercises: () => void
  export let transitionSounds: { 0: HTMLAudioElement; 1: HTMLAudioElement; 2: HTMLAudioElement; 3: HTMLAudioElement; }

  const dispatch: (type: string, detail?: DataFromSettings) => void = createEventDispatcher()
  const settings: DataFromSettings = {
    currentQuestion: -1,
    formatQRCodeIndex: 0,
    isManualModeActive: false,
    QRCodeWidth: 100
  }

  let divTableDurationsQuestions: HTMLDivElement

  $: if (divTableDurationsQuestions) {
    mathaleaRenderDiv(divTableDurationsQuestions)
  }

  function updateNbOfViews (nbOfViews: NumberRange<1, 4>) {
    globalOptions.update((l) => {
      l.nbVues = nbOfViews
      return l
    })
  }

  function updateFlow (flow: 0 | 1 | 2) {
    globalOptions.update((l) => {
      l.flow = flow
      return l
    })
  }

  function updateScreenBetweenSlides (screenBetweenSlides: boolean) {
    globalOptions.update((l) => {
      l.screenBetweenSlides = screenBetweenSlides
      return l
    })
  }

  function updateTune (tune: -1 | 0 | 1 | 2 | 3) {
    const soundCandidate = tune + 1
    if (isIntegerInRange0to4(soundCandidate)) {
      globalOptions.update((l) => {
        l.sound = soundCandidate
        return l
      })
    }
  }

  function updateQuestionsOrder (isQuestionsOrdered: boolean) {
    globalOptions.update((l) => {
      l.shuffle = !isQuestionsOrdered
      return l
    })
  }

  function updateSelect (selectedExercisesIndexes: number[] | undefined) {
    globalOptions.update((l) => {
      l.select = selectedExercisesIndexes
      return l
    })
  }

  function updateManualMode (isManualModeActive: boolean) {
    settings.isManualModeActive = isManualModeActive
  }

  function updateDurationGlobal (durationGlobal: number | undefined) {
    globalOptions.update((l) => {
      l.durationGlobal = durationGlobal
      return l
    })
  }

  function start () {
    settings.currentQuestion = 0
    dispatch('updateSettings', settings)
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
    <div class="flex flex-col w-4/6 justify-start">
      <GlobalDurationSettings
        {exercises}
        isManualModeActive={settings.isManualModeActive}
        {updateManualMode}
        durationGlobal={$globalOptions.durationGlobal}
        {updateDurationGlobal}
      />
      <div
        class="flex flex-col min-w-full h-[100vh] px-4 align-middle"
        bind:this={divTableDurationsQuestions}
      >
        <ExercisesSettings
          {exercises}
          isManualModeActive={settings.isManualModeActive}
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
