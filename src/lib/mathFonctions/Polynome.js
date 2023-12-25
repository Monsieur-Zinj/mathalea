import { equal, largerEq, max } from 'mathjs'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { randint } from '../../modules/outils.js'
import { choice } from '../outils/arrayOutils.js'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, rienSi1 } from '../outils/ecritures.js'
import Decimal from 'decimal.js'

/**
 * Avertissement ! pour l'instant la classe ne gère pas les coefficients fractionnaires !
 * @param {boolean} useFraction laissé à false pour l'instant (les coefficients fractionnaires ne sont pas encore utilisé et
 * le code n'est pas dépourvu de problème si on utilise des coefficients fractionnaires !
 * rendant l'expression mathématique inutilisable avec Algebrite et aussi dans la définition de la fonction x=>f(x)
 * @param {boolean} rand Donner true si on veut un polynôme aléatoire
 * @param {number} deg à fournir >=0 en plus de rand === true pour fixer le degré
 * @param coeffs liste de coefficients par ordre de degré croissant OU liste de couples [valeurMax, relatif?]
 * @author Jean-Léon Henry, Jean-Claude Lhote
 * @example Polynome({ coeffs:[0, 2, 3] }) donne 3x²+2x
 * @example Polynome({ rand:true, deg:3 }) donne un ax³+bx²+cx+d à coefficients entiers dans [-10;10]\{0}
 * @example Polynome({ rand:true, coeffs:[[10, true], 0, [5, false]] }) donne un ax²+b avec a∈[1;5] et b∈[-10;10]\{0}
 */
export class Polynome {
  constructor ({ rand = false, deg = -1, coeffs }) {
    if (rand) {
      if (largerEq(deg, 0)) {
        // on construit coeffs indépendamment de la valeur fournie
        coeffs = new Array(deg + 1)
        coeffs.fill([10, true])
      }
      // Création de this.monomes
      this.monomes = coeffs.map(function (el) {
        if (typeof el === 'number') {
          return el
        } else if (Array.isArray(el)) {
          return el[1] ? choice([-1, 1]) * randint(1, Number(el[0])) : randint(1, Number(el[0]))
        } else if (el instanceof FractionEtendue) {
          return el.valeurDecimale
        } else if (el instanceof Decimal) {
          return el.toNumber()
        } else {
          window.notify('Dans Polynome, l\'un des coefficient n\'est pas d\'un type attendu.', { coeff: el })
          return NaN
        }
      })
    } else {
      // les coeffs sont fourni
      this.monomes = coeffs.map(function (el) {
        if (el instanceof FractionEtendue) return el.valeurDecimale
        return Number(el)
      })
    }
    this.deg = this.monomes.length - 1
    /**
     * la fonction à utiliser pour tracer la courbe par exemple ou calculer des valeurs comme dans pol.image()
     * const f = pol.fonction est une fonction utilisable dans courbe()
     * @returns {function(number): number}
     */
    const monomes = this.monomes
    this.fonction = function (x) {
      let val = 0
      for (let i = 0; i < monomes.length; i++) {
        val = val + monomes[i] * x ** i
      }
      return val
    }
  }

  isMon () { return this.monomes.filter(el => el !== 0).length === 1 }

  /**
   * @param {boolean} alg si true alors le coefficient dominant est doté de son signe +/-
   * @returns {string} expression mathématique compatible avec Algebrite
   */
  toMathExpr (alg = false) {
    let res = ''
    let maj = ''
    for (const [i, c] of this.monomes.entries()) {
      switch (i) {
        case this.deg: {
          const coeffD = alg ? ecritureAlgebriqueSauf1(c) : this.deg === 0 ? ecritureAlgebrique(c) : rienSi1(c)
          switch (this.deg) {
            case 1:
              maj = equal(c, 0) ? '' : `${coeffD}x`
              break
            case 0:
              maj = equal(c, 0) ? '' : `${coeffD}`
              break
            default:
              maj = equal(c, 0) ? '' : `${coeffD}x^${i}`
          }
          break
        }
        case 0:
          maj = equal(c, 0) ? '' : ecritureAlgebrique(c)
          break
        case 1:
          maj = equal(c, 0) ? '' : `${ecritureAlgebriqueSauf1(c)}x`
          break
        default:
          maj = equal(c, 0) ? '' : `${ecritureAlgebriqueSauf1(c)}x^${i}`
          break
      }
      maj = maj.replace(/\s/g, '').replace(',', '.')
      res = maj + res
    }
    return res
  }

  /**
   * @param {boolean} alg si true alors le coefficient dominant est doté de son signe +/-
   * @returns {string} expression mathématique
   */
  toLatex (alg = false) {
    let res = ''
    let maj = ''
    for (const [i, c] of this.monomes.entries()) {
      switch (i) {
        case this.deg: {
          const coeffD = alg ? ecritureAlgebriqueSauf1(c) : this.deg === 0 ? c : rienSi1(c)
          switch (this.deg) {
            case 1:
              maj = equal(c, 0) ? '' : `${coeffD}x`
              break
            case 0:
              maj = equal(c, 0) ? '' : `${coeffD}`
              break
            default:
              maj = equal(c, 0) ? '' : `${coeffD}x^${i}`
          }
          break
        }
        case 0:
          maj = equal(c, 0) ? '' : ecritureAlgebrique(c)
          break
        case 1:
          maj = equal(c, 0) ? '' : `${ecritureAlgebriqueSauf1(c)}x`
          break
        default:
          maj = equal(c, 0) ? '' : `${ecritureAlgebriqueSauf1(c)}x^${i}`
          break
      }
      res = maj + res
    }
    return res
  }

  /**
   * Polynome type conversion to String
   * @returns le résultat de toMathExpr()
   */
  toString () {
    return this.toLatex()
  }

  /**
   * Ajoute un Polynome ou une constante
   * @param {Polynome|number|Fraction} p
   * @example p.add(3) pour ajouter la constante 3 à p
   * @returns {Polynome} this+p
   */
  add (p) {
    if (typeof p === 'number') {
      const coeffs = [...this.monomes]
      coeffs[0] = this.monomes[0] + p
      return new Polynome({ coeffs })
    } else if (p.type === 'Fraction') {
      const coeffs = [...this.monomes]
      coeffs[0] = this.monomes[0] + Number(p)
      return new Polynome({ coeffs })
    } else if (p instanceof Polynome) {
      const degSomme = max(this.deg, p.deg)
      const pInf = equal(p.deg, degSomme) ? this : p
      const pSup = equal(p.deg, degSomme) ? p : this
      const coeffSomme = pSup.monomes.map(function (el, index) { return index <= pInf.deg ? el + pInf.monomes[index] : el })
      return new Polynome({ coeffs: coeffSomme })
    } else {
      window.notify('Polynome.add(arg) : l\'argument n\'est ni un nombre, ni un polynome', { p })
    }
  }

  /**
   *
   * @param {Polynome|number|Fraction} q Polynome, nombre ou fraction
   * @example poly = poly.multiply(fraction(1,3)) divise tous les coefficients de poly par 3.
   * @returns q fois this
   */
  multiply (q) {
    let coeffs
    if (typeof q === 'number') {
      coeffs = this.monomes.map(function (el) { return el * q })
    } else if (q instanceof FractionEtendue) {
      coeffs = this.monomes.map(function (el) { return el * q.valeurDecimale })
    } else if (q instanceof Polynome) {
      coeffs = new Array(this.deg + q.deg + 1)
      coeffs.fill(new FractionEtendue(0))
      for (let i = 0; i <= this.deg; i++) {
        for (let j = 0; j <= q.deg; j++) {
          coeffs[i + j] = coeffs[i + j] + this.monomes[i] * q.monomes[j]
        }
      }
    } else {
      window.notify('Polynome.multiply(arg) : l\'argument n\'est ni un nombre, ni un polynome', { q })
    }
    return new Polynome({ coeffs })
  }

  /**
   * Retourne la dérivée
   * @returns {Polynome} dérivée de this
   */
  derivee () {
    const coeffDerivee = this.monomes.map(function (el, i) { return el * i })
    coeffDerivee.shift()
    return new Polynome({ coeffs: coeffDerivee })
  }

  /**
   * Appelle toMathExpr
   * @param {Array} coeffs coefficients du polynôme par ordre de degré croissant
   * @param {boolean} alg si true alors le coefficient dominant est doté de son signe +/-
   * @returns {string} expression du polynome
   */
  static print (coeffs, alg = false) {
    const p = new Polynome({ coeffs })
    return p.toLatex(alg)
  }

  /**
   * Pour calculer l'image d'un nombre
   * @param x
   * @returns {math.Fraction | number | int} // à mon avis ça ne retourne que des number...
   */
  image (x) {
    // const fonction = x => this.monomes.reduce((val, current, currentIndex) => val + current * x ** currentIndex, 0)
    return this.fonction(x)
  }
}
