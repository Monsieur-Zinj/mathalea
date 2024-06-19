<script lang="ts">
  import type Exercice from '../../../exercices/Exercice'
  import type { InterfaceParams } from '../../../lib/types'
  import type { DataFromSettings } from './types'
  import seedrandom from 'seedrandom'
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

  const transitionSounds = {
    0: new Audio('assets/sounds/transition_sound_01.mp3'),
    1: new Audio('assets/sounds/transition_sound_02.mp3'),
    2: new Audio('assets/sounds/transition_sound_03.mp3'),
    3: new Audio('assets/sounds/transition_sound_04.mp3')
  }

  let consignes: [string[], string[], string[], string[]] = [[], [], [], []]
  let corrections: [string[], string[], string[], string[]] = [[], [], [], []]
  let currentDuration: number
  let currentQuestion = -1 // -1 pour l'intro et questions[0].length pour l'outro
  let dataFromSettings: DataFromSettings
  let durations: number[] = []
  let exercises: Exercice[] = []
  let questions: [string[], string[], string[], string[]] = [[], [], [], []] // Concaténation de toutes les questions des exercices de exercicesParams, vue par vue
  let sizes: number[] = []

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
      currentQuestion = dataFromSettings.currentQuestion
    }
    updateExercises()
  }

  async function updateExercises () {
    setSlidesContent()
    adjustQuestionsOrder()
    updateSizesAndDurations()
    updateExerciseParams()
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    exercises = exercises // Pour forcer la mise à jour des $: if (exercises) { ... }
  }

  function setSlidesContent () {
    const nbOfVues = $globalOptions.nbVues ?? 1
    consignes = [[], [], [], []]
    questions = [[], [], [], []]
    corrections = [[], [], [], []]
    sizes = []
    durations = []
    for (let idVue = 0; idVue < nbOfVues; idVue++) {
      consignes[idVue] = []
      questions[idVue] = []
      corrections[idVue] = []
      for (const [k, exercise] of exercises.entries()) {
        if (exercise.seed === undefined) exercise.seed = mathaleaGenerateSeed()
        exercise.seed = exercise.seed.substring(0, 4) + (idVue > 0 ? idVue : '')
        if (exercise.typeExercice === 'simple') {
          mathaleaHandleExerciceSimple(exercise, false)
        } else {
          seedrandom(exercise.seed, { global: true })
          exercise.nouvelleVersionWrapper?.()
        }
        let consigne: string = ''
        if ($globalOptions.select === undefined || $globalOptions.select.length === 0 || $globalOptions.select.includes(k)) {
          if (exercise.introduction) {
            consigne = exercise.consigne + '\n' + exercise.introduction
          } else {
            consigne = exercise.consigne
          }
          for (let j = 0; j < exercise.listeQuestions.length; j++) {
            consignes[idVue].push(consigne) // même consigne pour toutes les questions
          }
          questions[idVue] = [...questions[idVue], ...exercise.listeQuestions]
          corrections[idVue] = [
            ...corrections[idVue],
            ...exercise.listeCorrections
          ]
          consignes[idVue] = consignes[idVue].map(mathaleaFormatExercice)
          questions[idVue] = questions[idVue].map(mathaleaFormatExercice)
          corrections[idVue] = corrections[idVue].map(mathaleaFormatExercice)
        }
      }
    }
  }

  /**
   * Préparation des indexes si l'ordre aléatoire est demandé
   */
  function adjustQuestionsOrder () {
    if ($globalOptions.shuffle && !$globalOptions.order) {
      $globalOptions.order = shuffle([...Array(questions[0].length).keys()])
    }
  }

  function updateSizesAndDurations () {
    for (const exercise of exercises) {
      for (let i = 0; i < exercise.listeQuestions.length; i++) {
        sizes.push(exercise.tailleDiaporama)
        durations.push(exercise.duration || 10)
      }
    }
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
  {#if currentQuestion === -1}
    <SlideshowSettings on:updateSettings="{updateSettings}"
      bind:exercises={exercises}
      {updateExercises}
      {transitionSounds}
    />
  {/if}
  {#if currentQuestion > -1}
    <SlideshowPlay
      {dataFromSettings}
      {consignes}
      {corrections}
      {currentDuration}
      {durations}
      bind:currentQuestion={currentQuestion}
      {handleChangeDurationGlobal}
      {questions}
      {updateExercises}
      {transitionSounds}
    />
  {/if}
</div>
