<script lang="ts">
  import { globalOptions, resultsByExercice, exercicesParams, isMenuNeededForExercises } from '../../../../../lib/stores/generalStore'
  import { afterUpdate, onMount, tick } from 'svelte'
  import type TypeExercice from '../../../../../exercices/Exercice'
  import seedrandom from 'seedrandom'
  import { prepareExerciceCliqueFigure, exerciceInteractif } from '../../../../../lib/interactif/gestionInteractif'
  import { loadMathLive } from '../../../../../modules/loaders'
  import { mathaleaGenerateSeed, mathaleaHandleExerciceSimple, mathaleaRenderDiv, mathaleaUpdateUrlFromExercicesParams } from '../../../../../lib/mathalea'
  import HeaderExerciceVueEleve from '../../presentationalComponents/shared/HeaderExerciceVueEleve.svelte'
  import type { MathfieldElement } from 'mathlive'
  import { sendToCapytaleSaveStudentAssignment } from '../../../../../lib/handleCapytale'
  import Question from './presentationalComponents/Question.svelte'
  import ExerciceVueEleveButtons from './presentationalComponents/ExerciceVueEleveButtons.svelte'
  import { isLocalStorageAvailable } from '../../../../../lib/stores/storage'
  export let exercise: TypeExercice
  export let exerciseIndex: number
  export let indiceLastExercice: number
  export let isCorrectionVisible: boolean = false

  let divExercice: HTMLDivElement
  let divScore: HTMLDivElement
  let buttonScore: HTMLButtonElement
  let columnsCount = $exercicesParams[exerciseIndex].cols || 1
  let isInteractif = exercise.interactif && exercise?.interactifReady

  let title: string
  if ($globalOptions.isTitleDisplayed) {
    title = exercise.id ? `${exercise.id.replace('.js', '').replace('.ts', '')} - ${exercise.titre}` : exercise.titre
  } else {
    title = exercise.id || ''
  }
  // Evènement indispensable pour pointCliquable par exemple
  const exercicesAffiches = new window.Event('exercicesAffiches', {
    bubbles: true
  })
  document.dispatchEvent(exercicesAffiches)

  let headerExerciceProps: {title: string} = { title }

  $: {
    if (isInteractif && buttonScore) initButtonScore()
    headerExerciceProps = headerExerciceProps
  }

  
  function countMathField () {
    let numbOfAnswerFields : number = 0 
    exercise.autoCorrection.forEach( val => {
      if (val.reponse.param.formatInteractif === 'mathlive' || val.reponse.param.formatInteractif === 'qcm') {
        numbOfAnswerFields++
      }
    })
    log('numberOfAnswerFields:' + numbOfAnswerFields)
    return numbOfAnswerFields
  }
  let numberOfAnswerFields: number = 0

  async function forceUpdate () {
    if (exercise == null) return
    exercise.numeroExercice = exerciseIndex
    await adjustMathalea2dFiguresWidth()
  }

  onMount(async () => {
    log('onMount')
    document.addEventListener('newDataForAll', newData)
    document.addEventListener('setAllInteractif', setAllInteractif)
    document.addEventListener('removeAllInteractif', removeAllInteractif)
    document.addEventListener('updateAsyncEx', forceUpdate)
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
          if (field != null) {
            if (typeof field.setValue === 'function') field.setValue(objAnswers[answer])
            else {
              // Problème à régler pour ts. mais window.notify() existe bien au chargement en ce qui nous concerne.
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              window.notify('Il y a un problème avec l\'input de cet exercice, il ne semble pas être un MathfieldElement, en tout cas ne possède pas de méthode setValue()', { exercice: JSON.stringify(exercise) })
              field.value = objAnswers[answer]
            }
          }
          // La réponse correspond à une case à cocher qui doit être cochée
          const checkBox = document.querySelector(`#check${answer}`) as HTMLInputElement
          if (checkBox !== null && objAnswers[answer] === '1') {
            checkBox.checked = true
          }
        }
        if (buttonScore) {
          exercise.isDone = true
          buttonScore.click()
        }
      }
    }, 100)
    if (isInteractif && !isCorrectionVisible) {
      numberOfAnswerFields = countMathField()
    } 
    if ($globalOptions.setInteractive === '1') {
      setAllInteractif()
    } else if ($globalOptions.setInteractive === '0') {
      removeAllInteractif()
    }
  })

  afterUpdate(async () => {
    log('afterUpdate')
    if (exercise) {
      await tick()
      mathaleaRenderDiv(divExercice)
      adjustMathalea2dFiguresWidth()
      if (exercise.interactif) {
        log('loadMathLive')
        loadMathLive(divExercice)
        log('end loadMathLive')
        if (exercise.interactifType === 'cliqueFigure') {
          prepareExerciceCliqueFigure(exercise)
        }
        // Ne pas être noté sur un exercice dont on a déjà vu la correction
        try {
          if (isLocalStorageAvailable() && exercise.id !== undefined && exercise.seed !== undefined && window.localStorage.getItem(`${exercise.id}|${exercise.seed}`) != null) {
            newData()
          }
        } catch (e) {
          console.error(e)
        }
      }      
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
    exercise.isDone = false
    if (isCorrectionVisible) switchCorrectionVisible()
    const seed = mathaleaGenerateSeed()
    exercise.seed = seed
    if (buttonScore) initButtonScore()
    updateDisplay()
  }

  async function setAllInteractif () {
    if (exercise?.interactifReady) isInteractif = true
    updateDisplay()
  }
  async function removeAllInteractif () {
    if (exercise?.interactifReady) isInteractif = false
    updateDisplay()
  }

  let debug = false
  function log (str: string) {
    if (debug) {
      console.info(str)
    }
  }

  async function updateDisplay () {
    log('updateDisplay')
    if (exercise.seed === undefined) exercise.seed = mathaleaGenerateSeed()
    seedrandom(exercise.seed, { global: true })
    if (exercise.typeExercice === 'simple') mathaleaHandleExerciceSimple(exercise, !!isInteractif, exerciseIndex)
    exercise.interactif = isInteractif
    $exercicesParams[exerciseIndex].alea = exercise.seed
    $exercicesParams[exerciseIndex].interactif = isInteractif ? '1' : '0'
    $exercicesParams[exerciseIndex].cols = columnsCount > 1 ? columnsCount : undefined
    exercise.numeroExercice = exerciseIndex
    if (exercise !== undefined && exercise.typeExercice !== 'simple' && typeof exercise.nouvelleVersionWrapper === 'function') {
      exercise.nouvelleVersionWrapper(exerciseIndex)
    }
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    await adjustMathalea2dFiguresWidth()
  }

  function verifExerciceVueEleve () {
    log('verifExerciceVueEleve')
    exercise.isDone = true
    if ($globalOptions.isSolutionAccessible) isCorrectionVisible = true
    if (exercise.numeroExercice != null) {
      const previousBestScore = $exercicesParams[exercise.numeroExercice]?.bestScore ?? 0
      const { numberOfPoints, numberOfQuestions } = exerciceInteractif(exercise, divScore, buttonScore)
      const bestScore = Math.max(numberOfPoints, previousBestScore)
      exercicesParams.update(l => {
        l[exercise.numeroExercice as number].bestScore = bestScore
        return l
      })
      resultsByExercice.update((l) => {
        l[exercise.numeroExercice as number] = {
          uuid: exercise.uuid,
          title: exercise.titre,
          indice: exercise.numeroExercice as number,
          state: 'done',
          alea: exercise.seed,
          answers: exercise.answers,
          numberOfPoints: bestScore,
          numberOfQuestions,
          bestScore
        }
        return l
      })

      if ($globalOptions.recorder === 'moodle') {
        const url = new URL(window.location.href)
        const iframe = url.searchParams.get('iframe')
        window.parent.postMessage({ resultsByExercice: $resultsByExercice, action: 'mathalea:score', iframe }, '*')
      } else if ($globalOptions.recorder === 'capytale') {
        if (buttonScore.dataset.capytaleLoadAnswers === '1') {
          console.info('Les réponses ont été chargées par Capytale donc on ne les renvoie pas à nouveau')
          return
        }
        sendToCapytaleSaveStudentAssignment({ indiceExercice: exerciseIndex })
      }
    }
  }

  function initButtonScore () {
    buttonScore.classList.remove(...buttonScore.classList)
    buttonScore.id = `buttonScoreEx${exerciseIndex}`
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
     const mathalea2dFigures = document.querySelectorAll<SVGElement>('.mathalea2d')
     const zoom = Number($globalOptions.z ?? 1)
     // console.log('zoom:' + zoom )
     if (mathalea2dFigures != null) {
       if (mathalea2dFigures.length !== 0) {
         await tick()
         // console.log('adjustMathalea2dFiguresWidth:' + initialDimensionsAreNeeded )
         for (let k = 0; k < mathalea2dFigures.length; k++) {
           if (initialDimensionsAreNeeded) {
             // réinitialisation
             const initialWidth = mathalea2dFigures[k].getAttribute('data-width-initiale')
             const initialHeight = mathalea2dFigures[k].getAttribute('data-height-initiale')
             mathalea2dFigures[k].setAttribute('width', (Number(initialWidth) * zoom).toString())
             mathalea2dFigures[k].setAttribute('height', (Number(initialHeight) * zoom).toString())
             // les éléments Katex des figures SVG
             if (mathalea2dFigures[k] != null && mathalea2dFigures[k].parentElement != null) {
               const eltsInFigures = mathalea2dFigures[k].parentElement?.querySelectorAll<HTMLElement>('div.divLatex') || []
               for (const elt of eltsInFigures) {
                 const e = elt
                 e.style.setProperty('top', (Number(e.dataset.top) * zoom).toString() + 'px')
                 e.style.setProperty('left', (Number(e.dataset.left) * zoom).toString() + 'px')
               }
             }
           }
           /* Mickael:
          Ne surtout pas mettre la référence de l'exercice dans la requête suivante,
          car dans svelte, la référence est liée au dernier exercice chargé, ce qui bug!
          */
           const consigneDiv = mathalea2dFigures[k].closest('article')?.querySelector('[id^="consigne"]')
           // const consigneDiv = document.getElementById('consigne' + exnumero + '-0')
           if (consigneDiv && mathalea2dFigures[k].clientWidth > consigneDiv.clientWidth) {
             const coef = (consigneDiv.clientWidth * 0.95) / mathalea2dFigures[k].clientWidth
             // console.log('coef:' + coef )
             const width = mathalea2dFigures[k].getAttribute('width')
             const height = mathalea2dFigures[k].getAttribute('height')
             if (!mathalea2dFigures[k].dataset.widthInitiale && width != null) mathalea2dFigures[k].dataset.widthInitiale = width
             if (!mathalea2dFigures[k].dataset.heightInitiale && height != null) mathalea2dFigures[k].dataset.heightInitiale = height
             mathalea2dFigures[k].setAttribute('height', (Number(mathalea2dFigures[k].dataset.heightInitiale) * zoom * coef).toString())
             mathalea2dFigures[k].setAttribute('width', (Number(mathalea2dFigures[k].dataset.widthInitiale) * zoom * coef).toString())

             if (mathalea2dFigures[k] != null && mathalea2dFigures[k].parentElement !== null) {
               const eltsInFigures = mathalea2dFigures[k].parentElement?.querySelectorAll<HTMLElement>('div.divLatex') || []
               for (const elt of eltsInFigures) {
                 const e = elt
                 const initialTop = Number(e.dataset.top) ?? 0
                 const initialLeft = Number(e.dataset.left) ?? 0
                 e.style.setProperty('top', (initialTop * coef * zoom).toString() + 'px')
                 e.style.setProperty('left', (initialLeft * coef * zoom).toString() + 'px')
               }
             }
           }
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
    if (isCorrectionVisible && isLocalStorageAvailable() && exercise.id !== undefined) {
      window.localStorage.setItem(`${exercise.id}|${exercise.seed}`, 'true')
    }
    if (!$globalOptions.oneShot && exercise.interactif && !isCorrectionVisible && !exercise.isDone) {
      newData()
    }
    adjustMathalea2dFiguresWidth()
  }

  function switchInteractif () {
    if (isCorrectionVisible) switchCorrectionVisible()
    isInteractif = !isInteractif
    exercise.interactif = isInteractif
    $exercicesParams[exerciseIndex].interactif = isInteractif ? '1' : '0'
    updateDisplay()
  }

  function columnsCountUpdate (plusMinus: ('+' | '-')) {
    if (plusMinus === '+') columnsCount++
    if (plusMinus === '-') columnsCount--
    updateDisplay()
  }
</script>

<div class="z-0 flex-1 w-full mb-10 lg:mb-20" bind:this={divExercice}>
  {#if $globalOptions.presMode !== 'recto' && $globalOptions.presMode !== 'verso'}
    <HeaderExerciceVueEleve
      {...headerExerciceProps}
      indiceExercice={exerciseIndex}
      showNumber={indiceLastExercice > 0 && $globalOptions.presMode !== 'un_exo_par_page'}
      isMenuNeededForExercises={$isMenuNeededForExercises}
      presMode={$globalOptions.presMode}
    />
  {/if}

  <div class="flex flex-col-reverse lg:flex-row">
    <div class="flex flex-col justify-start items-start" id="exercice{exerciseIndex}">
      <ExerciceVueEleveButtons
      globalOptions={$globalOptions}
      {indiceLastExercice}
      {exercise}
      {isCorrectionVisible}
      {newData}
      {switchCorrectionVisible}
      {isInteractif}
      {switchInteractif}
      {columnsCount}
      {columnsCountUpdate}
      />
      <article class=" {$isMenuNeededForExercises ? 'text-2xl' : 'text-base'} relative w-full" style="font-size: {($globalOptions.z || 1).toString()}rem;  line-height: calc({$globalOptions.z || 1});">
        <div class="flex flex-col w-full">
          {#if typeof exercise.consigne !== 'undefined' && exercise.consigne.length !== 0}
            <div>
              <p class="mt-2 mb-2 ml-2 lg:mx-6 text-coopmaths-corpus dark:text-coopmathsdark-corpus">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html exercise.consigne}
              </p>
            </div>
          {/if}
          {#if exercise.introduction}
            <div>
              <p class="mt-2 mb-2 ml-2 lg:mx-6 text-coopmaths-corpus dark:text-coopmathsdark-corpus">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html exercise.introduction}
              </p>
            </div>
          {/if}
        </div>
        <div style="columns: {window.innerWidth > 1000 ? columnsCount.toString() : '1'}">
          <ul
            class="{exercise.listeQuestions.length === 1 || !exercise.listeAvecNumerotation
              ? 'list-none'
              : 'list-decimal'} list-inside my-2 mx-2 lg:mx-6 marker:text-coopmaths-struct dark:marker:text-coopmathsdark-struct marker:font-bold"
          >
            <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
            {#each exercise.listeQuestions as question, questionIndex (questionIndex + '_' + (exercise.seed || ''))}
              <Question
                {exercise}
                {questionIndex}
                {exerciseIndex}
                {isCorrectionVisible}
              />
            {/each}
            <div bind:this={divScore} />
          </ul>
        </div>
      </article>
      {#if isInteractif && !isCorrectionVisible}
        <button type="submit" on:click={verifExerciceVueEleve} bind:this={buttonScore}>Vérifier {numberOfAnswerFields > 1 ? 'les réponses' : 'la réponse'}</button>
      {/if}
    </div>
  </div>
</div>
