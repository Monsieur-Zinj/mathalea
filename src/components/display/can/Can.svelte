<script lang="ts">
  import type { CanState } from '../../../lib/types/can'
  import type TypeExercice from '../../../exercices/Exercice'
  import { canOptions } from '../../../lib/stores/canStore'
  import CountDown from './presentationalComponents/CountDown.svelte'
  import End from './presentationalComponents/End.svelte'
  import KickOff from './presentationalComponents/KickOff.svelte'
  import Race from './presentationalComponents/Race.svelte'
  import { onMount } from 'svelte'
  import {
    splitExercisesIntoQuestions,
    buildExercisesList
  } from '../../../lib/components/exercisesUtils'
  import Solutions from './presentationalComponents/Solutions.svelte'
  import { verifQuestionMathLive } from '../../../lib/interactif/mathLive'
  import { verifQuestionQcm } from '../../../lib/interactif/qcm'
  import { verifQuestionListeDeroulante } from '../../../lib/interactif/questionListeDeroulante'
  import { verifQuestionCliqueFigure } from '../../../lib/interactif/cliqueFigure'
  import {
    darkMode,
    globalOptions,
    resultsByExercice
  } from '../../../lib/stores/generalStore'
  import { answersFromCapytale, assignmentDataFromCapytale, sendToCapytaleSaveStudentAssignment } from '../../../lib/handleCapytale'
  import { millisecondToMinSec } from '../../../lib/components/time'
  import { keyboardState } from '../../keyboard/stores/keyboardStore'
  import type { InterfaceResultExercice } from '../../../lib/types'
  import { context } from '../../../modules/context'

  let state: CanState = 'start'
  let exercises: TypeExercice[] = []
  let questions: string[] = []
  let consignes: string[] = []
  let corrections: string[] = []
  let consignesCorrections: string[] = []
  let indiceExercice: number[] = []
  let indiceQuestionInExercice: number[] = []
  let resultsByQuestion: boolean[] = []
  let answers: string[] = []
  let recordedTimeFromCapytale: number
  onMount(async () => {
    context.isDiaporama = true
    // reconstitution des exercices
    exercises = await Promise.all(buildExercisesList())
    // interactivité
    if ($canOptions.isInteractive) {
      $keyboardState.isVisible = true
      for (const param of exercises) {
        param.interactif = true
      }
    }
    // découpage des exerices en questions
    const splitResults = splitExercisesIntoQuestions(exercises)
    questions = [...splitResults.questions]
    consignes = [...splitResults.consignes]
    corrections = [...splitResults.corrections]
    consignesCorrections = [...splitResults.consignesCorrections]
    indiceExercice = [...splitResults.indiceExercice]
    indiceQuestionInExercice = [...splitResults.indiceQuestionInExercice]
    for (let i = 0; i < questions.length; i++) {
      $canOptions.questionGetAnswer.push(false)
    }
  })

  function checkAnswers () {
    for (let i = 0; i < questions.length; i++) {
      const exercice = exercises[indiceExercice[i]]
      const type = exercice.autoCorrection[indiceQuestionInExercice[i]].reponse.param.formatInteractif
      if (type === 'mathlive') {
        resultsByQuestion[i] =
          verifQuestionMathLive(exercice, indiceQuestionInExercice[i])
            ?.isOk
        // Pour Capytale, on a besoin du score de l'exercice et non de la question
        // donc on sauvegarde le score dans l'exercice
        if (resultsByQuestion[i] && exercice.score !== undefined) { exercice.score++ }
        // récupération de la réponse
        answers.push(
          exercice.answers![
            `Ex${indiceExercice[i]}Q${indiceQuestionInExercice[i]}`
          ]
        )
      } else if (type === 'qcm') {
        resultsByQuestion[i] =
          verifQuestionQcm(exercice, indiceQuestionInExercice[i]) === 'OK'
        if (resultsByQuestion[i] && exercice.score !== undefined) { exercice.score++ }
        // récupération de la réponse
        // @ts-expect-error typage pour les QCM
        const propositions = exercice.autoCorrection[indiceQuestionInExercice[i]].propositions
        const qcmAnswers: string[] = []
        // @ts-expect-error typage pour les QCM
        propositions.forEach((proposition, indice: number) => {
          if (
            exercice.answers![
              `Ex${indiceExercice[i]}Q${indiceQuestionInExercice[i]}R${indice}`
            ] === '1'
          ) {
            qcmAnswers.push(proposition.texte)
          }
        })
        answers.push(qcmAnswers.join(' ; '))
      } else if (type === 'listeDeroulante') {
        resultsByQuestion[i] =
          verifQuestionListeDeroulante(
            exercice,
            indiceQuestionInExercice[i]
          ) === 'OK'
      } else if (type === 'cliqueFigure') {
        resultsByQuestion[i] =
          verifQuestionCliqueFigure(exercice, indiceQuestionInExercice[i]) ===
          'OK'
      } else if (type === 'custom') {
        // si le typ est `custom` on est sûr que `correctionInteractive` existe
        // d'où le ! après `correctionInteractive`
        resultsByQuestion[i] = exercice.correctionInteractive!(i) === 'OK'
      }
    }
  }
    // Désactiver l'interactivité avant l'affichage des solutions
    for (const param of exercises) {
      param.interactif = false
    }
    const resultsByExerciceArray : InterfaceResultExercice[] = []
    for (let i = 0, ind = 0; i < exercises.length; i++) {
      const exercise = exercises[i]
      for (let q = 0; q < exercise.nbQuestions; q++) {
        const ans : { [key: string]: string } = {}
        ans[`Ex${i}Q${q}`] = exercise.answers![`Ex${i}Q${q}`]
        const quest : InterfaceResultExercice = {
          uuid: exercise.uuid,
          title: exercise.titre,
          indice: exercise.numeroExercice as number,
          state: 'done',
          alea: exercise.seed,
          answers: ans,
          numberOfPoints: (resultsByQuestion[ind] ? 1 : 0),
          numberOfQuestions: 1,
          bestScore: (resultsByQuestion[ind] ? 1 : 0),
          resultsByQuestion: [resultsByQuestion[ind]],
          duration: Math.floor($canOptions.durationInMinutes * 60 - $canOptions.remainingTimeInSeconds)
        }
        ind++
        resultsByExerciceArray.push(quest)
      }
    }
    resultsByExercice.update((l) => {
      l = resultsByExerciceArray
      return l
    })

    if ($globalOptions.recorder === 'capytale') {
      sendToCapytaleSaveStudentAssignment({
        indiceExercice: 'all',
        assignmentData: {
          duration: Math.floor($canOptions.durationInMinutes * 60 - $canOptions.remainingTimeInSeconds),
          resultsByQuestion
        }
      })
    }

  /**
   * Construit la chaîne qui sera affichée pour le score
   * nombre de points obtenu / nombre de questions
   */
  function buildScore (): string {
    let score = 0
    for (const result of resultsByQuestion) {
      if (result === true) {
        score++
      }
    }
    return score + '/' + resultsByQuestion.length
  }

  /**
   * Construit la chaîne MM:SS qui sera affichée pour le temps mis à faire la course
   */
  function buildTime (): string {
    const nbOfSeconds = recordedTimeFromCapytale ||
      $canOptions.durationInMinutes * 60 - $canOptions.remainingTimeInSeconds
    const time = millisecondToMinSec(nbOfSeconds * 1000)
    return [
      time.minutes.toString().padStart(2, '0'),
      time.seconds.toString().padStart(2, '0')
    ].join(':')
  }

  // handleCapytale peut changer la valeur du store pour que le
  // professeur aille directement aux solutions de l'élève
  canOptions.subscribe((value) => {
    if (value.state !== 'solutions') return
    state = value.state
    if (answersFromCapytale.length === 0) {
      return
    }
    console.log('answersFromCapytale', answersFromCapytale)
    for (const exercise of answersFromCapytale) {
      if (exercise.answers !== undefined) {
        const answersOfExercise : string[] = []
        const keysAns = Object.keys(exercise.answers)
        for (let i = 0; i < exercise.numberOfQuestions; i++) {
          const numberQ = keysAns.findIndex(e => e.endsWith(`Q${i}`))
          if (numberQ < 0) {
            answersOfExercise[i] = ''
          } else {
            answersOfExercise[i] = exercise.answers[keysAns[numberQ]]
          }
        }
        // const answersOfExercise = Object.values(exercise.answers)
        answers = answers.concat(answersOfExercise)
      }
    }
    if (assignmentDataFromCapytale?.resultsByQuestion !== undefined) resultsByQuestion = assignmentDataFromCapytale.resultsByQuestion
    if (assignmentDataFromCapytale?.duration !== undefined) recordedTimeFromCapytale = assignmentDataFromCapytale.duration
  })
</script>

<div class="{$darkMode.isActive ? 'dark' : ''} relative w-full h-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
  {#if state === 'start'}
    <KickOff subTitle={$canOptions.subTitle} bind:state />
  {/if}
  {#if state === 'countdown'}
    <CountDown bind:state />
  {/if}
  {#if state === 'race'}
    <Race
      numberOfSeconds={$canOptions.durationInMinutes * 60}
      bind:state
      {questions}
      {consignes}
      {checkAnswers}
    />
  {/if}
  {#if state === 'end'}
    <End bind:state score={buildScore()} time={buildTime()} />
  {/if}
  {#if state === 'solutions'}
    <Solutions
      {questions}
      {consignes}
      {corrections}
      {consignesCorrections}
      {answers}
      {resultsByQuestion}
      score={buildScore()}
      time={buildTime()}
    />
  {/if}
  <div class="fixed flex bottom-2 right-2">
    <label
      class="swap swap-rotate text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
    >
      <!-- this hidden checkbox controls the state -->
      <input
        id="hidden-checkbox-for-darkmode"
        type="checkbox"
        class="invisible"
        bind:checked={$darkMode.isActive}
      />
      <!-- sun icon -->
      <div class="swap-on"><i class="bx bx-sm bx-sun" /></div>
      <!-- moon icon -->
      <div class="swap-off"><i class="bx bx-sm bx-moon" /></div>
    </label>
  </div>
</div>
