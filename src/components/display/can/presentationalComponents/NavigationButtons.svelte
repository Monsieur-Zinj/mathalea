<script lang="ts">
  import type { CanState } from '../../../../lib/types/can'
  import Button from '../../../shared/forms/Button.svelte'

  export let current: number
  export let numberOfQuestions: number
  export let handleEndOfRace: () => void
  export let state: CanState
</script>

<div class="pb-4 md:pb-10 flex flex-row w-10/12 md:w-1/3 justify-evenly items-center">
  <button
    type="button"
    on:click={() => {
      if (current > 0) {
        current -= 1
      }
    }}
  >
    <i
      class="bx bxs-left-arrow text-coopmaths-action dark:text-coopmathsdark-action text-3xl md:text-7xl
          {current === 0
            ? 'text-opacity-10'
            : 'text-opacity_100 hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest'}"
    ></i>
  </button>
  {#if state === 'race'}
  <Button
  class="p-2 md:p-4 font-bold rounded-lg text-sm md:text-xl" title="J'ai terminé !" on:click={handleEndOfRace} />
  {/if}
  <button
    type="button"
    on:click={() => {
      if (current < numberOfQuestions - 1) {
        current += 1
      }
    }}
  >
    <i
      class="bx bxs-right-arrow text-coopmaths-action dark:text-coopmathsdark-action text-3xl md:text-7xl
          {current === numberOfQuestions - 1
            ? 'text-opacity-10'
            : 'text-opacity_100 hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest'}"
    ></i>
  </button>
</div>
