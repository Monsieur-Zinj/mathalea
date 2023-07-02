import { gcd } from 'mathjs'
import { egal } from '../../modules/outils.js'

/**
 * Renvoie le PGCD de deux nombres
 * @author Rémi Angot
 */
export function pgcd (...args) {
  return gcd(...args)
}

/**
 * Donne la liste des facteurs premiers d'un nombre
 * @param { number } n - Nombre à décomposer
 * @returns {number[]} - Liste des facteurs premiers
 */
export function obtenirListeFacteursPremiers (n) {
  if (n === 1 || n === 0) return [] // 1 n'est pas premier, mais, sinon, ça retourne [NaN]
  const facteurs = []
  const signe = n < 0 ? -1 : 1
  for (let i = 2; i <= Math.abs(n); i++) {
    while (n % i === 0) {
      facteurs.push(i)
      n /= i
    }
  }
  facteurs[0] = signe * facteurs[0]
  return facteurs
}

/**
 *
 * @param {Entier} n
 * Retourne la factorisation d'un entier sous la forme [[a0,n0],[a1,n1],...] où a0,a1 sont les facteurs premiers et n0, n1 sont les exposants de ces facteurs.
 * @author Jean-Claude Lhote
 */

export function factorisation (n) {
  if (n === 1) return [1]
  const liste = obtenirListeFacteursPremiers(n)
  const facto = []
  let index = 0
  for (let i = 0; i < liste.length;) {
    if (liste[i] === 0) i++
    else {
      facto.push([liste[i], 1])
      index++
      for (let j = i + 1; j < liste.length; j++) {
        if (liste[j] === liste[i]) {
          facto[index - 1][1]++
          liste[j] = 0
        }
      }
      i++
    }
  }
  return facto
}

/**
 *
 * @param {number} n
 * @param {boolean} puissancesOn
 * @returns {string} texFacto
 */
export function texFactorisation (n, puissancesOn = true) {
  let texFacto = ''
  let facto = []
  if (puissancesOn) {
    facto = factorisation(n)
    for (let i = 0; i < facto.length - 1; i++) {
      texFacto += `${facto[i][0]}${facto[i][1] > 1 ? '^{' + facto[i][1] + '}\\times ' : '\\times '}`
    }
    texFacto += `${facto[facto.length - 1][0]}${facto[facto.length - 1][1] > 1 ? '^{' + facto[facto.length - 1][1] + '}' : ''}`
  } else {
    facto = obtenirListeFacteursPremiers(n)
    for (let i = 0; i < facto.length - 1; i++) {
      texFacto += `${facto[i][0]}\\times `
    }
    texFacto += `${facto[facto.length - 1][0]}`
  }
  return texFacto
}

/**
 * Renvoie un tableau contenant les diviseurs d'un nombre entier, rangés dans l'ordre croissant
 * @param {integer} n
 * @author Sébastien Lozano
 */
export function listeDesDiviseurs (n) {
  let i = 2
  const diviseurs = [1]
  while (i <= n) {
    if (n % i === 0) {
      diviseurs.push(i)
    }
    i++
  }
  return diviseurs
}

/**
 * Retourne la liste des nombres premiers inférieurs à N N<300 N exclu
 * @param {integer} k On cherchera un multiple de k
 * @param {integer} n Ce multiple sera supérieur ou égal à n
 * @author Rémi Angot
 */
export function premierMultipleSuperieur (k, n) {
  let result = n
  let reste
  if (Number.isInteger(k) && Number.isInteger(n)) {
    while (result % k !== 0) {
      result += 1
    }
    return result
  } else {
    if (egal(Math.floor((n / k), n / k))) return n
    else {
      reste = n / k - Math.floor(n / k)
      return n - reste * k + k
    }
  }
}

export function premierMultipleInferieur (k, n) {
  const result = premierMultipleSuperieur(k, n)
  if (result !== n) return result - k
  else return n
}

/**
 * Retourne la liste des nombres premiers inférieurs à N N<300 N exclu
 * @param {number} borneSup
 * @author Sébastien Lozano
 */
export function listeNombresPremiersStrictJusqua (borneSup) {
  // tableau contenant les 300 premiers nombres premiers
  const liste300 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293]
  const liste = []
  let i = 0
  while (liste300[i] < borneSup) {
    liste.push(liste300[i])
    i++
  }
  return liste
}

/**
 * Liste les nombres premiers jusque n avec la méthode du crible d'Eratosthene optimisée
 * @param {number} n
 * @author Sébastien Lozano
 */
export function cribleEratostheneN (n) {
  const tabEntiers = [] // pour tous les entiers de 2 à n
  const testMax = Math.sqrt(n + 1) // inutile de tester au dela de racine de n
  const liste = [] // tableau de la liste des premiers jusqu'à n

  // On rempli un tableau avec des booléeens de 2 à n
  for (let i = 0; i < n + 1; i++) {
    tabEntiers.push(true)
  }

  // On supprime les multiples des nombres premiers à partir de 2, 3, 5,...
  for (let i = 2; i <= testMax; i++) {
    if (tabEntiers[i]) {
      for (let j = i * i; j < n + 1; j += i) {
        tabEntiers[j] = false
      }
    }
  }

  // On récupère tous les indices du tableau des entiers dont le booléen est à true qui sont donc premiers
  for (let i = 2; i < n + 1; i++) {
    if (tabEntiers[i]) {
      liste.push(i)
    }
  }

  return liste
}

/**
 * Liste les premiers compris entre min et max au sens large,
 * min est inclu
 * max est inclu.
 * @param {number} min
 * @param {number} max
 * @author Sébastien Lozano
 */

export function premiersEntreBornes (min, max) {
  // on crée les premiers jusque min
  const premiersASupprimer = cribleEratostheneN(min - 1)
  // on crée les premiers jusque max
  const premiersJusqueMax = cribleEratostheneN(max)
  // on supprime le début de la liste jusque min
  premiersJusqueMax.splice(0, premiersASupprimer.length)
  // on renvoie le tableau restant
  return premiersJusqueMax
}
