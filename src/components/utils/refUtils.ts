import { isLessThanAMonth } from '../../lib/types/dates'
import {
  type JSONReferentielObject,
  type JSONReferentielEnding,
  isExerciceItemInReferentiel
} from '../../lib/types/referentiels'
import codeList from '../../json/codeToLevelList.json'
import referentielAlea from '../../json/referentiel2022.json'
import referentielStatic from '../../json/referentielStatic.json'
const baseReferentiel: JSONReferentielObject = { ...referentielAlea, static: { ...referentielStatic } }

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

/**
 * Retrouve le titre d'un niveau basé sur son code
 *
 * #### Exemple
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
