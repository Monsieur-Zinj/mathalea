<script lang="ts">
  import { onMount, tick, onDestroy, afterUpdate } from 'svelte'
  import {
    mathaleaFormatExercice,
    mathaleaHandleExerciceSimple,
    mathaleaHandleParamOfOneExercice,
    mathaleaHandleSup,
    mathaleaLoadExerciceFromUuid,
    mathaleaRenderDiv,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../lib/mathalea'
  import {
    exercicesParams,
    globalOptions,
    questionsOrder,
    selectedExercises,
    transitionsBetweenQuestions,
    darkMode
  } from '../../../lib/stores/generalStore'
  import type Exercice from '../../../exercices/Exercice'
  import seedrandom from 'seedrandom'
  import { context } from '../../../modules/context.js'
  import { showDialogForLimitedTime } from '../../../lib/components/dialogs'
  import {
    formattedTimeStamp
  } from '../../../lib/components/time'
  import type { InterfaceParams, NumberRange } from '../../../lib/types'
  import { shuffle, listOfRandomIndexes } from '../../../lib/components/shuffle'
  import { updateFigures } from '../../../lib/components/sizeTools'
  import SlideshowPlay from './slideshowPlay/SlideshowPlay.svelte'
  import SlideshowSettings from './slideshowSettings/SlideshowSettings.svelte'

  const divQuestion: HTMLDivElement[] = []
  let divTableDurationsQuestions: HTMLDivElement
  let stepsUl: HTMLUListElement
  let currentQuestion = -1 // -1 pour l'intro et questions[0].length pour l'outro
  let isPause = false
  let isCorrectionVisible = false
  let isQuestionVisible = true
  let isSameDurationForAll = false
  const userZoom = 1
  let currentZoom = userZoom
  let exercices: Exercice[] = []
  let questions: [string[], string[], string[], string[]] = [[], [], [], []] // Concaténation de toutes les questions des exercices de exercicesParams, vue par vue
  let corrections: [string[], string[], string[], string[]] = [[], [], [], []]
  let sizes: number[] = []
  let consignes: [string[], string[], string[], string[]] = [[], [], [], []]
  let durations: number[] = []
  let durationGlobal: number | undefined = $globalOptions.durationGlobal
  let previousDurationGlobal = 10 // Utile si on décoche puis recoche "Même durée pour toutes les questions"
  let ratioTime = 0 // Pourcentage du temps écoulé (entre 1 et 100)
  $: isManualModeActive = false
  let myInterval: number
  let currentDuration: number
  let nbOfVues = $globalOptions.nbVues || 1
  const stringNbOfVues = nbOfVues.toString()
  $questionsOrder.isQuestionsShuffled = $globalOptions.shuffle || false
  $selectedExercises.count = $globalOptions.choice
  if ($selectedExercises.count !== undefined) {
    $selectedExercises.isActive = true
  }
  $transitionsBetweenQuestions.isActive = $globalOptions.trans || false
  $transitionsBetweenQuestions.tune = $globalOptions.sound || '1'
  if ($transitionsBetweenQuestions.tune !== undefined) {
    $transitionsBetweenQuestions.isNoisy = true
  }
  const formatQRCodeIndex: NumberRange<0, 2> = 0
  const QRCodeWidth = 100
  let stringDureeTotale = '0'
  // variables pour les transitions entre questions
  const transitionSounds = {
    0: new Audio('assets/sounds/transition_sound_01.mp3'),
    1: new Audio('assets/sounds/transition_sound_02.mp3'),
    2: new Audio('assets/sounds/transition_sound_03.mp3'),
    3: new Audio('assets/sounds/transition_sound_04.mp3')
  }
  const labelsForSounds = [
    { label: 'Son 1', value: '0' },
    { label: 'Son 2', value: '1' },
    { label: 'Son 3', value: '2' },
    { label: 'Son 4', value: '3' }
  ]
  const labelsForMultivue = [
    { label: 'Pas de multivue', value: '1' },
    { label: 'Deux vues', value: '2' },
    { label: 'Trois vues', value: '3' },
    { label: 'Quatre vues', value: '4' }
  ]

  if ($globalOptions && $globalOptions.durationGlobal) {
    isSameDurationForAll = true
  }

  onDestroy(() => {
    document.removeEventListener('updateAsyncEx', forceUpdate)
    // arrete le timer
    pause()
  })

  async function forceUpdate () {
    updateExercices()
  }

  afterUpdate(() => {
  })

  onMount(async () => {
    context.vue = 'diap'
    document.addEventListener('updateAsyncEx', forceUpdate)
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    for (const paramsExercice of $exercicesParams) {
      const exercice: Exercice = await mathaleaLoadExerciceFromUuid(
        paramsExercice.uuid
      )
      if (exercice === undefined) return
      mathaleaHandleParamOfOneExercice(exercice, paramsExercice)
      exercice.duration = paramsExercice.duration ?? 10
      exercices.push(exercice)
    }
    exercices = exercices
    if (!$selectedExercises.isActive) {
      $selectedExercises.indexes = [...Array(exercices.length).keys()]
    } else {
      $selectedExercises.indexes = [
        ...listOfRandomIndexes(exercices.length, $selectedExercises.count!)
      ]
    }
    updateExercices()
    await tick()
    if (divTableDurationsQuestions) {
      mathaleaRenderDiv(divTableDurationsQuestions)
    }
  })

  async function updateExercices () {
    mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    questions = [[], [], [], []]
    corrections = [[], [], [], []]
    consignes = [[], [], [], []]
    sizes = []
    durations = []
    for (let idVue = 0; idVue < nbOfVues; idVue++) {
      consignes[idVue] = []
      questions[idVue] = []
      corrections[idVue] = []
      for (const [k, exercice] of exercices.entries()) {
        if (idVue > 0) {
          if (exercice.seed != null) {
            exercice.seed = exercice.seed.substring(0, 4) + idVue
          }
        } else {
          if (exercice.seed != null) {
            exercice.seed = exercice.seed.substring(0, 4)
          }
        }
        if (exercice.typeExercice === 'simple') {
          mathaleaHandleExerciceSimple(exercice, false)
        } else {
          seedrandom(exercice.seed, { global: true })
          exercice.nouvelleVersionWrapper?.()
        }

        let consigne: string = ''
        if ($selectedExercises.indexes.includes(k)) {
          if (exercice.introduction) {
            consigne = exercice.consigne + '\n' + exercice.introduction
          } else {
            consigne = exercice.consigne
          }
          for (let j = 0; j < exercice.listeQuestions.length; j++) {
            consignes[idVue].push(consigne) // même consigne pour toutes les questions
          }
          questions[idVue] = [...questions[idVue], ...exercice.listeQuestions]
          corrections[idVue] = [
            ...corrections[idVue],
            ...exercice.listeCorrections
          ]
          consignes[idVue] = consignes[idVue].map(mathaleaFormatExercice)
          questions[idVue] = questions[idVue].map(mathaleaFormatExercice)
          corrections[idVue] = corrections[idVue].map(mathaleaFormatExercice)
        }
      }
    }
    const newParams: InterfaceParams[] = []
    for (const exercice of exercices.values()) {
      for (let i = 0; i < exercice.listeQuestions.length; i++) {
        sizes.push(exercice.tailleDiaporama)
        durations.push(exercice.duration || 10)
      }
      newParams.push({
        uuid: exercice.uuid,
        id: exercice.id,
        alea: exercice.seed?.substring(0, 4),
        nbQuestions: exercice.nbQuestions,
        duration: exercice.duration,
        sup: mathaleaHandleSup(exercice.sup),
        sup2: mathaleaHandleSup(exercice.sup2),
        sup3: mathaleaHandleSup(exercice.sup3),
        sup4: mathaleaHandleSup(exercice.sup4)
      })
    }
    globalOptions.update((l) => {
      l.nbVues = nbOfVues
      return l
    })
    // préparation des indexes si l'ordre aléatoire est demandé
    if ($questionsOrder.isQuestionsShuffled) {
      $questionsOrder.indexes = shuffle([...Array(questions[0].length).keys()])
    } else {
      $questionsOrder.indexes = [...Array(questions[0].length).keys()]
    }
    exercicesParams.update(() => newParams)
    mathaleaUpdateUrlFromExercicesParams(newParams)
    stringDureeTotale = formattedTimeStamp(getTotalDuration())
    if (divTableDurationsQuestions) {
      mathaleaRenderDiv(divTableDurationsQuestions)
    }
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

  // ================================================================================
  //
  //  Gestion de la navigation
  //
  // ================================================================================

  async function goToQuestion (i: number) {
    if (i >= -1 && i <= questions[0].length) currentQuestion = i
    if (i === -1 || i === questions[0].length) pause()
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

  // =========================== Fin gestion de la navigation ===============================

  // ================================================================================
  //
  //  Gestion du temps
  //
  // ================================================================================

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

  function handleChangeDurationGlobal () {
    globalOptions.update((l) => {
      l.durationGlobal = durationGlobal
      return l
    })
    updateExercices()
  }

  function handleCheckSameDurationForAll () {
    globalOptions.update((l) => {
      l.durationGlobal = undefined
      return l
    })
    handleChangeDurationGlobal()
  }

  /**
   * Calcule la durée totale du diaporama
   * (durée par question x nombre de questions)
   */
  function getTotalDuration () {
    let sum = 0
    for (const [i, exercice] of exercices.entries()) {
      if ($selectedExercises.isActive) {
        if ($selectedExercises.indexes.includes(i)) {
          sum +=
            (isSameDurationForAll
              ? durationGlobal ?? 10
              : exercice.duration ?? 10) * exercice.nbQuestions
        }
      } else {
        sum +=
          (isSameDurationForAll
            ? durationGlobal ?? 10
            : exercice.duration ?? 10) * exercice.nbQuestions
      }
    }
    return sum
  }

  /**
   * Calcule le nombre total de questions
   */
  $: getTotalNbOfQuestions = () => {
    let sum = 0
    for (const [i, exercice] of exercices.entries()) {
      if ($selectedExercises.isActive) {
        if ($selectedExercises.indexes.includes(i)) {
          sum += exercice.nbQuestions
        }
      } else {
        sum += exercice.nbQuestions
      }
    }
    return sum
  }

  function handleCheckManualMode () {
    isManualModeActive = !isManualModeActive
  }

  $: {
    nbOfVues = parseInt(stringNbOfVues) as 1 | 2 | 3 | 4
    if (divTableDurationsQuestions) {
      mathaleaRenderDiv(divTableDurationsQuestions)
    }
    if (durationGlobal) previousDurationGlobal = durationGlobal
    if (isSameDurationForAll && previousDurationGlobal) {
      durationGlobal = previousDurationGlobal
    }

    if (isSameDurationForAll && typeof durationGlobal === 'undefined') {
      durationGlobal = 10
    } else if (!isSameDurationForAll) {
      durationGlobal = undefined
    }
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
  // =========================== Fin gestion du temps ===============================

  // ================================================================================
  //
  //  Gestion de la taille
  //
  // ================================================================================

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

  // =========================== Fin gestion de la taille ===========================

  // ================================================================================
  //
  //  Organisation des questions et du contenu de l'affichage
  //
  // ================================================================================

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

  /**
   * Gestion de la sélection du choix des exercices dans la liste
   */
  function handleSampleChecked () {
    $selectedExercises.count = exercices.length - 1
    $selectedExercises.isActive = !$selectedExercises.isActive
    if (!$selectedExercises.isActive) {
      $selectedExercises.indexes = [...Array(exercices.length).keys()]
      globalOptions.update((l) => {
        l.choice = undefined
        return l
      })
      getTotalNbOfQuestions()
      updateExercices()
    } else {
      handleSampleSizeChange()
    }
  }

  /**
   * Gestion du changement du nombre d'exercices à utiliser
   * dans la liste de ceux sélectionnées
   *
   * 1/ on génère une liste d'indexes aléatoires sur laquelle
   * sera batie la liste des exercices à utiliser
   * 2/ on met à jours les paramètres dans les options et l'URL
   */
  function handleSampleSizeChange () {
    if ($selectedExercises.count) {
      $selectedExercises.indexes = [
        ...listOfRandomIndexes(exercices.length, $selectedExercises.count)
      ]
    }
    globalOptions.update((l) => {
      l.choice = $selectedExercises.count
      return l
    })
    getTotalNbOfQuestions()
    updateExercices()
  }

  /**
   * Gestion du bouton demandant de changer l'ordre des questions
   */
  function handleRandomQuestionOrder () {
    $globalOptions.shuffle = $questionsOrder.isQuestionsShuffled
    updateExercices()
  }

  /**
   * Gérer le choix de cartons entre les questions
   * @author sylvain
   */
  function handleTransitionsMode () {
    // $transitionsBetweenQuestions.isActive = !$transitionsBetweenQuestions.isActive  <- inutile avec ButtonToggle
    globalOptions.update((l) => {
      l.trans = $transitionsBetweenQuestions.isActive
      return l
    })
    updateExercices()
  }

  /**
   * Gérer le choix de sons entre les questions
   * @author sylvain
   */
  function handleTransitionSound () {
    if ($transitionsBetweenQuestions.isNoisy) {
      if (typeof $transitionsBetweenQuestions.tune === 'undefined') {
        $transitionsBetweenQuestions.tune = '0'
      }
      globalOptions.update((l) => {
        l.sound = $transitionsBetweenQuestions.tune
        return l
      })
    } else {
      // $transitionsBetweenQuestions.tune = undefined
      globalOptions.update((l) => {
        l.sound = undefined
        return l
      })
    }
    updateExercices()
  }

  /**
   * Met à jour le numéro du son dans l'URL
   * @author sylvain
   */
  function handleTuneChange () {
    globalOptions.update((l) => {
      l.sound = $transitionsBetweenQuestions.tune
      return l
    })
    updateExercices()
  }

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
</script>

<svelte:head>
  <style>
    svg.mathalea2d {
      display: inline-flex;
    }
  </style>
</svelte:head>

<svelte:window on:keyup={handleShortcut} />

<div id="diaporama" class={$darkMode.isActive ? 'dark' : ''}>
  {#if currentQuestion === -1}
    <SlideshowSettings
      {exercices}
      {stringNbOfVues}
      {stringDureeTotale}
      {isManualModeActive}
      {isSameDurationForAll}
      {durationGlobal}
      {currentQuestion}
      {QRCodeWidth}
      {formatQRCodeIndex}
      {updateExercices}
      {handleCheckManualMode}
      {handleCheckSameDurationForAll}
      {labelsForMultivue}
      {labelsForSounds}
      {handleTuneChange}
      {handleRandomQuestionOrder}
      {handleSampleChecked}
      {handleSampleSizeChange}
      {handleTransitionsMode}
      {handleTransitionSound}
      {handleChangeDurationGlobal}
      {goToQuestion}
      {timer}
      {getTotalNbOfQuestions}
      {transitionSounds}
      {divTableDurationsQuestions}
      {durations}
    />
  {/if}
  {#if currentQuestion > -1}
    <SlideshowPlay
      {isManualModeActive}
      {ratioTime}
      {currentDuration}
      {questions}
      {consignes}
      {corrections}
      {nbOfVues}
      {currentQuestion}
      {isQuestionVisible}
      {isCorrectionVisible}
      {isPause}
      {divQuestion}
      {prevQuestion}
      {nextQuestion}
      {switchPause}
      {pause}
      {stepsUl}
      {isSameDurationForAll}
      {durationGlobal}
      {handleChangeDurationGlobal}
      {userZoom}
      {setSize}
      {goToQuestion}
      {updateExercices}
      {QRCodeWidth}
      {formatQRCodeIndex}
    />
  {/if}
</div>
