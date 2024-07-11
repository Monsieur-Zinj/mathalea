<script lang="ts">
  import { onMount } from 'svelte'

  export let isManualModeActive: boolean | undefined
  export let currentQuestionNumber: number
  export let totalQuestionsNumber: number
  export let goToQuestion: (index: number) => void
  export let ratioTime: number
  export let currentSlideDuration: number

  let stepsUl: HTMLElement | null
  onMount(() => {
    stepsUl = document.getElementById('stepsUl')
  })

  $: {
    if (stepsUl) {
      const steps = stepsUl.querySelectorAll('button')
      if (steps[currentQuestionNumber]) steps[currentQuestionNumber].scrollIntoView()
      if (steps[currentQuestionNumber + 5]) steps[currentQuestionNumber + 5].scrollIntoView()
      if (steps[currentQuestionNumber - 5]) steps[currentQuestionNumber - 5].scrollIntoView()
      const diapoProgressContainer = document.getElementById('diapoProgressContainer')
      if (diapoProgressContainer) diapoProgressContainer.scrollIntoView()
    }
  }

</script>

<div
  id="diapoProgressContainer"
  class:invisible={isManualModeActive}
  class="flex flex-row flex-shrink-0 h-6 border
    border-coopmaths-warn dark:border-coopmathsdark-warn"
>
  <div
    class="bg-coopmaths-warn dark:bg-coopmathsdark-warn"
    style="width: {ratioTime}%; transition: width {currentSlideDuration / 100}s linear"
  />
</div>
<ul id="stepsUl" class="steps w-full mt-3">
  {#each [...Array(totalQuestionsNumber).keys()] as i}
    <button
      on:click={() => goToQuestion(i)}
      class="cursor-pointer
        step dark:step-info
        {currentQuestionNumber === i ? 'step-current' : ''}
        {currentQuestionNumber >= i ? 'step-primary' : ''}"
    >
    </button>
  {/each}
</ul>

<style>
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  .step::after {
    color: white;
  }
  .step-current::after {
    animation: pulse 1s infinite ease-in-out;

  }
</style>
