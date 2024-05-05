import FractionEtendue from './FractionEtendue.ts'
import ListeFraction from './ListeFraction.js'
import { rationnalise } from '../lib/mathFonctions/outilsMaths'

/**
 * Des fonctions pour manipuler des objets Fraction ou ListeFraction
 * @module
 */

/**
 * Retourne une liste de fractions irréducibles
 * @return {FractionEtendue[]}
 */
export function obtenirListeFractionsIrreductibles () { // sous forme de fractions
  return [
    fraction(1, 2),
    fraction(1, 3),
    fraction(2, 3),
    fraction(1, 4),
    fraction(3, 4),
    fraction(1, 5),
    fraction(2, 5),
    fraction(3, 5),
    fraction(4, 5),
    fraction(1, 6),
    fraction(5, 6),
    fraction(1, 7),
    fraction(2, 7),
    fraction(3, 7),
    fraction(4, 7),
    fraction(5, 7),
    fraction(6, 7),
    fraction(1, 8),
    fraction(3, 8),
    fraction(5, 8),
    fraction(7, 8),
    fraction(1, 9),
    fraction(2, 9),
    fraction(4, 9),
    fraction(5, 9),
    fraction(7, 9),
    fraction(8, 9),
    fraction(1, 10),
    fraction(3, 10),
    fraction(7, 10),
    fraction(9, 10)]
}

/**
 * Retourne une liste de fractions irréducibles simples (1/2, 1/3, 2/3, 1/5 … 4/5, 1/7 … 6/7)
 * @return {FractionEtendue[]}
 */
export function obtenirListeFractionsIrreductiblesFaciles () { // sous forme de fractions
  return [
    fraction(1, 2),
    fraction(1, 3),
    fraction(2, 3),
    fraction(1, 5),
    fraction(2, 5),
    fraction(3, 5),
    fraction(4, 5),
    fraction(1, 7),
    fraction(2, 7),
    fraction(3, 7),
    fraction(4, 7),
    fraction(5, 7),
    fraction(6, 7)
  ]
}

export function listeFractions (...fractions) {
  return new ListeFraction(...fractions)
}

/**
 * Construit et Retourne un objet FractionEtendue(a, b)
 * @param {number} a
 * @param {number|undefined} b
 * @return {FractionEtendue}
 */
export function fraction (a, b) {
  if (b === undefined) { // pas d'argument b
    if (a === undefined) {
      window.notify('fraction de fractions.js : aucun argument n\'est défini ', { a, b })
      return NaN
    } else {
      if (typeof a === 'number') {
        const frac = rationnalise(a)
        return frac
      } else if (!isNaN(a)) {
        const frac = rationnalise(Number(a))
        return frac
      }
      window.notify('fraction de fractions.js : l\'argument est de type inconvenant ', { a })
      return NaN
    }
  } else { // on a un argument b
    if (a === undefined) {
      window.notify('fraction de fractions.js : le premier argument n\'est pas défini ', { a, b })
      return NaN
    } else {
      if (typeof a === 'number' && typeof b === 'number') {
        return new FractionEtendue(a, b)
      } else if (!isNaN(b) && !isNaN(a)) {
        return new FractionEtendue(Number(a), Number(b))
      }
      window.notify('fraction de fractions.js : les arguments sont de type inconvenant ', { a, b })
      return NaN
    }
  }
}
