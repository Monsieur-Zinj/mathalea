<script lang="ts">
  import type Exercice from '../../../../exercices/Exercice'
  import { type NumberRange } from '../../../../lib/types'
  import DisplaySettings from './presentationalComponents/DisplaySettings.svelte'
  import ExercisesSettings from './presentationalComponents/ExercisesSettings.svelte'
  import GlobalDurationSettings from './presentationalComponents/GlobalDurationSettings.svelte'
  import LinksSettings from './presentationalComponents/LinksSettings.svelte'
  import ViewSettings from './presentationalComponents/ViewSettings.svelte'
  import OrderSettings from './presentationalComponents/OrderSettings.svelte'
  import SelectedExercisesSettings from './presentationalComponents/SelectedExercisesSettings.svelte'
  import TransitionSettings from './presentationalComponents/TransitionSettings.svelte'
  import NavBar from '../../../shared/header/NavBar.svelte'
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import { globalOptions } from '../../../../lib/stores/generalStore'
  import { referentielLocale } from '../../../../lib/stores/languagesStore'
  import { isIntegerInRange0to4 } from '../../../../lib/types/integerInRange'
  import { listOfRandomIndexes } from '../../../../lib/components/shuffle'

  export let exercises: Exercice[]
  export let updateExercises: (updatedExercises: Exercice[]) => void
  export let transitionSounds: { 0: HTMLAudioElement; 1: HTMLAudioElement; 2: HTMLAudioElement; 3: HTMLAudioElement; }
  export let startSlideshow: () => void
  export let goToOverview: () => void
  export let goToHome: () => void
  export let link: string

  let divTableDurationsQuestions: HTMLDivElement
  let previousNumberOfSelectedExercises: number

  $: if (divTableDurationsQuestions) {
    mathaleaRenderDiv(divTableDurationsQuestions)
  }

  function applyRandomSelectionOfExercises (numberOfSelectedExercises: number) {
    let selection: number[] | undefined
    if (numberOfSelectedExercises > 0 && numberOfSelectedExercises < exercises.length) {
      selection = [...listOfRandomIndexes(exercises.length, numberOfSelectedExercises)].sort((a, b) => a - b)
    }
    previousNumberOfSelectedExercises = numberOfSelectedExercises
    updateSelect(selection)
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

  function updatePauseAfterEachQuestion (pauseAfterEachQuestion: boolean) {
    $globalOptions.pauseAfterEachQuestion = pauseAfterEachQuestion
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

  function updateIsImagesOnSides (isImagesOnSides: boolean) {
    $globalOptions.isImagesOnSides = isImagesOnSides
  }

  function remove (exerciseIndex: number) {
    exercises.splice(exerciseIndex, 1)
    if (exercises.length === 0) {
      goToHome()
    }
    applyRandomSelectionOfExercises(previousNumberOfSelectedExercises)
    updateExercises(exercises)
    exercises = exercises // to refresh ExercisesSettings component
  }

</script>

<div
  id="start"
  class="flex flex-col h-screen scrollbar-hide
    bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
    text-coopmaths-corpus dark:text-coopmathsdark-corpus"
>
  <NavBar
    subtitle="Réglages du diaporama"
    subtitleType="export"
    handleLanguage={() => {}}
    locale={$referentielLocale}
  />
  <div class="flex justify-end items-start mt-10
    flex-col md:flex-row"
  >
    <!-- Left Side -->
    <div class="flex flex-col justify-start ml-4">
      <DisplaySettings
        {goToOverview}
      />
      <ViewSettings
        nbOfViews={$globalOptions.nbVues ?? 1}
        {updateNbOfViews}
        isImagesOnSides={!!$globalOptions.isImagesOnSides}
        {updateIsImagesOnSides}
      />
      <TransitionSettings
        {transitionSounds}
        screenBetweenSlides={!!$globalOptions.screenBetweenSlides}
        sound={$globalOptions.sound ?? 0}
        {updateFlow}
        {updateScreenBetweenSlides}
        {updateTune}
        {updatePauseAfterEachQuestion}
        questionThenCorrectionToggle={$globalOptions.flow === 1 || $globalOptions.flow === 2}
        questionWithCorrectionToggle={$globalOptions.flow === 2}
        pauseAfterEachQuestion={!!$globalOptions.pauseAfterEachQuestion}
      />
      <OrderSettings
        isQuestionsOrdered={!$globalOptions.shuffle}
        {updateQuestionsOrder}
      />
      <SelectedExercisesSettings
        {exercises}
        selectedExercisesIndexes={$globalOptions.select ?? []}
        {applyRandomSelectionOfExercises}
      />
      <LinksSettings
        {link}
      />
    </div>
    <!-- Right Side -->
    <div class="flex flex-col justify-start
      md:w-4/6
      mr-0 md:mr-4"
    >
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
          {remove}
        />
        <div class="flex flex-row items-center justify-end w-full my-4">
          <button
            type="button"
            id="diaporama-play-button"
            class="animate-pulse inline-flex items-center justify-center shadow-2xl rounded-lg p-4 pr-2
              font-extrabold text-3xl
              bg-coopmaths-action dark:bg-coopmathsdark-action
              hover:bg-coopmaths-action-lightest dark:hover:bg-coopmathsdark-action-lightest
              text-coopmaths-canvas dark:text-coopmathsdark-canvas"
            on:click={startSlideshow}
            on:keydown={startSlideshow}
          >
            Play<i class="bx bx-play" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
