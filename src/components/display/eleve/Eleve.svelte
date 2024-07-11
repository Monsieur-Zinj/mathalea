<script lang="ts">
  import {
    mathaleaFormatExercice,
    // mathaleaHandleExerciceSimple,
    // mathaleaHandleParamOfOneExercice,
    // mathaleaLoadExerciceFromUuid,
    mathaleaRenderDiv,
    mathaleaUpdateExercicesParamsFromUrl,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../lib/mathalea'
  import {
    exercicesParams,
    darkMode,
    globalOptions,
    resultsByExercice,
    isMenuNeededForExercises,
    isMenuNeededForQuestions
  } from '../../../lib/stores/generalStore'
  import type TypeExercice from '../../../exercices/Exercice'
  import Exercice from '../../shared/exercice/Exercice.svelte'
  import { onDestroy, onMount, tick, afterUpdate } from 'svelte'
  // import seedrandom from 'seedrandom'
  import { loadMathLive } from '../../../modules/loaders'
  import ButtonText from '../../shared/forms/ButtonText.svelte'
  import { verifQuestionMathLive } from '../../../lib/interactif/mathLive'
  import { verifQuestionQcm } from '../../../lib/interactif/qcm'
  import { verifQuestionListeDeroulante } from '../../../lib/interactif/questionListeDeroulante'
  import ButtonToggle from '../../shared/forms/ButtonToggle.svelte'
  import { verifQuestionCliqueFigure } from '../../../lib/interactif/cliqueFigure'
  import { prepareExerciceCliqueFigure } from '../../../lib/interactif/gestionInteractif'
  import BtnZoom from '../../shared/ui/btnZoom.svelte'
  import { getCanvasFont, getTextWidth, remToPixels } from '../../../lib/components/measures'
  import Footer2 from './Footer2.svelte'
  import FlipCard from './FlipCard.svelte'
  import Keyboard from '../../keyboard/Keyboard.svelte'
  import { keyboardState } from '../../keyboard/stores/keyboardStore'
  import { buildExercisesList, splitExercisesIntoQuestions } from '../../../lib/components/exercisesUtils'

  let currentIndex: number = 0
  let exercices: TypeExercice[] = []
  let questions: string[] = []
  let consignes: string[] = []
  let corrections: string[] = []
  let consignesCorrections: string[] = []
  let indiceExercice: number[] = []
  let indiceQuestionInExercice: number[] = []
  const resultsByQuestion: boolean[] = []
  const isDisabledButton: boolean[] = []
  let isCorrectionVisible: boolean[] = []
  const divsCorrection: HTMLDivElement[] = []
  let currentWindowWidth: number = document.body.clientWidth
  let eleveSection: HTMLElement

  function urlToDisplay () {
    const urlOptions = mathaleaUpdateExercicesParamsFromUrl()
    globalOptions.update(() => {
      urlOptions.v = 'eleve'
      return urlOptions
    })
  }

  /**
   * Adaptation du titre des pages pour chaque exercice
   * Plus le nombre d'exercices est élevé, moins le titre contient de caractères
   * @param {numer} dim largeur disponible à considérer pour le calcul si élément non dispo (déclenche le re-calcul)
   * @param {number} nbOfExercises  nombre d'exercices
   * @returns {string} titre
   * @author sylvain
   */
  function buildExoTitle (dim: number, nbOfExercises: number) {
    // if ($globalOptions.title.length === 0) {
    //   $isMenuNeededForExercises = false
    //   return ""
    // }
    const navigationHeaderElt = document.getElementById('navigationHeaderID')
    const exerciseTitleElt = document.getElementById('exerciseTitleID0')
    // soit l'élément existe et on récupère sa vraie largeur, soit on calcule une valeur approchée
    const roomForQuestionsTitles = navigationHeaderElt
      ? navigationHeaderElt.offsetWidth
      : ((dim - 2 * remToPixels(1)) * 11) / 12
    const roomForOne =
      roomForQuestionsTitles / nbOfExercises - 2 * remToPixels(1.5)
    if (
      roomForOne >=
      getTextWidth(
        'Exercice 10',
        getCanvasFont(exerciseTitleElt ?? document.body)
      )
    ) {
      $isMenuNeededForExercises = false
      return 'Exercice'
    } else if (
      roomForOne >=
      getTextWidth('Ex 10', getCanvasFont(exerciseTitleElt ?? document.body)) +
        20
    ) {
      $isMenuNeededForExercises = false
      return 'Ex'
    } else if (
      roomForOne >=
      getTextWidth('10', getCanvasFont(exerciseTitleElt ?? document.body)) + 20
    ) {
      $isMenuNeededForExercises = false
      return ''
    } else {
      $isMenuNeededForExercises = true
      return ''
    }
  }
  $: exerciseTitle = buildExoTitle(currentWindowWidth, exercices.length)

  /**
   * Adaptation du titre des pages pour chaque question
   * Plus le nombre de questions est élevé, moins le titre contient de caractères
   * @param {numer} dim largeur disponible à considérer pour le calcul si élément non dispo (déclenche le re-calcul)
   * @param {number} nbOfQuestions  nombre de questions
   * @returns {string} titre
   * @author sylvain
   */
  function buildQuestionTitle (dim: number, nbOfQuestions: number) {
    const navigationHeaderElt = document.getElementById('navigationHeaderID')
    const questionTitleElt = document.getElementById('questionTitleID0')
    // soit l'élément existe et on récupère sa vraie largeur, soit on calcule une valeur approchée
    const roomForQuestionsTitles = navigationHeaderElt
      ? navigationHeaderElt.offsetWidth
      : ((dim - 2 * remToPixels(1)) * 11) / 12
    const roomForOne =
      roomForQuestionsTitles / nbOfQuestions - 2 * remToPixels(0.5)
    if (
      roomForOne >=
      getTextWidth(
        'Question 10',
        getCanvasFont(questionTitleElt ?? document.body)
      )
    ) {
      $isMenuNeededForQuestions = false
      return 'Question'
    } else if (
      roomForOne >=
      getTextWidth('Q 10', getCanvasFont(questionTitleElt ?? document.body)) +
        20
    ) {
      $isMenuNeededForQuestions = false
      return 'Q'
    } else if (
      roomForOne >=
      getTextWidth('10', getCanvasFont(questionTitleElt ?? document.body)) + 20
    ) {
      $isMenuNeededForQuestions = false
      return ''
    } else {
      $isMenuNeededForQuestions = true
      return ''
    }
  }

  afterUpdate(() => {
    // Evènement indispensable pour pointCliquable par exemple
    const exercicesAffiches = new window.Event('exercicesAffiches', {
      bubbles: true
    })
    document.dispatchEvent(exercicesAffiches)
  })

  $: questionTitle = buildQuestionTitle(currentWindowWidth, questions.length)
  let resizeObserver: ResizeObserver
  onMount(async () => {
    // Si presMode est undefined cela signifie que l'on charge cet url
    // sinon en venant du modal il existerait
    if ($globalOptions.presMode === undefined) {
      const urlOptions = mathaleaUpdateExercicesParamsFromUrl()
      urlOptions.v = 'eleve'
      globalOptions.update(() => {
        return urlOptions
      })
      urlToDisplay()
    } else {
      // Si ce n'est pas un chargement d'url alors il faut initialiser le store des résultats
      resultsByExercice.update(() => [])
    }
    if ($globalOptions.setInteractive === '1') {
      for (const param of $exercicesParams) {
        param.interactif = '1'
      }
    }
    // for (const paramsExercice of $exercicesParams) {
    //   const exercice: TypeExercice = await mathaleaLoadExerciceFromUuid(
    //     paramsExercice.uuid
    //   )
    //   if (typeof exercice === 'undefined') return
    //   mathaleaHandleParamOfOneExercice(exercice, paramsExercice)
    //   if ($globalOptions.setInteractive === '1' && exercice?.interactifReady) {
    //     exercice.interactif = true
    //   }
    //   exercices.push(exercice)
    // }
    exercices = await Promise.all(buildExercisesList())

    if ($globalOptions.presMode === 'liste_questions' || $globalOptions.presMode === 'une_question_par_page') {
      buildQuestions()
    } else {
      await tick()
    }

    if ($globalOptions.recorder === 'capytale' || $globalOptions.recorder === 'moodle' || $globalOptions.recorder === 'anki' || $globalOptions.recorder === 'labomep') {
      /*
      Ce code est nécessaire seulement si coopmaths est intégré dans un autre site pour permettre de redimensionner la fenêtre
      */
      resizeObserver = new ResizeObserver(x => {
        const url = new URL(window.location.href)
        const iframe = url.searchParams.get('iframe')
        window.parent.postMessage(
          {
            hauteurExercice: x[0].contentRect.height,
            action: 'mathalea:resize',
            iframe
          },
          '*'
        )
        // ou x[0].contentRect.height ou x[0].contentBoxSize[0].blockSize ou x[0].borderBoxSize[0].inlineSize ou x[0].target.scrollHeight
      })
      if (eleveSection != null) resizeObserver.observe(eleveSection)
    }

    if ($globalOptions.recorder === 'capytale') {
      $globalOptions.isInteractiveFree = false
    }
  })

  onDestroy(() => {
    if (resizeObserver) resizeObserver.disconnect()
  })

  async function buildQuestions () {
    const splitResults = splitExercisesIntoQuestions(exercices)
    questions = [...splitResults.questions]
    consignes = [...splitResults.consignes]
    corrections = [...splitResults.corrections]
    consignesCorrections = [...splitResults.consignesCorrections]
    isCorrectionVisible = [...splitResults.isCorrectionVisible]
    indiceExercice = [...splitResults.indiceExercice]
    indiceQuestionInExercice = [...splitResults.indiceQuestionInExercice]
    if (
      $globalOptions.presMode === 'liste_questions' ||
      $globalOptions.presMode === 'une_question_par_page'
      // || $globalOptions.presMode === 'cartes'
    ) {
      // Pour les autres mode de présentation, cela est géré par ExerciceMathaleaVueProf
      mathaleaUpdateUrlFromExercicesParams($exercicesParams)
      await tick()
      const body = document.querySelector<HTMLElement>('body')
      if (body) {
        mathaleaRenderDiv(body)
      }
      loadMathLive()
    }
    const section = document.querySelector('section') as HTMLElement
    const hauteurExercice = section.scrollHeight
    const url = new URL(window.location.href)
    const iframe = url.searchParams.get('iframe')
    window.parent.postMessage(
      {
        hauteurExercice,
        exercicesParams: $exercicesParams,
        action: 'mathalea:init',
        iframe
      },
      '*'
    )
  }

  async function checkQuestion (i: number) {
    // ToFix exercices custom avec pointsCliquable
    const exercice = exercices[indiceExercice[i]]
    let type = exercice.autoCorrection[indiceQuestionInExercice[i]]?.reponse?.param?.formatInteractif
    if (type === undefined || type === null) {
      type = exercice.interactifType
    }
    if (type == null) { // @fixme on ne devrait jamais arriver ici pour un exercice non interactif !
      window.notify('checkQuestion a été appelé pour un exercice non interactif', { exercice: exercice.uuid })
      resultsByQuestion[i] = false
      return
    }
    if (type.toLowerCase() === 'mathlive') {
      resultsByQuestion[i] =
        verifQuestionMathLive(
          exercices[indiceExercice[i]],
          indiceQuestionInExercice[i]
        )?.isOk
    } else if (type === 'qcm') {
      resultsByQuestion[i] =
        verifQuestionQcm(
          exercices[indiceExercice[i]],
          indiceQuestionInExercice[i]
        ) === 'OK'
    } else if (type === 'listeDeroulante') {
      resultsByQuestion[i] =
        verifQuestionListeDeroulante(
          exercices[indiceExercice[i]],
          indiceQuestionInExercice[i]
        ) === 'OK'
    } else if (type === 'cliqueFigure') {
      resultsByQuestion[i] =
        verifQuestionCliqueFigure(
          exercices[indiceExercice[i]],
          indiceQuestionInExercice[i]
        ) === 'OK'
    } else if (type === 'custom') {
      // si le typ est `custom` on est sûr que `correctionInteractive` existe
      // d'où le ! après `correctionInteractive`
      resultsByQuestion[i] =
        exercices[indiceExercice[i]].correctionInteractive!(indiceQuestionInExercice[i]) === 'OK'
    }
    isDisabledButton[i] = true
    isCorrectionVisible[i] = true
    await tick()
    const feedback = document.querySelector<HTMLElement>(`#feedbackEx${indiceExercice[i]}Q${indiceQuestionInExercice[i]}`)
    // nécessaire pour le feedback
    if (feedback !== null && feedback !== undefined) mathaleaRenderDiv(feedback)
    mathaleaRenderDiv(divsCorrection[i])
  }

  async function switchCorrectionVisible (i: number) {
    isCorrectionVisible[i] = !isCorrectionVisible[i]
    if (isCorrectionVisible[i]) {
      await tick()
      mathaleaRenderDiv(divsCorrection[i])
    }
  }

  function handleIndexChange (exoNum: number) {
    currentIndex = exoNum
    if (
      exercices[exoNum] &&
      exercices[exoNum].interactifType === 'cliqueFigure' &&
      exercices[exoNum].interactif
    ) {
      prepareExerciceCliqueFigure(exercices[exoNum])
    }
  }
</script>

<svelte:window bind:innerWidth={currentWindowWidth} />
<section
  bind:this={eleveSection}
  class="relative flex flex-col min-h-screen min-w-screen bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-corpus dark:text-coopmathsdark-corpus {$darkMode.isActive
    ? 'dark'
    : ''}"
>
  <div
    class="fixed z-20 h-16 bottom-4 right-2 {(typeof $globalOptions.title ===
      'string' &&
      $globalOptions.title.length === 0 &&
      ($globalOptions.presMode === 'liste_exos' ||
        $globalOptions.presMode === 'liste_questions')) ||
    ($globalOptions.title != null && $globalOptions.title.length > 0)
      ? 'lg:top-8'
      : 'lg:top-20'}  lg:right-6"
  >
    <div
      class="flex flex-col-reverse lg:flex-row space-y-reverse space-y-4 lg:space-y-0 lg:space-x-4 scale-75 lg:scale-100"
    >
      <BtnZoom
        size="bx-sm md:bx-md"
        isBorderTransparent={typeof $globalOptions.title === 'string' &&
          $globalOptions.title.length > 0}
      />
    </div>
  </div>
  <div class="mb-auto">
    <div
      class="{typeof $globalOptions.title === 'string' &&
      $globalOptions.title.length === 0 &&
      ($globalOptions.presMode === 'liste_exos' ||
        $globalOptions.presMode === 'liste_questions')
        ? 'hidden'
        : 'h-[10%]'}  w-full flex flex-col justify-center items-center"
    >
      <!-- titre de la feuille -->
      {#if typeof $globalOptions.title === 'string' && $globalOptions.title.length > 0}
        <div
          class="w-full p-8 text-center text-4xl font-light {$globalOptions.recorder ===
          'capytale'
            ? 'bg-black'
            : 'bg-coopmaths-struct'} dark:bg-coopmathsdark-struct text-coopmaths-canvas dark:text-coopmathsdark-canvas"
        >
          {$globalOptions.title}
        </div>
      {/if}
      <!-- barre de navigation -->
      <div
        id="navigationHeaderID"
        class="grid justify-items-center w-full mt-4 mb-8 grid-cols-{$globalOptions.presMode ===
        'un_exo_par_page'
          ? exercices.length
          : questions.length}
          {($globalOptions.presMode === 'un_exo_par_page' &&
          !$isMenuNeededForExercises) ||
        ($globalOptions.presMode === 'une_question_par_page' &&
          !$isMenuNeededForQuestions)
            ? 'border-b-2 border-coopmaths-struct'
            : 'border-b-0'}
              bg-coopmaths-canvas dark:bg-coopmathsdark-canvas text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        {#if $globalOptions.presMode === 'un_exo_par_page' && !$isMenuNeededForExercises}
          {#each $exercicesParams as paramsExercice, i (paramsExercice)}
            <div class="">
              <button
                class="relative group {currentIndex === i
                  ? 'border-b-4'
                  : 'border-b-0'} border-coopmaths-struct dark:border-coopmathsdark-struct text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                disabled={currentIndex === i}
                on:click={() => handleIndexChange(i)}
              >
                <div
                  id="exerciseTitleID{i}"
                  class="pt-2 pb-4 px-6 text-xl font-light"
                >
                  {exerciseTitle}
                  {i + 1}
                  {#if $resultsByExercice[i] !== undefined}
                    <div
                      style="--nbPoints:{$resultsByExercice[i]
                        .numberOfPoints}; --nbQuestions:{$resultsByExercice[i]
                          .numberOfQuestions};"
                      class="absolute bottom-0 left-0 right-0 mx-auto text-xs font-bold progressbar dark:progressbardark text-coopmaths-canvas dark:text-coopmathsdark-canvas"
                    >
                      {$resultsByExercice[i].numberOfPoints +
                        '/' +
                        $resultsByExercice[i].numberOfQuestions}
                    </div>
                  {/if}
                </div>
                <span
                  class="absolute -bottom-1 left-1/2 w-0 h-1 bg-coopmaths-struct group-hover:w-1/2 group-hover:transition-all duration-300 ease-out group-hover:ease-in group-hover:duration-300"
                />
                <span
                  class="absolute -bottom-1 right-1/2 w-0 h-1 bg-coopmaths-struct group-hover:w-1/2 group-hover:transition-all duration-300 ease-out group-hover:ease-in group-hover:duration-300"
                />
              </button>
            </div>
          {/each}
        {/if}
        {#if $globalOptions.presMode === 'une_question_par_page' && !$isMenuNeededForQuestions}
          {#each questions as question, i (i + '_' + question)}
            <div class="">
              <button
                class="relative group {currentIndex === i
                  ? 'border-b-4'
                  : 'border-b-0'} border-coopmaths-struct dark:border-coopmathsdark-struct text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                disabled={currentIndex === i}
                on:click={() => handleIndexChange(i)}
              >
                <div
                  id="questionTitleID{i}"
                  class="py-2 px-2 text-xl font-light"
                >
                  {questionTitle}
                  {i + 1}
                  <div
                    class="absolute left-0 right-0 mx-auto bottom-1 h-2 w-2 rounded-full bg-coopmaths-warn
                      {resultsByQuestion[i] === true ? '' : 'invisible'}"
                  />
                  <div
                    class="absolute left-0 right-0 mx-auto bottom-1 h-2 w-2 rounded-full bg-red-600
                      {resultsByQuestion[i] === false ? '' : 'invisible'}"
                  />
                </div>
                <span
                  class="absolute -bottom-1 left-1/2 w-0 h-1 bg-coopmaths-struct group-hover:w-1/2 group-hover:transition-all duration-300 ease-out group-hover:ease-in group-hover:duration-300"
                />
                <span
                  class="absolute -bottom-1 right-1/2 w-0 h-1 bg-coopmaths-struct group-hover:w-1/2 group-hover:transition-all duration-300 ease-out group-hover:ease-in group-hover:duration-300"
                />
              </button>
            </div>
          {/each}
        {/if}
      </div>
    </div>
    <!-- Exercices -->
    <div class="px-2 lg:px-8">
      {#if $globalOptions.presMode === 'un_exo_par_page'}
        {#each $exercicesParams as paramsExercice, i (paramsExercice)}
          <div class="flex flex-col">
            <div class={$isMenuNeededForExercises ? '' : 'hidden'}>
              <button
                class="w-full {currentIndex === i
                  ? 'bg-coopmaths-canvas-darkest'
                  : 'bg-coopmaths-canvas-dark'} hover:bg-coopmaths-canvas-darkest text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                disabled={currentIndex === i}
                on:click={() => handleIndexChange(i)}
              >
                <div
                  id="exerciseTitleID2{i}"
                  class="flex flex-row items-center justify-center py-3 px-2 text-2xl font-bold"
                >
                  Exercice {i + 1}
                  {#if $resultsByExercice[i] !== undefined}
                    <div
                      class="ml-4 text-sm font-bold text-coopmaths-warn-dark dark:text-coopmathsdark-warn-dark"
                    >
                      {$resultsByExercice[i].numberOfPoints +
                        '/' +
                        $resultsByExercice[i].numberOfQuestions}
                    </div>
                  {:else}
                    <div class="ml-4 text-sm font-bold invisible">8/8</div>
                  {/if}
                </div>
              </button>
            </div>
            <div class={currentIndex === i ? '' : 'hidden'}>
              <Exercice
                {paramsExercice}
                indiceExercice={i}
                indiceLastExercice={$exercicesParams.length - 1}
                isCorrectionVisible={isCorrectionVisible[i]}
              />
            </div>
          </div>
        {/each}
      {:else if $globalOptions.presMode === 'liste_exos'}
        <div
          id="exercises-list"
          class="p-4 columns-1 {$globalOptions.twoColumns
            ? 'md:columns-2'
            : ''}"
        >
          {#each $exercicesParams as paramsExercice, i (paramsExercice)}
            <div class="break-inside-avoid-column">
              <Exercice
                {paramsExercice}
                indiceExercice={i}
                indiceLastExercice={$exercicesParams.length - 1}
                isCorrectionVisible={isCorrectionVisible[i]}
              />
            </div>
          {/each}
        </div>
      {:else if $globalOptions.presMode === 'recto' || $globalOptions.presMode === 'verso'}
        <div id="exercises-list" class="p-4 columns-1 {$globalOptions.twoColumns ? 'md:columns-2' : ''}">
          {#each $exercicesParams as paramsExercice, i (paramsExercice)}
            <div class="break-inside-avoid-column">
              <Exercice {paramsExercice} indiceExercice={i} indiceLastExercice={$exercicesParams.length - 1} isCorrectionVisible={$globalOptions.presMode === 'verso'} />
            </div>
          {/each}
        </div>
      {:else if $globalOptions.presMode === 'liste_questions'}
        <div
          class="columns-1 {$globalOptions.title.length === 0
            ? 'mt-6'
            : ''} {$globalOptions.twoColumns ? 'md:columns-2' : ''}"
        >
          {#each questions as question, k (k + '_' + question)}
            <div
              class="pb-4 flex flex-col items-start justify-start relative break-inside-avoid-column"
              id={`exercice${indiceExercice[k]}Q${k}`}
            >
              <div class="flex flex-row justify-start items-center">
                <div class="text-coopmaths-struct font-bold text-md">
                  Question {k + 1}
                </div>
                {#if exercices[indiceExercice[k]].interactif}
                  <ButtonText
                    text="Vérifier"
                    class="p-1 font-bold rounded-lg text-xs ml-2"
                    on:click={() => checkQuestion(k)}
                    disabled={isDisabledButton[k]}
                  />
                {:else if $globalOptions.isSolutionAccessible}
                  <ButtonToggle
                    titles={['Voir la correction', 'Masquer la correction']}
                    classAddenda="ml-4"
                    on:toggle={() => switchCorrectionVisible(k)}
                  />
                {/if}
              </div>
              <div
                class="container grid grid-cols-1 {$globalOptions.twoColumns
                  ? ''
                  : 'lg:grid-cols-2'} gap-4 lg:gap-10"
                style="font-size: {($globalOptions.z || 1).toString()}rem"
              >
                <div class="flex flex-col my-2 py-2">
                  <div class="text-coopmaths-corpus pl-2 pb-2">
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html consignes[k]}
                  </div>
                  <div class="text-coopmaths-corpus pl-2 pb-2">
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html question}
                  </div>
                </div>
                {#if isCorrectionVisible[k]}
                  <div
                    class="relative border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus mt-2 mb-6 py-2 pl-4"
                    style="break-inside:avoid"
                    bind:this={divsCorrection[k]}
                  >
                    {#if consignesCorrections[k].length !== 0}
                      <div
                        class="container bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark px-4 py-2 mr-2 ml-6 mb-2 font-light relative w-2/3"
                      >
                        <div class="container absolute top-4 -left-4">
                          <i
                            class="bx bx-bulb scale-200 text-coopmaths-warn-dark dark:text-coopmathsdark-warn-dark"
                          />
                        </div>
                        <div class="">
                          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                          {@html consignesCorrections[k]}
                        </div>
                      </div>
                    {/if}

                    <div
                      class="container overflow-x-auto overflow-y-hidden md:overflow-x-auto"
                      style="break-inside:avoid"
                    >
                      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                      {@html mathaleaFormatExercice(corrections[k])}
                    </div>
                    <!-- <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct top-0 left-0 border-b-[3px] w-10" /> -->
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
          {/each}
        </div>
      {:else if $globalOptions.presMode === 'une_question_par_page'}
        {#each questions as question, k (k + '_' + question)}
          <div class="flex flex-col">
            <div class={$isMenuNeededForQuestions ? '' : 'hidden'}>
              <button
                class="group w-full {currentIndex === k
                  ? 'bg-coopmaths-canvas-darkest'
                  : 'bg-coopmaths-canvas-dark'} hover:bg-coopmaths-canvas-darkest text-coopmaths-action hover:text-coopmaths-lightest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-lightest"
                disabled={currentIndex === k}
                on:click={() => handleIndexChange(k)}
              >
                <div
                  id="questionTitleID2{k}"
                  class="flex flex-row items-center justify-center py-3 px-2 text-xl font-bold"
                >
                  Question {k + 1}
                  <div
                    class="relative ml-2 h-2 w-2 rounded-full {currentIndex ===
                    k
                      ? 'bg-coopmaths-canvas-darkest'
                      : 'bg-coopmaths-canvas-dark'} group-hover:bg-coopmaths-canvas-darkest"
                  >
                    <div
                      class="absolute h-2 w-2 rounded-full bg-coopmaths-warn {resultsByQuestion[
                        k
                      ] === true
                        ? ''
                        : 'hidden'}"
                    />
                    <div
                      class="absolute h-2 w-2 rounded-full bg-red-600 {resultsByQuestion[
                        k
                      ] === false
                        ? ''
                        : 'hidden'}"
                    />
                  </div>
                </div>
              </button>
            </div>
            <div
              class={currentIndex === k ? '' : 'hidden'}
              id={`exercice${indiceExercice[k]}Q${k}`}
            >
              <div
                class="pb-4 flex flex-col items-start justify-start relative {isMenuNeededForQuestions
                  ? 'lg:mt-2'
                  : ''}"
              >
                <div
                  class="container grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10"
                  style="font-size: {($globalOptions.z || 1).toString()}rem"
                >
                  <div class="flex flex-col my-2 py-2">
                    <div class="text-coopmaths-corpus pl-2">
                      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                      {@html consignes[k]}
                    </div>
                    <div class="text-coopmaths-corpus pl-2">
                      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                      {@html question}
                    </div>
                  </div>
                  {#if isCorrectionVisible[k]}
                    <div
                      class="relative border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus mt-2 lg:{$isMenuNeededForQuestions
                        ? 'mt-6'
                        : 'mt-2'} mb-6 py-2 pl-4"
                      style="break-inside:avoid"
                      bind:this={divsCorrection[k]}
                    >
                      {#if consignesCorrections[k].length !== 0}
                        <div
                          class="container bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark px-4 py-2 mr-2 ml-6 mb-2 font-light relative w-2/3"
                        >
                          <div class="container absolute top-4 -left-4">
                            <i
                              class="bx bx-bulb scale-200 text-coopmaths-warn-dark dark:text-coopmathsdark-warn-dark"
                            />
                          </div>
                          <div class="">
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                            {@html consignesCorrections[k]}
                          </div>
                        </div>
                      {/if}
                      <div
                        class="container overflow-x-auto overflow-y-hidden md:overflow-x-auto"
                        style="break-inside:avoid"
                      >
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        {@html mathaleaFormatExercice(corrections[k])}
                      </div>
                      <!-- <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct top-0 left-0 border-b-[3px] w-10" /> -->
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
                {#if exercices[indiceExercice[k]].interactif}
                  <div class="pb-4 mt-10">
                    <ButtonText
                      text="Vérifier"
                      on:click={() => checkQuestion(k)}
                      disabled={isDisabledButton[k]}
                    />
                  </div>
                {:else if $globalOptions.isSolutionAccessible}
                  <div class={$isMenuNeededForExercises ? 'ml-4' : ''}>
                    <ButtonToggle
                      titles={['Voir la correction', 'Masquer la correction']}
                      on:toggle={() => switchCorrectionVisible(k)}
                    />
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      {:else if $globalOptions.presMode === 'cartes'}
        <div
          class="grid grid-flow-row gri-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-6"
        >
          {#each questions as question, k (k + '_' + question)}
            <FlipCard>
              <div slot="question">
                  <div class="p-2">
                    <div class="text-coopmaths-corpus pl-2">
                      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                      {@html consignes[k]}
                    </div>
                    <div class="text-coopmaths-corpus pl-2">
                      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                      {@html question}
                    </div>
                  </div>
              </div>
              <div slot="answer">
                  <div class="p-2">
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html mathaleaFormatExercice(corrections[k])}
                  </div>
              </div>
            </FlipCard>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <Keyboard/>
  <div class="flex justify-center w-full {$keyboardState.isVisible ? 'mt-52' : ''}">
    <Footer2 />
  </div>
</section>

<style>
  /* sur une idée de Mathieu Degrange */
  .progressbar {
    background: linear-gradient(
      90deg,
      #6ebc1f 0%,
      #6ebc1f calc(100% / var(--nbQuestions) * var(--nbPoints)),
      #d43d0e calc(100% / var(--nbQuestions) * var(--nbPoints)),
      #d43d0e 100%
    );
  }
  .progressbardark {
    background: linear-gradient(
      90deg,
      #ff94d1 0%,
      #ff94d1 calc(100% / var(--nbQuestions) * var(--nbPoints)),
      #ff9523 calc(100% / var(--nbQuestions) * var(--nbPoints)),
      #ff9523 100%
    );
  }
</style>
