<script lang="ts">
  import type { DataFromSettings } from '../../../../lib/types/slideshow'
  import FullscreenButton from '../../start/presentationalComponents/header/headerButtons/setupButtons/FullscreenButton.svelte'
  import ModalActionWithDialog from '../../../shared/modal/ModalActionWithDialog.svelte'
  import ModalForQrCode from '../../../shared/modal/ModalForQRCode.svelte'
  import { onDestroy, onMount, tick } from 'svelte'
  import { copyLinkToClipboard } from '../../../../lib/components/clipboard'
  import { showDialogForLimitedTime } from '../../../../lib/components/dialogs'
  import { updateFigures } from '../../../../lib/components/sizeTools'
  import { setPhraseDuree } from '../../../../lib/components/time'
  import { buildMathAleaURL } from '../../../../lib/components/urls'
  import { mathaleaHandleComponentChange, mathaleaRenderDiv } from '../../../../lib/mathalea'
  import { globalOptions, questionsOrder, transitionsBetweenQuestions } from '../../../../lib/stores/generalStore'

  export let consignes: string[][]
  export let corrections: string[][]
  export let currentDuration: number
  export let currentQuestion: number
  export let dataFromSettings: DataFromSettings
  export let durations: number[]
  export let handleChangeDurationGlobal: (durationGlobal: number | undefined) => void
  export let questions: string[][]
  export let transitionSounds: Record<string, HTMLAudioElement>
  export let updateExercices: () => void

  let currentZoom: number
  let displayCurrentCorrectionMode: () => string
  let displayCurrentDuration: () => string
  const divQuestion: HTMLDivElement[] = []
  let durationGlobal: number | undefined = $globalOptions.durationGlobal
  let formatQRCodeIndex: 0 | 1 | 2
  let isCorrectionVisible = false
  let isManualModeActive: boolean
  let isPause = false
  let isQuestionVisible = true
  let messageDuree: string
  let nbOfVues: number
  let myInterval: number
  let QRCodeWidth: number
  let ratioTime = 0 // Pourcentage du temps écoulé (entre 1 et 100)
  let stepsUl: HTMLUListElement
  let userZoom = 1

  currentZoom = userZoom

  onMount(() => {
    applyDataFromSettings()
  })

  function applyDataFromSettings () {
    if (dataFromSettings) {
      goToQuestion(dataFromSettings.questionNumber)
      currentQuestion = dataFromSettings.currentQuestion
      formatQRCodeIndex = dataFromSettings.formatQRCodeIndex
      isManualModeActive = dataFromSettings.isManualModeActive
      nbOfVues = dataFromSettings.nbOfVues
      QRCodeWidth = dataFromSettings.QRCodeWidth
    }
  }
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
    if (!isManualModeActive) {
      if (!isPause) {
        if ($transitionsBetweenQuestions.isNoisy) {
          transitionSounds[$transitionsBetweenQuestions.tune].play()
        }
        if ($transitionsBetweenQuestions.isActive) {
          showDialogForLimitedTime('transition', 1000).then(() => {
            timer(durationGlobal ?? durations[currentQuestion] ?? 10)
          })
        } else {
          timer(durationGlobal ?? durations[currentQuestion] ?? 10)
        }
      }
    }
    currentDuration = durationGlobal ?? durations[currentQuestion] ?? 10
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
    } else timer(durationGlobal ?? durations[currentQuestion] ?? 10, false)
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
      isQuestionVisible =
        !!$transitionsBetweenQuestions.questThenQuestAndSolDisplay
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
  if ($transitionsBetweenQuestions.isQuestThenSolModeActive) {
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
  if ($transitionsBetweenQuestions.isQuestThenSolModeActive) {
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

let cursorTimeValue = 10
/**
 * Gère la récupération de la valeur du curseur de temps
 */
function handleTimerChange () {
  durationGlobal = 0
  pause()
  if (cursorTimeValue === 0) {
    isManualModeActive = true
    durationGlobal = undefined
  } else {
    isManualModeActive = false
    durationGlobal = cursorTimeValue
  }
  handleChangeDurationGlobal(durationGlobal)
  goToQuestion(currentQuestion)
}

$: messageDuree = setPhraseDuree(cursorTimeValue)

$: displayCurrentDuration = () => {
  return isManualModeActive ? 'Manuel' : currentDuration + 's'
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
  // $selectedExercises.isActive = false
  updateExercices()
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
<!-- Steps -->
<header
  class="flex flex-col h-[10%] bg-coopmaths-canvas dark:bg-coopmathsdark-canvas pb-1"
>
  <div
    class:invisible={isManualModeActive}
    class="flex flex-row flex-shrink-0 h-6 border border-coopmaths-warn dark:border-coopmathsdark-warn"
  >
    <div
      id="diapoProgressBar"
      class="bg-coopmaths-warn dark:bg-coopmathsdark-warn"
      style="width: {ratioTime}%; transition: width {currentDuration /
        100}s linear"
    />
  </div>
  <div class="flex flex-row h-full mt-6 w-full justify-center">
    <ul class="steps w-11/12" bind:this={stepsUl}>
      {#each [...questions[0].keys()] as i}
        <span
          on:click={() => clickOnStep(i)}
          on:keydown={() => clickOnStep(i)}
          role="button"
          tabindex="0"
        >
          <li
            class="step step-neutral dark:step-info {currentQuestion >= i
              ? 'step-primary'
              : ''} cursor-pointer"
          />
        </span>
      {/each}
    </ul>
  </div>
</header>
<!-- Question -->
<main
  class="bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas dark:text-coopmathsdark-corpus min-h-[80%] p-4"
>
  <div
    class="{nbOfVues > 1
      ? 'grid grid-cols-2 gap-4 auto-rows-fr'
      : 'grid grid-cols-1'} place-content-stretch justify-items-center w-full h-full"
  >
    {#each [...Array(nbOfVues).keys()] as i}
      <div
        id="diapocell{i}"
        class="relative min-h-[100%] max-h-[100%] flex flex-col justify-center justify-self-stretch place-items-stretch p-2 {nbOfVues >
        1
          ? 'bg-coopmaths-canvas-dark dark:bg-coopmathsdark-canvas-dark'
          : ''} text-center"
      >
        {#if nbOfVues > 1}
          <div
            class="absolute bg-coopmaths-struct text-coopmaths-canvas dark:bg-coopmathsdark-struct dark:text-coopmathsdark-canvas font-black text-4xl -top-1 -left-1 rounded-tl-2xl w-1/12 h-1/12"
          >
            {i + 1}
          </div>
        {/if}
        <div
          id="textcell{i}"
          bind:this={divQuestion[i]}
          class="flex flex-col justify-center items-center px-4 w-full min-h-[100%] max-h-[100%]"
        >
          {#if isQuestionVisible}
            <div class="font-light" id="consigne{i}">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html consignes[i][
                $questionsOrder.indexes[currentQuestion]
              ]}
            </div>
            <div class="py-4" id="question{i}">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html questions[i][
                $questionsOrder.indexes[currentQuestion]
              ]}
            </div>
          {/if}
          {#if isCorrectionVisible}
            <div
              id="correction{i}"
              class=" {isCorrectionVisible
                ? 'bg-coopmaths-warn-light bg-opacity-30 dark:bg-coopmathsdark-warn-light dark:bg-opacity-30 my-10'
                : ''}"
            >
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html corrections[i][
                $questionsOrder.indexes[currentQuestion]
              ]}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <dialog
    class="absolute top-0 left-0 h-full w-full bg-coopmaths-struct text-coopmaths-canvas dark:bg-coopmathsdark-struct dark:text-coopmathsdark-canvas text-[150px] font-extralight min-w-full min-h-full"
    id="transition"
  >
    <div
      class="flex w-full min-h-full h-full justify-center items-center"
    >
      <div
        class="radial-progress"
        style="--value:{((currentQuestion + 1) / questions[0].length) *
          100}; --size:500px; --thickness: 20px;"
      >
        {currentQuestion + 1} / {questions[0].length}
      </div>
    </div>
  </dialog>
</main>
<!-- Boutons de réglages -->
<footer
  class="w-full h-[10%] py-1 sticky bottom-0 opacity-100 bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
>
  <div class="flex flex-row justify-between w-full">
    <!-- boutons réglagles zoom -->
    <div class="flex flex-row justify-start ml-10 w-[33%] items-center">
     <FullscreenButton/>
      <button type="button" on:click={zoomPlus}>
        <i
          class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-plus"
        />
      </button>
      <button type="button" on:click={zoomMoins}>
        <i
          class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-minus"
        />
      </button>
    </div>
    <!-- boutons contrôle défilement -->
    <div class="flex flex-row justify-center w-[33%] items-center">
      <button type="button" on:click={prevQuestion}>
        <i
          class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-skip-previous"
        />
      </button>
      <button
        type="button"
        on:click={() => {
          if ($transitionsBetweenQuestions.isQuestThenSolModeActive) {
            nextQuestion()
          } else {
            switchPause()
          }
        }}
        class:invisible={isManualModeActive}
      >
        <i
          class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg
          {isPause ? 'bx-play' : 'bx-pause'}"
        />
      </button>
      <button type="button" on:click={nextQuestion}>
        <i
          class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-skip-next"
        />
      </button>
    </div>
    <!-- boutons timers correction quitter -->
    <div class="flex flex-row justify-end mr-10 w-[33%] items-center">
      <label for="timerSettings" class="modal-button">
        <i
          class="relative text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-stopwatch"
          on:click={pause}
          on:keydown={pause}
          role="button"
          tabindex="0"
        >
          <div
            class="absolute -bottom-[10px] left-1/2 -translate-x-1/2 text-sm font-sans text-coopmaths-struct dark:text-coopmathsdark-struct"
          >
            {displayCurrentDuration()}
          </div>
        </i>
      </label>
      <input
        type="checkbox"
        id="timerSettings"
        class="modal-toggle bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      />
      <div class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3
            class="font-bold text-lg text-coopmaths-struct dark:text-coopmathsdark-struct"
          >
            Temps par question
          </h3>
          <p
            class="py-4 text-coopmaths-corpus dark:text-coopmathsdark-corpus"
          >
            Régler la durée de projection en secondes
          </p>
          <div class="flew-row space-x-2">
            <div
              class="flex flex-row justify-start items-center space-x-2"
            >
              <input
                class="w-1/4 h-2 bg-transparent text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest cursor-pointer"
                type="range"
                max="30"
                min="0"
                name="duration"
                id="duration"
                bind:value={cursorTimeValue}
                on:change={handleTimerChange}
              />
              <label
                class="w-3/4 text-sm text-coopmaths-corpus"
                for="duration">{messageDuree}</label
              >
            </div>
          </div>
          <div class="modal-action">
            <label
              for="timerSettings"
              class="btn btn-neutral"
              on:click={switchPause}
              on:keydown={switchPause}
            >
              Fermer
            </label>
          </div>
        </div>
      </div>
      <div
        class={$transitionsBetweenQuestions.isQuestThenSolModeActive
          ? 'hidden'
          : 'block'}
      >
        <button type="button" on:click={switchCorrectionMode}>
          <i
            class="relative text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-show"
          >
            <div
              class="absolute -bottom-[8px] left-1/2 -translate-x-1/2 text-sm font-extrabold font-sans"
            >
              {displayCurrentCorrectionMode()}
            </div>
          </i>
        </button>
      </div>
      <button type="button" on:click={handleQuit} on:keydown={handleQuit}>
        <i
          class="text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest bx ml-2 bx-sm md:bx-lg bx-power-off"
        />
      </button>
    </div>
  </div>
</footer>
</div>
{:else}
<div
      id="end"
      class="flex flex-col h-screen scrollbar-hide justify-center text-coopmaths-struct dark:text-coopmathsdark-struct bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
      data-theme="daisytheme"
    >
      <div
        class="flex flex-row items-center justify-center w-full text-[300px] font-extrabold m-10"
      >
        Fin !
      </div>
      <div class="flex flex-row items-center justify-center w-full mx-10 my-4">
        <div
          class="tooltip tooltip-bottom tooltip-neutral"
          data-tip="Début du diaporama"
        >
          <button
            type="button"
            class="mx-12 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
            on:click={returnToStart}
            on:keydown={returnToStart}
          >
            <i class="bx text-[100px] bx-arrow-back" />
          </button>
        </div>
        <div
          class="tooltip tooltip-bottom tooltip-neutral"
          data-tip="Questions + Réponses"
        >
          <button
            type="button"
            class="mx-12 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
            on:click={() =>
              mathaleaHandleComponentChange('diaporama', 'overview')}
          >
            <i class="bx text-[100px] bx-detail" />
          </button>
        </div>
        <ModalActionWithDialog
          on:display={() => copyLinkToClipboard('linkCopiedDialog-2', buildMathAleaURL('diaporama'))}
          message="Le lien est copié dans le presse-papier !"
          dialogId="linkCopiedDialog-2"
          tooltipMessage="Lien du Diaporama"
          buttonSize="text-[100px]"
        />
        <ModalForQrCode
          dialogId="QRCodeModal-2"
          imageId="QRCodeCanvas-2"
          tooltipMessage="QR-code du diaporama"
          url={document.URL}
          width={QRCodeWidth}
          format={formatQRCodeIndex}
          buttonSize="text-[100px]"
          classForButton="mx-12 my-2"
        />
        <div
          class="tooltip tooltip-bottom tooltip-neutral text-bg-coopmaths-canvas"
          data-tip="Sortir du diaporama"
        >
          <button
            type="button"
            class="mx-12 my-2 text-coopmaths-action hover:text-coopmaths-action-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-lightest"
            on:click={() => mathaleaHandleComponentChange('diaporama', '')}
          >
            <i class="bx text-[100px] bx-home-alt-2" />
          </button>
        </div>
      </div>
    </div>
{/if}

<style>
  dialog::backdrop {
    backdrop-filter: blur(4px);
  }
</style>
