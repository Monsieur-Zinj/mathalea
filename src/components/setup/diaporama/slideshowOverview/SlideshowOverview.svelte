<script lang="ts">
  import type Exercice from '../../../../exercices/Exercice'
  import type { InterfaceParams } from '../../../../lib/types'
  import type { Serie, Slideshow } from '../types'
  import SlideshowOverviewLeftPanel from './presentationalComponent/SlideshowOverviewLeftPanel.svelte'
  import SlideshowOverviewMainPanel from './presentationalComponent/mainPanel/SlideshowOverviewMainPanel.svelte'
  import ZoomButtons from '../../start/presentationalComponents/header/headerButtons/setupButtons/ZoomButtons.svelte'
  import { tick } from 'svelte'
  import { mathaleaGenerateSeed, mathaleaRenderDiv, mathaleaUpdateUrlFromExercicesParams } from '../../../../lib/mathalea'
  import { globalOptions, darkMode, exercicesParams } from '../../../../lib/stores/generalStore'

  export let exercises: Exercice[] = []
  export let slideshow: Slideshow
  export let updateExercises: () => void
  export let handleQuit: () => void

  let currentSeriesIndex: 0 | 1 | 2 | 3 | 4 = 0
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

  $: if ((isQuestionsVisible || isCorrectionVisible || correctionsSteps.length > 0) && currentSeriesIndex !== undefined) {
    tick().then(() => mathaleaRenderDiv(divExercice))
  }

  function setCorrectionVisible (correctionVisibility: boolean) {
    isCorrectionVisible = correctionVisibility
    if (!isCorrectionVisible) {
      setQuestionsVisible(true)
    }
  }

  function setCurrentVue (vue: 0 | 1 | 2 | 3 | 4) {
    currentSeriesIndex = vue
  }

  function setQuestionsVisible (questionsVisibility: boolean) {
    isQuestionsVisible = questionsVisibility
    if (!isQuestionsVisible) {
      setCorrectionVisible(true)
    }
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
    isQuestionsVisible = true
    isCorrectionVisible = false
    correctionsSteps = []
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
  }

  function zoomUpdate (plusMinus: '+' | '-') {
    const z = Number($globalOptions.z || 1)
    const zoom = Number((plusMinus === '+' ? z + 0.1 : z - 0.1).toFixed(1))
    globalOptions.update((params) => {
      params.z = zoom.toString()
      return params
    })
    const main = document.querySelector('main')
    mathaleaRenderDiv(main, zoom)
    mathaleaUpdateUrlFromExercicesParams()
  }
</script>

<div class={$darkMode.isActive ? 'dark' : ''}>
  <div class="fixed z-20 bottom-2 lg:bottom-6 right-2 lg:right-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas rounded-b-full rounded-t-full bg-opacity-80">
    <div class="flex flex-col space-y-2 scale-75 lg:scale-100">
      <ZoomButtons {zoomUpdate}/>
    </div>
  </div>
  <div class="flex bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <aside class=" h-screen sticky top-0">
      <SlideshowOverviewLeftPanel
        {isQuestionsVisible}
        {isCorrectionVisible}
        currentVue={currentSeriesIndex}
        {nbOfVues}
        {setCurrentVue}
        {setQuestionsVisible}
        {setCorrectionVisible}
        {handleCorrectionsStepsClick}
        {newDataForAll}
        {handleQuit}
      />
    </aside>
    <main class="flex flex-row p-2
      bg-coopmaths-canvas dark:bg-coopmathsdark-canvas
      text-coopmaths-corpus dark:text-coopmathsdark-corpus"
      bind:this={divExercice}
    >
      <SlideshowOverviewMainPanel
        {isQuestionsVisible}
        {isCorrectionVisible}
        {currentSeriesIndex}
        {order}
        {series}
        {correctionsSteps}
      />
    </main>
  </div>
</div>
