<script lang="ts">
  import SlideshowOverviewSeries from './SlideshowOverviewSerie.svelte'
  import { tick } from 'svelte'
  import { mathaleaRenderDiv } from '../../../../../../lib/mathalea'

  export let isQuestionsVisible: boolean | undefined
  export let isCorrectionVisible: boolean | undefined
  export let currentSeriesIndex: number
  export let order: number[]
  export let series: { consignes: string[]; questions: string[]; corrections: string[] }[]
  export let divExercice: HTMLElement
  export let correctionsSteps: number[]
  export let zoomStr: string

  $: if (divExercice && (isQuestionsVisible || isCorrectionVisible || correctionsSteps.length > 0) && currentSeriesIndex !== undefined) {
    tick().then(() => mathaleaRenderDiv(divExercice))
  }

  let displayUniqueSeries = false
  $: displayUniqueSeries = currentSeriesIndex < 4

</script>

<main class="flex flex-row p-2
  bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
  text-coopmaths-corpus dark:text-coopmathsdark-corpus"
  bind:this={divExercice}
>
  {#if displayUniqueSeries}
    <SlideshowOverviewSeries
      {isQuestionsVisible}
      {isCorrectionVisible}
      seriesIndex={currentSeriesIndex}
      {order}
      {series}
      {correctionsSteps}
      {zoomStr}
  />
  {:else}
    {#each Array(series.length).keys() as seriesId}
      <SlideshowOverviewSeries
        {isQuestionsVisible}
        {isCorrectionVisible}
        seriesIndex={seriesId}
        {order}
        {series}
        {correctionsSteps}
        {zoomStr}
      />
    {/each}
  {/if}
</main>
