<script lang="ts">
  import type Exercice from '../../../exercices/Exercice'
  import type { InterfaceParams } from '../../../lib/types'
  import type { DataFromSettings, Slide, Slideshow } from './types'
  import seedrandom from 'seedrandom'
  import SlideshowOverview from './slideshowOverview/SlideshowOverview.svelte'
  import SlideshowPlay from './slideshowPlay/SlideshowPlay.svelte'
  import SlideshowSettings from './slideshowSettings/SlideshowSettings.svelte'
  import { onMount, onDestroy } from 'svelte'
  import { shuffle } from '../../../lib/components/shuffle'
  import {
    mathaleaFormatExercice,
    mathaleaGenerateSeed,
    mathaleaHandleExerciceSimple,
    mathaleaHandleParamOfOneExercice,
    mathaleaHandleSup,
    mathaleaLoadExerciceFromUuid,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../lib/mathalea'
  import {
    exercicesParams,
    globalOptions,
    darkMode
  } from '../../../lib/stores/generalStore'
  import { context } from '../../../modules/context.js'
  import { isIntegerInRange0to3 } from '../../../lib/types/integerInRange'

  const transitionSounds = {
    0: new Audio('assets/sounds/transition_sound_01.mp3'),
    1: new Audio('assets/sounds/transition_sound_02.mp3'),
    2: new Audio('assets/sounds/transition_sound_03.mp3'),
    3: new Audio('assets/sounds/transition_sound_04.mp3')
  }

  let dataFromSettings: DataFromSettings
  let exercises: Exercice[] = []
  let slideshow: Slideshow = {
    slides: [],
    currentQuestion: -1,
    selectedQuestionsNumber: 0
  }

  onMount(async () => {
    context.vue = 'diap'
    document.addEventListener('updateAsyncEx', forceUpdate)
    exercises = await getExercisesFromExercicesParams()
    updateExercises()
  })

  onDestroy(() => {
    document.removeEventListener('updateAsyncEx', forceUpdate)
  })

  async function forceUpdate () {
    updateExercises()
  }

  async function getExercisesFromExercicesParams () {
    const exercises = []
    for (const paramsExercice of $exercicesParams) {
      const exercise: Exercice = await mathaleaLoadExerciceFromUuid(paramsExercice.uuid)
      mathaleaHandleParamOfOneExercice(exercise, paramsExercice)
      exercise.duration = paramsExercice.duration ?? 10
      exercises.push(exercise)
    }
    return exercises
  }

  function updateSettings (event: {detail: DataFromSettings}) {
    dataFromSettings = event.detail
    if (dataFromSettings !== undefined) {
      slideshow.currentQuestion = dataFromSettings.currentQuestion
    }
    updateExercises()
  }

  async function updateExercises () {
    setSlidesContent()
    adjustQuestionsOrder()
    updateExerciseParams()
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    exercises = exercises // Pour forcer la mise à jour des $: if (exercises) { ... }
  }

  function setSlidesContent () {
    const slides = []
    const nbOfVues = $globalOptions.nbVues || 1
    let selectedQuestionsNumber = 0
    for (const [k, exercise] of [...exercises].entries()) {
      reroll(exercise)
      const isSelected = $globalOptions.select?.includes(k) ?? true
      if (isSelected) selectedQuestionsNumber += exercise.listeQuestions.length
      for (let i = 0; i < exercise.listeQuestions.length; i++) {
        const slide: Slide = {
          exercise,
          isSelected,
          vues: []
        }
        for (let idVue = 0; idVue < nbOfVues; idVue++) {
          if (idVue > 0 && isIntegerInRange0to3(idVue)) reroll(exercise, idVue)
          slide.vues.push({
            consigne: mathaleaFormatExercice(exercise.consigne + exercise.introduction ? ('\n' + exercise.introduction) : ''),
            question: mathaleaFormatExercice(exercise.listeQuestions[i]),
            correction: mathaleaFormatExercice(exercise.listeCorrections[i])
          })
        }
        slides.push(slide)
      }
    }
    slideshow = {
      slides,
      currentQuestion: dataFromSettings?.currentQuestion ?? -1,
      selectedQuestionsNumber: selectedQuestionsNumber || slides.length
    }
  }

  function reroll (exercise: Exercice, idVue?: 0 | 1 | 2 | 3) {
    if (exercise.seed === undefined) exercise.seed = mathaleaGenerateSeed()
    const oldSeed = exercise.seed
    if (idVue !== undefined && idVue > 0) exercise.seed = mathaleaGenerateSeed()
    if (exercise.typeExercice === 'simple') {
      mathaleaHandleExerciceSimple(exercise, false)
    } else {
      seedrandom(exercise.seed, { global: true })
      exercise.nouvelleVersionWrapper?.()
    }
    exercise.seed = oldSeed
  }

  function adjustQuestionsOrder () {
    const areSomeExercisesSelected = $globalOptions.select && $globalOptions.select.length > 0
    const selectedIndexes = areSomeExercisesSelected ? getSelectedQuestionsIndexes() : [...Array(slideshow.slides.length).keys()]
    if ($globalOptions.shuffle) {
      $globalOptions.order = shuffle(selectedIndexes)
    } else {
      $globalOptions.order = $globalOptions.select ? selectedIndexes : undefined
    }
  }

  function getSelectedQuestionsIndexes () {
    const indexes = []
    for (const [i, slide] of [...slideshow.slides].entries()) {
      if (slide.isSelected) {
        indexes.push(i)
      }
    }
    return indexes
  }

  function updateExerciseParams () {
    const newParams: InterfaceParams[] = []
    for (const exercice of exercises) {
      newParams.push({
        uuid: exercice.uuid,
        id: exercice.id,
        alea: exercice.seed?.substring(0, 4),
        nbQuestions: exercice.nbQuestions,
        duration: exercice.duration,
        sup: mathaleaHandleSup(exercice.sup),
        sup2: mathaleaHandleSup(exercice.sup2),
        sup3: mathaleaHandleSup(exercice.sup3),
        sup4: mathaleaHandleSup(exercice.sup4)
      })
    }
    exercicesParams.set(newParams)
  }

  /**
   * @fixme Cette fonction fait trop de choses :
   * elle met à jour un paramètre global,
   * elle met à jour les exercices,
   * et après avoir mis à jour les exercices, la durée du diaporama est recalculée
   * @param durationGlobal
   */
  function handleChangeDurationGlobal (durationGlobal: number | undefined) {
    globalOptions.update((l) => {
      l.durationGlobal = durationGlobal
      return l
    })
    updateExercises()
  }
</script>

<svelte:head>
  <style>
    svg.mathalea2d {
      display: inline-flex;
    }
  </style>
</svelte:head>

<div id="diaporama" class={$darkMode.isActive ? 'dark' : ''}>
  {#if $globalOptions.v === 'overview' && slideshow.slides.length > 0}
    <SlideshowOverview
      {exercises}
      {slideshow}
      {updateExercises}
    />
  {:else}
    {#if slideshow.currentQuestion === -1}
      <SlideshowSettings on:updateSettings="{updateSettings}"
        bind:exercises={exercises}
        {updateExercises}
        {transitionSounds}
      />
    {/if}
    {#if slideshow.currentQuestion > -1}
      <SlideshowPlay
        {dataFromSettings}
        bind:currentQuestionNumber={slideshow.currentQuestion}
        {handleChangeDurationGlobal}
        {slideshow}
        {updateExercises}
        {transitionSounds}
      />
    {/if}
  {/if}
</div>
