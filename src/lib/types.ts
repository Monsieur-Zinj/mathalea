/**
 * setInteractive à 0 on enlève tout, à 1 on les met tous en interactif, à 2 on ne change rien
 * iframe est un identifiant de l'iframe utilisé par des recorders comme Moodle
 */
export interface InterfaceGlobalOptions {
  v?: string
  z?: string
  durationGlobal?: number
  nbVues?: number
  shuffle?: boolean
  choice?: number
  trans?: boolean
  sound?: '0' | '1' | '2' | '3'
  es?: string
  title: string
  presMode:
    | 'liste_exos'
    | 'un_exo_par_page'
    | 'liste_questions'
    | 'une_question_par_page'
    | 'cartes'
  setInteractive: string
  isSolutionAccessible?: boolean
  isInteractiveFree?: boolean
  oneShot?: boolean
  recorder?: 'capytale' | 'labomep' | 'moodle' | 'anki'
  done?: '1'
  answers?: string
  iframe?: string
  twoColumns?: boolean
  interfaceBeta?: boolean
  isDataRandom?: boolean
}

export interface InterfaceParams {
  uuid: string
  id?: string
  alea?: string
  interactif?: '0' | '1'
  cd?: '0' | '1'
  sup?: string
  sup2?: string
  sup3?: string
  sup4?: string
  nbQuestions?: number
  duration?: number
  cols?: number
  type?: 'mathalea' | 'static' | 'app'
}

export interface InterfaceReferentiel {
  uuid: string
  id: string
  url: string
  titre: string
  tags: { interactif: boolean; interactifType: string; amc: boolean }
  datePublication?: string
  dateModification?: string
  annee?: string
}

export interface InterfaceResultExercice {
  numberOfPoints: number
  numberOfQuestions: number
  uuid?: string
  title?: string
  alea?: string
  answers?: string[]
  indice?: number
  state?: 'done'
  type?: 'mathalea' | 'static' | 'app'
}

// Pour Capytale
export interface Activity {
  globalOptions: InterfaceGlobalOptions
  exercicesParams: InterfaceParams[]
}

export interface StudentAssignment {
  resultsByExercice: InterfaceResultExercice[]
}

// Pour les listes d'entrées de référentiel dans le side menu
// * `title` : titre affiché dans le menu
// * `content` : le référentiel lui-même
// * `type` : type du référentiel pour gérer l'affichage (exploration récursive ou pas par exemple)
// * `activated`: flag pour afficher ou pas le référentiel
export type ReferentielTypes =
  | 'outils'
  | 'exercices'
  | 'ressources'
  | 'bibliotheque'
  | 'apps'
  | 'examens'
export type ReferentielNames =
  | 'outils'
  | 'aleatoires'
  | 'statiques'
  | 'ressources'
  | 'bibliotheque'
  | 'apps'
  | 'examens'
  | 'geometrieDynamique'
export type ReferentielForList = {
  name: ReferentielNames
  title: string
  content: InterfaceReferentiel[]
  type: ReferentielTypes
  activated: boolean
}

// Pour designer la page appelant un export
export type CallerComponentType = '' | 'tools'

// Pour les exercices statiques de la bibliotheque
export interface bibliothequeExercise {
  uuid: string
  url: string
  png: string
  pngCor: string
}

// Pour les couleurs utilisées dans le site
// chaînes de caractères possible à ajouter après <text|fill|bg|border|...>-coopmaths- ou <text|fill|bg|border|...>-coopmathsdark-
export type CoopmathsColor =
  | 'canvas'
  | 'canvas-light'
  | 'canvas`lightest'
  | 'canvas-dark'
  | 'canvas-darkest'
  | 'warn'
  | 'warn-light'
  | 'warn-lightest'
  | 'warn-dark'
  | 'warn-darkest'
  | 'corpus'
  | 'corpus-light'
  | 'corpus-lightest'
  | 'corpus-dark'
  | 'corpus-darkest'
  | 'struct'
  | 'struct-ligh'
  | 'struct-lightest'
  | 'struct-dark'
  | 'struct-darkest'

// type pour une fonction qui n'admet pas d'argument et de retourne rien
export type Action = () => void

// type pour un intervalle de nombres
// usage : const myNumber: NumericRange<0, 100> = 3 (par de valeur possible inférieure à 0 et supérieure à 100)
// source: https://github.com/microsoft/TypeScript/issues/43505#issuecomment-1686128430
export type NumericRange<
  start extends number,
  end extends number,
  arr extends unknown[] = [],
  acc extends number = never
> = arr['length'] extends end
  ? acc | start | end
  : NumericRange<
      start,
      end,
      [...arr, 1],
      arr[start] extends undefined ? acc : acc | arr['length']
  >
// autre type pour intervalle de nombre
// source : https://github.com/type-challenges/type-challenges/issues/9230
export type NumberRange<L extends number, H extends number, Out extends number[] = [], Flag extends boolean = false> =
    Out['length'] extends L
        ? NumberRange<L, H, [...Out, L], true>
        : Flag extends true
            ? Out['length'] extends H
                ? [...Out, Out['length']][number]
                : NumberRange<L, H, [...Out, Out['length']], Flag>
            : NumberRange<L, H, [...Out, never], Flag>
// type pour les chips des exercices
export type ChipContentType = { ref: string; title: string; key: string }

// type pour les filtres affichés
export type DisplayedFilterContent<T> = {
  title: string
  values: T[]
  isSelected: boolean
  clicked: number
}
export type DisplayedFilter<T> = Record<string, DisplayedFilterContent<T>>
export type FilterType = 'levels' | 'specs' | 'types'
export type FilterObject<T> = {
  type: FilterType
  key: string
  content: DisplayedFilterContent<T>
}

// eslint-disable-next-line no-unused-vars
export type FilterSectionNameType = { [key in FilterType]: string }
export const FILTER_SECTIONS_TITLES: FilterSectionNameType = {
  levels: 'Niveaux',
  specs: 'Fonctionnalités',
  types: 'Types'
}
