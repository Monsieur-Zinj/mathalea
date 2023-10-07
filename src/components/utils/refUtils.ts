import { isLessThanAMonth } from '../../lib/types/dates'
import {
  type JSONReferentielObject,
  type JSONReferentielEnding,
  type ResourceAndItsPath,
  type Level,
  isExerciceItemInReferentiel,
  isJSONReferentielEnding
} from '../../lib/types/referentiels'
import codeList from '../../json/codeToLevelList.json'
import referentielsActivation from '../../json/referentielsActivation.json'
import { toMap } from './toMap'
import {
  levelCriterion,
  type Criterion,
  featuresCriteria,
  AtLeastOneOfCriteria
} from '../../lib/types/filters'

/**
 * Récupérer la liste des exercices récents !
 * @param {JSONReferentielObject} refObj le référentiel à inspecter
 * @returns {JSONReferentielEnding[]} un tableau de tous les exercices ayant une date de modification/publication inférieure à un mois
 */
export function getRecentExercices (
  refObj: JSONReferentielObject
): ResourceAndItsPath[] {
  return findResourcesAndPaths(refObj, (e: JSONReferentielEnding) => {
    if (isExerciceItemInReferentiel(e)) {
      if (
        (e.datePublication && isLessThanAMonth(e.datePublication)) ||
        (e.dateModification && isLessThanAMonth(e.dateModification))
      ) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  })
}

/**
 * Récupérer la liste de TOUS exercices.
 * @param {JSONReferentielObject} refObj le référentiel à récupérer
 * @returns {ResourceAndItsPath[]} un tableau de tous les exercices (terminaisons) avec leur chemin
 */
export function getAllExercises (
  refObj: JSONReferentielObject
): ResourceAndItsPath[] {
  return findResourcesAndPaths(refObj, () => true)
}

/**
 * Retrouve le titre d'un niveau basé sur son code
 *
 * #### Exemple de code
 * `levelCode` : "6e" --> Traduction: "Sixième"
 * @param {string} levelCode code du niveau
 */
export function codeToLevelTitle (levelCode: string): string {
  const liste: { [key: string]: string } = codeList
  if (liste[levelCode]) {
    // une traduction du code est trouvée dans la liste
    return liste[levelCode]
  } else {
    // pas d'entrée trouvée : on retourne le code
    return levelCode
  }
}

/**
 * Parcourt toutes les branches d'un référentiel passé en paramètre
 * et remplit une liste (passée en paramètre) avec les extrémités
 * qui passent le test d'une fonction passée en paramètre
 * @param {JSONReferentielObject} referentiel le référentiel à parcourir
 * @param {JSONReferentielEnding[]} harvest la liste stockant la récolte
 * @param {function(e: JSONReferentielEnding):boolean} goalReachedWith fonction de triage
 * @example
 * ```ts
 * fetchThrough(ref, results, (e: JSONReferentielEnding) => {
    if (isExerciceItemInReferentiel(e)) {
      return true
    } else {
      return false
    }
 * ```
 */
export function fetchThrough (
  referentiel: JSONReferentielObject,
  harvest: JSONReferentielEnding[],
  goalReachedWith: (e: JSONReferentielEnding) => boolean
): void {
  Object.values(referentiel).forEach((value) => {
    if (isJSONReferentielEnding(value)) {
      if (goalReachedWith(value)) {
        harvest.push(value)
      }
    } else {
      fetchThrough(value as JSONReferentielObject, harvest, goalReachedWith)
    }
  })
}

/**
 * Parcourt un référentiel jusqu'à ses extrémités et en garde la trace
 * avec son chemin lorsque cette extrémité remplie les conditions fixées
 * par la fonction passée en paramètre
 * @param {JSONReferentielObject} referentiel Le référentiel à chercher
 * @param {(e: JSONReferentielEnding) => boolean} goalReachedWith la fonction de filtrage
 * @returns {ResourceAndItsPath[]} Une liste d'objets du type
 * `{resource: JSONReferentielEnding,  pathToResource: string[]}`
 */
export function findResourcesAndPaths (
  referentiel: JSONReferentielObject,
  goalReachedWith: (e: JSONReferentielEnding) => boolean
): ResourceAndItsPath[] {
  const harvest: ResourceAndItsPath[] = []
  const path: string[] = []
  function find (ref: JSONReferentielObject) {
    Object.entries(ref).forEach(([key, value]) => {
      if (isJSONReferentielEnding(value)) {
        if (goalReachedWith(value)) {
          path.push(key)
          harvest.push({ resource: value, pathToResource: [...path] })
          path.pop()
        }
      } else {
        path.push(key)
        find(value as JSONReferentielObject)
        path.pop()
      }
    })
  }
  find(referentiel)
  return harvest
}

/**
 * À partir d'un objet de type `ResourceAndItsPath`, construit l'objet imbriqué correspondant
 * @param item Un objet constitué de la liste des nœuds et de la terminaison
 * @returns un objet aux entrées imbriquées correspondant à une branche + une terminaison
 */
function pathToObject (item: ResourceAndItsPath): JSONReferentielObject {
  return item.pathToResource.reduceRight(
    (value, key) => ({ [key]: value }),
    (<unknown>item.resource) as JSONReferentielObject
  )
}

/**
 * Construit à partir d'une liste d'objet de type `ResourceAndItsPath`
 * la liste des objets imbriqués (branche+terminaison) correspondants
 * @param {ResourceAndItsPath[]} items la liste des objets à transformer
 * @returns {JSONReferentielObject[]} la liste des objets transformés
 */
function pathsToObjectsArray (
  items: ResourceAndItsPath[]
): JSONReferentielObject[] {
  const result: JSONReferentielObject[] = []
  for (const item of items) {
    result.push(pathToObject(item))
  }
  return result
}

/**
 * Fabrique de zéro un référentiels sur la base d'entrées constituées d'un chemin d'accès
 * et d'une terminaison `{resource: JSONReferentielEnding,  pathToResource: string[]}`
 * @param {ResourceAndItsPath[]} refList la liste des entrées pour constituer le référentiel
 * @returns {JSONReferentielObject} un référentiel sous forme d'objet
 */
export function buildReferentiel (
  refList: ResourceAndItsPath[]
): JSONReferentielObject {
  return pathsToObjectsArray(refList).reduce((prev, current) => {
    return mergeReferentielObjects(prev, current)
  }, {})
}

/**
 * Fusionne des objets référentiels sans écraser les entrées précédentes
 * @param {JSONReferentielObject[]} objects les objets à fusionner
 * @returns {JSONReferentielObject} un référentiel
 * @see https://tutorial.eyehunts.com/js/javascript-merge-objects-without-overwriting-example-code/
 */
function mergeReferentielObjects (
  ...objects: JSONReferentielObject[]
): JSONReferentielObject {
  const isObject = (obj: unknown) => obj && typeof obj === 'object'
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key]
      const oVal = obj[key]
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal)
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeReferentielObjects(pVal, oVal)
      } else {
        prev[key] = oVal
      }
    })

    return prev
  }, {})
}

/**
 * Consulte le fichier `src/json/referentielsActivation.json`
 * et retourne la valeur d'activation `true`/`false` indiqué pour un nom de référentiel donné.
 * @param refName nom du référentiel (conformément au type `ReferentielNames` dans `src/lib/types.ts`)
 * @returns la valeur mentionnée dans `src/json/referentielsActivation.json` <br/> `false` si le nom du référentiel n'exoiste pas.
 */
export function isReferentielActivated (refName: string): boolean {
  const referentielList = toMap({ ...referentielsActivation })
  if (referentielList.has(refName)) {
    return referentielList.get(refName) === 'true'
  } else {
    console.log(refName + ' is not a valid referentiel name !')
    return false
  }
}

/**
 * Sur la base d'un référentiel passé en paramètre, construit un nouveau référentiel
 * sur la base de trois critères :
 * - les exercices AMC
 * - les exercices interactifs
 * - les niveaux de classe
 * @param {JSONReferentielObject} originalReferentiel Référentiel à filter
 * @param {boolean} isAmcOnlySelected flag pour limiter le référentiel aux exercices AMC
 * @param {boolean} isInteractiveOnlySelected flag pour limiter le référentiel aux exercices interactifs
 * @param {Level[]} levelsSelected flag pour limiter le référentiel aux exercices de certains niveaux
 * @returns {JSONReferentielObject} le référentiel filtré
 */
export function updateReferentiel (
  originalReferentiel: JSONReferentielObject,
  isAmcOnlySelected: boolean,
  isInteractiveOnlySelected: boolean,
  levelsSelected: Level[] // les seuls niveaux acceptés sont ceux stocké dans codeList
): JSONReferentielObject {
  // on récupère tous les exercices du référentiel passé en paramètre
  let filteredList: ResourceAndItsPath[] = getAllExercises(originalReferentiel)
  // on commence par créer les critères de filtration pour les spécificités (AMC et/ou Interactif)
  const features: ('amc' | 'interactif')[] = []
  if (isAmcOnlySelected) {
    features.push('amc')
  }
  if (isInteractiveOnlySelected) {
    features.push('interactif')
  }
  if (features.length !== 0) {
    // pas de liste de spécificités vide passée à `featuresCriteria`
    filteredList = featuresCriteria(features).meetCriterion(filteredList)
  }
  // on traite les niveaux

  switch (levelsSelected.length) {
    case 0:
      // pas de critère, on fait rie
      break
    case 1:
      // un seul critère, on l'applique à la liste
      filteredList = levelCriterion(levelsSelected[0]).meetCriterion(
        filteredList
      )
      break
    default:
      // il y a au moins deux critères : un tableau de critères par niveau
      // puis union des critères
      {
        const levelsCriteria: Criterion<ResourceAndItsPath>[] = []
        for (const level of levelsSelected) {
          levelsCriteria.push(levelCriterion(level))
        }
        const [first, second, ...others] = [...levelsCriteria]
        const unionOfCriteria: Criterion<ResourceAndItsPath> =
          new AtLeastOneOfCriteria([first, second, ...others])
        filteredList = unionOfCriteria.meetCriterion(filteredList)
      }
      break
  }
  return buildReferentiel(filteredList)
}
