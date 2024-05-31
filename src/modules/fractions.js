import FractionEtendue, { rationnalise } from './FractionEtendue'
import ListeFraction from './ListeFraction'

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
    new FractionEtendue(1, 2),
    new FractionEtendue(1, 3),
    new FractionEtendue(2, 3),
    new FractionEtendue(1, 4),
    new FractionEtendue(3, 4),
    new FractionEtendue(1, 5),
    new FractionEtendue(2, 5),
    new FractionEtendue(3, 5),
    new FractionEtendue(4, 5),
    new FractionEtendue(1, 6),
    new FractionEtendue(5, 6),
    new FractionEtendue(1, 7),
    new FractionEtendue(2, 7),
    new FractionEtendue(3, 7),
    new FractionEtendue(4, 7),
    new FractionEtendue(5, 7),
    new FractionEtendue(6, 7),
    new FractionEtendue(1, 8),
    new FractionEtendue(3, 8),
    new FractionEtendue(5, 8),
    new FractionEtendue(7, 8),
    new FractionEtendue(1, 9),
    new FractionEtendue(2, 9),
    new FractionEtendue(4, 9),
    new FractionEtendue(5, 9),
    new FractionEtendue(7, 9),
    new FractionEtendue(8, 9),
    new FractionEtendue(1, 10),
    new FractionEtendue(3, 10),
    new FractionEtendue(7, 10),
    new FractionEtendue(9, 10)]
}

/**
 * Retourne une liste de fractions irréducibles simples (1/2, 1/3, 2/3, 1/5 … 4/5, 1/7 … 6/7)
 * @return {FractionEtendue[]}
 */
export function obtenirListeFractionsIrreductiblesFaciles () { // sous forme de fractions
  return [
    new FractionEtendue(1, 2),
    new FractionEtendue(1, 3),
    new FractionEtendue(2, 3),
    new FractionEtendue(1, 5),
    new FractionEtendue(2, 5),
    new FractionEtendue(3, 5),
    new FractionEtendue(4, 5),
    new FractionEtendue(1, 7),
    new FractionEtendue(2, 7),
    new FractionEtendue(3, 7),
    new FractionEtendue(4, 7),
    new FractionEtendue(5, 7),
    new FractionEtendue(6, 7)
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
