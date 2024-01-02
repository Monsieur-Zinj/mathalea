import { ComputeEngine } from '@cortex-js/compute-engine'
import FractionEtendue from '../../modules/FractionEtendue'
import Grandeur from '../../modules/Grandeur'
import Hms from '../../modules/Hms'

const engine = new ComputeEngine()

/**
 * Une fonction pour nettoyer les saisies sortant des inputs afin d'être utilisées sans erreur par le parser de ComputeEngine
 * Peut nettoyer aussi la réponse fournie par l'auteur indélicat d'un exercice (par exemple, celui qui passe du texNombre()...)
 * @param {string} aString // ce qui vient en entrée
 * @return {string} la chaine de caractère dont on espère que ComputeEngine (CE) en digérera correctement le contenu.
 */
export function cleanStringBeforeParse (aString: string) {
  return aString.replaceAll(',', '.') // CE n'aime pas les virgules, il veut des . (on pourrait lui dire que le séparateur décimal est la virgule)
    .replaceAll('dfrac', 'frac') // CE n'aime pas \dfrac
    .replaceAll('²', '^2') // '²' c'est pas correct en latex !
    .replaceAll('³', '^3') // '³' non plus
    .replaceAll('^{}', '') // les exposants vides, il n'aime pas ça non plus
    .replaceAll('\\,', '') // pourquoi laisser des espaces indésirables si on peut les enlever ?
    .replaceAll('{,}', '.') // toujours cette histoire de virgule (celle-là, elle vient sans doute d'un texNombre() !
    .replaceAll(/\s/g, '') // encore des espaces à virer ?
    .replace(/\\lparen(\+?-?\d+)\\rparen/, '$1') // (+3) => +3 car CE ne sait pas comparer -5 et 5
}

type CleaningOperation = 'fractions' | 'virgules' | 'espaces' | 'parentheses'

function cleanFractions (str: string): string {
  return str.replaceAll(/dfrac/g, 'frac')
}

function cleanComas (str: string): string {
  return str.replaceAll(/\{,}/g, '.').replaceAll(/,/g, '.')
}

function cleanSpaces (str: string): string {
  return str.replaceAll(/\s/g, '').replaceAll(/\\,/g, '')
}

function cleanParenthses (str: string): string {
  return str.replaceAll(/\\left\((\+?-?\d+)\\right\)/g, '$1')
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
      default:
        throw new Error(`Unsupported cleaning operation: ${operation}`)
    }
  })

  return (str: string) => cleaningFunctions.reduce((result, cleaningFn) => cleaningFn(result), str)
}

/**
 * fonction initialement dans mathlive.js, j'en ai besoin ici, et plus dans mathlive.js
 * @param {string} input la chaine qui contient le nombre avec son unité
 * @return {Grandeur|false} l'objet de type Grandeur qui contient la valeur et l'unité... ou false si c'est pas une grandeur.
 */
function inputToGrandeur (input: string): Grandeur | false {
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
 * comparaison de nombres
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function numberCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  const clean = generateCleaner(['espaces', 'virgules', 'parentheses'])
  return { isOk: engine.parse(clean(input)).isEqual(engine.parse(clean(goodAnswer))) }
}

/**
 * comparaison d'expressions'
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function calculCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  const saisieClean = cleanStringBeforeParse(input)
  const reponseClean = cleanStringBeforeParse(goodAnswer)
  return { isOk: engine.parse(saisieClean).isSame(engine.parse(reponseClean)) }
}

/**
 * comparaison de durées
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function hmsCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  const hmsSaisie = Hms.fromString(cleanStringBeforeParse(input))
  const hmsReponse = Hms.fromString(cleanStringBeforeParse(goodAnswer))
  return { isOk: hmsReponse.isTheSame(hmsSaisie) }
}

/**
 * comparaison d'expressions développées
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function formeDeveloppeeCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  input = cleanStringBeforeParse(input)
  const saisieParsed = engine.parse(input).canonical
  const isSomme = ['Add', 'Subtract'].includes(saisieParsed.head as string)
  const isNumber = !isNaN(Number(saisieParsed.numericValue))
  const reponseParsed = engine.parse(cleanStringBeforeParse(goodAnswer)).canonical
  const isOk = reponseParsed.isSame(saisieParsed) && (isSomme || isNumber)
  return { isOk }
}

/**
 * comparaison d'expression développées pour les tests d'Éric Elter
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function formeDeveloppeeParEECompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  input = cleanStringBeforeParse(input)
  const regleSuppressionInvisibleOperator = engine.rules([{
    match: ['InvisibleOperator', '_x', '_y'],
    replace: ['Multiply', '_x', '_y']
  }])
  let saisieNonCanonique = engine.box(['CanonicalOrder', engine.parse(input, { canonical: false })])
  saisieNonCanonique = saisieNonCanonique.replace(regleSuppressionInvisibleOperator) ?? saisieNonCanonique
  let reponseNonCanonique = engine.box(['CanonicalOrder', engine.parse(goodAnswer, { canonical: false })])
  reponseNonCanonique = reponseNonCanonique.replace(regleSuppressionInvisibleOperator) ?? reponseNonCanonique
  return { isOk: saisieNonCanonique.isSame(reponseNonCanonique) }
}

/**
 * comparaison de nombres décimaux bon, rien de transcendant, on compare les strings nettoyées
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function decimalCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  const saisieClean = cleanStringBeforeParse(String(input))
  const reponseClean = cleanStringBeforeParse(String(goodAnswer))
  return { isOk: saisieClean === reponseClean } // facile ! des Décimaux en string sont égaux si les strings sont égales.
}

/**
 * comparaison de nombres en écritures scientifiques @todo à vérifier celle-là, j'suis pas convaincu
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function scientificCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  const saisieClean = cleanStringBeforeParse(String(input))
  const reponseClean = cleanStringBeforeParse(String(goodAnswer))
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
 * @return {isOk: boolean, feedback?: string}
 */
export function texteCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  return { isOk: input === goodAnswer }
}

/**
 * comparaison de textes avec espaces comme son nom l'indique : avec un nettoyage adapté à la situation
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function texteAvecEspacesCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  input = input.replaceAll('\\:', ' ') // Suppression des espaces LaTeX (présents quand on met des crochets pour les segments)
  input = input.replaceAll('\\left\\lbrack ', '[').replaceAll('\\right\\rbrack ', ']') // Suppression des crochets LaTeX (pour les segments)
  while (input.includes('  ')) input = input.replace('  ', ' ') // Pour enlever tous les doubles espaces
  input = input.replaceAll('\\text{', '').replaceAll('}', '').replaceAll('$', '') // Supprimer le \text{....} mis par MathLive
  if (input[0] === ' ') input = input.substring(1, input.length) // Supprimer l'eventuel espace en début de ligne
  if (input[input.length - 1] === ' ') input = input.substring(0, input.length - 1) // Supprimer l'éventuel espace en fin de ligne
  return { isOk: input === goodAnswer }
}

/**
 * comparaison de textes sans s'occuper de la casse.
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function upperCaseCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  return { isOk: input.toUpperCase() === goodAnswer.toUpperCase() }
}

/**
 * comparaison de fraction simplifiée
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function fractionPlusSimpleCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  const fReponse = engine.parse(goodAnswer, { canonical: false })
  const saisieParsed = engine.parse(input, { canonical: true })
  if (saisieParsed.head === 'Number' && Array.isArray(saisieParsed.numericValue) && fReponse.head === 'Divide') {
    const num = saisieParsed.numericValue[0]
    const numReponse = fReponse.op1.numericValue
    if (numReponse == null || typeof numReponse !== 'number') throw Error(`problème avec ${goodAnswer} dans fractionPlusSimpleCompare : fReponse.op1.numericValue est nul`)
    if (saisieParsed.canonical.isSame(fReponse.canonical) && num && num < numReponse && Number.isInteger(num)) return { isOk: true }
  }
  return { isOk: false }
}

/**
 * comparaison de fraction en valeur acceptant la valeur décimale
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function fractionEgaleCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  const fReponse = engine.parse(goodAnswer)
  if (!isNaN(parseFloat(cleanStringBeforeParse(input)))) {
    console.log(`La saisie est faite sous forme décimale : ${input}`)
    const newFraction = new FractionEtendue(parseFloat(cleanStringBeforeParse(input)))
    console.log(`On l'a convertie en fraction : ${newFraction.toLatex().replace('dfrac', 'frac')}`)
    if (engine.parse(`${newFraction.toLatex().replace('dfrac', 'frac')}`).canonical.isSame(fReponse.canonical)) return { isOk: true }
  } else {
    console.log(`La saisie est une fraction : ${input}`)
    if (engine.parse(cleanStringBeforeParse(input)).canonical.canonical.isEqual(fReponse.canonical)) return { isOk: true }
  }
  return { isOk: false }
}

/**
 * comparaison de fraction à l'identique (pour les fraction irréductibles par exemple)
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function fractionCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
  const clean = generateCleaner(['espaces', 'fractions'])
  const inputParsed = engine.parse(clean(input), { canonical: false })
  const goodAnswerParsed = engine.parse(clean(goodAnswer), { canonical: false })
  console.log(inputParsed, goodAnswerParsed)
  return { isOk: inputParsed.isSame(goodAnswerParsed) }
}

/**
 * comparaison de grandeurs avec une unité
 * @param {string} input
 * @param {{value: Grandeur, precision: number}} goodAnswer @todo est-il possible d'avoir un string et d'utiliser comme pour Hms un Grandeur.fromString() ?
 * @return {isOk: boolean, feedback?: string}
 */
export function unitesCompare (input: string, goodAnswer: { value: Grandeur, precision: number }): {
    isOk: boolean,
    feedback?: string
} {
  const grandeurSaisie = inputToGrandeur(cleanStringBeforeParse(input))
  const grandeurReponse = goodAnswer.value
  const precision = goodAnswer.precision
  if (grandeurSaisie) {
    if (grandeurSaisie.estEgal(grandeurReponse)) return { isOk: true }
    else if (precision && grandeurSaisie.estUneApproximation(grandeurReponse, precision)) {
      return {
        isOk: false,
        feedback: 'Erreur d\'arrondi'
      }
    } else return { isOk: false }
  } else {
    if ((input === '') || isNaN(parseFloat(input.replace(',', '.')))) {
      return { isOk: false, feedback: 'Réponse incorrecte' }
    } else {
      return { isOk: false, feedback: 'essaieEncoreAvecUneSeuleUnite' }
    }
  }
}

/**
 * comparaison de valeur dans un intervalle strict.
 * @param {string} input
 * @param {{borneInf: number, borneSup: number}} goodAnswer @todo idem ci-dessus, avoir un Intervalle.fromString() qui donne cet objet à partir de ']3.4;5.6]' par exemple
 * @return {isOk: boolean, feedback?: string}
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
 * @return {isOk: boolean, feedback?: string}
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
 * comparaison d'expression de puissances
 * @param {string} input
 * @param {string} goodAnswer
 * @return {isOk: boolean, feedback?: string}
 */
export function puissanceCompare (input: string, goodAnswer: string): { isOk: boolean, feedback?: string } {
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
