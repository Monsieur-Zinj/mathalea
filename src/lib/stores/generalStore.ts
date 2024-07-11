import { get, writable } from 'svelte/store'
import type {
  CallerComponentType,
  InterfaceGlobalOptions,
  InterfaceParams,
  InterfaceResultExercice,
  bibliothequeExercise
} from '../types'
import { type JSONReferentielEnding } from '../types/referentiels'
import { canOptions } from './canStore'

/**
 * Pour bloquer la mise à jour de l'url
 */
export const freezeUrl = writable<boolean>(false)

/**
 * Pour signaler que MathALÉA est dans une iframe
 */
export const isInIframe = writable<boolean>(false)

/**
 * exercicesParams est un tableau d'objets décrivant les exercices
 * {id, uuid, alea, interactif, cd, sup, sup2, sup3, sup4, n}
 */
export const exercicesParams = writable<InterfaceParams[]>([])

// tenir le compte des changements dans la liste : ajout/retrait -> +1
export const changes = writable<number>(0)

/**
 * * `v`: vue
 * * `z`: zoom
 * * `title` : titre pour la vue élève uniquement
 * * `presMode` : type d'affichage pour la vue eleve uniquement (page, exos, liste, questions)
 * * `setInteractive` : uniquement pour la vue eleve (0 : pas d'interactivité, 1 : tout interactif, 2 : au choix exercice par exercice)
 * * `isSolutionAccessible` : uniquement pour la vue eleve, pour savoir si les corrections sont disponibles ou pas
 * * `isInteractiveFree` : uniquement pour la vue eleve, pour savoir si l'élève peut changer l'interactivité ou pas
 * * `oneShot` : uniquement pour la vue eleve, pour savoir si l'élève peut répondre une ou plusieurs fois en interactif.
 * * `twoColumns` : dans les vues élèves avec tous les exercices/questions sur une même page, on adopte la présentation du texte sur deux colonnes
 *
 * `globalOptions` est utilisé dans `Mathalea.updateUrl()` et dans `Mathalea.loadExercicesFromUrl()`
 * Il permet de sauvegarder le type de vue (`v=...`)
 *
 * Le paramètre `es` est utilisé pour renseigner les réglages de la vue élève :
 * une unique chaîne de caractères contient dans l'ordre : titre + mode présentation + interactivité +  accès solutions + affichage deux colonnes
 */
export const globalOptions = writable<InterfaceGlobalOptions>({
  v: undefined,
  z: '1',
  title: 'Évaluation',
  presMode: 'un_exo_par_page',
  setInteractive: '2',
  isSolutionAccessible: true,
  isInteractiveFree: true,
  isTitleDisplayed: true,
  oneShot: false,
  twoColumns: false,
  beta: false,
  lang: 'fr-FR'
})

// pour la gestion du mode sombre
export const darkMode = writable({ isActive: false })

export const capytaleMode = writable<
  'none' | 'create' | 'assignment' | 'review' | 'view'
>('none')

// sauvegarde des résultats des exercices
export const resultsByExercice = writable<InterfaceResultExercice[]>([])

// vue Élève : détecter la nécessité d'un menu
export const isMenuNeededForExercises = writable<boolean>(false)
export const isMenuNeededForQuestions = writable<boolean>(false)
export const isSettingsMenuVisible = writable<boolean>(false)
export const isExportMenuVisible = writable<boolean>(false)

// pour garder trace du statut d'ouverture du menu de choix
export const isSideMenuVisible = writable<boolean>(true)

// pour garder trace de la page appelant l'export
export const callerComponent = writable<CallerComponentType>('')

// pour sauvegarder l'objet correspondant à la rubrique choisie pour les exos statiques
export const bibliothequeSectionContent = writable<bibliothequeExercise[]>([])
export const bibliothequeDisplayedContent =
  writable<Record<string, JSONReferentielEnding>>()
export const bibliothequePathToSection = writable<string[]>([])

/**
 * Déplace un exercice dans exercicesParams
 */
export function moveExercice (
  liste: InterfaceParams[],
  iDepart: number,
  iArrivee: number
): InterfaceParams[] {
  liste.splice(iArrivee, 0, liste.splice(iDepart, 1)[0])
  return liste
}

let urlToWrite: URL
let timerId: ReturnType<typeof setTimeout> | undefined

/**
 * Complète l'URL courante avec les éléments relatifs au diaporama
 */
export function updateGlobalOptionsInURL (url: URL) {
  const options = get(globalOptions)
  const canStore = get(canOptions)
  if (options.v) {
    url.searchParams.append('v', options.v)
  } else {
    url.searchParams.delete('v')
  }
  if (options.z && options.z !== '1') {
    url.searchParams.append('z', options.z)
  } else {
    url.searchParams.delete('z')
  }
  if (options.durationGlobal) {
    url.searchParams.append('dGlobal', options.durationGlobal.toString())
  } else {
    url.searchParams.delete('dGlobal')
  }
  if (options.v === 'eleve') {
    if (options.title != null && options.title.length > 0) {
      url.searchParams.append('title', options.title)
    } else {
      url.searchParams.delete('title')
    }
    if (options.iframe !== undefined && options.iframe.length > 0) {
      url.searchParams.append('iframe', options.iframe)
    } else {
      url.searchParams.delete('iframe')
    }
    if (options.answers !== undefined && options.answers.length > 0) {
      url.searchParams.append('answers', JSON.stringify(options.answers))
    } else {
      url.searchParams.delete('answers')
    }
    if (typeof options !== 'undefined') {
      let es = ''
      if (options.presMode != null) {
        es = presModeId.indexOf(options.presMode).toString()
      } else es = '1'
      es += options.setInteractive
      es += options.isSolutionAccessible ? '1' : '0'
      es += options.isInteractiveFree ? '1' : '0'
      es += options.oneShot ? '1' : '0'
      es += options.twoColumns ? '1' : '0'
      es += options.isTitleDisplayed ? '1' : '0'
      url.searchParams.append('es', es)
    }
    if (options.done) {
      url.searchParams.append('done', options.done)
    } else {
      url.searchParams.delete('done')
    }
  } else {
    url.searchParams.delete('title')
    url.searchParams.delete('es')
    url.searchParams.delete('iframe')
    url.searchParams.delete('answers')
    url.searchParams.delete('recorder')
    url.searchParams.delete('done')
  }
  if (options.v === 'can') {
    if (canStore) {
      url.searchParams.append('canD', canStore.durationInMinutes.toString())
      url.searchParams.append('canT', canStore.subTitle)
      url.searchParams.append('canSA', canStore.solutionsAccess ? '1' : '0')
      url.searchParams.append('canSM', canStore.solutionsMode)
      url.searchParams.append('canI', canStore.isInteractive ? '1' : '0')
    }
  }
  if (options.recorder) {
    url.searchParams.append('recorder', options.recorder)
  } else {
    url.searchParams.delete('recorder')
  }
  if (options.v === 'diaporama' || options.v === 'overview') {
    let ds = ''
    ds += options.nbVues?.toString() ?? '1'
    ds += options.flow?.toString() ?? '0'
    ds += options.screenBetweenSlides ? '1' : '0'
    ds += options.sound?.toString() ?? '0'
    ds += options.shuffle ? '1' : '0'
    ds += options.manualMode ? '1' : '0'
    url.searchParams.append('ds', ds)
    if (options.select !== undefined && options.select !== undefined && options.select.length > 0 && options.select.length < get(exercicesParams).length) {
      url.searchParams.append('select', options.select.join('-'))
    }
    if (options.order !== undefined && options.order.length > 0 && options.shuffle) {
      url.searchParams.append('order', options.order.join('-'))
    }
  } else {
    url.searchParams.delete('ds')
    url.searchParams.delete('select')
    url.searchParams.delete('order')
  }
  if (options.beta) {
    url.searchParams.append('beta', '1')
  }
  const currentUrl = new URL(window.location.href)
  if (currentUrl.searchParams.has('triche')) {
    url.searchParams.append('triche', '1')
  }
  urlToWrite = url
  // On ne met à jour l'url qu'une fois toutes les 0,5 s
  // pour éviter l'erreur Attempt to use history.pushState() more than 100 times per 30 seconds
  if (timerId === undefined) {
    timerId = setTimeout(() => {
      window.history.pushState({}, '', urlToWrite)
      timerId = undefined
    }, 500)
  }
}

export const presModeId: [
  'liste_exos',
  'un_exo_par_page',
  'liste_questions',
  'une_question_par_page',
  'recto',
  'verso'
  // 'cartes'
] = [
  'liste_exos',
  'un_exo_par_page',
  'liste_questions',
  'une_question_par_page',
  'recto',
  'verso'
  // 'cartes'
]
