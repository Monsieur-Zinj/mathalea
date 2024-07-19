import { ComputeEngine, type BoxedExpression, type Parser, type LatexDictionaryEntry } from '@cortex-js/compute-engine'
// import FractionEtendue from '../../modules/FractionEtendue'
import Grandeur from '../../modules/Grandeur'
import Hms from '../../modules/Hms'
// import { texFractionFromString } from '../outils/deprecatedFractions'
import type { Expression } from 'mathlive'
import type { ParserOptions } from 'svelte/types/compiler/interfaces'
import { areSameArray } from '../outils/arrayOutils'

const engine = new ComputeEngine()
export default engine

export type ResultType = {isOk: boolean, feedback?: string}
export type OptionsComparaisonType = {
  expressionsForcementReduites?: boolean,
    avecSigneMultiplier?: boolean,
  avecFractions?: boolean,
  fractionIrreductibleSeulement?: boolean,
  operationSeulementEtNonCalcul?: boolean,
  HMS?: boolean,
  intervalle?: boolean,
  estDansIntervalle?: boolean,
  ecritureScientifique?: boolean,
  unite?: boolean,
  precisionUnite?: number,
  puissance?: boolean,
  texteAvecCasse?: boolean,
  texteSansCasse?: boolean,
  nombreAvecEspace?: boolean,
  fractionIdentique?: boolean,
  egaliteExpression?: boolean,
  noUselessParen?: boolean
}
export type CompareFunction = (input: string, goodAnswer:string, options: OptionsComparaisonType) => ResultType

type CleaningOperation = 'fractions' | 'virgules' | 'espaces' | 'parentheses' | 'puissances' | 'divisions' | 'latex' | 'foisUn' | 'unites' | 'doubleEspaces'| 'mathrm'

/**
 * Nettoie la saisie des \\dfrac en les remplaçant par des \frac comprises par ComputeEngine
 * @param {string} str
 */
function cleanFractions (str: string): string {
  return str.replaceAll(/dfrac/g, 'frac')
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
  while (str.includes('  ')) {
    str = str.replace('  ', ' ')
  }
  if (str[0] === ' ') str = str.substring(1, str.length)
  if (str[str.length - 1] === ' ') str = str.substring(0, str.length - 1)
  return str
}

/**
 * Nettoie les parenthèses en remplaçant par celles supportées par le ComputeEngine
 * @param {string} str
 */
function cleanParenthses (str: string): string {
  return str.replaceAll(/\\lparen(\+?-?\d+,?\.?\d*)\\rparen/g, '($1)')
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
  return str.replaceAll('²', '^2') // '²' c'est pas correct en latex !
    .replaceAll('³', '^3') // '³' non plus
    .replaceAll('^{}', '') // les exposants vides, il n'aime pas ça non plus
    .replaceAll('^{^', '^{') // EE : Pour supprimer les puissances de puissances malencontreuses
}

/**
 * transforme \text{truc} en truc utiliser cleanUnity si le \text{} est au milieu de la chaine.
 * @param str
 */
function cleanLatex (str:string): string {
  const text = str.match(/(\\text\{)(.*)}/)
  if (text && text?.length > 2) return text[2]
  else return str
}

function cleanMultipliyByOne (str: string): string {
  if (!str.match(/\D*1([a-z])/)) return str // à priori, rien à nettoyer ici
  return str.replace(/(\D*)1([a-z])/g, '$1$2')
}

export function generateCleaner (operations: CleaningOperation[]): (str: string) => string {
  const cleaningFunctions = operations.map(operation => {
    switch (operation) {
      case 'fractions':
        return cleanFractions
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

  return (str: string) => cleaningFunctions.reduce((result, cleaningFn) => cleaningFn(result), String(str))
}

/**
 * fonction initialement dans mathlive.js, j'en ai besoin ici, et plus dans mathlive.js
 * @param {string} input la chaine qui contient le nombre avec son unité
 * @return {Grandeur|false} l'objet de type Grandeur qui contient la valeur et l'unité... ou false si c'est pas une grandeur.
 */
function inputToGrandeur (input: string): Grandeur | false {
  if (input.indexOf('°C') > 0) {
    const split = input.split('°C')
    return new Grandeur(parseFloat(split[0].replace(',', '.')), '°C')
  }
  if (input.indexOf('°') > 0) {
    const split = input.split('°')
    return new Grandeur(parseFloat(split[0].replace(',', '.')), '°')
  }
  if (input.split('operatorname').length !== 2) {
    return false
  } else {
    const split = input.split('\\operatorname{')
    const mesure = parseFloat(split[0].replace(',', '.'))
    if (split[1]) {
      const split2 = split[1].split('}')
      const unite = split2[0] + split2[1]
      return new Grandeur(mesure, unite)
    } else {
      return false
    }
  }
}

/* Cette fonction n'est pas correcte, voir la suivante.
/**
 * Permet de valider des 'opérations' par exemple : '4+8' ou '4\\times 5' ou encore '3\\times 5 + 4'
 * @deprecated (EE : je la laisse un peu avant de la supprimer)
 * Cette fonction est déprécieé au profit de expressionDeveloppeeEtReduiteCompare (qui fait la même avec du calcul littéral)
 * @param {string} input
 * @param {string} goodAnswer

export function operationCompare (input: string, goodAnswer: string):ResultType {
  const clean = generateCleaner(['virgules', 'parentheses', 'fractions', 'espaces'])
  const saisie = clean(input)
  const saisieParsed = engine.parse(saisie, { canonical: ['InvisibleOperator', 'Multiply', 'Power', 'Number', 'Add', 'Flatten', 'Order'] })
  const answer = engine.parse(clean(goodAnswer), { canonical: ['InvisibleOperator', 'Multiply', 'Power', 'Number', 'Add', 'Flatten', 'Order'] })

  // Pb : 3+5 est accepté correct pour 2+6
  const evaluationAnswer = answer.evaluate()
  const evaluationSaisie = saisieParsed.evaluate()
  const isOk1 = evaluationAnswer.isEqual(evaluationSaisie)
  const isOk2 = String(answer.head) === String(saisieParsed.head)
  return { isOk: isOk1 && isOk2 } // Une précaution pour éviter de valider 64/8 à la place de 2*4
}
*/

/*
 * Comparaison des enchainements de calculs NUMERIQUES (mais pas leurs résultats)
 * Permet de valider des 'opérations' par exemple : '4+8' ou '4\\times 5' ou encore '3\\times 5 + 4'
 * @param {string} input
 * @param {string} goodAnswer
 * @author  Eric Elter
 * @return ResultType

export function operationCompare (input: string, goodAnswer: string):ResultType {
  return expressionDeveloppeeEtReduiteCompare(input, goodAnswer, { operationSeulementEtNonCalcul: true })
}
*/

// Suppression de numberCompare
/*
export function numberCompare (input: string, goodAnswer: string): ResultType {
  const clean = generateCleaner(['espaces', 'virgules', 'parentheses', 'fractions'])
  const inputParsed = engine.parse(clean(input))

  // Rajout EE : Sans cela, toute opération (aboutissant au bon résultat) était considéré correcte. (29/04/2024)
  if (inputParsed.head !== 'Number' || input.includes('div')) { // Besoin de préciser pour div car sinon c'est pris pour une fraction et c'est accepté or c'est une opération.
    return { isOk: false, feedback: 'Un nombre (et non une opération) doit être saisi' }
  }
  // Fin de rajout EE

  if (input.includes('frac') && inputParsed.isInteger) { // EE : Ce if ne convient pas car reponse est 4/5 mais input est 40/50, on n'a pas de feedback.
    return { isOk: inputParsed.isEqual(engine.parse(clean(goodAnswer))), feedback: `La fraction $${input}$ aurait pu être simplifiée en $${inputParsed.latex}$<br>` }
  } else {
    return { isOk: inputParsed.isEqual(engine.parse(clean(goodAnswer))) }
  }
}
*/

/* Ancienne fonction au profit de la nouvelle ci-dessous
/**
 * comparaison d'expressions
 * @param {string} input
 * @param {string} goodAnswer
 * @author Jean-Claude Lhote
 * @return ResultType
////////////  -> Mettre etoile /
export function calculCompare (input: string, goodAnswer: string): ResultType {

  const clean = generateCleaner(['virgules', 'espaces', 'parentheses', 'puissances', 'fractions'])
  const saisieClean = clean(input)
  const reponseClean = clean(goodAnswer)
  console.log(engine.parse(saisieClean).json, engine.parse(reponseClean).json)
  return { isOk: engine.parse(saisieClean).isSame(engine.parse(reponseClean)) }
}
*/

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
export function factorisationCompare (input: string, goodAnswer:string): ResultType {
  const clean = generateCleaner(['puissances', 'virgules', 'fractions', 'parentheses'])
  const aCleaned = clean(input)
  const bCleaned = clean(goodAnswer)
  const saisieParsed = engine.parse(aCleaned, { canonical: true })
  const reponseParsed = engine.parse(bCleaned, { canonical: true })
  if (saisieParsed == null || reponseParsed == null) {
    window.notify('factorisationCompare a rencontré un problème en analysant la réponse ou la saisie ', { saisie: input, reponse: goodAnswer })
    return { isOk: false }
  }
  const saisieDev = engine.box(['ExpandAll', saisieParsed]).evaluate().simplify().canonical
  const reponseDev = engine.box(['ExpandAll', reponseParsed]).evaluate().simplify().canonical
  const isOk1 = saisieDev.isEqual(reponseDev)
  let isOk2: boolean
  const head = String(saisieParsed.head)
  if (head === 'Negate') {
    if (saisieParsed.ops && Array.isArray(saisieParsed.ops)) {
      const operationFinale = String(saisieParsed.ops[0].head)
      isOk2 = ['Multiply', 'Square', 'Power', 'Divide'].includes(operationFinale)
    } else {
      isOk2 = false
    }
  } else {
    // @fixme Est-ce qu'une division finale est bien représentative d'une expression factorisée (une division, c'est une multiplication par l'inverse, donc a le même statut que Multiply en théorie)
    isOk2 = ['Multiply', 'Square', 'Power', 'Divide'].includes(head) || (head.length === 1 && head.match(/^[a-z]/) != null)
  }
  return { isOk: isOk1 && isOk2 }
}

/* Cette fonction ne sert plus.
/**
 * comparaison d'expressions developpées'
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType

export const developmentCompare = function (input: string, goodAnswer:string) {

  const clean = generateCleaner(['puissances', 'virgules', 'fractions', 'parentheses', 'foisUn'])
  const aCleaned = clean(input)
  const bCleaned = clean(goodAnswer)
  const saisieParsed = engine.parse(aCleaned, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] })
  const reponseParsed = engine.parse(bCleaned, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] })
  if (saisieParsed == null || reponseParsed == null) {
    window.notify('factorisationCompare a rencontré un problème en analysant la réponse ou la saisie ', { saisie: input, reponse: goodAnswer })
    return { isOk: false }
  }
  const saisieDev = engine.box(['ExpandAll', saisieParsed]).evaluate().simplify().canonical
  return { isOk: ['Add', 'Subtract'].includes(String(saisieParsed.head)) && saisieDev.isSame(saisieParsed.simplify().canonical) && saisieParsed.isEqual(reponseParsed) }
} */

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
/* Suppression de cette fonction jamais utilisée et inutile avec les nouvelles fonctions EE
/**
 * comparaison d'expressions développées
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType

export function expandedFormCompare (input: string, goodAnswer: string): ResultType {

  const clean = generateCleaner(['espaces', 'virgules', 'fractions', 'parentheses'])
  input = clean(input)
  const saisieParsed = engine.parse(input).canonical
  const isSomme = ['Add', 'Subtract'].includes(saisieParsed.head as string)
  const isNumber = !isNaN(Number(saisieParsed.numericValue))
  const reponseParsed = engine.parse(clean(goodAnswer)).canonical
  const isOk = reponseParsed.isSame(saisieParsed) && (isSomme || isNumber)
  return { isOk }
}
*/

// Travail ci-dessous de EE

engine.latexDictionary = [
  ...engine.latexDictionary.filter((x) => x.name !== 'Subtract'),
  {
    ...engine.latexDictionary.find((x) => x.name === 'Subtract'),
    parse: (parser:Parser, lhs:Expression, terminator:ParserOptions) => {
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
 * @param {{expressionsForcementReduites:boolean, avecSigneMultiplier:boolean, avecFractions:boolean, fractionIrreducibleSeulement:boolean, operationSeulementEtNonCalcul:boolean, HMS:boolean, intervalle:boolean, estDansIntervalle:boolean, ecritureScientifique:boolean, unite:boolean, precisionUnite:number, puissance:boolean, texteAvecCasse:boolean, texteSansCasse:boolean, fractionIdentique:boolean }} [options]
 * @author Eric Elter
 * @return ResultType
 */
export function fonctionComparaison (input: string, goodAnswer:string, {
  expressionsForcementReduites,
  avecSigneMultiplier,
  avecFractions,
  fractionIrreductibleSeulement,
  operationSeulementEtNonCalcul,
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
  fractionIdentique,
  egaliteExpression
}: OptionsComparaisonType
= {
  expressionsForcementReduites: true,
  avecSigneMultiplier: true,
  avecFractions: true,
  fractionIrreductibleSeulement: false,
  operationSeulementEtNonCalcul: false,
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
  fractionIdentique: false,
  egaliteExpression: false
}) : ResultType {
  // ici, on met tous les tests particuliers (HMS, intervalle)
  // if (HMS) return comparaisonExpressions(input, goodAnswer)
  if (HMS) return hmsCompare(input, goodAnswer)
  if (intervalle) return intervalsCompare(input, goodAnswer)
  if (estDansIntervalle) return intervalCompare(input, goodAnswer)
  if (ecritureScientifique) return scientificCompare(input, goodAnswer)
  if (unite) return unitsCompare(input, goodAnswer, { precision: precisionUnite })
  if (puissance) return powerCompare(input, goodAnswer)
  if (texteAvecCasse) return texteAvecCasseCompare(input, goodAnswer)
  if (texteSansCasse) return texteSansCasseCompare(input, goodAnswer)
  if (fractionIdentique) return fractionCompare(input, goodAnswer)
  if (egaliteExpression) return egaliteCompare(input, goodAnswer)
  if (nombreAvecEspace) return numberWithSpaceCompare(input, goodAnswer)

  // Ici, c'est la comparaison par défaut qui fonctionne dans la très grande majorité des cas
  return expressionDeveloppeeEtReduiteCompare(input, goodAnswer,
    {
      expressionsForcementReduites,
      avecSigneMultiplier,
      avecFractions,
      fractionIrreductibleSeulement,
      operationSeulementEtNonCalcul
    })
}

/**
 * Cette fonction permet que ComputeEngine fasse un super job avec la réduction d'expression et avec des options supplémentaires
 * @param {BoxedExpression} expr
 * @param {{ expressionsForcementReduites:boolean, fractionIrreducibleSeulement:boolean, operationSeulementEtNonCalcul:boolean}} [options]
 * @author Eric Elter (aidé par ArnoG)
 * @return BoxedExpression
 */
function customCanonical (expr:BoxedExpression, { expressionsForcementReduites = true, fractionIrreductibleSeulement = false, operationSeulementEtNonCalcul = false } = {}):BoxedExpression {
  if (!operationSeulementEtNonCalcul) { // Ci-dessous, on accepte le résultat d'un calcul mais pas un autre enchaînement Ici, si 4+2 est attendu, alors 4+2=6 mais 4+2!=5+1. C'est la valeur par défaut
    if (typeof expr.value === 'number') { // L'expression est une expression numérique
      if ((expr.head === 'Divide' || expr.head === 'Rational') && fractionIrreductibleSeulement) {
        if (expr.engine.box(['GCD', expr.op1, expr.op2]).value !== 1 || expr.op2.value === 1) return expr
      }
      return expr.engine.number(expr.value)
    }
  } else if (expressionsForcementReduites) { // Ici, le traitement n'est fait que pour des expressions forcément réduites
    // Ci-dessous, on accepte que l'enchaînement proposé et pas le résultat. Ici, si 4+2 est attendu, alors4+2!=6 et 4+2!=5+1
    if (
      (expr.head === 'Divide' || expr.head === 'Rational') &&
    typeof expr.value === 'number'
    ) {
      if (fractionIrreductibleSeulement) {
        if (
          expr.engine.box(['GCD', expr.op1, expr.op2]).value !== 1 ||
        expr.op2.value === 1
        ) { return expr }
      }
      return expr.engine.number(expr.value)
    }
  }
  if ((expr.head === 'Divide' || expr.head === 'Rational')) { // Pour enlever les divisions éventuelles par 1
    if (expr.op2.value === 1) expr = expr.op1
  }
  if (expr.ops) { // Pour ne pas accepter les +0, les \\times1, pour ne pas se soucier de l'ordre
    return expr.engine.box([expr.head,
      ...expr.ops.map((x) =>
        customCanonical(x, { expressionsForcementReduites, fractionIrreductibleSeulement, operationSeulementEtNonCalcul })
      )], { canonical: ['InvisibleOperator', 'Order', 'Flatten'] })
  }
  return expr.canonical
}

// Définir le type pour les substitutions
type Substitutions = { [variable: string]: number };

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
 * @param {{expressionsForcementReduites:boolean, avecSigneMultiplier:boolean, avecFractions:boolean, fractionIrreducibleSeulement:boolean, operationSeulementEtNonCalcul:boolean}} [options]
 * @author Eric Elter
 * @return ResultType
 */
function expressionDeveloppeeEtReduiteCompare (input: string, goodAnswer:string,
  {
    expressionsForcementReduites = true,
    avecSigneMultiplier = true,
    avecFractions = true,
    fractionIrreductibleSeulement = false,
    operationSeulementEtNonCalcul = false
  } = { }) : ResultType {
  // Ces 2 lignes sont à améliorer... EE : Faut que je teste un truc... et rajouter les racines carrées aussi
  if (!avecSigneMultiplier && input.includes('times')) return { isOk: false }
  if (!avecFractions && input.includes('frac')) return { isOk: false }

  const clean = generateCleaner(['puissances', 'virgules', 'fractions', 'parentheses', 'foisUn'])
  input = clean(input)
  goodAnswer = clean(goodAnswer)
  // const toto = engine.parse(goodAnswer, { canonical: false })
  const saisieParsed = customCanonical(engine.parse(input, { canonical: false }), { expressionsForcementReduites, fractionIrreductibleSeulement, operationSeulementEtNonCalcul })
  const reponseParsed = customCanonical(engine.parse(goodAnswer, { canonical: false }), { expressionsForcementReduites, fractionIrreductibleSeulement, operationSeulementEtNonCalcul })
  // console.log(reponseParsed.toString(), saisieParsed.toString())
  // console.log(reponseParsed.value, saisieParsed.value)
  // console.log(toto.head)
  // console.log('toto.op1', toto.op1)
  // console.log('toto.op2', toto.op2)

  // Ci-dessous, si on a une comparaison fausse mais que l'expression donnée est mathématiquement correcte, on fait un feedback.
  let feedback = ''
  const substitutions: Substitutions = { a: 2, b: 2, c: 2, x: 2, y: 2, z: 2 } // On peut ajouter d'autres variables si nécessaire
  const adjectif = goodAnswer.match(/[a-z]/) == null ? 'numérique' : 'littérale'
  if (!saisieParsed.isSame(reponseParsed) && evaluateExpression(goodAnswer, substitutions) === evaluateExpression(input, substitutions)) {
    feedback = expressionsForcementReduites
      ? `L'expression ${adjectif} attendue devrait être développée et réduite or ce n'est pas le cas.`
      : `L'expression ${adjectif} attendue devrait être simplement développée or ce n'est pas le cas.`
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
function evaluateExpression (expr: string, substitutions: Substitutions): number|string {
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
  } else {
    return 'NAN'
  }
}
/**
 * comparaison d'expressions developpées NON REDUITES
 * @param {string} input
 * @param {string} goodAnswer
 * @author Eric Elter
 * @return ResultType
 */
export function expressionDeveloppeeEtNonReduiteCompare (input: string, goodAnswer:string) : ResultType {
  return expressionDeveloppeeEtReduiteCompare(input, goodAnswer, { expressionsForcementReduites: false })
}

/**
 * comparaison de nombres en écritures scientifiques @todo à vérifier celle-là, j'suis pas convaincu
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote
 */
function scientificCompare (input: string, goodAnswer: string): ResultType {
  const clean = generateCleaner(['virgules', 'espaces', 'parentheses', 'puissances'])
  const saisieClean = clean(input)
  const reponseClean = clean(goodAnswer)
  if (engine.parse(saisieClean).canonical.isSame(engine.parse(reponseClean).canonical)) {
    const [mantisse] = saisieClean.split('\\times')
    if (Number(mantisse) >= 1 && Number(mantisse) < 10) {
      return { isOk: true }
    }
  }
  return { isOk: false }
}

function comparaisonExpressions (expr1:string, expr2:string):ResultType {
  // Convertir les équations en MathJSON
  const mathJson1 = engine.parse(expr1) as BoxedExpression
  const mathJson2 = engine.parse(expr2) as BoxedExpression

  return { isOk: mathJson1.isEqual(mathJson2) }
}
/**
 * comparaison de textes... ben parce qu'il en faut une
 * @param {string} input
 * @param {string} goodAnswer
 * @author Jean-Claude Lhote
 * @return ResultType
 */
function texteAvecCasseCompare (input: string, goodAnswer: string): ResultType {
  const cleaner = generateCleaner(['parentheses', 'mathrm'])
  input = cleaner(input)
  goodAnswer = cleaner(goodAnswer)

  // Cette commande ci-dessous est mauvaise. Je la laisse pour expliquer pourquoi elle est mauvaise.
  // Autant, elle serait utile pour comparer 'aucun' et 'Aucun'
  // mais elle ne le serait plus pour comparer [AB] et [ab] ce qui serait dommage.
  // return { isOk: input.toLowerCase() === goodAnswer.toLowerCase() }
  return { isOk: input === goodAnswer }
}

/**
 * comparaison de textes avec espaces comme son nom l'indique : avec un nettoyage adapté à la situation
 * Utilise String.localeCompare() pour les spécificités du langage local utilisé.
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote
 */
export function textWithSpacesCompare (input: string, goodAnswer: string): ResultType {
  const clean = generateCleaner(['virgules', 'parentheses', 'latex', 'doubleEspaces'])
  goodAnswer = clean(goodAnswer)
  input = clean(input)
  const result = input.localeCompare(goodAnswer)
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
  input = input.toLowerCase()
  goodAnswer = goodAnswer.toLowerCase()
  return texteAvecCasseCompare(input, goodAnswer)
}

/**
 * comparaison de fraction simplifiée
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote
 */
export function simplerFractionCompare (input: string, goodAnswer: string): ResultType {
  const cleaner = generateCleaner(['fractions', 'espaces'])
  goodAnswer = cleaner(goodAnswer)
  const goodAnswerParsed = engine.parse(goodAnswer, { canonical: false })
  const inputParsed = engine.parse(input, { canonical: false })
  if (inputParsed.head === 'Divide' && goodAnswerParsed.head === 'Divide') {
    const num = (inputParsed.json as [string, number, number])[1] as number
    const numGoodAnswer = (goodAnswerParsed.json as [string, number, number])[1] as number
    if (numGoodAnswer == null) throw Error(`problème avec ${goodAnswer} dans simplerFractionCompare : fReponse.op1.numericValue est nul`)
    if (inputParsed.isEqual(goodAnswerParsed) && num && num < numGoodAnswer && Number.isInteger(num)) return { isOk: true }
  }
  return { isOk: false }
}

/* Suppression de cette fonction au profit de fonctionComparaison
/**
 * comparaison de fraction en valeur acceptant la valeur décimale
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote

export function equalFractionCompare (input: string, goodAnswer: string): ResultType {
  const cleaner = generateCleaner(['fractions', 'virgules', 'espaces'])
  goodAnswer = cleaner(goodAnswer)
  input = cleaner(input)
  const fReponse = engine.parse(goodAnswer)

  /* EE : Suppression de cette partie au profit de la suivante (pour prise en compte des racines carrées dans 2N32-7) - 26/04/2024
  if (!isNaN(parseFloat(cleanStringBeforeParse(input)))) {
    // La saisie est faite sous forme décimale (non, pas forcément avec des racines carrées)
    const newFraction = new FractionEtendue(parseFloat(cleanStringBeforeParse(input)), 1)
    if (engine.parse(`${newFraction.toLatex().replace('dfrac', 'frac')}`).canonical.isSame(fReponse.canonical)) return { isOk: true }
  } else {
    // La saisie est une fraction
    if (engine.parse(cleanStringBeforeParse(input)).canonical.canonical.isEqual(fReponse.canonical)) return { isOk: true }
  }

  if (input.includes('\\frac')) {
    // La saisie est une fraction
    if (engine.parse(input).canonical.isEqual(fReponse.canonical)) return { isOk: true }
  } else {
    // La saisie n'est pas une fraction
    if (String(parseFloat(input)) === input) {
      // La saisie est un décimal
      const newFractionAvecDecimal = new FractionEtendue(parseFloat(input), 1)
      if (engine.parse(`${newFractionAvecDecimal.toLatex().replace('dfrac', 'frac')}`).canonical.isSame(fReponse.canonical)) return { isOk: true }
    } else {
      // La saisie n'est pas un décimal, peut-être possède-t-elle une racine carrée... comme dans 2N32-7
      let newFractionSansDecimal = texFractionFromString(input, 1)
      newFractionSansDecimal = cleaner(newFractionSansDecimal)
      if (engine.parse(newFractionSansDecimal).canonical.isSame(fReponse.canonical)) return { isOk: true }
    }
  }

  return { isOk: false }
} */

/**
 * Comparaison de fraction en acceptant toute valeur (y compris la valeur décimale) mais n'acceptant de racine carrée au dénominateur
 * @param {string} input
 * @param {string} goodAnswer
 * @author Eric Elter
 * @return ResultType
 */
export function equalFractionCompareSansRadical (input: string, goodAnswer: string): ResultType {
  const cleaner = generateCleaner(['fractions'])
  input = cleaner(input)

  // Utilisation d'une expression régulière pour extraire le contenu de la deuxième accolade
  const contenuDeuxiemeAccolade: string | null = input.match(/\\frac{[^}]*}{(\\sqrt[^}]*)/)?.[1] || null

  // if (contenuDeuxiemeAccolade === null) return { isOk: equalFractionCompare(input, goodAnswer).isOk }
  // else if (!contenuDeuxiemeAccolade.includes('sqrt')) return { isOk: equalFractionCompare(input, goodAnswer).isOk }
  if (contenuDeuxiemeAccolade === null) return { isOk: fonctionComparaison(input, goodAnswer).isOk }
  else if (!contenuDeuxiemeAccolade.includes('sqrt')) return { isOk: fonctionComparaison(input, goodAnswer).isOk }
  else return { isOk: false }
}

/**
 * comparaison de fraction à l'identique (pour les fraction irréductibles par exemple ou pour les fractions décimales)
 * @param {string} input
 * @param {string} goodAnswer // Doit être au format texFSD ! le signe devant, numérateur et dénominateur positifs !!!
 * @author Jean-Claude Lhote
 * @return ResultType
 */
function fractionCompare (input: string, goodAnswer: string): ResultType {
  const clean = generateCleaner(['espaces', 'fractions'])
  const inputParsed = engine.parse(clean(input), { canonical: false })
  let newFraction
  if (inputParsed.head === 'Divide') {
    const num = Number(inputParsed.op1.numericValue)
    const den = Number(inputParsed.op2.numericValue)
    if (num * den < 0) {
      newFraction = engine.parse(`-\\frac{${Math.abs(num)}}{${Math.abs(den)}}`, { canonical: false })
    } else {
      newFraction = engine.parse(`\\frac{${Math.abs(num)}}{${Math.abs(den)}}`, { canonical: false })
    }
  } else {
    newFraction = inputParsed
  }
  const goodAnswerParsed = engine.parse(clean(goodAnswer), { canonical: false })
  return { isOk: newFraction.isSame(goodAnswerParsed) }
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
  let formatOK: boolean = false
  let formatKO: boolean = false
  const nombreSaisi = clean(input).split('^')
  const mantisseSaisie = nombreSaisi[0].replace(/\\lparen(.*?)\\rparen/g, '$1')
  // const mantisseS = Number(mantisseSaisie)
  const expoSaisi = nombreSaisi[1] ? nombreSaisi[1].replace(/[{}]/g, '') : '1'
  // const expoS = Number(expoSaisi)
  const nombreAttendu = clean(goodAnswer).split('^')
  const mantisseReponse = nombreAttendu[0].replace(/[()]/g, '')
  const mantisseR = Number(mantisseReponse)
  const expoReponse = nombreAttendu[1] ? nombreAttendu[1].replace(/[{}]/g, '') : '1'
  const expoR = Number(expoReponse)
  if (input.indexOf('^') !== -1) {
    if (mantisseReponse === mantisseSaisie && expoReponse === expoSaisi) {
      formatOK = true
    }
    // gérer le cas mantisse négative a et exposant impair e, -a^e est correct mais pas du format attendu
    // si la mantisse attendue est négative on nettoie la chaine des parenthèses
    if (mantisseR < 0 && expoR % 2 === 1) {
      if ((input === `${mantisseReponse}^{${expoReponse}}`) || (input === `${mantisseReponse}^${expoReponse}`)) {
        formatKO = true
      }
    }
    // si l'exposant est négatif, il se peut qu'on ait une puissance au dénominateur
    if (expoR < 0) {
      // Si la mantisse est positive
      if ((input === `\\frac{1}{${mantisseR}^{${-expoR}}`) || (input === `\\frac{1}{${mantisseR}^${-expoR}}`)) {
        formatKO = true
      }
    }
  } else {
    // Dans tous ces cas on est sûr que le format n'est pas bon
    // Toutefois la valeur peut l'être donc on vérifie
    if (expoR < 0) {
      // Si la mantisse est positive
      if (nombreSaisi[0] === `\\frac{1}{${mantisseR ** (-expoR)}}`) {
        formatKO = true
      }
      // Si elle est négative, le signe - peut être devant la fraction ou au numérateur  ou au dénominateur
      if (mantisseR < 0 && ((-expoR) % 2 === 1)) {
        if ((nombreSaisi[0] === `-\\frac{1}{${(-mantisseR) ** (-expoR)}}`) || (nombreSaisi[0] === `\\frac{-1}{${(-mantisseR) ** (-expoR)}}`) || (nombreSaisi[0] === `\\frac{1}{-${(-mantisseR) ** (-expoR)}}`)) {
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
  } else if (formatKO) {
    return { isOk: false, feedback: 'essaieEncorePuissance' }
  }
  return { isOk: false }
}

/**
 * Comparaison d'ensembles de solutions séparés par des ; dans des {} comme {-5;4;10}
 * @param input
 * @param goodAnswer
 * @return ResultType
 * @author Jean-Claude Lhote
 */
export function setsCompare (input: string, goodAnswer: string): ResultType {
  const clean = generateCleaner(['virgules', 'fractions', 'parentheses'])
  // const cleanUp = (s: string) => s.replace('{.}', '.').replace(',', '.') // @fixme vérifier si on a besoin d'éliminer ce {.} ? si oui, l'intégrer au cleauner 'virgules'
  const elements1 = clean(input).split(';').sort((a: string, b: string) => Number(a) - Number(b))
  const elements2 = clean(goodAnswer).split(';').sort((a: string, b: string) => Number(a) - Number(b))
  if (elements1.length !== elements2.length) return { isOk: false }
  let ok = true
  for (let i = 0; i < elements1.length; i++) {
    if (!engine.parse(elements1[i]).isEqual(engine.parse(elements2[i]))) {
      ok = false
      break
    }
  }
  return { isOk: ok }
}

/**
 * La fonction de comparaison des intervalles pour l'interactif
 * @param input
 * @param goodAnswer
 * @author Jean-Claude Lhote
 */
function intervalsCompare (input: string, goodAnswer: string) {
  const clean = generateCleaner(['virgules', 'parentheses', 'espaces'])
  input = clean(input)
  goodAnswer = clean(goodAnswer).replaceAll('bigcup', 'cup').replaceAll('bigcap', 'cap')
  let isOk1 = true
  let isOk2 = true
  let feedback: string = ''
  const extractBornesAndOp = /[^[\];]+/g
  const extractCrochets = /[[\]]/g
  const borneAndOpSaisie = input.match(extractBornesAndOp)
  const borneAndOpReponse = goodAnswer.match(extractBornesAndOp)
  const crochetsSaisie = input.match(extractCrochets)
  const crochetsReponse = goodAnswer.match(extractCrochets)
  if (borneAndOpSaisie != null && borneAndOpReponse != null && crochetsSaisie != null && crochetsReponse != null) {
    if (borneAndOpSaisie.length !== borneAndOpReponse.length) {
      return { isOk: false }
    }
    // On teste les bornes et les opérateurs
    let i
    for (i = 0; i < borneAndOpSaisie.length; i++) {
      isOk1 = fonctionComparaison(borneAndOpSaisie[i], borneAndOpReponse[i]).isOk
      if (!isOk1) {
        feedback += (['\\cup', '\\cap'].includes(borneAndOpSaisie[i]))
          ? `Il y a une erreur avec l'opérateur : $${borneAndOpSaisie[i]}$.<br>`
          : `Il y a une erreur avec la valeur : $${borneAndOpSaisie[i]}$.<br>`
      }
    }
    // on teste maintenant les crochets
    for (i = 0; i < crochetsSaisie.length; i++) {
      isOk2 = crochetsSaisie[i] === crochetsReponse[i]
      if (!isOk2) feedback += `Le crochet placé en position ${i + 1} est mal orienté.<br>`
    }
    return { isOk: isOk1 && isOk2, feedback }
  }
  return { isOk: false, feedback: 'Il faut donner un intervalle ou une réunion d\'intervalles' }
}
// Fonction devenue inutile
/*
 * comparaison d'expression développées et réduite pour les tests d'Éric Elter
 * @param {string} input
 * @param {string} goodAnswer
 * @param {{strict: boolean}} [options]
 * @return ResultType
 * @author Jean-Claude Lhote

export function expandedAndReductedCompare (input: string, goodAnswer: string, { strict = true } = { }): ResultType {
  const expr = goodAnswer
  let clean
  let feedback = ''
  if (!strict) {
    // on va virer les multiplications par 1 de variables.
    clean = generateCleaner(['fractions', 'virgules', 'puissances', 'foisUn'])
  } else {
    clean = generateCleaner(['fractions', 'virgules', 'puissances'])
  }
  if (input.match(/\D*1[a-z]/)) feedback = 'La multiplication par 1 est inutile.<br>'
  const saisieCleaned = clean(input)
  const saisie = engine.parse(saisieCleaned, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] })
  const answer = engine.parse(clean(expr), { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] })
  // console.log(`saisie : ${saisie.latex} et answer : ${answer.latex}`)
  const isOk1 = saisie.isSame(answer)
  const isOk2 = saisie.isEqual(answer)
  return { isOk: isOk1 && isOk2, feedback: isOk1 && isOk2 ? feedback : isOk2 ? feedback + 'L\'expression est développée mais pas réduite.<br>' : feedback }
} */
/**
 * Comparaison de chaînes (principalement des noms de classes
 * @param {string} input ce que saisit l'élève
 * @param {{pluriels: boolean}} [options]
 * @param {{value: string, nombre:boolean}} goodAnswer value est ce qui est attendu, si nombre est true, on compte faux l'absence de s quand il en faut un et la présence de s quand il n'y en a pas besoin
 * si pluriels est false, on compte juste une réponse au pluriel ou au singulier quelque soit la réponse attendue, mais on met un feedback si le pluriel ou le singulier n'est pas respecté
 * @author Jean-Claude Lhote
 */
export function numerationCompare (input: string, goodAnswer: string, { pluriels = true } = { }): ResultType {
// normalement, il n'y a rien à nettoyer au niveau de l'input ou de goodAnswer
  const clean = generateCleaner(['latex'])
  const saisie: string[] = clean(input).toLowerCase().split(' ')
  const answer: string[] = goodAnswer.toLowerCase().split(' ')
  let result: boolean
  let feedback: string = ''
  if (pluriels) {
    result = true
    for (let i = 0; i < answer.length; i++) {
      result = result && (saisie[i] === answer[i])
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
  } else { // ici on tolère singulier ou pluriel
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
      if (saisie[i].endsWith('s')) saisie[i] = saisie[i].substring(0, saisie[i].length - 1)
      if (answer[i].endsWith('s')) answer[i] = answer[i].substring(0, answer[i].length - 1)
      result = result && (saisie[i] === answer[i])
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
function unitsCompare (input: string, goodAnswer: string, { precision = 1 } = {}): {
  isOk: boolean,
  feedback?: string
} {
  input = input.replace('^\\circ', '°').replace('\\degree', '°')
  const cleaner = generateCleaner(['virgules', 'espaces', 'fractions', 'parentheses', 'mathrm'])
  const inputGrandeur = inputToGrandeur(cleaner(input))
  const goodAnswerGrandeur = Grandeur.fromString(cleaner(goodAnswer).replace('^\\circ', '°').replace('\\degree', '°'))
  if (inputGrandeur) {
    if (inputGrandeur.uniteDeReference !== goodAnswerGrandeur.uniteDeReference) {
      return { isOk: false, feedback: `Il faut donner la réponse en $${goodAnswerGrandeur.latexUnit}$.` }
    }
    if (precision !== undefined) {
      if (inputGrandeur.estUneApproximation(goodAnswerGrandeur, precision)) {
        return { isOk: true }
      } else {
        return { isOk: false }
      }
    } else {
      if (inputGrandeur.estEgal(goodAnswerGrandeur)) {
        return { isOk: true }
      }
      return { isOk: false }
    }
  } else {
    // Oubli de l'unité ?
    const inputNumber = Number(engine.parse(cleaner(input)))
    const inputWithAddedUnit = new Grandeur(inputNumber, goodAnswerGrandeur.unite)
    if (inputWithAddedUnit.estEgal(goodAnswerGrandeur)) {
      return { isOk: false, feedback: 'La réponse est correcte mais tu as oublié de préciser l\'unité.' }
    }
    if (inputNumber !== 0) {
      return { isOk: false, feedback: 'La réponse est fausse et il faut saisir l\'unité.' }
    }
    return { isOk: false }
  }
}

/**
 * vérifie qu'une valeur saisie est dans un intervalle strict
 * @param {string} input
 * @param {string} goodAnswer Un intervalle par exemple ]-5.5;2]
 * @return ResultType
 * @author Jean-Claude Lhote
 */
function intervalCompare (input: string, goodAnswer: string): {
  isOk: boolean,
  feedback?: string
} {
  let strictGauche: boolean = true
  let strictDroit: boolean = true
  if (goodAnswer.startsWith('[')) strictGauche = false
  if (goodAnswer.endsWith(']')) strictDroit = false
  const bornes = goodAnswer.match(/[[\]](.+);(.+)[[\]]/)
  if (bornes == null) {
    window.notify('Il faut revoir la définition de l\'intervalle ', { goodAnswer })
    return { isOk: false, feedback: 'Un problème avec goodAnswer !' }
  } else {
    const borneInf = Number(bornes[1])
    const borneSup = Number(bornes[2])
    // Si on veut accepter une expressio :
    // const inputNumber = Number(engine.parse(cleanStringBeforeParse(input)).N())
    const clean = generateCleaner(['virgules', 'fractions', 'espaces'])
    const inputNumber = Number(clean(input))
    if (Number.isNaN(inputNumber)) return { isOk: false }
    const okGauche = strictGauche
      ? inputNumber > borneInf
      : inputNumber >= borneInf
    const okDroit = strictDroit
      ? inputNumber < borneSup
      : inputNumber <= borneSup
    return { isOk: okGauche && okDroit }
  }
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
export function consecutiveCompare (input: string, goodAnswer: string): ResultType {
  let feedback = ''
  const [entierInf, valeurInter, entierSup] = input.includes('<') ? input.split('<').map(el => Number(engine.parse(el).numericValue)) : input.split('>').map(el => Number(engine.parse(el).numericValue)).sort((a: number, b:number) => a - b)
  if (!(Number.isInteger(Number(entierSup)) && Number.isInteger(Number(entierInf)))) {
    feedback = 'On attend comme réponse deux nombres entiers.'
    return { isOk: false, feedback }
  }
  const [goodAnswerEntierInf, , goodAnswerEntierSup] = goodAnswer.includes('<') ? goodAnswer.split('<').map(el => Number(engine.parse(el).numericValue)) : goodAnswer.split('>').map(el => Number(engine.parse(el).numericValue)).sort((a: number, b:number) => a - b)
  const diff = Number(engine.box(['Subtract', String(entierSup), String(entierInf)]).N().numericValue)
  if (diff === -1) {
    feedback = 'Les nombres sont bien deux entiers consécutifs, mais ils sont donnés dans l\'ordre inverse.'
    return { isOk: false, feedback }
  } else if (diff !== 1) {
    return { isOk: false, feedback: 'Les deux nombres entiers donnés ne sont pas consécutifs.' }
  }
  if (valeurInter != null) {
    const diff1 = Number(engine.box(['Subtract', String(entierSup), String(valeurInter)]).N().numericValue)
    const diff2 = Number(engine.box(['Subtract', String(valeurInter), String(entierInf)]).N().numericValue)
    if (!(diff1 != null && diff2 != null && diff1 < 1 && diff1 >= 0 && diff2 < 1 && diff2 >= 0)) { return { isOk: false, feedback: `Les deux nombres entiers sont biens consécutifs mais n'encadrent pas la valeur ${valeurInter}` } }
  }
  const isOk1 = true
  // const isOk2 = numberCompare(String(entierInf), String(goodAnswerEntierInf)).isOk && numberCompare(String(entierSup), String(goodAnswerEntierSup)).isOk
  const isOk2 = expressionDeveloppeeEtReduiteCompare(String(entierInf), String(goodAnswerEntierInf)).isOk && expressionDeveloppeeEtReduiteCompare(String(entierSup), String(goodAnswerEntierSup)).isOk
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
export function approximatelyCompare (input: string, goodAnswer: string, { tolerance = 0.1 } = { }) {
  const cleaner = generateCleaner(['virgules', 'fractions', 'espaces', 'parentheses', 'puissances'])
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
export function functionCompare (input: string, goodAnswer: string, { variable = 'x', domaine = [-100, 100] } = {}): ResultType {
  const clean = generateCleaner(['virgules', 'parentheses', 'fractions', 'divisions'])
  const cleanInput = clean(input)
  const inputParsed = engine.parse(cleanInput)
  const inputFn = inputParsed.compile()
  const cleanAnswer = clean(goodAnswer)
  const goodAnswerFn = engine.parse(cleanAnswer).compile()
  const min = domaine[0]
  const max = domaine[1]
  const range = max - min
  const valAlea = () => min + range * Math.random()
  if (inputFn == null || goodAnswerFn == null) throw Error(`functionCompare : La saisie ou la bonne réponse ne sont pas des fonctions (saisie : ${input} et réponse attendue : ${goodAnswer}`)
  let a: number, b: number, c: number
  let variablea: object, variableb: object, variablec: object
  do {
    [a, b, c] = [valAlea(), valAlea(), valAlea()]
    variablea = Object.fromEntries([[variable ?? 'x', a]])
    variableb = Object.fromEntries([[variable ?? 'x', b]])
    variablec = Object.fromEntries([[variable ?? 'x', c]])
  } while (isNaN(goodAnswerFn(variablea)) || isNaN(goodAnswerFn(variableb)) || isNaN(goodAnswerFn(variablec)))
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
export function egaliteCompare (input: string, goodAnswer: string):ResultType {
  const [m1, m2] = input.split('=')
  const [goodAnswerMb1, goodAnswerMb2] = goodAnswer.split('=')
  if (m1 == null || m2 == null) return { isOk: false, feedback: 'Une égalité est attendue' }

  const { isOk: isOk1 } = fonctionComparaison(m2, goodAnswerMb1)
  const { isOk: isOk2 } = fonctionComparaison(m1, goodAnswerMb1)
  const { isOk: isOk3 } = fonctionComparaison(m2, goodAnswerMb2)
  const { isOk: isOk4 } = fonctionComparaison(m1, goodAnswerMb2)
  return { isOk: (isOk1 || isOk2) && (isOk3 || isOk4) }
}

/**
 * Comparaison de nombres avec les espaces exigés
 * @param {string} input
 * @param {string} goodAnswer
 * @author Rémi Angot
 */
export function numberWithSpaceCompare (input: string, goodAnswer: string): ResultType {
  const clean = generateCleaner(['espaces'])
  const inputClean = clean(input)
  const goodAnswerClean = clean(goodAnswer)
  let feedback = ''
  if (input !== goodAnswer && inputClean === goodAnswerClean) {
    feedback = 'Le nombre est mal écrit, il faut faire attention aux espaces.'
  }
  return { isOk: input === goodAnswer, feedback }
}

export function exprCompare (input: string, goodAnswer: string, { noUselessParen = false }): ResultType {
  const clean = generateCleaner(['virgules', 'parentheses', 'divisions', 'fractions', 'puissances', 'fractions', 'mathrm'])
  const inputClean = clean(input) ?? ''
  const answerClean = clean(goodAnswer) ?? ''
  let feedback = ''
  let isOk = true
  const nbParenInput = inputClean.match(/([()])/g)?.length
  const nbParenAnswer = answerClean.match(/([()])/g)?.length
  const numbersInput = inputClean.match(/\d+/g)?.sort((a, b) => Number(a) - Number(b))
  const numbersAnswer = answerClean.match(/\d+/g)?.sort((a, b) => Number(a) - Number(b))
  const opsInput = inputClean.match(/[+\-/*]|(times)|(div)|(frac)/g)?.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
  const opsAnswer = answerClean.match(/[+\-/*]|(times)|(div)|(frac)/g)?.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
  const isOk1 = nbParenAnswer === nbParenInput // doit être true si noUselessParen est true
  const isOk2 = numbersInput != null && numbersAnswer != null && areSameArray(numbersInput, numbersAnswer) // doit être obligatoirement true
  const isOk3 = opsInput != null && opsAnswer != null && areSameArray(opsInput, opsAnswer) // doit obligatoirement être true
  const isOk4 = engine.parse(inputClean).isEqual(engine.parse(clean(goodAnswer))) // doit obligatoirement être true
  if (noUselessParen && inputClean != null && answerClean !== null) {
    isOk = isOk1 && isOk2 && isOk3 && isOk4
    if (!isOk1 && isOk4) {
      feedback = 'L\'expression donne le bon résultat mais n\'a pas la forme attendue.'
    }
  } else {
    isOk = isOk2 && isOk3 && isOk4
    if (!isOk) {
      if (!isOk4) {
        feedback = 'L\'expression ne donne pas le bon résultat.'
      } else if (!isOk3) {
        feedback = 'L\'expression ne contient pas les bonnes opérations.'
      } else {
        feedback = 'L\'expression ne contient pas les bons nombres.'
      }
    }
  }
  return { isOk, feedback }
}
