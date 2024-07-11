import loadjs from 'loadjs'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import renderMathInElement from 'katex/dist/contrib/auto-render.js'
import Exercice from '../exercices/deprecatedExercice.js'
import type TypeExercice from '../exercices/Exercice'
// import context from '../modules/context.js'
import seedrandom from 'seedrandom'
import { exercicesParams, freezeUrl, globalOptions, presModeId, updateGlobalOptionsInURL } from './stores/generalStore.js'
import { get } from 'svelte/store'
import { ajouteChampTexteMathLive, remplisLesBlancs } from '../lib/interactif/questionMathLive.js'
import uuidToUrl from '../json/uuidsToUrlFR.json'
import referentielStaticFR from '../json/referentielStaticFR.json'
import referentielStaticCH from '../json/referentielStaticCH.json'
import 'katex/dist/katex.min.css'
import renderScratch from './renderScratch.js'
import { decrypt, isCrypted } from './components/urls.js'
import { convertVueType, type InterfaceGlobalOptions, type InterfaceParams, type VueType } from './types.js'
import { sendToCapytaleMathaleaHasChanged } from './handleCapytale.js'
import { handleAnswers, setReponse } from './interactif/gestionInteractif'
import type { MathfieldElement } from 'mathlive'
import { calculCompare } from './interactif/comparisonFunctions'
import FractionEtendue from '../modules/FractionEtendue'
import Decimal from 'decimal.js'
import Grandeur from '../modules/Grandeur'
import { canOptions } from './stores/canStore.js'
import { getLang, localisedIDToUuid, referentielLocale, updateURLFromReferentielLocale } from './stores/languagesStore.js'
import { delay } from './components/time.js'
import { contraindreValeur } from '../modules/outils.js'
import { isIntegerInRange0to2, isIntegerInRange0to4, isIntegerInRange1to4 } from './types/integerInRange.js'
import { resizeContent } from './components/sizeTools.js'

const ERROR_MESSAGE = 'Erreur - Veuillez actualiser la page et nous contacter si le problème persiste.'

function getExerciceByUuid (root: object, targetUUID: string): object | null {
  if ('uuid' in root) {
    if (root.uuid === targetUUID) {
      return root
    }
  }
  for (const child in root) {
    if (child in root) {
      if (typeof root[child] !== 'object') continue
      const foundObject = getExerciceByUuid(root[child], targetUUID)
      if (foundObject) {
        return foundObject
      }
    }
  }

  return null
}

/*
 Chargement d'un composant SVELTE
 ATTENTION : oliger d'être daans ce répertoire, sinon différence entre le serveur de test et de production
*/
export async function getSvelteComponent (paramsExercice: InterfaceParams) {
  const urlExercice = uuidToUrl[paramsExercice.uuid as keyof typeof uuidToUrl]

  let filename, directory
  if (urlExercice) {
    [filename, directory] = urlExercice.replaceAll('\\', '/').split('/').reverse()
  }
  try {
    if (filename && filename.includes('.svelte')) {
      return (await import(`../exercicesInteractifs/${directory === undefined ? '' : `${directory}/`}${filename.replace('.svelte', '')}.svelte`)).default
    }
  } catch (err) {
    console.log(`Chargement de l'exercice ${paramsExercice.uuid} impossible. Vérifier  ${directory === undefined ? '' : `${directory}/`}${filename}`)
  }
  throw new Error(`Chargement de l'exercice ${paramsExercice.uuid} impossible. Vérifier ${directory === undefined ? '' : `${directory}/`}${filename}`)
}

/**
 * Charge un svelte exercice depuis son uuid
 * Exemple : mathaleaLoadSvelteExerciceFromUuid('clavier')
 * @param {string} uuid
 * @returns {Promise<Exercice>} exercice
 */
export async function mathaleaLoadSvelteExerciceFromUuid (uuid: string) {
  const url = uuidToUrl[uuid as keyof typeof uuidToUrl]
  let filename, directory, isCan
  if (url) {
    [filename, directory, isCan] = url.replaceAll('\\', '/').split('/').reverse()
  }
  let attempts = 0
  const maxAttempts = 3

  while (attempts < maxAttempts) {
    try {
    // L'import dynamique ne peut descendre que d'un niveau, les sous-répertoires de directory ne sont pas pris en compte
    // cf https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#globs-only-go-one-level-deep
    // L'extension doit-être visible donc on l'enlève avant de la remettre...
      let module: any
      if (isCan === 'can') {
        if (filename != null && filename.includes('.ts')) {
          module = await import(`../exercices/can/${directory}/${filename.replace('.ts', '')}.ts`)
        } else if (filename != null) {
          module = await import(`../exercices/can/${directory}/${filename.replace('.js', '')}.js`)
        }
      } else {
        if (filename != null && filename.includes('.ts')) {
          module = await import(`../exercices/${directory}/${filename.replace('.ts', '')}.ts`)
        } else if (filename != null) {
          module = await import(`../exercices/${directory}/${filename.replace('.js', '')}.js`)
        }
      }
      const ClasseExercice = module.default
      const exercice = new ClasseExercice()
        ;['titre', 'amcReady', 'amcType', 'interactifType', 'interactifReady'].forEach((p) => {
        if (module[p] !== undefined) exercice[p] = module[p]
      })
      ;(await exercice).id = filename
      if (exercice.typeExercice && exercice.typeExercice.includes('xcas')) {
        animationLoading(true)
        await loadGiac()
        animationLoading(false)
      }
      return exercice
    } catch (error) {
      attempts++
      window.notify(`Un exercice ne s'est pas affiché ${attempts} fois`, {})
      if (attempts === maxAttempts) {
        console.log(`Chargement de l'exercice ${uuid} impossible. Vérifier ${directory}/${filename}`)
        console.log(error)
        const exercice = new Exercice()
        exercice.titre = ERROR_MESSAGE
        exercice.nouvelleVersion = () => {
        }
        return exercice
      } else {
        await delay(1000)
      }
    }
  }
}

/**
 * Charge un exercice depuis son uuid
 * Exemple : const exercice = loadExercice('3cvng')
 * @param {string} url
 * @returns {Promise<Exercice>} exercice
 */
export async function mathaleaLoadExerciceFromUuid (uuid: string) {
  const url = uuidToUrl[uuid as keyof typeof uuidToUrl]
  let filename, directory, isCan
  if (url) {
    [filename, directory, isCan] = url.replaceAll('\\', '/').split('/').reverse()
  }
  let attempts = 0
  const maxAttempts = 3

  while (attempts < maxAttempts) {
    try {
    // L'import dynamique ne peut descendre que d'un niveau, les sous-répertoires de directory ne sont pas pris en compte
    // cf https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#globs-only-go-one-level-deep
    // L'extension doit-être visible donc on l'enlève avant de la remettre...
      let module
      if (isCan === 'can') {
        if (filename != null && filename.includes('.ts')) {
          module = await import(`../exercices/can/${directory}/${filename.replace('.ts', '')}.ts`)
        } else if (filename != null) {
          module = await import(`../exercices/can/${directory}/${filename.replace('.js', '')}.js`)
        }
      } else {
        if (filename != null && filename.includes('.ts')) {
          module = await import(`../exercices/${directory}/${filename.replace('.ts', '')}.ts`)
        } else if (filename != null) {
          module = await import(`../exercices/${directory}/${filename.replace('.js', '')}.js`)
        }
      }
      const ClasseExercice = module.default
      const exercice = new ClasseExercice()
        ;['titre', 'amcReady', 'amcType', 'interactifType', 'interactifReady'].forEach((p) => {
        if (module[p] !== undefined) exercice[p] = module[p]
      })
      ;(await exercice).id = filename
      if (exercice.typeExercice && exercice.typeExercice.includes('xcas')) {
        animationLoading(true)
        await loadGiac()
        animationLoading(false)
      }
      return exercice
    } catch (error) {
      attempts++
      window.notify(`Un exercice ne s'est pas affiché ${attempts} fois`, {})
      if (attempts === maxAttempts) {
        console.log(`Chargement de l'exercice ${uuid} impossible. Vérifier ${directory}/${filename}`)
        console.log(error)
        const exercice = new Exercice()
        exercice.titre = ERROR_MESSAGE
        exercice.nouvelleVersion = () => {
        }
        return exercice
      } else {
        await delay(1000)
      }
    }
  }
}

/**
 * Charge tous les exercices et les paramètres
 * en fonction du store exercicesParams
 *
 */
export async function mathaleaGetExercicesFromParams (params: InterfaceParams[]): Promise<TypeExercice[]> {
  const exercices = []
  for (const param of params) {
    if (
      param.uuid.substring(0, 4) === 'crpe' ||
            param.uuid.substring(0, 4) === 'dnb_' ||
            param.uuid.substring(0, 4) === 'e3c_' ||
            param.uuid.substring(0, 4) === 'bac_' ||
            param.uuid.substring(0, 7) === 'evacom_' ||
            param.uuid.startsWith('2nd_')
    ) {
      const infosExerciceStatique = (param.uuid.substring(0, 7) === 'evacom_') ? getExerciceByUuid(referentielStaticCH, param.uuid) : getExerciceByUuid(referentielStaticFR, param.uuid)
      let content = ''
      let contentCorr = ''
      if (infosExerciceStatique?.url) {
        const response = await window.fetch(infosExerciceStatique.url)
        if (response.status === 200) {
          const text = await response.clone().text()
          if (!text.trim().startsWith('<!DOCTYPE html>')) {
            content = text
          } else {
            content = '\n\n\t%Exercice non disponible\n\n'
          }
        }
      }
      if (infosExerciceStatique?.urlcor) {
        const response = await window.fetch(infosExerciceStatique.urlcor)
        if (response.status === 200) {
          const text = await response.clone().text()
          if (!text.trim().startsWith('<!DOCTYPE html>')) {
            contentCorr = text
          } else {
            contentCorr = '\n\n\t%Pas de correction disponible\n\n'
          }
        }
      }
      const annee = infosExerciceStatique?.annee
      const lieu = infosExerciceStatique?.lieu
      const mois = infosExerciceStatique?.mois
      const numeroInitial = infosExerciceStatique?.numeroInitial
      let examen: string = ''
      if (param.uuid.substring(0, 4) === 'crpe') examen = 'CRPE'
      if (param.uuid.substring(0, 4) === 'dnb_') examen = 'DNB'
      if (param.uuid.substring(0, 4) === 'e3c_') examen = 'E3C'
      if (param.uuid.substring(0, 4) === 'bac_') examen = 'BAC'
      if (param.uuid.substring(0, 7) === 'evacom_') examen = 'EVACOM'
      exercices.push({ typeExercice: 'statique', uuid: param.uuid, content, contentCorr, annee, lieu, mois, numeroInitial, examen })
    } else {
      const exercice = await mathaleaLoadExerciceFromUuid(param.uuid)
      if (typeof exercice === 'undefined') continue
      mathaleaHandleParamOfOneExercice(exercice, param)
      exercices.push(exercice)
    }
  }
  return exercices
}

/**
 * Applique les paramètres sauvegardés dans un élément de exercicesParams à un exercice
 */
export function mathaleaHandleParamOfOneExercice (exercice: TypeExercice, param: InterfaceParams) {
  exercice.uuid = param.uuid
  if (param.nbQuestions) exercice.nbQuestions = param.nbQuestions
  exercice.duration = param.duration ?? 10
  if (param.id) exercice.id = param.id
  if (param.sup) exercice.sup = mathaleaHandleStringFromUrl(param.sup)
  if (param.sup2) exercice.sup2 = mathaleaHandleStringFromUrl(param.sup2)
  if (param.sup3) exercice.sup3 = mathaleaHandleStringFromUrl(param.sup3)
  if (param.sup4) exercice.sup4 = mathaleaHandleStringFromUrl(param.sup4)
  if (param.interactif) exercice.interactif = param.interactif === '1'
  if (param.alea) exercice.seed = param.alea
  if (param.cols !== undefined && param.cols > 1) exercice.nbCols = param.cols
  if (param.cd !== undefined) exercice.correctionDetaillee = param.cd === '1'
  if (exercice.seed === undefined) {
    exercice.seed = mathaleaGenerateSeed()
  }
}

/**
 * sup, sup2, sup3 et sup4 permettent de sauvegarder les formulaires modifiées par
 * les enseignants pour pparamétrer les exercices.
 * Ces paramètres peuvent être des string, des booléens ou des number mais que ce soit dans l'url
 * ou dans le store exercicesParams, ils sont sauvegardés sous forme de string d'où cette fonction de conversion
 * d'un des trois types vers string
 */
export function mathaleaHandleSup (param: boolean | string | number): string {
  if (typeof param === 'string') {
    return param
  } else if (typeof param === 'number') {
    return param.toString()
  } else if (typeof param === 'boolean') {
    return param ? 'true' : 'false'
  }
}

/**
 * sup, sup2, sup3 et sup4 permettent de sauvegarder les formulaires modifiées par
 * les enseignants pour pparamétrer les exercices.
 * Ces paramètres peuvent être des string, des booléens ou des number mais que ce soit dans l'url
 * ou dans le store exercicesParams, ils sont sauvegardés sous forme de string d'où cette fonction de conversion
 * su string vers booléen ou number
 */
export function mathaleaHandleStringFromUrl (text: string): boolean | number | string {
  if (text === 'true' || text === 'false') {
    // "true"=>true
    return text === 'true'
  } else if (/^\d+$/.test(text)) {
    // "17"=>17
    return parseInt(text)
  } else {
    return text
  }
}

export function mathaleaRenderDiv (div: HTMLElement | null, zoom?: number): void {
  if (!div) return
  const params = get(globalOptions)
  zoom = zoom ?? Number(params.z)

  renderKatex(div)
  renderScratch('body')
  if (zoom !== -1) {
    resizeContent(div, zoom)
  }
}

function renderKatex (element: HTMLElement) {
  renderMathInElement(element, {
    delimiters: [
      { left: '\\[', right: '\\]', display: true },
      { left: '$', right: '$', display: false }
    ],
    // Les accolades permettent d'avoir une formule non coupée
    preProcess: (chaine: string) => '{' + chaine.replaceAll(String.fromCharCode(160), '\\,') + '}',
    throwOnError: true,
    errorColor: '#CC0000',
    strict: 'warn',
    trust: false
  })
  document.dispatchEvent(new window.Event('katexRendered'))
}

/**
 * Modifie l'url courante avec le store exercicesParams ou un tableau similaire
 * sauf si le store freezeUrl est à true (utile sur un site externe)
 */
export function mathaleaUpdateUrlFromExercicesParams (params?: InterfaceParams[]) {
  if (get(globalOptions).recorder === 'capytale') {
    sendToCapytaleMathaleaHasChanged()
  }
  if (get(freezeUrl) === true) return
  if (params === undefined) {
    params = get(exercicesParams)
  }
  const url = new URL(window.location.protocol + '//' + window.location.host + window.location.pathname)
  for (const ex of params) {
    url.searchParams.append('uuid', ex.uuid)
    if (ex.id != null) url.searchParams.append('id', ex.id)
    if (ex.nbQuestions !== undefined) url.searchParams.append('n', ex.nbQuestions.toString())
    if (ex.duration != null) url.searchParams.append('d', ex.duration.toString())
    if (ex.sup != null) url.searchParams.append('s', ex.sup)
    if (ex.sup2 != null) url.searchParams.append('s2', ex.sup2)
    if (ex.sup3 != null) url.searchParams.append('s3', ex.sup3)
    if (ex.sup4 != null) url.searchParams.append('s4', ex.sup4)
    if (ex.alea != null) url.searchParams.append('alea', ex.alea)
    if (ex.interactif === '1') url.searchParams.append('i', '1')
    if (ex.cd != null) url.searchParams.append('cd', ex.cd)
    if (ex.cols != null) url.searchParams.append('cols', ex.cols.toString())
  }
  updateURLFromReferentielLocale(url)
  updateGlobalOptionsInURL(url)
}

/**
 * Analyse l'url courante de la fenêtre
 * pour mettre à jour exercicesParams
 * avec tous les exercices et les options
 * @returns vue
 */
export function mathaleaUpdateExercicesParamsFromUrl (urlString = window.location.href): InterfaceGlobalOptions {
  const currentRefToUuid = localisedIDToUuid[get(referentielLocale)]
  let urlNeedToBeFreezed = false
  let v: VueType | undefined
  let z = '1'
  let durationGlobal = 0
  let ds
  let nbVues: 1 | 2 | 3 | 4 = 1
  let flow: 0 | 1 | 2 = 0
  let screenBetweenSlides
  let sound: 0 | 1 | 2 | 3 | 4 = 0
  let shuffle = false
  let manualMode
  let select: number[] = []
  let order: number[] = []
  let title = ''
  let iframe = ''
  let answers = ''
  let recorder: 'capytale' | 'moodle' | 'labomep' | 'anki'
  let done: '1'
  let es
  let presMode: 'liste_exos' | 'un_exo_par_page' | 'liste_questions' | 'une_question_par_page' | 'recto' | 'verso' = 'liste_exos'
  let setInteractive = '2'
  let isSolutionAccessible = true
  let isInteractiveFree = true
  let oneShot = false
  let twoColumns = false
  let isTitleDisplayed = true
  let beta = false
  let url: URL
  let canDuration = 540
  let canTitle = ''
  let canSolAccess = true
  let canSolMode = 'gathered'
  let canIsInteractive = true
  try {
    url = new URL(urlString)
  } catch (error) {
    return {} // @fixme null n'est vraiment pas compatible avec la signature de la fonction, mais il faudrait sans doute traîter l'erreur mieux que ça
  }
  // let url = new URL(urlString)
  if (isCrypted(url)) {
    urlNeedToBeFreezed = true
  }
  url = decrypt(url)
  const entries = url.searchParams.entries()
  let indiceExercice = -1
  const newListeExercice: InterfaceParams[] = []
  let previousEntryWasUuid = false
  for (const entry of entries) {
    if (entry[0] === 'uuid') {
      indiceExercice++
      const uuid = entry[1]
      const id = (Object.keys(currentRefToUuid) as (keyof typeof currentRefToUuid)[]).find((key) => {
        return currentRefToUuid[key] === uuid
      })
      if (!newListeExercice[indiceExercice]) newListeExercice[indiceExercice] = { uuid, id }
      newListeExercice[indiceExercice].uuid = uuid // string
      newListeExercice[indiceExercice].id = id // string
      newListeExercice[indiceExercice].interactif = '0' // par défaut
    } else if (entry[0] === 'id' && !previousEntryWasUuid) {
      // En cas de présence d'un uuid juste avant, on ne tient pas compte de l'id
      indiceExercice++
      const id = entry[1]
      const uuid = currentRefToUuid[id as keyof typeof currentRefToUuid]
      if (!newListeExercice[indiceExercice]) newListeExercice[indiceExercice] = { id, uuid }
    } else if (entry[0] === 'n') {
      newListeExercice[indiceExercice].nbQuestions = parseInt(entry[1]) // int
    } else if (entry[0] === 'd') {
      newListeExercice[indiceExercice].duration = parseInt(entry[1]) // int
    } else if (entry[0] === 's') {
      newListeExercice[indiceExercice].sup = entry[1]
    } else if (entry[0] === 's2') {
      newListeExercice[indiceExercice].sup2 = entry[1]
    } else if (entry[0] === 's3') {
      newListeExercice[indiceExercice].sup3 = entry[1]
    } else if (entry[0] === 's4') {
      newListeExercice[indiceExercice].sup4 = entry[1]
    } else if (entry[0] === 'alea') {
      newListeExercice[indiceExercice].alea = entry[1]
    } else if (entry[0] === 'cols') {
      newListeExercice[indiceExercice].cols = parseInt(entry[1])
    } else if (entry[0] === 'i' && (entry[1] === '0' || entry[1] === '1')) {
      newListeExercice[indiceExercice].interactif = entry[1]
    } else if (entry[0] === 'cd' && (entry[1] === '0' || entry[1] === '1')) {
      newListeExercice[indiceExercice].cd = entry[1]
    } else if (entry[0] === 'v') {
      v = convertVueType(entry[1])
    } else if (entry[0] === 'recorder') {
      if (entry[1] === 'capytale' || entry[1] === 'moodle' || entry[1] === 'labomep' || entry[1] === 'anki') {
        recorder = entry[1]
      }
    } else if (entry[0] === 'done' && entry[1] === '1') {
      done = '1'
    } else if (entry[0] === 'z') {
      z = entry[1]
    } else if (entry[0] === 'dGlobal') {
      durationGlobal = parseInt(entry[1])
    } else if (entry[0] === 'shuffle') {
      shuffle = true
    } else if (entry[0] === 'select') {
      select = entry[1].split('-').map((e) => parseInt(e))
    } else if (entry[0] === 'order') {
      order = entry[1].split('-').map((e) => parseInt(e))
    } else if (entry[0] === 'ds') {
      ds = entry[1]
    } else if (entry[0] === 'es') {
      es = entry[1]
    } else if (entry[0] === 'title') {
      title = entry[1]
    } else if (entry[0] === 'iframe') {
      iframe = entry[1]
    } else if (entry[0] === 'answers') {
      answers = entry[1]
    } else if (entry[0] === 'beta') {
      beta = true
    } else if (entry[0] === 'canD') {
      canDuration = parseInt(entry[1])
    } else if (entry[0] === 'canT') {
      canTitle = entry[1]
    } else if (entry[0] === 'canSA') {
      canSolAccess = entry[1] === '1'
    } else if (entry[0] === 'canSM') {
      canSolMode = entry[1]
    } else if (entry[0] === 'canI') {
      canIsInteractive = entry[1] === '1'
    }

    if (entry[0] === 'uuid') previousEntryWasUuid = true
    else previousEntryWasUuid = false
  }
  exercicesParams.update(() => {
    return newListeExercice
  })
  if (urlNeedToBeFreezed) {
    freezeUrl.set(true)
  }

  if (v === 'can' || get(globalOptions).recorder === 'capytale') {
    canOptions.update(e => {
      e.durationInMinutes = canDuration
      e.isInteractive = canIsInteractive
      e.solutionsAccess = canSolAccess
      if (canSolMode === 'gathered') e.solutionsMode = 'gathered'
      else e.solutionsMode = 'split'
      e.subTitle = canTitle
      return e
    })
  }

  if (ds) {
    const nbVuesCandidate = contraindreValeur(1, 4, ds.charAt(0), 1)
    const flowCandidate = contraindreValeur(0, 2, ds.charAt(1), 0)
    const soundCandidate = contraindreValeur(0, 4, ds.charAt(3), 0)
    if (isIntegerInRange1to4(nbVuesCandidate)) nbVues = nbVuesCandidate
    if (isIntegerInRange0to2(flowCandidate)) flow = flowCandidate
    if (isIntegerInRange0to4(soundCandidate)) sound = soundCandidate
    screenBetweenSlides = ds.charAt(2) === '1'
    shuffle = ds.charAt(4) === '1'
    manualMode = ds.charAt(5) === '1'
  }

  /**
     * es permet de résumer les réglages de la vue élève
     * Il est de la forme 210110
     * Avec un caractère par réglage presMode|setInteractive|isSolutionAccessible|isInteractiveFree|oneShot|twoColumns|isTitleDisplayed
     */
  if (es && es.length === 6) {
    presMode = presModeId[parseInt(es.charAt(0))]
    setInteractive = es.charAt(1)
    isSolutionAccessible = es.charAt(2) === '1'
    isInteractiveFree = es.charAt(3) === '1'
    oneShot = es.charAt(4) === '1'
    twoColumns = es.charAt(5) === '1'
  } else if (es && es.length === 7) {
    presMode = presModeId[parseInt(es.charAt(0))]
    setInteractive = es.charAt(1)
    isSolutionAccessible = es.charAt(2) === '1'
    isInteractiveFree = es.charAt(3) === '1'
    oneShot = es.charAt(4) === '1'
    twoColumns = es.charAt(5) === '1'
    isTitleDisplayed = es.charAt(6) === '1'
  }
  return {
    v,
    z,
    durationGlobal,
    ds,
    nbVues,
    flow,
    screenBetweenSlides,
    sound,
    shuffle,
    manualMode,
    select,
    order,
    title,
    presMode,
    setInteractive,
    isSolutionAccessible,
    isInteractiveFree,
    oneShot,
    twoColumns,
    isTitleDisplayed,
    recorder,
    done,
    beta,
    iframe,
    answers
  }
}

/**
 * Les exercice qui ont le paramètre typeExercice égale à 'simple'
 * ne définissent qu'une seule question.
 * Avec cette fonction, on permet la création de plusieurs questions.
 */
export function mathaleaHandleExerciceSimple (exercice: TypeExercice, isInteractif: boolean, numeroExercice?: number) {
  if (numeroExercice !== undefined) exercice.numeroExercice = numeroExercice
  exercice.reinit()
  exercice.interactif = isInteractif
  for (let i = 0, cptSecours = 0; i < exercice.nbQuestions && cptSecours < 50;) {
    const compare = exercice.compare == null ? calculCompare : exercice.compare
    seedrandom(String(exercice.seed) + i + cptSecours, { global: true })
    if (exercice.nouvelleVersion && typeof exercice.nouvelleVersion === 'function') exercice.nouvelleVersion(numeroExercice)
    if (exercice.questionJamaisPosee(i, String(exercice.question))) {
      if (exercice.compare != null) { /// DE LA AU PROCHAIN LA, ce sera à supprimer quand il n'y aura plus de this.compare
        let reponse = {}
        if (typeof exercice.reponse !== 'string') {
          if (exercice.reponse instanceof FractionEtendue) {
            reponse = { reponse: { value: exercice.reponse.texFraction, compare } }
          } else if (exercice.reponse instanceof Decimal) {
            reponse = { reponse: { value: exercice.reponse.toString(), compare } }
          } else if (exercice.reponse instanceof Grandeur) {
            reponse = { reponse: { value: exercice.reponse, compare } }
          } else if (typeof exercice.reponse === 'object') { // Si c'est handleAnswer qu'on veut utiliser directement avec un fillInTheBlank par exemple, on met l'objet reponse complet dans this.reponse
            reponse = exercice.reponse
          } else if (Array.isArray(exercice.reponse)) {
            reponse = { reponse: { value: exercice.reponse[0] } }
          } else {
            window.notify(`MathaleaHandleExerciceSimple n'a pas réussi à déterminer le type de exercice.reponse, dans ${exercice?.numeroExercice + 1} - ${exercice.titre} ${JSON.stringify(exercice.reponse)}, on Stingifie, mais c'est sans doute une erreur à rectifier`, { exercice: JSON.stringify(exercice) })
            reponse = { reponse: { value: String(exercice.reponse), compare } }
          }
        } else {
          reponse = { reponse: { value: exercice.reponse, compare } }
        }
        handleAnswers(exercice, i, reponse, { formatInteractif: exercice.formatInteractif ?? 'mathlive' }) /// // PROCHAIN LA : La partie ci-dessus sera à supprimer quand il n'y aura plus de this.compare
      } else if (exercice.reponse instanceof Object && exercice.reponse.reponse != null && exercice.reponse.reponse.value != null && typeof exercice.reponse.reponse.value === 'string') {
        handleAnswers(exercice, i, exercice.reponse)
      } else {
        setReponse(exercice, i, exercice.reponse, { formatInteractif: exercice.formatInteractif ?? 'calcul' })
      }

      if (exercice.formatInteractif !== 'fillInTheBlank') {
        if (exercice.formatInteractif !== 'qcm') {
          exercice.listeQuestions.push(
            exercice.question + ajouteChampTexteMathLive(exercice, i, exercice.formatChampTexte || '', exercice.optionsChampTexte || {})
          )
        } else {
          exercice.listeQuestions.push(exercice.question)
        }
      } else {
        // La question doit contenir une unique variable %{champ1} On est en fillInTheBlank
        exercice.listeQuestions.push(remplisLesBlancs(exercice, i, exercice.question, 'fillInTheBlank ' + exercice.formatChampTexte || '', '\\ldots'))
        if (typeof exercice.reponse === 'object' && 'champ1' in exercice.reponse) {
          handleAnswers(exercice, i, exercice.reponse, { formatInteractif: 'fillInTheBlank' })
        } else {
          handleAnswers(exercice, i, { champ1: { value: exercice.reponse, compare } }, { formatInteractif: 'fillInTheBlank' })
        }
      }
      exercice.listeCorrections.push(exercice.correction ?? '')
      exercice.listeCanEnonces.push(exercice.canEnonce ?? '')
      exercice.listeCanReponsesACompleter.push(exercice.canReponseACompleter ?? '')
      cptSecours = 0
      i++
    } else {
      cptSecours++
    }
  }
}

/**
 * Génère un string de 4 caractères qui sera utilisé comme seed pour l'aléatoire
 */
export function mathaleaGenerateSeed ({ includeUpperCase = true, includeNumbers = true, length = 4, startsWithLowerCase = false }: { includeUpperCase?: boolean, includeNumbers?: boolean, length?: number, startsWithLowerCase?: boolean } = {}) {
  let a = 10
  const b = 'abcdefghijklmnopqrstuvwxyz'
  let c = ''
  let d = 0
  let e = '' + b
  if (startsWithLowerCase) {
    c = b[Math.floor(Math.random() * b.length)]
    d = 1
  }
  if (length) {
    a = length
  }
  if (includeUpperCase) {
    e += b.toUpperCase()
  }
  if (includeNumbers) {
    e += '1234567890'
  }

  for (; d < a; d++) {
    c += e[Math.floor(Math.random() * e.length)]
  }
  return c
}

/**
 * Pour la sortie HTML, il faut modifier certains codages LaTeX non pris en charge par KaTeX
 * @param {string} texte
 * @returns string
 */
// Define the function with the condition check
export function mathaleaFormatExercice (texte = ' ') {
  const lang = getLang()
  // Replace symbols based on general rules
  let formattedText = texte
    .replace(/\\dotfill/g, '..............................')
    .replace(/\\not=/g, '≠')
    .replace(/\\ldots/g, '....')
    .replaceAll(' ?', '&nbsp;?')
    .replaceAll(' !', '&nbsp;!')
    .replaceAll(' ;', '&nbsp;;')
    .replaceAll(' :', '&nbsp;:')

  // Check if the language is 'fr-CH' and replace \times with \cdot if true
  if (lang === 'fr-CH') {
    formattedText = formattedText.replace(/\\times/g, '\\cdot')
  }

  return formattedText
}

/**
 * Gérer le changement d'affichage (quel composant remplace l'autre dans App.svelte)
 * @param {string} oldComponent composant à changer
 * @param {string} newComponent composant à afficher
 */
export function mathaleaHandleComponentChange (oldComponent: string, newComponent: string) {
  const oldPart = '&v=' + oldComponent
  const newPart = newComponent === '' ? '' : '&v=' + newComponent
  const urlString = window.location.href.replace(oldPart, newPart)
  window.history.pushState(null, '', urlString)
  globalOptions.update((l) => {
    l.v = newComponent
    return l
  })
}

export function mathaleaWriteStudentPreviousAnswers (answers?: { [key: string]: string }) {
  for (const answer in answers) {
    // La réponse correspond à un champs texte
    const field = document.querySelector(`#champTexte${answer}`) as MathfieldElement | HTMLInputElement
    if (field !== null) {
      if ('setValue' in field) {
        // C'est un MathfieldElement (créé avec ajouteChampTexteMathLive)
        field.setValue(answers[answer])
      }
    } else {
      // La réponse correspond à une case à cocher qui doit être cochée
      const checkBox = document.querySelector(`#check${answer}`) as HTMLInputElement
      if (checkBox !== null && answers[answer] === '1') {
        checkBox.checked = true
      } else {
      // La réponse correspond à une liste déroulante
        const select = document.querySelector(`select#${answer}`) as HTMLSelectElement
        if (select !== null) {
          select.value = answers[answer]
        }
      }
    }
    if (answer.includes('apigeom')) {
      // La réponse correspond à une figure
      const event = new CustomEvent(answer, { detail: answers[answer] })
      document.dispatchEvent(event)
    }
  }
}

/**
 * Nos applis prédéterminées avec la liste des fichiers à charger
 */
const apps = {
  giac: './assets/externalJs/giacsimple.js',
  mathgraph: 'https://www.mathgraph32.org/js/mtgLoad/mtgLoad.min.js'
  // prism: ['/assets/externalJs/prism.js', '/assets/externalJs/prism.css'],
  // scratchblocks: 'assets/externalJs/scratchblocks-v3.5-min.js',
  // slick: ['/assets/externalJs/semantic-ui/semantic.min.css', '/assets/externalJs/semantic-ui/semantic.min.js', '/assets/externalJs/semantic-ui/components/state.min.js']
}

/**
 * Charge une appli listée dans apps (pour mutualiser l'appel de loadjs)
 * @private
 * @param {string} name
 * @return {Promise<undefined, Error>} promesse de chargement
 */
async function load (name: 'giac' | 'mathgraph') {
  // on est dans une fct async, si l'une de ces deux lignes plantent ça va retourner une promesse rejetée avec l'erreur
  if (!apps[name]) throw Error(`application ${name} inconnue`)
  // cf https://github.com/muicss/loadjs
  try {
    if (!loadjs.isDefined(name)) await loadjs(apps[name], name, { returnPromise: true })
  } catch (error) {
    console.error(error)
    throw new Error(`Le chargement de ${name} a échoué`)
  }
  // loadjs.ready veut une callback, on emballe ça dans une promesse
  return new Promise((resolve, reject) => {
    loadjs.ready(name, {
      // @ts-ignore
      success: resolve,
      // si le chargement précédent a réussi on voit pas trop comment on pourrait arriver là, mais ça reste plus prudent de gérer l'erreur éventuelle
      error: () => reject(new Error(`Le chargement de ${name} a échoué`))
    })
  })
}

/**
 * Attend que xcas soit chargé (max 60s), car giacsimple lance le chargement du wasm|js suivant les cas
 * @return {Promise<undefined,Error>} rejette en cas de timeout
 */
function waitForGiac () {
  /* global Module */
  // @ts-ignore
  if (typeof Module !== 'object' || typeof Module.ready !== 'boolean') return Promise.reject(Error('Le loader giac n’a pas été correctement appelé'))
  const timeout = 60 // en s
  const tsStart = Date.now()
  return new Promise((resolve, reject) => {
    const monInterval = setInterval(() => {
      const delay = Math.round((Date.now() - tsStart) / 1000)
      // @ts-ignore
      if (Module.ready === true) {
        clearInterval(monInterval)
        // @ts-ignore
        resolve()
      } else if (delay > timeout) {
        clearInterval(monInterval)
        reject(Error(`xcas n’est toujours pas chargé après ${delay}s`))
      }
    }, 500)
  })
}

/**
 * Charge giac
 * @return {Promise} qui peut échouer…
 */
export async function loadGiac () {
  await load('giac')
  // attention, le load précédent résoud la promesse lorsque giacsimple est chargé,
  // mais lui va charger le webAssembly ou js ensuite, d'où le besoin de waitForGiac
  await waitForGiac()
}

function animationLoading (state: boolean) {
  if (state) {
    document.getElementById('loading').classList.remove('hidden')
  } else {
    document.getElementById('loading').classList.add('hidden')
  }
}
