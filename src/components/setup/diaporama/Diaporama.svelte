<script lang="ts">
  import { onMount, tick, onDestroy, afterUpdate } from 'svelte'
  import {
    mathaleaFormatExercice,
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
  import type Exercice from '../../../exercices/Exercice'
  import seedrandom from 'seedrandom'
  import { context } from '../../../modules/context.js'
  import {
    formattedTimeStamp
  } from '../../../lib/components/time'
  import type { InterfaceParams, NumberRange } from '../../../lib/types'
  import { shuffle, listOfRandomIndexes } from '../../../lib/components/shuffle'
  import SlideshowPlay from './slideshowPlay/SlideshowPlay.svelte'
  import SlideshowSettings from './slideshowSettings/SlideshowSettings.svelte'
    import type { DataFromSettings } from '../../../lib/types/slideshow'

  const divQuestion: HTMLDivElement[] = []
  let divTableDurationsQuestions: HTMLDivElement
  let isSameDurationForAll = false
  const userZoom = 1
  let exercices: Exercice[] = []
  let questions: [string[], string[], string[], string[]] = [[], [], [], []] // Concaténation de toutes les questions des exercices de exercicesParams, vue par vue
  let corrections: [string[], string[], string[], string[]] = [[], [], [], []]
  let sizes: number[] = []
  let consignes: [string[], string[], string[], string[]] = [[], [], [], []]
  let durations: number[] = []
  let durationGlobal: number | undefined = $globalOptions.durationGlobal
  let previousDurationGlobal = 10 // Utile si on décoche puis recoche "Même durée pour toutes les questions"
  $: isManualModeActive = false
  let currentDuration: number
  let nbOfVues = $globalOptions.nbVues || 1
  const stringNbOfVues = nbOfVues.toString()
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
  let currentQuestion = -1 // -1 pour l'intro et questions[0].length pour l'outro
  const formatQRCodeIndex: NumberRange<0, 2> = 0
  const QRCodeWidth = 100
  let stringDureeTotale = '0'
  // variables pour les transitions entre questions
  const transitionSounds = {
    0: new Audio('assets/sounds/transition_sound_01.mp3'),
    1: new Audio('assets/sounds/transition_sound_02.mp3'),
    2: new Audio('assets/sounds/transition_sound_03.mp3'),
    3: new Audio('assets/sounds/transition_sound_04.mp3')
  }
  let dataFromSettings: DataFromSettings

  function updateDataFromSettings (event: {detail: DataFromSettings}) {
    dataFromSettings = event.detail
    if (dataFromSettings !== undefined && dataFromSettings.questionNumber !== undefined) {
      currentQuestion = dataFromSettings.questionNumber
    }
  }

  if ($globalOptions && $globalOptions.durationGlobal) {
    isSameDurationForAll = true
  }

  onDestroy(() => {
    document.removeEventListener('updateAsyncEx', forceUpdate)
  })

  async function forceUpdate () {
    updateExercices()
  }

  afterUpdate(() => {
  })

  onMount(async () => {
    context.vue = 'diap'
    document.addEventListener('updateAsyncEx', forceUpdate)
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    for (const paramsExercice of $exercicesParams) {
      const exercice: Exercice = await mathaleaLoadExerciceFromUuid(
        paramsExercice.uuid
      )
      if (exercice === undefined) return
      mathaleaHandleParamOfOneExercice(exercice, paramsExercice)
      exercice.duration = paramsExercice.duration ?? 10
      exercices.push(exercice)
    }
    exercices = exercices
    if (!$selectedExercises.isActive) {
      $selectedExercises.indexes = [...Array(exercices.length).keys()]
    } else {
      $selectedExercises.indexes = [
        ...listOfRandomIndexes(exercices.length, $selectedExercises.count!)
      ]
    }
    updateExercices()
    await tick()
    if (divTableDurationsQuestions) {
      mathaleaRenderDiv(divTableDurationsQuestions)
    }
  })

  async function updateExercices () {
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
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
        if (idVue > 0) {
          if (exercice.seed != null) {
            exercice.seed = exercice.seed.substring(0, 4) + idVue
          }
        } else {
          if (exercice.seed != null) {
            exercice.seed = exercice.seed.substring(0, 4)
          }
        }
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
    for (const exercice of exercices.values()) {
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
    globalOptions.update((l) => {
      l.nbVues = nbOfVues
      return l
    })
    // préparation des indexes si l'ordre aléatoire est demandé
    if ($questionsOrder.isQuestionsShuffled) {
      $questionsOrder.indexes = shuffle([...Array(questions[0].length).keys()])
    } else {
      $questionsOrder.indexes = [...Array(questions[0].length).keys()]
    }
    exercicesParams.update(() => newParams)
    mathaleaUpdateUrlFromExercicesParams(newParams)
    stringDureeTotale = formattedTimeStamp(getTotalDuration())
    if (divTableDurationsQuestions) {
      mathaleaRenderDiv(divTableDurationsQuestions)
    }
  }

  function handleChangeDurationGlobal () {
    globalOptions.update((l) => {
      l.durationGlobal = durationGlobal
      return l
    })
    updateExercices()
  }

  /**
   * Calcule la durée totale du diaporama
   * (durée par question x nombre de questions)
   */
  function getTotalDuration () {
    let sum = 0
    for (const [i, exercice] of exercices.entries()) {
      if ($selectedExercises.isActive) {
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

  $: {
    nbOfVues = parseInt(stringNbOfVues) as 1 | 2 | 3 | 4
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
    bind:currentQuestion={currentQuestion}
      {divTableDurationsQuestions}
      {durations}
      {durationGlobal}
      {exercices}
      {formatQRCodeIndex}
      {handleChangeDurationGlobal}
      {isManualModeActive}
      {isSameDurationForAll}
      {QRCodeWidth}
      {stringDureeTotale}
      {stringNbOfVues}
      {transitionSounds}
      {updateExercices}
    />
  {/if}
  {#if currentQuestion > -1}
    <SlideshowPlay
      {dataFromSettings}
      {durations}
      {consignes}
      {corrections}
      {currentDuration}
      bind:currentQuestion={currentQuestion}
      {divQuestion}
      {durationGlobal}
      {formatQRCodeIndex}
      {handleChangeDurationGlobal}
      {isManualModeActive}
      {isSameDurationForAll}
      {nbOfVues}
      {QRCodeWidth}
      {questions}
      {updateExercices}
      {userZoom}
      {transitionSounds}
    />
  {/if}
</div>
