import Decimal from 'decimal.js'
import { factorisation } from './primalite'
import { texNombre } from './texNombre'

/**
 * Retourne la somme des chiffres (ou d'un tableau de chiffres) d'un nombre en valeur et sous forme de String [valeur, String]
 * @Example
 * sommeDesChiffres(123)
 * // [ 6, '1+2+3']
 * @author Rémi Angot (Rajout Tableau par EE)
 */export function sommeDesChiffres (n: number) {
  let nString: string
  if (Array.isArray(n)) nString = n.join('').toString()
  else nString = n.toString()
  let somme = 0
  let sommeString = ''
  for (let i = 0; i < nString.length - 1; i++) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(nString[i]) !== -1) {
      sommeString += nString[i] + '+'
      somme += Number(nString[i])
    }
  }
  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(nString[nString.length - 1]) !== -1) {
    sommeString += nString[nString.length - 1]
    somme += Number(nString[nString.length - 1])
  }
  return [somme, sommeString]
}

/**
 * Retourne l'égalité des produits en croix à partir d'un tableau contenant les deux fractions [[a,b],[c,d]] pour a/b=c/d retourne ad=bc
 * Le résultat est un string en mode maths inline
 * @author Jean-Claude Lhote
 */

export function produitsEnCroix ([[a, b], [c, d]]: [[number, number], [number, number]]): string { // écrit une chaine pour a*d=b*c
  let result = ''
  result += `$${a}\\times${d}=${b}\\times${c}$`
  return result
}

/**
 * Retourne la quatrième proportionnelle de 3 nombres en fonction d'une précision demandée
 * Le résultat est un string qui doit être entouré de $ pour le mode mathématique
 * @author Jean-Claude Lhote
 */

export function quatriemeProportionnelle (a: number, b: number, c: number, precision: number): string { // calcul de b*c/a
  let result = ''
  if ((typeof a) === 'number' && (typeof b) === 'number' && (typeof c) === 'number') {
    if (a === 0) {
      result = '=erreur : division par zéro'
      return result
    }
    const p4 = new Decimal(b).mul(c).div(a)
    result += `\\dfrac{${texNombre(b, precision)}\\times${texNombre(c, precision)}}{${texNombre(a, precision)}}`
    if (p4.eq(p4.toDP(precision))) result += '='
    else result += '\\approx'
    result += `${texNombre(p4, precision)}`
    return result
  } else {
    return `\\dfrac{${b} \\times${c}}{${a}}`
  }
}

/**
 *
 * @param {number} n
 * Extrait le plus grand nombre possible de la racine carrée de n
 * retourne le résulat [a, b] pour a²b=n
 * @author Jean-Claude Lhote
 */
export function extraireRacineCarree (n: number) {
  if (n === 1) return [[1], [1]]
  const facto = factorisation(n) as number[][]
  let radical = 1
  let facteur = 1
  for (let i = 0; i < facto.length; i++) {
    if (facto[i][1] % 2 === 0) {
      facteur *= facto[i][0] ** (facto[i][1] >> 1)
    } else if (facto[i][1] > 1) {
      facteur *= facto[i][0] ** ((facto[i][1] - 1) >> 1)
      radical *= facto[i][0]
    } else radical *= facto[i][0]
  }
  return [facteur, radical]
}

/**
 * Renvoie un tableau (somme des termes positifs, somme des termes négatifs)
 * @author Rémi Angot
 */
export function sommeDesTermesParSigne (liste: number[]) {
  let sommeDesPositifs = 0
  let sommeDesNegatifs = 0
  for (let i = 0; i < liste.length; i++) {
    if (liste[i] > 0) {
      sommeDesPositifs += liste[i]
    } else {
      sommeDesNegatifs += liste[i]
    }
  }
  return [sommeDesPositifs, sommeDesNegatifs]
}
