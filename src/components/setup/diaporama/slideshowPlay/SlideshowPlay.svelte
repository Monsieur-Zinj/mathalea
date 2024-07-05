<script lang="ts">
  import type { DataFromSettings, Slide, Slideshow } from '../types'
  import SlideshowPlayQuestion from './presentationalComponents/SlideshowPlayQuestion.svelte'
  import SlideshowPlaySettings from './presentationalComponents/slideshowPlaySettings/SlideshowPlaySettings.svelte'
  import SlideshowPlaySteps from './presentationalComponents/SlideshowPlaySteps.svelte'
  import SlideshowPlayEndButtons from './presentationalComponents/SlideshowPlayEndButtons.svelte'
  import { onDestroy, onMount, tick } from 'svelte'
  import { showDialogForLimitedTime } from '../../../../lib/components/dialogs'
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import { globalOptions } from '../../../../lib/stores/generalStore'

  export let slideshow: Slideshow
  export let dataFromSettings: DataFromSettings
  export let transitionSounds: Record<string, HTMLAudioElement>
  export let backToSettings: () => void

  const divQuestion: HTMLDivElement[] = []
  let formatQRCodeIndex: 0 | 1 | 2
  let isCorrectionVisible = false
  let isPause = false
  let isQuestionVisible = true
  let nbOfVues: 1 | 2 | 3 | 4
  let advanceRatioTimeInterval: number
  let QRCodeWidth: number
  let ratioTime = 0 // Pourcentage du temps écoulé (entre 1 et 100)
  let userZoom = 1
  let optimalZoom = 1

  let order: number[] = []
  $: {
    if (dataFromSettings) {
      const questionsNb = slideshow.selectedQuestionsNumber || slideshow.slides.length
      order = $globalOptions.order || [...Array(questionsNb).keys()]
      goToQuestion(slideshow.currentQuestion)
      formatQRCodeIndex = dataFromSettings.formatQRCodeIndex
      nbOfVues = $globalOptions.nbVues ?? 1
      QRCodeWidth = dataFromSettings.QRCodeWidth
    }
  }

  let currentSlide: Slide
  $: currentSlide = slideshow.slides[order[slideshow.currentQuestion]]

  let currentSlideDuration: number
  $: currentSlideDuration = $globalOptions.durationGlobal || currentSlide.exercise.duration || 10
  onMount(() => {
    window.addEventListener('click', handleClick)
  })

  onDestroy(() => {
    pause()
    window.removeEventListener('click', handleClick)
  })

function handleClick (event: MouseEvent) {
  const timerSettingsModal = document.getElementById('timer-settings-modal')
  if (timerSettingsModal && event.target === timerSettingsModal) {
    timerSettingsModal.style.display = 'none'
    if (!$globalOptions.manualMode) switchPause()
  }
}

  async function goToQuestion (questionNumber: number) {
    if (questionNumber >= -1 && questionNumber <= slideshow.selectedQuestionsNumber) slideshow.currentQuestion = questionNumber
    if (questionNumber === -1 || questionNumber === slideshow.selectedQuestionsNumber) pause()
    await tick()
    resizeAllViews()
    if (!$globalOptions.manualMode) {
      if (!isPause) {
        if ($globalOptions.sound !== undefined && $globalOptions.sound > 0) {
          transitionSounds[$globalOptions.sound - 1].play()
        }
        if ($globalOptions.screenBetweenSlides) await showDialogForLimitedTime('transition', 1000)
        play(true)
      }
    }
  }

  function play (resetRatioTime = false) {
    if (resetRatioTime) ratioTime = 0
    isPause = false
    clearInterval(advanceRatioTimeInterval)
    advanceRatioTimeInterval = window.setInterval(() => {
      ratioTime++
      if (ratioTime >= 100) {
        clearInterval(advanceRatioTimeInterval)
        nextQuestion()
      }
    }, currentSlideDuration * 10)
  }

  function pause () {
    clearInterval(advanceRatioTimeInterval)
    isPause = true
  }

  function switchPause () {
    if (isPause) play()
    else pause()
  }

  async function resizeAllViews (optimalZoomUpdate : boolean = true) {
    if (optimalZoomUpdate) {
      optimalZoom = findOptimalZoom()
    }
    for (let vueIndex = 0; vueIndex < nbOfVues; vueIndex++) {
      const exerciseContainerDiv = document.getElementById('exerciseContainer' + vueIndex)
      mathaleaRenderDiv(exerciseContainerDiv, optimalZoom * userZoom)
    }
  }

  function findOptimalZoom () {
    const optimalZoomForViews = new Array(nbOfVues).fill(0)
    for (let vueIndex = 0; vueIndex < nbOfVues; vueIndex++) {
      optimalZoomForViews[vueIndex] = findOptimalZoomForView(vueIndex)
    }
    return Math.min(...optimalZoomForViews)
  }

  function findOptimalZoomForView (vueIndex: number) {
    const MIN_ZOOM = 0.5
    const exerciseContainerDiv = document.getElementById('exerciseContainer' + vueIndex)
    const questionDiv = document.getElementById('question' + vueIndex)
    const correctionDiv = document.getElementById('correction' + vueIndex)
    if (!exerciseContainerDiv) return
    const svgContainers = exerciseContainerDiv.getElementsByClassName('svgContainer') ?? []
    for (const svgContainer of svgContainers) {
      svgContainer.classList.add('flex')
      svgContainer.classList.add('justify-center')
    }
    mathaleaRenderDiv(exerciseContainerDiv, 1)
    const { height: questionHeight, width: questionWidth } = getSizes(questionDiv)
    const { height: correctionHeight, width: correctionWidth } = getSizes(correctionDiv)
    const containerWidth = exerciseContainerDiv.clientWidth
    const containerHeight = exerciseContainerDiv.clientHeight
    const questionWidthOptimalZoom = containerWidth / questionWidth
    const correctionWidthOptimalZoom = containerWidth / correctionWidth
    const questionCorrectionHeightOptimalZoom = containerHeight / (questionHeight + correctionHeight)
    return Math.max(Math.min(questionWidthOptimalZoom, correctionWidthOptimalZoom, questionCorrectionHeightOptimalZoom), MIN_ZOOM)
  }

  function getSizes (element: HTMLElement | null) {
    if (element === null) {
      return { height: 0, width: 0 }
    } else {
      return {
        height: element.scrollHeight > element.clientHeight
          ? element.scrollHeight
          : element.clientHeight,
        width: element.scrollWidth > element.clientWidth
          ? element.scrollWidth
          : element.clientWidth
      }
    }
  }

  window.onresize = () => {
    resizeAllViews()
  }

  async function switchQuestionToCorrection () {
    if (isCorrectionVisible) {
      isCorrectionVisible = false
      isQuestionVisible = true
    } else {
      isCorrectionVisible = true
      isQuestionVisible = $globalOptions.flow !== undefined && $globalOptions.flow === 2
    }
    await tick()
    resizeAllViews()
  }

  function handleShortcut (e: KeyboardEvent) {
    if (e.key === '+' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      zoomPlus()
    }
    if (e.key === '-' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      zoomMinus()
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prevQuestion()
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      nextQuestion()
    }
    if (e.key === ' ') {
      e.preventDefault()
      if (!$globalOptions.manualMode) switchPause()
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      switchCorrectionMode()
    }
  }

  function prevQuestion () {
    if (slideshow.currentQuestion === 0) {
      pause()
      backToSettings()
      return
    }
    if ($globalOptions.flow !== undefined && $globalOptions.flow > 0) {
      if (isQuestionVisible) {
        if (slideshow.currentQuestion > -1) goToQuestion(slideshow.currentQuestion - 1)
      } else {
        switchQuestionToCorrection()
        switchPause()
        goToQuestion(slideshow.currentQuestion)
      }
    } else {
      if (slideshow.currentQuestion > -1) goToQuestion(slideshow.currentQuestion - 1)
    }
  }

  function nextQuestion () {
    if ($globalOptions.flow !== undefined && $globalOptions.flow > 0) {
      if (isQuestionVisible && !isCorrectionVisible) {
        switchPause()
        switchQuestionToCorrection()
        goToQuestion(slideshow.currentQuestion)
      } else {
        switchQuestionToCorrection()
        switchPause()
        if (slideshow.currentQuestion < slideshow.selectedQuestionsNumber) {
          goToQuestion(slideshow.currentQuestion + 1)
        }
      }
    } else {
      if (slideshow.currentQuestion < slideshow.selectedQuestionsNumber) {
        goToQuestion(slideshow.currentQuestion + 1)
      }
    }
  }

  function handleTimerChange (cursorTimeValue: number) {
    pause()
    const durationGlobal = cursorTimeValue || undefined
    $globalOptions.manualMode = !durationGlobal
    $globalOptions.durationGlobal = durationGlobal
  }

  function zoomPlus () {
    userZoom += 0.05
    resizeAllViews(false)
  }

  function zoomMinus () {
    if (userZoom > 0.5) {
      userZoom -= 0.05
    }
    resizeAllViews(false)
  }
  async function switchCorrectionMode () {
    if (isQuestionVisible && !isCorrectionVisible) {
      isQuestionVisible = false
      isCorrectionVisible = true
    } else if (isQuestionVisible && isCorrectionVisible) {
      isQuestionVisible = true
      isCorrectionVisible = false
    } else if (!isQuestionVisible && isCorrectionVisible) {
      isQuestionVisible = true
      isCorrectionVisible = true
    }
    await tick()
    resizeAllViews()
  }

  function returnToStart () {
    goToQuestion(0)
  }
</script>

<svelte:window on:keydown={handleShortcut} />

{#if slideshow.currentQuestion < slideshow.selectedQuestionsNumber && slideshow.currentQuestion > -1}
  <div
    id="diap"
    class="flex flex-col h-screen scrollbar-hide
      bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    data-theme="daisytheme"
  >
    <header class="flex flex-col pb-1 w-full
      bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    >
      <SlideshowPlaySteps
        currentQuestionNumber={slideshow.currentQuestion}
        isManualModeActive={$globalOptions.manualMode}
        totalQuestionsNumber={slideshow.selectedQuestionsNumber}
        {ratioTime}
        {currentSlideDuration}
        {goToQuestion}
      />
    </header>
    <main class="h-[80%]
      text-coopmaths-corpus dark:text-coopmathsdark-corpus
      bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    >
      <SlideshowPlayQuestion
        {divQuestion}
        {isQuestionVisible}
        {isCorrectionVisible}
        {currentSlide}
        currentQuestion={slideshow.currentQuestion}
        selectedQuestionsNumber={slideshow.selectedQuestionsNumber}
      />
    </main>
    <footer class="sticky flex flex-row justify-between w-full py-1 bottom-0 opacity-100
      bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    >
      <SlideshowPlaySettings
        flow={$globalOptions.flow}
        isManualModeActive={$globalOptions.manualMode}
        {isQuestionVisible}
        {isCorrectionVisible}
        {currentSlideDuration}
        {handleTimerChange}
        {backToSettings}
        {isPause}
        {prevQuestion}
        {nextQuestion}
        {pause}
        {switchCorrectionMode}
        {switchPause}
        {zoomPlus}
        {zoomMinus}
      />
    </footer>
  </div>
{:else}
  <div
    id="end"
    class="flex flex-col h-screen scrollbar-hide justify-center
      text-coopmaths-struct dark:text-coopmathsdark-struct
      bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    data-theme="daisytheme"
  >
    <div class="flex flex-row items-center justify-center w-full text-[300px] font-extrabold m-10">
      Fin !
    </div>
    <SlideshowPlayEndButtons
      {QRCodeWidth}
      {formatQRCodeIndex}
      {returnToStart}
      {backToSettings}
    />
  </div>
{/if}
