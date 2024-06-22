<script lang="ts">
  export let isManualModeActive: boolean | undefined
  export let currentQuestion: number
  export let questions: string[]
  export let clickOnStep: (index: number) => void
  export let ratioTime: number
  export let currentDuration: number
  export let stepsUl: HTMLUListElement

</script>

<header
  class="flex flex-col h-[10%] bg-coopmaths-canvas dark:bg-coopmathsdark-canvas pb-1"
>
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
  <div class="flex flex-row h-full mt-6 w-full justify-center">
    <ul class="steps w-11/12" bind:this={stepsUl}>
      {#each [...questions.keys()] as i}
        <span
          on:click={() => clickOnStep(i)}
          on:keydown={() => clickOnStep(i)}
          role="button"
          tabindex="0"
        >
          <li
            class="step step-neutral dark:step-info {currentQuestion >= i
              ? 'step-primary'
              : ''} cursor-pointer"
          />
        </span>
      {/each}
    </ul>
  </div>
</header>
