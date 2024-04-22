import FractionEtendue from '../../modules/FractionEtendue.ts'
import { fraction } from '../../modules/fractions.js'
import { randint } from '../../modules/outils.js'
import { ecritureAlgebrique } from '../outils/ecritures'
import { matriceCarree } from './MatriceCarree.js'
import Decimal from 'decimal.js'
import { Polynome } from './Polynome.js'
import { miseEnEvidence, texcolors } from '../outils/embellissements'

/**
 * retourne une FractionEtendue à partir de son écriture en latex (ne prend pas en compte des écritures complexes comme
 * \dfrac{4+\dfrac{4}{5}}{5-\dfrac{3}{5}}
 * @param {string} fractionLatex la fraction écrite en latex (avec des accolades) exemple : \frac{5}{7} ou \dfrac{5}{7}
 * @returns {FractionEtendue}
 */
export function fractionLatexToMathjs (fractionLatex) {
  const parts = fractionLatex.split('{')
  const num = Number(parts[1].slice(0, -1))
  const den = Number(parts[2].slice(0, -1))
  return new FractionEtendue(num, den)
}

/**
 * delta(true) retourne dans un tableau des valeurs de a, b, c telles que b*b-4*a*c >0
 * delta(false) retourne dans un tableau des valeurs de a, b, c telles que b*b-4*a*c <0
 * @author Jean-Claude Lhote
 */
export function choisiDelta (positif) {
  let d, a, b, c
  do {
    a = randint(-5, 5, 0)
    b = randint(-5, 5, 0)
    c = randint(-5, 5, 0)
    d = b * b - 4 * a * c
  } while (positif ? d <= 0 : d >= 0)
  return [a, b, c]
}

/**
 * fonction qui retourne un polynome du second degré correctement écrit.
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {string}
 */
export function expTrinome (a, b, c) {
  let expr = ''
  if (typeof a === 'number') {
    switch (a) {
      case 0:
        break
      case -1:
        expr += '-x^2'
        break
      case 1:
        expr += 'x^2'
        break
      default:
        expr += `${a}x^2`
        break
    }
  } else {
    expr += `${a}x^2`
  }
  if (typeof b === 'number') {
    switch (b) {
      case 0:
        break
      case -1:
        expr += '-x'
        break
      case 1:
        expr += '+x'
        break
      default:
        if (a === 0) {
          expr += `${b}`
        } else expr += `${ecritureAlgebrique(b)}x`
        break
    }
  } else {
    if (a === 0) {
      expr += `${b}x`
    } else {
      expr += `+${b}x`
    }
  }
  if (typeof c === 'number') {
    if (a === 0 && b === 0) {
      expr += `${c}`
    } else {
      if (c !== 0) {
        expr += `${ecritureAlgebrique(c)}`
      }
    }
  } else {
    expr += `+${c}`
  }
  return expr
}

/**
 * Une fonction qui retourrne le polynome de Lagrange passant par une liste de points
 * @param {{x:number,y:number}[]} listePoints
 * @return {Polynome}
 */
export function interpolationDeLagrange (listePoints) {
  // tout d'abord vérifier qu'il n'y a pas de doublons en x !
  const listeOrdonnee = listePoints.sort((el1, el2) => el1.x - el2.x)
  const setPoints = []
  for (let i = 1; i < listeOrdonnee.length; i++) {
    // si deux points qui se suivent dans la liste ordonnée ont des abscisses différentes, alors on peut stocker le plus petit
    if (listeOrdonnee[i - 1].x !== listeOrdonnee[i].x) setPoints.push(listeOrdonnee[i - 1])
  }
  // comme on n'a pas stocké le dernier, on le fait
  setPoints.push(listeOrdonnee[listeOrdonnee.length - 1])
  if (setPoints.length < 2) throw Error('Pour une interpolation de Lagrange, il faut au moins deux points d\'abscisses différentes')
  const n = setPoints.length - 1
  // On initialise à zéro
  let result = 0
  for (let j = 0; j <= n; j++) {
    // pour un produit on initialise à 1
    let prod = 1
    for (let i = 0; i <= n; i++) {
      if (j !== i) {
        const den = setPoints[j].x - setPoints[i].x
        prod = new Polynome({ coeffs: [-setPoints[i].x / den, 1 / den] }).multiply(prod)
      }
    }
    prod = prod.multiply(setPoints[j].y)
    result = prod.add(result)
  }
  return result
}

/**
 * Fonction qui retourne les coefficients a et b de f(x)=ax²+bx+c à partir des données de x1,x2,f(x1),f(x2) et c.
 *@param {number} x1
 *@param {number} x2
 * @param {number} y1
 * @param {number} y1
 * @param {number} c
 * @return {[[number,number],[number,number]]}
 * @author Jean-Claude Lhote
 */
export function resolutionSystemeLineaire2x2 (x1, x2, fx1, fx2, c) {
  const matrice = matriceCarree([[x1 ** 2, x1], [x2 ** 2, x2]])
  const determinant = matrice.determinant()
  if (determinant.isEqual(0)) {
    return [[0, 0], [0, 0], [0, 0]]
  }
  const [a, b] = matrice.cofacteurs().transposee().multiplieVecteur([fx1 - c, fx2 - c])
  if (Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(determinant)) {
    window.notify(`Les coefficients trouvés sont des entiers avant division par le déterminant,
     cela ne devrait pas arriver puisque multiplieVecteur() produit des FractionEtendue.
      Le déterminant est : ${determinant} et les numérateurs ${a} et ${b}`, { determinant, a, b })
    const fa = determinant.inverse.multiplieEntier(a)
    const fb = determinant.inverse.multiplieEntier(b)
    return [[fa.numIrred, fa.denIrred], [fb.numIrred, fb.denIrred]]
  } else {
    const fa = a.diviseFraction(determinant)
    const fb = b.diviseFraction(determinant)
    return [
      [fa.numIrred, fa.denIrred],
      [fb.numIrred, fb.denIrred]
    ]
  }
}

/**
 * Fonction qui retourne les coefficients a, b et c de f(x)=ax^3 + bx² + cx + d à partir des données de x1,x2,x3,f(x1),f(x2),f(x3) et d (entiers !)
 * sous forme de fraction irréductible. Si pas de solution (déterminant nul) alors retourne [[0,0],[0,0],[0,0]]
 * @author Jean-Claude Lhote
 */
export function resolutionSystemeLineaire3x3 (x1, x2, x3, fx1, fx2, fx3, d) {
  const matrice = matriceCarree([[x1 ** 3, x1 ** 2, x1], [x2 ** 3, x2 ** 2, x2], [x3 ** 3, x3 ** 2, x3]])
  const y1 = fx1 - d
  const y2 = fx2 - d
  const y3 = fx3 - d
  const determinant = matrice.determinant()
  if (determinant.isEqual(0)) {
    return [[0, 0], [0, 0], [0, 0]]
  }
  const [a, b, c] = matrice.cofacteurs().transposee().multiplieVecteur([y1, y2, y3])
  if (Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(c) && Number.isInteger(determinant)) { // code caduque : determinant est une FractionEtendue de même que a,b et c
    const fa = determinant.inverse.multiplieEntier(a)
    const fb = determinant.inverse.multiplieEntier(b)
    const fc = determinant.inverse.multiplieEntier(c)
    window.notify(`Les coefficients trouvés sont des entiers avant division par le déterminant,
     cela ne devrait pas arriver puisque multiplieVecteur() produit des FractionEtendue.
      Le déterminant est : ${determinant} et les numérateurs ${a}, ${b} et ${c}`, { determinant, a, b, c })
    return [
      [fa.numIrred, fa.denIrred],
      [fb.numIrred, fb.denIrred],
      [fc.numIrred, fc.denIrred]
    ]
  } else {
    const fa = a.diviseFraction(determinant)
    const fb = b.diviseFraction(determinant)
    const fc = c.diviseFraction(determinant)
    return [
      [fa.numIrred, fa.denIrred],
      [fb.numIrred, fb.denIrred],
      [fc.numIrred, fc.denIrred]
    ]
  }
}

export function rationnalise (x) {
  if (x instanceof FractionEtendue) return x
  if (typeof x === 'number' || x instanceof Decimal) {
    if (Number.isInteger(x)) {
      return new FractionEtendue(Number(x), 1)
    }
    const f = fraction(x.toFixed(2))
    return f
  }
  // c'est pas un number, c'est pas une FractionEtendue... ça doit être une Fraction de mathjs
  return new FractionEtendue(x.n * x.s, x.d)
}

export const miseEnForme = (str, n, color) => color ? miseEnEvidence(str, texcolors(n)) : str

/**
 * Supprime les parenthèses dans une somme du type (5x+3)-(2x^2-3x+4)+(4x+7-3x^3)
 * l'intérieur des parenthèses pour l'instant de peut contenir que des entiers, des lettres et des + ou -
 * Les parenthèses doivent être de vraies parenthèses (pas des \left( ou des \lparen) donc on convertira ici avant de les supprimer
 * Non testé sur des expressions comme (5x+3)(4x+3) car c'est pas fait pour !
 * @param {string} exp
 * @param {string} lettre
 * @param {{color: boolean}} options
 */
export function suppressionParentheses (exp, lettre, options) {
  const deg = (term) => term.includes('^')
    ? term.match(/\^(\d)/)[0].match(/\d/)[0]
    : term.includes(lettre)
      ? 1
      : 0
  exp = exp.replaceAll('\\lparen', '(').replaceAll('\\rparen', ')')
  exp = exp.replaceAll('\\left(', '(').replaceAll('\\right)', ')')
  const parts = exp.match(/[-+]?\([\da-z+^-]*\)/g)
  let expressionFinale = ''
  const regString = '(-?\\+?\\d*' + lettre + '?\\^?\\d?)'
  const regX = new RegExp(regString, 'g')
  for (const part of parts) {
    if (typeof part === 'string') {
      if (part.startsWith('(')) {
        const interior = part.substring(1, part.length - 1)
        const terms = interior.match(regX)
        for (const term of terms.filter(el => el !== '')) {
          const d = deg(term)
          expressionFinale += miseEnForme(term, d, options?.color)
        }
      } else if (part.startsWith('-')) {
        const interior = part.substring(2, part.length - 1)
        const terms = interior.match(regX)
        for (const term of terms.filter(el => el !== '')) {
          const d = deg(term)
          if (term.startsWith('-')) {
            expressionFinale += miseEnForme('+' + term.substring(1), d, options?.color)
          } else if (term.startsWith('+')) {
            expressionFinale += miseEnForme('-' + term.substring(1), d, options?.color)
          } else {
            expressionFinale += miseEnForme('-' + term, d, options?.color)
          }
        }
      } else if (part.startsWith('+')) {
        const interior = part.substring(2, part.length - 1)
        const terms = interior.match(regX)
        for (const term of terms.filter(el => el !== '')) {
          const d = deg(term)
          const premierChar = term.charAt(0)
          if (['+', '-'].includes(premierChar)) expressionFinale += miseEnForme(term, d, options?.color)
          else expressionFinale += miseEnForme('+' + term, d, options?.color)
        }
      }
    }
  }
  return expressionFinale
}

/**
 *
 * @param {string} exp
 * @param {string} lettre
 */
export function regroupeTermesMemeDegre (exp, lettre, options) {
  const regString = '(-?\\+?\\d*' + lettre + '?\\^?\\d?)'
  const regX = new RegExp(regString, 'g')
  const parts = exp.match(regX).filter(el => el !== '')
  const allTheTerms = []
  if (parts != null) {
    for (const part of parts) {
      const deg = part.includes('^')
        ? part.match(/\^(\d)/)[0].match(/\d/)[0]
        : part.includes(lettre)
          ? 1
          : 0
      if (allTheTerms[deg] == null) allTheTerms[deg] = []
      allTheTerms[deg].push(part)
    }
  }
  const expressionFinale = []
  for (let i = allTheTerms.length; i > 0; i--) {
    const listOfTerm = allTheTerms[i - 1]
    if (listOfTerm.length > 0) {
      let parcel = ''
      for (let term of listOfTerm) {
        if (term.startsWith('+') && parcel === '') term = term.substring(1)
        parcel += term
      }
      expressionFinale.push(`(${miseEnForme(parcel, i - 1, options?.color)})`)
    }
  }
  return expressionFinale.join('+')
}

export function developpe (expr, options) {

}
