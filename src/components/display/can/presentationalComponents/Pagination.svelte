<script lang="ts">
  import { canOptions } from '../../../../lib/stores/canStore'
  import type { CanState } from '../../../../lib/types/can'

  export let current: number
  export let numberOfQuestions: number
  export let state: CanState
  export let resultsByQuestion: boolean[]
</script>

<nav
  aria-label="course pagination"
  class="w-full hidden md:flex flex-row justify-center items-centers py-4"
>
  <u
    class="list-none w-full flex flex-row flex-wrap justify-around items-center"
  >
    {#each [...Array(numberOfQuestions).keys()] as i}
      <li class="relative block">
        <button
          role="tab"
          aria-controls="tab-{i + 1}"
          aria-selected={current === i ? 'true' : 'false'}
          type="button"
          class="rounded-full px-3 py-1.5 text-sm md:text-base font-black transition-all duration-300
        {i === current
          ? 'text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-struct dark:bg-coopmathsdark-struct'
          : 'bg-transparent text-coopmaths-action hover:bg-coopmaths-action-lightest hover:bg-opacity-20  dark:text-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest dark:hover:bg-opacity-20'}"
          on:click={() => {
            current = i
          }}
        >
          {i + 1}
        </button>
        {#if state === 'race'}
          <div
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-coopmaths-struct
        {$canOptions.isInteractive && $canOptions.questionGetAnswer[i]
          ? 'flex'
          : 'hidden'}"
          ></div>
        {/if}
        {#if state === 'solutions'}
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 flex">
            <i
              class="bx {resultsByQuestion[i]
                ? 'bxs-check-square text-coopmaths-warn-800 dark:text-green-500'
                : 'bxs-x-square text-red-500 dark:text-coopmathsdark-warn'}"
            />
          </div>
        {/if}
      </li>
    {/each}
  </u>
</nav>
