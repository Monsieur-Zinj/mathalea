import type { FrenchDateString } from './dates'
import codeList from '../../json/codeToLevelList.json'
// ===========================================================================
//
//    Types des bouts de chaînes des référentiels (les données des exercices)
//
// ===========================================================================

export type Level = keyof typeof codeList
/**
 * Paramètres d'une fonctionnalité
 * @interface FeatureParams
 * @property {string} type : mot clé décrivant le type de l'interactivité
 * @property {boolean} isActive : flag pour savoir si la fonctionnalité est activée ou pas
 */
export interface FeatureParams {
  type: string
  isActive: boolean
}

/**
 * Fonctionnalités supplémentaires d'un exercice.
 * @remark **Au 2023-09-26, ces fonctionnalités sont au nombre de deux seulement**
 * @interface Features
 * @property {FeatureParams} interactif : interactivité dans l'exercice
 * @property {FeatureParams} amc : possibilité d'exportation pour utilisation dans AMC
 */
export interface Features {
  interactif?: FeatureParams
  amc?: FeatureParams
}

/**
 * Description d'une application tierce
 * @interface AppTierce
 * @property {string} uuid : identifiant unique généré définitivement par le moteur à la création de l'exercice
 * @property {tring} title : titre de l'application
 * @property {string} presentation : texte bref expliquant les intentions de l'application
 * @property {string} imgPath : chemin vers le fichier image dans l'arborescence
 */
export interface AppTierce {
  uuid: string
  title: string
  presentation: string
  imgPath: string
}

/**
 * Groupe d'applications tierces liées par une provenance
 * @interface AppTierceGroup
 * @property {string} rubrique : titre de la rubrique sous laquelle sont regroupées les applications
 * @property {AppTierce[]} liste : liste des applications dans le groupe
 */
export interface AppTierceGroup {
  rubrique: string
  liste: AppTierce[]
}

/**
 * Description d'un objet de base dans un reerentiel de ressources
 * @interface BaseItemInReferentiel
 * @property {string} uuid : identifiant unique généré définitivement par le moteur à la création de l'exercice
 * @property {string[]} tags : listes de toutes les étiquettes marquant les sujets couverts par la ressource
 * @property {'alea' | 'dnb' | 'crpe' | 'bac' | 'simple' | 'html' | 'svelte'} typeExercice : catégorie de la ressource
 */
export interface BaseItemInReferentiel {
  uuid: string
  tags: string[]
  typeExercice: 'alea' | 'dnb' | 'crpe' | 'bac' | 'simple' | 'html' | 'svelte' | 'e3c' | 'outil' | 'tierce'
}

/**
 * Description d'une ressource statique dans un référentiel
 * @interface StaticItemInreferentiel
 * @extends BaseItemInReferentiel
 * @property {string[]} png : liste des chemins vers les images des contenus de la ressource
 * @property {string[]} pngCor : liste des chemins vers les images des correction des contenus de la ressource
 * @property {string} tex: chemin vers le source LaTeX du contenu
 * @property {string} texCor: chemin vers le source LaTeX de la correction du contenu
 */
export interface StaticItemInreferentiel extends BaseItemInReferentiel {
  png: string[]
  pngCor: string[]
  tex: string
  texCor: string
}

/**
 * Description d'une ressource venant un examen dans un référentiel
 * @interface ExamItemInReferentiel
 * @extends StaticItemInreferentiel
 * @property {string|undefined} mois : mois de la publication de l'examen (optionnel)
 * @property {string} annee : année de la publication de l'examen
 * @property {string} lieu : endroit où a été diffusé l'examen
 * @property {string} numeroInitial : numérode positionnement de l'exercice dans le sujet initial de l'examen
 */
export interface ExamItemInReferentiel extends StaticItemInreferentiel {
  mois?: string
  annee: string
  lieu: string
  numeroInitial: string
  typeExercice: 'dnb' | 'bac' | 'crpe'
}

/**
 * Description dans un référentiel d'une ressource venant d'examen dont on ne dispose pas des sources LaTeX
 * @interface ExamWithoutTexItemInReferentiel
 * @extends BaseItemInReferentiel
 * @property {string[]} png : liste des chemins vers les images des contenus de la ressource
 * @property {string[]} pngCor : liste des chemins vers les images des correction des contenus de la ressource
 * @property {string} annee : année de la publication de l'examen
 * @property {string} lieu : endroit où a été diffusé l'examen
 * @property {string} numeroInitial : numérode positionnement de l'exercice dans le sujet initial de l'examen
 */
export interface ExamWithoutTexItemInReferentiel extends BaseItemInReferentiel {
  png: string[]
  pngCor: string[]
  annee: string
  lieu: string
  numeroInitial: string
  typeExercice: 'crpe' | 'e3c'
}

/**
 * Description dans un référentiel d'un exercice MathALÉA typique
 * @interface ExerciceItemInReferentiel
 * @extends BaseItemInReferentiel
 * @property {string} url : chemin vers les sources javascript de l'exercice
 * @property {string} id : identifiant provenant du référentiel de classification des compétences (différent de `uuid`)
 * @property {Feature[]} features : liste des fonctionnalités supplémentaires de l'exercice (`interactif` et/ou `amc`)
 * @property {string} datePublication : date de la publication de l'exercice (optionnel)
 * @property {string} dateModification : date de la *dernière* modification de l'exercice (optionnel)
 */
export interface ExerciceItemInReferentiel extends BaseItemInReferentiel {
  url: string
  id: string
  titre: string
  features: Features
  datePublication?: FrenchDateString
  dateModification?: FrenchDateString
  typeExercice: 'alea'
}
// ===========================================================================
//
//    Type pour les référentiels eux-mêmes
//
// ===========================================================================

/**
 * Type récursif pour les référentiels eux-mêmes : en récupérant les JSON en import
 * on fabrique un objet dont le type est défini ci-dessous. Les extrémités des imbrications
 * sont correspondent aux différents types de ressources décrites ci-dessus.
 */
// Type pour un objet situé en fin de référentiel
export type JSONReferentielEnding =
  // | BaseItemInReferentiel  <-- pas de terminaison aussi basique
  | StaticItemInreferentiel
  | ExamItemInReferentiel
  | ExamWithoutTexItemInReferentiel
  | ExerciceItemInReferentiel
// Type pour un référentiel complet
export interface JSONReferentielObject
  extends Record<
    string,
    JSONReferentielEnding | JSONReferentielObject | string | string[] | Features
  > {}

export type ResourceAndItsPath = {
  resource: JSONReferentielEnding
  pathToResource: string[]
}
// ===========================================================================
//
//     Fonctions pour vérifier les types
//
// ===========================================================================
export const isExerciceItemInReferentiel = (
  obj: any
): obj is ExerciceItemInReferentiel =>
  obj.uuid !== undefined && obj.features !== undefined
export const isJSONReferentielEnding = (
  obj: any
): obj is JSONReferentielEnding => obj.uuid !== undefined

export const isResourceHasPlace = (obj: any): obj is ExamItemInReferentiel | ExamWithoutTexItemInReferentiel =>
  obj.lieu !== undefined

export const isLevelType = (obj: any): obj is Level => Object.keys(codeList).includes(obj)
