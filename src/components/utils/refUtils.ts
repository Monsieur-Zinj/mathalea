import { isLessThanAMonth } from '../../lib/dates'
import {
  type JSONReferentielObject,
  type JSONReferentielEnding,
  isExerciceItemInReferentiel
} from '../../lib/referentiels'

/**
 * Détecter si une valeur est un objet
 * @param val valeur à analyser
 */
const isObject = (val: unknown) =>
  val && typeof val === 'object' && !Array.isArray(val)

/**
 * Récupérer la liste des exercices récents !
 * @param {JSONReferentielObject} refObj le référentiel à inspecter
 * @returns {JSONReferentielEnding[]} un tableau de tous les exercices ayant une date de modification/publication inférieure à un mois
 */
export function getRecentExercices (
  refObj: JSONReferentielObject
): JSONReferentielEnding[] {
  const recentExercises: JSONReferentielEnding[] = []
  /**
   * On parcourt récursivement l'objet référentiel et on en profite pour peupler
   * le tableau recentExercises avec les exercices dont les dates de publication
   * ou de modification sont récentes
   * @param obj Objet à parcourir
   */
  function traverse (obj: JSONReferentielObject) {
    Object.values(obj).forEach((value) => {
      if (isObject(value as JSONReferentielObject)) {
        if (isExerciceItemInReferentiel(value)) {
          // la valeur est un exercice alea
          if (
            (value.datePublication !== undefined &&
              isLessThanAMonth(value.datePublication)) ||
            (value.dateModification !== undefined &&
              isLessThanAMonth(value.dateModification))
          ) {
            // l'exercice a moins d'un mois donc on l''ajoute à la liste des exercices récent
            recentExercises.push(value)
          }
        } else {
          // la valeur n'est pas un exercice alea, on continue l'exploration
          return traverse(value as JSONReferentielObject)
        }
      }
    })
  }
  traverse(refObj)
  return recentExercises
}
