import { ComputeEngine, type Rule } from '@cortex-js/compute-engine'
import FractionEtendue from '../../modules/FractionEtendue'
import Grandeur from '../../modules/Grandeur'
import Hms from '../../modules/Hms'
import { texFractionFromString } from '../outils/deprecatedFractions'

const engine = new ComputeEngine()
export default engine

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
      ? RecursivePartial<U>[]
      : T[P] extends object | undefined
          ? RecursivePartial<T[P]>
          : T[P]
}

type StandardType = 'Standard'
type FonctionType = 'Fonction'
type GrandeurType = 'Grandeur'
type EgaliteType = 'Standard'
type ConsecutifsType = 'Consecutifs'
type EnvironEgalType = 'EnvironEgal'

export type CompareType = StandardType|FonctionType|GrandeurType|EgaliteType|ConsecutifsType|EnvironEgalType
export type ResultType = {isOk: boolean, feedback?: string}

type GoodAnswerType<T extends CompareType> = T extends StandardType
? string
    : T extends GrandeurType
        ? {grandeur: Grandeur, precision: number}
        : T extends FonctionType
            ? {fonction: string, variable: string}
            : T extends EgaliteType
                ? {membre1: {fonction:string, variable: string}, membre2: {fonction: string, variable: string}, strict: boolean}
                : T extends ConsecutifsType
                    ? {entierInf: number, entierSup: number, valeurInter: number}
                    : T extends EnvironEgalType
                        ? {attendu: string, tolerance: number} // La valeur saisie (attendu) peut être \frac{...}{...}
                        : string
export type GoodAnswer<T extends CompareType> = RecursivePartial<GoodAnswerType<T>>
export type CompareFunction<T extends CompareType> = ({ input, goodAnswer }:{input:string, goodAnswer: GoodAnswer<T> }) => ResultType

/**
 * Une fonction pour nettoyer les saisies sortant des inputs afin d'être utilisées sans erreur par le parser de ComputeEngine
 * Peut nettoyer aussi la réponse fournie par l'auteur indélicat d'un exercice (par exemple, celui qui passe du texNombre()...)
 * @param {string} aString // ce qui vient en entrée
 * @return {string} la chaine de caractère dont on espère que ComputeEngine (CE) en digérera correctement le contenu.
 * @deprecated utiliser un cleaner fabriqué avec generateCleaner() plutôt
 */
export function cleanStringBeforeParse (aString: string) {
  if (typeof aString !== 'string') {
    aString = String(aString)
  }
  return aString // CE n'aime pas les virgules, il veut des . (on pourrait lui dire que le séparateur décimal est la virgule)
    .replaceAll('dfrac', 'frac') // CE n'aime pas \dfrac
    .replaceAll('²', '^2') // '²' c'est pas correct en latex !
    .replaceAll('³', '^3') // '³' non plus
    .replaceAll('^{}', '') // les exposants vides, il n'aime pas ça non plus
    .replaceAll('{,}', '.') // On écrit {,} pour éviter les espaces disgracieux dans les nombres décimaux
    .replaceAll('\\,', '') // pourquoi laisser des espaces indésirables si on peut les enlever ?
    .replaceAll(/\s/g, '') // encore des espaces à virer ?
    .replace(/\\lparen(\+?-?\d+)\\rparen/, '$1') // (+3) => +3 car CE ne sait pas comparer -5 et 5
    .replaceAll('\\lparen', '(').replaceAll('\\rparen', ')')
    .replaceAll(',', '.')
}

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
  return str.replaceAll(/\\lparen(\+?-?\d+,?\.?\d*)\\rparen/g, '$1')
    .replaceAll(/\\left\((\+?-?\d+)\\right\)/g, '$1')
    .replaceAll(/\\lparen(\+?-?\d+)\\rparen/g, '$1')
    .replaceAll('\\lparen', '(')
    .replaceAll('\\rparen', ')')
    .replaceAll('\\left\\lbrack', '[')
    .replaceAll('\\right\\rbrack', ']')
    .replaceAll('\\right\\lbrack', '[')
    .replaceAll('\\left\\rbrack', ']')
}

function cleanMathRm (str: string): string {
  return str.replace(/\\mathrm\{(\w+)\}/g, '$1')
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
  * @param {sting} str
 */
function cleanPower (str: string): string {
  return str.replaceAll('²', '^2') // '²' c'est pas correct en latex !
    .replaceAll('³', '^3') // '³' non plus
    .replaceAll('^{}', '') // les exposants vides, il n'aime pas ça non plus
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

/**
 * Permet de valider des 'opérations' par exemple : '4+8' ou '4\\times 5' ou encore '3\\times 5 + 4'
 * @param {string} input
 * @param {string} goodAnswer
 */
export function operationCompare (input: string, goodAnswer: string):ResultType {
  const clean = generateCleaner(['virgules', 'parentheses', 'fractions', 'espaces'])
  const saisie = clean(input)
  const saisieParsed = engine.parse(saisie, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] })
  const answer = engine.parse(goodAnswer, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] })
  // @fixme 64/8 et 32/4 seront considérés comme équivalent ...
  const evaluationAnswer = answer.evaluate()
  const evaluationSaisie = saisieParsed.evaluate()
  const isOk1 = evaluationAnswer.isEqual(evaluationSaisie)
  const isOk2 = String(answer.head) === String(saisieParsed.head)
  return { isOk: isOk1 && isOk2 } // Une précaution pour éviter de valider 64/8 à la place de 2*4
}

/**
 * comparaison de nombres
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function numberCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  if (input === '') {
    return { isOk: false, feedback: 'Un nombre doit être saisi' }
  }
  const clean = generateCleaner(['espaces', 'virgules', 'parentheses', 'fractions'])
  const inputParsed = engine.parse(clean(input))
  if (input.includes('frac') && inputParsed.isInteger) {
    return { isOk: inputParsed.isEqual(engine.parse(clean(goodAnswer))), feedback: `La fraction $${input}$ aurait pu être simplifiée en $${inputParsed.latex}$<br>` }
  } else {
    return { isOk: inputParsed.isEqual(engine.parse(clean(goodAnswer))) }
  }
}

/**
 * comparaison d'expressions'
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function calculCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const clean = generateCleaner(['virgules', 'espaces', 'parentheses', 'puissances', 'fractions'])
  const saisieClean = clean(input)
  const reponseClean = clean(goodAnswer)
  return { isOk: engine.parse(saisieClean).isSame(engine.parse(reponseClean)) }
}

/**
 * Pour comparer des sommes sans se préoccuper de l'ordre des termes
 * @param {string} input
 * @param {string} goodAnswer
 */
export function canonicalAddCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const clean = generateCleaner(['virgules', 'fractions', 'parentheses', 'puissances'])
  const saisieClean = clean(input)
  const reponseClean = clean(goodAnswer)
  return { isOk: engine.parse(reponseClean, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] }).isSame(engine.parse(saisieClean, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] })) }
}

/**
 * comparaison d'expressions factorisées'
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function factorisationCompare (input: string, goodAnswer:string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
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
/**
 * comparaison d'expressions developpées'
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export const developmentCompare = function (input: string, goodAnswer:string) {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
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
}
/**
 * comparaison de durées
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function hmsCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const clean = generateCleaner(['unites'])
  const cleanInput = clean(input)
  const inputHms = Hms.fromString(cleanInput)
  const goodAnswerHms = Hms.fromString(goodAnswer)
  return { isOk: goodAnswerHms.isTheSame(inputHms) }
}

/**
 * comparaison d'expressions développées
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function expandedFormCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const clean = generateCleaner(['espaces', 'virgules', 'fractions', 'parentheses'])
  input = clean(input)
  const saisieParsed = engine.parse(input).canonical
  const isSomme = ['Add', 'Subtract'].includes(saisieParsed.head as string)
  const isNumber = !isNaN(Number(saisieParsed.numericValue))
  const reponseParsed = engine.parse(clean(goodAnswer)).canonical
  const isOk = reponseParsed.isSame(saisieParsed) && (isSomme || isNumber)
  return { isOk }
}
/**
 * comparaison de nombres décimaux bon, rien de transcendant, on compare les strings nettoyées
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function decimalCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const clean = generateCleaner(['virgules', 'espaces', 'parentheses'])
  const saisieClean = clean(input)
  const reponseClean = clean(goodAnswer)
  return { isOk: saisieClean === reponseClean } // facile ! des Décimaux en string sont égaux si les strings sont égales.
}

/**
 * comparaison de nombres en écritures scientifiques @todo à vérifier celle-là, j'suis pas convaincu
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function scientificCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
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

/**
 * comparaison de textes... ben parce qu'il en faut une
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function textCompare (input: string, goodAnswer: string): ResultType {
  const cleaner = generateCleaner(['parentheses', 'mathrm'])
  input = cleaner(input)
  goodAnswer = cleaner(goodAnswer)
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  return { isOk: input === goodAnswer }
}

/**
 * comparaison de textes avec espaces comme son nom l'indique : avec un nettoyage adapté à la situation
 * Utilise String.localeCompare() pour les spécificité du langage local utilisé.
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function textWithSpacesCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  // @todo transformer tout ça en fonctions de nettoyage !!!
  const clean = generateCleaner(['virgules', 'parentheses', 'latex', 'doubleEspaces'])
  goodAnswer = clean(goodAnswer)
  input = clean(input)
  const result = input.localeCompare(goodAnswer)
  return { isOk: result === 0 }
}
/**
 * comparaison de textes sans s'occuper de la casse.
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function upperCaseCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  // @ToDo supprimer toutes les traces de LaTeX (gestion du - typographique...)
  input = input.replaceAll('\\lparen', '(').replaceAll('\\rparen', ')')
  return { isOk: input.toUpperCase() === goodAnswer.toUpperCase() }
}

/**
 * comparaison de fraction simplifiée
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function simplerFractionCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const cleaner = generateCleaner(['fractions', 'espaces'])
  goodAnswer = cleaner(goodAnswer)
  const goodAnswerParsed = engine.parse(goodAnswer, { canonical: false })
  const inputParsed = engine.parse(input, { canonical: false })
  if (inputParsed.head === 'Divide' && goodAnswerParsed.head === 'Divide') {
    const num = (inputParsed.json as [string, number, number])[1] as number
    const numGoodAnswer = (goodAnswerParsed.json as [string, number, number])[1] as number
    if (numGoodAnswer == null || typeof numGoodAnswer !== 'number') throw Error(`problème avec ${goodAnswer} dans simplerFractionCompare : fReponse.op1.numericValue est nul`)
    if (inputParsed.isEqual(goodAnswerParsed) && num && num < numGoodAnswer && Number.isInteger(num)) return { isOk: true }
  }
  return { isOk: false }
}

/**
 * comparaison de fraction en valeur acceptant la valeur décimale
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function equalFractionCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }

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
*/

  if (input.includes('\\frac')) {
    // La saisie est une fraction
    if (engine.parse(input).canonical.canonical.isEqual(fReponse.canonical)) return { isOk: true }
  } else {
    // La saisie n'est pas une fraction
    if (String(parseFloat(input)) === input) {
      // La saisie est un décimal
      const newFractionAvecDecimal = new FractionEtendue(parseFloat(input), 1)
      if (engine.parse(`${newFractionAvecDecimal.toLatex().replace('dfrac', 'frac')}`).canonical.isSame(fReponse.canonical)) return { isOk: true }
    } else {
      // La saisie n'est pas un décimal, peut-être possède-t-elle une racine carrée... comme dans 2N32-7
      let newFractionSansDecimal = texFractionFromString(input, 1) as string
      newFractionSansDecimal = cleaner(newFractionSansDecimal)
      if (engine.parse(newFractionSansDecimal).canonical.isSame(fReponse.canonical)) return { isOk: true }
    }
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
export function equalFractionCompareSansRadical (input: string, goodAnswer: string): ResultType {
  const cleaner = generateCleaner(['fractions'])
  input = cleaner(input)

  // Utilisation d'une expression régulière pour extraire le contenu de la deuxième accolade
  const contenuDeuxiemeAccolade: string | null = input.match(/\\frac{[^}]*}{(\\sqrt[^}]*)/)?.[1] || null

  if (contenuDeuxiemeAccolade === null) return { isOk: equalFractionCompare(input, goodAnswer).isOk }
  else if (!contenuDeuxiemeAccolade.includes('sqrt')) return { isOk: equalFractionCompare(input, goodAnswer).isOk }
  else return { isOk: false }
}

/**
 * comparaison de fraction à l'identique (pour les fraction irréductibles par exemple)
 * @param {string} input
 * @param {string} goodAnswer // Doit être au format texFSD ! le signe devant, numérateur et dénominateur positifs !!!
 *
 * @return ResultType
 */
export function fractionCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
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
 */
export function powerCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
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
 */
export function setsCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const clean = generateCleaner(['virgules'])
  // const cleanUp = (s: string) => s.replace('{.}', '.').replace(',', '.') // @fixme vérifier si on a besoin d'éliminer ce {.} ? si oui, l'intégrer au cleauner 'virgules'
  const elements1 = clean(input).split(';').sort((a: string, b: string) => Number(a) - Number(b))
  const elements2 = clean(goodAnswer).split(';').sort((a: string, b: string) => Number(a) - Number(b))
  if (elements1.length !== elements2.length) return { isOk: false }
  let ok = true
  for (let i = 0; i < elements1.length; i++) {
    if (Math.abs(Number(elements1[i].replace(',', '.')) - Number(elements2[i].replace(',', '.'))) > 0.1) {
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
 */
export function intervalsCompare (input: string, goodAnswer: string) {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const clean = generateCleaner(['virgules', 'parentheses', 'espaces'])
  input = clean(input)
  goodAnswer = clean(goodAnswer).replaceAll('bigcup', 'cup').replaceAll('bigcap', 'cap')
  let isOk1: boolean = true
  let isOk2: boolean = true
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
      const borneOuOp = engine.parse(borneAndOpSaisie[i])
      const borneOuOpR = engine.parse(borneAndOpReponse[i])
      if (!borneOuOp.isEqual(borneOuOpR)) {
        isOk1 = false
        if (['\\cup', '\\cap'].includes(borneAndOpSaisie[i])) {
          feedback += `Il y a une erreur avec l'opérateur : $${borneAndOpSaisie[i]}$.<br>`
        } else {
          feedback += `Il y a une erreur avec la valeur : $${borneAndOpSaisie[i]}$.<br>`
        }
      }
    }
    // on teste maintenant les crochets
    for (i = 0; i < crochetsSaisie.length; i++) {
      if (crochetsSaisie[i] !== crochetsReponse[i]) {
        isOk2 = false
        feedback += `Le crochet placé en position ${i + 1} est mal orienté.<br>`
      }
    }
    return { isOk: isOk1 && isOk2, feedback }
  }
  return { isOk: false, feedback: 'Il faut donner un intervalle ou une réunion d\'intervalles' }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%% Fonctions dont la signature est spéciale %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**
 * comparaison d'expression développées et réduite pour les tests d'Éric Elter
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function expandedAndReductedCompare (input: string, goodAnswer: {expr: string, strict: boolean}): ResultType {
  const expr = goodAnswer.expr
  let clean
  let feedback = ''
  if (!goodAnswer.strict) {
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
}

/**
 * Comparaison de chaînes (principalement des noms de classes
 * @param {string} input ce que saisit l'élève
 * @param {{value: string, nombre:boolean}} goodAnswer value est ce qui est attendu, si nombre est true, on compte faux l'absence de s quand il en faut un et la présence de s quand il n'y en a pas besoin
 * si nombre est false, on compte juste une réponse au pluriel ou au singulier quelque soit la réponse attendue, mais on met un feedback si le pluriel ou le singulier n'est pas respecté
 */
export function numerationCompare (input: string, goodAnswer: {value: string, nombre: boolean}): ResultType {
// normalement, il n'y a rien à nettoyer au niveau de l'input ou de goodAnswer
  const clean = generateCleaner(['latex'])
  const saisie: string[] = clean(input).toLowerCase().split(' ')
  const answer: string[] = goodAnswer.value.toLowerCase().split(' ')
  let result: boolean
  let feedback: string = ''
  if (goodAnswer.nombre) {
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
 * @param {{value: Grandeur, precision: number}} goodAnswer @todo est-il possible d'avoir un string et d'utiliser comme pour Hms un Grandeur.fromString() ?
 * @return ResultType
 */
export function unitsCompare (input: string, goodAnswer: {grandeur: Grandeur, precision: number }): {
  isOk: boolean,
  feedback?: string
} {
  input = input.replace('^\\circ', '°').replace('\\degree', '°')
  const cleaner = generateCleaner(['virgules', 'espaces', 'fractions', 'parentheses'])
  const inputGrandeur = inputToGrandeur(cleaner(input))
  const goodAnswerGrandeur = goodAnswer.grandeur
  if (inputGrandeur) {
    if (inputGrandeur.uniteDeReference !== goodAnswerGrandeur.uniteDeReference) {
      return { isOk: false, feedback: `Il faut donner la réponse en $${goodAnswerGrandeur.latexUnit}$.` }
    }
    if (goodAnswer.precision !== undefined) {
      if (inputGrandeur.estUneApproximation(goodAnswerGrandeur, goodAnswer.precision)) {
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
    const inputWithAddedUnit = new Grandeur(inputNumber, goodAnswer.grandeur.unite)
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
 * @param {{borneInf: number, borneSup: number}} goodAnswer @todo idem ci-dessus, avoir un Intervalle.fromString() qui donne cet objet à partir de ']3.4;5.6]' par exemple
 * @return ResultType
 */
export function intervalStrictCompare (input: string, goodAnswer: { borneInf: number, borneSup: number }): {
  isOk: boolean,
  feedback?: string
} {
  // Si on veut accepter une expressio :
  // const inputNumber = Number(engine.parse(cleanStringBeforeParse(input)).N())
  const clean = generateCleaner(['virgules', 'fractions', 'espaces'])
  const inputNumber = Number(clean(input))
  if (Number.isNaN(inputNumber)) return { isOk: false }
  if (inputNumber > goodAnswer.borneInf && inputNumber < goodAnswer.borneSup) return { isOk: true }
  return { isOk: false }
}

/**
 * vérifie qu'une valeur est dans un intervalle large.
 * @param {string} input
 * @param {{borneInf: number, borneSup: number}} goodAnswer @todo idem ci-dessus, avoir un Intervalle.fromString() qui donne cet objet à partir de ']3.4;5.6]' par exemple
 * @return ResultType
 */
export function intervalCompare (input: string, goodAnswer: { borneInf: number, borneSup: number }): {
  isOk: boolean,
  feedback?: string
} {
  const clean = generateCleaner(['virgules', 'espaces', 'fractions'])
  const inputNumber = Number(engine.parse(clean(input)).numericValue)
  if (Number.isNaN(inputNumber)) return { isOk: false }
  if (inputNumber >= goodAnswer.borneInf && inputNumber <= goodAnswer.borneSup) return { isOk: true }
  return { isOk: false }
}

/**
 * comparaison de nombres entiers consécutifs
 * @param {string} entierInf
 * @param {string} entierSup
 * @param {string} valeurInter
 * @return ResultType
 */
export function consecutiveCompare (input: string, goodAnswer: {entierInf: number, entierSup: number, valeurInter?: number}): ResultType {
  let feedback = ''
  const [entierInf, valeurInter, entierSup] = input.includes('<') ? input.split('<').map(el => Number(engine.parse(el).numericValue)) : input.split('>').map(el => Number(engine.parse(el).numericValue)).sort((a: number, b:number) => a - b)
  if (!(Number.isInteger(Number(entierSup)) && Number.isInteger(Number(entierInf)))) {
    feedback = 'On attend comme réponse deux nombres entiers.'
    return { isOk: false, feedback }
  }
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
  const isOk2 = numberCompare(String(entierInf), String(goodAnswer.entierInf)).isOk && numberCompare(String(entierSup), String(goodAnswer.entierSup)).isOk
  return { isOk: isOk1 && isOk2, feedback: '' }
}

/**
 * Compare deux nombres avec une certaine tolérance
 * @param {string} input
 * @param {{attendu: string, tolerance: number}} goodAnswer
 */
export function approximatelyCompare (input: string, goodAnswer:{attendu: string, tolerance: number}) {
  const cleaner = generateCleaner(['virgules', 'fractions', 'espaces', 'parentheses', 'puissances'])
  const saisieClean = Number(engine.parse(cleaner(input)).numericValue)
  const answerClean = Number(engine.parse(cleaner(goodAnswer.attendu)).numericValue)
  return { isOk: Math.abs(saisieClean - answerClean) < goodAnswer.tolerance }
}

/**
 * Comparaison de fonction f(x)
 * @param {string} input
 * @param {{fonction: string, variable: string}} goodAnswer
 */
export function functionCompare (input: string, goodAnswer: {fonction: string, variable: string} = { fonction: '', variable: 'x' }): ResultType {
  if (typeof goodAnswer === 'string') {
    goodAnswer = { fonction: goodAnswer, variable: 'x' }
  }
  const clean = generateCleaner(['virgules', 'parentheses', 'fractions', 'divisions'])

  const cleanInput = clean(input)
  const inputParsed = engine.parse(cleanInput)
  const inputFn = inputParsed.compile()
  const cleanAnswer = clean(goodAnswer.fonction)
  const goodAnswerFn = engine.parse(cleanAnswer).compile()

  let isOk = true
  if (inputFn == null || goodAnswerFn == null) throw Error(`functionCompare : La saisie ou la bonne réponse ne sont pas des fonctions (saisie : ${input} et réponse attendue : ${goodAnswer}`)
  const [a, b, c] = [Math.random(), Math.random(), Math.random()]
  for (const x of [a, b, c]) {
    const variable = Object.fromEntries([[goodAnswer.variable, x]])
    const y1 = inputFn(variable)
    const y2 = goodAnswerFn(variable)
    isOk = isOk && Math.abs(y1 - y2) < 1e-10
  }
  return { isOk }
}

/**
 * Comparaison de fonction f(x,y) (ou tout autre variable) x et y étant les lettres par défaut
 * @param {string} input
 * @param {{fonction: string, variables: string[]}} goodAnswer
 */
export function functionXyCompare (input: string, goodAnswer: {fonction: string, variables: string[]} = { fonction: '', variables: ['x', 'y'] }): ResultType {
  if (typeof goodAnswer === 'string') {
    goodAnswer = { fonction: goodAnswer, variables: ['x', 'y'] }
  }
  const clean = generateCleaner(['espaces', 'virgules', 'parentheses', 'fractions', 'divisions'])
  // Pour l'instant les fonctions trigo saisies au clavier ne sont pas les fonction trigo latex.
  const cleanInput = clean(input)
  const inputParsed = engine.parse(cleanInput)

  const inputFn = inputParsed.compile()
  const cleanAnswer = clean(goodAnswer.fonction)
  const goodAnswerFn = engine.parse(cleanAnswer).compile()

  let isOk = true
  if (inputFn == null || goodAnswerFn == null) throw Error(`functionCompare : La saisie ou la bonne réponse ne sont pas des fonctions (saisie : ${input} et réponse attendue : ${goodAnswer}`)
  const [a, b, c] = [Math.random(), Math.random(), Math.random()]
  const [A, B, C] = [Math.random(), Math.random(), Math.random()]
  for (const x of [a, b, c]) {
    for (const y of [A, B, C]) {
      const variable = Object.fromEntries([[goodAnswer.variables[0], x], [goodAnswer.variables[1], y]])
      isOk = isOk && Math.abs(inputFn(variable) - goodAnswerFn(variable)) < 1e-10
    }
  }
  return { isOk }
}

/**
 * Comparaison d'égalités (pour l'instant strictement égal, il est prévu d'implémenter l'équivalence d'égalités)
 * @param {string} input
 * @param {{membre1: {fonction: string, variable?: string},membre2: {fonction: string, variable?: string},strict?: boolean}} goodAnswer
 *
 */
export function equalityCompare (input: string, goodAnswer: {membre1:{fonction: string, variable?: string}, membre2: {fonction: string, variable?: string}, strict?: boolean}):ResultType {
  const [m1, m2] = input.split('=')
  if (m1 == null || m2 == null) return { isOk: false, feedback: 'Une égalité est attendue' }
  if (goodAnswer.strict) {
    const { isOk: isOk1 } = functionCompare(m1, {
      fonction: goodAnswer.membre1.fonction,
      variable: goodAnswer.membre1.variable ?? 'x'
    })
    const { isOk: isOk2 } = functionCompare(m2, {
      fonction: goodAnswer.membre2.fonction,
      variable: goodAnswer.membre2.variable ?? 'x'
    })
    return { isOk: isOk1 && isOk2 }
  } else {
    // @todo à implémenter : permettre de saisir une égalité et de vérifier l'équivalence avec celle proposée comme bonne réponse.
    // En attendant, je recopie le code de strict = true
    const { isOk: isOk1 } = functionCompare(m1, {
      fonction: goodAnswer.membre1.fonction,
      variable: goodAnswer.membre1.variable ?? 'x'
    })
    const { isOk: isOk2 } = functionCompare(m2, {
      fonction: goodAnswer.membre2.fonction,
      variable: goodAnswer.membre2.variable ?? 'x'
    })
    return {
      isOk: isOk1 && isOk2,
      feedback: ''
    }
  }
}
/**
   * L'appelant doit impérativement fournir un Array de Rule @see https://cortexjs.io/compute-engine/guides/patterns-and-rules/
   * @param {string} input
   * @param {{expr: string, rules: Rule[]}} goodAnswer
   */
export function compareWithRules (input: string, goodAnswer: {expr: string, rules: Rule[]}): ResultType {
  const rule = engine.rules(goodAnswer.rules)
  const saisie = engine.parse(input).replace(rule)
  const answer = engine.parse(goodAnswer.expr).replace(rule)
  if (saisie && answer) return { isOk: saisie.isSame(answer), feedback: '' }
  else return { isOk: false, feedback: '' }
}
