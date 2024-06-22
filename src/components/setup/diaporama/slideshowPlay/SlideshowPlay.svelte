<script lang="ts">
  import type { DataFromSettings } from '../types'
  import SlideshowSteps from './presentationalComponents/SlideshowPlaySteps.svelte'
  import SlideshowQuestion from './presentationalComponents/SlideshowPlayQuestion.svelte'
  import SlideshowPlaySettings from './presentationalComponents/SlideshowPlaySettings.svelte'
  import SlideshowPlayEndButtons from './presentationalComponents/SlideshowPlayEndButtons.svelte'
  import { onDestroy, tick } from 'svelte'
  import { showDialogForLimitedTime } from '../../../../lib/components/dialogs'
  import { updateFigures } from '../../../../lib/components/sizeTools'
  import { mathaleaHandleComponentChange, mathaleaRenderDiv } from '../../../../lib/mathalea'
  import { globalOptions } from '../../../../lib/stores/generalStore'

  export let consignes: string[][]
  export let corrections: string[][]
  export let currentDuration: number
  export let currentQuestion: number
  export let dataFromSettings: DataFromSettings
  export let durations: number[]
  export let handleChangeDurationGlobal: (durationGlobal: number | undefined) => void
  export let questions: string[][]
  export let transitionSounds: Record<string, HTMLAudioElement>
  export let updateExercises: () => void

  let currentZoom: number
  let displayCurrentCorrectionMode: () => string
  const divQuestion: HTMLDivElement[] = []
  let durationGlobal: number | undefined = $globalOptions.durationGlobal
  let formatQRCodeIndex: 0 | 1 | 2
  let isCorrectionVisible = false
  let isPause = false
  let isQuestionVisible = true
  let nbOfVues: 1 | 2 | 3 | 4
  let myInterval: number
  let QRCodeWidth: number
  let ratioTime = 0 // Pourcentage du temps écoulé (entre 1 et 100)
  let stepsUl: HTMLUListElement
  let userZoom = 1

  let order: number[] = []

  $: {
    if (dataFromSettings) {
      order = $globalOptions.order || [...Array(questions[0].length).keys()]
      goToQuestion(currentQuestion)
      formatQRCodeIndex = dataFromSettings.formatQRCodeIndex
      nbOfVues = $globalOptions.nbVues ?? 1
      QRCodeWidth = dataFromSettings.QRCodeWidth
    }
  }

  currentZoom = userZoom

  $: {
    if (stepsUl) {
      const steps = stepsUl.querySelectorAll('li')
      if (typeof steps !== 'undefined') {
        if (steps[currentQuestion]) steps[currentQuestion].scrollIntoView()
        if (steps[currentQuestion + 5]) {
          steps[currentQuestion + 5].scrollIntoView()
        }
        if (
          steps[currentQuestion - 5] &&
          !isInViewport(steps[currentQuestion - 5])
        ) {
          steps[currentQuestion - 5].scrollIntoView()
        }
      }
    }
  }

  onDestroy(() => {
    pause()
  })

  function isInViewport (element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  async function goToQuestion (questionNumber: number) {
    if (questionNumber >= -1 && questionNumber <= questions[0].length) currentQuestion = questionNumber
    if (questionNumber === -1 || questionNumber === questions[0].length) pause()
    await tick()
    for (let k = 0; k < nbOfVues; k++) {
      if (divQuestion[k]) {
        currentZoom = userZoom
        setSize()
      }
    }
    if (!$globalOptions.manualMode) {
      if (!isPause) {
        if ($globalOptions.sound !== undefined && $globalOptions.sound > 0) {
          transitionSounds[$globalOptions.sound - 1].play()
        }
        if ($globalOptions.screenBetweenSlides) {
          showDialogForLimitedTime('transition', 1000).then(() => {
            timer(durationGlobal || (durations[currentQuestion] || 10))
          })
        } else {
          timer(durationGlobal || (durations[currentQuestion] || 10))
        }
      }
    }
    currentDuration = durationGlobal || durations[currentQuestion] || 10
  }
  function timer (timeQuestion = 5, reset = true) {
    // timeQuestion est le temps de la question exprimé en secondes
    if (timeQuestion === 0) {
      pause()
      ratioTime = 0
    } else {
      if (reset) ratioTime = 0
      isPause = false
      clearInterval(myInterval)
      myInterval = window.setInterval(() => {
        ratioTime = ratioTime + 1 // ratioTime est le pourcentage du temps écoulé
        if (ratioTime >= 100) {
          clearInterval(myInterval)
          nextQuestion()
        }
      }, timeQuestion * 10)
    }
  }

  function switchPause () {
    if (!isPause) {
      pause()
    } else timer(durationGlobal || durations[currentQuestion] || 10, false)
  }

  function pause () {
    clearInterval(myInterval)
    isPause = true
  }
  /**
   * Déterminer les tailles optimales de la fonte et des illustrations dans chaque question.<br>
   * <u>Principe :</u>
   * <ul>
   *  <li> on récupère les dimensions carton (id='textcell...')</li>
   *  <li> on détermine la hauteur et la largeur optimale pour les figures (class='mathalea2d')</li>
   *  <li> on ajuste hauteur/largeur des figures en préservant le ratio</li>
   *  <li> on applique une taille de caractère volontairement grosse aux textes (consigne+question+correction)</li>
   *  <li> on réduit cette taille jsqu'à ce que la hauteur ne dépasse pas celle du container (id='textcell...')</li>
   * </ul>
   * @author sylvain
   */
  async function setSize (force : boolean = false) {
    const zoomByVues = Array.apply(null, Array(nbOfVues)).map(Number.prototype.valueOf, 0)
    for (let kk = 0; kk < 3; kk++) {
      // premiere passe : on selectionne le meilleur zoom par vue (size)
      // deuxième passe : on applique le zoom minimum des différentes vues
      // troisième passe : on applique le zoom de l'utilisateur
      const zoomMin = Math.min(...zoomByVues)
      if (force) { kk = 2 }
      for (let i = 0; i < nbOfVues; i++) {
        if (typeof divQuestion[i] !== 'undefined') {
          mathaleaRenderDiv(divQuestion[i], -1)
          const diapocellDiv = document.getElementById(
            'diapocell' + i
          ) as HTMLDivElement
          const textcellDiv = document.getElementById(
            'textcell' + i
          ) as HTMLDivElement
          const consigneDiv = document.getElementById(
            'consigne' + i
          ) as HTMLDivElement
          const questionDiv = document.getElementById(
            'question' + i
          ) as HTMLDivElement
          const correctionDiv = document.getElementById(
            'correction' + i
          ) as HTMLDivElement

          if (diapocellDiv === null) {
            // ca sert à rien de continuer
            continue
          }

          // Donner la bonne taille au texte
          let consigneHeight,
            correctionHeight,
            questionHeight,
            questionWidth,
            consigneWidth,
            correctionWidth: number

          let zoom = kk === 0 ? 10 : kk === 1 ? zoomMin : userZoom * currentZoom
          if (kk === 1) currentZoom = zoomMin
          const svgContainers = textcellDiv.getElementsByClassName('svgContainer')
          const textcellWidth = textcellDiv.clientWidth
          const textcellHeight = textcellDiv.clientHeight
          do {
            if (svgContainers.length > 0) {
              for (const svgContainer of svgContainers) {
                svgContainer.classList.add('flex')
                svgContainer.classList.add('justify-center')
                updateFigures(svgContainer as HTMLDivElement, zoom)
              }
            }
            if (zoom >= 1) textcellDiv.style.fontSize = `${zoom}rem`

            if (questionDiv !== null) {
              questionHeight = questionDiv.clientHeight
              questionWidth =
                questionDiv.scrollWidth > questionDiv.clientWidth
                  ? questionDiv.scrollWidth
                  : questionDiv.clientWidth
            } else {
              questionHeight = 0
              questionWidth = 0
            }
            if (consigneDiv !== null) {
              consigneHeight = consigneDiv.clientHeight
              consigneWidth = consigneDiv.clientWidth
            } else {
              consigneHeight = 0
              consigneWidth = 0
            }
            if (correctionDiv !== null) {
              correctionHeight = correctionDiv.clientHeight
              correctionWidth = correctionDiv.clientWidth
            } else {
              correctionHeight = 0
              correctionWidth = 0
            }

            if ((questionWidth > textcellWidth ||
                consigneWidth > textcellWidth ||
                correctionWidth > textcellWidth ||
                questionHeight + consigneHeight + correctionHeight > textcellHeight)) {
              zoom -= (zoom > 5 ? 0.5 : 0.2)
            }
          // eslint-disable-next-line no-unmodified-loop-condition
          } while (zoom > 0.6 && kk === 0 &&
              (questionWidth > textcellWidth ||
                consigneWidth > textcellWidth ||
                correctionWidth > textcellWidth ||
                questionHeight + consigneHeight + correctionHeight > textcellHeight)
          )
          zoomByVues[i] = zoom
        }
      }
    }
  }

  // pour recalculer les tailles lors d'un changement de dimension de la fenêtre
  window.onresize = () => {
    setSize()
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
    setSize()
  }

function handleShortcut (e: KeyboardEvent) {
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
    if (durationGlobal !== 0) switchPause()
  }
}

function prevQuestion () {
  if ($globalOptions.flow !== undefined && $globalOptions.flow > 0) {
    if (isQuestionVisible) {
      if (currentQuestion > -1) goToQuestion(currentQuestion - 1)
    } else {
      switchQuestionToCorrection()
      switchPause()
      goToQuestion(currentQuestion)
    }
  } else {
    if (currentQuestion > -1) goToQuestion(currentQuestion - 1)
  }
}

function nextQuestion () {
  if ($globalOptions.flow !== undefined && $globalOptions.flow > 0) {
    if (isQuestionVisible && !isCorrectionVisible) {
      switchPause()
      switchQuestionToCorrection()
      goToQuestion(currentQuestion)
    } else {
      switchQuestionToCorrection()
      switchPause()
      if (currentQuestion < questions[0].length) {
        goToQuestion(currentQuestion + 1)
      }
    }
  } else {
    if (currentQuestion < questions[0].length) {
      goToQuestion(currentQuestion + 1)
    }
  }
}

/**
 * Gestion du clic sur l'étape dans la progression
 * @param {number} index index de l'étape
 */
function clickOnStep (index: number) {
  goToQuestion(index)
}

/**
 * Gère la récupération de la valeur du curseur de temps
 */
function handleTimerChange (cursorTimeValue: number) {
  durationGlobal = 0
  pause()
  if (cursorTimeValue === 0) {
    globalOptions.update((l) => {
      l.manualMode = true
      return l
    })
    durationGlobal = undefined
  } else {
    globalOptions.update((l) => {
      l.manualMode = false
      return l
    })
    durationGlobal = cursorTimeValue
  }
  handleChangeDurationGlobal(durationGlobal)
  goToQuestion(currentQuestion)
}

function zoomPlus () {
  userZoom += 0.05
  setSize(true)
}

function zoomMoins () {
  if (userZoom > 0.5) {
    userZoom -= 0.05
  }
  setSize(true)
}
  async function switchCorrectionMode () {
    // isCorrectionVisible = !isCorrectionVisible
    if (isQuestionVisible && !isCorrectionVisible) {
      isCorrectionVisible = !isCorrectionVisible
    } else {
      if (isQuestionVisible && isCorrectionVisible) {
        isQuestionVisible = !isQuestionVisible
      } else {
        if (!isQuestionVisible && isCorrectionVisible) {
          isQuestionVisible = !isQuestionVisible
          isCorrectionVisible = !isCorrectionVisible
        }
      }
    }
    await tick()
    setSize()
  }

$: displayCurrentCorrectionMode = () => {
  let mode = ''
  if (isQuestionVisible && !isCorrectionVisible) {
    mode = 'Q'
  }
  if (isQuestionVisible && isCorrectionVisible) {
    mode = 'Q+C'
  }
  if (!isQuestionVisible && isCorrectionVisible) {
    mode = 'C'
  }
  return mode
}

function handleQuit () {
  mathaleaHandleComponentChange('diaporama', '')
  updateExercises()
}

/**
 * Pour le bouton de retour de la page de fin
 */
function returnToStart () {
  durationGlobal = 0
  pause()
  goToQuestion(0)
}
</script>

<svelte:window on:keyup={handleShortcut} />

{#if currentQuestion < questions[0].length}
  <div
    id="diap"
    class="flex flex-col h-screen scrollbar-hide bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    data-theme="daisytheme"
  >
    <SlideshowSteps
      isManualModeActive={$globalOptions.manualMode}
      currentQuestion={currentQuestion}
      questions={questions[0]}
      clickOnStep={clickOnStep}
      ratioTime={ratioTime}
      currentDuration={currentDuration}
      stepsUl={stepsUl}
    />
    <SlideshowQuestion
      {nbOfVues}
      {divQuestion}
      {consignes}
      {corrections}
      {questions}
      {order}
      {currentQuestion}
      {isQuestionVisible}
      {isCorrectionVisible}
    />
    <SlideshowPlaySettings
      {displayCurrentCorrectionMode}
      flow={$globalOptions.flow}
      isManualModeActive={$globalOptions.manualMode}
      {currentDuration}
      {handleTimerChange}
      {handleQuit}
      {isPause}
      {nextQuestion}
      {pause}
      {prevQuestion}
      {switchCorrectionMode}
      {switchPause}
      {zoomMoins}
      {zoomPlus}
    />
  </div>
{:else}
  <div
    id="end"
    class="flex flex-col h-screen scrollbar-hide justify-center text-coopmaths-struct dark:text-coopmathsdark-struct bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    data-theme="daisytheme"
  >
    <div class="flex flex-row items-center justify-center w-full text-[300px] font-extrabold m-10">
      Fin !
    </div>
    <SlideshowPlayEndButtons
      {QRCodeWidth}
      {formatQRCodeIndex}
      {returnToStart}
    />
  </div>
{/if}
