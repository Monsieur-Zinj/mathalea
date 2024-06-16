<script lang="ts">
  import type Exercice from '../../../exercices/Exercice'
  import type { InterfaceParams } from '../../../lib/types'
  import type { DataFromSettings } from '../../../lib/types/slideshow'
  import seedrandom from 'seedrandom'
  import SlideshowPlay from './slideshowPlay/SlideshowPlay.svelte'
  import SlideshowSettings from './slideshowSettings/SlideshowSettings.svelte'
  import { onMount, onDestroy } from 'svelte'
  import { shuffle, listOfRandomIndexes } from '../../../lib/components/shuffle'
  import {
    mathaleaFormatExercice,
    mathaleaGenerateSeed,
    mathaleaHandleExerciceSimple,
    mathaleaHandleParamOfOneExercice,
    mathaleaHandleSup,
    mathaleaLoadExerciceFromUuid,
    mathaleaRenderDiv,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../lib/mathalea'
  import {
    exercicesParams,
    globalOptions,
    questionsOrder,
    selectedExercises,
    transitionsBetweenQuestions,
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
  let divTableDurationsQuestions: HTMLDivElement
  let durations: number[] = []
  let exercices: Exercice[] = []
  let questions: [string[], string[], string[], string[]] = [[], [], [], []] // Concaténation de toutes les questions des exercices de exercicesParams, vue par vue
  let sizes: number[] = []

  onMount(async () => {
    context.vue = 'diap'
    updateDataFromGlobalOptions()
    document.addEventListener('updateAsyncEx', forceUpdate)
    exercices = await getExercisesFromExercicesParams()
    applyRandomSelectionOfExercises()
    updateExercices()
  })

  onDestroy(() => {
    document.removeEventListener('updateAsyncEx', forceUpdate)
  })

  function updateDataFromGlobalOptions () {
    $questionsOrder.isQuestionsShuffled = $globalOptions.shuffle || false
    $selectedExercises.count = $globalOptions.choice
    if ($selectedExercises.count !== undefined) {
      $selectedExercises.isActive = true
    }
    $transitionsBetweenQuestions.isActive = $globalOptions.trans || false
    $transitionsBetweenQuestions.tune = $globalOptions.sound || '1'
    if ($transitionsBetweenQuestions.tune !== undefined) {
      $transitionsBetweenQuestions.isNoisy = true
    }
  }

async function forceUpdate () {
  updateExercices()
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

  function applyRandomSelectionOfExercises () {
    if (!$selectedExercises.isActive) {
      $selectedExercises.indexes = [...Array(exercices.length).keys()]
    } else {
      $selectedExercises.indexes = [
        ...listOfRandomIndexes(exercices.length, $selectedExercises.count!)
      ]
    }
  }

  function updateDataFromSettings (event: {detail: DataFromSettings}) {
    dataFromSettings = event.detail
    if (dataFromSettings !== undefined) {
      currentQuestion = dataFromSettings.questionNumber
    }
    updateExercices()
  }

  async function updateExercices () {
    const nbOfVues = dataFromSettings ? dataFromSettings.nbOfVues : 1
    globalOptions.update((l) => {
      l.nbVues = nbOfVues
      return l
    })
    questions = [[], [], [], []]
    corrections = [[], [], [], []]
    consignes = [[], [], [], []]
    sizes = []
    durations = []
    for (let idVue = 0; idVue < nbOfVues; idVue++) {
      consignes[idVue] = []
      questions[idVue] = []
      corrections[idVue] = []
      for (const [k, exercice] of exercices.entries()) {
        if (exercice.seed === undefined) exercice.seed = mathaleaGenerateSeed()
        exercice.seed = exercice.seed.substring(0, 4) + (idVue > 0 ? idVue : '')
        if (exercice.typeExercice === 'simple') {
          mathaleaHandleExerciceSimple(exercice, false)
        } else {
          seedrandom(exercice.seed, { global: true })
          exercice.nouvelleVersionWrapper?.()
        }
        let consigne: string = ''
        if ($selectedExercises.indexes.includes(k)) {
          if (exercice.introduction) {
            consigne = exercice.consigne + '\n' + exercice.introduction
          } else {
            consigne = exercice.consigne
          }
          for (let j = 0; j < exercice.listeQuestions.length; j++) {
            consignes[idVue].push(consigne) // même consigne pour toutes les questions
          }
          questions[idVue] = [...questions[idVue], ...exercice.listeQuestions]
          corrections[idVue] = [
            ...corrections[idVue],
            ...exercice.listeCorrections
          ]
          consignes[idVue] = consignes[idVue].map(mathaleaFormatExercice)
          questions[idVue] = questions[idVue].map(mathaleaFormatExercice)
          corrections[idVue] = corrections[idVue].map(mathaleaFormatExercice)
        }
      }
    }
    const newParams: InterfaceParams[] = []
    for (const exercice of exercices) {
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        sizes.push(exercice.tailleDiaporama)
        durations.push(exercice.duration || 10)
      }
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
    // préparation des indexes si l'ordre aléatoire est demandé
    if ($questionsOrder.isQuestionsShuffled) {
      $questionsOrder.indexes = shuffle([...Array(questions[0].length).keys()])
    } else {
      $questionsOrder.indexes = [...Array(questions[0].length).keys()]
    }
    exercicesParams.set(newParams)
    mathaleaUpdateUrlFromExercicesParams(newParams)
    if (divTableDurationsQuestions) {
      mathaleaRenderDiv(divTableDurationsQuestions)
    }
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
    updateExercices()
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
    <SlideshowSettings on:updateData="{updateDataFromSettings}"
      bind:exercices={exercices}
      {handleChangeDurationGlobal}
      {updateExercices}
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
      {updateExercices}
      {transitionSounds}
    />
  {/if}
</div>
