<script lang="ts">
  export let isManualModeActive: boolean | undefined
  export let currentQuestion: number
  export let questions: string[]
  export let goToQuestion: (index: number) => void
  export let ratioTime: number
  export let currentDuration: number

  let stepsUl: HTMLUListElement

  $: {
    if (stepsUl) {
      const steps = stepsUl.querySelectorAll('li')
      if (typeof steps !== 'undefined') {
        if (steps[currentQuestion]) steps[currentQuestion].scrollIntoView()
        if (steps[currentQuestion + 5]) {
          steps[currentQuestion + 5].scrollIntoView()
        }
        if (
          steps[currentQuestion - 5] &&
          !isInViewport(steps[currentQuestion - 5])
        ) {
          steps[currentQuestion - 5].scrollIntoView()
        }
      }
    }
  }

function isInViewport (element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
</script>

<header class="flex flex-col bg-coopmaths-canvas dark:bg-coopmathsdark-canvas pb-1 w-full">
  <div
    class:invisible={isManualModeActive}
    class="flex flex-row flex-shrink-0 h-6 border border-coopmaths-warn dark:border-coopmathsdark-warn"
  >
    <div
      id="diapoProgressBar"
      class="bg-coopmaths-warn dark:bg-coopmathsdark-warn"
      style="width: {ratioTime}%; transition: width {currentDuration / 100}s linear"
    />
  </div>
  <ul class="steps w-full mt-3">
    {#each [...questions.keys()] as i}
      <button
        on:click={() => goToQuestion(i)}
        on:keydown={() => goToQuestion(i)}
        tabindex="0"
          class="step dark:step-info {currentQuestion >= i
            ? 'step-primary'
            : ''} cursor-pointer {currentQuestion === i
              ? 'step-current'
              : ''}"
      >
      </button>
    {/each}
  </ul>
</header>

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
