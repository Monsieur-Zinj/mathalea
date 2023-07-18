import Decimal from 'decimal.js'
import { equal, Fraction, round } from 'mathjs'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { fraction } from '../../modules/fractions.js'
import { egal, lettreDepuisChiffre, miseEnEvidence } from '../../modules/outils.js'
import { arrondi } from './nombres.js'
import { stringNombre, texNombre } from './texNombre.js'

/**
 * écrit le nombre, mais pas un nombre s'il est égal à 1
 * @Example
 * //rienSi1(1)+'x' -> x
 * //rienSi1(-1)+'x' -> -x
 * @author Rémi Angot et Jean-Claude Lhote pour le support des fractions
 */
export function rienSi1 (a) {
  if (equal(a, 1)) return ''
  if (equal(a, -1)) return '-'
  if (a instanceof Fraction || a instanceof FractionEtendue) return a.toLatex()
  if (Number(a) || a === 0) return stringNombre(a) // on retourne 0, ce ne sera pas joli, mais Number(0) est false !!!
  window.notify('rienSi1 : type de valeur non prise en compte : ', { a })
}

/**
 * Gère l'écriture de l'exposant en mode text (ne doit pas s'utiliser entre $ $)
 * Pour le mode maths (entre $ $) on utilisera tout simplement ^3 pour mettre au cube ou ^{42} pour la puissance 42.
 * @Example
 * // 'dm'+texteExposant(3)
 * @author Rémi Angot
 */
export function texteExposant (texte) {
  if (context.isHtml) {
    return `<sup>${texte}</sup>`
  } else {
    return `\\up{${texte}}`
  }
}

/**
 * Ajoute les parenthèses et le signe
 * @Example
 * //(+3) ou (-3)
 * @author Rémi Angot
 */
export function ecritureNombreRelatif (a) {
  if (a > 0) {
    return '(+' + a.toString() + ')'
  } else if (a < 0) {
    return '(' + a.toString() + ')'
  }
  // ne pas mettre de parenthèses pour le nombre 0.
  return '0'
}

/**
 * Idem ecritureNombreRelatif avec le code couleur : vert si positif, rouge si négatif, noir si nul
 * @param {number} a
 */
export function ecritureNombreRelatifc (a) {
  let result = ''
  if (a > 0) {
    result = miseEnEvidence('(+' + texNombre(a) + ')', 'blue')
  } else if (a < 0) {
    result = miseEnEvidence('(' + texNombre(a) + ')')
  } else { // ne pas mettre de parenthèses pour le nnombre 0.
    result = miseEnEvidence('0', 'black')
  }
  return result
}

/**
 * Ajoute le + devant les nombres positifs
 * @Example
 * //+3 ou -3
 * @author Rémi Angot et Jean-claude Lhote pour le support des fractions
 */
export function ecritureAlgebrique (a) {
  if (a instanceof Fraction || a instanceof FractionEtendue) return fraction(a).ecritureAlgebrique
  else if (typeof a === 'number') {
    if (a >= 0) {
      return '+' + stringNombre(a)
    } else {
      return stringNombre(a)
    }
  } else if (a instanceof Decimal) {
    if (a.isPos()) {
      return '+' + stringNombre(a)
    } else {
      return stringNombre(a)
    }
  } else window.notify('rienSi1 : type de valeur non prise en compte')
}

/**
 * Ajoute le + devant les nombres positifs, n'écrit rien si 1
 * @Example
 * //+3 ou -3
 * @author Rémi Angot et Jean-Claude Lhote pour le support des fractions
 */
export function ecritureAlgebriqueSauf1 (a) {
  if (equal(a, 1)) return '+'
  else if (equal(a, -1)) return '-'
  else if (a instanceof Fraction || a instanceof FractionEtendue) return fraction(a).ecritureAlgebrique
  else if (typeof a === 'number') return ecritureAlgebrique(a)
  else window.notify('rienSi1 : type de valeur non prise en compte')
}

/**
 * Idem ecritureAlgebrique mais retourne le nombre en couleur (vert si positif, rouge si négatif et noir si nul).
 * @param {number} a
 */
export function ecritureAlgebriquec (a) {
  let result = ''
  if (a > 0) {
    result = miseEnEvidence('+' + texNombre(a), 'blue')
  } else if (a < 0) {
    result = miseEnEvidence(texNombre(a))
  } else result = miseEnEvidence(texNombre(a), 'black')
  return result
}

/**
 * @param {number} r Un nombre relatif
 * @param {number} precision nombre de chiffres maximum après la virgule pour texNombre.
 * @returns {string} met en évidence le signe - si r < 0
 */

export function signeMoinsEnEvidence (r, precision = 0) {
  if (r < 0) return miseEnEvidence('-') + texNombre(Math.abs(r), precision)
  else return texNombre(Math.abs(r), precision)
}

/**
 * Ajoute des parenthèses aux nombres négatifs
 * @Example
 * // 3 ou (-3)
 * @author Rémi Angot
 */
export function ecritureParentheseSiNegatif (a) {
  let result = ''
  if (a instanceof Decimal) {
    if (a.gte(0)) return texNombre(a, 8) // On met 8 décimales, mais cette fonctions s'utilise presque exclusivement avec des entiers donc ça ne sert à rien
    else return `(${texNombre(a, 8)})`
  } else {
    if (a >= 0) {
      result = texNombre(a, 8) // j'ai passé le nombre dans texNombre, car la fonction ne prenait pas en compte l'écriture décimale !
    } else {
      result = `(${texNombre(a, 8)})`
    }
    return result
  }
}

/**
 * Ajoute des parenthèses si une expression commence par un moins
 * @Example
 * // (-3x)
 * @author Rémi Angot
 */
export function ecritureParentheseSiMoins (expr) {
  if (expr[0] === '-') return `(${expr})`
  else return expr
}

/**
 *
 * @author Jean-claude Lhote
 * @param {numero} 1=A, 2=B ...
 * @param {etapes} tableau de chaines comportant les expressions à afficher dans le membre de droite.
 */

export function calculAligne (numero, etapes) {
  let script = `$\\begin{aligned}${miseEnEvidence(lettreDepuisChiffre(numero))}&=${etapes[0]}`
  for (let i = 1; i < etapes.length - 1; i++) {
    script += `\\\\&=${etapes[i]}`
  }
  script += `\\\\${miseEnEvidence(lettreDepuisChiffre(numero) + '&=' + etapes[etapes.length - 1])}$`
  return script
}

/**
 * Retourne égal si la valeur est égale à l'arrondi souhaité ou environ égal si ce n'est pas le cas
 * Le nombre a est comparé à son arrondi à précision près. Si la différence est inférieure à epsilon, alors on retourne '=' sinon '\\approx'
 * fonctionne aussi si a est une fraction : permet de finir un calcul par la valeur décimale si on veut.
 * @author Jean-Claude Lhote
 */
export function egalOuApprox (a, precision) {
  if (typeof a === 'object' && ['Fraction', 'FractionEtendue'].indexOf(a.type) !== -1) {
    return egal(a.n / a.d, arrondi(a.n / a.d, precision)) ? '=' : '\\approx'
  } else if (a instanceof Decimal) {
    return a.eq(a.toDP(precision)) ? '=' : '\\approx'
  } else if (!isNaN(a) && !isNaN(precision)) return egal(a, round(a, precision), 10 ** (-precision - 2)) ? '=' : '\\approx'
  else {
    window.notify('egalOuApprox : l\'argument n\'est pas un nombre', { a, precision })
    return 'Mauvais argument (nombres attendus).'
  }
}

/**
 * renvoie une chaine correspondant à l'écriture réduite d'ax+b selon les valeurs de a et b
 * La lettre par défaut utilisée est 'x' mais peut être tout autre chose.
 * @author Jean-Claude Lhote
 * @param {number} a
 * @param {number} b
 */
export function reduireAxPlusB (a, b) {
  if (!(a instanceof Decimal)) a = new Decimal(a)
  if (!(b instanceof Decimal)) b = new Decimal(b)
  let result = ''
  if (!a.isZero()) {
    if (a.eq(1)) result = 'x'
    else if (a.eq(-1)) result = '-x'
    else result = `${stringNombre(a)}x`
  }
  if (!b.isZero()) {
    if (!a.isZero()) result += `${ecritureAlgebrique(b)}`
    else result = stringNombre(b)
  } else if (a.isZero()) result = '0'
  return result
}

/**
 * renvoie une chaine correspondant à l'écriture réduite d'ax^3+bx^2+cx+d selon les valeurs de a, b, c et d
 * @author Jean-Claude Lhote
 */
export function reduirePolynomeDegre3 (a, b, c, d, x = 'x') {
  let result = ''
  if (a !== 0) {
    switch (a) {
      case 1:
        result += `${x}^3`
        break
      case -1:
        result += `-${x}^3`
        break
      default:
        result += `${a}${x}^3`
        break
    }
    if (b !== 0) {
      switch (b) {
        case 1:
          result += `+${x}^2`
          break
        case -1:
          result += `-${x}^2`
          break
        default:
          result += `${ecritureAlgebrique(b)}${x}^2`
          break
      }
    }
    if (c !== 0) {
      switch (c) {
        case 1:
          result += `+${x}`
          break
        case -1:
          result += `-${x}`
          break
        default:
          result += `${ecritureAlgebrique(c)}${x}`
          break
      }
    }
    if (d !== 0) {
      result += `${ecritureAlgebrique(d)}`
    }
  } else { // degré 2 pas de degré 3
    if (b !== 0) {
      switch (b) {
        case 1:
          result += `${x}^2`
          break
        case -1:
          result += `-${x}^2`
          break
        default:
          result += `${b}${x}^2`
          break
      }
      if (c !== 0) {
        switch (c) {
          case 1:
            result += `+${x}`
            break
          case -1:
            result += `-${x}`
            break
          default:
            result += `${ecritureAlgebrique(c)}${x}`
            break
        }
      }
      if (d !== 0) {
        result += `${ecritureAlgebrique(d)}`
      }
    } else // degré 1 pas de degré 2 ni de degré 3
      if (c !== 0) {
        switch (c) {
          case 1:
            result += `${x}`
            break
          case -1:
            result += `-${x}`
            break
          default:
            result += `${c}${x}`
            break
        }
        if (d !== 0) {
          result += `${ecritureAlgebrique(d)}`
        }
      } else { // degré 0 a=0, b=0 et c=0
        result += `${d}`
      }
  }
  return result
}
