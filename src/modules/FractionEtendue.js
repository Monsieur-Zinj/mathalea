import { arc, cercle } from '../lib/2d/cercle.js'
import { point } from '../lib/2d/points.js'
import { carre } from '../lib/2d/polygones.js'
import { segment, vecteur } from '../lib/2d/segmentsVecteurs.js'
import { texteParPosition } from '../lib/2d/textes.js'
import { rotation, translation } from '../lib/2d/transformations.js'
import { miseEnEvidence } from '../lib/outils/embellissements'
import { extraireRacineCarree } from '../lib/outils/calculs'
import { ecritureAlgebrique, ecritureParentheseSiNegatif, signeMoinsEnEvidence } from '../lib/outils/ecritures'
import { arrondi, nombreDeChiffresDansLaPartieDecimale } from '../lib/outils/nombres'
import {
  decompositionFacteursPremiers,
  listeDesDiviseurs,
  obtenirListeFacteursPremiers,
  pgcd
} from '../lib/outils/primalite'
import { stringNombre, texNombre } from '../lib/outils/texNombre'
import {
  quotientier,
  egal, ppcm
} from './outils.js'
import { abs, multiply, gcd, round, lcm, max, min, pow, Fraction } from 'mathjs'
import { fraction } from './fractions.js'
import { colorToLatexOrHTML } from './2dGeneralites.js'
import Decimal from 'decimal.js'

/**
 * La classe FractionEtendue est une extension de la classe  FractionMathjs  de mathjs
 * @author Jean-Claude Lhote
 * Merci à Daniel Caillibaud pour son aide.
 * Pour créer une instance de la classe FractionEtendue on peut utiliser la fonction fraction() qui se trouve dans le fichier modules/fractions.js
 * Ou utiliser la syntaxe f = new FractionEtendue () qui crée une  FractionMathjs  nulle.
 * On peut utiliser tous les arguments utilisables par  FractionMathjs  :
 * f = new FractionEtendue ('0.(3)') // crée la  FractionMathjs  $\frac{1}{3}$
 * f = fraction(12,15) // crée la  FractionMathjs  $\frac{12}{15}$ (Remarque : new FractionEtendue(12,15) crée $\frac{4}{5}$)
 * f = fraction(0.4) // crée la  FractionMathjs  $\frac{2}{5}$
 */
class FractionEtendue extends Fraction {
  constructor (...args) {
    super()
    let num, den
    if (args.length > 2 || args.length < 1) {
      window.notify('FractionEtendue : nombre d\'arguments incorrect', { args })
    } else {
      if (args.length === 1) { // un seul argument qui peut être un nombre (décimal ou pas)
        if (args[0] instanceof Decimal) { // Decimal.toFraction() retourne '7, 4' pour 1.75... On récupère ainsi le numérateur et le dénominateur.
          [num, den] = args[0].toFraction().split(',').map(el => Number(el))
        } else {
          num = Number(args[0]) // ça c'est pas terrible... et ça peut conduire à des fractions monumentales !
          den = 1
        }
      } else {
        num = Number(args[0])
        den = Number(args[1])
      }
      if (!isNaN(num) && !isNaN(den)) { // Si ce sont des nombres, on les rend entiers si besoin.
      //  num = Number(num) // Je ne vois pas bien à quoi ça sert ça ! ce sont déjà des numbers !
      //  den = Number(den) // Je le vire le 27/09/2023 (J-C)

        // Méthode codée par Eric Elter pour tenter de rendre rationnel un nombre qui ne l'est pas forcément.
        let maxDecimalesNumDen = max(nombreDeChiffresDansLaPartieDecimale(num), nombreDeChiffresDansLaPartieDecimale(den))
        if (maxDecimalesNumDen > 9) { // On peut estimer que num et/ou den ne sont pas décimaux. Essayons de les diviser car peut-être que leur quotient est mieux.
          const quotientNumDen = arrondi(num / den, 12)
          if (nombreDeChiffresDansLaPartieDecimale(quotientNumDen) < 9) { // On peut estimer que le quotient aboutit à un décimal. Ex. dans fraction(7/3,14/3)
            num = quotientNumDen
            den = 1
            maxDecimalesNumDen = max(nombreDeChiffresDansLaPartieDecimale(num), nombreDeChiffresDansLaPartieDecimale(den))
          } else { // On peut estimer que le quotient n'aboutit pas à un décimal. Essayons par l'inverse du quotient.
            const quotientDenNum = arrondi(den / num, 12)
            if (nombreDeChiffresDansLaPartieDecimale(quotientDenNum) < 9) { // On peut estimer que l'inverse du quotient aboutit à un décimal. Ex. dans fraction(7/3,7/9)
              den = quotientDenNum
              num = 1
              maxDecimalesNumDen = max(nombreDeChiffresDansLaPartieDecimale(num), nombreDeChiffresDansLaPartieDecimale(den))
            } else { // num et/ou den non décimaux et leurs quotients n'aboutissent pas à un décimal. Essayons par l'inverse de chaque nombre.
              const inverseNum = arrondi(1 / num, 12)
              const inverseDen = arrondi(1 / den, 12)
              maxDecimalesNumDen = max(nombreDeChiffresDansLaPartieDecimale(inverseNum), nombreDeChiffresDansLaPartieDecimale(inverseDen))
              if (maxDecimalesNumDen < 13) { // Ex. dans fraction(1/3,1/7)
                den = inverseNum
                num = inverseDen
              } else { // Méthode plus bourrin
                const testMAX = 2000 // Voir explications ci-dessous
                // Ici, JCL, cela veut dire qu'on traite toutes les fractions de fractions où chaque numérateur ou dénominateur est inférieur à 1000.
                // Si tu veux davantage que 1000, il faut augmenter ce nombre et dimininuer alors le nb de décimales de test fixé ici à 9.
                let iDen = 1
                let denTest = den
                let inverseDenTest = inverseDen
                while (min(nombreDeChiffresDansLaPartieDecimale(denTest), nombreDeChiffresDansLaPartieDecimale(inverseDenTest)) > 9 && iDen < testMAX) {
                  iDen += (iDen % 5 === 3) ? 4 : 2
                  denTest = arrondi(den * iDen, 10)
                  inverseDenTest = arrondi(inverseDen * iDen, 10)
                }
                let iNum = 1
                let numTest = num
                let inverseNumTest = inverseNum
                while (min(nombreDeChiffresDansLaPartieDecimale(numTest), nombreDeChiffresDansLaPartieDecimale(inverseNumTest)) > 9 && iNum < testMAX) {
                  iNum += (iNum % 5 === 3) ? 4 : 2
                  numTest = arrondi(num * iNum, 10)
                  inverseNumTest = arrondi(inverseNum * iNum, 10)
                }
                if (nombreDeChiffresDansLaPartieDecimale(numTest) < 10) {
                  if (nombreDeChiffresDansLaPartieDecimale(denTest) < 10) {
                    num = arrondi(numTest * iDen, 10)
                    den = arrondi(denTest * iNum, 10)
                  } else {
                    num = arrondi(numTest * inverseDenTest, 10)
                    den = iDen * iNum
                  }
                } else {
                  if (nombreDeChiffresDansLaPartieDecimale(denTest) < 10) {
                    den = arrondi(denTest * inverseNumTest, 10)
                    num = iDen * iNum
                  } else {
                    den = arrondi(inverseNumTest * iDen, 10)
                    num = arrondi(inverseDenTest * iNum, 10)
                  }
                }
                maxDecimalesNumDen = max(nombreDeChiffresDansLaPartieDecimale(num), nombreDeChiffresDansLaPartieDecimale(den))
              }
            }
          }
        }
        den = round(den * pow(10, maxDecimalesNumDen))
        num = round(num * pow(10, maxDecimalesNumDen))
        try {
          this.num = num
          this.den = den
          this.signe = num * den < 0 ? -1 : num * den > 0 ? 1 : 0
        } catch (error) {
          window.notify(`transformation impossible en  FractionMathjs  par Math.Fraction() de num = ${num} et den = ${den} ! `, { num, den })
          return new FractionEtendue(0)
        }
      } else {
        return NaN
      }
    }
    this.type = 'FractionEtendue'
    // pour ne pas faire ces calculs à chaque instanciation de Fraction, on passe par defineProperty
    // (qui permet de ne faire le calcul qu'à la première lecture de la propriété)
    /**
     * Numérateur réduit // Le numérateur réduit peut être négatif
     * @property numIrred
     * @type {number}
     */
    let numIrred
    Object.defineProperty(this, 'numIrred', {
      enumerable: true,
      get: () => {
        if (!numIrred) numIrred = this.simplifie().num
        return numIrred
      },
      set: () => { throw Error('\'numIrred\' est en lecture seule') }
    })

    /**
     * Dénominateur réduit // le dénominateur réduit est toujours positif.
     * @property denIrred
     * @type {number}
     */
    let denIrred
    Object.defineProperty(this, 'denIrred', {
      enumerable: true,
      get: () => {
        if (!denIrred) denIrred = this.simplifie().den
        return denIrred
      },
      set: () => { throw Error('\'numIrred\' est en lecture seule') }
    })

    /**
        * Valeur de la  FractionMathjs  × 100
        * @property pourcentage
        * @type {number}
        */
    let pourcentage
    Object.defineProperty(this, 'pourcentage', {
      enumerable: true,
      get: () => {
        if (!pourcentage) pourcentage = arrondi(this.num * 100 / this.den, 2)
        return pourcentage
      },
      set: () => { throw Error('\'pourcentage\' est en lecture seule') }
    })

    /**
     * le signe de la  FractionMathjs  : -1 pour négatif , 0 ou 1 pour positif
     * Au cas où quelqu'un oublie le e de this.signe
     * @type {number}
     */
    let sign
    Object.defineProperty(this, 'sign', {
      enumerable: true,
      get: () => {
        if (!sign) sign = this.signe
        return sign
      },
      set: () => { throw Error('\'sign\' est en lecture seule') }
    })

    let signeString
    Object.defineProperty(this, 'signeString', {
      enumerable: true,
      get: () => {
        if (!signeString) signeString = this.signe === -1 ? '-' : this.signe === 1 ? '+' : ''
        return signeString
      },
      set: () => { throw Error('\'signeString\' est en lecture seule') }
    })

    /**
     * num/den mais sans traitement des signes des numérateur et dénominateur
     * @property texFraction
     * @type {string}
     */

    this.texFraction = this.den === 1 ? `${texNombre(this.num, 0)}` : `\\dfrac{${texNombre(this.num, 0)}}{${texNombre(this.den, 0)}}`

    /**
     * num/den avec mise en évidence des signes - s'il y en a au numérateur et au dénominateur
     * @property texFractionSR
     * @type {string}
     */
    let texFractionSR
    Object.defineProperty(this, 'texFractionSR', {
      enumerable: true,
      get: () => {
        if (!texFractionSR) texFractionSR = `\\dfrac{${signeMoinsEnEvidence(this.num)}}{${signeMoinsEnEvidence(this.den)}}`
        return texFractionSR
      },
      set: () => { throw Error('\'texFractionSR\' est en lecture seule') }
    })

    /**
       * num/den mais avec simplification des signes (numérateur et dénominateur positifs, signe - eventuellement devant.)
       * @property texFSD littéralement texFractionSigneDevant (si c'est un moins sinon rien... pour avoir le + devant, utiliser ecritureAlgebrique)
       * @type {string}
       */
    let texFSD
    Object.defineProperty(this, 'texFSD', {
      enumerable: true,
      get: () => {
        if (!texFSD) texFSD = this.signe === -1 ? Math.abs(this.den) === 1 ? '-' + String(texNombre(Math.abs(this.num), 0)) : `-\\dfrac{${texNombre(Math.abs(this.num), 0)}}{${texNombre(Math.abs(this.den), 0)}}` : Math.abs(this.den) === 1 ? String(texNombre(Math.abs(this.num), 0)) : `\\dfrac{${texNombre(Math.abs(this.num), 0)}}{${texNombre(Math.abs(this.den), 0)}}`
        return texFSD
      },
      set: () => { throw Error('\'texFSD\' est en lecture seule') }
    })

    /**
     * + n/d si positif, - n/d si négatif
     * propriété qui n'est pas très utile puisque ecritureAlgebrique gère les fractions maintenant (défini pour compatibilité avec les exos qui l'utilisent)
     * @property texFractionSignee
     * @type {string}
     */
    let texFractionSignee
    Object.defineProperty(this, 'texFractionSignee', {
      enumerable: true,
      get: () => {
        if (!texFractionSignee) texFractionSignee = this.signe === -1 ? this.texFSD : '+' + this.texFSD
        return texFractionSignee
      },
      set: () => { throw Error('\'texFractionSignee\' est en lecture seule') }
    })

    /**
     * -1 => '-'
     * 1 => ''
     * inchangé sinon
     * permet d'écrire le coefficient devant une lettre ou une parenthèse
     * @property texFractionSaufUn
     * @type {string}
     */
    let texFractionSaufUn
    Object.defineProperty(this, 'texFractionSaufUn', {
      enumerable: true,
      get: () => {
        if (!texFractionSaufUn) texFractionSaufUn = this.valeurDecimale === -1 ? '-' : this.valeurDecimale === 1 ? '' : this.texFSD
        return texFractionSaufUn
      },
      set: () => { throw Error('\'texFractionSaufUn\' est en lecture seule') }
    })

    /**
     * -1 => '-'
     * 1 => '+'
     * texFractionSignee sinon
     * permet d'écrire le coefficient devant une lettre ou une parenthèse
     * @property texFractionSaufUnSignee
     * @type {string}
     */
    let texFractionSaufUnSignee
    Object.defineProperty(this, 'texFractionSaufUnSignee', {
      enumerable: true,
      get: () => {
        if (!texFractionSaufUnSignee) texFractionSaufUnSignee = this.valeurDecimale === -1 ? '-' : this.valeurDecimale === 1 ? '+' : this.texFractionSignee
        return texFractionSaufUnSignee
      },
      set: () => { throw Error('\'texFractionSaufUnSignee\' est en lecture seule') }
    })

    /**
     * num/den si positif, (- num/den) sinon
     * @property texFSP littéralement texFractionSigneParentheses
     * @type {string}
     */
    let texFSP
    Object.defineProperty(this, 'texFSP', {
      enumerable: true,
      get: () => {
        if (!texFSP) texFSP = this.signe > 0 ? this.texFSD : '\\left(' + this.texFSD + '\\right)'
        return texFSP
      },
      set: () => { throw Error('\'texFSP\' est en lecture seule') }
    })

    /**
 * retourne la  FractionMathjs  mis entre parenthèses notamment pour l'exponentiation.
 */
    let texParentheses
    Object.defineProperty(this, 'texParentheses', {
      enumerable: true,
      get: () => {
        if (!texParentheses) texParentheses = this.den === 1 && this.signe === 1 ? this.texFSD : '\\left(' + this.texFSD + '\\right)'
        return texParentheses
      },
      set: () => { throw Error('\'texParentheses\' est en lecture seule') }
    })

    /**
     * le code LaTeX de la  FractionMathjs  simplifiée
     * @property texFractionSimplifiee
     * @type {string}
     */
    let texFractionSimplifiee
    Object.defineProperty(this, 'texFractionSimplifiee', {
      enumerable: true,
      get: () => {
        if (!texFractionSimplifiee) texFractionSimplifiee = this.simplifie().texFSD
        return texFractionSimplifiee
      },
      set: () => { throw Error('\'texFractionSimplifiee\' est en lecture seule') }
    })

    /**
     * le code LaTeX de l'écriture algébrique de la fraction
     * Pour compatibilité avec les anciens exos... la fonction de outils.js ecritureAlgebrique() est compatible avec les fractions
     * @property ecritureAlgebrique
     * @type {string}
     */
    let ecritureAlgebrique
    Object.defineProperty(this, 'ecritureAlgebrique', {
      enumerable: true,
      get: () => {
        if (!ecritureAlgebrique) ecritureAlgebrique = this.signe === 1 ? '+' + this.texFSD : this.texFSD
        return ecritureAlgebrique
      },
      set: () => { throw Error('\'ecritureAlgebrique\' est en lecture seule') }
    })

    /**
     * le code LaTeX de l'écriture avec parenthèse si négatif
     * @property ecritureParentheseSiNegatif
     * @type {string}
     */
    let ecritureParentheseSiNegatif
    Object.defineProperty(this, 'ecritureParentheseSiNegatif', {
      enumerable: true,
      get: () => {
        if (!ecritureParentheseSiNegatif) ecritureParentheseSiNegatif = this.signe === 1 ? this.texFSD : '\\left(' + this.texFSD + '\\right)'
        return ecritureParentheseSiNegatif
      },
      set: () => { throw Error('\'ecritureParentheseSiNegatif\' est en lecture seule') }
    })

    /**
     * Valeur décimale de la  FractionMathjs  (arrondie à la sixième décimale)
     * @property valeurDecimale
     * @type {number}
     */
    let valeurDecimale
    Object.defineProperty(this, 'valeurDecimale', {
      enumerable: true,
      get: () => {
        if (!valeurDecimale) valeurDecimale = arrondi(this.num / this.den, 6)
        return valeurDecimale
      },
      set: () => { throw Error('\'valeurDecimale\' est en lecture seule') }
    })

    /**
     * true si la  FractionMathjs  est un entier false sinon
     */
    let estEntiere
    Object.defineProperty(this, 'estEntiere', {
      enumerable: true,
      get: () => {
        if (!estEntiere) estEntiere = this.denIrred === 1
        return estEntiere
      },
      set: () => { throw Error('\'estEntiere\' est en lecture seule') }
    })

    /**
 * @return true si la FractionEtendue est le carré d'une FractionEtendue
 */
    let estParfaite
    Object.defineProperty(this, 'estParfaite', {
      enumerable: true,
      get: () => {
        if (!estParfaite) estParfaite = this.racineCarree() !== false
        return estParfaite
      },
      set: () => { throw Error('\'estParfaite\' est en lecture seule') }
    })

    /**
 * @return true si la FractionEtendue est irréductible
 */
    let estIrreductible
    Object.defineProperty(this, 'estIrreductible', {
      enumerable: true,
      get: () => {
        if (!estIrreductible) estIrreductible = gcd(this.num, this.den) === 1 && this.den !== 1
        return estIrreductible
      },
      set: () => { throw Error('\'estIrreductible\' est en lecture seule') }
    })
    const pgcd = gcd(this.num, this.den)
    this.n = Math.abs(this.num / pgcd)
    this.d = Math.abs(this.den / pgcd)
    const prodNumDen = this.num * this.den
    this.s = prodNumDen < 0 ? -1 : 1
  }

  /**
   * basé sur la méthode toLatex() de mathjs, on remplace \frac par \dfrac plus joli.
   * @return {string} la chaine Latex pour écrire la  FractionMathjs  (signe devant)
   */
  toLatex () {
    const text = super.toLatex()
    return text.replace('\\frac', '\\dfrac')
  }

  /**
   * retourne un flottant pour compatibilité de FractionEtendue() avec Number().
   * @return {number}
   */
  toNumber () {
    return this.num / this.den
  }

  /**
   *
   * @returns {string}
   */
  toString () {
    return this.texFraction
  }

  /**
   * Pour la conversion automatique en number
   * @returns {number}
   */
  valueOf () {
    return this.toNumber()
  }

  /**
   *
   * @param {FractionEtendue[]} fractions
   * @return {FractionEtendue}
   */
  sommeFractions (fractions) { // retourne un résultat simplifié
    let s = new FractionEtendue(this.num, this.den)
    for (const f of fractions) {
      s = s.sommeFraction(f).simplifie()
    }
    return s.simplifie()
  }

  /**
 * @return {FractionEtendue} la FractionEtendue irreductible
 */
  simplifie () {
    return new FractionEtendue(abs(this.num) * this.signe / gcd(abs(this.num), abs(this.den)), abs(this.den) / gcd(abs(this.num), abs(this.den)))
  }

  /**
 * Convertit la FractionEtendue en Fraction
 * @return {FractionEtendue} un objet  FractionMathjs  (mathjs)
 */
  valeurAbsolue () { return new FractionEtendue(abs(this.num), abs(this.den)) }
  /**
 * @return {FractionEtendue} opposé de la FractionEtendue
 */
  oppose () { return new FractionEtendue(-1 * this.num, this.den) }
  /**
 * On pourra utiliser k = 0.5 pour simplifier par 2 la  FractionMathjs  par exemple.
 * @param {number} k
 * @return {FractionEtendue} La FractionEtendue dont le numérateur et le dénominateur ont été multipliés par k.
 */
  reduire (k) {
    const num = multiply(this.num, k)
    const den = multiply(this.den, k)
    return new FractionEtendue(num, den)
  }

  /**
 * @param {FractionEtendue  | number} f2
 * @return true si la FractionEtendue est égale à la  FractionMathjs  passée en argument.
 */
  isEqual (f2) {
    if (f2 instanceof FractionEtendue) {
      return f2.differenceFraction(this).simplifie().num === 0
    } else {
      const f2bis = new FractionEtendue(f2)
      return f2bis.differenceFraction(this).simplifie().num === 0
    }
  }

  /**
 * @param {FractionEtendue  | number} f
 * @return {FractionEtendue} la FractionEtendue - f résultat simplifié
 */
  differenceFraction (f) {
    if (!(f instanceof FractionEtendue)) {
      f = new FractionEtendue(f)
    }
    return new FractionEtendue(this.num * f.den - f.num * this.den, f.den * this.den).simplifie()
  }

  /**
 * @param {number} n
 * @return {FractionEtendue}La FractionEtendue multipliée par n (numérateur n fois plus grand)
 */
  multiplieEntier (n) {
    return new FractionEtendue(this.num * n, this.den)
  }

  /**
  * @param {number} n
  * @return {FractionEtendue} La FractionEtendue divisée par n (denominateur n fois plus grand)
  */
  entierDivise (n) { return new FractionEtendue(this.num, n * this.den) }
  /**
  *
  * @param {number} n
  * @return {FractionEtendue} n + la FractionEtendue
  */
  ajouteEntier (n) { return new FractionEtendue(this.num + n * this.den, this.den) }

  /**
  * @param {number} n
  * @return {FractionEtendue} n - la FractionEtendue
  */
  entierMoinsFraction (n) { return new FractionEtendue(n * this.den - this.num, this.den) }

  /**
  *
  * @param {FractionEtendue   | nombre} f2
  * @return {boolean} true si FractionEtendue >= f
  */
  superieurLarge (f2) {
    if (!(f2 instanceof FractionEtendue)) {
      f2 = new FractionEtendue(f2)
    }
    return this.num * f2.den >= f2.num * this.den
  }

  /**
    * fonctions de comparaison avec une autre fraction.
    * @param {FractionEtendue   | nombre} f2
    * @return {boolean} true si
    */
  superieurstrict (f2) {
    if (!(f2 instanceof FractionEtendue)) {
      f2 = new FractionEtendue(f2)
    }
    return this.num * f2.den > f2.num * this.den
  }

  /**
    * Retourne true si la  FractionMathjs  courante est strictement inférieure à f2
    * @param {FractionEtendue   | nombre} f2
    * @return {boolean}
    */
  inferieurstrict (f2) {
    if (!(f2 instanceof FractionEtendue)) {
      f2 = new FractionEtendue(f2)
    }
    return this.num * f2.den < f2.num * this.den
  }

  /**
    * Retourne true si la  FractionMathjs  courante est inférieure ou égale à f2
    * @param {FractionEtendue   | nombre} f2
    * @return {boolean}
    */
  inferieurlarge (f2) {
    if (!(f2 instanceof FractionEtendue)) {
      f2 = new FractionEtendue(f2)
    }
    return this.num * f2.den <= f2.num * this.den
  }

  /**
  *
  * @param {FractionEtendue} f2
  * @return {boolean} true si f2 = f et  f2 est plus réduite que f
  */
  estUneSimplification (f2) {
    return (this.isEqual(f2) && abs(this.num) < abs(f2.num))
  }

  /**
  *
  * @param {FractionEtendue   | nombre} f2
  * @return {FractionEtendue} f + FractionEtendue
  */
  sommeFraction (f2) {
    if (f2 instanceof FractionEtendue) {
      if (this.den === f2.den) { // on ajoute 2 fractions de même dénominateur
        return new FractionEtendue(this.num + f2.num, f2.den)
      } else if ([this.den, f2.den].indexOf(lcm(this.den, f2.den)) !== -1) { // un dénominateur est multiple de l'autre
        if (this.den === lcm(this.den, f2.den)) { // c'est this qui a le dénominateur commun.
          return new FractionEtendue(this.num + f2.num * round(this.den / f2.den), this.den) // on transforme f2
        } else { // c'est f2 qui a le dénominateur commun
          return new FractionEtendue(f2.num + this.num * round(f2.den / this.den), f2.den) // on transforme this
        }
      } else { // besoin d'établir le dénominateur commun.
        return new FractionEtendue(this.num * round(lcm(this.den, f2.den) / this.den) + f2.num * round(lcm(this.den, f2.den) / f2.den), lcm(this.den, f2.den))
      }
    } else {
      window.notify(`FractionEtendue.sommeFraction(fractionAAjouter) a été appelée avec autre chose qu'une  FractionMathjs  étendue, alors que c'est obligatoire !\nVoilci l'argument passé : ${f2}`, { argument: f2 })
    }
  }

  /**
   * Effectue la somme de this et de f2 et retourne la string latex du calcul avec simplification si simplify est true (true par défaut)
   * @param {FractionEtendue} f2Arg
   * @param {boolean} simplify
   * @returns {string}
   */
  texSommeFraction (f2Arg, simplify = true) {
    if (f2Arg instanceof FractionEtendue) {
      // on crée une fraction indépendante pour ne pas modifier f2 (c'est un objet et si on le bricole, il sera modifié pour le code appelant.
      const f2 = new FractionEtendue(f2Arg.num, f2Arg.den)
      if (f2.den < 0) { // il arrive qu'un dénominateur soit négatif, alors on change le signe du numérateur et du dénominateur
        f2.den = -f2.den
        f2.num = -f2.num
      }
      // on fait de même avec this
      const f1 = new FractionEtendue(this.num, this.den)
      if (this.den < 0) {
        f1.den = -f1.den
        f1.num = -f1.num
      }
      let calcul = `${f1.texFraction}+${f2.texFraction}=`
      const commonDenominator = ppcm(f1.den, f2.den)
      const coeffMultiplicatorA = commonDenominator / f1.den
      const coeffMultiplicatorB = commonDenominator / f2.den
      if (coeffMultiplicatorA !== 1 || coeffMultiplicatorB !== 1) {
        if (coeffMultiplicatorA !== 1) { // on modifie la fraction1
          calcul += `\\dfrac{${f1.num}\\times ${coeffMultiplicatorA}}{${f1.den}\\times ${coeffMultiplicatorA}}+`
          calcul += coeffMultiplicatorB === 1 ? `${f2.texFraction}=` : `\\dfrac{${String(f2.num)}\\times ${String(coeffMultiplicatorB)}}{${String(f2.den)}\\times ${String(coeffMultiplicatorB)}}=`
        } else { // si c'est pas la 1 c'est forcément la 2
          calcul += `${f1.texFraction}+\\dfrac{${String(f2.num)}\\times ${String(coeffMultiplicatorB)}}{${String(f2.den)}\\times ${String(coeffMultiplicatorB)}}=`
        }
        // on a écrit les multiplication des numérateur et des dénominateurs par les coeff respectifs
        // on écrit le résultat
        if (coeffMultiplicatorA !== 1) { // on modifie la fraction1
          calcul += `\\dfrac{${String(f1.num * coeffMultiplicatorA)}}{${String(f1.den * coeffMultiplicatorA)}}+`
          calcul += coeffMultiplicatorB === 1 ? `${f2.texFraction}=` : `\\dfrac{${String(f2.num * coeffMultiplicatorB)}}{${String(f2.den * coeffMultiplicatorB)}}=`
        } else { // sinon, il y a forcément modification de la fraction2
          calcul += `${f1.texFraction}+\\dfrac{${String(f2.num * coeffMultiplicatorB)}}{${String(f2.den * coeffMultiplicatorB)}}=`
        }
      }
      // les fractions ont le même dénominateur, on les ajoute
      calcul += `\\dfrac{${String(f1.num * coeffMultiplicatorA)}${ecritureAlgebrique(f2.num * coeffMultiplicatorB)}}{${String(commonDenominator)}}=`
      calcul += `\\dfrac{${String(f1.num * coeffMultiplicatorA + f2.num * coeffMultiplicatorB)}}{${String(commonDenominator)}}`
      if (!simplify) return calcul
      const fResult = new FractionEtendue(f1.num * coeffMultiplicatorA + f2.num * coeffMultiplicatorB, commonDenominator)
      if (fResult.estIrreductible) return calcul
      calcul += `=${fResult.texFractionSimplifiee}`
      return calcul
    } else {
      window.notify('texSommeFraction : pour l\'instant on n\'ajoute que une fractionEtendue et rien d\'autre')
      return ''
    }
  }

  /**
  * @param {FractionEtendue   | nombre} f2
  * @return {FractionEtendue} f * FractionEtendue  // retourne un non résultat simplifié
  */
  produitFraction (f2) {
    if (!(f2 instanceof FractionEtendue)) {
      f2 = new FractionEtendue(f2)
    }
    if (this.signe * f2.signe === 1) {
      return new FractionEtendue(Math.abs(this.num * f2.num), Math.abs(this.den * f2.den))
    } else {
      return new FractionEtendue(-Math.abs(this.num * f2.num), Math.abs(this.den * f2.den))
    }
  }

  /**
  * @param  {Array<FractionEtendue>} fractions
  * @return {FractionEtendue} produit de FractionEtendue par toutes les fractions passées en argument.
  */
  produitFractions (fractions) { // retourne un résultat simplifié
    let s = new FractionEtendue(this.num, this.den)
    for (const f of fractions) {
      s = s.produitFraction(f)
    }
    return s.simplifie()
  }

  /**
    * @param {FractionEtendue} f2 la  FractionMathjs  qui multiplie.
    *  @param {'none'|true|false} simplification true si on veut afficher la simplification par décomposition false si on veut celle par le pgcd et 'none' si on ne veut pas simplifier
    * @return {string} Le calcul du produit de deux fractions avec étape intermédiaire
    */
  texProduitFraction (f2, simplification = 'none') {
    if (this.estEntiere) {
      return `${this.texFraction}\\times ${f2.texFraction}=\\dfrac{${this.simplifie().num + '\\times' + ecritureParentheseSiNegatif(f2.num)}}{${ecritureParentheseSiNegatif(f2.den)}}
      ${simplification === 'none' || this.produitFraction(f2).estIrreductible
          ? '=\\dfrac{' + this.num * f2.num + '}{' + this.den * f2.den + '}'
          : this.produitFraction(f2).texSimplificationAvecEtapes(simplification)}`
    } else {
      return `${this.texFraction}\\times ${f2.texFraction}=\\dfrac{${this.num + '\\times' + ecritureParentheseSiNegatif(f2.num)}}{${this.den + '\\times' + ecritureParentheseSiNegatif(f2.den)}}
    ${simplification === 'none' || this.produitFraction(f2).estIrreductible
          ? '=\\dfrac{' + this.num * f2.num + '}{' + this.den * f2.den + '}'
          : `${(this.den !== f2.num && f2.den !== this.num)
              ? '=\\dfrac{' + (decompositionFacteursPremiers(this.num) || '1') + '\\times ' + (decompositionFacteursPremiers(f2.num) || '1') + '}{' + (decompositionFacteursPremiers(this.den) || '1') + '\\times ' + (decompositionFacteursPremiers(f2.den) || '1') + '}' + this.produitFraction(f2).texSimplificationAvecEtapes(simplification)
              : `${this.den === f2.num
                  ? '=\\dfrac{' + this.num + '}{' + f2.den + '}' + (new FractionEtendue(this.num, f2.den)).texSimplificationAvecEtapes(simplification)
                  : '=\\dfrac{' + f2.num + '}{' + this.den + '}' + (new FractionEtendue(f2.num, this.den)).texSimplificationAvecEtapes(simplification)
              }`
          }`
      }`
    }
  }

  /**
  * @param {FractionEtendue} f2 la  FractionMathjs  qui multiplie.
  * @param {string} simplification true si on veut afficher la simplification par décomposition false si on veut celle par le pgcd et 'none' si on ne veut pas simplifier
  *  @param {string} symbole '/' pour la forme fractionnaire de la division, ':' ou autre chose pour l'obèle
  * @return {string} Le calcul du produit de deux fractions avec étape intermédiaire
  */
  texDiviseFraction (f2, simplification = 'none', symbole = '/') {
    const space = '\\phantom{\\dfrac{(_(^(}{(_(^(}}' // Utilisé pour mettre de l'espace dans une  FractionMathjs  de fraction
    const space2 = '\\phantom{(_(^(}' // Utilisé pour mettre de l'espace dans une  FractionMathjs  de  FractionMathjs  lorsque le numérateur ou le dénominateur est entier
    if (this.estEntiere) {
      if (f2.inverse().estEntiere && f2.num === 1) {
        if (symbole === '/') {
          return `\\dfrac{${space2 + this.texFraction + space2}}{${(f2.estEntiere ? space2 : space) + f2.texFraction + (f2.estEntiere ? space2 : space)}}=${this.simplifie().texFSD}\\times ${f2.inverse().simplifie().texFSP}=${this.simplifie().num * f2.inverse().simplifie().num}`
          // pas de simplification : on multiplie deux entiers !
        } else {
          return `${this.simplifie().texFraction}\\div${f2.texFraction}=${this.simplifie().texFSD}\\times ${f2.inverse().simplifie().texFSP}=${this.simplifie().num * f2.inverse().simplifie().num}`
          // pas de simplification : on multiplie deux entiers !
        }
      } else {
        if (symbole === '/') {
          return `\\dfrac{${space2 + this.texFraction + space2}}{${(f2.estEntiere ? space2 : space) + f2.texFraction + (f2.estEntiere ? space2 : space)}}=${this.texFractionSimplifiee}\\times ${f2.inverse().texFraction}=\\dfrac{${this.texFractionSimplifiee + '\\times ' + ecritureParentheseSiNegatif(f2.den)}}{${ecritureParentheseSiNegatif(f2.num)}}
      ${simplification === 'none' || this.diviseFraction(f2).estIrreductible
      ? '=\\dfrac{' + this.simplifie().num * f2.den + '}{' + f2.num + '}'
      : '=\\dfrac{' + decompositionFacteursPremiers(this.num) + '\\times ' + decompositionFacteursPremiers(f2.den) + '}{' + decompositionFacteursPremiers(this.den) + '\\times ' + decompositionFacteursPremiers(f2.num) + '}' + this.diviseFraction(f2).texSimplificationAvecEtapes(simplification)}`
        } else {
          return `${this.texFraction}\\div${f2.texFraction}=${this.texFractionSimplifiee}\\times ${f2.inverse().texFraction}=\\dfrac{${this.texFractionSimplifiee + '\\times ' + ecritureParentheseSiNegatif(f2.den)}}{${ecritureParentheseSiNegatif(f2.num)}}
      ${simplification === 'none' || this.diviseFraction(f2).estIrreductible
      ? '=\\dfrac{' + this.simplifie().num * f2.den + '}{' + f2.num + '}'
      : '=\\dfrac{' + decompositionFacteursPremiers(this.num) + '\\times ' + decompositionFacteursPremiers(f2.den) + '}{' + decompositionFacteursPremiers(this.den) + '\\times ' + decompositionFacteursPremiers(f2.num) + '}' + this.diviseFraction(f2).texSimplificationAvecEtapes(simplification)}`
        }
      }
    } else {
      if (f2.inverse().estEntiere && f2.num === 1) {
        if (symbole === '/') {
          return `\\dfrac{${space + this.texFraction + space}}{${(f2.estEntiere ? space2 : space) + f2.texFraction + (f2.estEntiere ? space2 : space)}}=${this.texFraction}\\times ${f2.inverse().simplifie().texFSP}=\\dfrac{${this.num + '\\times ' + f2.inverse().simplifie().texFSP}}{${this.den}}
      ${simplification === 'none' || this.diviseFraction(f2).estIrreductible
      ? '=\\dfrac{' + this.num * f2.den + '}{' + this.den * f2.num + '}'
      : '=\\dfrac{' + decompositionFacteursPremiers(this.num) + '\\times ' + decompositionFacteursPremiers(f2.den) + '}{' + decompositionFacteursPremiers(this.den) + '}' + this.diviseFraction(f2).texSimplificationAvecEtapes(simplification)}`
        } else {
          return `${this.texFraction}\\div${f2.texFraction}=${this.texFraction}\\times ${f2.inverse().texFractionSimplifiee}=\\dfrac{${this.num + '\\times ' + f2.inverse().texFractionSimplifiee}}{${this.den}}
      ${simplification === 'none' || this.diviseFraction(f2).estIrreductible
      ? '=\\dfrac{' + this.num * f2.den + '}{' + this.den * f2.num + '}'
      : '=\\dfrac{' + decompositionFacteursPremiers(this.num) + '\\times ' + decompositionFacteursPremiers(f2.den) + '}{' + decompositionFacteursPremiers(this.den) + '}' + this.diviseFraction(f2).texSimplificationAvecEtapes(simplification)}`
        }
      } else {
        if (symbole === '/') {
          return `\\dfrac{${space + this.texFraction + space}}{${(f2.estEntiere ? space2 : space) + f2.texFraction + (f2.estEntiere ? space2 : space)}}=${this.texFraction}\\times ${f2.inverse().texFraction}=\\dfrac{${this.num + '\\times ' + ecritureParentheseSiNegatif(f2.den)}}{${this.den + '\\times ' + ecritureParentheseSiNegatif(f2.num)}}
      ${simplification === 'none' || this.diviseFraction(f2).estIrreductible
      ? '=\\dfrac{' + this.num * f2.den + '}{' + this.den * f2.num + '}'
      : '=\\dfrac{' + decompositionFacteursPremiers(this.num) + '\\times ' + decompositionFacteursPremiers(f2.den) + '}{' + decompositionFacteursPremiers(this.den) + '\\times ' + decompositionFacteursPremiers(f2.num) + '}' + this.diviseFraction(f2).texSimplificationAvecEtapes(simplification)}`
        } else {
          return `${this.texFraction}\\div${f2.texFraction}=${this.texFraction}\\times ${f2.inverse().texFraction}=\\dfrac{${this.num + '\\times ' + f2.den}}{${this.den + '\\times ' + f2.num}}
      ${simplification === 'none' || this.diviseFraction(f2).estIrreductible
      ? '=\\dfrac{' + this.num * f2.den + '}{' + this.den * f2.num + '}'
      : '=\\dfrac{' + decompositionFacteursPremiers(this.num) + '\\times ' + decompositionFacteursPremiers(f2.den) + '}{' + decompositionFacteursPremiers(this.den) + '\\times ' + decompositionFacteursPremiers(f2.num) + '}' + this.diviseFraction(f2).texSimplificationAvecEtapes(simplification)}`
        }
      }
    }
  }

  /**
    * @param {number} n l'exposant de la fraction
    * @return {FractionEtendue} La puissance n de la fraction
    */
  puissanceFraction (n) {
    return new FractionEtendue(this.num ** n, this.den ** n)
  }

  /**
  * @return {FractionEtendue|number} inverse de la fraction
  */
  inverse () {
    if (this.num !== 0) {
      return new FractionEtendue(this.den, this.num)
    } else {
      window.notify('FractionEtendue.inverse() : division par zéro', { fraction: this })
      return NaN
    }
  }

  /**
    *
    * @param {FractionEtendue} f2
    * @return {FractionEtendue} f/f2
    */
  diviseFraction (f2) {
    if (['Fraction', 'FractionEtendue'].indexOf(f2.type) === -1) {
      window.notify('FractionEtendue.diviseFraction() : l\'argument n\'est pas une fraction', { f2 })
      if (!Number.isNaN(f2)) return this.multiplieEntier(1 / f2)
      else window.notify('FractionEtendue.diviseFraction() : l\'argument n\'est pas un nombre', { f2 })
    } else return this.produitFraction(f2.inverse())
  }

  /**
    * @param {number} n entier divisé par la fraction
    * @return {FractionEtendue} n divisé par fraction
    */
  diviseEntier (n) {
    return new FractionEtendue(n * this.den, this.num).simplifie()
  }

  /**
    *
    * @param {FractionEtendue} f2
    * @return {string} Calcul f/f2 avec les étapes mais sans simplification
    */
  texQuotientFraction (f2) {
    return `${this.texFraction}\\div ${f2.texFraction}=${this.texFraction}\\times ${f2.inverse().texFraction}=\\dfrac{${this.num + '\\times' + f2.den}}{${this.den + '\\times' + f2.num}}=\\dfrac{${this.num * f2.den}}{${this.den * f2.num}}`
  }

  /**
 * Si la  FractionMathjs  est réductible, retourne une suite d'égalités permettant d'obtenir la  FractionMathjs  irréductible
   * @param {true|false|'none'} factorisation
   * @param {string} couleurFinale
   * @return {string}
 */
  texSimplificationAvecEtapes (factorisation = false, couleurFinale = '') {
    if (this.estIrreductible && this.num > 0 && this.den > 0) return '' // irreductible et positifs
    else if (this.estIrreductible && this.num * this.den < 0) { // irréductible mais négatifs
      return `=${this.texFSD}`
    } else {
      if (factorisation) {
        const signe = this.sign === -1 ? '-' : ''
        const num = Math.abs(this.num)
        const den = Math.abs(this.den)
        const listenum = obtenirListeFacteursPremiers(num)
        const listeden = obtenirListeFacteursPremiers(den)
        let result = '='
        const listeNumvf = []
        const listeDenvf = []
        listenum.forEach(function aAjouterDansListeAvf (element) {
          listeNumvf.push([element, true])
        })
        listeden.forEach(function aAjouterDansListeBvf (element) {
          listeDenvf.push([element, true])
        })

        for (let index = 0; index < listeden.length;) {
          for (let j = 0; j <= listenum.length;) {
            if (listeden[index] === listenum[j]) {
              listeDenvf[index] = [listeden[index], false]
              listeNumvf[j] = [listenum[j], false]
              listenum[j] = 1
              listeden[index] = 1
              break
            }
            j++
          }
          index++
        }

        let a = 1
        let b = 1
        for (const k of listenum) {
          a = a * k
        }
        for (const k of listeden) {
          b = b * k
        }

        let numerateur = ''
        let denominateur = ''

        for (const j in listeNumvf) {
          if (listeNumvf[j][1] === true) {
            numerateur += listeNumvf[j][0] + '\\times'
          } else {
            numerateur += '\\cancel{' + listeNumvf[j][0] + '}\\times'
          }
        }
        numerateur = numerateur.substring(0, numerateur.length - 6)

        for (const j in listeDenvf) {
          if (listeDenvf[j][1] === true) {
            denominateur += listeDenvf[j][0] + '\\times'
          } else {
            denominateur += '\\cancel{' + listeDenvf[j][0] + '}\\times'
          }
        }
        denominateur = denominateur.substring(0, denominateur.length - 6)

        result += `${signe}\\dfrac{${numerateur}}{${denominateur}}`
        result += couleurFinale !== ''
          ? `=${miseEnEvidence(`${signe}${new FractionEtendue(a, b).simplifie().texFraction}`, couleurFinale)}`
          : `=${signe}${new FractionEtendue(a, b).simplifie().texFraction}`
        return result
      } else {
        const signe = this.sign === -1 ? '-' : ''
        const num = Math.abs(this.num)
        const den = Math.abs(this.den)
        const pgcd = gcd(num, den)
        if (pgcd !== 1) {
          const redaction = `=${signe}\\dfrac{${num / pgcd}${miseEnEvidence('\\times' + ecritureParentheseSiNegatif(pgcd), '#2563a5')} }{${den / pgcd}${miseEnEvidence('\\times' + ecritureParentheseSiNegatif(pgcd), '#2563a5')}}=`
          let redactionFinale
          if (Math.abs(den / pgcd) !== 1) redactionFinale = `${signe}\\dfrac{${Math.abs(num / pgcd)}}{${Math.abs(den / pgcd)}}`
          else redactionFinale = `${signe}${Math.abs(num / pgcd)}`
          if (couleurFinale !== '') redactionFinale = miseEnEvidence(redactionFinale, couleurFinale)
          return (redaction + redactionFinale)
        } else {
          let redactionFinale
          if (!egal(Math.abs(den / pgcd), 1)) redactionFinale = `=${signe}\\dfrac{${Math.abs(num / pgcd)}}{${Math.abs(den / pgcd)}}`
          else redactionFinale = `=${signe}${Math.abs(num / pgcd)}`
          if (couleurFinale !== '') redactionFinale = miseEnEvidence(redactionFinale, couleurFinale)
          return redactionFinale
        }
      }
    }
  }

  /**
  * @return {FractionEtendue|number} NaN si la FractionEtendue n'est pas un nombre décimal sinon retourne une FractionEtendue avec la bonne puissance de 10 au dénominateur
  */
  fractionDecimale () {
    const den = Math.abs(this.simplifie().den)
    const num = Math.abs(this.simplifie().num)
    const signe = this.simplifie().signe
    const liste = obtenirListeFacteursPremiers(den)
    let n2 = 0; let n5 = 0
    for (const n of liste) {
      if (n === 2) { n2++ } else if (n === 5) { n5++ } else {
        window.notify('FractionEtendue.valeurDecimale :  FractionMathjs  non décimale', { fraction: this })
        return NaN
      }
    }
    if (n5 === n2) {
      return new FractionEtendue(num * signe, den)
    } else if (n5 > n2) {
      return new FractionEtendue(signe * num * 2 ** (n5 - n2), den * 2 ** (n5 - n2))
    } else {
      return new FractionEtendue(signe * num * 5 ** (n2 - n5), den * 5 ** (n2 - n5))
    }
  }

  /**
    * Retourne la chaine latex contenant la racine carrée de la fraction
    * @param {boolean} detaillee Si detaillee est true, une étape de calcul se place avant le résultat.
    * @return {string|false}
    */
  texRacineCarree (detaillee = false) {
    if (this.estParfaite) {
      return this.racineCarree().texFraction
    }
    if (this.signe === -1) return false
    let factoDen = extraireRacineCarree(Math.abs(this.den))
    let factoNum
    let etape
    if (!this.estEntiere) {
      etape = detaillee ? `\\sqrt{\\dfrac{${this.num}}{${this.den}}}=` : ''
    } else {
      factoNum = extraireRacineCarree(Math.abs(this.num))
      if (factoNum[0] !== 1) {
        etape = detaillee ? `\\sqrt{${Math.abs(this.num)}}=` : ''
      } else {
        etape = ''
      }
    }
    if (factoDen[1] !== 1) {
      if (!this.estEntiere) {
        etape += detaillee ? `\\sqrt{\\dfrac{${Math.abs(this.num)}\\times ${factoDen[1]}}{${Math.abs(this.den)}\\times ${factoDen[1]}}}=` : ''
        etape += detaillee ? `\\sqrt{\\dfrac{${Math.abs(this.num * factoDen[1])}}{${Math.abs(this.den * factoDen[1])}}}=` : ''
      }
      factoNum = extraireRacineCarree(Math.abs(this.num * factoDen[1]))
      factoDen = extraireRacineCarree(Math.abs(this.den * factoDen[1]))
    } else {
      factoNum = extraireRacineCarree(Math.abs(this.num))
    }
    const k = fraction(factoNum[0], factoDen[0]).simplifie()
    const r = fraction(factoNum[1], factoDen[1]).simplifie()

    if (detaillee) {
      if (k.valeurDecimale !== 1) {
        if (k.denIrred === 1) {
          etape += detaillee ? `\\sqrt{${factoNum[0]}^2\\times${factoNum[1]}}=` : ''
          etape += detaillee ? `${factoNum[0]}${factoNum[1] !== 1 ? '\\sqrt{' + factoNum[1] + '}' : '}'}` : ''
        } else {
          if (factoNum[0] !== 1) {
            etape += detaillee ? `\\sqrt{\\dfrac{${factoNum[0]}^2${factoNum[1] !== 1 ? '\\times ' + factoNum[1] : ''}}{${factoDen[0]}^2${factoDen[1] !== 1 ? '\\times' + factoDen[1] : ''}}}=` : ''
            etape += detaillee ? `\\dfrac{${factoNum[0]}${factoNum[1] !== 1 ? '\\times\\sqrt{' + factoNum[1] + '}' : ''}}{${factoDen[0]}${factoDen[1] !== 1 ? '\\times\\sqrt{' + factoDen[1] + '}' : ''}}=` : ''
          } else {
            if (factoDen[1] !== 1) {
              etape += detaillee ? `\\sqrt{\\dfrac{${factoNum[1]}}{${factoDen[0]}^2\\times ${factoDen[1]}}}=` : ''
            } else {
              etape += detaillee ? `\\sqrt{\\dfrac{${factoNum[1]}}{${factoDen[0]}^2}}=` : ''
            }
          }
        }
      }
    }

    if (arrondi(factoNum[1] / factoDen[1], 6) === 1) {
      return etape + k.texFraction
    } else {
      if (k.numIrred === 1 && k.denIrred !== 1) {
        if (r.denIrred === 1) {
          return (k.valeurDecimale === 1 ? etape : etape + `\\dfrac{\\sqrt{${r.numIrred}}}{${k.denIrred}}`)
        } else {
          return (k.valeurDecimale === 1 ? etape : etape + k.texFraction) + `\\sqrt{${r.toLatex()}}`
        }
      } else {
        return (k.valeurDecimale === 1 ? etape : etape + k.texFraction) + `\\sqrt{${r.toLatex()}}`
      }
    }
  }

  /**
    * Retourne la racine carrée de la  FractionMathjs  si c'est une  FractionMathjs  et false sinon
    * @return {FractionEtendue|boolean}
    */
  racineCarree () {
    const factoNum = extraireRacineCarree(Math.abs(this.num))
    const factoDen = extraireRacineCarree(Math.abs(this.den))
    const k = fraction(factoNum[0], factoDen[0]).simplifie()
    const r = fraction(factoNum[1], factoDen[1]).simplifie()
    if (r.valeurDecimale !== 1 || this.signe === -1) {
      return false
    } else {
      return k
    }
  }

  /**
  *
  * @param {number} x position du dessin
  * @param {number} y
  * @param {number} rayon rayon du disque
  * @param {number} depart numéro du secteur où commence le coloriage
  * @param {string} type type parmis : 'gateau', 'segment' et 'barre'
  * @param {string} couleur
  * @param {number} unite0 Nombre marquant le départ du segment
  * @param {number} unite1 Nombre marquant le point unité du segment
  * @param {number} scale échelle
  * @param {string} label ce qu'il faut écrire sous le segment ... x ?
  * @return {object[]} objets mathalea2d
  */
  representationIrred (x, y, rayon, depart = 0, type = 'gateau', couleur = 'gray', unite0 = 0, unite1 = 1, scale = 1, label = '') {
    let num, k, dep, s, a, O, C
    const objets = []
    const n = quotientier(this.numIrred, this.denIrred)
    num = this.numIrred
    const unegraduation = function (x, y, couleur = 'black', epaisseur = 1) {
      const A = point(x, y + 0.2)
      const B = point(x, y - 0.2)
      const g = segment(A, B, couleur)
      g.epaisseur = epaisseur
      return g
    }
    if (type === 'gateau') {
      for (k = 0; k < n; k++) {
        O = point(x + k * 2 * (rayon + 0.5), y)
        C = cercle(O, rayon)
        objets.push(C)
        for (let i = 0; i < this.denIrred; i++) {
          s = segment(O, rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90 - i * 360 / this.denIrred))
          objets.push(s)
        }
        dep = rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90 - depart * 360 / this.denIrred)
        for (let j = 0; j < Math.min(this.denIrred, num); j++) {
          a = arc(dep, O, -360 / this.denIrred, true, couleur)
          a.opacite = 0.3
          dep = rotation(dep, O, -360 / this.denIrred)
          objets.push(a)
        }
        num -= this.denIrred
      }
      if (Math.abs(this.numIrred) % Math.abs(this.denIrred) !== 0) {
        O = point(x + k * 2 * (rayon + 0.5), y)
        C = cercle(O, rayon)
        objets.push(C)
        for (let i = 0; i < this.denIrred; i++) {
          s = segment(O, rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90 - i * 360 / this.denIrred))
          objets.push(s)
        }
        dep = rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90 - depart * 360 / this.denIrred)
        for (let j = 0; j < Math.min(this.denIrred, num); j++) {
          a = arc(dep, O, -360 / this.denIrred, true, couleur)
          a.opacite = 0.3
          dep = rotation(dep, O, -360 / this.denIrred)
          objets.push(a)
        }
      }
    } else if (type === 'segment') {
      for (k = 0; k < n; k++) {
        O = point(x + k * rayon, y)
        C = translation(O, vecteur(rayon, 0))
        s = segment(O, C)
        s.styleExtremites = '-|'
        objets.push(s)
        for (let i = 0; i < this.denIrred; i++) {
          s = segment(translation(O, vecteur(i * rayon / this.denIrred, 0)), translation(O, vecteur((i + 1) * rayon / this.denIrred, 0)))
          s.styleExtremites = '|-'
          objets.push(s)
        }
        a = segment(O, point(O.x + Math.min(num, this.denIrred) * rayon / this.denIrred, O.y), couleur)
        a.opacite = 0.4
        a.epaisseur = 6
        objets.push(a)
        num -= this.denIrred
      }
      O = point(x + k * rayon, y)
      C = translation(O, vecteur(rayon, 0))
      s = segment(O, C)
      s.styleExtremites = '-|'
      objets.push(s)
      for (let i = 0; i < this.denIrred; i++) {
        s = segment(translation(O, vecteur(i * rayon / this.denIrred, 0)), translation(O, vecteur((i + 1) * rayon / this.denIrred, 0)))
        s.styleExtremites = '|-'
        objets.push(s)
      }
      a = segment(O, point(O.x + Math.min(this.numIrred, this.denIrred) * rayon / this.denIrred, O.y), couleur)
      a.opacite = 0.4
      a.epaisseur = 6
      objets.push(a)
      objets.push(unegraduation(x, y))
      if (typeof (unite0) === 'number' && typeof (unite1) === 'number') {
        for (k = 0; k <= n + 1; k++) {
          objets.push(texteParPosition(stringNombre(unite0 + k * (unite1 - unite0), 0), x + rayon * k, y - 0.6, 'milieu', 'black', scale))
        }
      } else {
        if (unite0 != null) { objets.push(texteParPosition(String(unite0), x, y - 0.6, 'milieu', 'black', scale)) }
        if (unite1 != null) { objets.push(texteParPosition(String(unite1), x + rayon, y - 0.6, 'milieu', 'black', scale)) }
        if (label != null) { objets.push(texteParPosition(label, x + rayon * this.numIrred / this.denIrred, y - 0.6, 'milieu', 'black', scale)) }
      }
    } else {
      let diviseur
      if (this.denIrred % 6 === 0) {
        diviseur = 6
      } else if (this.denIrred % 5 === 0) {
        diviseur = 5
      } else if (this.denIrred % 4 === 0) {
        diviseur = 4
      } else if (this.denIrred % 3 === 0) {
        diviseur = 3
      } else if (this.denIrred % 2 === 0) {
        diviseur = 2
      } else {
        diviseur = 1
      }
      const tailleCarres = Math.max(rayon / diviseur, 1)
      for (k = 0; k < n; k++) {
        for (let j = 0; j < diviseur; j++) {
          for (let h = 0; h < this.denIrred / diviseur; h++) {
            O = point(x + k * (diviseur * tailleCarres + 1) + j * tailleCarres, y + h * tailleCarres)
            C = translation(O, vecteur(tailleCarres, 0))
            dep = carre(O, C, 'black')
            dep.couleurDeRemplissage = colorToLatexOrHTML(couleur)
            dep.opaciteDeRemplissage = 0.4
            objets.push(dep)
          }
        }
        num -= this.denIrred
      }
      if (num > 0) {
        for (let j = 0; j < diviseur; j++) {
          for (let h = 0; h < this.denIrred / diviseur; h++) {
            O = point(x + n * (diviseur * tailleCarres + 1) + j * tailleCarres, y + h * tailleCarres)
            C = translation(O, vecteur(tailleCarres, 0))
            dep = carre(O, C, 'black')
            objets.push(dep)
          }
        }
        for (let i = 0; i < num; i++) {
          O = point(x + n * (diviseur * tailleCarres + 1) + (i % diviseur) * tailleCarres, y + quotientier(i, diviseur) * tailleCarres)
          C = translation(O, vecteur(tailleCarres, 0))
          dep = carre(O, C, 'black')
          dep.couleurDeRemplissage = colorToLatexOrHTML(couleur)
          dep.opaciteDeRemplissage = 0.4
          objets.push(dep)
        }
      }
    }
    return objets
  }

  /**
  *
  * @param {number} x position du dessin
  * @param {number} y
  * @param {number} rayon rayon du disque
  * @param {number} depart numéro du secteur où commence le coloriage
  * @param {string} type type parmis : 'gateau', 'segment' et 'barre'
  * @param {string} couleur
  * @param {number} unite0 Nombre marquant le départ du segment
  * @param {number} unite1 Nombre marquant le point unité du segment
  * @param {number} scale échelle
  * @param {string} label ce qu'il faut écrire sous le segment ... x ?
  * @return {object[]}objets mathalea2d
  */
  representation (x, y, rayon, depart = 0, type = 'gateau', couleur = 'gray', unite0 = 0, unite1 = 1, scale = 1, label = '') {
    const objets = []
    let num, k, dep, s, a, O, C
    const n = quotientier(Math.abs(this.num), Math.abs(this.den))
    num = Math.abs(this.num)
    const unegraduation = function (x, y, couleur = 'black', epaisseur = 1) {
      const A = point(x, y + 0.2)
      const B = point(x, y - 0.2)
      const g = segment(A, B, couleur)
      g.epaisseur = epaisseur
      return g
    }
    if (type === 'gateau') {
      for (k = 0; k < n; k++) {
        const O = point(x + k * 2 * (rayon + 0.5), y)
        const C = cercle(O, rayon)
        objets.push(C)
        let s, a
        for (let i = 0; i < this.den; i++) {
          s = segment(O, rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90 - i * 360 / this.den))
          objets.push(s)
        }
        dep = rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90 - depart * 360 / this.den)
        for (let j = 0; j < Math.min(this.den, num); j++) {
          a = arc(dep, O, -360 / this.den, true, couleur)
          a.opacite = 0.3
          dep = rotation(dep, O, -360 / this.den)
          objets.push(a)
        }
        num -= this.den
      }
      if (this.num % this.den !== 0) {
        const O = point(x + k * 2 * (rayon + 0.5), y)
        const C = cercle(O, rayon)
        objets.push(C)
        for (let i = 0; i < this.den; i++) {
          s = segment(O, rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90 - i * 360 / this.den))
          objets.push(s)
        }

        dep = rotation(point(x + rayon + k * 2 * (rayon + 0.5), y), O, 90 - depart * 360 / this.den)
        if (this.num % this.den !== 0) {
          for (let j = 0; j < Math.min(this.den, num); j++) {
            a = arc(dep, O, -360 / this.den, true, couleur)
            a.opacite = 0.3
            dep = rotation(dep, O, -360 / this.den)
            objets.push(a)
          }
        }
      }
    } else if (type === 'segment') {
      for (k = 0; k < n; k++) {
        O = point(x + k * rayon, y)
        C = translation(O, vecteur(rayon, 0))
        s = segment(O, C)
        s.styleExtremites = '-|'
        objets.push(s)
        for (let i = 0; i < this.den; i++) {
          s = segment(translation(O, vecteur(i * rayon / this.den, 0)), translation(O, vecteur((i + 1) * rayon / this.den, 0)))
          s.styleExtremites = '|-'
          objets.push(s)
        }
        a = segment(O, point(O.x + Math.min(num, this.den) * rayon / this.den, O.y), couleur)
        a.opacite = 0.4
        a.epaisseur = 6
        objets.push(a)
        num -= this.den
      }
      O = point(x + k * rayon, y)
      C = translation(O, vecteur(rayon, 0))
      s = segment(O, C)
      s.styleExtremites = '-|'
      objets.push(s)
      for (let i = 0; i < this.den; i++) {
        s = segment(translation(O, vecteur(i * rayon / this.den, 0)), translation(O, vecteur((i + 1) * rayon / this.den, 0)))
        s.styleExtremites = '|-'
        objets.push(s)
      }
      a = segment(O, point(O.x + Math.min(num, this.den) * rayon / this.den, O.y), couleur)
      a.opacite = 0.4
      a.epaisseur = 6
      objets.push(a)
      objets.push(unegraduation(x, y))
      if (typeof (unite0) === 'number' && typeof (unite1) === 'number') {
        for (k = 0; k <= n + 1; k++) {
          objets.push(texteParPosition(String(unite0 + k * (unite1 - unite0)), x + rayon * k, y - 0.6, 'milieu', 'black', scale))
        }
      } else {
        if (String(unite0) !== '') { objets.push(texteParPosition(String(unite0), x, y - 0.6, 'milieu', 'black', scale)) }
        if (String(unite1) !== '') { objets.push(texteParPosition(String(unite1), x + rayon, y - 0.6, 'milieu', 'black', scale)) }
        if (label !== '') { objets.push(texteParPosition(label, x + rayon * this.num / this.den, y - 0.6, 'milieu', 'black', scale)) }
      }
    } else { // Type barre
      let diviseur
      if (this.den % 6 === 0) {
        diviseur = 6
      } else if (this.den % 5 === 0) {
        diviseur = 5
      } else if (this.den % 4 === 0) {
        diviseur = 4
      } else if (this.den % 3 === 0) {
        diviseur = 3
      } else if (this.den % 2 === 0) {
        diviseur = 2
      } else {
        diviseur = 1
      }
      const tailleCarres = Math.max(rayon / diviseur, 1)
      for (k = 0; k < n; k++) { // on fait autant de plaques que d'unités entières
        for (let j = 0; j < diviseur; j++) { // on fait this.den carrés répartis sur this.den/diviseur lignes de diviseur de long
          for (let h = 0; h < this.den / diviseur; h++) {
            O = point(x + k * (diviseur * tailleCarres + 1) + j * tailleCarres, y + h * tailleCarres)
            C = translation(O, vecteur(tailleCarres, 0))
            dep = carre(O, C, 'black')

            dep.couleurDeRemplissage = colorToLatexOrHTML(couleur)
            dep.opaciteDeRemplissage = 0.4
            objets.push(dep)
          }
        }
        num -= this.den
      }
      if (num > 0) { // il reste une portion d'unité à faire après n unités.
        for (let j = 0; j < diviseur; j++) {
          for (let h = 0; h < this.den / diviseur; h++) {
            O = point(x + n * (diviseur * tailleCarres + 1) + j * tailleCarres, y + h * tailleCarres)
            C = translation(O, vecteur(tailleCarres, 0))
            dep = carre(O, C, 'black')
            objets.push(dep)
          }
        }
        for (let i = 0; i < num; i++) {
          O = point(x + n * (diviseur * tailleCarres + 1) + (i % diviseur) * tailleCarres, y + quotientier(i, diviseur) * tailleCarres)
          C = translation(O, vecteur(tailleCarres, 0))
          dep = carre(O, C, 'black')
          dep.couleurDeRemplissage = colorToLatexOrHTML(couleur)
          dep.opaciteDeRemplissage = 0.4
          objets.push(dep)
        }
      }
    }
    return objets
  }

  /**
 * Renvoie un array avec l'ensemble de réponses possibles correspondant à un couple de fractions et de leurs différentes simplifications afin de pouvoir les placer dans un setReponse
 * Exemple ['-\\frac{a}{b};\\frac{c}{d}', '\\frac{-a}{b};\\frac{c}{d}', '\\frac{a}{-b};\\frac{c}{d}', '\\frac{c}{d};-\\frac{a}{b}', '\\frac{c}{d};\\frac{-a}{b}', '\\frac{c}{d};\\frac{a}{-b}' ...
 * @author Guillaume Valmont
 * @param {number} n1 numérateur de la 1e fraction
 * @param {number} d1 dénominateur de la 1e fraction
 * @param {number} n2 numérateur de la 2e fraction
 * @param {number} d2 dénominateur de la 2e fraction
 * @return array avec la liste des couples de fractions égales et simplifiées sous la forme '\\frac{n1}{d1};\\frac{n2}{d2}'
 */
  static texArrayReponsesCoupleDeFractionsEgalesEtSimplifiees (n1, d1, n2, d2) {
    return this.texArrayReponsesCoupleDeFractions(n1, d1, n2, d2, true)
  }

  /**
 * Fonction destinée à être utilisée conjointement avec setReponse
 * Exemple [\\frac{18}{6}, \\frac{-18}{-6}, -\\frac{-18}{6}, -\\frac{18}{-6}, \\frac{9}{3}, \\frac{-9}{-3}, -\\frac{-9}{3}, -\\frac{9}{-3}, 3]
 * @author Guillaume Valmont
 * @param {number} n numérateur
 * @param {number} d dénominateur
 * @return array avec la liste des fractions égales et simplifiées sous la forme '\\frac{n}{d}'
 */
  static texArrayReponsesFractionsEgalesEtSimplifiees (n, d) {
    const fractionsSimplifiees = this.listerFractionsSimplifiees(n, d)
    const liste = []
    for (const fractionSimplifiee of fractionsSimplifiees) {
      const reponses = this.texArrayReponsesFraction(fractionSimplifiee[0], fractionSimplifiee[1])
      for (const reponse of reponses) {
        liste.push(reponse)
      }
    }
    return liste
  }

  /**
 * Renvoie un array avec l'ensemble de réponses possibles correspondant à un couple de fractions afin de pouvoir les placer dans un setReponse
 * Exemple ['-\\frac{a}{b};\\frac{c}{d}', '\\frac{-a}{b};\\frac{c}{d}', '\\frac{a}{-b};\\frac{c}{d}', '\\frac{c}{d};-\\frac{a}{b}', '\\frac{c}{d};\\frac{-a}{b}', '\\frac{c}{d};\\frac{a}{-b}' ...
 * @author Guillaume Valmont
 * @param {number} n1 numérateur 1
 * @param {number} d1 dénominateur 1
 * @param {number} n2 numérateur 1
 * @param {number} d2 dénominateur 1
 * @param {boolean} egalesEtSimplifiees true si on veut inclure l'ensemble des fractions égales et simplifiées
 * @return array avec la liste des couples de fractions sous la forme '\\frac{n1}{d1};\\frac{n2}{d2}'
 */
  static texArrayReponsesCoupleDeFractions (n1, d1, n2, d2, egalesEtSimplifiees = false) {
    let listeFraction1, listeFraction2
    if (egalesEtSimplifiees) {
      listeFraction1 = this.texArrayReponsesFractionsEgalesEtSimplifiees(n1, d1)
      listeFraction2 = this.texArrayReponsesFractionsEgalesEtSimplifiees(n2, d2)
    } else {
      listeFraction1 = this.texArrayReponsesFraction(n1, d1)
      listeFraction2 = this.texArrayReponsesFraction(n2, d2)
    }
    const listeCouples = []
    for (const ecriture1 of listeFraction1) {
      for (const ecriture2 of listeFraction2) {
        listeCouples.push(ecriture1 + ';' + ecriture2, ecriture2 + ';' + ecriture1)
      }
    }
    return listeCouples
  }

  /**
 * Fonction destinée à lister l'ensemble des possibilités d'écriture d'une même  FractionMathjs  pour être comparées dans un setReponse
 * @author Guillaume Valmont
 * @param {number} numerateur
 * @param {number} denominateur
 * @return array avec l'ensemble des possibilités d'écriture d'une même  FractionMathjs  au format LateX
 */
  static texArrayReponsesFraction (numerateur, denominateur) {
    const n = Math.abs(numerateur)
    const d = Math.abs(denominateur)
    if (d === 1) {
      return [(numerateur * denominateur).toString()]
    } else {
      if (numerateur * denominateur > 0) {
        return [`\\frac{${n}}{${d}}`, `\\frac{${-n}}{${-d}}`, `-\\frac{${-n}}{${d}}`, `-\\frac{${n}}{${-d}}`]
      } else if (numerateur * denominateur < 0) {
        return [`-\\frac{${n}}{${d}}`, `-\\frac{${-n}}{${-d}}`, `\\frac{${-n}}{${d}}`, `\\frac{${n}}{${-d}}`]
      } else {
        return ['0']
      }
    }
  }

  /**
 * Renvoie l'ensemble des fractions égales et simplifiées
 * Ne change pas et ne déplace pas les signes (s'il y a un "-" au dénominateur, il restera au dénominateur)
 * @author Guillaume Valmont
 * @param {number} n
 * @param {number} d
 * @return array de couples [numerateur, denominateur] de l'ensemble des fractions égales et simplifiées
 */
  static listerFractionsSimplifiees (n, d) {
    if (pgcd(n, d) === 1) {
      return [[n, d]]
    } else {
      const liste = []
      for (const diviseur of listeDesDiviseurs(pgcd(n, d))) {
        liste.push([n / diviseur, d / diviseur])
      }
      return liste
    }
  }
}

export default FractionEtendue
