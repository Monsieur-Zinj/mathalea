<script lang="ts">
  import type Exercice from '../../../../exercices/Exercice'
  import type { InterfaceParams } from '../../../../lib/types'
  import type { Slideshow } from '../types'
  import BtnZoom from '../../../shared/ui/btnZoom.svelte'
  import SlideshowOverviewLeftPanel from './presentationalComponent/SlideshowOverviewLeftPanel.svelte'
  import SlideshowOverviewMainPanel from './presentationalComponent/SlideshowOverviewMainPanel.svelte'
  import { mathaleaGenerateSeed, mathaleaUpdateUrlFromExercicesParams } from '../../../../lib/mathalea'
  import { globalOptions, darkMode, exercicesParams } from '../../../../lib/stores/generalStore'

  export let exercises: Exercice[] = []
  export let slideshow: Slideshow
  export let updateExercises: () => void

  type Serie = {
    consignes: string[]
    questions: string[]
    corrections: string[]
  }
  let currentVue: 0 | 1 | 2 | 3 | 4 = 0
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

  async function setCorrectionVisible (correctionVisibility: boolean) {
    isCorrectionVisible = correctionVisibility
    if (!isCorrectionVisible) {
      setQuestionsVisible(true)
    }
  }

  function setCurrentVue (vue: 0 | 1 | 2 | 3 | 4) {
    currentVue = vue
  }

  async function setQuestionsVisible (questionsVisibility: boolean) {
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
</script>

<div class={$darkMode.isActive ? 'dark' : ''}>
  <div class="fixed z-20 bottom-2 lg:bottom-6 right-2 lg:right-6 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas rounded-b-full rounded-t-full bg-opacity-80">
    <div class="flex flex-col space-y-2 scale-75 lg:scale-100">
      <BtnZoom size="md" />
    </div>
  </div>
  <div class="flex bg-coopmaths-canvas dark:bg-coopmathsdark-canvas">
    <SlideshowOverviewLeftPanel
      {isQuestionsVisible}
      {isCorrectionVisible}
      {currentVue}
      {nbOfVues}
      {setCurrentVue}
      {setQuestionsVisible}
      {setCorrectionVisible}
      {handleCorrectionsStepsClick}
      {newDataForAll}
    />
    <SlideshowOverviewMainPanel
      {isQuestionsVisible}
      {isCorrectionVisible}
      {currentVue}
      {nbOfVues}
      {order}
      {series}
      {divExercice}
      {correctionsSteps}
      zoomStr={($globalOptions.z || 1).toString()}
    />
  </div>
</div>
