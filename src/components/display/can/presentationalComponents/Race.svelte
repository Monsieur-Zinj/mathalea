<script lang="ts">
  import { onMount } from 'svelte'
  import type { CanState } from '../../../../lib/types/can'
  import Question from './Question.svelte'
  import ElapsedTime from './ElapsedTime.svelte'
  import Pagination from './Pagination.svelte'
  import NavigationButtons from './NavigationButtons.svelte'
  import { canOptions } from '../../../../lib/stores/canStore'
  import Keyboard from '../../../keyboard/Keyboard.svelte'
  import { keyboardState } from '../../../keyboard/stores/keyboardStore'
  import { millisecondToMinSec } from '../../../../lib/components/time'

  export let state: CanState
  export let numberOfSeconds: number = 20
  export let checkAnswers: () => void
  let current: number = 0
  let interval: number
  export let questions: string[]
  export let consignes: string[]
  const numberOfQuestions: number = questions.length

  let remainingTime = numberOfSeconds * 100
  const totalTime = numberOfSeconds * 100
  let displayedTime: string = '00:00'
  $: widthFactor = remainingTime / totalTime
  onMount(() => {
    const timeDisplayDiv =
      widthFactor > 0.2
        ? document.getElementById('time-display-1')
        : document.getElementById('time-display-2')
    if (timeDisplayDiv) {
      interval = window.setInterval(() => {
        const time = millisecondToMinSec(remainingTime * 10)
        const formattedtime = [
          time.minutes.toString().padStart(2, '0'),
          time.seconds.toString().padStart(2, '0')
        ].join(':')
        displayedTime = formattedtime
        timeDisplayDiv.textContent = displayedTime
        const nexttime = --remainingTime
        // sauvegarde du temps restant dans le store
        $canOptions.remainingTimeInSeconds = remainingTime / 100
        if (nexttime === 0) {
          // course terminée
          handleEndOfRace()
        }
      }, 10)
    }
  })
  /**
   * Gestion de la fion de la course : on annule le décompte,
   * si le mode interactif est présent, on vérifie les questions
   * et on bascule sur l'état `end`
   */
  function handleEndOfRace () {
    window.clearInterval(interval)
    if ($canOptions.isInteractive) {
      checkAnswers()
    }
    state = 'end'
  }

  function nextQuestion () {
    if (current < numberOfQuestions - 1) {
      current += 1
    }
  }
</script>

<div
  class="w-full h-full flex flex-col justify-between items-center overflow-y-hidden bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
>
  <div class="w-full flex flex-col">
    <ElapsedTime {widthFactor} {displayedTime} />
    <Pagination bind:current {numberOfQuestions} state={'race'} resultsByQuestion={[]} />
  </div>
  <div
    id="questions-container"
    class="flex flex-col justify-center items-center font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus text-3xl md:text-5xl {$keyboardState.isVisible
      ? 'h-[calc(100%-30rem)]'
      : 'h-full'} w-full"
  >
    {#each [...Array(numberOfQuestions).keys()] as i}
      <Question
        consigne={consignes[i]}
        question={questions[i]}
        consigneCorrection={''}
        correction={''}
        mode={'display'}
        visible={current === i}
        index={i}
        {nextQuestion}
      />
    {/each}
  </div>
  <div
    class="flex justify-center w-full {$keyboardState.isVisible ? 'mb-52' : ''}"
  >
    <NavigationButtons
      bind:current
      {numberOfQuestions}
      {handleEndOfRace}
      {state}
    />
  </div>
  <Keyboard />
</div>
