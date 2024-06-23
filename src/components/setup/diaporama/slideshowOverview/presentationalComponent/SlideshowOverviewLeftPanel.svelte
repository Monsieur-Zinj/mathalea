<script lang="ts">
  import { mathaleaHandleComponentChange } from '../../../../../lib/mathalea'

  export let isQuestionsVisible: boolean | undefined
  export let isCorrectionVisible: boolean | undefined
  export let currentVue: number | undefined
  export let nbOfVues: number
  export let setQuestionsVisible: (value: boolean) => void
  export let setCorrectionVisible: (value: boolean) => void
  export let updateDisplay: (e: Event) => void
  export let handleCorrectionsStepsClick: (button: 'backward' | 'forward') => void
  export let newDataForAll: () => void

</script>

<aside class=" h-screen sticky top-0">
  <div class="flex flex-col bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark text-coopmaths-struct dark:text-coopmathsdark-struct w-14 min-h-screen py-4 items-center">
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
