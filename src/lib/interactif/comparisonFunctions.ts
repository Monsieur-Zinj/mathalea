/* eslint-disable no-undef */
import {
  ComputeEngine,
  type BoxedExpression
} from '@cortex-js/compute-engine'
// import FractionEtendue from '../../modules/FractionEtendue'
import Grandeur from '../../modules/Grandeur'
import Hms from '../../modules/Hms'
// import { texFractionFromString } from '../outils/deprecatedFractions'
import type { Expression } from 'mathlive'
import { areSameArray } from '../outils/arrayOutils'

const engine = new ComputeEngine()
export default engine

export type ResultType = { isOk: boolean; feedback?: string }
export type OptionsComparaisonType = {
  expressionsForcementReduites?: boolean
  avecSigneMultiplier?: boolean
  avecFractions?: boolean
  fractionIrreductible?: boolean
  fractionSimplifiee?: boolean
  fractionReduite?: boolean
  fractionDecimale?:boolean
  fractionEgale?:boolean
  nombreDecimalSeulement?:boolean
  operationSeulementEtNonCalcul?: boolean
  calculSeulementEtNonOperation?: boolean
  ensembleDeNombres ?:boolean
  kUplet ? :boolean
  suiteDeNombres ?:boolean
  suiteRangeeDeNombres?:boolean
  HMS?: boolean
  intervalle?: boolean
  estDansIntervalle?: boolean
  ecritureScientifique?: boolean
  unite?: boolean
  precisionUnite?: number
  puissance?: boolean
  texteAvecCasse?: boolean
  texteSansCasse?: boolean
  nombreAvecEspace?: boolean
  egaliteExpression?: boolean
  noUselessParen?: boolean
  nonReponseAcceptee?: boolean,
  pluriels?: boolean
}
export type CompareFunction = (
  input: string,
  goodAnswer: string,
  options: OptionsComparaisonType,
) => ResultType

interface BoxedExpressionWithHead extends BoxedExpression {
  head: string
}
function expressionWithHead (expr: BoxedExpression) {
  if ('head' in expr) {
    return expr as BoxedExpressionWithHead
  }
  // ne devrait jamais avoir lieu d'après la doc de computeEngine, toutes les boxedExpressions ont un head
  return { ...expr, head: 'Symbol' } as BoxedExpressionWithHead
}
type CleaningOperation =
  | 'fractions'
  | 'fractionsMemesNegatives'
  | 'virgules'
  | 'espaces'
  | 'parentheses'
  | 'puissances'
  | 'divisions'
  | 'latex'
  | 'foisUn'
  | 'unites'
  | 'doubleEspaces'
  | 'mathrm'

/**
 * Nettoie la saisie des \\dfrac en les remplaçant par des \frac comprises par ComputeEngine
 * @param {string} str
 */
function cleanFractions (str: string): string {
  return str.replaceAll(/dfrac/g, 'frac')
}

/**
 * Nettoie la saisie des \\frac pour mieux gérer les fractions négatives et que le moins soit toujours au dénominateur
 * Rajout des regex de MD pour gérer les fractions négatives (30/08/2024 : pas de solution directement par ComputeEngine mais ArnoG est sur le coup)
 * Cette fraction est amené à remplacer cleanFractions mais dans le doute (laissons-lui du temps pour vérifier qu'elle ne buggue pas), et pour vexer personne, je la mets en doublon.
 * @param {string} str
 * @author Eric Elter
 */
function cleanFractionsMemesNegatives (str: string): string { // EE :
  let modif: string
  modif = str.replaceAll(/dfrac/g, 'frac')

  // regex made by Mathieu Degrange
  modif = modif.replace(/^-\\frac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, (match, p1, p2, p3, p4) => `\\frac{${(p1 || p3) * (p2 || p4) > 0 ? '-' : ''}${Math.abs(p1 || p3)}}{${Math.abs(p2 || p4)}}`) // Permet de transformer -\frac{13}{15} en \frac{-13}{15} et -\frac{-13}{15} en \frac{13}{15}

  modif = modif.replace(/^\\frac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, (match, p1, p2, p3, p4) => `\\frac{${(p1 || p3) * (p2 || p4) < 0 ? '-' : ''}${Math.abs(p1 || p3)}}{${Math.abs(p2 || p4)}}`) // Permet de transformer \frac{-13}{-15} en \frac{13}{15}

  return modif
}

/**
 * Nettoie la saisie des \\div en les remplaçant par des / compris par ComputeEngine
 * @param {string} str
 */
function cleanDivisions (str: string): string {
  return str.replaceAll(/\\div/g, '/')
}
/**
 * Nettoie la saisie des virgules décimales en les remplaçant par des points.
 * @warning Attention ne fonctionne avec Safari que depuis 2023
 * @param {string} str
 */
function cleanComas (str: string): string {
  return str.replaceAll(/\{,}/g, '.').replaceAll(/(?<!\\),/g, '.')
}

/**
 * Nettoie la saisie des espaces
 * @param {string} str
 */
function cleanSpaces (str: string): string {
  return str.replaceAll(/\s/g, '').replaceAll(/\\,/g, '')
}

/**
 * Réduit les espaces doubles ou triples à de simples espaces mais ne supprime pas les simples espaces
 * supprime aussi les espaces simples en début et fin de saisie
 */
function cleanDoubleSpaces (str: string): string {
  let s = str
  while (s.includes('  ')) {
    s = s.replace('  ', ' ')
  }
  if (s[0] === ' ') s = s.substring(1, s.length)
  if (s[s.length - 1] === ' ') s = s.substring(0, s.length - 1)
  return s
}

/**
 * Nettoie les parenthèses en remplaçant par celles supportées par le ComputeEngine
 * @param {string} str
 */
function cleanParenthses (str: string): string {
  return str
    .replaceAll(/\\lparen(\+?-?\d+,?\.?\d*)\\rparen/g, '($1)')
    .replaceAll(/\\left\((\+?-?\d+)\\right\)/g, '($1)')
    .replaceAll(/\\lparen(\+?-?\d+)\\rparen/g, '($1)')
    .replaceAll('\\lparen', '(')
    .replaceAll('\\rparen', ')')
    .replaceAll('\\left\\lbrack', '[')
    .replaceAll('\\right\\rbrack', ']')
    .replaceAll('\\right\\lbrack', '[')
    .replaceAll('\\left\\rbrack', ']')
    .replaceAll('\\left[', '[')
    .replaceAll('\\right]', ']')
    .replaceAll('\\right[', '[')
    .replaceAll('\\left]', ']')
}

function cleanMathRm (str: string): string {
  return str.replace(/\\mathrm\{(\w+)}/g, '$1')
}

/**
 * Nettoie le latex \text{} mis pour séparer le nombre de l'unité en mode texte
 * @param {string} str
 */
function cleanUnity (str: string): string {
  return str.replaceAll('{\\:\\text{', '').replaceAll('}\\:}', '')
}

/**
 * Nettoie tout ce qui peut arriver à l'utilisation des puissances
 * @param {string} str
 */
function cleanPower (str: string): string {
  return str
    .replaceAll('²', '^2') // '²' c'est pas correct en latex !
    .replaceAll('³', '^3') // '³' non plus
    .replaceAll('^{}', '') // les exposants vides, il n'aime pas ça non plus
    .replaceAll('^{^', '^{') // EE : Pour supprimer les puissances de puissances malencontreuses
}

/**
 * transforme \text{truc} en truc utiliser cleanUnity si le \text{} est au milieu de la chaine.
 * @param str
 */
function cleanLatex (str: string): string {
  const text = str.match(/(\\text\{)(.*)}/)
  if (text && text?.length > 2) return text[2]
  return str
}

function cleanMultipliyByOne (str: string): string {
  if (!str.match(/\D*1([a-z])/)) return str // à priori, rien à nettoyer ici
  return str.replace(/(\D*)1([a-z])/g, '$1$2')
}

export function generateCleaner (
  operations: CleaningOperation[]
): (str: string) => string {
  const cleaningFunctions = operations.map((operation) => {
    switch (operation) {
      case 'fractions':
        return cleanFractions
      case 'fractionsMemesNegatives':
        return cleanFractionsMemesNegatives
      case 'virgules':
        return cleanComas
      case 'espaces':
        return cleanSpaces
      case 'parentheses':
        return cleanParenthses
      case 'puissances':
        return cleanPower
      case 'mathrm':
        return cleanMathRm
      case 'divisions':
        return cleanDivisions
      case 'latex':
        return cleanLatex
      case 'foisUn':
        return cleanMultipliyByOne
      case 'unites':
        return cleanUnity
      case 'doubleEspaces':
        return cleanDoubleSpaces
      default:
        throw new Error(`Unsupported cleaning operation: ${operation}`)
    }
  })

  return (str: string) =>
    cleaningFunctions.reduce(
      (result, cleaningFn) => cleaningFn(result),
      String(str)
    )
}

/**
 * fonction initialement dans mathlive.js, j'en ai besoin ici, et plus dans mathlive.js
 * @param {string} input la chaine qui contient le nombre avec son unité
 * @return {Grandeur|false} l'objet de type Grandeur qui contient la valeur et l'unité... ou false si c'est pas une grandeur.
 */
function inputToGrandeur (input: string): Grandeur | false {
  if (input.indexOf('°C') > 0) {
    const split = input.split('°C')
    return new Grandeur(Number.parseFloat(split[0].replace(',', '.')), '°C')
  }
  if (input.indexOf('°') > 0) {
    const split = input.split('°')
    return new Grandeur(Number.parseFloat(split[0].replace(',', '.')), '°')
  }
  if (input.split('operatorname').length !== 2) return false
  const split = input.split('\\operatorname{')
  const mesure = Number.parseFloat(split[0].replace(',', '.'))
  if (split[1]) {
    const split2 = split[1].split('}')
    const unite = split2[0] + split2[1]
    return new Grandeur(mesure, unite)
  }
  return false
}

/**
 * Couteau suisse de la comparaison. Devrait correspondre à une très grosse majorité des comparaisons.
 * Comparaison de nombres ou bien d'expressions : c'est la fonction qui choisit.
 * @param {string} input
 * @param {string|number|Decimal|FractionEtendue} goodAnswer
 * @author Eric Elter
 * @return ResultType
 */
export function calculCompare (input: string, goodAnswer: string): ResultType {
  // Si goodAnswer est un nombre, alors on utilise la comparaison d'un nombre
  // if (typeof goodAnswer === 'number' || goodAnswer instanceof Decimal || goodAnswer instanceof FractionEtendue) return numberCompare(input, goodAnswer)
  // Sinon on utilise la comparaison d'une expression non réduite
  return expressionDeveloppeeEtReduiteCompare(input, goodAnswer)
}

/**
 * comparaison d'expressions factorisées'
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote
 */
export function factorisationCompare (
  input: string,
  goodAnswer: string
): ResultType {
  const clean = generateCleaner([
    'puissances',
    'virgules',
    'fractions',
    'parentheses'
  ])
  const flatten = (expr: BoxedExpressionWithHead): BoxedExpressionWithHead => {
    if (expr.head === 'Multiply') {
      if (expr.ops == null) {
        window.notify('flatten a rencontré un problème avec une multiplication sans opérandes', { expr })
        return engine.parse(expr.latex) as BoxedExpressionWithHead
      }
      return engine.box([
        'Multiply',
        ...(expr.ops as BoxedExpressionWithHead[]).map((op) => flatten(op))
      ]) as BoxedExpressionWithHead
    }
    const base = ['Power', 'Square'].includes(expressionWithHead(expr.op1).head) ? flatten(expressionWithHead(expr.op1)) : expr.op1
    if (expr.head === 'Square') {
      return expressionWithHead(engine.box(['Multiply', base, base], { canonical: true }))
    }
    if (expr.head === 'Power' && expressionWithHead(expr.op2).head === 'Number') {
      const expo = Number(expr.op2.value)
      const exprs = []
      for (let i = 0; i < expo; i++) {
        exprs.push(base)
      }
      return expressionWithHead(engine.box(['Multiply', ...exprs], { canonical: true }))
    }
    return expr
  }

  const allFactorsMatch = (ops1: readonly BoxedExpression[], ops2: readonly BoxedExpression[], signe: boolean): {isOk: boolean, feedback: string} => {
    let signeCurrent = signe
    for (const op of ops1) {
      let match = false
      for (const op2 of ops2) {
        if (op2.isSame(op)) {
          match = true
          break
        }
        const newOp = engine.box(['Subtract', '0', op.json], { canonical: true })
        if (op2.isSame(newOp)) {
          signeCurrent = !signeCurrent
          match = true
          break
        }
      }
      if (!match) return { isOk: false, feedback: `On pouvait mettre $${op.latex}$ en facteur` }
    }
    return { isOk: signeCurrent, feedback: signeCurrent ? '' : 'Il y a un problème de signe' }
  }

  let signe = true
  const aCleaned = clean(input)
  const bCleaned = clean(goodAnswer)
  let saisieParsed = expressionWithHead(engine.parse(aCleaned, { canonical: true }))
  let reponseParsed = expressionWithHead(engine.parse(bCleaned, { canonical: true }))

  if (saisieParsed == null || reponseParsed == null) {
    window.notify(
      'factorisationCompare a rencontré un problème en analysant la réponse ou la saisie ',
      { saisie: input, reponse: goodAnswer }
    )
    return { isOk: false }
  }
  let saisieHead = saisieParsed.head
  let answerHead = reponseParsed.head
  if (saisieHead === 'Negate' && answerHead === 'Negate') { // on gère le cas où la saisie et la réponse commence par le signe moins
    saisieParsed = expressionWithHead(saisieParsed.op1)
    saisieHead = saisieParsed.head
    reponseParsed = expressionWithHead(reponseParsed.op1)
    answerHead = reponseParsed.head
  } else if (saisieHead === 'Negate') {
    saisieParsed = expressionWithHead(saisieParsed.op1)
    saisieHead = saisieParsed.head
    signe = false
  } else if (answerHead === 'Negate') {
    reponseParsed = expressionWithHead(reponseParsed.op1)
    answerHead = reponseParsed.head
    signe = false
  }

  // isOk1 atteste que le développement de la saisie et de la reponse attendue sont égales
  const saisieDev = engine
    .box(['ExpandAll', saisieParsed])
    .evaluate()
    .simplify().canonical
  const reponseDev = engine
    .box(['ExpandAll', reponseParsed])
    .evaluate()
    .simplify().canonical
  const isOk1 = saisieDev.isEqual(reponseDev)

  if (!['Multiply', 'Power', 'Square'].includes(saisieHead)) {
    return { isOk: false, feedback: 'L\'expression n\'est pas factorisée' }
  }
  const reponseFactors = flatten(reponseParsed).ops
  const saisieFactors = flatten(saisieParsed).ops
  if (reponseFactors == null) {
    window.notify('factorisationCompare a rencontré un problème en analysant la réponse ', { reponse: goodAnswer })
    return { isOk: false, feedback: 'Un problème a eu lieu lors de la comparaison' }
  }
  if (saisieFactors == null) return { isOk: false, feedback: 'L\'expression n\'a pas le format attendu' }
  if (saisieFactors.length !== reponseFactors.length) {
    if (isOk1) return { isOk: false, feedback: 'L\'expression est insuffisamment factorisée' }
    return { isOk: false, feedback: 'Il manque des facteurs' }
  }
  return allFactorsMatch(reponseFactors, saisieFactors, signe)
}

/**
 * comparaison de durées
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote
 */
function hmsCompare (input: string, goodAnswer: string): ResultType {
  const clean = generateCleaner(['unites'])
  const cleanInput = clean(input)
  const inputHms = Hms.fromString(cleanInput)
  const goodAnswerHms = Hms.fromString(goodAnswer)
  return { isOk: goodAnswerHms.isTheSame(inputHms) }
}

engine.latexDictionary = [
  ...engine.latexDictionary.filter((x) => x.name !== 'Subtract'),
  {
    ...engine.latexDictionary.find((x) => x.name === 'Subtract'),
    parse: (parser: Parser, lhs: Expression, terminator: ParserOptions) => {
      // Go back one token: we'll parse the '-' as part of the rhs so we
      // can keep the expression an 'Add'.
      parser.index -= 1
      const rhs = parser.parseExpression({ ...terminator, minPrec: 275 + 3 })
      return ['Add', lhs, rhs]
    }
  } as LatexDictionaryEntry // Pas réussi à faire mieux pour typer.
]

/****************************************************************************************************
 *
 *                  C'est la fonction, ci-dessous, la future fonction couteauSuisse
 *                            qu'il faudra nommer fonctionComparaison ?
 *
 ****************************************************************************************************/
/**
 * comparaison générique : notre couteau suisse
 * @param {string} input
 * @param {string} goodAnswer
 * @param {{expressionsForcementReduites:boolean, avecSigneMultiplier:boolean, avecFractions:boolean, fractionIrreductible:boolean, fractionSimplifiee:boolean, fractionReduite:boolean, fractionDecimale:boolean, fractionEgale:boolean, nombreDecimalSeulement:boolean, operationSeulementEtNonCalcul:boolean, calculSeulementEtNonOperation:boolean, HMS:boolean, intervalle:boolean, estDansIntervalle:boolean, ecritureScientifique:boolean, unite:boolean, precisionUnite:number, puissance:boolean, texteAvecCasse:boolean, texteSansCasse:boolean }} [options]
 * @author Eric Elter
 * @return ResultType
 */
export function fonctionComparaison (
  input: string,
  goodAnswer: string,
  {
    expressionsForcementReduites,
    avecSigneMultiplier,
    avecFractions,
    fractionIrreductible, // Documenté
    fractionSimplifiee, // Documenté
    fractionReduite, // Documenté
    fractionDecimale, // Documenté
    fractionEgale, // Documenté
    nombreDecimalSeulement, // Documenté
    operationSeulementEtNonCalcul, // Documenté
    calculSeulementEtNonOperation, // Documenté
    ensembleDeNombres, // Documenté
    kUplet, // Documenté
    suiteDeNombres,
    suiteRangeeDeNombres,
    HMS,
    intervalle,
    estDansIntervalle,
    ecritureScientifique,
    unite,
    precisionUnite,
    puissance,
    texteAvecCasse,
    texteSansCasse,
    nombreAvecEspace,
    egaliteExpression,
    nonReponseAcceptee
  }: OptionsComparaisonType = {
    expressionsForcementReduites: true,
    avecSigneMultiplier: true,
    avecFractions: true,
    fractionIrreductible: false,
    fractionSimplifiee: false,
    fractionReduite: false,
    fractionDecimale: false,
    fractionEgale: false,
    nombreDecimalSeulement: false,
    operationSeulementEtNonCalcul: false,
    calculSeulementEtNonOperation: false,
    ensembleDeNombres: false,
    kUplet: false,
    suiteDeNombres: false,
    suiteRangeeDeNombres: false,
    HMS: false,
    intervalle: false,
    estDansIntervalle: false,
    ecritureScientifique: false,
    unite: false,
    precisionUnite: 0,
    puissance: false,
    texteAvecCasse: false,
    texteSansCasse: false,
    nombreAvecEspace: false,
    egaliteExpression: false,
    nonReponseAcceptee: false
  }
): ResultType {
  // nonReponseAcceptee = true permet d'avoir des champs vides (on pense aux fillInTheBlank qui peuvent être facultatifs, comme par exemple un facteur 1)
  // si false (valeur par défaut ou si non précisée) alors une réponse vide entraîne isOk = false et un feedback pour notifier l'absence de réponse
  if (nonReponseAcceptee) {
    if (input === '' && goodAnswer === '') return { isOk: true }
    return { isOk: false, feedback: 'Une réponse doit être saisie' }
  }
  if (input === '') { return { isOk: false, feedback: 'Une réponse doit être saisie' } }
  // ici, on met tous les tests particuliers (HMS, intervalle)
  // if (HMS) return comparaisonExpressions(input, goodAnswer)
  if (HMS) return hmsCompare(input, goodAnswer)
  if (intervalle) return intervalsCompare(input, goodAnswer)
  if (estDansIntervalle) return intervalCompare(input, goodAnswer)
  if (ecritureScientifique) return scientificCompare(input, goodAnswer)
  if (unite) { return unitsCompare(input, goodAnswer, { precision: precisionUnite }) }
  if (puissance) return powerCompare(input, goodAnswer)
  if (texteAvecCasse) return texteAvecCasseCompare(input, goodAnswer)
  if (texteSansCasse) return texteSansCasseCompare(input, goodAnswer)
  if (egaliteExpression) return egaliteCompare(input, goodAnswer)
  if (nombreAvecEspace) return numberWithSpaceCompare(input, goodAnswer)
  if (ensembleDeNombres || kUplet) return ensembleNombres(input, goodAnswer, { kUplet }) // ensembleDeNombres est non trié alors que kUplet nécessite le tri
  if (suiteDeNombres || suiteRangeeDeNombres) return ensembleNombres(input, goodAnswer, { kUplet: suiteRangeeDeNombres, avecAccolades: false })
  if (fractionSimplifiee || fractionReduite || fractionIrreductible || fractionDecimale || fractionEgale) return comparaisonFraction(input, goodAnswer, { fractionReduite, fractionIrreductible, fractionDecimale, fractionEgale }) // feedback OK
  // Ici, c'est la comparaison par défaut qui fonctionne dans la très grande majorité des cas
  const inputNew = calculSeulementEtNonOperation
    ? input.replace('(', '').replace(')', '').replace('\\lparen', '').replace('\\rparen', '') // Utile pour 5R20
    : input

  return expressionDeveloppeeEtReduiteCompare(inputNew, goodAnswer, {
    expressionsForcementReduites,
    avecSigneMultiplier,
    avecFractions,
    fractionIrreductible,
    operationSeulementEtNonCalcul,
    nombreDecimalSeulement,
    calculSeulementEtNonOperation
  })
}

/**
 * Cette fonction permet que ComputeEngine fasse un super job avec la réduction d'expression et avec des options supplémentaires
 * @param {BoxedExpression} expr
 * @param {{ expressionsForcementReduites:boolean, fractionIrreducibleSeulement:boolean, nombreDecimalSeulement:boolean, operationSeulementEtNonCalcul:boolean, calculSeulementEtNonOperation:boolean}} [options]
 * @author Eric Elter (aidé par ArnoG)
 * @return BoxedExpression
 */
function customCanonical (
  expr: BoxedExpression,
  {
    expressionsForcementReduites = true,
    fractionIrreductible = false, // SANS DOUTE INUTILE MAINTENANT. A VERIFIER
    operationSeulementEtNonCalcul = false,
    nombreDecimalSeulement = false,
    calculSeulementEtNonOperation = false
  } = {}): BoxedExpression {
  let expression = expressionWithHead(expr)
  if (calculSeulementEtNonOperation || nombreDecimalSeulement) { // Fonctionnement : On retourne le calcul
    return expression
  }
  if (!operationSeulementEtNonCalcul) { // Fonctionnement par défaut : Tout est accepté si l'expression est un nombre
    // Ci-dessous, on accepte le résultat d'un calcul mais pas un autre enchaînement Ici, si 4+2 est attendu, alors 4+2=6 mais 4+2!=5+1. C'est la valeur par défaut
    if (typeof expression.value === 'number') { // L'expression est une expression numérique, les expressions littérales ne sont pas traitées ici
      if (fractionIrreductible) {
        if ((expression.head === 'Divide' || expression.head === 'Rational') && ( // L'expression contient une division ou une fraction fractionIrreductible
          expression.engine.box(['GCD', expression.op1, expression.op2]).value !== 1 || expression.op2.value === 1)) return expression

        if (expression.head === 'Number') { // Ce cas est si un élève note 1.4 pour une fraction de 7/5 par exemple.
          return engine.parse(`\\frac{${expression.value}}{1}`, { canonical: false })
        }
      }
      return expression.engine.number(expression.value)
    }
  } else if (expressionsForcementReduites) {
    // Ici, le traitement n'est fait que pour des expressions forcément réduites
    // Ci-dessous, on accepte que l'enchaînement proposé et pas le résultat. Ici, si 4+2 est attendu, alors4+2!=6 et 4+2!=5+1
    if (
      (expression.head === 'Divide' || expression.head === 'Rational') &&
      typeof expression.value === 'number'
    ) {
      if (fractionIrreductible) {
        if (
          expression.engine.box(['GCD', expression.op1, expression.op2])
            .value !== 1 ||
          expression.op2.value === 1
        ) {
          return expression
        }
      }
      return expression.engine.number(expression.value)
    }
  }
  if (expression.head === 'Divide' || expression.head === 'Rational') {
    // Pour enlever les divisions éventuelles par 1
    if (expression.op2.value === 1) expression = expressionWithHead(expression.op1)
  }
  if (expression.ops) {
    // Pour ne pas accepter les +0, les \\times1, pour ne pas se soucier de l'ordre
    return expression.engine.box(
      [
        expression.head,
        ...expression.ops.map((x) =>
          customCanonical(x, {
            expressionsForcementReduites,
            fractionIrreductible,
            operationSeulementEtNonCalcul,
            nombreDecimalSeulement
          })
        )
      ],
      { canonical: ['InvisibleOperator', 'Order', 'Flatten'] }
    )
  }
  return expression.canonical
}

/**
 * @param {string} input
 * @param {string} goodAnswer
 * @author Eric Elter
 * @return ResultType
 */

function comparaisonFraction (
  input: string,
  goodAnswer: string, {
    fractionReduite = false,
    fractionIrreductible = false,
    fractionDecimale = false,
    fractionEgale = false
  }
  = {}
): ResultType {
  const clean = generateCleaner([
    'virgules',
    // 'fractions'
    'fractionsMemesNegatives'
  ])

  const cleanIput = clean(input)
  const cleanGoodAnswer = clean(goodAnswer)
  const saisieNativeParsed = expressionWithHead(engine.parse(cleanIput, { canonical: false }))
  const reponseNativeParsed = expressionWithHead(engine.parse(cleanGoodAnswer, { canonical: false }))
  const reponseParsed = reponseNativeParsed.engine.number(Number(reponseNativeParsed.value)) // Ici, c'est la valeur numérique (même approchée) de cleanGoodAnswer.
  if (saisieNativeParsed.isEqual(reponseNativeParsed)) {
    if (saisieNativeParsed.head === 'Number' && reponseParsed.isInteger) { // réponse est égale à un entier et saisie est un nombre entier (2) ou décimal (2.0).
      return { isOk: true }
    }
    if (fractionEgale) {
      if (saisieNativeParsed.head === 'Divide' || saisieNativeParsed.head === 'Rational') { // saisie doit être une fraction (ou une division)
        // reponse doit avoir des numérateur/dénominateur multiples de ceux de saisie ou bien fractionReduite est true
        const num = saisieNativeParsed.op1.evaluate().numericValue
        const den = saisieNativeParsed.op2.evaluate().numericValue
        if (Number.isInteger(num) && Number.isInteger(den)) {
          return { isOk: true }
        }
        return { isOk: false, feedback: 'Résultat incorrect car dénominateur et numérateur doivent être entiers.' }
      }
      return { isOk: false, feedback: 'Résultat incorrect car une fraction est attendue' }
    }
    if (fractionDecimale) {
      if ((saisieNativeParsed.head === 'Divide' || saisieNativeParsed.head === 'Rational') &&
        Number.isInteger(Math.log10(Number(saisieNativeParsed.op2.value))) &&
        Math.log10(Number(saisieNativeParsed.op2.value)) >= 0) {
        return { isOk: true }
      }
      return { isOk: false, feedback: 'Résultat incorrect car une fraction décimale est attendue.' } // Sous-entendu : Et pas une autre fraction qu'irréductible
    }
    if (fractionIrreductible) {
      if ((saisieNativeParsed.head === 'Divide' || saisieNativeParsed.head === 'Rational') && (
        saisieNativeParsed.engine.box(['GCD', saisieNativeParsed.op1, saisieNativeParsed.op2]).value === 1)) {
        return { isOk: true }
      }
      return { isOk: false, feedback: 'Résultat incorrect car une fraction irréductible est attendue.' } // Sous-entendu : Et pas une autre fraction qu'irréductible
    }
    if ((saisieNativeParsed.head === 'Divide' || saisieNativeParsed.head === 'Rational') && // saisie doit être une fraction (ou une division)
    Math.abs(Number(saisieNativeParsed.op1.value)) < Math.abs(Number(reponseNativeParsed.op1.value)) && // saisie doit avoir des numérateur/dénominateur plus petits que reponse. Les valeurs absolues gèrent le cas des fractions négatives.
  saisieNativeParsed.op1.isInteger && saisieNativeParsed.op2.isInteger && // saisie doit avoir des numérateur/dénominateur entiers
  (fractionReduite || Number(reponseNativeParsed.op1.value) % Number(saisieNativeParsed.op1.value) === 0)) { // reponse doit avoir des numérateur/dénominateur multiples de ceux de saisie ou bien fractionReduite est true
      return { isOk: true }
      /// Ci-dessous : le traitement des feedback : les saisies sont égales aux réponses mais la saisie ne convient tout de même pas.
    }
    if ((!saisieNativeParsed.op1.value) && (!reponseParsed.isInteger)) { // Si pas de op1.value, c'est que saisie est un nombre alors que reponse n'est pas entier.
      return { isOk: false, feedback: 'Résultat incorrect car une fraction est attendue.' } // Sous-entendu : Et pas un nombre
    }
    if (saisieNativeParsed.head === 'Divide' || saisieNativeParsed.head === 'Rational') {
      if (Math.abs(Number(saisieNativeParsed.op1.value)) >= Math.abs(Number(reponseNativeParsed.op1.value))) {
        return { isOk: false, feedback: 'Résultat incorrect car une fraction simplifiée est attendue.' } // Sous-entendu : Et pas numérateur/dénominateur plus grands ou égaux que reponse.  Les valeurs absolues gèrent le cas des fractions négatives.
      }
      if (!saisieNativeParsed.op1.isInteger || !saisieNativeParsed.op2.isInteger) {
        return { isOk: false, feedback: 'Résultat incorrect car dénominateur et numérateur doivent être entiers.' } // Sous-entendu : Et pas numérateur/dénominateur décimaux pour au moins l'un d'entre eux
      }
      // if (reponseNativeParsed.op1.value % saisieNativeParsed.op1.value !== 0) {
      return { isOk: false, feedback: 'Résultat incorrect car une fraction réduite est attendue.' } // Sous-entendu : Et pas numérateur/dénominateur de reponse non multiples de ceux de saisie
    }
    return { isOk: false, feedback: 'Résultat incorrect car une fraction est attendue.' } // Sous-entendu : Et pas une opération autre qu'une division
  }
  return { isOk: false, feedback: 'Résultat incorrect.' }
}

// Définir le type pour les substitutions
type Substitutions = { [variable: string]: number }

/**
 * Comparaison d'expressions developpées ET REDUITES (multiplications acceptées, fractions acceptées... PAS ENCORE AVEC DES RACINES CARREES mais cela arrive.)
 * Comparaison aussi de tous les nombres (puisque c'est une expression réduite particulière)
 * On peut paramétrer si :
 * - on accepte ou pas les signes multiplier dans ces expressions,
 * - on accepte ou pas les fractions,
 * - on accepte ou pas les fractions irréductibles seulement (ou les entiers si den = 1),
 * - on n'accepte que l'enchaînement de calculs fourni en goodAnswer et non le résultat de cet enchaînement de calculs
 * @param {string} input
 * @param {string} goodAnswer
 * @param {{expressionsForcementReduites:boolean, avecSigneMultiplier:boolean, avecFractions:boolean, fractionIrreducibleSeulement:boolean, nombreDecimalSeulement:boolean, operationSeulementEtNonCalcul:boolean, calculSeulementEtNonOperation:boolean}} [options]
 * @author Eric Elter
 * @return ResultType
 */

function expressionDeveloppeeEtReduiteCompare (
  input: string,
  goodAnswer: string,
  {
    expressionsForcementReduites = true,
    avecSigneMultiplier = true,
    avecFractions = true,
    fractionIrreductible = false,
    nombreDecimalSeulement = false,
    operationSeulementEtNonCalcul = false,
    calculSeulementEtNonOperation = false
  } = {}
): ResultType {
  let feedback = ''
  // Ces 2 lignes sont à améliorer... EE : Faut que je teste un truc... et rajouter les racines carrées aussi
  if (!avecSigneMultiplier && input.includes('times')) return { isOk: false, feedback: 'Aucun signe $\\times$ n\'est autorisé.' }
  if (!avecFractions && input.includes('frac')) return { isOk: false, feedback: 'Aucune fraction n\'est autorisée.' }

  const clean = generateCleaner([
    'puissances',
    'virgules',
    // 'fractions',
    'fractionsMemesNegatives',
    'parentheses',
    'foisUn'
  ])
  const localInput = clean(input)
  const localGoodAnswer = clean(goodAnswer)
  if (nombreDecimalSeulement) {
    const saisieParsed = expressionWithHead(engine.parse(localInput, { canonical: false }))
    if (saisieParsed.head !== 'Number') return { isOk: false, feedback: 'Résultat incorrect car une valeur décimale (ou entière) est attendue.' }
  }
  const saisieParsed = expressionWithHead(customCanonical(
    engine.parse(localInput, { canonical: false }),
    {
      expressionsForcementReduites,
      fractionIrreductible,
      operationSeulementEtNonCalcul,
      nombreDecimalSeulement,
      calculSeulementEtNonOperation
    })
  )
  const reponseParsed = expressionWithHead(customCanonical(
    engine.parse(localGoodAnswer, { canonical: false }),
    {
      expressionsForcementReduites,
      fractionIrreductible,
      operationSeulementEtNonCalcul,
      nombreDecimalSeulement,
      calculSeulementEtNonOperation
    })
  )
  /// Code JCL
  // Ci-dessous, si on a une comparaison fausse mais que l'expression donnée est mathématiquement correcte, on fait un feedback.
  const substitutions: Substitutions = { a: 2, b: 2, c: 2, x: 2, y: 2, z: 2 } // On peut ajouter d'autres variables si nécessaire
  // Ajout d'un test sur goodAnswer pour vérifier la présence de lettres (après avoir retirer les div, times, frac...)
  const adjectif =
    localGoodAnswer
      .replaceAll('div', '')
      .replaceAll('times', '')
      .replaceAll('frac', '')
      .replaceAll('log', '')
      .replaceAll('ln', '')
      .replaceAll('sin', '')
      .replaceAll('cos', '')
      .replaceAll('tan', '')
      .match(/[a-z]/) == null
      ? 'numérique'
      : 'littérale'

  if (saisieParsed.isEqual(reponseParsed) && !(saisieParsed.isSame(reponseParsed))) { // On va essayer de traiter ici tous les feedbacks de façon exhaustive
  // La saisie est égale à la réponse mais il faut vérifier que cela correspond l'option prévue
    if (calculSeulementEtNonOperation) { // L'un peut être décimal et l'autre peut être fractionnaire ou les deux fractionnaires : Ex. 4C10
      if ((saisieParsed.isNumber && reponseParsed.head === 'Divide' && reponseParsed.ops?.length === 2) ||
      (reponseParsed.isNumber && saisieParsed.head === 'Divide' && saisieParsed.ops?.length === 2) ||
      (saisieParsed.head === 'Divide' && saisieParsed.ops?.length === 2 && reponseParsed.head === 'Divide' && reponseParsed.ops?.length === 2)) {
        return { isOk: true, feedback: '' }
      }
    }
  }
  if (!(saisieParsed.isSame(reponseParsed))) { // On va essayer de traiter ici tous les feedbacks de façon exhaustive
    if (calculSeulementEtNonOperation || nombreDecimalSeulement) { // On veut un résultat numérique et pas un enchaînement de calculs
      const saisieCalculeeParsed = customCanonical(
        engine.parse(localInput, { canonical: false }),
        {
          expressionsForcementReduites,
          fractionIrreductible,
          operationSeulementEtNonCalcul,
          nombreDecimalSeulement: false,
          calculSeulementEtNonOperation: false
        }
      )

      if (saisieCalculeeParsed.isSame(reponseParsed)) feedback = 'Résultat incorrect car une valeur numérique est attendue.' // Sous-entendu : Et pas une opération
      else feedback = 'Résultat incorrect.'
    } else if (operationSeulementEtNonCalcul) { // On veut un enchaînement de calculs et pas un résultat numérique
      const saisieCalculeeParsed = customCanonical(
        engine.parse(localInput, { canonical: false }),
        {
          expressionsForcementReduites,
          fractionIrreductible,
          operationSeulementEtNonCalcul: false,
          nombreDecimalSeulement,
          calculSeulementEtNonOperation
        }
      )
      const reponseCalculeeParsed = customCanonical(
        engine.parse(localInput, { canonical: false }),
        {
          expressionsForcementReduites,
          fractionIrreductible,
          operationSeulementEtNonCalcul: false,
          calculSeulementEtNonOperation
        }
      )
      if (saisieCalculeeParsed.isSame(reponseCalculeeParsed)) {
        if (saisieParsed.head === 'Number') feedback = 'Résultat incorrect car un calcul est attendu.' // Sous-entendu : Et pas une valeur numérique
        else feedback = 'Résultat incorrect car ce n\'est pas ce calcul qui est attendu.' // Sous-entendu : La bonne opération
      } else feedback = 'Résultat incorrect.'
    } else if (fractionIrreductible) { // On veut une fraction irréductible
      const saisieCalculeeParsed = customCanonical(
        engine.parse(localInput, { canonical: false }),
        {
          expressionsForcementReduites,
          fractionIrreductible: false,
          operationSeulementEtNonCalcul,
          calculSeulementEtNonOperation
        }
      )
      const reponseCalculeeParsed = customCanonical(
        engine.parse(localInput, { canonical: false }),
        {
          expressionsForcementReduites,
          fractionIrreductible: false,
          operationSeulementEtNonCalcul,
          calculSeulementEtNonOperation
        }
      )
      if (saisieCalculeeParsed.isSame(reponseCalculeeParsed)) {
        // Ci-dessous, ce n'est pas saisieParsed car saisieParsed n'est jamais un nombre à cause de customCanonical et fractionIrreductible.
        if (expressionWithHead(engine.parse(localInput, { canonical: false })).head === 'Number') feedback = 'Résultat incorrect car une fraction est attendue.' // Sous-entendu : Et pas une valeur numérique
        else feedback = 'Résultat incorrect car une fraction irréductible est attendue.' // Sous-entendu : La bonne opération
      } else feedback = 'Résultat incorrect.'
    } else if ( // Code JCL
      !saisieParsed.isSame(reponseParsed) &&
      evaluateExpression(localGoodAnswer, substitutions) ===
        evaluateExpression(localInput, substitutions)
    ) {
      feedback = expressionsForcementReduites
        ? `L'expression ${adjectif} attendue devrait être développée et réduite or ce n'est pas le cas.`
        : `L'expression ${adjectif} attendue devrait être simplement développée or ce n'est pas le cas.`
    }
  }
  return { isOk: saisieParsed.isSame(reponseParsed), feedback }
}

/**
 * Fonction pour évaluer une expression avec des substitutions dynamiques (quelle que soit la lettre utilisée dans substitutions)
 * @param {BoxedExpression} expr
 * @param {Substitutions} substitutions
 * @example evaluateExpression('3x+5', { x: 2}) -> 11
 * @example evaluateExpression('3x+5', { y: 2}) -> NAN
 * @example evaluateExpression('3x+5', { c: 2, x: 2, y: 2}) -> 5
 * @author Eric Elter
 * @return integer||string
 */
function evaluateExpression (
  expr: string,
  substitutions: Substitutions
): number | string {
  // Définir l'expression
  const expression = engine.parse(expr)

  // Faire les substitutions
  let substituted = expression
  for (const [variable, value] of Object.entries(substitutions)) {
    substituted = substituted.subs({ [variable]: value })
  }

  // Évaluer l'expression substituée
  const result = substituted.evaluate().value

  // Convertir le résultat en nombre ou 'NAN' si ce n'est pas un nombre
  if (typeof result === 'number') {
    return result
  }
  return 'NAN'
}
/**
 * comparaison d'expressions developpées NON REDUITES
 * @param {string} input
 * @param {string} goodAnswer
 * @author Eric Elter
 * @return ResultType
 */
export function expressionDeveloppeeEtNonReduiteCompare (
  input: string,
  goodAnswer: string
): ResultType {
  return expressionDeveloppeeEtReduiteCompare(input, goodAnswer, {
    expressionsForcementReduites: false
  })
}

/**
 * comparaison de nombres en écritures scientifiques @todo à vérifier celle-là, j'suis pas convaincu
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote
 */
function scientificCompare (input: string, goodAnswer: string): ResultType {
  const clean = generateCleaner([
    'virgules',
    'espaces',
    'parentheses',
    'puissances'
  ])
  const saisieClean = clean(input)
  const reponseClean = clean(goodAnswer)
  if (
    engine
      .parse(saisieClean)
      .canonical.isSame(engine.parse(reponseClean).canonical)
  ) {
    const [mantisse] = saisieClean.split('\\times')
    if (Number(mantisse) >= 1 && Number(mantisse) < 10) {
      return { isOk: true }
    }
  }
  return { isOk: false }
}

function comparaisonExpressions (expr1: string, expr2: string): ResultType { // Dysfonctionnement de compute-engine : @ArnoG est sur le coup
  // Convertir les équations en MathJSON
  const mathJson1 = engine.parse(expr1) as BoxedExpression
  const mathJson2 = engine.parse(expr2) as BoxedExpression

  return { isOk: mathJson1.isEqual(mathJson2) ?? false }
}

/**
 * comparaison de textes... ben parce qu'il en faut une
 * @param {string} input
 * @param {string} goodAnswer
 * @author Jean-Claude Lhote
 * @return ResultType
 */
function texteAvecCasseCompare (input: string, goodAnswer: string): ResultType {
  const cleaner = generateCleaner(['parentheses', 'mathrm', 'fractions'])
  const localInput = cleaner(input)
  const localGoodAnswer = cleaner(goodAnswer)
  const isOk = localGoodAnswer === localInput
  // Cette commande ci-dessous est mauvaise. Je la laisse pour expliquer pourquoi elle est mauvaise.
  // Autant, elle serait utile pour comparer 'aucun' et 'Aucun'
  // mais elle ne le serait plus pour comparer [AB] et [ab] ce qui serait dommage.
  // return { isOk: input.toLowerCase() === goodAnswer.toLowerCase() }
  return { isOk }
}

/**
 * comparaison de textes avec espaces comme son nom l'indique : avec un nettoyage adapté à la situation
 * Utilise String.localeCompare() pour les spécificités du langage local utilisé.
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote
 */
export function textWithSpacesCompare (
  input: string,
  goodAnswer: string
): ResultType {
  const clean = generateCleaner([
    'virgules',
    'parentheses',
    'latex',
    'doubleEspaces'
  ])
  const localGoodAnswer = clean(goodAnswer)
  const localInput = clean(input)
  const result = localInput.localeCompare(localGoodAnswer)
  return { isOk: result === 0 }
}
/* Cette fonction n'a pas lieu d'exister car elle ne fait pas ce pour quoi elle est prévue.
Une autre fonction fait ce qu'il faut en dessous.
/**
 * comparaison de textes sans s'occuper de la casse.
 * @param {string} input
 * @param {string} goodAnswer
 * @author Jean-Claude Lhote
 * @return ResultType

////////////  -> Mettre etoile /
export function upperCaseCompare (input: string, goodAnswer: string): ResultType {

  // @ToDo supprimer toutes les traces de LaTeX (gestion du - typographique...)
  input = input.replaceAll('\\lparen', '(').replaceAll('\\rparen', ')')
  return { isOk: input.toUpperCase() === goodAnswer.toUpperCase() }
}
*/

/**
 * comparaison de textes sans s'occuper de la casse.
 * @param {string} input
 * @param {string} goodAnswer
 * @author Eric Elter
 * @return ResultType
 */
function texteSansCasseCompare (input: string, goodAnswer: string): ResultType {
  const localInput = input.toLowerCase()
  const localGoodAnswer = goodAnswer.toLowerCase()
  return texteAvecCasseCompare(localInput, localGoodAnswer)
}

/**
 * comparaison de fraction simplifiée
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote
 */
export function simplerFractionCompare (
  input: string,
  goodAnswer: string
): ResultType {
  const cleaner = generateCleaner(['fractions', 'espaces'])
  const localGoodAnswer = cleaner(goodAnswer)
  const goodAnswerParsed = expressionWithHead(engine.parse(localGoodAnswer, { canonical: false }))
  const inputParsed = expressionWithHead(engine.parse(input, { canonical: false }))
  if (inputParsed.head === 'Divide' && goodAnswerParsed.head === 'Divide') {
    const num = (inputParsed.json as [string, number, number])[1] as number
    const numGoodAnswer = (
      goodAnswerParsed.json as [string, number, number]
    )[1] as number
    if (numGoodAnswer == null) {
      throw Error(
        `problème avec ${localGoodAnswer} dans simplerFractionCompare : fReponse.op1.numericValue est nul`
      )
    }
    if (
      inputParsed.isEqual(goodAnswerParsed) &&
      num &&
      num < numGoodAnswer &&
      Number.isInteger(num)
    ) { return { isOk: true } }
  }
  return { isOk: false }
}

/**
 * Comparaison de fraction en acceptant toute valeur (y compris la valeur décimale) mais n'acceptant de racine carrée au dénominateur
 * @param {string} input
 * @param {string} goodAnswer
 * @author Eric Elter
 * @return ResultType
 */
export function equalFractionCompareSansRadical (
  input: string,
  goodAnswer: string
): ResultType {
  const cleaner = generateCleaner(['fractions'])
  const localInput = cleaner(input)
  const localGoodAnswer = cleaner(goodAnswer)

  // Utilisation d'une expression régulière pour extraire le contenu de la deuxième accolade
  const contenuDeuxiemeAccolade: string | null =
    localInput.match(/\\frac{[^}]*}{(\\sqrt[^}]*)/)?.[1] || null

  // if (contenuDeuxiemeAccolade === null) return { isOk: equalFractionCompare(input, goodAnswer).isOk }
  // else if (!contenuDeuxiemeAccolade.includes('sqrt')) return { isOk: equalFractionCompare(input, goodAnswer).isOk }
  if (contenuDeuxiemeAccolade === null) { return { isOk: fonctionComparaison(localInput, localGoodAnswer).isOk } }
  if (!contenuDeuxiemeAccolade.includes('sqrt')) { return { isOk: fonctionComparaison(localInput, localGoodAnswer).isOk } }
  return { isOk: false }
}

/**
 * comparaison d'expression de puissances
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote
 */
function powerCompare (input: string, goodAnswer: string): ResultType {
  const clean = generateCleaner(['virgules', 'puissances'])
  let formatOK = false
  let formatKO = false
  const nombreSaisi = clean(input).split('^')
  const mantisseSaisie = nombreSaisi[0].replace(/\\lparen(.*?)\\rparen/g, '$1')
  // const mantisseS = Number(mantisseSaisie)
  const expoSaisi = nombreSaisi[1] ? nombreSaisi[1].replace(/[{}]/g, '') : '1'
  // const expoS = Number(expoSaisi)
  const nombreAttendu = clean(goodAnswer).split('^')
  if (nombreAttendu.length !== 2) {
    console.error('Erreur dans la réponse attendue : un string avec ^ est attendu')
    if (!Number.isNaN(goodAnswer)) {
      const reponse = Number(goodAnswer)
      if (Number(mantisseSaisie) ** Number(expoSaisi) === reponse) {
        return { isOk: true }
      }
      return { isOk: false }
    }
    return { isOk: false }
  }
  const mantisseReponse = nombreAttendu[0].replace(/[()]/g, '')
  const mantisseR = Number(mantisseReponse)
  const expoReponse = nombreAttendu[1]
    ? nombreAttendu[1].replace(/[{}]/g, '')
    : '1'
  const expoR = Number(expoReponse)
  if (input.indexOf('^') !== -1) {
    if (mantisseReponse === mantisseSaisie && expoReponse === expoSaisi) {
      formatOK = true
    }
    // gérer le cas mantisse négative a et exposant impair e, -a^e est correct mais pas du format attendu
    // si la mantisse attendue est négative on nettoie la chaine des parenthèses
    if (mantisseR < 0 && expoR % 2 === 1) {
      if (
        input === `${mantisseReponse}^{${expoReponse}}` ||
          input === `${mantisseReponse}^${expoReponse}`
      ) {
        formatKO = true
      }
    }
    // si l'exposant est négatif, il se peut qu'on ait une puissance au dénominateur
    if (expoR < 0) {
      // Si la mantisse est positive
      if (
        input === `\\frac{1}{${mantisseR}^{${-expoR}}` ||
          input === `\\frac{1}{${mantisseR}^${-expoR}}`
      ) {
        formatKO = true
      }
    }
  } else {
    // Dans tous ces cas on est sûr que le format n'est pas bon
    // Toutefois la valeur peut l'être donc on vérifie
    if (expoR < 0) {
      // Si la mantisse est positive
      if (nombreSaisi[0] === `\\frac{1}{${mantisseR ** -expoR}}`) {
        formatKO = true
      }
      // Si elle est négative, le signe - peut être devant la fraction ou au numérateur  ou au dénominateur
      if (mantisseR < 0 && -expoR % 2 === 1) {
        if (
          nombreSaisi[0] === `-\\frac{1}{${(-mantisseR) ** -expoR}}` ||
            nombreSaisi[0] === `\\frac{-1}{${(-mantisseR) ** -expoR}}` ||
            nombreSaisi[0] === `\\frac{1}{-${(-mantisseR) ** -expoR}}`
        ) {
          formatKO = true
        }
      }
    } else if (expoR > 0) {
      if (nombreSaisi[0] === `${mantisseR ** expoR}`) {
        if (expoR !== 1) formatKO = true
        else formatOK = true // Au cas où l'exposant soit 1
      }
    }
    if (expoR === 0) {
      if (nombreSaisi[0] === '1') {
        formatKO = true
      }
    }
  }
  if (formatOK) {
    return { isOk: true }
  }
  if (formatKO) return { isOk: false, feedback: 'essaieEncorePuissance' }

  return { isOk: false }
}

/**
 * Comparaison d'ensembles de solutions séparés par des ; dans des {} comme {-5;4;10}
 * Si kUplet = true, alors les nombres de l'usager devront être rangés par ordre croissant. Sinon non importance de l'ordre des nombres
 * Mise en place de feedback
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Eric Elter
 */
export function ensembleNombres (input: string, goodAnswer: string, {
  kUplet = false, avecAccolades = true
}
= {}): ResultType {
  const clean = generateCleaner(['virgules', 'fractions', 'parentheses'])
  const cleanInput = clean(input)
  if (goodAnswer === '\\emptyset' && cleanInput === goodAnswer) return { isOk: true }
  if (goodAnswer === '\\emptyset' && cleanInput.includes('\\emptyset')) return { isOk: false, feedback: 'Résultat incorrect car $\\emptyset doit être écrit seul.' }
  let splitInput: string[]
  let splitGoodAnswer: string[]
  if (avecAccolades) {
    if (cleanInput[1] !== '{') return { isOk: false, feedback: 'Résultat incorrect car cet ensemble doit commencer par une accolade.' }
    if (cleanInput[cleanInput.length - 1] !== '}') return { isOk: false, feedback: 'Résultat incorrect car cet ensemble doit se terminer par une accolade.' }
    splitInput = cleanInput.replaceAll('\\{', '').replaceAll('\\}', '').split(';')
    splitGoodAnswer = clean(goodAnswer).replaceAll('\\{', '').replaceAll('\\}', '').split(';')
  } else {
    splitInput = cleanInput.split(';')
    splitGoodAnswer = clean(goodAnswer).split(';')
  }

  // Pour vérifier la présence de doublons
  if (new Set(splitInput).size !== splitInput.length) return { isOk: false, feedback: 'Résultat incorrect car cet ensemble contient des valeurs redondantes.' }

  // Pour vérifier si les tableaux sont de la même taille
  if (splitInput.length > splitGoodAnswer.length) {
    return { isOk: false, feedback: 'Résultat incorrect car cet ensemble contient trop de nombres.' }
  }
  if (splitInput.length < splitGoodAnswer.length) {
    return { isOk: false, feedback: 'Résultat incorrect car cet ensemble ne contient pas assez de nombres.' }
  }

  const inputSorted = splitInput
  const goodAnswerSorted = splitGoodAnswer

  const AllExist = inputSorted.every(value => {
    for (let index = 0; index < goodAnswerSorted.length; index++) {
      if (engine.parse(value).isSame(engine.parse(goodAnswerSorted[index]))) {
        return true // L'élément est trouvé
      }
    }
    return false // L'élément n'est pas trouvé
  })

  if (!AllExist) {
    return { isOk: false, feedback: 'Résultat incorrect car cet ensemble n\'a pas toutes les valeurs attendues.' }
  }
  if (kUplet && !(splitInput.every((value, index) => engine.parse(value).isSame(engine.parse(goodAnswerSorted[index]))))) {
    return { isOk: false, feedback: 'Résultat incorrect car les nombres ne sont pas rangés dans le bon ordre.' }
  }
  return { isOk: true }
}

/**
 * La fonction de comparaison des intervalles pour l'interactif
 * @param {string} input
 * @param {string} goodAnswer
 * @author Jean-Claude Lhote
 */
function intervalsCompare (input: string, goodAnswer: string) {
  const clean = generateCleaner(['virgules', 'parentheses', 'espaces'])
  const localInput = clean(input)
  const localGoodAnswer = clean(goodAnswer)
  let isOk1 = true
  let isOk2 = true
  let feedback = ''
  const extractBornesAndOp = /[^[\];]+/g
  const extractCrochets = /[[\]]/g
  const borneAndOpSaisie = localInput.match(extractBornesAndOp)
  const borneAndOpReponse = localGoodAnswer.match(extractBornesAndOp)
  const crochetsSaisie = localInput.match(extractCrochets)
  const crochetsReponse = localGoodAnswer.match(extractCrochets)
  // console.log(localInput, localGoodAnswer, borneAndOpSaisie, borneAndOpReponse)
  if (
    borneAndOpSaisie != null &&
    borneAndOpReponse != null &&
    crochetsSaisie != null &&
    crochetsReponse != null
  ) {
    if (borneAndOpSaisie.length !== borneAndOpReponse.length) {
      return { isOk: false }
    }
    // On teste les bornes et les opérateurs
    let i: number
    isOk1 = true
    for (i = 0; i < borneAndOpSaisie.length; i++) {
      isOk1 &&= fonctionComparaison(
        borneAndOpSaisie[i],
        borneAndOpReponse[i]
      ).isOk
      if (!isOk1) {
        feedback += ['\\cup', '\\cap'].includes(borneAndOpSaisie[i])
          ? `Il y a une erreur avec l'opérateur : $${borneAndOpSaisie[i]}$.<br>`
          : `Il y a une erreur avec la valeur : $${borneAndOpSaisie[i]}$.<br>`
      }
    }
    // on teste maintenant les crochets
    isOk2 = crochetsSaisie.length === crochetsReponse.length
    if (!isOk2) {
      feedback += 'Il y a une erreur avec les crochets.'
    }
    if (isOk2) {
      for (i = 0; i < crochetsSaisie.length; i++) {
        isOk2 = crochetsSaisie[i] === crochetsReponse[i] && isOk2
        if (crochetsSaisie[i] !== crochetsReponse[i]) { feedback += `Le crochet placé en position ${i + 1} est mal orienté.<br>` }
      }
    }
    return { isOk: isOk1 && isOk2, feedback }
  }
  return {
    isOk: false,
    feedback: "Il faut donner un intervalle ou une réunion d'intervalles"
  }
}

/**
 * Comparaison de chaînes (principalement des noms de classes
 * @param {string} input ce que saisit l'élève
 * @param {{pluriels: boolean}} [options]
 * @param {{value: string, nombre:boolean}} goodAnswer value est ce qui est attendu, si nombre est true, on compte faux l'absence de s quand il en faut un et la présence de s quand il n'y en a pas besoin
 * si pluriels est false, on compte juste une réponse au pluriel ou au singulier quelque soit la réponse attendue, mais on met un feedback si le pluriel ou le singulier n'est pas respecté
 * @author Jean-Claude Lhote
 */
export function numerationCompare (
  input: string,
  goodAnswer: string,
  { pluriels = true } = {}
): ResultType {
  // normalement, il n'y a rien à nettoyer au niveau de l'input ou de goodAnswer
  const clean = generateCleaner(['latex'])
  const saisie: string[] = clean(input).toLowerCase().split(' ')
  const answer: string[] = goodAnswer.toLowerCase().split(' ')
  let result: boolean
  let feedback = ''
  if (pluriels) {
    result = true
    for (let i = 0; i < answer.length; i++) {
      result = result && saisie[i] === answer[i]
      if (!result) {
        if (saisie[i].endsWith('s') && !answer[i].endsWith('s')) {
          if (saisie[i].substring(0, saisie[i].length - 1) === answer[i]) {
            feedback = `${saisie[i]} est au pluriel alors qu'il faut le mettre au singulier.<br>`
          }
        } else if (!saisie[i].endsWith('s') && answer[i].endsWith('s')) {
          if (saisie[i] === answer[i].substring(0, answer[i].length - 1)) {
            feedback = `${saisie[i]} est au singulier alors qu'il faut le mettre au pluriel.<br>`
          }
        }
      }
      if (!result) break
    }
  } else {
    // ici on tolère singulier ou pluriel
    // On regarde quand même si le singulier/pluriel est respecté pour le feedback
    result = true
    for (let i = 0; i < answer.length; i++) {
      if (saisie[i].endsWith('s') && !answer[i].endsWith('s')) {
        if (saisie[i].substring(0, saisie[i].length - 1) === answer[i]) {
          feedback = `${saisie[i]} est au pluriel alors qu'il faut le mettre au singulier.<br>`
        }
      } else if (!saisie[i].endsWith('s') && answer[i].endsWith('s')) {
        if (saisie[i] === answer[i].substring(0, answer[i].length - 1)) {
          feedback = `${saisie[i]} est au singulier alors qu'il faut le mettre au pluriel.<br>`
        }
      }
      // on vire le 's' final éventuel
      if (saisie[i].endsWith('s')) { saisie[i] = saisie[i].substring(0, saisie[i].length - 1) }
      if (answer[i].endsWith('s')) { answer[i] = answer[i].substring(0, answer[i].length - 1) }
      result = result && saisie[i] === answer[i]
    }
    if (!result) feedback = '' // c'est pas bon, on se fout du feedback
  }
  return { isOk: result, feedback }
}

/**
 * comparaison de grandeurs avec une unité
 * @param {string} input
 * @param {string} goodAnswer
 * @param {{precision: number }} [options]
 * @return ResultType
 * @author Jean-Claude Lhote
 */
function unitsCompare (
  input: string,
  goodAnswer: string,
  { precision = 1 } = {}
): {
  isOk: boolean
  feedback?: string
} {
  const localInput = input.replace('^\\circ', '°').replace('\\degree', '°')
  const cleaner = generateCleaner([
    'virgules',
    'espaces',
    'fractions',
    'parentheses',
    'mathrm'
  ])
  const inputGrandeur = inputToGrandeur(cleaner(localInput))
  const goodAnswerGrandeur = Grandeur.fromString(
    cleaner(goodAnswer).replace('^\\circ', '°').replace('\\degree', '°')
  )
  if (inputGrandeur) {
    if (
      inputGrandeur.uniteDeReference !== goodAnswerGrandeur.uniteDeReference
    ) {
      return {
        isOk: false,
        feedback: `Il faut donner la réponse en $${goodAnswerGrandeur.latexUnit}$.`
      }
    }
    if (precision !== undefined) {
      if (inputGrandeur.estUneApproximation(goodAnswerGrandeur, precision)) {
        return { isOk: true }
      }
      return { isOk: false }
    }
    if (inputGrandeur.estEgal(goodAnswerGrandeur)) {
      return { isOk: true }
    }
    return { isOk: false }
  }
  // Oubli de l'unité ?
  const inputNumber = Number(engine.parse(cleaner(input)))
  const inputWithAddedUnit = new Grandeur(inputNumber, goodAnswerGrandeur.unite)
  if (inputWithAddedUnit.estEgal(goodAnswerGrandeur)) {
    return {
      isOk: false,
      feedback:
        "La réponse est correcte mais tu as oublié de préciser l'unité."
    }
  }
  if (inputNumber !== 0) {
    return {
      isOk: false,
      feedback: "La réponse est fausse et il faut saisir l'unité."
    }
  }
  return { isOk: false }
}

/**
 * vérifie qu'une valeur saisie est dans un intervalle strict
 * @param {string} input
 * @param {string} goodAnswer Un intervalle par exemple ]-5.5;2]
 * @return ResultType
 * @author Jean-Claude Lhote
 */
function intervalCompare (
  input: string,
  goodAnswer: string
): {
  isOk: boolean
  feedback?: string
} {
  let strictGauche = true
  let strictDroit = true
  if (goodAnswer.startsWith('[')) strictGauche = false
  if (goodAnswer.endsWith(']')) strictDroit = false
  const bornes = goodAnswer.match(/[[\]](.+);(.+)[[\]]/)
  if (bornes == null) {
    window.notify("Il faut revoir la définition de l'intervalle ", {
      goodAnswer
    })
    return { isOk: false, feedback: 'Un problème avec goodAnswer !' }
  }
  const clean = generateCleaner(['virgules', 'fractions', 'espaces'])
  const borneInf = Number(engine.parse(clean(bornes[1])).N())
  const borneSup = Number(engine.parse(clean(bornes[2])).N())
  const inputNumber = Number(engine.parse(clean(input)).N())
  // @todo vérifier que l'élève a bien saisi un nombre
  if (Number.isNaN(inputNumber)) return { isOk: false }
  const okGauche = strictGauche
    ? inputNumber > borneInf
    : inputNumber >= borneInf
  const okDroit = strictDroit ? inputNumber < borneSup : inputNumber <= borneSup
  return { isOk: okGauche && okDroit }
}

/**
 * comparaison de nombres entiers consécutifs
 * Cette fonction sert essentiellement pour le feedback dans des exercices de comparaison car elle prend pour l'instant un encadrement sous la forme a<b<c ou a>b>c
 * Exercices d'exemple : 6N20-1 et 6N20-3
 * Peut-être en faire une variation pour vérifier des inégalités ?
 * @param {string} input
 * @param {string} goodAnswer
 * @author Jean-Claude Lhote
 * @return ResultType
 */
export function consecutiveCompare (
  input: string,
  goodAnswer: string
): ResultType {
  let feedback = ''
  const [entierInf, valeurInter, entierSup] = input.includes('<')
    ? input.split('<').map((el) => Number(engine.parse(el).numericValue))
    : input
      .split('>')
      .map((el) => Number(engine.parse(el).numericValue))
      .sort((a: number, b: number) => a - b)
  if (
    !(
      Number.isInteger(Number(entierSup)) && Number.isInteger(Number(entierInf))
    )
  ) {
    feedback = 'On attend comme réponse deux nombres entiers.'
    return { isOk: false, feedback }
  }
  const [goodAnswerEntierInf, , goodAnswerEntierSup] = goodAnswer.includes('<')
    ? goodAnswer.split('<').map((el) => Number(engine.parse(el).numericValue))
    : goodAnswer
      .split('>')
      .map((el) => Number(engine.parse(el).numericValue))
      .sort((a: number, b: number) => a - b)
  const diff = Number(
    engine.box(['Subtract', String(entierSup), String(entierInf)]).N()
      .numericValue
  )
  if (diff === -1) {
    feedback =
      "Les nombres sont bien deux entiers consécutifs, mais ils sont donnés dans l'ordre inverse."
    return { isOk: false, feedback }
  }
  if (diff !== 1) {
    return {
      isOk: false,
      feedback: 'Les deux nombres entiers donnés ne sont pas consécutifs.'
    }
  }
  if (valeurInter != null) {
    const diff1 = Number(
      engine.box(['Subtract', String(entierSup), String(valeurInter)]).N()
        .numericValue
    )
    const diff2 = Number(
      engine.box(['Subtract', String(valeurInter), String(entierInf)]).N()
        .numericValue
    )
    if (
      !(
        diff1 != null &&
        diff2 != null &&
        diff1 < 1 &&
        diff1 >= 0 &&
        diff2 < 1 &&
        diff2 >= 0
      )
    ) {
      return {
        isOk: false,
        feedback: `Les deux nombres entiers sont biens consécutifs mais n'encadrent pas la valeur ${valeurInter}`
      }
    }
  }
  const isOk1 = true
  const isOk2 =
    expressionDeveloppeeEtReduiteCompare(
      String(entierInf),
      String(goodAnswerEntierInf)
    ).isOk &&
    expressionDeveloppeeEtReduiteCompare(
      String(entierSup),
      String(goodAnswerEntierSup)
    ).isOk
  return { isOk: isOk1 && isOk2, feedback: '' }
}

/**
 * Compare deux nombres avec une certaine tolérance
 * Exercice exemple : 5N11-4
 * @param {string} input
 * @param { string} goodAnswer
 * @param {{tolerance: number}} [options]
 * @author Jean-Claude Lhote
 */
export function approximatelyCompare (
  input: string,
  goodAnswer: string,
  { tolerance = 0.1 } = {}
) {
  const cleaner = generateCleaner([
    'virgules',
    'fractions',
    'espaces',
    'parentheses',
    'puissances'
  ])
  const saisieClean = Number(engine.parse(cleaner(input)).numericValue)
  const answerClean = Number(engine.parse(cleaner(goodAnswer)).numericValue)
  return { isOk: Math.abs(saisieClean - answerClean) < tolerance }
}

/**
 * Comparaison de fonction f(x)
 * @param {string} input
 * @param {{ variable: string, domaine: [number, number]}} [options]
 * @param {string} goodAnswer
 * @author Jean-Claude Lhote
 */
export function functionCompare (
  input: string,
  goodAnswer: string,
  { variable = 'x', domaine = [-100, 100] } = {}
): ResultType {
  const clean = generateCleaner([
    'virgules',
    'parentheses',
    'fractions',
    'divisions'
  ])
  const cleanInput = clean(input)
  const inputParsed = engine.parse(cleanInput)
  const inputFn = inputParsed.compile()
  const cleanAnswer = clean(goodAnswer)
  const goodAnswerFn = engine.parse(cleanAnswer).compile()
  const min = domaine[0]
  const max = domaine[1]
  const range = max - min
  const valAlea = () => min + range * Math.random()
  if (inputFn == null || goodAnswerFn == null) {
    throw Error(
      `functionCompare : La saisie ou la bonne réponse ne sont pas des fonctions (saisie : ${input} et réponse attendue : ${goodAnswer}`
    )
  }
  let a: number
  let b: number
  let c: number
  let variablea: object
  let variableb: object
  let variablec: object
  do {
    [a, b, c] = [valAlea(), valAlea(), valAlea()]
    variablea = Object.fromEntries([[variable ?? 'x', a]])
    variableb = Object.fromEntries([[variable ?? 'x', b]])
    variablec = Object.fromEntries([[variable ?? 'x', c]])
  } while (
    Number.isNaN(goodAnswerFn(variablea)) ||
    Number.isNaN(goodAnswerFn(variableb)) ||
    Number.isNaN(goodAnswerFn(variablec))
  )
  let isOk = true
  for (const x of [a, b, c]) {
    const vars = Object.fromEntries([[variable ?? 'x', x]])
    const y1 = inputFn(vars)
    const y2 = goodAnswerFn(vars)
    isOk = isOk && Math.abs(y1 - y2) < 1e-10
  }
  return { isOk }
}

/*
 * Comparaison de fonction f(x,y) (ou tout autre variable) x et y étant les lettres par défaut
 * @param {string} input
 * @param {string} goodAnswer
 * @param {{variables: string[]}} [options]
 * @author Jean-Claude Lhote
 *
export function functionXyCompare (input: string, goodAnswer: string, { variables = ['x', 'y'] } = { }): ResultType {
  const clean = generateCleaner(['espaces', 'virgules', 'parentheses', 'fractions', 'divisions'])
  // Pour l'instant les fonctions trigo saisies au clavier ne sont pas les fonction trigo latex.
  const cleanInput = clean(input)
  const inputParsed = engine.parse(cleanInput)

  const inputFn = inputParsed.compile()
  const cleanAnswer = clean(goodAnswer)
  const goodAnswerFn = engine.parse(cleanAnswer).compile()

  let isOk = true
  if (inputFn == null || goodAnswerFn == null) throw Error(`functionCompare : La saisie ou la bonne réponse ne sont pas des fonctions (saisie : ${input} et réponse attendue : ${goodAnswer}`)
  const [a, b, c] = [Math.random(), Math.random(), Math.random()]
  const [A, B, C] = [Math.random(), Math.random(), Math.random()]
  for (const x of [a, b, c]) {
    for (const y of [A, B, C]) {
      const vars = Object.fromEntries([[variables[0], x], [variables[1], y]])
      isOk = isOk && Math.abs(inputFn(vars) - goodAnswerFn(vars)) < 1e-10
    }
  }
  return { isOk }
} */

/*
 * Comparaison d'égalités (pour l'instant strictement égal, il est prévu d'implémenter l'équivalence d'égalités)
 * @param {string} input
 * @param {string} goodAnswer
 * @param {{membre1Variable?: string, membre2Variable?: string, strict?: boolean, domaine: [number, number]}} [options]
 * @author Jean-Claude Lhote
 *
export function equalityCompare (input: string, goodAnswer: string, { membre1Variable = 'x', membre2Variable = 'x', strict = true, domaine = [-100, 100] } = {}):ResultType {
  const [m1, m2] = input.split('=')
  const [goodAnswerMb1, goodAnswerMb2] = goodAnswer.split('=')
  if (m1 == null || m2 == null) return { isOk: false, feedback: 'Une égalité est attendue' }
  if (strict) {
    const { isOk: isOk1 } = functionCompare(m1, goodAnswerMb1, { variable: membre1Variable ?? 'x', domaine })
    const { isOk: isOk2 } = functionCompare(m2, goodAnswerMb2, { variable: membre2Variable ?? 'x', domaine })
    return { isOk: isOk1 && isOk2 }
  } else {
    // @todo à implémenter : permettre de saisir une égalité et de vérifier l'équivalence avec celle proposée comme bonne réponse.
    // En attendant, je recopie le code de strict = true
    const { isOk: isOk1 } = functionCompare(m1, goodAnswerMb1, { variable: membre1Variable ?? 'x', domaine })
    const { isOk: isOk2 } = functionCompare(m2, goodAnswerMb2, { variable: membre2Variable ?? 'x', domaine })
    return {
      isOk: isOk1 && isOk2,
      feedback: ''
    }
  }
} */

/**
 * Comparaison d'égalités (pour les équations de droites ou d'autres égalités comme dans can2L11 ou can1a-2024-Q14)
 * @param {string} input
 * @param {string} goodAnswer
 * @author Eric Elter
 */
export function egaliteCompare (input: string, goodAnswer: string): ResultType {
  const [m1, m2] = input.split('=')
  const [goodAnswerMb1, goodAnswerMb2] = goodAnswer.split('=')
  if (m1 == null || m2 == null) { return { isOk: false, feedback: 'Une égalité est attendue' } }

  const { isOk: isOk1 } = fonctionComparaison(m2, goodAnswerMb1)
  const { isOk: isOk2 } = fonctionComparaison(m1, goodAnswerMb1)
  const { isOk: isOk3 } = fonctionComparaison(m2, goodAnswerMb2)
  const { isOk: isOk4 } = fonctionComparaison(m1, goodAnswerMb2)
  return { isOk: (isOk1 && isOk4) || (isOk3 && isOk2) }
}

/**
 * Comparaison de nombres avec les espaces exigés
 * @param {string} input
 * @param {string} goodAnswer
 * @author Rémi Angot
 */
export function numberWithSpaceCompare (
  input: string,
  goodAnswer: string
): ResultType {
  let inputCleanFirst = input.replaceAll(/(\s{2,})(?=\d{3})/g, ' ').trim() // EE : l'élève peut avoir un saisi un espace avant ou après le nombre et avoir saisi des doubles espaces sans qu'on lui en tienne rigueur tant qu'ils séparent bien les classes, évidemment.
  inputCleanFirst = inputCleanFirst.replaceAll(/\\,/g, ' ') // EE : Permet à input que les espaces ressemblent uniquement à ' ' et non à '\,'.
  const clean = generateCleaner(['espaces'])
  const inputClean = clean(input)
  const goodAnswerClean = clean(goodAnswer)
  const goodAnswerNew = goodAnswer.replaceAll(/\\,/g, ' ') // EE : Permet à goodAnswer que les espaces ressemblent uniquement à ' ' et non à '\,'.
  let feedback = ''
  if (inputCleanFirst !== goodAnswerNew && inputClean === goodAnswerClean) {
    feedback = 'Le nombre est mal écrit, il faut faire attention aux espaces.'
  }
  return { isOk: inputCleanFirst === goodAnswerNew, feedback }
}

export function exprCompare (
  input: string,
  goodAnswer: string,
  { noUselessParen = false }
): ResultType {
  const clean = generateCleaner([
    'virgules',
    'parentheses',
    'divisions',
    'fractions',
    'puissances',
    'fractions',
    'mathrm'
  ])
  const inputClean = clean(input) ?? ''
  const answerClean = clean(goodAnswer) ?? ''
  let feedback = ''
  let isOk = true
  const nbParenInput = inputClean.match(/([[()\]])/g)?.length
  const nbParenAnswer = answerClean.match(/([[()\]])/g)?.length
  const numbersInput = inputClean
    .match(/\d+/g)
    ?.sort((a, b) => Number(a) - Number(b))
  const numbersAnswer = answerClean
    .match(/\d+/g)
    ?.sort((a, b) => Number(a) - Number(b))
  const opsInput = inputClean
    .match(/[+\-/*]|(times)|(div)|(frac)/g)
    ?.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
  const opsAnswer = answerClean
    .match(/[+\-/*]|(times)|(div)|(frac)/g)
    ?.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
  const isOk1 = nbParenAnswer === nbParenInput // doit être true si noUselessParen est true
  const isOk2 =
    numbersInput != null &&
    numbersAnswer != null &&
    areSameArray(numbersInput, numbersAnswer) // doit être obligatoirement true
  const isOk3 =
    opsInput != null && opsAnswer != null && areSameArray(opsInput, opsAnswer) // doit obligatoirement être true
  const isOk4 = engine
    .parse(inputClean)
    .isEqual(engine.parse(clean(goodAnswer))) // doit obligatoirement être true
  if (noUselessParen && inputClean != null && answerClean !== null) {
    isOk = (isOk1 && isOk2 && isOk3 && isOk4) ?? false
    if (!isOk1 && isOk4) {
      feedback =
        "L'expression donne le bon résultat mais n'a pas la forme attendue."
    }
  } else {
    isOk = (isOk2 && isOk3 && isOk4) ?? false
    if (!isOk) {
      if (!isOk4) {
        feedback = "L'expression ne donne pas le bon résultat."
      } else if (!isOk3) {
        feedback = "L'expression ne contient pas les bonnes opérations."
      } else {
        feedback = "L'expression ne contient pas les bons nombres."
      }
    }
  }
  return { isOk, feedback }
}

export function checkLeCompteEstBon ( // Ne fonctionne que si numbers est un tableau de nombres POSITIFS.
  input: string,
  numbers: number[],
  target: number,
  quatreOperationsObligatoires:boolean
): ResultType {
  const clean = generateCleaner([
    'virgules',
    'parentheses',
    'fractions',
    'divisions'
  ])
  const inputClean = clean(input)

  // At first, check that the value of the expression is correct
  const answer = engine.parse(inputClean, { canonical: false }) as BoxedExpression
  const value = answer.value
  if (value !== target) { return { isOk: false, feedback: `L'expression vaut ${value} et non ${target}.` } }

  // Count each operator
  let addCount = 0
  let multiplyCount = 0
  let divideCount = 0
  let subtractCount = 0

  let tropDeNombres = false
  let nombresEnDoublon = false
  let mauvaisNombre = false
  let symboleNonAutorise = false
  let operationNonAutorisee = false

  const listeNombresEnonce = [...numbers]
  const visit: (node: BoxedExpressionWithHead) => void = (node) => {
    if (node.numericValue !== null) {
      if (listeNombresEnonce.length === 0) {
        if (numbers.includes(Math.abs(Number(node.value)))) { // abs obligatoire car sinon, poir 5-3, il tente de chercher -3.
          nombresEnDoublon = true
          return 'Au moins un nombre en doublon'
        }
        tropDeNombres = true
        return 'Au moins un nombre en trop'
      }
      if (listeNombresEnonce.includes(Math.abs(Number(node.value)))) {
        // J'enlève cet élément de la liste
        listeNombresEnonce.splice(listeNombresEnonce.indexOf(Math.abs(Number(node.value))), 1)
      } else {
        mauvaisNombre = true
        return 'Au moins un mauvais nombre parmi ceux proposés'
      }
    }

    if (node.symbol) {
      symboleNonAutorise = true
      return 'L\'expression contient un symbole non autorisé.'
    }
    if (node.head) {
      if (node.head !== 'Number' && node.head !== 'Delimiter') {
        switch (node.head) {
          case 'Add':
            addCount++
            break
          case 'Multiply':
            multiplyCount++
            break
          case 'Divide':
            divideCount++
            break
          case 'Subtract':
            subtractCount++
            break
          default:
            operationNonAutorisee = true
        }
      }
      if (node.ops !== null) {
        for (const op of node.ops) { visit(expressionWithHead(op)) }
      } else return ('OK')
    }
  }

  visit(expressionWithHead(answer))
  if (tropDeNombres) return { isOk: false, feedback: 'L\'expression utilise plus de nombres que demandés.' }
  if (nombresEnDoublon) return { isOk: false, feedback: 'L\'expression utilise plusieurs fois un même nombre parmi ceux proposés.' }
  if (mauvaisNombre) return { isOk: false, feedback: 'L\'expression utilise au moins un nombre non autorisé.' }
  if (symboleNonAutorise) return { isOk: false, feedback: 'L\'expression contient un symbole non autorisé.' }
  if (operationNonAutorisee) return { isOk: false, feedback: 'L\'expression de doit contenir que des additions, des soustractions, des multiplications, des divisions ou des parenthèses.' }
  if (quatreOperationsObligatoires && !(addCount === 1 && divideCount === 1 && subtractCount === 1 && multiplyCount === 1)) return { isOk: false, feedback: 'L\'expression doit contenir une addition, une soustraction, une multiplication et une division.' }

  return { isOk: true, feedback: '' } // L'expression est correcte.
}
