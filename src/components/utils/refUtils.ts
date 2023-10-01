import { isLessThanAMonth } from '../../lib/types/dates'
import {
  type JSONReferentielObject,
  type JSONReferentielEnding,
  type ResourceAndItsPath,
  isExerciceItemInReferentiel,
  isJSONReferentielEnding
} from '../../lib/types/referentiels'
import codeList from '../../json/codeToLevelList.json'
import referentielsActivation from '../../json/referentielsActivation.json'
import { toMap } from './toMap'
// import referentielAlea from '../../json/referentiel2022.json'
// import referentielStatic from '../../json/referentielStatic.json'
// const baseReferentiel: JSONReferentielObject = {
//   ...referentielAlea,
//   static: { ...referentielStatic }
// }

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
 * Fabrique de zéro un référentiels sur la base d'entrées constituées d'un chemin d'accès
 * et d'une terminaison `{resource: JSONReferentielEnding,  pathToResource: string[]}`
 * @param listOfEntries la liste des entrées pour constituer le référentiel
 * @returns {JSONReferentielObject} un référentiel sous forme d'objet
 */
export function buildReferentiel (
  listOfEntries: ResourceAndItsPath[]
): JSONReferentielObject {
  const paths: JSONReferentielObject[] = []
  for (const e of listOfEntries) {
    const reversePath = e.pathToResource.reverse()
    paths.push(
      reversePath.reduce((res, key) => ({ [key]: res }), {
        ...e.resource
      } as JSONReferentielObject)
    )
  }
  return mergeReferentielObjects(...paths)
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
