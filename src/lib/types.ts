/**
 * setInteractive à 0 on enlève tout, à 1 on les met tous en interactif, à 2 on ne change rien
 * iframe est un identifiant de l'iframe utilisé par des recorders comme Moodle
 */
export interface InterfaceGlobalOptions { v?: string, z?: string, durationGlobal?: number, nbVues?: number, shuffle?: boolean, choice?: number, trans?: boolean, sound?: '0' | '1' | '2' | '3', es?: string, title?: string, presMode?: 'liste_exos' | 'un_exo_par_page' | 'liste_questions' | 'une_question_par_page', setInteractive?: string, isSolutionAccessible?: boolean, isInteractiveFree?: boolean, oneShot?: boolean, recorder?: 'capytale' | 'labomep' | 'moodle' | 'anki', done?: '1', answers?: string, iframe?: string, twoColumns?: boolean, interfaceBeta?: boolean }

export interface InterfaceParams { uuid: string, id?: string, alea?: string, interactif?: '0' | '1', cd?: '0' | '1', sup?: string, sup2?: string, sup3?: string, sup4?: string, nbQuestions?: number, duration?: number, cols?: number, type?: 'mathalea' | 'static' | 'app' }

export interface InterfaceReferentiel { uuid: string, id: string, url: string, titre: string, tags: { interactif: boolean, interactifType: string, amc: boolean }, datePublication?: string, dateModification?: string, annee?: string }

export interface InterfaceResultExercice {numberOfPoints: number, numberOfQuestions: number, uuid?: string, title?: string, alea?: string, answers?: string[], indice: number, state?: 'done', type?: 'mathalea' | 'static' | 'app'}

// Pour Capytale
export interface Activity {globalOptions: InterfaceGlobalOptions, exercicesParams: InterfaceParams[]}

export interface StudentAssignment {resultsByExercice: InterfaceResultExercice[]}

// Pour les listes d'entrées de référentiel dans le side menu
// export enum ReferentielTypes { OUTILS = 'outils', EXERCICES = 'exercices'}
export type ReferentielTypes = 'outils' | 'exercices' | 'ressources' | 'bibliotheque' | 'apps'
export interface ReferentielForList {title: string, content: InterfaceReferentiel[], type: ReferentielTypes}

// Pour designer la page appelant un export
export type CallerComponentType = '' | 'tools'

// Pour les exercices statiques de la bibliotheque
export interface bibliothequeExercise {uuid: string, url: string, png: string, pngCor: string}
