<script lang="ts">
  import {
    globalOptions,
    resultsByExercice,
    exercicesParams,
    changes
  } from '../../../../../lib/stores/generalStore'
  import { afterUpdate, beforeUpdate, onMount, tick, onDestroy } from 'svelte'
  import seedrandom from 'seedrandom'
  import {
    prepareExerciceCliqueFigure,
    exerciceInteractif
  } from '../../../../../lib/interactif/gestionInteractif'
  import { loadMathLive } from '../../../../../modules/loaders'
  import {
    mathaleaFormatExercice,
    mathaleaHandleExerciceSimple,
    mathaleaHandleSup,
    mathaleaRenderDiv,
    mathaleaUpdateUrlFromExercicesParams
  } from '../../../../../lib/mathalea'
  import Settings from './presentationalComponents/Settings.svelte'
  import {
    exercisesUuidRanking,
    uuidCount
  } from '../../../../../lib/components/counts'
  import Exercice from '../../../../../exercices/Exercice'
  import type { HeaderProps } from '../../../../../lib/types/ui'
  import HeaderExerciceVueProf from '../../shared/headerExerciceVueProf/HeaderExerciceVueProf.svelte'
  import { isLocalStorageAvailable } from '../../../../../lib/stores/storage'
  import type { InterfaceParams } from '../../../../../lib/types'
  import { get } from 'svelte/store'
  import { uuidToLocaleRef } from '../../../../../lib/components/languagesUtils'
  import { referentielLocale } from '../../../../../lib/stores/languagesStore'
  import type { Language } from '../../../../../lib/types/languages'

  export let exercise: Exercice
  export let exerciseIndex: number
  export let indiceLastExercice: number
  export let isCorrectionVisible = false

  let divExercice: HTMLDivElement
  let divScore: HTMLDivElement
  let buttonScore: HTMLButtonElement
  let interfaceParams: InterfaceParams = get(exercicesParams)[exerciseIndex]
  let exercicesNumber: number = get(exercicesParams).length

  // Pour une raison que je n'ai pas su identifier, interfaceParams?.id
  // est parfois undefined : donc le code qui suit renvoie parfois une chaîne vide
  //
  // let id: string = interfaceParams?.id
  //   ? exercise.id
  //     ? exercise.id.replace('.js', '').replace('.ts', '')
  //     : '<foo>'
  //   : '<bar>'
  //
  // Avec la fonction uuidToLocaleRef, on va chercher dans le référentiel de la locale
  // (ou dans le référentiel français si on ne trouver pas dans le local)
  // la référence correspondant à l'uuid qui elle ne semble pas undefined
  // (si c'est le cas, on aura une chaîne vide)
  const locale: Language = get(referentielLocale)
  let id: string = uuidToLocaleRef(interfaceParams.uuid, locale)

  const subscribeExercicesParamsStore = exercicesParams.subscribe((value) => {
    if (
      JSON.stringify(value[exerciseIndex]) !== JSON.stringify(interfaceParams)
    ) {
      interfaceParams = value[exerciseIndex]
    }
    if (exercicesNumber !== value.length) {
      exercicesNumber = value.length
    }
  })

  let columnsCount = interfaceParams.cols || 1
  let isVisible = true
  let isContentVisible = true
  let isSettingsVisible = true
  let isInteractif = exercise.interactif
  const interactifReady = exercise.interactifReady
  const exerciceHasNoSettings =
    !exercise.nbQuestionsModifiable &&
    !exercise.besoinFormulaireCaseACocher &&
    !exercise.besoinFormulaireNumerique &&
    !exercise.besoinFormulaireTexte &&
    !exercise.besoinFormulaire2CaseACocher &&
    !exercise.besoinFormulaire2Numerique &&
    !exercise.besoinFormulaire2Texte &&
    !exercise.besoinFormulaire3CaseACocher &&
    !exercise.besoinFormulaire3Numerique &&
    !exercise.besoinFormulaire3Texte &&
    !exercise.besoinFormulaire4CaseACocher &&
    !exercise.besoinFormulaire4Numerique &&
    !exercise.besoinFormulaire4Texte
  let isExerciceChecked = false
  const generateTitleAddendum = (): string => {
    const ranks = exercisesUuidRanking(get(exercicesParams))
    const counts = uuidCount(get(exercicesParams))
    if (
      interfaceParams &&
      interfaceParams.uuid &&
      counts[interfaceParams.uuid] > 1
    ) {
      return '|' + ranks[exerciseIndex]
    } else {
      return ''
    }
  }
  let headerProps: HeaderProps = {
    title: '',
    id,
    indiceExercice: exerciseIndex,
    indiceLastExercice,
    isInteractif,
    interactifReady,
    isSettingsVisible
  }

  $: {
    if (isContentVisible && isInteractif && buttonScore) initButtonScore()
    if ($globalOptions.v === 'eleve') {
      headerProps.settingsReady = false
      headerProps.isSortable = false
      headerProps.isDeletable = false
      headerProps.isHidable = false
      if ($globalOptions.setInteractive === '1') {
        setAllInteractif()
      } else if ($globalOptions.setInteractive === '0') {
        removeAllInteractif()
      }
      if (!$globalOptions.isSolutionAccessible) {
        headerProps.correctionReady = false
        headerProps.randomReady = false
      }
    } else {
      headerProps.settingsReady = !exerciceHasNoSettings
      headerProps.isSortable = true
      headerProps.isDeletable = true
      headerProps.isHidable = true
    }
    headerProps.id = id
    headerProps.isInteractif = isInteractif
    headerProps.correctionExists = exercise.listeCorrections.length > 0
    headerProps.title = exercise.titre + generateTitleAddendum()
    headerProps.indiceExercice = exerciseIndex
    headerProps.indiceLastExercice = exercicesNumber
    headerProps.isSettingsVisible = isSettingsVisible
    headerProps = headerProps
  }

  let numberOfAnswerFields: number = 0
  async function countMathField () {
    // IDs de la forme 'champTexteEx1Q0'
    const answerFields = document.querySelectorAll(
      `[id^='champTexteEx${exerciseIndex}']`
    )
    numberOfAnswerFields = answerFields.length
  }

  // on détecte les changements dans la liste des exercices
  // afin de mettre à jour le titre
  const unsubscribeToChangesStore = changes.subscribe(() => {
    headerProps.title = exercise.titre + generateTitleAddendum()
  })

  async function forceUpdate () {
    if (exercise == null) return
    exercise.numeroExercice = exerciseIndex
    await adjustMathalea2dFiguresWidth()
  }

  function log (str: string) {
    const debug = false
    if (debug) {
      console.log(exerciseIndex)
      console.log(str)
    }
  }

  beforeUpdate(() => {
    log('beforeUpdate:' + exercise.id)
    if (
      JSON.stringify(get(exercicesParams)[exerciseIndex]) !==
      JSON.stringify(interfaceParams)
    ) {
      // interface à changer car un exercice a été supprimé au dessus...
      interfaceParams = get(exercicesParams)[exerciseIndex]
    }
  })

  /**
   * Fonction appelée lorsque le listener détecte `languageHasChanged`.
   * Elle change la variable `interfaceParams` et surtout met à jour `id`
   * qui est succeptible de changer avec la langue.
   * @author sylvain
   */
  const updateExerciceAfterLanguageChange = () => {
    if ($exercicesParams.length !== 0) {
      interfaceParams = get(exercicesParams)[exerciseIndex]
      id = get(exercicesParams)[exerciseIndex].id || ''
    }
  }

  onMount(async () => {
    log('onMount:' + exercise.id)
    document.addEventListener('newDataForAll', newData)
    document.addEventListener('setAllInteractif', setAllInteractif)
    document.addEventListener('removeAllInteractif', removeAllInteractif)
    document.addEventListener('updateAsyncEx', forceUpdate)
    document.addEventListener(
      'languageHasChanged',
      updateExerciceAfterLanguageChange
    )

    await updateDisplay()
    await tick()
    await countMathField()
  })

  onDestroy(() => {
    log('ondestroy' + exercise.id)
    // Détruit l'objet exercice pour libérer la mémoire
    for (const prop of Object.keys(exercise)) {
      Reflect.deleteProperty(exercise, prop)
    }
    document.removeEventListener('newDataForAll', newData)
    document.removeEventListener('setAllInteractif', setAllInteractif)
    document.removeEventListener('removeAllInteractif', removeAllInteractif)
    document.removeEventListener('updateAsyncEx', forceUpdate)
    document.removeEventListener(
      'languageHasChanged',
      updateExerciceAfterLanguageChange
    )
    unsubscribeToChangesStore()
    subscribeExercicesParamsStore()
  })

  afterUpdate(async () => {
    log('afterUpdate:' + exercise.id)
    if (exercise) {
      await tick()
      if (isInteractif) {
        await loadMathLive()
        if (exercise?.interactifType === 'cliqueFigure') {
          prepareExerciceCliqueFigure(exercise)
        }
        // Ne pas être noté sur un exercice dont on a déjà vu la correction
        if (
          isLocalStorageAvailable() &&
          exercise.id !== undefined &&
          exercise.seed !== undefined &&
          window.localStorage.getItem(`${exercise.id}|${exercise.seed}`) !=
            null &&
          isContentVisible
        ) {
          await newData()
        }
      }
      mathaleaRenderDiv(divExercice)
      if (exerciceHasNoSettings) {
        isSettingsVisible = false
        // headerProps.settingsReady = false
      }
    }
    // Evènement indispensable pour pointCliquable par exemple
    const exercicesAffiches = new window.Event('exercicesAffiches', {
      bubbles: true
    })
    document.dispatchEvent(exercicesAffiches)
  })

  async function newData () {
    if (Object.prototype.hasOwnProperty.call(exercise, 'listeQuestions')) {
      if (isCorrectionVisible && isInteractif) isCorrectionVisible = false
      if (
        exercise !== undefined &&
        typeof exercise?.applyNewSeed === 'function'
      ) {
        exercise.applyNewSeed()
      }
      if (buttonScore) initButtonScore()
      if (
        isLocalStorageAvailable() &&
        exercise.id !== undefined &&
        isCorrectionVisible
      ) {
        window.localStorage.setItem(`${exercise.id}|${exercise.seed}`, 'true')
      }
      await updateDisplay()
    }
  }

  async function setAllInteractif () {
    if (exercise?.interactifReady) isInteractif = true
    await updateDisplay()
  }
  async function removeAllInteractif () {
    if (exercise?.interactifReady) isInteractif = false
    await updateDisplay()
  }

  function handleNewSettings (event: CustomEvent) {
    log('handleNewSettings:' + JSON.stringify(event.detail))
    if (event.detail.nbQuestions) {
      exercise.nbQuestions = event.detail.nbQuestions
      interfaceParams.nbQuestions = exercise.nbQuestions
    }
    if (event.detail.duration) {
      exercise.duration = event.detail.duration
      interfaceParams.duration = exercise.duration
    }
    if (event.detail.sup !== undefined) {
      exercise.sup = event.detail.sup
      interfaceParams.sup = mathaleaHandleSup(exercise.sup)
    }
    if (event.detail.sup2 !== undefined) {
      exercise.sup2 = event.detail.sup2
      interfaceParams.sup2 = mathaleaHandleSup(exercise.sup2)
    }
    if (event.detail.sup3 !== undefined) {
      exercise.sup3 = event.detail.sup3
      interfaceParams.sup3 = mathaleaHandleSup(exercise.sup3)
    }
    if (event.detail.sup4 !== undefined) {
      exercise.sup4 = event.detail.sup4
      interfaceParams.sup4 = mathaleaHandleSup(exercise.sup4)
    }
    if (event.detail.alea !== undefined) {
      exercise.seed = event.detail.alea
      interfaceParams.alea = exercise.seed
    }
    if (event.detail.correctionDetaillee !== undefined) {
      exercise.correctionDetaillee = event.detail.correctionDetaillee
      interfaceParams.cd = exercise.correctionDetaillee ? '1' : '0'
    }
    exercicesParams.update((list) => {
      list[exerciseIndex] = interfaceParams
      return list
    })
    if (isExerciceChecked) {
      // Si on change des réglages alors qu'on a déjà une note à l'exercice
      // alors on part sur de nouvelles données ainsi on efface le score et les réponses proposées
      isExerciceChecked = false
      newData()
    } else {
      updateDisplay()
    }
  }

  async function updateDisplay () {
    if (exercise == null) return
    if (
      exercise.seed === undefined &&
      typeof exercise.applyNewSeed === 'function'
    ) {
      exercise.applyNewSeed()
    }
    seedrandom(exercise.seed, { global: true })
    if (exercise.typeExercice === 'simple') {
      mathaleaHandleExerciceSimple(exercise, Boolean(isInteractif))
    }
    exercise.interactif = isInteractif
    if (interfaceParams.alea !== exercise.seed && exercise.seed !== undefined) {
      // on met à jour le storer seulement si besoin
      exercicesParams.update((list) => {
        list[exerciseIndex].alea = exercise.seed
        return list
      })
    }
    if (interfaceParams.interactif !== (isInteractif ? '1' : '0')) {
      // on met à jour le storer seulement si besoin
      exercicesParams.update((list) => {
        list[exerciseIndex].interactif = isInteractif ? '1' : '0'
        return list
      })
    }
    if (interfaceParams.cols !== columnsCount) {
      // on met à jour le storer seulement si besoin
      if (columnsCount === 1 && interfaceParams.cols !== undefined) {
        exercicesParams.update((list) => {
          list[exerciseIndex].cols = undefined
          return list
        })
      } else if (columnsCount > 1 && interfaceParams.cols !== columnsCount) {
        exercicesParams.update((list) => {
          list[exerciseIndex].cols = columnsCount
          return list
        })
      }
    }
    exercise.numeroExercice = exerciseIndex
    if (
      exercise.typeExercice !== 'simple' &&
      typeof exercise.nouvelleVersionWrapper === 'function'
    ) {
      exercise.nouvelleVersionWrapper(exerciseIndex)
    }
    mathaleaUpdateUrlFromExercicesParams()
    await adjustMathalea2dFiguresWidth()
  }

  function verifExercice () {
    isCorrectionVisible = true
    isExerciceChecked = true
    resultsByExercice.update((l) => {
      const indice = exercise.numeroExercice ?? 0
      const result = {
        ...exerciceInteractif(exercise, divScore, buttonScore),
        indice
      }
      if (result != null) {
        l[indice] = result
      }
      return l
    })
  }

  function initButtonScore () {
    buttonScore.classList.remove(...buttonScore.classList)
    buttonScore.classList.add(
      'inline-flex',
      'px-6',
      'py-2.5',
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
  async function adjustMathalea2dFiguresWidth (
    initialDimensionsAreNeeded: boolean = false
  ) {
    await tick()
    const mathalea2dFigures =
      document?.querySelectorAll<SVGElement>('.mathalea2d')
    if (
      mathalea2dFigures !== null &&
      mathalea2dFigures !== undefined &&
      mathalea2dFigures.length !== 0
    ) {
      for (let k = 0; k < mathalea2dFigures.length; k++) {
        if (initialDimensionsAreNeeded) {
          // réinitialisation
          const initialWidth = mathalea2dFigures[k].getAttribute(
            'data-width-initiale'
          )
          const initialHeight = mathalea2dFigures[k].getAttribute(
            'data-height-initiale'
          )
          mathalea2dFigures[k].setAttribute('width', initialWidth ?? '0')
          mathalea2dFigures[k].setAttribute('height', initialHeight ?? '0')
          // les éléments Katex des figures SVG
          if (
            mathalea2dFigures[k] != null &&
            mathalea2dFigures[k].parentElement != null
          ) {
            const eltsInFigures =
              mathalea2dFigures[k].parentElement?.querySelectorAll<HTMLElement>(
                'div.divLatex'
              ) || []
            for (const elt of eltsInFigures) {
              const e = elt
              e.style.setProperty('top', e.dataset.top + 'px')
              e.style.setProperty('left', e.dataset.left + 'px')
            }
          }
        }
        const consigneDiv = mathalea2dFigures[k].closest('[id^="consigne"]')
        if (
          consigneDiv &&
          mathalea2dFigures[k].clientWidth > consigneDiv.clientWidth
        ) {
          const coef =
            (consigneDiv.clientWidth * 0.95) / mathalea2dFigures[k].clientWidth
          const width = mathalea2dFigures[k].getAttribute('width')
          const height = mathalea2dFigures[k].getAttribute('height')
          if (!mathalea2dFigures[k].dataset.widthInitiale && width != null) {
            mathalea2dFigures[k].dataset.widthInitiale = width
          }
          if (!mathalea2dFigures[k].dataset.heightInitiale && height != null) {
            mathalea2dFigures[k].dataset.heightInitiale = height
          }
          mathalea2dFigures[k].setAttribute(
            'height',
            (
              Number(mathalea2dFigures[k].dataset.heightInitiale) * coef
            ).toString()
          )
          mathalea2dFigures[k].setAttribute(
            'width',
            (
              Number(mathalea2dFigures[k].dataset.widthInitiale) * coef
            ).toString()
          )

          if (
            mathalea2dFigures[k] != null &&
            mathalea2dFigures[k].parentElement !== null
          ) {
            const eltsInFigures =
              mathalea2dFigures[k].parentElement?.querySelectorAll<HTMLElement>(
                'div.divLatex'
              ) || []
            for (const elt of eltsInFigures) {
              const e = elt
              const initialTop = Number(e.dataset.top) ?? 0
              const initialLeft = Number(e.dataset.left) ?? 0
              e.style.setProperty('top', (initialTop * coef).toString() + 'px')
              e.style.setProperty(
                'left',
                (initialLeft * coef).toString() + 'px'
              )
            }
          }
        }
      }
    }
  }
  // pour recalculer les tailles lors d'un changement de dimension de la fenêtre
  window.onresize = async () => {
    await adjustMathalea2dFiguresWidth(true)
  }
</script>

<div class="z-0 flex-1" bind:this={divExercice}>
  <HeaderExerciceVueProf
    {...headerProps}
    on:clickVisible={(event) => {
      isVisible = event.detail.isVisible
    }}
    on:clickSettings={(event) =>
      (isSettingsVisible = event.detail.isSettingsVisible)}
    on:clickCorrection={async (event) => {
      isContentVisible = event.detail.isContentVisible
      isCorrectionVisible = event.detail.isCorrectionVisible
      if (
        isLocalStorageAvailable() &&
        exercise.id !== undefined &&
        isCorrectionVisible
      ) {
        window.localStorage.setItem(`${exercise.id}|${exercise.seed}`, 'true')
      }
      if (isInteractif) {
        isInteractif = !isInteractif
        exercise.interactif = isInteractif
        await updateDisplay()
      }
      await adjustMathalea2dFiguresWidth()
    }}
    on:clickInteractif={async (event) => {
      isInteractif = event.detail.isInteractif
      exercise.interactif = isInteractif
      exercicesParams.update((params) => {
        params[exerciseIndex].interactif = isInteractif ? '1' : '0'
        return params
      })
      await updateDisplay()
    }}
    on:clickNewData={newData}
    interactifReady={Boolean(
      exercise?.interactifReady &&
        !isCorrectionVisible &&
        headerProps?.interactifReady
    )}
    on:exerciseRemoved
  />

  {#if isVisible}
    <div class="flex flex-col-reverse lg:flex-row">
      <div
        class="flex flex-col justify-start items-start relative {isSettingsVisible
          ? 'w-full lg:w-3/4'
          : 'w-full'} duration-500"
        id="exercice{exerciseIndex}"
      >
        <div
          class="print-hidden hidden md:flex flex-row justify-start text-coopmaths-struct dark:text-coopmathsdark-struct text-xs mt-2 pl-0 md:pl-2"
        >
          <button
            class={columnsCount > 1 ? 'visible' : 'invisible'}
            type="button"
            on:click={() => {
              columnsCount--
              updateDisplay()
            }}
          >
            <i
              class=" text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 bx-xs bx-minus"
            />
          </button>
          <i class="bx ml-1 bx-xs bx-columns" />
          <button
            type="button"
            on:click={() => {
              columnsCount++
              updateDisplay()
            }}
          >
            <i
              class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-1 bx-xs bx-plus"
            />
          </button>
        </div>
        <article
          class="lg:text-base relative"
          style="font-size: {(
            $globalOptions.z || 1
          ).toString()}rem; line-height: calc({$globalOptions.z || 1});"
        >
          {#if typeof exercise.consigne !== 'undefined' && exercise.consigne.length !== 0}
            <div>
              <p
                class=" mt-2 mb-2 ml-2 lg:mx-5 text-coopmaths-corpus dark:text-coopmathsdark-corpus"
              >
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html exercise.consigne}
              </p>
            </div>
          {/if}
          {#if exercise.introduction}
            <div>
              <p
                class="mt-2 mb-2 ml-2 lg:mx-5 text-coopmaths-corpus dark:text-coopmathsdark-corpus"
              >
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html exercise.introduction}
              </p>
            </div>
          {/if}
          <div style="columns: {columnsCount.toString()}" class="mb-5">
            <ul
              class="{exercise.listeQuestions.length === 1 ||
              !exercise.listeAvecNumerotation
                ? 'list-none'
                : 'list-decimal'} w-full list-inside mb-2 mx-2 lg:mx-6 marker:text-coopmaths-struct dark:marker:text-coopmathsdark-struct marker:font-bold"
            >
              {#each exercise.listeQuestions as item, i (i + '_' + (exercise.seed || ''))}
                <div
                  style="break-inside:avoid"
                  id="consigne{exerciseIndex}-{i}"
                  class="container w-full grid grid-cols-1 auto-cols-min gap-1 lg:gap-4 mb-2 lg:mb-4 text-coopmaths-corpus dark:text-coopmathsdark-corpus"
                >
                  <li
                    id="exercice{exerciseIndex}Q{i}"
                    style="line-height: {exercise.spacing || 1}"
                  >
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html mathaleaFormatExercice(item)}
                  </li>
                  {#if isCorrectionVisible}
                    <div
                      class="relative border-l-coopmaths-struct dark:border-l-coopmathsdark-struct border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus mt-6 lg:mt-2 mb-6 py-2 pl-4"
                      id="correction${exerciseIndex}Q${i}"
                    >
                      <div
                        class={exercise.consigneCorrection.length !== 0
                          ? 'container bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark px-4 py-2 mr-2 ml-6 mb-2 font-light relative w-2/3'
                          : 'hidden'}
                      >
                        <div
                          class="{exercise.consigneCorrection.length !== 0
                            ? 'container'
                            : 'hidden'} absolute top-4 -left-4"
                        >
                          <i
                            class="bx bx-bulb scale-200 text-coopmaths-warn-dark dark:text-coopmathsdark-warn-dark"
                          />
                        </div>
                        <div class="">
                          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                          {@html exercise.consigneCorrection}
                        </div>
                      </div>
                      <div
                        class="container overflow-x-scroll overflow-y-hidden md:overflow-x-auto py-1"
                        style="line-height: {exercise.spacingCorr ||
                          1}; break-inside:avoid"
                      >
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        {@html mathaleaFormatExercice(
                          exercise.listeCorrections[i]
                        )}
                      </div>
                      <!-- Avant le commit du 28/03/23, il y avait une mise en page plus complexe
                      et cela posait problème au changement des paramètres avec la correction visible -->
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
              {/each}
            </ul>
          </div>
        </article>
        {#if isInteractif && interactifReady && !isCorrectionVisible && isContentVisible}
          <button
            id="verif{exerciseIndex}"
            type="submit"
            on:click={verifExercice}
            bind:this={buttonScore}
            >Vérifier {numberOfAnswerFields > 1
              ? 'les réponses'
              : 'la réponse'}</button
          >
        {/if}
        <div bind:this={divScore} />
      </div>
      <Settings
        exercice={exercise}
        bind:isVisible={isSettingsVisible}
        exerciceIndex={exerciseIndex}
        on:settings={handleNewSettings}
      />
    </div>
  {/if}
</div>

<style>
  li {
    break-inside: avoid;
  }
</style>
