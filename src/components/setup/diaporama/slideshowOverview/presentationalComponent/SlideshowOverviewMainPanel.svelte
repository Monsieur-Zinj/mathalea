<script lang="ts">
  import { tick } from 'svelte'
  import { mathaleaFormatExercice, mathaleaRenderDiv } from '../../../../../lib/mathalea'

  export let isQuestionsVisible: boolean | undefined
  export let isCorrectionVisible: boolean | undefined
  export let currentVue: number
  export let nbOfVues: number
  export let order: number[]
  export let series: { consignes: string[]; questions: string[]; corrections: string[] }[]
  export let divExercice: HTMLElement
  export let correctionsSteps: number[]
  export let zoomStr: string

  $: if (divExercice && (isQuestionsVisible || isCorrectionVisible || correctionsSteps.length > 0) && currentVue !== undefined) {
    tick().then(() => mathaleaRenderDiv(divExercice))
  }

</script>

<main class="bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus w-full">
  <!-- Affichage Questions/Réponses -->
  <div class="flex p-2 h-full w-full">
    <div class="w-full" bind:this={divExercice}>
      {#if currentVue < 4}
        {#if nbOfVues > 1}
          <div
            class="flex flex-row items-center justify-start text-3xl font-black text-coopmaths-struct dark:text-coopmathsdark-struct p-6"
          >
            Série {currentVue + 1}
          </div>
        {:else}
          <div
            class="flex flex-row items-center justify-start text-3xl font-black text-coopmaths-struct dark:text-coopmathsdark-struct p-6"
          >
            {isQuestionsVisible ? 'Questions' : ''}{isCorrectionVisible &&
            isQuestionsVisible
              ? ' / '
              : ''}{isCorrectionVisible ? 'Réponses' : ''}
          </div>
        {/if}
        <div
          class="list-inside list-decimal mt-2 mx-2 lg:mx-6 marker:text-coopmaths-struct dark:text-coopmathsdark-struct marker:font-bold"
        >
          {#each order as i}
            <div>
              <div
                class="flex flex-row my-4"
                style="font-size: {zoomStr}rem"
              >
                <div class="flex flex-col justify-start items-center pr-2">
                  <span
                    class="inline-flex text-center text-coopmaths-struct dark:text-coopmathsdark-struct font-black"
                  >
                    {i + 1}.
                  </span>
                </div>
                <div
                  class="flex flex-col justify-start items-start max-w-full"
                >
                  {#if isQuestionsVisible}
                    <div>
                      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                      {@html mathaleaFormatExercice(series[currentVue].questions[i])}
                    </div>
                  {/if}
                  {#if isCorrectionVisible || correctionsSteps.includes(i)}
                    <div
                      class="relative self-start border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus {isQuestionsVisible
                        ? 'my-8'
                        : 'mt-6'} py-2 pl-6 max-w-full"
                    >
                      <div
                        class="container overflow-x-auto overflow-y-hidden"
                      >
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        {@html mathaleaFormatExercice(series[currentVue].corrections[i])}
                      </div>
                      <div
                        class="absolute flex flex-row py-[1.5px] px-3 rounded-t-md justify-center items-center -left-[3px] -top-[15px] bg-coopmaths-struct dark:bg-coopmathsdark-struct font-semibold text-xs text-coopmaths-canvas dark:text-coopmathsdark-canvas"
                      >
                        Correction
                      </div>
                      <div
                        class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct bottom-0 left-0 border-b-[3px] w-4"
                      />
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="grid grid-cols-4 gap-4 place-content-stretch w-full">
          {#each Array(nbOfVues).keys() as currentVueId}
            <div class="flex flex-col w-full">
              <div
                class="flex flex-row justify-start items-center text-3xl font-black text-coopmaths-struct dark:text-coopmathsdark-struct p-6 w-full"
              >
                Série {currentVueId + 1}
                <!-- <button type="button" class="pl-4">
                  <i class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx bx-sm bx-refresh" />
                </button> -->
              </div>
              {#each order as i}
                <div class="pl-6">
                  <div
                    class="flex flex-row items-start my-4"
                    style="font-size: {zoomStr}rem"
                  >
                    <div
                      class="flex flex-col justify-start items-center pr-2"
                    >
                      <span
                        class="inline-flex text-center text-coopmaths-struct dark:text-coopmathsdark-struct font-black"
                      >
                        {i + 1}.
                      </span>
                    </div>
                    <div
                      class="flex flex-col justify-start items-start max-w-full"
                    >
                      {#if isQuestionsVisible}
                        <div>
                          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                          {@html mathaleaFormatExercice(series[currentVueId].questions[i])}
                        </div>
                      {/if}
                      {#if isCorrectionVisible || correctionsSteps.includes(i)}
                        <div
                          class="relative self-start border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus {isQuestionsVisible
                            ? 'my-8'
                            : 'mt-6'} p-2 max-w-full"
                        >
                          <div
                            class="container overflow-x-auto overflow-y-hidden"
                          >
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                            {@html mathaleaFormatExercice(series[currentVueId].corrections[i])}
                          </div>
                          <div
                            class="absolute flex flex-row py-[1.5px] px-3 rounded-t-md justify-center items-center -left-[3px] -top-[15px] bg-coopmaths-struct dark:bg-coopmathsdark-struct font-semibold text-xs text-coopmaths-canvas dark:text-coopmathsdark-canvas"
                          >
                            Correction
                          </div>
                          <div
                            class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct bottom-0 left-0 border-b-[3px] w-4"
                          />
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</main>
