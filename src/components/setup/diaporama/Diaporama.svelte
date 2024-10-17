<script lang="ts">
  import type Exercice from '../../../exercices/Exercice'
  import type { InterfaceParams } from '../../../lib/types'
  import type { Slide, Slideshow } from './types'
  import seedrandom from 'seedrandom'
  import SlideshowOverview from './slideshowOverview/SlideshowOverview.svelte'
  import SlideshowPlay from './slideshowPlay/SlideshowPlay.svelte'
  import SlideshowSettings from './slideshowSettings/SlideshowSettings.svelte'
  import { onMount, onDestroy } from 'svelte'
  import { shuffle } from '../../../lib/components/shuffle'
  import {
    mathaleaFormatExercice,
    mathaleaGenerateSeed,
    mathaleaHandleExerciceSimple,
    mathaleaHandleParamOfOneExercice,
    mathaleaHandleSup,
    mathaleaLoadExerciceFromUuid,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../lib/mathalea'
  import {
    exercicesParams,
    globalOptions,
    darkMode,
    previousView
  } from '../../../lib/stores/generalStore'
  import { context } from '../../../modules/context.js'
  import { isIntegerInRange0to3 } from '../../../lib/types/integerInRange'
  import KickOff from '../../display/can/presentationalComponents/KickOff.svelte'
  import type { CanState } from '../../../lib/types/can'
  import CountDown from '../../display/can/presentationalComponents/CountDown.svelte'
  import ButtonText from '../../shared/forms/ButtonText.svelte'
  import { buildMathAleaURL } from '../../../lib/components/urls'

  const transitionSounds = {
    0: new Audio('assets/sounds/transition_sound_01.mp3'),
    1: new Audio('assets/sounds/transition_sound_02.mp3'),
    2: new Audio('assets/sounds/transition_sound_03.mp3'),
    3: new Audio('assets/sounds/transition_sound_04.mp3')
  }

  let state: CanState = 'end'
  let exercises: Exercice[] = []
  let link: string = window.location.href
  let slideshow: Slideshow = {
    slides: [],
    currentQuestion: -1,
    selectedQuestionsNumber: 0
  }

  $: if ($globalOptions.v === 'overview' && exercises.length > 0) updateExercises()
  $: if (state === 'race') startSlideshow()

  onMount(async () => {
    if ($previousView === undefined) state = 'start'
    context.vue = 'diap'
    document.addEventListener('updateAsyncEx', forceUpdate)
    exercises = await getExercisesFromExercicesParams()
    updateExercises()
  })

  onDestroy(() => {
    document.removeEventListener('updateAsyncEx', forceUpdate)
  })

  async function forceUpdate () {
    updateExercises()
  }

  async function getExercisesFromExercicesParams () {
    const exercises = []
    for (const paramsExercice of $exercicesParams) {
      const exercise: Exercice = await mathaleaLoadExerciceFromUuid(paramsExercice.uuid)
      mathaleaHandleParamOfOneExercice(exercise, paramsExercice)
      exercise.duration = paramsExercice.duration ?? 10
      exercises.push(exercise)
    }
    return exercises
  }

  async function updateExercises () {
    setSlidesContent(exercises)
    if ($globalOptions.v !== 'overview') adjustQuestionsOrder()
    updateExerciseParams(exercises)
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    setTimeout(() => {
      link = buildMathAleaURL({ view: 'diaporama' }).toString()
    }, 600) // to update link after the updateGlobalOptionsInURL setTimout
  }

  function setSlidesContent (newExercises: Exercice[]) {
    const slides = []
    const nbOfVues = $globalOptions.nbVues || 1
    let selectedQuestionsNumber = 0
    for (const [k, exercise] of [...newExercises].entries()) {
      reroll(exercise)
      const isSelected = $globalOptions.select?.includes(k) ?? true
      if (isSelected) selectedQuestionsNumber += exercise.listeQuestions.length
      for (let i = 0; i < exercise.listeQuestions.length; i++) {
        const slide: Slide = {
          exercise,
          isSelected,
          vues: []
        }
        for (let idVue = 0; idVue < nbOfVues; idVue++) {
          if (idVue > 0 && isIntegerInRange0to3(idVue)) reroll(exercise, idVue)
          const consigne = mathaleaFormatExercice(exercise.consigne + exercise.introduction ? ('\n' + exercise.consigne + exercise.introduction) : '')
          const question = mathaleaFormatExercice(exercise.listeQuestions[i])
          const correction = mathaleaFormatExercice(exercise.listeCorrections[i])
          const { svgs: questionSvgs, text: questionText } = splitSvgFromText(question)
          const { svgs: consigneSvgs, text: consigneText } = splitSvgFromText(consigne)
          const { svgs: correctionSvgs, text: correctionText } = splitSvgFromText(correction)
          slide.vues.push({
            consigne,
            question,
            correction,
            consigneSvgs,
            consigneText,
            questionSvgs,
            questionText,
            correctionSvgs,
            correctionText
          })
        }
        slides.push(slide)
      }
    }
    slideshow = {
      slides,
      currentQuestion: -1,
      selectedQuestionsNumber: selectedQuestionsNumber || slides.length
    }
  }

  function reroll (exercise: Exercice, idVue?: 0 | 1 | 2 | 3) {
    if (exercise.seed === undefined) exercise.seed = mathaleaGenerateSeed()
    const oldSeed = exercise.seed
    if (idVue !== undefined && idVue > 0) exercise.seed = mathaleaGenerateSeed()
    if (exercise.typeExercice === 'simple') {
      mathaleaHandleExerciceSimple(exercise, false)
    } else {
      seedrandom(exercise.seed, { global: true })
      exercise.nouvelleVersionWrapper?.()
    }
    exercise.seed = oldSeed
  }

  function splitSvgFromText (sourceText: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(sourceText, 'text/html')
    const mathalea2dContainers = doc.querySelectorAll('div.svgContainer')
    const scratchContainers = doc.querySelectorAll('pre.blocks')
    const svgContainers = [...mathalea2dContainers, ...scratchContainers]
    const svgs = Array.from(svgContainers).map(container => container.outerHTML)
    const text = removeSvgContainers(doc.body.innerHTML, svgs)
    return {
      svgs,
      text
    }
  }

  function removeSvgContainers (wholeQuestion: string, svgContainers: string[]) {
    let questionWithoutSvgContainers = wholeQuestion
    svgContainers.forEach(svgContainer => {
      questionWithoutSvgContainers = questionWithoutSvgContainers.replace(svgContainer, '')
    })
    return questionWithoutSvgContainers
  }

  function adjustQuestionsOrder () {
    const areSomeExercisesSelected = $globalOptions.select && $globalOptions.select.length > 0
    const selectedIndexes = areSomeExercisesSelected ? getSelectedQuestionsIndexes() : [...Array(slideshow.slides.length).keys()]
    if ($globalOptions.shuffle) {
      $globalOptions.order = shuffle(selectedIndexes)
    } else {
      $globalOptions.order = $globalOptions.select ? selectedIndexes : undefined
    }
  }

  function getSelectedQuestionsIndexes () {
    const indexes = []
    for (const [i, slide] of [...slideshow.slides].entries()) {
      if (slide.isSelected) {
        indexes.push(i)
      }
    }
    return indexes
  }

  function updateExerciseParams (newExercises: Exercice[]) {
    const newParams: InterfaceParams[] = []
    for (const exercice of newExercises) {
      newParams.push({
        uuid: exercice.uuid,
        id: exercice.id,
        alea: exercice.seed?.substring(0, 4),
        nbQuestions: exercice.nbQuestions,
        duration: exercice.duration,
        sup: mathaleaHandleSup(exercice.sup),
        sup2: mathaleaHandleSup(exercice.sup2),
        sup3: mathaleaHandleSup(exercice.sup3),
        sup4: mathaleaHandleSup(exercice.sup4),
        sup5: mathaleaHandleSup(exercice.sup5)
      })
    }
    exercicesParams.set(newParams)
  }

  function startSlideshow () {
    updateExercises()
    $globalOptions.v = 'diaporama'
    slideshow.currentQuestion = 0
  }

  function backToSettings () {
    $globalOptions.v = 'diaporama'
    slideshow.currentQuestion = -1
  }

  function goToHome () {
    $globalOptions.v = undefined
  }

  function goToOverview () {
    $globalOptions.v = 'overview'
  }
</script>

<svelte:head>
  <style>
    /*svg.mathalea2d {
      display: inline-flex;
    }*/
  </style>
</svelte:head>

<div id="diaporama" class="h-screen {$darkMode.isActive ? 'dark' : ''}">
  {#if $globalOptions.v === 'overview' && slideshow.slides.length > 0}
    <SlideshowOverview
      {exercises}
      {slideshow}
      {updateExercises}
      {backToSettings}
    />
  {:else}
    {#if slideshow.currentQuestion === -1}
      {#if state === 'start'}
        <KickOff
          title="Diaporama"
          subTitle=""
          bind:state={state}
        >
          <ButtonText
            class="mt-8 py-3 px-6 text-3xl rounded-xl font-bold border-2
              border-coopmaths-struct-light dark:border-coopmathsdark-struct-light
              text-coopmaths-canvas dark:text-coopmathsdark-canvas
              bg-coopmaths-struct dark:bg-coopmathsdark-struct
              hover:bg-coopmaths-struct-light dark:hover:bg-coopmathsdark-struct-lightest"
            text="Paramètres"
            on:click={() => {
              state = 'end'
            }}
          />
        </KickOff>
      {:else if state === 'countdown'}
        <CountDown bind:state />
      {:else}
        <SlideshowSettings
          {exercises}
          {updateExercises}
          {transitionSounds}
          {startSlideshow}
          {goToOverview}
          {goToHome}
          {link}
        />
      {/if}
    {/if}
    {#if slideshow.currentQuestion > -1}
      <SlideshowPlay
        {slideshow}
        {transitionSounds}
        {backToSettings}
        {goToOverview}
      />
    {/if}
  {/if}
</div>
