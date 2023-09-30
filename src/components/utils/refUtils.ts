import { isLessThanAMonth } from '../../lib/types/dates'
import {
  type JSONReferentielObject,
  type JSONReferentielEnding,
  isExerciceItemInReferentiel,
  isJSONReferentielEnding
} from '../../lib/types/referentiels'
import codeList from '../../json/codeToLevelList.json'
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
): JSONReferentielEnding[] {
  const recentExercises: JSONReferentielEnding[] = []
  fetchThrough(refObj, recentExercises, (e: JSONReferentielEnding) => {
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
  return recentExercises
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

export function getReferentielEndings (
  ref: JSONReferentielObject,
  results: JSONReferentielEnding[]
): void {
  fetchThrough(ref, results, (e: JSONReferentielEnding) => {
    if (isExerciceItemInReferentiel(e)) {
      if (e.features.amc && !e.features.amc.isActive) {
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
