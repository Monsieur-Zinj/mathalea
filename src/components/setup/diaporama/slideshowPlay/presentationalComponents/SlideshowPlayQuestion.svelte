<script lang="ts">
  import type { Slide } from '../../types'

  export let divQuestion: HTMLDivElement[]
  export let isQuestionVisible: boolean
  export let isCorrectionVisible: boolean
  export let currentSlide: Slide
  export let currentQuestion: number
  export let selectedQuestionsNumber: number

  let nbVues
  $: nbVues = currentSlide.vues.length

</script>

<main class="bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus min-h-[80%] p-4">
  <div
    class="place-content-stretch justify-items-center w-full h-full {nbVues > 1
      ? 'grid grid-cols-2 gap-4 auto-rows-fr'
      : 'grid grid-cols-1'}"
  >
    {#each [...Array(nbVues).keys()] as i}
      <div
        class="relative min-h-[100%] max-h-[100%] flex flex-col justify-center justify-self-stretch place-items-stretch p-2 text-center {nbVues > 1
          ? 'bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'
          : ''}"
      >
        {#if nbVues > 1}
          <div class="absolute bg-coopmaths-struct text-coopmaths-canvas dark:bg-coopmathsdark-struct dark:text-coopmathsdark-canvas font-black text-4xl -top-1 -left-1 rounded-tl-2xl w-1/12 h-1/12">
            {i + 1}
          </div>
        {/if}
        <div
          id="exerciseContainer{i}"
          bind:this={divQuestion[i]}
          class="flex flex-col justify-center items-center px-4 w-full min-h-[100%] max-h-[100%]"
        >
          {#if isQuestionVisible && currentSlide.vues[i]}
            <div class="py-4 flex items-center" id="question{i}">
              <div>
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {#each currentSlide.vues[i].consigneSvgs as consigneSvg}
                  <div>
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html consigneSvg}
                  </div>
                {/each}
              </div>
              <div>
                <div>
                  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                  {@html currentSlide.vues[i].consigneText}
                </div>
                <div>
                  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                  {@html currentSlide.vues[i].questionText}
                </div>
              </div>
              <div>
                {#each currentSlide.vues[i].questionSvgs as questionSvg}
                  <div>
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html questionSvg}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          {#if isCorrectionVisible && currentSlide.vues[i]}
            <div
              id="correction{i}"
              class="bg-coopmaths-warn-light bg-opacity-30 dark:bg-coopmathsdark-warn-light dark:bg-opacity-30 my-10 flex items-center"
            >
              <div>
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html currentSlide.vues[i].correctionText}
              </div>
              <div>
                {#each currentSlide.vues[i].correctionSvgs as correctionSvg}
                  <div>
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html correctionSvg}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <dialog
    id="transition"
    class="absolute top-0 left-0 h-full w-full bg-coopmaths-struct text-coopmaths-canvas dark:bg-coopmathsdark-struct dark:text-coopmathsdark-canvas text-[150px] font-extralight min-w-full min-h-full"
  >
    <div class="flex w-full min-h-full h-full justify-center items-center">
      <div
        class="radial-progress"
        style="--value:{((currentQuestion + 1) / selectedQuestionsNumber) * 100};"
      >
        {currentQuestion + 1} / {selectedQuestionsNumber}
      </div>
    </div>
  </dialog>
</main>

<style>
  dialog::backdrop {
    backdrop-filter: blur(4px);
  }
  .radial-progress {
    font-size: 20vw;
    --size: 60vw;
    --thickness: 3vw;
  }

  @media (min-aspect-ratio: 1/1) {
    .radial-progress {
      font-size: 20vh;
      --size: 60vh;
      --thickness: 3vh;
    }
  }

</style>
