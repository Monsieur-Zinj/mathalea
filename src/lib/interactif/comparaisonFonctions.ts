import { ComputeEngine } from '@cortex-js/compute-engine'
import FractionEtendue from '../../modules/FractionEtendue'
import Grandeur from '../../modules/Grandeur'
import Hms from '../../modules/Hms'

const engine = new ComputeEngine()
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
 */
export function cleanStringBeforeParse (aString: string) {
  if (typeof aString !== 'string') {
    aString = String(aString)
  }
  return aString.replaceAll(',', '.') // CE n'aime pas les virgules, il veut des . (on pourrait lui dire que le séparateur décimal est la virgule)
    .replaceAll('dfrac', 'frac') // CE n'aime pas \dfrac
    .replaceAll('²', '^2') // '²' c'est pas correct en latex !
    .replaceAll('³', '^3') // '³' non plus
    .replaceAll('^{}', '') // les exposants vides, il n'aime pas ça non plus
    .replaceAll('\\,', '') // pourquoi laisser des espaces indésirables si on peut les enlever ?
    .replaceAll('{,}', '.') // toujours cette histoire de virgule (celle-là, elle vient sans doute d'un texNombre() !
    .replaceAll(/\s/g, '') // encore des espaces à virer ?
    .replace(/\\lparen(\+?-?\d+)\\rparen/, '$1') // (+3) => +3 car CE ne sait pas comparer -5 et 5
    .replaceAll('\\lparen', '(').replaceAll('\\rparen', ')')
}

type CleaningOperation = 'fractions' | 'virgules' | 'espaces' | 'parentheses' | 'puissances'

/**
 * Nettoie la saisie des \\dfrac en les remplaçant par des \frac comprises par ComputeEngine
 * @param {string} str
 */
function cleanFractions (str: string): string {
  return str.replaceAll(/dfrac/g, 'frac')
}

/**
 * Nettoie la saisie des virgules décimales en les remplaçant par des points.
 * @param {string} str
 */
function cleanComas (str: string): string {
  return str.replaceAll(/\{,}/g, '.').replaceAll(/,/g, '.')
}

/**
 * Nettoie la saisie des espaces
 * @param {string} str
 */
function cleanSpaces (str: string): string {
  return str.replaceAll(/\s/g, '').replaceAll(/\\,/g, '')
}

/**
 * Nettoie les parenthèses en remplaçant par celles supportées par le ComputeEngine
 * @param {string} str
 */
function cleanParenthses (str: string): string {
  return str.replaceAll(/\\left\((\+?-?\d+)\\right\)/g, '$1').replaceAll('\\lparen', '(').replaceAll('\\rparen', ')')
}

/**
 * Nettoie le latex \text{} mis pour séparer le nombre de l'unité en mode texte
 * @param {string} str
 */
function cleanUnite (str: string): string {
  return str.replaceAll('{\\:\\text{', '').replaceAll('}\\:}', '')
}

/**
 * Nettoie tout ce qui peut arriver à l'utilisation des puissances
  * @param {sting} str
 */
function cleanPuissances (str: string): string {
  return str.replaceAll('²', '^2') // '²' c'est pas correct en latex !
    .replaceAll('³', '^3') // '³' non plus
    .replaceAll('^{}', '') // les exposants vides, il n'aime pas ça non plus
}

function generateCleaner (operations: CleaningOperation[]): (str: string) => string {
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
        return cleanPuissances
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
  const clean = generateCleaner(['espaces', 'virgules', 'parentheses'])
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
  const saisieClean = cleanStringBeforeParse(input)
  const reponseClean = cleanStringBeforeParse(goodAnswer)
  return { isOk: engine.parse(saisieClean).isSame(engine.parse(reponseClean)) }
}

export function canonicalAddCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const saisieClean = cleanStringBeforeParse(input)
  const reponseClean = cleanStringBeforeParse(goodAnswer)
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
  const aCleaned = input.replaceAll('²', '^2').replaceAll(',', '.').replaceAll('dfrac', 'frac')
  const bCleaned = goodAnswer.replaceAll('²', '^2').replaceAll(',', '.').replaceAll('dfrac', 'frac')
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
    isOk2 = ['Multiply', 'Square', 'Power', 'Divide'].includes(head)
  }
  return { isOk: isOk1 && isOk2 }
}
/**
 * comparaison d'expressions developpées'
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export const developpementCompare = function (input: string, goodAnswer:string) {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const aCleaned = input.replaceAll('²', '^2').replaceAll(',', '.').replaceAll('dfrac', 'frac')
  const bCleaned = goodAnswer.replaceAll('²', '^2').replaceAll(',', '.').replaceAll('dfrac', 'frac')
  const saisieParsed = engine.parse(aCleaned, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] })
  const reponseParsed = engine.parse(bCleaned, { canonical: ['InvisibleOperator', 'Multiply', 'Number', 'Add', 'Flatten', 'Order'] })
  if (saisieParsed == null || reponseParsed == null) {
    window.notify('factorisationCompare a rencontré un problème en analysant la réponse ou la saisie ', { saisie: input, reponse: goodAnswer })
    return { isOk: false }
  }
  const saisieDev = engine.box(['ExpandAll', saisieParsed]).evaluate().simplify().canonical
  console.log(`Commence par une addition ou une soustraction : ${['Add', 'Subtract'].includes(String(saisieParsed.head)) ? 'oui' : 'non'}`)
  console.log(`Si je développe j'obtiens pareil qu'en simplifiant: ${saisieDev.isSame(saisieParsed.simplify().canonical) ? 'oui' : 'non'}`)
  console.log(`La saisie est égale à la réponse une fois mises dans l'ordre canonique avec invisibleOperator : ${saisieParsed.isEqual(reponseParsed) ? 'oui' : 'non'}`)
  console.log(`La réponse attendue : ${reponseParsed.latex} et la saisie : ${saisieParsed.latex}`)
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
  const cleanInput = cleanUnite(input)
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
export function formeDeveloppeeCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  input = cleanStringBeforeParse(input)
  const saisieParsed = engine.parse(input).canonical
  const isSomme = ['Add', 'Subtract'].includes(saisieParsed.head as string)
  const isNumber = !isNaN(Number(saisieParsed.numericValue))
  const reponseParsed = engine.parse(cleanStringBeforeParse(goodAnswer)).canonical
  const isOk = reponseParsed.isSame(saisieParsed) && (isSomme || isNumber)
  return { isOk }
}

/**
 * comparaison d'expression développées et réduite pour les tests d'Éric Elter
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function formeDeveloppeeEtReduiteCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const clean = generateCleaner(['fractions', 'virgules', 'puissances'])
  const saisie = engine.box(['CanonicalOrder', engine.parse(clean(input))])
  const answer = engine.box(['CanonicalOrder', engine.parse(clean(goodAnswer))])
  const isOk1 = answer.isSame(saisie)
  const isOk2 = engine.box(['CanonicalOrder', engine.parse(clean(input)).simplify()]).isSame(answer)
  return { isOk: isOk1 && isOk2, feedback: isOk1 && isOk2 ? '' : isOk2 ? 'L\'expression est développée correctement mais pas réduite' : '' }
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
  const saisieClean = cleanStringBeforeParse(input)
  const reponseClean = cleanStringBeforeParse(goodAnswer)
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
  const saisieClean = cleanStringBeforeParse(input)
  const reponseClean = cleanStringBeforeParse(goodAnswer)
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
export function texteCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  return { isOk: input === goodAnswer }
}

/**
 * comparaison de textes avec espaces comme son nom l'indique : avec un nettoyage adapté à la situation
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function texteAvecEspacesCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  // parce qu'il vaut mieux être trop prudent que pas assez, j'applique le même traitement à goodAnswer qu'à input ;-)
  goodAnswer = goodAnswer.replaceAll('\\:', ' ') // Suppression des espaces LaTeX (présents quand on met des crochets pour les segments)
  goodAnswer = goodAnswer.replaceAll('\\left\\lbrack ', '[').replaceAll('\\right\\rbrack ', ']') // Suppression des crochets LaTeX (pour les segments)
  while (goodAnswer.includes('  ')) goodAnswer = goodAnswer.replace('  ', ' ') // Pour enlever tous les doubles espaces
  goodAnswer = goodAnswer.replaceAll('\\text{', '').replaceAll('}', '').replaceAll('$', '') // Supprimer le \text{....} mis par MathLive
  if (goodAnswer[0] === ' ') goodAnswer = goodAnswer.substring(1, goodAnswer.length) // Supprimer l'eventuel espace en début de ligne
  if (goodAnswer[goodAnswer.length - 1] === ' ') goodAnswer = goodAnswer.substring(0, goodAnswer.length - 1) // Supprimer l'éventuel espace en fin de ligne

  input = input.replaceAll('\\:', ' ') // Suppression des espaces LaTeX (présents quand on met des crochets pour les segments)
  input = input.replaceAll('\\left\\lbrack ', '[').replaceAll('\\right\\rbrack ', ']') // Suppression des crochets LaTeX (pour les segments)
  while (input.includes('  ')) input = input.replace('  ', ' ') // Pour enlever tous les doubles espaces
  input = input.replaceAll('\\text{', '').replaceAll('}', '').replaceAll('$', '') // Supprimer le \text{....} mis par MathLive
  if (input[0] === ' ') input = input.substring(1, input.length) // Supprimer l'eventuel espace en début de ligne
  if (input[input.length - 1] === ' ') input = input.substring(0, input.length - 1) // Supprimer l'éventuel espace en fin de ligne
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
export function fractionPlusSimpleCompare (input: string, goodAnswer: string): ResultType {
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
    if (numGoodAnswer == null || typeof numGoodAnswer !== 'number') throw Error(`problème avec ${goodAnswer} dans fractionPlusSimpleCompare : fReponse.op1.numericValue est nul`)
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
export function fractionEgaleCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const cleaner = generateCleaner(['fractions', 'virgules', 'espaces'])
  goodAnswer = cleaner(goodAnswer)
  const fReponse = engine.parse(goodAnswer)
  if (!isNaN(parseFloat(cleanStringBeforeParse(input)))) {
    // La saisie est faite sous forme décimale
    const newFraction = new FractionEtendue(parseFloat(cleanStringBeforeParse(input)))
    // On la convertit en fraction
    if (engine.parse(`${newFraction.toLatex().replace('dfrac', 'frac')}`).canonical.isSame(fReponse.canonical)) return { isOk: true }
  } else {
    // La saisie est une fraction
    if (engine.parse(cleanStringBeforeParse(input)).canonical.canonical.isEqual(fReponse.canonical)) return { isOk: true }
  }
  return { isOk: false }
}

/**
 * comparaison de fraction à l'identique (pour les fraction irréductibles par exemple)
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function fractionCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const clean = generateCleaner(['espaces', 'fractions'])
  const inputParsed = engine.parse(clean(input), { canonical: false })
  const goodAnswerParsed = engine.parse(clean(goodAnswer), { canonical: false })
  return { isOk: inputParsed.isSame(goodAnswerParsed) }
}

/**
 * comparaison d'expression de puissances
 * @param {string} input
 * @param {string} goodAnswer
 * @return ResultType
 */
export function puissanceCompare (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  let formatOK: boolean = false
  let formatKO: boolean = false
  const nombreSaisi = input.split('^')
  const mantisseSaisie = nombreSaisi[0].replace(/[()]/g, '')
  // const mantisseS = Number(mantisseSaisie)
  const expoSaisi = nombreSaisi[1] ? nombreSaisi[1].replace(/[{}]/g, '') : '1'
  // const expoS = Number(expoSaisi)
  const nombreAttendu = goodAnswer.split('^')
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

export default engine

/**
 * Comparaison d'ensembles de solutions séparés par des ; dans des {} comme {-5;4;10}
 * @param input
 * @param goodAnswer
 * @return ResultType
 */
export function compareEnsembles (input: string, goodAnswer: string): ResultType {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  const cleanUp = (s: string) => s.replace('{.}', '.').replace(',', '.')
  const elements1 = cleanUp(input).split(';').sort((a: string, b: string) => Number(a) - Number(b))
  const elements2 = cleanUp(goodAnswer).split(';').sort((a: string, b: string) => Number(a) - Number(b))
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
export function compareIntervalles (input: string, goodAnswer: string) {
  if (typeof goodAnswer !== 'string') {
    goodAnswer = String(goodAnswer)
  }
  let result = true
  const cleanUp = (s: string) => s.replaceAll('{,}', '.').replaceAll(',', '.')
  input = cleanUp(input)
  goodAnswer = cleanUp(goodAnswer)
  const intervallesSaisie = input.match(/\[-?\d.?\d?;-?\d.?\d?]/g)
  const intervallesReponse = goodAnswer.match(/\[-?\d.?\d?;-?\d.?\d?]/g)
  if (intervallesReponse != null && intervallesSaisie != null) {
    for (let i = 0; i < intervallesReponse.length; i++) {
      const [borneInfRep, borneSupRep] = intervallesReponse[i].match(/-?\d\.?\d?/g) as string[]
      const [borneInfSai, borneSupSai] = intervallesSaisie[i].match(/-?\d\.?\d?/g) as string[]
      if (Math.abs(Number(borneInfSai) - Number(borneInfRep)) > 0.1 || Math.abs(Number(borneSupSai) - Number(borneSupRep)) > 0.1) {
        result = false
      }
    }
    return { isOk: result }
  }
  return { isOk: false }
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%% Fonctions dont la signature est spéciale %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/**
 * comparaison de grandeurs avec une unité
 * @param {string} input
 * @param {{value: Grandeur, precision: number}} goodAnswer @todo est-il possible d'avoir un string et d'utiliser comme pour Hms un Grandeur.fromString() ?
 * @return ResultType
 */
export function unitesCompare (input: string, goodAnswer: {grandeur: Grandeur, precision: number }): {
  isOk: boolean,
  feedback?: string
} {
  input = input.replace('\\degree', '°')
  const cleaner = generateCleaner(['virgules', 'espaces', 'fractions', 'parentheses'])
  const inputGrandeur = inputToGrandeur(cleaner(input))
  const goodAnswerGrandeur = goodAnswer.grandeur
  if (inputGrandeur) {
    console.log(`grandeur passée : ${JSON.stringify(inputGrandeur)} goodAnswer : ${JSON.stringify(goodAnswer.grandeur)} et precision passée à estUneApproximation() : ${goodAnswer.precision}`)
    if (goodAnswer.precision !== undefined) {
      if (inputGrandeur.estUneApproximation(goodAnswerGrandeur, goodAnswer.precision)) {
        return { isOk: true }
      } else {
        return { isOk: false }
      }
    } else {
      if (inputGrandeur.estEgal(goodAnswerGrandeur)) {
        return { isOk: true }
      } else {
        return { isOk: false }
      }
    }
  } else {
    return { isOk: false, feedback: 'essaieEncoreAvecUneSeuleUnite' }
  }
}

/**
 * comparaison de valeur dans un intervalle strict.
 * @param {string} input
 * @param {{borneInf: number, borneSup: number}} goodAnswer @todo idem ci-dessus, avoir un Intervalle.fromString() qui donne cet objet à partir de ']3.4;5.6]' par exemple
 * @return ResultType
 */
export function intervallleStrictCompare (input: string, goodAnswer: { borneInf: number, borneSup: number }): {
  isOk: boolean,
  feedback?: string
} {
  // Si on veut accepter une expressio :
  // const inputNumber = Number(engine.parse(cleanStringBeforeParse(input)).N())
  const inputNumber = Number(cleanStringBeforeParse(input))
  if (Number.isNaN(inputNumber)) return { isOk: false }
  if (inputNumber > goodAnswer.borneInf && inputNumber < goodAnswer.borneSup) return { isOk: true }
  return { isOk: false }
}

/**
 * comparaison de valeur dans un intervalle large.
 * @param {string} input
 * @param {{borneInf: number, borneSup: number}} goodAnswer @todo idem ci-dessus, avoir un Intervalle.fromString() qui donne cet objet à partir de ']3.4;5.6]' par exemple
 * @return ResultType
 */
export function intervallleCompare (input: string, goodAnswer: { borneInf: number, borneSup: number }): {
  isOk: boolean,
  feedback?: string
} {
  const inputNumber = Number(engine.parse(cleanStringBeforeParse(input)).numericValue)
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
export function consecutifsCompare (input: string, goodAnswer: {entierInf: number, entierSup: number, valeurInter?: number}): ResultType {
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
export function environEgalCompare (input: string, goodAnswer:{attendu: string, tolerance: number}) {
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
export function fonctionCompare (input: string, goodAnswer: {fonction: string, variable: string} = { fonction: '', variable: 'x' }): ResultType {
  if (typeof goodAnswer === 'string') {
    goodAnswer = { fonction: goodAnswer, variable: 'x' }
  }
  const clean = generateCleaner(['espaces', 'virgules', 'parentheses', 'fractions'])
  const cleanInput = clean(input)
  const inputParsed = engine.parse(cleanInput)
  const inputFn = inputParsed.compile()
  const cleanAnswer = clean(goodAnswer.fonction)
  const goodAnswerFn = engine.parse(cleanAnswer).compile()

  let isOk = true
  if (inputFn == null || goodAnswerFn == null) throw Error(`fonctionCompare : La saisie ou la bonne réponse ne sont pas des fonctions (saisie : ${input} et réponse attendue : ${goodAnswer}`)
  const [a, b, c] = [Math.random(), Math.random(), Math.random()]
  for (const x of [a, b, c]) {
    const variable = Object.fromEntries([[goodAnswer.variable, x]])
    isOk = isOk && Math.abs(inputFn(variable) - goodAnswerFn(variable)) < 1e-10
  }
  return { isOk }
}

/**
 * Comparaison d'égalités (pour l'instant strictement égal, il est prévu d'implémenter l'équivalence d'égalités)
 * @param {string} input
 * @param {{membre1: {fonction: string, variable?: string},membre2: {fonction: string, variable?: string},strict?: boolean}} goodAnswer
 *
 */
export function egaliteCompare (input: string, goodAnswer: {membre1:{fonction: string, variable?: string}, membre2: {fonction: string, variable?: string}, strict?: boolean}):ResultType {
  const [m1, m2] = input.split('=')
  if (m1 == null || m2 == null) return { isOk: false, feedback: 'Une égalité est attendue' }
  if (goodAnswer.strict) {
    const { isOk: isOk1 } = fonctionCompare(m1, { fonction: goodAnswer.membre1.fonction, variable: goodAnswer.membre1.variable ?? 'x' })
    const { isOk: isOk2 } = fonctionCompare(m2, { fonction: goodAnswer.membre2.fonction, variable: goodAnswer.membre2.variable ?? 'x' })
    return { isOk: isOk1 && isOk2 }
  } else {
    // @todo à implémenter : permettre de saisir une égalité et de vérifier l'équivalence avec celle proposée comme bonne réponse.
    // En attendant, je recopie le code de strict = true
    const { isOk: isOk1 } = fonctionCompare(m1, { fonction: goodAnswer.membre1.fonction, variable: goodAnswer.membre1.variable ?? 'x' })
    const { isOk: isOk2 } = fonctionCompare(m2, { fonction: goodAnswer.membre2.fonction, variable: goodAnswer.membre2.variable ?? 'x' })
    return { isOk: isOk1 && isOk2, feedback: 'La réponse serait peut-être acceptée en mode équivalence, mais nous ne l\'avaons pas encore programmé' }
  }
}
