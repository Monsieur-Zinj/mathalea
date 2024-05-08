import { abs, acos, equal, largerEq, max, polynomialRoot, round } from 'mathjs'
import { egal, randint } from '../../modules/outils'
import { choice } from '../outils/arrayOutils'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, rienSi1 } from '../outils/ecritures'
import Decimal from 'decimal.js'
import { texNombre } from '../outils/texNombre'
import { rationnalise } from './outilsMaths'
import FractionEtendue from '../../modules/FractionEtendue'
import { generateCleaner } from '../interactif/comparisonFunctions'

const clean = generateCleaner(['virgules', 'fractions', 'espaces'])
// une fonction pour ajouter deux nombres dont on ne connait pas le type
const somme = function (a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a + b
  if (a instanceof Decimal) {
    if (b instanceof Decimal) return a.add(b)
    else if (b instanceof FractionEtendue) return a.add(new Decimal(b.valeurDecimale))
    else return a.add(new Decimal(b))
  }
  if (a instanceof FractionEtendue) {
    if (b instanceof FractionEtendue) return a.sommeFraction(b).simplifie()
    else return a.sommeFraction(rationnalise(b)).simplifie()
  }
}
// une fonction pour multiplier deux nombres dont on ne connait pas le type
const produit = function (a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a * b
  if (a instanceof Decimal) {
    if (b instanceof Decimal) return a.mul(b)
    else if (b instanceof FractionEtendue) return a.mul(new Decimal(b.valeurDecimale))
    else return a.mul(new Decimal(b))
  }
  if (a instanceof FractionEtendue) {
    if (b instanceof FractionEtendue) return a.produitFraction(b).simplifie()
    else return a.produitFraction(rationnalise(b)).simplifie()
  }
}

const quotient = function (a, b) {
  if (egal(b, 0)) window.notify('quotient de Polynome.js a reçu un diviseur nul', { dividende: a, diviseur: b })
  if (typeof a === 'number' && typeof b === 'number') return a / b
  if (a instanceof Decimal) {
    if (b instanceof Decimal) return a.div(b)
    else if (b instanceof FractionEtendue) return a.div(new Decimal(b.valeurDecimale))
    else return a.div(new Decimal(b))
  }
  if (a instanceof FractionEtendue) {
    if (b instanceof FractionEtendue) return a.diviseFraction(b).simplifie()
    else return a.diviseFraction(rationnalise(b)).simplifie()
  }
}

/**
 * Avertissement ! pour l'instant la classe ne gère pas les coefficients fractionnaires !
 * @param {boolean} useFraction laissé à false pour l'instant (les coefficients fractionnaires ne sont pas encore utilisé et
 * @param {boolean} useDecimal useFraction a prévalence sur useDecimal pour avoir des décimaux, il faut que useFraction soit false (valeur par défaut donc c'est bon)
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
  constructor ({ rand = false, deg = -1, coeffs, useFraction = false, useDecimal = false }) {
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
          if (el[0] === 0) return 0
          if (useFraction) {
            const den = choice([2, 4, 5])
            const aFrac = new FractionEtendue(...(new Decimal(randint(1, den * Number(el[0]))).div(den).toFraction(100)))
            return el[1] ? aFrac.multiplieEntier(choice([-1, 1])) : aFrac
          } else if (useDecimal) {
            const dec = new Decimal(randint(1, 10 * Number(el[0]))).div(10)
            return el[1] ? dec.mul(choice([-1, 1])) : dec
          } else {
            return el[1] ? choice([-1, 1]) * randint(1, Number(el[0])) : randint(1, Number(el[0]))
          }
        } else if (el instanceof FractionEtendue) {
          return el
        } else if (el instanceof Decimal) {
          return el
        } else {
          window.notify('Dans Polynome, l\'un des coefficient n\'est pas d\'un type attendu.', { coeff: el })
          return NaN
        }
      })
    } else {
      // les coeffs sont fourni
      this.monomes = coeffs.map(function (el) {
        if (el instanceof FractionEtendue) {
          if (useFraction) {
            return el
          } else {
            return new Decimal(`${el.num}/${el.den}`)
          }
        } else if (el instanceof Decimal) {
          if (useDecimal) {
            return el
          } else {
            return el.round()
          }
        }
        return Number(el)
      })
    }
    this.useFraction = useFraction ?? this.monomes.filter(el => el instanceof FractionEtendue).length > 0
    this.useDecimal = useDecimal ?? (this.monomes.filter(el => el instanceof Decimal).length > 0 && this.monomes.filter(el => el instanceof FractionEtendue).length === 0)

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
        if (monomes[i] instanceof FractionEtendue) {
          val = val + monomes[i].valeurDecimale * x ** i
        } else if (monomes[i] instanceof Decimal) {
          val = val + monomes[i].toNumber() * x ** i
        } else {
          val = val + monomes[i] * x ** i
        }
      }
      return val
    }
  }

  isMon () { return this.monomes.filter(el => el !== 0).length === 1 }

  isEqual (p) {
    if (typeof p === 'number') {
      if (this.monome[0] !== p) return false
      for (let i = 1; i <= this.deg; i++) {
        if (this.monomes[i] !== 0) {
          return false
        }
      }
      return true
    }
    if (p instanceof Polynome) {
      const degP = p.deg
      if (degP === this.deg) {
        return this.monomes.filter((el, i) => el !== p.monomes[i]).length === 0
      }
      const degMin = Math.min(this.deg, p.deg)
      for (let i = 0; i <= degMin; i++) {
        if (!egal(p.monomes[i], this.monomes[i], 1e-15)) return false
      }
      for (let i = degMin + 1; i <= Math.max(p.deg, this.deg); i++) {
        if (i <= this.deg) {
          if (this.monomes[i] !== 0) return false
        }
        if (i <= p.deg) {
          if (p.monomes[i] !== 0) return false
        }
      }
      return true
    }
    window.notify(`Polynome.isEqual a reçu comme argument autre chose qu'un number ou un Polynome : ${p}`)
    return false
  }

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
          let coeffD
          if (c instanceof FractionEtendue) {
            coeffD = alg
              ? `${c.valeurDecimale < 0 ? c.valeurAbsolue().valeurDecimale === 1 ? '-' : '-{' + String(c.n) + '/' + String(c.d) + '}' : c.valeurDecimale === 1 ? '+' : '+{' + String(c.n) + '/' + String(c.d)}+'}'`
              : this.deg === 0 ? c.ecritureAlgebrique : rienSi1(c)
          } else {
            coeffD = alg ? ecritureAlgebriqueSauf1(c) : this.deg === 0 ? ecritureAlgebrique(c) : rienSi1(c)
          }
          switch (this.deg) {
            case 1:
              maj = egal(c, 0, 1e-15) ? '' : `${coeffD}x`
              break
            case 0:
              maj = egal(c, 0, 1e-15) ? '' : `${coeffD}`
              break
            default:
              maj = egal(c, 0, 1e-15) ? '' : `${coeffD}x^${i}`
          }
          break
        }
        case 0:
          maj = egal(c, 0, 1e-15) ? '' : `${c instanceof FractionEtendue ? (c.valeurDecimale < 0 ? '-' : '+') + String(c.n) + '/' + String(c.d) : ecritureAlgebrique(c)}`
          break
        case 1:
          maj = egal(c, 0, 1e-15)
            ? ''
            : c instanceof FractionEtendue
              ? (`${c.valeurDecimale < 0
                  ? c.valeurAbsolue().valeurDecimale === 1 ? '-' : '-{' + String(c.n) + '/' + String(c.d)
                  : c.valeurDecimale === 1 ? '+' : '+{' + String(c.n) + '/' + String(c.d)}`) +
                  '}x'
              : `${ecritureAlgebriqueSauf1(c)}x`
          break
        default:
          maj = egal(c, 0, 1e-15)
            ? ''
            : c instanceof FractionEtendue
              ? (`${c.valeurDecimale < 0
                      ? c.valeurAbsolue().valeurDecimale === 1 ? '-' : '-{' + String(c.n) + '/' + String(c.d)
                      : c.valeurDecimale === 1 ? '+' : '+{' + String(c.n) + '/' + String(c.d)}`) +
                  `}x^${i}`
              : `${ecritureAlgebriqueSauf1(c)}x^${i}`
          break
      }
      maj = clean(maj)
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
          if (this.deg === 0) return texNombre(c, 2)
          switch (this.deg) {
            case 1:
              maj = egal(c, 0, 1e-15) ? '' : `${coeffD}x`
              break
            case 0:
              maj = egal(c, 0, 1e-15) ? '' : `${coeffD}`
              break
            default:
              maj = egal(c, 0, 1e-15) ? '' : `${coeffD}x^{${i}}`
          }
          break
        }
        case 0:
          maj = egal(c, 0, 1e-15) ? '' : ecritureAlgebrique(c)
          break
        case 1:
          maj = egal(c, 0, 1e-15) ? '' : `${ecritureAlgebriqueSauf1(c)}x`
          break
        default:
          maj = egal(c, 0, 1e-15) ? '' : `${ecritureAlgebriqueSauf1(c)}x^{${i}}`
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
      const useFrac = this.monomes.filter(el => el instanceof FractionEtendue).length > 0
      const coeffs = [...this.monomes]
      coeffs[0] = somme(this.monomes[0], p)
      return new Polynome({ coeffs, useFraction: useFrac })
    } else if (p instanceof FractionEtendue) {
      const coeffs = [...this.monomes]
      coeffs[0] = somme(this.monomes[0], p)
      return new Polynome({ coeffs, useFraction: true })
    } else if (p instanceof Decimal) {
      const useFrac = this.monomes.filter(el => el instanceof FractionEtendue).length > 0
      const coeffs = [...this.monomes]
      coeffs[0] = somme(p, this.monomes[0])
      return new Polynome({ coeffs, useFraction: useFrac })
    } else if (p instanceof Polynome) {
      const useFrac = (p.monomes.filter(el => el instanceof FractionEtendue).length > 0 || this.monomes.filter(el => el instanceof FractionEtendue).length > 0)
      const degSomme = max(this.deg, p.deg)
      const pInf = equal(p.deg, degSomme) ? this : p
      const pSup = equal(p.deg, degSomme) ? p : this
      const coeffSomme = pSup.monomes.map(function (el, index) {
        return index <= pInf.deg
          ? somme(el, pInf.monomes[index])
          : el
      })
      return new Polynome({ coeffs: coeffSomme, useFraction: useFrac })
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
    const useFrac = q instanceof Polynome
      ? q.monomes.filter(el => el instanceof FractionEtendue).length > 0 || this.monomes.filter(el => el instanceof FractionEtendue).length > 0
      : q instanceof FractionEtendue

    if (typeof q === 'number' || q instanceof FractionEtendue) {
      coeffs = this.monomes.map(function (el) { return produit(el, q) })
    } else if (q instanceof Polynome) {
      coeffs = new Array(this.deg + q.deg + 1)
      coeffs.fill(0)
      for (let i = 0; i <= this.deg; i++) {
        for (let j = 0; j <= q.deg; j++) {
          coeffs[i + j] = somme(coeffs[i + j], produit(this.monomes[i], q.monomes[j]))
        }
      }
    } else {
      window.notify('Polynome.multiply(arg) : l\'argument n\'est ni un nombre, ni un polynome', { q })
    }
    return new Polynome({ coeffs, useFraction: useFrac })
  }

  /**
   * Retourne la dérivée
   * @returns {Polynome} dérivée de this
   */
  derivee () {
    const coeffDerivee = this.monomes.map(function (el, i) { return produit(el, i) })
    coeffDerivee.shift()
    for (let i = coeffDerivee.length - 1; i > 0; i--) {
      if (coeffDerivee[i] === 0) {
        coeffDerivee.pop()
        continue
      }
      break
    }
    if (coeffDerivee.length === 0) return new Polynome({ deg: 0, coeffs: [0] })
    return new Polynome({ coeffs: coeffDerivee, useFraction: this.useFraction, useDecimal: this.useDecimal })
  }

  /**
   * Retourne la primitive de constante 0 de this
   * @returns {Polynome}
   */
  primitive0 () {
    let coeffPrimitive = this.monomes.map((el, i) => quotient(el, i + 1))
    coeffPrimitive = [0, ...coeffPrimitive]
    const useFrac = coeffPrimitive.filter(el => el instanceof FractionEtendue).length > 0
    const useDecim = coeffPrimitive.filter(el => el instanceof Decimal).length > 0 && !useFrac
    return new Polynome({ coeffs: coeffPrimitive, useFraction: useFrac, useDecimal: useDecim })
  }

  racines () {
    const antecedents = []
    if (this.monomes.slice(1).filter(el => el !== 0).length === 0) {
      return null
    }
    const liste = polynomialRoot(...this.monomes.map(el => Number(el)))
    for (const valeur of liste) {
      let arr
      if (typeof valeur === 'number') {
        arr = round(valeur, 3)
      } else { // complexe !
        const module = valeur.toPolar().r
        if (module < 1e-5) { // module trop petit pour être complexe, c'est 0 !
          arr = 0
        } else {
          const argument = valeur.arg()
          if (abs(argument) < 0.01 || abs((abs(argument) - acos(-1))) < 0.001) { // si l'argument est proche de 0 ou de Pi ou de -Pi
            arr = round(valeur.re, 3) // on prend la partie réelle
          } else {
            arr = null // c'est une vraie racine complexe, du coup, on prend null
          }
        }
      }
      if (arr !== null) {
        if (!antecedents.includes(arr)) {
          antecedents.push(arr)
        }
      }
    }
    return antecedents
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
