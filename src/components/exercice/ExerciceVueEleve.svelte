<script lang="ts">
  import { globalOptions, resultsByExercice, exercicesParams, isMenuNeededForExercises } from '../store'
  import { afterUpdate, onMount, tick } from 'svelte'
  import type TypeExercice from '../../exercices/ExerciceTs.js'
  import seedrandom from 'seedrandom'
  import { prepareExerciceCliqueFigure, exerciceInteractif } from '../../lib/interactif/gestionInteractif'
  import { loadMathLive } from '../../modules/loaders'
  import { mathaleaFormatExercice, mathaleaGenerateSeed, mathaleaHandleExerciceSimple, mathaleaRenderDiv, mathaleaUpdateUrlFromExercicesParams } from '../../lib/mathalea'
  import HeaderExerciceVueEleve from './HeaderExerciceVueEleve.svelte'
  import InteractivityIcon from '../icons/TwoStatesIcon.svelte'
  import type { MathfieldElement } from 'mathlive'
  import { sendToCapytaleSaveStudentAssignment } from '../../lib/handleCapytale'
  import Button from '../forms/Button.svelte'
  export let exercice: TypeExercice
  export let indiceExercice: number
  export let indiceLastExercice: number
  export let isCorrectionVisible: bollean = false

  let divExercice: HTMLDivElement
  let divScore: HTMLDivElement
  let buttonScore: HTMLButtonElement
  let columnsCount = $exercicesParams[indiceExercice].cols || 1
  let isInteractif = exercice.interactif && exercice?.interactifReady

  const title = exercice.id ? `${exercice.id.replace('.js', '')} - ${exercice.titre}` : exercice.titre
  // Evènement indispensable pour pointCliquable par exemple
  const exercicesAffiches = new window.Event('exercicesAffiches', {
    bubbles: true
  })
  document.dispatchEvent(exercicesAffiches)

  let headerExerciceProps: {
    title: string
  } = {
    title
  }

  $: {
    if (isInteractif && buttonScore) initButtonScore()
    headerExerciceProps = headerExerciceProps
    // if ($globalOptions.setInteractive === '1') {
    //   setAllInteractif()
    // } else if ($globalOptions.setInteractive === '0') {
    //   removeAllInteractif()
    // }
  }

  let numberOfAnswerFields: number = 0
  async function countMathField () {
    // IDs de la forme 'champTexteEx1Q0'
    const answerFields = document.querySelectorAll(`[id^='champTexteEx${indiceExercice}']`)
    numberOfAnswerFields = answerFields.length
  }

  onMount(async () => {
    document.addEventListener('newDataForAll', newData)
    document.addEventListener('setAllInteractif', setAllInteractif)
    document.addEventListener('removeAllInteractif', removeAllInteractif)
    updateDisplay()
    setTimeout(() => {
      if ($globalOptions.done === '1' && $globalOptions.recorder !== 'capytale') {
        const fields = document.querySelectorAll('math-field')
        fields.forEach((field) => {
          field.setAttribute('disabled', 'true')
        })
        const url = new URL(window.location.href)
        // Pour Moodle, les réponses sont dans l'URL
        const answers = url.searchParams.get('answers')
        const objAnswers = answers ? JSON.parse(answers) : undefined
        $globalOptions.answers = objAnswers
        mathaleaUpdateUrlFromExercicesParams($exercicesParams)
        for (const answer in objAnswers) {
          // La réponse correspond à un champs texte
          const field = document.querySelector(`#champTexte${answer}`) as MathfieldElement
          if (field !== null) {
            field.setValue(objAnswers[answer])
          }
          // La réponse correspond à une case à cocher qui doit être cochée
          const checkBox = document.querySelector(`#check${answer}`) as HTMLInputElement
          if (checkBox !== null && objAnswers[answer] === '1') {
            checkBox.checked = true
          }
        }
        if (buttonScore) {
          exercice.isDone = true
          buttonScore.click()
        }
      }
    }, 100)
    await tick()
    countMathField()
  })

  afterUpdate(async () => {
    if (exercice) {
      await tick()
      if (exercice.interactif) {
        loadMathLive()
        if (exercice.interactifType === 'cliqueFigure') {
          prepareExerciceCliqueFigure(exercice)
        }
        // Ne pas être noté sur un exercice dont on a déjà vu la correction
        try {
          if (window.localStorage != null && exercice.id !== undefined && exercice.seed !== undefined && window.localStorage.getItem(`${exercice.id}|${exercice.seed}`) != null) {
            newData()
          }
        } catch (e) {
          console.error(e)
        }
      }
      mathaleaRenderDiv(divExercice)
      adjustMathalea2dFiguresWidth()
    }
    // affectation du zoom pour les figures scratch
    const scratchDivs = divExercice.getElementsByClassName('scratchblocks')
    for (const scratchDiv of scratchDivs) {
      const svgDivs = scratchDiv.getElementsByTagName('svg')
      for (const svg of svgDivs) {
        if (svg.hasAttribute('data-width') === false) {
          const originalWidth = svg.getAttribute('width')
          svg.dataset.width = originalWidth ?? ''
        }
        if (svg.hasAttribute('data-height') === false) {
          const originalHeight = svg.getAttribute('height')
          svg.dataset.height = originalHeight ?? ''
        }
        const w = Number(svg.getAttribute('data-width')) * Number($globalOptions.z)
        const h = Number(svg.getAttribute('data-height')) * Number($globalOptions.z)
        svg.setAttribute('width', w.toString())
        svg.setAttribute('height', h.toString())
      }
    }
    document.dispatchEvent(exercicesAffiches)
  })

  async function newData () {
    exercice.isDone = false
    if (isCorrectionVisible) switchCorrectionVisible()
    const seed = mathaleaGenerateSeed()
    exercice.seed = seed
    if (buttonScore) initButtonScore()
    updateDisplay()
  }

  async function setAllInteractif () {
    if (exercice?.interactifReady) isInteractif = true
    updateDisplay()
  }
  async function removeAllInteractif () {
    if (exercice?.interactifReady) isInteractif = false
    updateDisplay()
  }

  async function updateDisplay () {
    if (exercice.seed === undefined) exercice.seed = mathaleaGenerateSeed()
    seedrandom(exercice.seed, { global: true })
    if (exercice.typeExercice === 'simple') mathaleaHandleExerciceSimple(exercice, !!isInteractif)
    exercice.interactif = isInteractif
    $exercicesParams[indiceExercice].alea = exercice.seed
    $exercicesParams[indiceExercice].interactif = isInteractif ? '1' : '0'
    $exercicesParams[indiceExercice].cols = columnsCount > 1 ? columnsCount : undefined
    exercice.numeroExercice = indiceExercice
    if (exercice !== undefined && typeof exercice.nouvelleVersion === 'function') {
      exercice.nouvelleVersion(indiceExercice)
    }
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    adjustMathalea2dFiguresWidth()
  }

  function verifExerciceVueEleve () {
    exercice.isDone = true
    if ($globalOptions.isSolutionAccessible) isCorrectionVisible = true
    if (exercice.numeroExercice != null) {
      const { numberOfPoints, numberOfQuestions } = exerciceInteractif(exercice, divScore, buttonScore)
      resultsByExercice.update((l) => {
        l[exercice.numeroExercice as number] = {
          uuid: exercice.uuid,
          title: exercice.titre,
          indice: exercice.numeroExercice as number,
          state: 'done',
          alea: exercice.seed,
          answers: exercice.answers,
          numberOfPoints,
          numberOfQuestions
        }
        return l
      })
    }
    if ($globalOptions.recorder === 'moodle') {
      const url = new URL(window.location.href)
      const iframe = url.searchParams.get('iframe')
      window.parent.postMessage({ resultsByExercice: $resultsByExercice, action: 'mathalea:score', iframe }, '*')
    } else if ($globalOptions.recorder === 'capytale') {
      sendToCapytaleSaveStudentAssignment()
    }
  }

  function initButtonScore () {
    buttonScore.classList.remove(...buttonScore.classList)
    buttonScore.id = `buttonScoreEx${indiceExercice}`
    buttonScore.classList.add(
      'inline-block',
      'px-6',
      'py-2.5',
      'mr-10',
      'my-5',
      'ml-6',
      'bg-coopmaths-action',
      'dark:bg-coopmathsdark-action',
      'text-coopmaths-canvas',
      'dark:text-coopmathsdark-canvas',
      'font-medium',
      'text-xs',
      'leading-tight',
      'uppercase',
      'rounded',
      'shadow-md',
      'transform',
      'hover:bg-coopmaths-action-lightest',
      'dark:hover:bg-coopmathsdark-action-lightest',
      'hover:shadow-lg',
      'focus:bg-coopmaths-action-lightest',
      'dark:focus:bg-coopmathsdark-action-lightest',
      'focus:shadow-lg',
      'focus:outline-none',
      'focus:ring-0',
      'active:bg-coopmaths-action-lightest',
      'dark:active:bg-coopmathsdark-action-lightest',
      'active:shadow-lg',
      'transition',
      'duration-150',
      'ease-in-out',
      'checkReponses'
    )
    if (divScore) divScore.innerHTML = ''
  }

  /**
   * Recherche toutes les figures ayant la classe `mathalea2d` et réduit leur largeur à 95% de la valeur
   * maximale du div reperé par l'ID `consigne<X>-0` où `X` est l'indice de l'exercice
   * @param {boolean} initialDimensionsAreNeeded si `true`, les valeurs initiales sont rechargées ()`false` par défaut)
   * @author sylvain
   */
  async function adjustMathalea2dFiguresWidth (initialDimensionsAreNeeded: boolean = false) {
    const mathalea2dFigures = document.getElementsByClassName('mathalea2d')
    if (mathalea2dFigures.length !== 0) {
      await tick()
      const body = document.getElementsByTagName('body')[0]
      for (let k = 0; k < mathalea2dFigures.length; k++) {
        if (initialDimensionsAreNeeded) {
          // réinitialisation
          const initialWidth = mathalea2dFigures[k].getAttribute('data-width-initiale')
          const initialHeight = mathalea2dFigures[k].getAttribute('data-height-initiale')
          mathalea2dFigures[k].setAttribute('width', initialWidth ?? '')
          mathalea2dFigures[k].setAttribute('height', initialHeight ?? '')
        }
        // console.log("got figures !!! --> DIV " + body.clientWidth + " vs FIG " + mathalea2dFigures[k].clientWidth)
        if (mathalea2dFigures[k].clientWidth > body.clientWidth) {
          const coef = (body.clientWidth * 0.9) / mathalea2dFigures[k].clientWidth
          const newFigWidth = body.clientWidth * 0.9
          const newFigHeight = mathalea2dFigures[k].clientHeight * coef
          mathalea2dFigures[k].setAttribute('width', newFigWidth.toString())
          mathalea2dFigures[k].setAttribute('height', newFigHeight.toString())
          // console.log("fig" + k + " new dimensions : " + newFigWidth + " x " + newFigHeight)
        }
      }
    }
  }

  // pour recalculer les tailles lors d'un changement de dimension de la fenêtre
  window.onresize = () => {
    adjustMathalea2dFiguresWidth(true)
  }

  function switchCorrectionVisible () {
    isCorrectionVisible = !isCorrectionVisible
    if (isCorrectionVisible && window.localStorage !== undefined && exercice.id !== undefined) {
      window.localStorage.setItem(`${exercice.id}|${exercice.seed}`, 'true')
    }
    if (!$globalOptions.oneShot && exercice.interactif && !isCorrectionVisible && !exercice.isDone) {
      newData()
    }
    adjustMathalea2dFiguresWidth()
  }

  function switchInteractif () {
    if (isCorrectionVisible) switchCorrectionVisible()
    isInteractif = !isInteractif
    exercice.interactif = isInteractif
    $exercicesParams[indiceExercice].interactif = isInteractif ? '1' : '0'
    updateDisplay()
  }
</script>

<div class="z-0 flex-1 w-full mb-10 lg:mb-20" bind:this={divExercice}>
  <HeaderExerciceVueEleve {...headerExerciceProps} {indiceExercice} showNumber={indiceLastExercice > 1} />

  <div class="flex flex-col-reverse lg:flex-row">
    <div class="flex flex-col justify-start items-start" id="exercice{indiceExercice}">
      <div class="flex flex-row justify-start items-center {indiceLastExercice > 1 && $globalOptions.presMode !== 'un_exo_par_page' ? 'ml-2 lg:ml-6' : 'ml-2'} mb-2 lg:mb-6">
        <div class={!$globalOptions.oneShot && $globalOptions.done !== '1' ? 'flex' : 'hidden'}>
          <Button
            title="Nouvel Énoncé"
            icon="bx-refresh"
            classDeclaration="py-[2px] px-2 text-[0.7rem]"
            inverted={true}
            on:click={() => {
              newData()
            }}
          />
        </div>
        <div class={$globalOptions.isSolutionAccessible && !exercice.isDone && ((exercice.interactif && exercice.isDone) || !exercice.interactif) ? 'flex ml-2' : 'hidden'}>
          <Button
            title={isCorrectionVisible ? 'Masquer la correction' : 'Voir la correction'}
            icon={isCorrectionVisible ? 'bx-hide' : 'bx-show'}
            classDeclaration="py-[2px] px-2 text-[0.7rem] w-36"
            inverted={true}
            on:click={switchCorrectionVisible}
          />
        </div>
        <!-- {/if} -->

        <button
          class={$globalOptions.isInteractiveFree && exercice?.interactifReady ? 'w-5 ml-2 tooltip tooltip-right tooltip-neutral ' : 'hidden'}
          data-tip={isInteractif ? "Désactiver l'interactivité" : 'Rendre interactif'}
          type="button"
          on:click={switchInteractif}
        >
          <InteractivityIcon isOnStateActive={isInteractif} size={4} />
        </button>
        {#if $globalOptions.recorder === undefined}
          <div class="hidden md:flex flex-row justify-start items-center text-coopmaths-struct dark:text-coopmathsdark-struct text-xs">
            <button
              class={(columnsCount > 1 && window.innerWidth > 1000) ? 'visible' : 'invisible'}
              type="button"
              on:click={() => {
                columnsCount--
                updateDisplay()
              }}
            >
              <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 bx-xs bx-minus" />
            </button>
            <i class="bx ml-1 bx-xs bx-columns" />
            <button
              type="button"
              on:click={() => {
                columnsCount++
                updateDisplay()
              }}
            >
              <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-1 bx-xs bx-plus" />
            </button>
          </div>
        {/if}
      </div>
      <article class=" {$isMenuNeededForExercises ? 'text-2xl' : 'text-base'} relative w-full" style="font-size: {($globalOptions.z || 1).toString()}rem;  line-height: calc({$globalOptions.z || 1});">
        <div class="flex flex-col w-full">
          {#if typeof exercice.consigne !== 'undefined' && exercice.consigne.length !== 0}
            <div>
              <p class="mt-2 mb-2 ml-2 lg:mx-6 text-coopmaths-corpus dark:text-coopmathsdark-corpus">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html exercice.consigne}
              </p>
            </div>
          {/if}
          {#if exercice.introduction}
            <div>
              <p class="mt-2 mb-2 ml-2 lg:mx-6 text-coopmaths-corpus dark:text-coopmathsdark-corpus">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html exercice.introduction}
              </p>
            </div>
          {/if}
        </div>
        <div style="columns: {window.innerWidth > 1000 ? columnsCount.toString() : '1'}">
          <ul
            class="{exercice.listeQuestions.length === 1 || !exercice.listeAvecNumerotation
              ? 'list-none'
              : 'list-decimal'} list-inside my-2 mx-2 lg:mx-6 marker:text-coopmaths-struct dark:marker:text-coopmathsdark-struct marker:font-bold"
          >
            {#each exercice.listeQuestions as item, i (i)}
              <div style="break-inside:avoid" id="consigne{indiceExercice}-{i}" class="container grid grid-cols-1 auto-cols-min gap-4 mb-2 lg:mb-4">
                <li id="exercice{indiceExercice}Q{i}" style="line-height: {exercice.spacing || 1}">
                  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                  {@html mathaleaFormatExercice(item)}
                </li>
                {#if isCorrectionVisible}
                  <div
                    class="relative self-start border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus my-2 lg:mb-0 ml-0 lg:ml-0 py-2 pl-4 lg:pl-6"
                    id="correction${indiceExercice}Q${i}"
                  >
                    <div
                      class={exercice.consigneCorrection.length !== 0 ? 'container bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark px-4 py-2 mr-2 ml-6 mb-2 font-light relative w-2/3' : 'hidden'}
                    >
                      <div class="{exercice.consigneCorrection.length !== 0 ? 'container absolute top-4 -left-4' : 'hidden'} ">
                        <i class="bx bx-bulb scale-200 text-coopmaths-warn-dark dark:text-coopmathsdark-warn-dark" />
                      </div>
                      <div class="">
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        {@html exercice.consigneCorrection}
                      </div>
                    </div>
                    <div class="container overflow-x-scroll overflow-y-hidden md:overflow-x-auto py-1" style="line-height: {exercice.spacingCorr || 1}; break-inside:avoid">
                      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                      {@html mathaleaFormatExercice(exercice.listeCorrections[i])}
                    </div>
                    <!-- <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct top-0 left-0 border-b-[3px] w-10" /> -->
                    <div
                      class="absolute flex flex-row py-[1.5px] px-3 rounded-t-md justify-center items-center -left-[3px] -top-[15px] bg-coopmaths-struct dark:bg-coopmathsdark-struct font-semibold text-xs text-coopmaths-canvas dark:text-coopmathsdark-canvas"
                    >
                      Correction
                    </div>
                    <div class="absolute border-coopmaths-struct dark:border-coopmathsdark-struct bottom-0 left-0 border-b-[3px] w-4" />
                  </div>
                {/if}
              </div>
            {/each}
          </ul>
        </div>
      </article>
      {#if isInteractif && !isCorrectionVisible}
        <button type="submit" on:click={verifExerciceVueEleve} bind:this={buttonScore}>Vérifier {numberOfAnswerFields > 1 ? 'les réponses' : 'la réponse'}</button>
      {/if}
      <div bind:this={divScore} />
    </div>
  </div>
</div>

<style>
  li {
    break-inside: avoid;
  }
</style>
