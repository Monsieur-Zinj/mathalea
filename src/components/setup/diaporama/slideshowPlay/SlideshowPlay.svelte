<script lang="ts">
  import type { Slide, Slideshow } from '../types'
  import SlideshowPlayQuestion from './presentationalComponents/slideshowPlayQuestion/SlideshowPlayQuestion.svelte'
  import SlideshowPlaySettings from './presentationalComponents/slideshowPlaySettings/SlideshowPlaySettings.svelte'
  import SlideshowPlaySteps from './presentationalComponents/SlideshowPlaySteps.svelte'
  import SlideshowPlayEndButtons from './presentationalComponents/SlideshowPlayEndButtons.svelte'
  import { onDestroy, tick } from 'svelte'
  import { showDialogForLimitedTime } from '../../../../lib/components/dialogs'
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import { globalOptions } from '../../../../lib/stores/generalStore'

  export let slideshow: Slideshow
  export let transitionSounds: Record<string, HTMLAudioElement>
  export let backToSettings: () => void
  export let goToOverview: () => void

  const divQuestion: HTMLDivElement[] = []
  const exercicesAffiches = new window.Event('exercicesAffiches', { bubbles: true })
  let isCorrectionVisible = false
  let isPause = false
  let isManualPause = false
  let isQuestionVisible = true
  let advanceRatioTimeInterval: number
  let ratioTime = 0 // Pourcentage du temps écoulé (entre 1 et 100)
  let userZoom = 1
  let optimalZoom = 1

  let flow: 'Q->Q' | 'Q->R->Q' | 'Q->(Q+R)->Q'
  $: {
    switch ($globalOptions.flow) {
      case 0:
        flow = 'Q->Q'
        break
      case 1:
        flow = 'Q->R->Q'
        break
      case 2:
        flow = 'Q->(Q+R)->Q'
        break
    }
  }

  let order: number[] = []
  $: {
    const questionsNb = slideshow.selectedQuestionsNumber || slideshow.slides.length
    order = $globalOptions.order || [...Array(questionsNb).keys()]
  }

  let nbVues: 1 | 2 | 3 | 4
  $: nbVues = $globalOptions.nbVues ?? 1

  let currentSlide: Slide
  $: currentSlide = slideshow.slides[order[slideshow.currentQuestion]]

  let currentSlideDuration: number
  $: currentSlideDuration = $globalOptions.durationGlobal || (currentSlide && currentSlide.exercise.duration) || 10

  $: if (slideshow.currentQuestion > -1) {
    playCurrentQuestion()
  }

  onDestroy(() => {
    pause()
  })

  function prevQuestion () {
    if (slideshow.currentQuestion === 0) {
      pause()
      backToSettings()
      return
    }
    if (isManualPause) {
      slideshow.currentQuestion--
      return
    }
    isQuestionVisible = true
    isCorrectionVisible = false
    ratioTime = 0
    slideshow.currentQuestion--
  }

  function nextQuestion () {
    if (isManualPause) {
      slideshow.currentQuestion++
      return
    }
    if (flow === 'Q->Q' || isCorrectionVisible) {
      isQuestionVisible = true
      isCorrectionVisible = false
      ratioTime = 0
      slideshow.currentQuestion++
      return
    }
    isQuestionVisible = flow === 'Q->(Q+R)->Q'
    isCorrectionVisible = true
    pause()
    renderAllViews()
  }

  async function playCurrentQuestion () {
    const isEndScreen = slideshow.currentQuestion === slideshow.selectedQuestionsNumber
    if (isEndScreen) {
      return
    }
    await renderAllViews()
    if (isManualPause) {
      ratioTime = 0
      return
    }
    if ($globalOptions.sound !== undefined && $globalOptions.sound > 0) {
      try {
        await transitionSounds[$globalOptions.sound - 1].play()
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            console.error('Audio playback was not allowed. Please interact with the page to enable audio.')
          } else {
            console.error('An error occurred while trying to play the audio:', error)
          }
        } else {
          console.error('An unknown error occurred:', error)
        }
      }
    }
    if ($globalOptions.screenBetweenSlides) await showDialogForLimitedTime('transition', 1000)
    play(false)
  }

  async function renderAllViews (optimalZoomUpdate : boolean = true) {
    if (optimalZoomUpdate) {
      optimalZoom = await findOptimalZoom()
    }
    for (let vueIndex = 0; vueIndex < nbVues; vueIndex++) {
      const exerciseContainerDiv = document.getElementById('exerciseContainer' + vueIndex)
      mathaleaRenderDiv(exerciseContainerDiv, optimalZoom * userZoom)
    }
    document.dispatchEvent(exercicesAffiches)
  }

  async function findOptimalZoom () {
    await tick()
    const optimalZoomForViews = new Array(nbVues).fill(0)
    for (let vueIndex = 0; vueIndex < nbVues; vueIndex++) {
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
      svgContainer.querySelectorAll<HTMLElement>('[id^="M2D"]').forEach((item) => {
        item.style.display = 'inline-block'
      })
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
    renderAllViews()
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
      switchPause(true)
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      switchDisplayMode()
    }
  }

  function handleTimerChange (cursorTimeValue: number) {
    const durationGlobal = cursorTimeValue || undefined
    $globalOptions.manualMode = !durationGlobal
    $globalOptions.durationGlobal = durationGlobal
    pause(true)
  }

  function zoomPlus () {
    userZoom += 0.05
    renderAllViews(false)
  }

  function zoomMinus () {
    if (userZoom > 0.5) {
      userZoom -= 0.05
    }
    renderAllViews(false)
  }
  async function switchDisplayMode () {
    pause()
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
    renderAllViews()
  }

  function play (isUserAction: boolean = false) {
    if (ratioTime >= 100) {
      nextQuestion()
    }
    if (isUserAction) isManualPause = false
    if (isManualPause) {
      return
    }
    isPause = false
    if (ratioTime === 0) { // Permet de ne pas sauter une question si la correction est affichée et qu'on se déplace en cliquant sur les steps
      isQuestionVisible = true
      isCorrectionVisible = false
      renderAllViews()
    }
    if ($globalOptions.manualMode) {
      return
    }
    if (isCorrectionVisible) {
      nextQuestion()
      return
    }
    clearInterval(advanceRatioTimeInterval)
    advanceRatioTimeInterval = window.setInterval(() => {
      ratioTime++
      if (ratioTime >= 100) {
        clearInterval(advanceRatioTimeInterval)
        if (!$globalOptions.pauseAfterEachQuestion) {
          nextQuestion()
        }
      }
    }, currentSlideDuration * 10)
  }

  function pause (isUserAction: boolean = false) {
    if ($globalOptions.manualMode) {
      return
    }
    clearInterval(advanceRatioTimeInterval)
    isPause = true
    if (isUserAction) isManualPause = true
  }

  function switchPause (isUserAction: boolean = false) {
    if ($globalOptions.manualMode) {
      return
    }
    if (isPause || ratioTime >= 100) {
      play(isUserAction)
    } else {
      pause(isUserAction)
    }
  }

  function goToQuestion (questionNumber: number) {
    if (questionNumber < 0 || questionNumber > slideshow.selectedQuestionsNumber) {
      return
    }
    slideshow.currentQuestion = questionNumber
    ratioTime = 0
  }

  function returnToStart () {
    isQuestionVisible = true
    isCorrectionVisible = false
    pause(true)
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
        isImagesOnSides={!!$globalOptions.isImagesOnSides}
      />
    </main>
    <footer class="sticky flex flex-row justify-between w-full py-1 bottom-0 opacity-100
      bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    >
      <SlideshowPlaySettings
        isManualModeActive={$globalOptions.manualMode}
        {isQuestionVisible}
        {isCorrectionVisible}
        {currentSlideDuration}
        {handleTimerChange}
        {backToSettings}
        {isPause}
        {prevQuestion}
        {nextQuestion}
        {switchDisplayMode}
        {switchPause}
        {play}
        {pause}
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
    <div class="flex flex-row items-center justify-center w-full text-[20vw] font-extrabold">
      Fin !
    </div>
    <SlideshowPlayEndButtons
      {returnToStart}
      {backToSettings}
      {goToOverview}
    />
  </div>
{/if}
