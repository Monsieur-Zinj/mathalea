import { get, writable } from 'svelte/store'
import type {
  CallerComponentType,
  DisplayedFilter,
  InterfaceGlobalOptions,
  InterfaceParams,
  InterfaceResultExercice,
  bibliothequeExercise,
  FilterType,
  FilterObject
} from '../lib/types'
import { type Features, type Level, type JSONReferentielObject } from '../lib/types/referentiels'

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
  v: '',
  z: '1',
  title: 'Évaluation',
  presMode: 'un_exo_par_page',
  setInteractive: '2',
  isSolutionAccessible: true,
  isInteractiveFree: true,
  oneShot: false,
  twoColumns: false
})

// utilisé pour les aller-retours entre le composant Diaporam et le composant Can
export const questionsOrder = writable({
  isQuestionsShuffled: false,
  indexes: []
})

interface InterfaceSelectedExercises {
  isActive: boolean
  indexes: number[]
  count?: number
}

export const selectedExercises = writable<InterfaceSelectedExercises>({
  isActive: false,
  indexes: [],
  count: 1
})

interface InterfaceTransitionsBetweenQuestions {
  isActive: boolean
  isNoisy: boolean
  isQuestThenSolModeActive: boolean
  questThenQuestAndSolDisplay: boolean
  tune: '0' | '1' | '2' | '3'
}

export const transitionsBetweenQuestions =
  writable<InterfaceTransitionsBetweenQuestions>({
    isActive: true,
    isNoisy: false,
    isQuestThenSolModeActive: false,
    questThenQuestAndSolDisplay: false,
    tune: '0'
  })

// pour la gestion du mode sombre
export const darkMode = writable({ isActive: false })

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
export const bibliothequeDisplayedContent = writable<JSONReferentielObject>()
export const bibliothequePathToSection = writable<string[]>([])
export const isModalForStaticsVisible = writable<boolean>(false)

// pour sauvegarder les sélections de filtres
export const allFilters = writable<
  Record<FilterType, DisplayedFilter<string | Level>>
>({
  levels: {
    '6e': {
      title: 'Sixième',
      values: ['6e'],
      isSelected: false,
      clicked: 0
    },
    '5e': {
      title: 'Cinquième',
      values: ['5e'],
      isSelected: false,
      clicked: 0
    },
    '4e': {
      title: 'Quatrième',
      values: ['4e'],
      isSelected: false,
      clicked: 0
    },
    '3e': {
      title: 'Troisième',
      values: ['3e'],
      isSelected: false,
      clicked: 0
    },
    college: {
      title: 'Collège',
      values: ['6e', '5e', '4e', '3e'],
      isSelected: false,
      clicked: 0
    },
    '2e': {
      title: 'Seconde',
      values: ['2e'],
      isSelected: false,
      clicked: 0
    },
    '1e': {
      title: 'Première',
      values: ['1e'],
      isSelected: false,
      clicked: 0
    },
    techno1: {
      title: 'Première Technologique',
      values: ['techno1'],
      isSelected: false,
      clicked: 0
    },
    Ex: {
      title: 'Terminale Expert',
      values: ['Ex'],
      isSelected: false,
      clicked: 0
    },
    HP: {
      title: 'Hors-Programme (Lycée)',
      values: ['HP'],
      isSelected: false,
      clicked: 0
    },
    lycee: {
      title: 'Lycée',
      values: ['2e', '1e', 'techno1', 'Ex', 'HP'],
      isSelected: false,
      clicked: 0
    }
  },
  specs: {
    amc: {
      title: 'AMC (AutoMultipleChoice)',
      values: ['amc'],
      isSelected: false,
      clicked: 0
    },
    interactif: {
      title: 'Interactif',
      values: ['interactif'],
      isSelected: false,
      clicked: 0
    }
  },
  types: {
    static: {
      title: 'Exercices statiques',
      values: ['static'],
      isSelected: false,
      clicked: 0
    },
    CAN: {
      title: 'Course aux nombres',
      values: ['CAN'],
      isSelected: false,
      clicked: 0
    }
  }
})

/**
 * Retourne la liste de tous les niveaux sélectionnés
 * @returns {Level[]} la liste des niveaux sélectionnés dans les filtres
 */
export function getSelectedLevels (): Level[] {
  const filters = get(allFilters)
  const selectedLevels: Level[] = []
  // on regarde les niveaux
  Object.entries(filters.levels).forEach(([filter, level]) => {
    if (filter !== 'college' && filter !== 'lycee') {
      if (level.isSelected) {
        selectedLevels.push(filter as Level)
      }
    }
  })
  // on regarde les types (qui sont des niveaux particuliers : CAN, static, etc.)
  Object.entries(filters.types).forEach(([filter, level]) => {
    if (level.isSelected) {
      selectedLevels.push(filter as Level)
    }
  })
  return selectedLevels
}
/**
 * Retourne la liste des filtres sélectionnés sous la forme d'objet comprenant le type, la clé et le contenu
 * @returns liste des filtres sélectionnés comme objects
 */
export function getSelectedFiltersObjects (): FilterObject<string | Level>[] {
  const filters = get(allFilters)
  const levels: FilterObject<string | Level>[] = []
  // on regarde les niveaux
  Object.entries(filters).forEach(([filterType, filterObject]) => {
    Object.entries(filterObject).forEach(([key, obj]) => {
      if (key !== 'college' && key !== 'lycee') {
        if (obj.isSelected) {
          levels.push({ type: filterType as FilterType, key, content: obj })
        }
      }
    })
  })
  return levels
}

/**
 * Retourne la liste de toutes les fonctionnalités cochées (AMC, interactif)
 * @returns liste de toutes les fonctionnalités cochées
 */
export function getSelectedFeatures (): (keyof Features)[] {
  const filters = get(allFilters)
  const selectedFeatures: (keyof Features)[] = []
  Object.entries(filters.specs).forEach(([key, spec]) => {
    if (spec.isSelected) {
      selectedFeatures.push(key as keyof Features)
    }
  })
  return selectedFeatures
}

/**
 * Désélectionne les filtres lycée (ou collège) si une clé lycée (ou collège) est désélectionnée
 * @param {string} key clé à inspecter
 */
export function handleUncheckingMutipleFilters (key: string) {
  const filters = get(allFilters)
  const clgKeys = [...filters.levels.college.values]
  const lyceeKeys = [...filters.levels.lycee.values]
  if (clgKeys.includes(key)) { filters.levels.college.isSelected = false }
  if (lyceeKeys.includes(key)) { filters.levels.lycee.isSelected = false }
}

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
  const selectedExexercicesStore = get(selectedExercises)
  const questionsOrderStore = get(questionsOrder)
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
  if (options.nbVues && options.nbVues > 1) {
    url.searchParams.append('nbVues', options.nbVues.toString())
  } else {
    url.searchParams.delete('nbVues')
  }
  if (options.durationGlobal) {
    url.searchParams.append('dGlobal', options.durationGlobal.toString())
  } else {
    url.searchParams.delete('dGlobal')
  }
  if (options.choice) {
    url.searchParams.append('choice', options.choice.toString())
  } else {
    url.searchParams.delete('choice')
  }
  if (options.shuffle) {
    url.searchParams.append('shuffle', options.shuffle ? '1' : '0')
  } else {
    url.searchParams.delete('shuffle')
  }
  if (options.trans) {
    url.searchParams.append('trans', options.trans ? '1' : '0')
  } else {
    url.searchParams.delete('trans')
  }
  if (typeof options.sound !== 'undefined') {
    url.searchParams.append('sound', options.sound.toString())
  } else {
    url.searchParams.delete('sound')
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
  if (options.recorder) {
    url.searchParams.append('recorder', options.recorder)
  } else {
    url.searchParams.delete('recorder')
  }
  if (options.v === 'can' || options.v === 'diaporama') {
    if (selectedExexercicesStore) {
      url.searchParams.append(
        'selectedExercises',
        JSON.stringify(selectedExexercicesStore)
      )
    }
    if (questionsOrderStore) {
      url.searchParams.append(
        'questionsOrder',
        JSON.stringify(questionsOrderStore)
      )
    }
  }
  if (options.interfaceBeta) {
    url.searchParams.append('interfaceBeta', '1')
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
  'une_question_par_page'
] = [
  'liste_exos',
  'un_exo_par_page',
  'liste_questions',
  'une_question_par_page'
]
