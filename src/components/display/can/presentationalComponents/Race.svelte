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
    import Timer from './Timer.svelte';

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

  function endTimer(event) {
    /**
     * Timer fini
     * A Continuer
    */
    handleEndOfRace()
	}

  onMount(() => {
  })
  /**
   * Gestion de la fion de la course : on annule le décompte,
   * si le mode interactif est présent, on vérifie les questions
   * et on bascule sur l'état `end`
   */
  function handleEndOfRace () {
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
    <Timer durationInMilliSeconds={numberOfSeconds * 1000} on:message={endTimer}/>
    <Pagination bind:current {numberOfQuestions} state={'race'} resultsByQuestion={[]} />
  </div>
  <div
    id="questions-container"
    class="flex flex-col justify-center items-center font-light text-coopmaths-corpus dark:text-coopmathsdark-corpus text-3xl md:text-5xl
     {$keyboardState.isVisible && !$keyboardState.isInLine  ? 'h-[calc(100%-30rem)]' : ''}
     {$keyboardState.isVisible && $keyboardState.isInLine  ? 'h-[calc(100%-16rem)]' : ''}
     {!$keyboardState.isVisible ? 'h-full' : ''} w-full"
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
    class="flex justify-center w-full {$keyboardState.isVisible && $keyboardState.isInLine? 'mb-10' : ''} {$keyboardState.isVisible && !$keyboardState.isInLine? 'mb-52' : ''}"
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
