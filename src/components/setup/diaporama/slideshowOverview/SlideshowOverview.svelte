<script lang="ts">
  import {
    globalOptions,
    darkMode,
    exercicesParams
  } from '../../../../lib/stores/generalStore'
  import { tick } from 'svelte'
  import {
    mathaleaFormatExercice,
    mathaleaGenerateSeed,
    mathaleaHandleComponentChange,
    mathaleaRenderDiv,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../../lib/mathalea'
  import type Exercice from '../../../../exercices/Exercice'
  import type { InterfaceParams } from '../../../../lib/types'
  import BtnZoom from '../../../shared/ui/btnZoom.svelte'
  import type { Slideshow } from '../types'

  export let exercises: Exercice[] = []
  export let slideshow: Slideshow
  export let updateExercises: () => void

  type Serie = {
    consignes: string[]
    questions: string[]
    corrections: string[]
  }
  let currentVue: 0 | 1 | 2 | 3 = 0
  let isCorrectionVisible = false
  let isQuestionsVisible = true
  let divExercice: HTMLElement
  let correctionsSteps: number[] = []

  let nbOfVues: number
  $: nbOfVues = slideshow.slides[0].vues.length

  let order: number[]
  $: {
    const questionsNb = slideshow.selectedQuestionsNumber || slideshow.slides.length
    order = $globalOptions.order || [...Array(questionsNb).keys()]
  }

  let series: Serie[] = []
  $: {
    series = []
    for (let i = 0; i < nbOfVues; i++) {
      const serie: Serie = {
        consignes: [],
        questions: [],
        corrections: []
      }
      for (const slide of slideshow.slides) {
        serie.consignes.push(slide.vues[i].consigne)
        serie.questions.push(slide.vues[i].question)
        serie.corrections.push(slide.vues[i].correction)
      }
      series.push(serie)
    }
  }

  $: if (divExercice) mathaleaRenderDiv(divExercice)

  async function setCorrectionVisible (correctionVisibility: boolean) {
    isCorrectionVisible = correctionVisibility
    if (!isCorrectionVisible) {
      setQuestionsVisible(true)
    } else {
      updateDisplay()
    }
  }

  async function setQuestionsVisible (questionsVisibility: boolean) {
    isQuestionsVisible = questionsVisibility
    if (!isQuestionsVisible) {
      setCorrectionVisible(true)
    } else {
      updateDisplay()
    }
  }

  async function updateDisplay () {
    await tick()
    if (divExercice) mathaleaRenderDiv(divExercice)
  }

  function newDataForAll () {
    const newParams: InterfaceParams[] = []
    for (const exercice of exercises) {
      exercice.seed = mathaleaGenerateSeed()
      newParams.push({
        uuid: exercice.uuid,
        id: exercice.id,
        alea: exercice.seed.substring(0, 4),
        nbQuestions: exercice.nbQuestions,
        duration: exercice.duration
      })
    }
    exercicesParams.update(() => newParams)
    updateExercises()
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    updateDisplay()
  }

  /**
   * Gestion du pas à pas pour l'affichage des corrections
   * @param {string} button chaîne correspondant à la direction du pas à pas ("backward" ou "forward")
   */
  function handleCorrectionsStepsClick (button: 'backward' | 'forward') {
    if (button === 'backward') {
      if (correctionsSteps.length !== 0) {
        correctionsSteps.pop()
        correctionsSteps = correctionsSteps
      }
    }
    if (button === 'forward') {
      if (correctionsSteps.length < order.length) {
        correctionsSteps.push(order[correctionsSteps.length])
      }
      correctionsSteps = correctionsSteps
    }
    updateDisplay()
  }
</script>

<div class={$darkMode.isActive ? 'dark' : ''}>
  <div
    class="fixed z-20 bottom-2 lg:bottom-6 right-2 lg:right-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas rounded-b-full rounded-t-full bg-opacity-80"
  >
    <div class="flex flex-col space-y-2 scale-75 lg:scale-100">
      <BtnZoom size="md" />
    </div>
  </div>
  <div class="flex bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <!-- boutons commandes -->
    <aside class=" h-screen sticky top-0">
      <div
        class="flex flex-col bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-struct dark:text-coopmathsdark-struct w-14 min-h-screen py-4 items-center"
      >
        <button
          type="button"
          class="pb-8 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
          on:click={() => mathaleaHandleComponentChange('can', 'diaporama')}
          ><i class="bx bx-sm bx-arrow-back" /></button
        >
        <button
          type="button"
          class="pb-8 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
          on:click={newDataForAll}><i class="bx bx-sm bx-refresh" /></button
        >
        <!-- <button type="button" class="hover:text-coopmaths-dark" on:click={newDataForAll}><i class="bx bx-sm bx-refresh" /></button> -->

        <span
          class="text-xs text-coopmaths-struct dark:text-coopmathsdark-struct {isQuestionsVisible
            ? 'font-bold'
            : 'font-light'}">Questions</span
        >
        <button
          type="button"
          on:click={() => setQuestionsVisible(!isQuestionsVisible)}
          ><i
            class="bx bx-sm text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest {isQuestionsVisible
              ? 'bx-toggle-right'
              : 'bx-toggle-left'} cursor-pointer"
          /></button
        >
        <span
          class="text-xs text-coopmaths-struct dark:text-coopmathsdark-struct {isCorrectionVisible
            ? 'font-bold'
            : 'font-light'} pt-2">Réponses</span
        >
        <button
          type="button"
          on:click={() => setCorrectionVisible(!isCorrectionVisible)}
        >
          <i
            class="mb-8 bx bx-sm text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest {isCorrectionVisible
              ? 'bx-toggle-right'
              : 'bx-toggle-left'} cursor-pointer"
          />
        </button>
        <span
          class="text-xs font-bold pt-2 text-coopmaths-struct dark:text-coopmathsdark-struct"
          >Pas à pas</span
        >
        <div
          class="flex flex-row justify-center items-center mb-8 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
        >
          <button
            type="button"
            on:click={() => {
              handleCorrectionsStepsClick('backward')
            }}
          >
            <i class="bx bxs-left-arrow mr-2 cursor-pointer" />
          </button>
          <button
            type="button"
            on:click={() => {
              handleCorrectionsStepsClick('forward')
            }}
          >
            <i class="bx bxs-right-arrow cursor-pointer" />
          </button>
        </div>

        <!-- Onglets Séries -->
        {#if nbOfVues > 1}
          <input
            type="radio"
            id="tab1"
            value={0}
            bind:group={currentVue}
            on:change={updateDisplay}
            class="peer/tab1 items-center justify-center hidden"
          />
          <label
            class="flex flex-row rounded-l-lg border-y border-l border-coopmaths-struct dark:border-coopmathsdark-struct w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths-canvas-dark font-bold dark:bg-coopmathsdark-canvas-dark text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest peer-checked/tab1:bg-coopmaths-canvas dark:peer-checked/tab1:bg-coopmathsdark-canvas peer-checked/tab1:text-coopmaths-struct dark:peer-checked/tab1:text-coopmathsdark-struct peer-checked/tab1:cursor-default"
            for="tab1">1</label
          >
          <input
            type="radio"
            id="tab2"
            value={1}
            bind:group={currentVue}
            on:change={updateDisplay}
            class="peer/tab2 items-center justify-center hidden"
          />
          <label
            class="flex flex-row rounded-l-lg border-y border-l border-coopmaths-struct dark:border-coopmathsdark-struct w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths-canvas-dark font-bold dark:bg-coopmathsdark-canvas-dark text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest peer-checked/tab2:bg-coopmaths-canvas dark:peer-checked/tab2:bg-coopmathsdark-canvas peer-checked/tab2:text-coopmaths-struct dark:peer-checked/tab2:text-coopmathsdark-struct peer-checked/tab2:cursor-default"
            for="tab2">2</label
          >
        {/if}
        {#if nbOfVues > 2}
          <input
            type="radio"
            id="tab3"
            value={2}
            bind:group={currentVue}
            on:change={updateDisplay}
            class="peer/tab3 items-center justify-center hidden"
          />
          <label
            class="flex flex-row rounded-l-lg border-y border-l border-coopmaths-struct dark:border-coopmathsdark-struct w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark font-bold text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest peer-checked/tab3:bg-coopmaths-canvas dark:peer-checked/tab3:bg-coopmathsdark-canvas peer-checked/tab3:text-coopmaths-struct dark:peer-checked/tab3:text-coopmathsdark-struct peer-checked/tab3:cursor-default"
            for="tab3">3</label
          >
        {/if}
        {#if nbOfVues > 3}
          <input
            type="radio"
            id="tab4"
            value={3}
            bind:group={currentVue}
            on:change={updateDisplay}
            class="peer/tab4 items-center justify-center hidden"
          />
          <label
            class="flex flex-row rounded-l-lg border-y border-l border-coopmaths-struct dark:border-coopmathsdark-struct w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark font-bold text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest peer-checked/tab4:bg-coopmaths-canvas dark:peer-checked/tab4:bg-coopmathsdark-canvas peer-checked/tab4:text-coopmaths-struct dark:peer-checked/tab4:text-coopmathsdark-struct peer-checked/tab4:cursor-default"
            for="tab4">4</label
          >
        {/if}
        {#if nbOfVues > 1}
          <input
            type="radio"
            id="tab5"
            value={4}
            bind:group={currentVue}
            on:change={updateDisplay}
            class="hidden peer/tab5 items-center justify-center"
          />
          <label
            class="flex flex-row rounded-l-lg border-y border-l border-coopmaths-struct dark:border-coopmathsdark-struct w-14 h-14 justify-center items-center text-center cursor-pointer bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark font-bold text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest peer-checked/tab5:bg-coopmaths-canvas dark:peer-checked/tab5:bg-coopmathsdark-canvas peer-checked/tab5:text-coopmaths-struct dark:peer-checked/tab5:text-coopmathsdark-struct peer-checked/tab5:cursor-default"
            for="tab5">Tout</label
          >
        {/if}
      </div>
    </aside>
    <main
      class="bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus w-full"
    >
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
                    style="font-size: {($globalOptions.z || 1).toString()}rem"
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
                        style="font-size: {(
                          $globalOptions.z || 1
                        ).toString()}rem"
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
  </div>
</div>
