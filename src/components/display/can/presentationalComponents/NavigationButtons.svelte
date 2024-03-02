<script lang="ts">
  import { onMount } from 'svelte'
  import { swipe } from 'svelte-gestures'
  import type { CanState } from '../../../../lib/types/can'
  import { Modal, initTE } from 'tw-elements'
  import ShortPagination from './ShortPagination.svelte'

  export let current: number
  export let numberOfQuestions: number
  export let handleEndOfRace: () => void
  export let state: CanState
  export let resultsByQuestion: boolean[]

  onMount(() => {
    initTE({ Modal })
    setTimeout(() => {
      const endButtonDiv = document.getElementById('race-ended-by-user-btn')
      if (endButtonDiv) {
        endButtonDiv.removeAttribute('disabled')
      }
    }, 30 * 1000)
  })

  let direction

  function handleSwipe (event: CustomEvent) {
    direction = event.detail.direction
    if (direction === 'left' && current < numberOfQuestions - 1) {
      current += 1
    }
    if (direction === 'right' && current > 0) {
      current -= 1
    }
  }
</script>

<div
  use:swipe={{ timeframe: 300, minSwipeDistance: 60 }}
  on:swipe={handleSwipe}
  class="w-full pb-8 md:pb-10 px-10 space-y-4 flex flex-col md:flex-row justify-start md:justify-between items-center"
>
  <div></div>
  <div class="flex flex-row space-x-10">
    <button
      class="md:hidden flex justify-center items-center"
      type="button"
      on:click={() => {
        if (current >= 10) {
          current -= 10
        }
      }}
    >
      <i
        class="bx bxs-chevrons-left text-coopmaths-action dark:text-coopmathsdark-action text-3xl md:text-7xl
            {current < 10
              ? 'text-opacity-10'
              : 'text-opacity_100 hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest'}"
      ></i>
    </button>
    <button
      type="button"
      on:click={() => {
        if (current > 0) {
          current -= 1
        }
      }}
    >
      <i
        class="bx bxs-chevron-left md:bxs-left-arrow text-coopmaths-action dark:text-coopmathsdark-action text-3xl md:text-7xl
            {current === 0
              ? 'text-opacity-10'
              : 'text-opacity_100 hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest'}"
      ></i>
    </button>
    <ShortPagination {current} {state} {resultsByQuestion} />
    <button
      type="button"
      on:click={() => {
        if (current < numberOfQuestions - 1) {
          current += 1
        }
      }}
    >
      <i
        class="bx bxs-chevron-right md:bxs-right-arrow text-coopmaths-action dark:text-coopmathsdark-action text-3xl md:text-7xl
            {current === numberOfQuestions - 1
              ? 'text-opacity-10'
              : 'text-opacity_100 hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest'}"
      ></i>
    </button>
    <button
      class="md:hidden flex justify-center items-center"
      type="button"
      on:click={() => {
        if (current + 10 <= numberOfQuestions - 1) {
          current += 10
        }
      }}
    >
      <i
        class="bx bxs-chevrons-right text-coopmaths-action dark:text-coopmathsdark-action text-3xl md:text-7xl
            {current > numberOfQuestions - 11
              ? 'text-opacity-10'
              : 'text-opacity_100 hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest'}"
      ></i>
    </button>
  </div>
  <div>
    {#if state === 'race'}
      <button
        id="race-ended-by-user-btn"
        type="button"
        class="inline-block p-2 md:p-4 font-bold rounded-lg text-sm md:text-xl leading-normal text-coopmaths-canvas dark:text-coopmathsdark-canvas transition duration-150 ease-in-out bg-coopmaths-action hover:bg-coopmaths-action-lightest focus:bg-coopmaths-action-lightest dark:bg-coopmathsdark-action dark:hover:bg-coopmathsdark-action-lightest dark:focus:bg-coopmathsdark-action-lightest focus:outline-none focus:ring-0 active:bg-coopmaths-action-light dark:active:bg-coopmathsdark-action-light disabled:bg-opacity-10"
        data-te-toggle="modal"
        data-te-target="#staticBackdrop"
        disabled
      >
        Rendre la copie
      </button>
    {/if}
  </div>
</div>
<!-- Modal -->
<div
  data-te-modal-init
  class="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
  id="staticBackdrop"
  data-te-backdrop="static"
  data-te-keyboard="false"
  tabindex="-1"
  aria-labelledby="staticBackdropLabel"
  aria-hidden="true"
>
  <div
    data-te-modal-dialog-ref
    class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
  >
    <div
      class="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-coopmaths-canvas dark:bg-coopmathsdark-canvas bg-clip-padding text-current shadow-lg outline-none"
    >
      <div
        class="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 bg-coopmaths-warn-900 dark:bg-coopmathsdark-warn"
      >
        <!--Modal title-->
        <h5
          class="text-xl leading-normal text-coopmaths-canvas dark:text-coopmathsdark-canvas bg-coopmaths-warn-900 dark:bg-coopmathsdark-warn font-bold"
          id="staticBackdropLabel"
        >
          Attention !
        </h5>
        <!--Close button-->
        <button
          type="button"
          class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none text-coopmaths-canvas dark:text-coopmathsdark-canvas-darkest"
          data-te-modal-dismiss
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!--Modal body-->
      <div data-te-modal-body-ref class="relative p-4">
        <div
          class="flex flex-col space-y-4 text-coopmaths-corpus dark:text-coopmathsdark-corpus"
        >
          <div class="w-full flex justify-center items-center p-8">
            <i
              class="bx bxs-error text-coopmaths-warn-900 dark:text-coopmathsdark-warn-dark text-[70px]"
            ></i>
          </div>
          <div>
            Si vous cliquez sur le bouton
            <span class="font-bold">Terminer </span>
            alors vous ne pourrez plus revenir en arrière.
          </div>
          <div>Que souhaitez-vous faire ?</div>
        </div>
      </div>

      <!--Modal footer-->
      <div
        class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50"
      >
        <button
          type="button"
          class="inline-block rounded bg-coopmaths-action-200 dark:bg-coopmathsdark-action-lightest px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-coopmaths-action dark:text-coopmathsdark-action-dark transition duration-150 ease-in-out hover:bg-coopmaths-action-400 focus:bg-coopmaths-action-400 dark:hover:bg-coopmathsdark-action-light dark:focus:bg-coopmathsdark-action-light focus:outline-none focus:ring-0 active:bg-coopmaths-action-500 dark:active:bg-coopmathsdark-action-light"
          data-te-modal-dismiss
        >
          Annuler
        </button>
        <button
          type="button"
          class="ml-1 inline-block rounded bg-coopmaths-action dark:bg-coopmathsdark-action px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-coopmaths-canvas dark:text-coopmathsdark-canvas transition duration-150 ease-in-out hover:bg-coopmaths-action-dark focus:bg-coopmaths-action-dark dark:hover:bg-coopmathsdark-action-dark dark:focus:bg-coopmathsdark-action-dark focus:outline-none focus:ring-0 dark:active:bg-coopmathsdark-action-dark"
          on:click={() => {
            handleEndOfRace()
          }}
          data-te-modal-dismiss
        >
          Terminer
        </button>
      </div>
    </div>
  </div>
</div>
