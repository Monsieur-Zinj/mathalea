<script lang="ts">
  export let nbOfVues: 1 | 2 | 3 | 4
  export let divQuestion: HTMLDivElement[]
  export let consignes: string[][]
  export let corrections: string[][]
  export let questions: string[][]
  export let order: number[]
  export let currentQuestion: number
  export let isQuestionVisible: boolean
  export let isCorrectionVisible: boolean

</script>

<main class="bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus min-h-[80%] p-4">
  <div
    class="{nbOfVues > 1
      ? 'grid grid-cols-2 gap-4 auto-rows-fr'
      : 'grid grid-cols-1'} place-content-stretch justify-items-center w-full h-full"
  >
    {#each [...Array(nbOfVues).keys()] as i}
      <div
        id="diapocell{i}"
        class="relative min-h-[100%] max-h-[100%] flex flex-col justify-center justify-self-stretch place-items-stretch p-2 {nbOfVues > 1
          ? 'bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'
          : ''} text-center"
      >
        {#if nbOfVues > 1}
          <div class="absolute bg-coopmaths-struct text-coopmaths-canvas dark:bg-coopmathsdark-struct dark:text-coopmathsdark-canvas font-black text-4xl -top-1 -left-1 rounded-tl-2xl w-1/12 h-1/12">
            {i + 1}
          </div>
        {/if}
        <div
          id="textcell{i}"
          bind:this={divQuestion[i]}
          class="flex flex-col justify-center items-center px-4 w-full min-h-[100%] max-h-[100%]"
        >
          {#if isQuestionVisible}
            <div class="font-light" id="consigne{i}">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html consignes[i][
                order[currentQuestion]
              ]}
            </div>
            <div class="py-4" id="question{i}">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html questions[i][
                order[currentQuestion]
              ]}
            </div>
          {/if}
          {#if isCorrectionVisible}
            <div
              id="correction{i}"
              class=" {isCorrectionVisible
                ? 'bg-coopmaths-warn-light bg-opacity-30 dark:bg-coopmathsdark-warn-light dark:bg-opacity-30 my-10'
                : ''}"
            >
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html corrections[i][
                order[currentQuestion]
              ]}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <dialog
    class="absolute top-0 left-0 h-full w-full bg-coopmaths-struct text-coopmaths-canvas dark:bg-coopmathsdark-struct dark:text-coopmathsdark-canvas text-[150px] font-extralight min-w-full min-h-full"
    id="transition"
  >
    <div
      class="flex w-full min-h-full h-full justify-center items-center"
    >
      <div
        class="radial-progress"
        style="--value:{((currentQuestion + 1) / questions[0].length) *
          100}; --size:500px; --thickness: 20px;"
      >
        {currentQuestion + 1} / {questions[0].length}
      </div>
    </div>
  </dialog>
</main>

<style>
  dialog::backdrop {
    backdrop-filter: blur(4px);
  }
</style>
