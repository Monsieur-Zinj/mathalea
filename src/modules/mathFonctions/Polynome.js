import { equal, fraction, largerEq, max, number, unequal, add, multiply } from 'mathjs'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, rienSi1 } from '../../lib/outils/ecritures.js'
import { choice, randint } from '../outils.js'

/**
 * Avertissement ! pour l'instant la classe ne gère pas les coefficients fractionnaires !
 * @param {boolean} useFraction laissé à false pour l'instant (les coefficients fractionnaires ne sont pas encore utilisé et
 * le code n'est pas dépourvu de problème si on utilise des coefficients fractionnaires !
 * rendant l'expression mathématique inutilisable avec Algebrite et aussi dans la définition de la fonction x=>f(x)
 * @param {boolean} rand Donner true si on veut un polynôme aléatoire
 * @param {number} deg à fournir >=0 en plus de rand === true pour fixer le degré
 * @param {Array} coeffs liste de coefficients par ordre de degré croissant OU liste de couples [valeurMax, relatif?]
 * @author Jean-Léon Henry, Jean-Claude Lhote
 * @example Polynome({ coeffs:[0, 2, 3] }) donne 3x²+2x
 * @example Polynome({ rand:true, deg:3 }) donne un ax³+bx²+cx+d à coefficients entiers dans [-10;10]\{0}
 * @example Polynome({ rand:true, coeffs:[[10, true], [0], [5, false]] }) donne un ax²+b avec a∈[1;5] et b∈[-10;10]\{0}
 */
export class Polynome {
  constructor ({ isUseFraction = false, rand = false, deg = -1, coeffs = [[10, true], [10, true]] }) {
    this.isUseFraction = false // @todo besoin d'adapter le code (notamment du getter fonction() !)
    if (rand) {
      if (largerEq(deg, 0)) {
        // on construit coeffs indépendamment de la valeur fournie
        coeffs = new Array(deg + 1)
        coeffs.fill([10, true])
      }
      // Création de this.monomes
      this.monomes = coeffs.map(function (el) {
        if (isUseFraction) {
          if (equal(el[0], 0)) {
            return fraction(0)
          } else {
            return el[1] ? fraction(choice([-1, 1]) * randint(1, number(el[0]))) : fraction(randint(1, number(el[0])))
          }
        } else {
          if (equal(el[0], 0)) {
            return 0
          } else {
            return el[1] ? choice([-1, 1]) * randint(1, number(el[0])) : randint(1, number(el[0]))
          }
        }
      })
    } else {
      // les coeffs sont fourni
      this.monomes = coeffs.map(function (el) {
        if (isUseFraction) {
          return fraction(el)
        } else {
          return el
        }
      })
    }
    this.deg = this.monomes.length - 1
  }

  isMon () { return this.monomes.filter(el => unequal(el, 0)).length === 1 }

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
          const coeffD = alg ? ecritureAlgebriqueSauf1(this.isUseFraction ? fraction(c) : c) : this.deg === 0 ? (this.isUseFraction ? fraction(c).toLatex() : c) : rienSi1(this.isUseFraction ? fraction(c) : c)
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
          maj = equal(c, 0) ? '' : ecritureAlgebrique(this.isUseFraction ? fraction(c) : c)
          break
        case 1:
          maj = equal(c, 0) ? '' : `${ecritureAlgebriqueSauf1(this.isUseFraction ? fraction(c) : c)}x`
          break
        default:
          maj = equal(c, 0) ? '' : `${ecritureAlgebriqueSauf1(this.isUseFraction ? fraction(c) : c)}x^${i}`
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
    const isUseFraction = this.isUseFraction
    if (typeof p === 'number' || p.type === 'Fraction') {
      const coeffs = [...this.monomes]
      coeffs[0] = add(this.monomes[0], p)
      return new Polynome({ isUseFraction, coeffs })
    } else if (p instanceof Polynome) {
      const degSomme = max(this.deg, p.deg)
      const pInf = equal(p.deg, degSomme) ? this : p
      const pSup = equal(p.deg, degSomme) ? p : this
      const coeffSomme = isUseFraction
        ? pSup.monomes.map(function (el, index) { return index <= pInf.deg ? fraction(add(el, pInf.monomes[index])) : fraction(el) })
        : pSup.monomes.map(function (el, index) { return index <= pInf.deg ? add(el, pInf.monomes[index]) : el })
      return new Polynome({ isUseFraction, coeffs: coeffSomme })
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
    const isUseFraction = this.isUseFraction
    let coeffs
    if (typeof q === 'number' || q.type === 'Fraction') {
      coeffs = isUseFraction
        ? this.monomes.map(function (el) { return fraction(multiply(el, q)) })
        : this.monomes.map(function (el) { return multiply(el, q) })
    } else if (q instanceof Polynome) {
      coeffs = new Array(this.deg + q.deg + 1)
      coeffs.fill(0)
      for (let i = 0; i <= this.deg; i++) {
        for (let j = 0; j <= q.deg; j++) {
          coeffs[i + j] = add(coeffs[i + j], multiply(this.monomes[i], q.monomes[j]))
        }
      }
    } else {
      window.notify('Polynome.multiply(arg) : l\'argument n\'est ni un nombre, ni un polynome', { q })
    }
    return new Polynome({ isUseFraction, coeffs })
  }

  /**
   * Retourne la dérivée
   * @returns {Polynome} dérivée de this
   */
  derivee () {
    const coeffDerivee = this.isUseFraction
      ? this.monomes.map(function (el, i) { return fraction(multiply(i, el)) })
      : this.monomes.map(function (el, i) { return multiply(i, el) })
    coeffDerivee.shift()
    return new Polynome({ isUseFraction: this.isUseFraction, coeffs: coeffDerivee })
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
   * la fonction à utiliser pour tracer la courbe par exemple ou calculer des valeurs comme dans pol.image()
   * const f = pol.fonction est une fonction utilisable dans courbe()
   * @returns {function(number): number}
   */
  get fonction () {
    return x => this.monomes.reduce((val, current, currentIndex) => val + current * x ** currentIndex)
  }

  /**
   * Pour calculer l'image d'un nombre
   * @param x
   * @returns {math.Fraction | number | int} // à mon avis ça ne retourne que des number...
   */
  image (x) {
    return this.fonction(x)
  }
}
