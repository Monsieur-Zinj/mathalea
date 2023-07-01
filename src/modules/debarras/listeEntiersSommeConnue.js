import { randint } from '../outils.js'

/**
 * Donne une liste d'entiers relatifs dont on connait la somme.
 * @example > listeEntiersSommeConnue(4,10,-2)
 * < [1,-2,6,5]
 * @param {int} nbElements Nombre d'éléments de la liste
 * @param {int} total Somme des éléments de la liste (peut être un nombre négatif)
 * @param {int} [valMin = 1] Valeur minimale de chaque élément (peut être un nombre négatif)
 * @return {Array} Liste d'entiers relatifs
 * @author Frédéric PIOU
 */
export function listeEntiersSommeConnue (nbElements, total, valMin = 1) {
  const liste = []
  liste.push(randint(valMin, total - (nbElements - 1) * valMin))
  for (let j = 1; j < nbElements - 1; j++) {
    liste.push(randint(liste[j - 1] + valMin, total - (nbElements - j - 1) * valMin))
  }
  liste.push(total)
  for (let j = nbElements - 1; j > 0; j--) {
    liste[j] = liste[j] - liste[j - 1]
  }
  return liste
}
