/**
 * Retourne le signe d'un nombre
 * @Example
 * // + ou -
 * @author Rémi Angot
 */
import Decimal from 'decimal.js'
import { round } from 'mathjs'
import { enleveElement } from '../../modules/outils.js'

export function signe (a) { // + ou -
  let result = ''
  if (a > 0) {
    result = '+'
  } else {
    result = '-'
  }
  return result
}

/**
 * Retourne la somme des chiffres (ou d'un tableau de chiffres) d'un nombre en valeur et sous forme de String [valeur, String]
 * @Example
 * sommeDesChiffres(123)
 * // [ 6, '1+2+3']
 * @author Rémi Angot (Rajout Tableau par EE)
 */export function sommeDesChiffres (n) {
  let nString
  if (Array.isArray(n)) nString = n.join('').toString()
  else nString = n.toString()
  let somme = 0
  let sommeString = ''
  for (let i = 0; i < nString.length - 1; i++) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(nString[i] !== -1)) {
      sommeString += nString[i] + '+'
      somme += Number(nString[i])
    }
  }
  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(nString[nString.length - 1] !== -1)) {
    sommeString += nString[nString.length - 1]
    somme += Number(nString[nString.length - 1])
  }
  return [somme, sommeString]
}

/**
 * Retourne l'arrondi (par défaut au centième près)
 * @author Rémi Angot
 * @param {number} nombre
 * @param {number} precision
 * @return {number}
 */
export function arrondi (nombre, precision = 2) {
  if (isNaN(nombre)) {
    window.notify('Le nombre à arrondir n\'en est pas un, ça retourne NaN', { nombre, precision })
    return NaN
  } else {
    return round(nombre, precision)
  }
}

/**
 * Retourne la troncature signée de nombre.
 * @author Jean-Claude Lhote
 */
export function troncature (nombre, precision) {
  const tmp = Math.pow(10, precision)
  const absolu = new Decimal(nombre).abs()
  const tronc = absolu.mul(tmp).floor().div(tmp)
  if (nombre < 0) return tronc.mul(-1).toNumber()
  else return tronc.toNumber()
}

/**
 * Renvoie la valeur absolue
 * @author Rémi Angot + ajout du support des décimaux par Jean-Claude Lhote
 */
export function abs (a) {
  if (a instanceof Decimal) return a.abs()
  return Math.abs(a)
}

/**
 * prend une liste de nombres relatifs et la retourne avec les positifs au début et les négatifs à la fin.
 * @param {array} liste la liste de nombres à trier
 */
export function triePositifsNegatifs (liste) {
  const positifs = []
  const negatifs = []
  for (let i = 0; i < liste.length; i++) {
    if (liste[i] > 0) positifs.push(liste[i])
    else negatifs.push(liste[i])
  }
  return positifs.concat(negatifs)
}

/**
 * Renvoie le nombre de chiffres de la partie décimale
 * @param nb : nombre décimal
 * @param except : chiffre à ne pas compter (0 par exemple) [Ajout EE]
 * @author Rémi Angot
 */
export function nombreDeChiffresDansLaPartieDecimale (nb, except = 'aucune') {
  let sauf = 0
  if (String(nb).indexOf('.') > 0) {
    if (!isNaN(except)) sauf = (String(nb).split('.')[1].split(String(except)).length - 1)
    return String(nb).split('.')[1].length - sauf
  } else {
    return 0
  }
}

/**
 * Renvoie le nombre de chiffres dans la partie entière
 * @author ?
 */
export function nombreDeChiffresDansLaPartieEntiere (nb, except = 'aucune') {
  let nombre
  let sauf = 0
  if (nb < 0) {
    nombre = -nb
  } else {
    nombre = nb
  }
  if (String(nombre).indexOf('.') > 0) {
    if (!isNaN(except)) sauf = (String(nombre).split('.')[0].split(String(except)).length - 1)
    return String(nombre).split('.')[0].length - sauf
  } else {
    if (!isNaN(except)) sauf = (String(nombre).split(String(except)).length - 1)
    return String(nombre).length
  }
}

/**
 * Renvoie le nombre de chiffres d'un nombre décimal
 * @param nb : nombre décimal
 * @param except : chiffre à ne pas compter (0 par exemple) [Ajout EE]
 * @author Jean-Claude Lhote
 */
export function nombreDeChiffresDe (nb, except) {
  return nombreDeChiffresDansLaPartieDecimale(nb, except) + nombreDeChiffresDansLaPartieEntiere(nb, except)
}

/**
 *
 * x le nombre dont on cherche l'ordre de grandeur
 * type = 0 pour la puissance de 10 inférieure, 1 pour la puissance de 10 supérieur et 2 pour la plus proche
 */
export function ordreDeGrandeur (x, type) {
  let signe
  if (x < 0) signe = -1
  else signe = 1
  x = Math.abs(x)
  const P = 10 ** Math.floor(Math.log10(x))
  if (type === 0) return P * signe
  else if (type === 1) return P * 10 * signe
  else if (x - P < 10 * P - x) return P * signe
  else return P * 10 * signe
}

/**
 * Retourne une liste des entiers de 0 à max sans appartenir à une liste donnée
 * @param {max}
 * @param {listeAEviter}
 *
 * @example
 * // Renvoie [0,1,4,5,6,7,8,9,10]
 * range(10,[2,3])
 *
 * @author Rémi Angot
 */
export function range (max, listeAEviter = []) {
  // Créer un tableau avec toutes les valeurs de 0 à max sauf celle de la liste à éviter
  const nbMax = parseInt(max, 10)
  const liste = [...Array(nbMax + 1).keys()]
  for (let i = 0; i < listeAEviter.length; i++) {
    enleveElement(liste, listeAEviter[i])
  }
  return liste
}

/**
 * Retourne une liste entre 2 bornes sans appartenir à une liste donnée (par défaut des entiers, mais on peut changer le pas)
 * @param {min}
 * @param {max}
 * @param {listeAEviter}
 *
 * @example
 * // Renvoie [6,7,10]
 * range(6,10,[8,9])
 *
 * @author Rémi Angot
 */
export function rangeMinMax (min, max, listeAEviter = [], step = 1) {
  // Créer un tableau avec toutes les valeurs de 0 à max sauf celle de la liste à éviter
  const liste = []
  for (let i = min; i <= max; i = i + step) {
    liste.push(i)
  }
  for (let i = 0; i < listeAEviter.length; i++) {
    enleveElement(liste, listeAEviter[i])
  }
  return liste
}

/**
 * Créé un tableau avec toutes les valeurs de 1 à max sauf celle de la liste à éviter
 *
 *
 * @param {int} max
 * @param {liste} liste valeurs à éviter
 * @author Rémi Angot
 */
export function range1 (max, listeAEviter = []) {
  const nbMax = parseInt(max, 10)
  const liste = []
  for (let i = 1; i <= nbMax; i++) {
    liste.push(i)
  }
  for (let i = 0; i < listeAEviter.length; i++) {
    enleveElement(liste, listeAEviter[i])
  }
  return liste
}

/**
 * Fonction de comparaison à utiliser avec <tableau.sort(compareNombres)>
 *
 *
 * @author Rémi Angot
 */
export function compareNombres (a, b) {
  return a - b
}

/**
 *
 * Copié sur https://delicious-insights.com/fr/articles/le-piege-de-array-sort/
 */
export function numTrie (arr) {
  return arr.sort(function (a, b) {
    return a - b
  })
}

/**
 *
 * @param {number} a
 * -1 si a est négatif, 1 sinon.
 * @author Jean-Claude Lhote
 */
export function unSiPositifMoinsUnSinon (a) {
  if (a < 0) return -1
  else return 1
}
