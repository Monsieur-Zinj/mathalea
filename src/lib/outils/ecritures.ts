import Decimal from 'decimal.js'
import { equal, round } from 'mathjs'
import { context } from '../../modules/context.js'
import FractionEtendue from '../../modules/FractionEtendue.js'
import { egal } from '../../modules/outils.js'
import { miseEnEvidence } from './embellissements.js'
import { arrondi } from './nombres'
import { lettreDepuisChiffre } from './outilString.js'
import { stringNombre, texNombre } from './texNombre'
import { fraction } from '../../modules/fractions.js'

/**
 * écrit le nombre, mais pas un nombre s'il est égal à 1
 * @Example
 * //rienSi1(1)+'x' -> x
 * //rienSi1(-1)+'x' -> -x
 * @author Rémi Angot et Jean-Claude Lhote pour le support des fractions
 */
export function rienSi1 (a: number | FractionEtendue) {
  if (a instanceof FractionEtendue && !(a.isEqual(fraction(1, 1)) || a.isEqual(fraction(-1, 1)))) return a.toLatex().replace('dfrac', 'frac')
  if (typeof a === 'string') {
    window.notify('rienSi1() n\'accepte pas les string.', { argument: a })
    a = Number(a)
  }
  if (a instanceof FractionEtendue && (a.isEqual(fraction(1, 1)))) return ''
  if (a instanceof FractionEtendue && (a.isEqual(fraction(-1, 1)))) return '-'
  if (equal(a, 1)) return ''
  if (equal(a, -1)) return '-'

  if (Number(a) || a === 0) return stringNombre(a as number, 7) // on retourne 0, ce ne sera pas joli, mais Number(0) est false !!!
  window.notify('rienSi1 : type de valeur non prise en compte : ', { a })
}

/**
 * Gère l'écriture de l'exposant en mode text (ne doit pas s'utiliser entre $ $)
 * Pour le mode maths (entre $ $) on utilisera tout simplement ^3 pour mettre au cube ou ^{42} pour la puissance 42.
 * @Example
 * // 'dm'+texteExposant(3)
 * @author Rémi Angot
 */
export function texteExposant (texte: string) {
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
export function ecritureNombreRelatif (a: string | number) {
  if (typeof a === 'string') {
    window.notify('ecritureNombreRelatif() n\'accepte pas les string.', { argument: a })
    a = Number(a)
  }
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
export function ecritureNombreRelatifc (a: string | number) {
  if (typeof a === 'string') {
    window.notify('ecritureNombreRelatifc() n\'accepte pas les string.', { argument: a })
    a = Number(a)
  }
  let result = ''
  if (a > 0) {
    result = miseEnEvidence('(+' + texNombre(a, 7) + ')', 'blue')
  } else if (a < 0) {
    result = miseEnEvidence('(' + texNombre(a, 7) + ')')
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
export function ecritureAlgebrique (a: number | FractionEtendue | Decimal) {
  if (typeof a === 'string') {
    window.notify('ecritureAlgebrique() n\'accepte pas les string.', { argument: a })
    return a
  } else if (a instanceof FractionEtendue) {
    return a.texFractionSignee
  } else if (typeof a === 'number') {
    if (a >= 0) {
      return '+' + texNombre(a, 7)
    } else {
      return texNombre(a, 7)
    }
  } else if (a instanceof Decimal) {
    if (a.isPos()) {
      return '+' + texNombre(a, 7)
    } else {
      return texNombre(a, 7)
    }
  } else {
    window.notify('ecritureAlgebrique() : type de valeur non prise en compte', { argument: a })
    return ''
  }
}

/**
 * Ajoute le + devant les nombres positifs, n'écrit rien si 1
 * @Example
 * //+3 ou -3
 * @author Rémi Angot et Jean-Claude Lhote pour le support des fractions
 */
export function ecritureAlgebriqueSauf1 (a: FractionEtendue | number | Decimal) {
  if (a instanceof FractionEtendue) return a.ecritureAlgebrique
  if (typeof a === 'string') {
    window.notify('ecritureAlgebriqueSauf1() n\'accepte pas les string.', { argument: a })
    a = Number(a)
  }
  if (equal(a, 1)) return '+'
  else if (equal(a, -1)) return '-'
  else if (typeof a === 'number' || a instanceof Decimal) return ecritureAlgebrique(a)
  else window.notify('ecritureAlgebriqueSauf1 : type de valeur non prise en compte', {})
}

/**
 * Idem ecritureAlgebrique mais retourne le nombre en couleur (vert si positif, rouge si négatif et noir si nul).
 * @param {number} a
 */
export function ecritureAlgebriquec (a: number | string) {
  if (typeof a === 'string') {
    window.notify('ecritureAlgebriquec() n\'accepte pas les string.', { argument: a })
    a = Number(a)
  }
  let result = ''
  if (a > 0) {
    result = miseEnEvidence('+' + texNombre(a, 7), 'blue')
  } else if (a < 0) {
    result = miseEnEvidence(texNombre(a, 7))
  } else result = miseEnEvidence(texNombre(a, 7), 'black')
  return result
}

/**
 * @param {number} r Un nombre relatif
 * @param {number} precision nombre de chiffres maximum après la virgule pour texNombre.
 * @returns {string} met en évidence le signe - si r < 0
 */

export function signeMoinsEnEvidence (r: number, precision = 0) {
  if (typeof r !== 'number') window.notify('signeMoinsEnEvidence() appelé avec autre chose qu\'un nombre.', { argument: r })
  else if (r < 0) return miseEnEvidence('-') + texNombre(Math.abs(r), precision)
  else return texNombre(Math.abs(r), precision)
}

/**
 * Ajoute des parenthèses aux nombres négatifs
 * @Example
 * // 3 ou (-3)
 * @author Rémi Angot
 */
export function ecritureParentheseSiNegatif (a: Decimal | number | FractionEtendue) {
  let result = ''
  if (a instanceof Decimal) {
    if (a.gte(0)) return texNombre(a, 8) // On met 8 décimales, mais cette fonctions s'utilise presque exclusivement avec des entiers donc ça ne sert à rien
    else return `(${texNombre(a, 8)})`
  } else if (typeof a === 'number') {
    if (a >= 0) {
      result = texNombre(a, 8) // j'ai passé le nombre dans texNombre, car la fonction ne prenait pas en compte l'écriture décimale !
    } else {
      result = `(${texNombre(a, 8)})`
    }
    return result
  } else if (a instanceof FractionEtendue) {
    return a.ecritureParentheseSiNegatif
  } else {
    window.notify('ecritureParentheseSiNegatif() appelée avec autre chose qu\'un nombre', { argument: a })
  }
}

/**
 * Ajoute des parenthèses si une expression commence par un moins
 * @Example
 * // (-3x)
 * @author Rémi Angot
 */
export function ecritureParentheseSiMoins (expr: string | number| FractionEtendue) {
  if (typeof expr === 'string' && expr[0] === '-') return `(${expr})`
  else if (typeof expr === 'string') return expr // Il faut sortir si c'est un string, il n'y a rien à faire de plus !
  else if (typeof expr === 'number' && expr < 0) return `(${stringNombre(expr, 7)})`
  else if (typeof expr === 'number') return stringNombre(expr, 7)
  else if (expr instanceof FractionEtendue && expr.s === -1) return `(${expr.texFSD})`
  else {
    // avant on passait ici quand c'était un string sans signe - devant... c'était une mauvaise idée !
    window.notify('ecritureParentheseSiMoins() n\'accepte pas ce type d\'argument.', { argument: expr })
    return expr
  }
}

/**
 *
 * @author Jean-claude Lhote
 * @param {numero} 1=A, 2=B ...
 * @param {etapes} tableau de chaines comportant les expressions à afficher dans le membre de droite.
 */

export function calculAligne (numero: number, etapes: number[]) {
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
export function egalOuApprox (a: number | FractionEtendue | Decimal, precision: number) {
  if (a instanceof FractionEtendue) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ ts-expect-errors
    return egal(a.num / a.den, arrondi(a.num / a.den, precision)) ? '=' : '\\approx'
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
 * @author Eric Elter
 * @param {number} a
 * @param {number} b
 * @param {string} [inconnue = 'x'] 'x' par défaut, mais on peut préciser autre chose.
 */
export function reduireAxPlusB (a: number | Decimal, b: number | Decimal, inconnue: string = 'x') {
  return reduireAxPlusByPlusC(a, 0, b, inconnue)
}

/* Ancienne version de Jean-Claude Lhote

if (!(a instanceof Decimal)) a = new Decimal(a)
  if (!(b instanceof Decimal)) b = new Decimal(b)
  let result = ''
  if (!a.isZero()) {
    if (a.eq(1)) result = inconnue
    else if (a.eq(-1)) result = '-' + inconnue
    else result = `${texNombre(a, 7)}${inconnue}`
  }
  if (!b.isZero()) {
    if (a.isZero()) result = texNombre(b, 7)
    else result += ecritureAlgebrique(b)
  } else if (a.isZero()) result = '0'
  return result
} */

/**
 * renvoie une chaine correspondant à l'écriture réduite d'ax+by+c selon les valeurs de a, b et c
 * Les lettres par défaut utilisées sont 'x' et y mais peut être tout autre chose.
 * @author Eric Elter
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {string} [inconnueX = 'x'] 'x' par défaut, mais on peut préciser autre chose.
 * @param {string} [inconnueY = 'y'] 'y' par défaut, mais on peut préciser autre chose.
 * @example reduireAxPlusByPlusC(3,-4,5) // renvoie 3x-4y+5
 * @example reduireAxPlusByPlusC(1,-1,0) // renvoie x-y
 * @example reduireAxPlusByPlusC(0,2,-7) // renvoie 2y-7
 * @example reduireAxPlusByPlusC(3,0,6) // renvoie 3x+6
 * @example reduireAxPlusByPlusC(0,0,0) // renvoie 0
 * @example reduireAxPlusByPlusC(3,-4,5,'a','b') // renvoie 3a-4b+5
 * @return {string}
 */
export function reduireAxPlusByPlusC (a: number | Decimal, b: number | Decimal, c:number|Decimal, inconnueX = 'x', inconnueY = 'y') {
  if (!(a instanceof Decimal)) a = new Decimal(a)
  if (!(b instanceof Decimal)) b = new Decimal(b)
  if (!(c instanceof Decimal)) c = new Decimal(c)
  let result = ''
  result += a.isZero() ? '' : ((a.eq(1) ? '' : a.eq(-1) ? '-' : (texNombre(a))) + inconnueX)
  result += b.isZero() ? '' : ((b.eq(-1) ? '-' : (b.eq(1) && a.isZero()) ? '' : (b.eq(1) && !a.isZero()) ? '+' : a.isZero() ? (texNombre(b)) : (ecritureAlgebrique(b))) + inconnueY)
  result += (a.isZero() && b.isZero() && c.isZero()) ? 0 : c.isZero() ? '' : (a.isZero() && b.isZero()) ? texNombre(c) : (ecritureAlgebrique(c))
  return result
}

/**
 * renvoie une chaine correspondant à l'écriture réduite d'ax^3+bx^2+cx+d selon les valeurs de a, b, c et d
 * @author Jean-Claude Lhote
 */
export function reduirePolynomeDegre3 (a: number, b: number, c: number, d: number, x = 'x') {
  [a, b, c, d].forEach((el) => typeof el === 'number' ? el : Number(el))
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

export function ordreAlphabetique (str: string):string {
  const chars = Array.from(str)
  const orderedChars = chars.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
  return orderedChars.join('')
}
