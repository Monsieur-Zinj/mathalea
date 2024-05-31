import FractionEtendue from '../../modules/FractionEtendue.ts'
import { randint } from '../../modules/outils.js'
import { ecritureAlgebrique } from '../outils/ecritures'
import { matriceCarree } from './MatriceCarree.js'
import Decimal from 'decimal.js'
import { Polynome } from './Polynome.js'
import { miseEnEvidence } from '../outils/embellissements'
import engine, { generateCleaner } from '../interactif/comparisonFunctions'

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
  if (matrice.determinant() === 0) return [0, 0]
  const [a, b] = matrice.inverse().multiply([fx1 - c, fx2 - c]).toArray()
  return [a, b]
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
  if (matrice.determinant() === 0) {
    return [0, 0, 0]
  }
  const [a, b, c] = matrice.inverse().multiply([y1, y2, y3]).toArray()
  return [a, b, c]
}

/**
 * Une fonction pour transformer en FractionEtendue
 * @param x
 * @return {FractionEtendue}
 */
export function rationnalise (x) {
  if (x == null) {
    window.notify('rationnalise est appelé avec une valeur undefined ou nulle', { x })
    return new FractionEtendue(0, 1)
  }
  if (x instanceof FractionEtendue) return x
  if (x instanceof Decimal) {
    const numDen = x.toFraction(10000) // On limite le dénominateur à 10000
    return new FractionEtendue(numDen[0].toNumber(), numDen[1].toNumber())
  }
  if (typeof x === 'number') {
    // MGU  : C'est dangereux ce truc mais bon...
    // Déjà ça gère au delà des centièmes...
    const numDen = new Decimal(x.toFixed(5)).toFraction(10000)
    return new FractionEtendue(numDen[0].toNumber(), numDen[1].toNumber())
  }
  // c'est pas un number, c'est pas une FractionEtendue... ça doit être une Fraction de mathjs
  window.notify('rationnalise est appelé avec un nombre dont le format est inconnu :', { x })
  return x
}

/**
 * Une fonction utilisée dans les 3 fonctions qui suivent (suppressionParentheses, regroupeTermesMemeDegre et developpe afin de colorier ou pas les termes
 * @param str
 * @param color
 * @param isColored
 * @return {string|*}
 */
const miseEnForme = (str, color, isColored) => isColored ? miseEnEvidence(str, color) : str
function neg (expr) {
  if (expr.head !== 'Add') return engine.function('Multiply', [expr, '-1'])
  return engine.function('Add', expr.ops.map(neg), { canonical: false })
}

/**
 * Une fonction pour supprimer les parenthèses et aplatir l'expression (un Add avec une série de termes)
 * @param expr
 * @return {*|BoxedExpression}
 */
function flattenAdd (expr) {
  if (expr.head === 'Subtract') { return flattenAdd(engine.function('Add', [expr.op1, neg(expr.op2)], { canonical: false })) }

  if (expr.head !== 'Add') return expr

  const ops = []
  for (let op of expr.ops) {
    op = flattenAdd(op)
    if (op.head === 'Add' || op.head === 'Delimiter') ops.push(...op.ops.map(flattenAdd))
    else ops.push(op)
  }
  return engine.function('Add', ops, { canonical: false })
}

/**
 * Supprime les parenthèses dans une somme du type (5x+3)-(2x^2-3x+4)+(4x+7-3x^3)
 * @param {string} exp
 * @param {{color: boolean}} options
 */
export function suppressionParentheses (exp, options) {
  const couleurs = options.couleurs ?? ['red', 'blue', 'green', 'black', 'red', 'blue', 'green', 'black']
  const isColored = options?.isColored
  const clean = generateCleaner(['parentheses', 'espaces', 'virgules', 'fractions'])
  exp = clean(exp)
  const arbre = engine.parse(exp, { canonical: false })
  const sp = flattenAdd(flattenAdd(arbre))
  const parts = sp.ops
  let expressionFinale = ''
  for (let index = 0; index < parts.length; index++) {
    const latex = parts[index].latex.startsWith('-')
      ? parts[index].latex
      : index === 0
        ? parts[index].latex
        : `+${parts[index].latex}`
    const deg = parts[index].getSubexpressions('Power')[0]
      ? parts[index].getSubexpressions('Power')[0].op2
      : parts[index].isAlgebraic
        ? 0
        : 1
    expressionFinale += miseEnForme(latex, couleurs[Math.max(0, 2 - deg)], isColored)
  }
  return expressionFinale
}

/**
 * une fonction pour trier les termes d'une somme algébrique selon l'exposant de la puissance
 * @param {string} exp
 */
export function regroupeTermesMemeDegre (exp, options) {
  const couleurs = options.couleurs ?? ['red', 'blue', 'green', 'black', 'red', 'blue', 'green', 'black']
  const isColored = options?.isColored
  const clean = generateCleaner(['parentheses', 'espaces', 'virgules', 'fractions'])
  exp = clean(exp)
  const arbre = engine.parse(exp, { canonical: false })
  const parts = flattenAdd(arbre).ops
  const allTheTerms = []
  for (let index = 0; index < parts.length; index++) {
    const deg = parts[index].getSubexpressions('Power')[0]
      ? parts[index].getSubexpressions('Power')[0].op2
      : parts[index].isAlgebraic
        ? 0
        : 1
    const latex = parts[index].latex.startsWith('-')
      ? parts[index].latex
      : index === 0
        ? parts[index].latex
        : `+${parts[index].latex}`
    if (allTheTerms[deg] == null) allTheTerms[deg] = []
    allTheTerms[deg].push(latex)
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
      expressionFinale.push(`(${miseEnForme(parcel, couleurs[Math.max(0, 2 - (i - 1))], isColored)})`)
    }
  }
  return expressionFinale.join('+')
}

/**
 *
 * @param expr
 * @param {{isColored: boolean, colorOffset: number, level: 0|1}} options
 * @return {string}
 */
export function developpe (expr, options) {
  const isColored = options?.isColored
  const colorOffset = options.colorOffset ?? 0
  const level = options?.level ?? 0
  const clean = generateCleaner(['parentheses', 'fractions'])
  const couleurs = options.couleurs ?? ['red', 'blue', 'green', 'black', 'red', 'blue', 'green', 'black']
  expr = clean(expr)
  const arbre = engine.parse(expr)
  if (!['Square', 'Multiply', 'Power'].includes(arbre.head)) { // On ne développe que les produits où les carrés ici
    return expr.replaceAll('\\frac', '\\dfrac')
  }
  if (arbre.head === 'Square' || arbre.head === 'Power') { // on est sans doute en présence d'une égalité remarquable ?
    if (arbre.op2.numericValue !== 2) return expr.replaceAll('\\frac', '\\dfrac')
    const interior = arbre.op1
    const somme = interior.head === 'Add'
    const terme1 = interior.op1
    const terme2 = interior.op2
    const carre1 = terme1.isAlgebraic
      ? terme1.latex.startsWith('-')
        ? `\\lparen ${terme1.latex}\\rparen ^2`
        : `${terme1.latex}^2`
      : `\\lparen ${terme1.latex}\\rparen ^2`
    const carre2 = terme2.isAlgebraic
      ? terme2.latex.startsWith('-')
        ? `\\lparen ${terme2.latex}\\rparen ^2`
        : `${terme2.latex}^2`
      : `\\lparen ${terme2.latex}\\rparen ^2`
    const dbleProd = `2\\times ${terme1.isAlgebraic
        ? terme1.latex.startsWith('-')
            ? `\\lparen ${terme1.latex}\\rparen `
            : `${terme1.latex}`
        : `\\lparen ${terme1.latex}\\rparen `}\\times ${terme2.isAlgebraic
        ? terme2.latex.startsWith('-')
            ? `\\lparen ${terme2.latex}\\rparen `
            : `${terme2.latex}`
        : `${terme2.latex}`}`
    if (level === 2) {
      return `${miseEnForme(carre1, couleurs[colorOffset], isColored)}${somme ? '+' : '-'}${miseEnForme(dbleProd, couleurs[colorOffset + 1], isColored)}+${miseEnForme(carre2, couleurs[colorOffset + 2], isColored)}`.replaceAll('\\frac', '\\dfrac')
    } else {
      const dp = engine.parse(dbleProd).simplify().latex
      const c1 = engine.box(['Multiply', terme1, terme1]).evaluate().latex
      const c2 = engine.box(['Multiply', terme2, terme2]).evaluate().latex
      return `${miseEnForme(c1, couleurs[colorOffset], isColored)}${somme ? '+' : '-'}${miseEnForme(dp, couleurs[colorOffset + 1], isColored)}+${miseEnForme(c2, couleurs[colorOffset + 2], isColored)}`.replaceAll('\\frac', '\\dfrac')
    }
  } else { // Ici c'est un produit classique.
    const facteur1 = arbre.op1
    const facteur2 = arbre.op2
    const terme1 = facteur1.op1
    const terme2 = facteur1.op2
    const somme1 = facteur1.head === 'Add'
    const terme3 = facteur2.op1
    const terme4 = facteur2.op2
    const somme2 = facteur2.head === 'Add'
    const t1 = terme1.latex.startsWith('-')
      ? `\\lparen ${terme1.latex}\\rparen `
      : terme1.latex
    const t2 = terme2.latex.startsWith('-')
      ? `\\lparen ${terme2.latex}\\rparen `
      : terme2.latex

    const t3 = terme3.latex.startsWith('-')
      ? `\\lparen ${terme3.latex}\\rparen `
      : terme3.latex
    const t4 = terme4.latex.startsWith('-')
      ? `\\lparen ${terme4.latex}\\rparen `
      : terme4.latex
    if (level === 2) {
      return `${miseEnForme(t1, couleurs[colorOffset], isColored)}\\times ${miseEnForme(t3, couleurs[colorOffset + 2], isColored)}
    ${somme2 ? '+' : '-'}${miseEnForme(t1, couleurs[colorOffset], isColored)}\\times ${miseEnForme(t4, couleurs[colorOffset + 3], isColored)}
    ${somme1 ? '+' : '-'}${miseEnForme(t2, couleurs[colorOffset + 1], isColored)}\\times ${miseEnForme(t3, couleurs[colorOffset + 2], isColored)}
    ${somme1 === somme2 ? '+' : '-'}${miseEnForme(t2, couleurs[colorOffset + 1], isColored)}\\times ${miseEnForme(t4, couleurs[colorOffset + 3], isColored)}`.replaceAll('\\frac', '\\dfrac')
    } else {
      const prod1 = engine.box(['Multiply', terme1, terme3]).evaluate().simplify().latex
      const prod2 = engine.box(['Multiply', terme1, terme4]).evaluate().simplify().latex
      const prod3 = engine.box(['Multiply', terme2, terme3]).evaluate().simplify().latex
      const prod4 = engine.box(['Multiply', terme2, terme4]).evaluate().simplify().latex
      if (level === 1) {
        const p2 = prod2.startsWith('-') ? `\\lparen ${prod2})` : prod2
        const p3 = prod3.startsWith('-') ? `\\lparen ${prod3})` : prod3
        const p4 = prod4.startsWith('-') ? `\\lparen ${prod4})` : prod4
        return `${miseEnForme(prod1, couleurs[colorOffset], isColored)}
        ${somme2 ? '+' : '-'}${miseEnForme(p2, couleurs[colorOffset + 1], isColored)}
        ${somme1 ? '+' : '-'}${miseEnForme(p3, couleurs[colorOffset + 1], isColored)}
        ${somme1 === somme2 ? '+' : '-'}${miseEnForme(p4, couleurs[colorOffset + 1], isColored)}`.replaceAll('\\frac', '\\dfrac')
      } else {
        const p2 = prod2.startsWith('-')
          ? somme2
            ? prod2
            : `+${prod2.substring(1)}`
          : somme2
            ? `+${prod2}`
            : `-${prod2}`
        const p3 = prod3.startsWith('-')
          ? somme1
            ? prod3
            : `+${prod3.substring(1)}`
          : somme1
            ? `+${prod3}`
            : `-${prod3}`
        const p4 = prod4.startsWith('-')
          ? somme1 === somme2
            ? prod4
            : `+${prod4.substring(1)}`
          : somme1 === somme2
            ? `+${prod4}`
            : `-${prod4}`

        return `${miseEnForme(prod1, couleurs[colorOffset], isColored)}
        ${miseEnForme(p2, couleurs[colorOffset + 1], isColored)}
        ${miseEnForme(p3, couleurs[colorOffset + 2], isColored)}
        ${miseEnForme(p4, couleurs[colorOffset + 3], isColored)}`.replaceAll('\\frac', '\\dfrac')
      }
    }
  }
}
