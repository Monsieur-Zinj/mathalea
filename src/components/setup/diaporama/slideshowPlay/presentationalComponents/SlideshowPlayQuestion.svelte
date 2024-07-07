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

<div class="place-content-stretch justify-items-center w-full h-full grid
  {nbVues > 1 ? 'grid-cols-2 gap-4 auto-rows-fr' : 'grid-cols-1'}"
>
  {#each [...Array(nbVues).keys()] as i}
    <div class="relative flex flex-col justify-center justify-self-stretch place-items-stretch
      min-h-[100%] max-h-[100%] p-2 text-center
      {nbVues > 1 ? 'bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark' : ''}"
    >
      {#if nbVues > 1}
        <div class="absolute -top-1 -left-1 rounded-tl-2xl w-1/12 h-1/12 font-black text-4xl
          bg-coopmaths-struct dark:bg-coopmathsdark-struct
          text-coopmaths-canvas dark:text-coopmathsdark-canvas"
        >
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
            class="flex items-center my-10
              bg-opacity-30 dark:bg-opacity-30
              bg-coopmaths-warn-light dark:bg-coopmathsdark-warn-light"
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
  class="absolute top-0 left-0 min-w-full w-full min-h-full h-full
    text-[150px] font-extralight
    bg-coopmaths-struct dark:bg-coopmathsdark-struct
    text-coopmaths-canvas dark:text-coopmathsdark-canvas"
>
  <div class="flex justify-center items-center w-full min-h-full h-full">
    <div
      class="radial-progress"
      style="--value:{((currentQuestion + 1) / selectedQuestionsNumber) * 100};"
    >
      {currentQuestion + 1} / {selectedQuestionsNumber}
    </div>
  </div>
</dialog>

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
