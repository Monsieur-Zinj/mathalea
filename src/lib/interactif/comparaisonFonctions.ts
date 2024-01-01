import { ComputeEngine } from '@cortex-js/compute-engine'
import FractionEtendue from '../../modules/FractionEtendue'
import Grandeur from '../../modules/Grandeur'
import Hms from '../../modules/Hms'

const engine = new ComputeEngine()

/**
 * Une fonction pour nettoyer les saisies sortant des inputs afin d'être utilisées sans erreur par le parser de ComputeEngine
 * Peut nettoyer aussi la réponse fournie par l'auteur indélicat d'un exercice (par exemple, celui qui passe du texNombre()...
 * @param {string} aString // ce qui vient en entrée
 * @return {string} la chaine de caractère dont on espère que ComputeEngine (CE) en digérera correctement le contenu.
 */
export function cleanStringBeforeParse (aString: string) {
  return aString.replaceAll(',', '.') // CE n'aime pas les virgules, il veut des . (on pourrait lui dire que le séparateur décimal est la virgule)
    .replaceAll('dfrac', 'frac') // CE n'aime pas \dfrac
    .replaceAll('²', '^2') // '²' c'est pas correct en latex !
    .replace('³', '^3') // '³' non plus
    .replaceAll('^{}', '') // les exposants vides, il n'aime pas ça non plus
    .replaceAll('\\,', '') // pourquoi laisser des espaces indésirables si on peut les enlever ?
    .replaceAll('{,}', '.') // toujours cette histoire de virgule (celle-là, elle vient sans doute d'un texNombre() !
    .replace(/\((\+?-?\d+)\)/, '$1') // @fixme ces règles viennent de verifQuestionMathlive, mais je ne suis pas certain qu'elles soient pertinentes
    .replace(/\\left\((\+?-?\d+)\\right\)/, '$1') // Pour les nombres négatifs, supprime les parenthèses
    .replace(/\\lparen(\+?-?\d+)\\rparen/, '$1') // Pour les nombres négatifs, supprime les parenthèses
    .replace(/\\lparen(\+?\+?\d+)\\rparen/, '$1')
    .replaceAll(/\s/g, '') // encore des espaces à virer ?
}

type CleaningOperation = 'fractions' | 'virgules' | 'espaces';

function cleanFractions (str: string): string {
  // Your implementation for cleaning fractions
  return str.replaceAll(/dfrac/g, 'frac')
}

function cleanComas (str: string): string {
  // Your implementation for cleaning comas
  return str.replaceAll(/\{,}/g, '.').replaceAll(/,/g, '.')
}

function cleanSpaces (str: string): string {
  // Your implementation for cleaning spaces
  return str.replaceAll(/\s/g, '').replaceAll(/\\,/g, '')
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
        // Add more cases for additional cleaning operations
      default:
        throw new Error(`Unsupported cleaning operation: ${operation}`)
    }
  })

  return (str: string) => cleaningFunctions.reduce((result, cleaningFn) => cleaningFn(result), str)
}

/**
 * fonction initialement dans mathlive.js, j'en ai besoin ici, et plus dans mathlive.js
 * @param {string} saisie la chaine qui contient le nombre avec son unité
 * @return {Grandeur|false} l'objet de type Grandeur qui contient la valeur et l'unité... ou false si c'est pas une grandeur.
 */
function saisieToGrandeur (saisie: string): Grandeur | false {
  if (saisie.indexOf('°') > 0) {
    const split = saisie.split('°')
    return new Grandeur(parseFloat(split[0].replace(',', '.')), '°')
  }
  if (saisie.split('operatorname').length !== 2) {
    return false
  } else {
    const split = saisie.split('\\operatorname{')
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
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function numberCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  return { isOk: engine.parse(cleanStringBeforeParse(saisie)).isEqual(engine.parse(cleanStringBeforeParse(reponse))) }
}

/**
 * comparaison d'expressions'
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function calculCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  const saisieClean = cleanStringBeforeParse(saisie)
  const reponseClean = cleanStringBeforeParse(reponse)
  return { isOk: engine.parse(saisieClean).isSame(engine.parse(reponseClean)) }
}

/**
 * comparaison de durées
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function hmsCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  const hmsSaisie = Hms.fromString(cleanStringBeforeParse(saisie))
  const hmsReponse = Hms.fromString(cleanStringBeforeParse(reponse))
  return { isOk: hmsReponse.isTheSame(hmsSaisie) }
}

/**
 * comparaison d'expressions développées
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function formeDeveloppeeCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  saisie = cleanStringBeforeParse(saisie)
  const saisieParsed = engine.parse(saisie).canonical
  const isSomme = ['Add', 'Subtract'].includes(saisieParsed.head as string)
  const isNumber = !isNaN(Number(saisieParsed.numericValue))
  const reponseParsed = engine.parse(cleanStringBeforeParse(reponse)).canonical
  const isOk = reponseParsed.isSame(saisieParsed) && (isSomme || isNumber)
  return { isOk }
}

/**
 * comparaison d'expression développées pour les tests d'Éric Elter
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function formeDeveloppeeParEECompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  saisie = cleanStringBeforeParse(saisie)
  const regleSuppressionInvisibleOperator = engine.rules([{
    match: ['InvisibleOperator', '_x', '_y'],
    replace: ['Multiply', '_x', '_y']
  }])
  let saisieNonCanonique = engine.box(['CanonicalOrder', engine.parse(saisie, { canonical: false })])
  saisieNonCanonique = saisieNonCanonique.replace(regleSuppressionInvisibleOperator) ?? saisieNonCanonique
  let reponseNonCanonique = engine.box(['CanonicalOrder', engine.parse(reponse, { canonical: false })])
  reponseNonCanonique = reponseNonCanonique.replace(regleSuppressionInvisibleOperator) ?? reponseNonCanonique
  return { isOk: saisieNonCanonique.isSame(reponseNonCanonique) }
}

/**
 * comparaison de nombres décimaux bon, rien de transcendant, on compare les strings nettoyées
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function decimalCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  const saisieClean = cleanStringBeforeParse(String(saisie))
  const reponseClean = cleanStringBeforeParse(String(reponse))
  return { isOk: saisieClean === reponseClean } // facile ! des Décimaux en string sont égaux si les strings sont égales.
}

/**
 * comparaison de nombres en écritures scientifiques @todo à vérifier celle-là, j'suis pas convaincu
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function scientificCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  const saisieClean = cleanStringBeforeParse(String(saisie))
  const reponseClean = cleanStringBeforeParse(String(reponse))
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
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function texteCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  return { isOk: saisie === reponse }
}

/**
 * comparaison de textes avec espaces comme son nom l'indique : avec un nettoyage adapté à la situation
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function texteAvecEspacesCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  saisie = saisie.replaceAll('\\:', ' ') // Suppression des espaces LaTeX (présents quand on met des crochets pour les segments)
  saisie = saisie.replaceAll('\\left\\lbrack ', '[').replaceAll('\\right\\rbrack ', ']') // Suppression des crochets LaTeX (pour les segments)
  while (saisie.includes('  ')) saisie = saisie.replace('  ', ' ') // Pour enlever tous les doubles espaces
  saisie = saisie.replaceAll('\\text{', '').replaceAll('}', '').replaceAll('$', '') // Supprimer le \text{....} mis par MathLive
  if (saisie[0] === ' ') saisie = saisie.substring(1, saisie.length) // Supprimer l'eventuel espace en début de ligne
  if (saisie[saisie.length - 1] === ' ') saisie = saisie.substring(0, saisie.length - 1) // Supprimer l'éventuel espace en fin de ligne
  return { isOk: saisie === reponse }
}

/**
 * comparaison de textes sans s'occuper de la casse.
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function upperCaseCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  return { isOk: saisie.toUpperCase() === reponse.toUpperCase() }
}

/**
 * comparaison de fraction simplifiée
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function fractionPlusSimpleCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  const fReponse = engine.parse(reponse, { canonical: false })
  const saisieParsed = engine.parse(saisie, { canonical: true })
  if (saisieParsed.head === 'Number' && Array.isArray(saisieParsed.numericValue) && fReponse.head === 'Divide') {
    const num = saisieParsed.numericValue[0]
    const numReponse = fReponse.op1.numericValue
    if (numReponse == null || typeof numReponse !== 'number') throw Error(`problème avec ${reponse} dans fractionPlusSimpleCompare : fReponse.op1.numericValue est nul`)
    if (saisieParsed.canonical.isSame(fReponse.canonical) && num && num < numReponse && Number.isInteger(num)) return { isOk: true }
  }
  return { isOk: false }
}

/**
 * comparaison de fraction en valeur acceptant la valeur décimale
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function fractionEgaleCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  const fReponse = engine.parse(reponse)
  if (!isNaN(parseFloat(cleanStringBeforeParse(saisie)))) {
    console.log(`La saisie est faite sous forme décimale : ${saisie}`)
    const newFraction = new FractionEtendue(parseFloat(cleanStringBeforeParse(saisie)))
    console.log(`On l'a convertie en fraction : ${newFraction.toLatex().replace('dfrac', 'frac')}`)
    if (engine.parse(`${newFraction.toLatex().replace('dfrac', 'frac')}`).canonical.isEqual(fReponse.canonical)) return { isOk: true }
  } else {
    console.log(`La saisie est une fraction : ${saisie}`)
    if (engine.parse(cleanStringBeforeParse(saisie)).canonical.canonical.isEqual(fReponse.canonical)) return { isOk: true }
  }
  return { isOk: false }
}

/**
 * comparaison de fraction à l'identique (pour les fraction irréductibles par exemple)
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function fractionCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  const clean = generateCleaner(['espaces', 'fractions'])
  return { isOk: engine.parse(clean(saisie)).isSame(engine.parse(clean(reponse))) }
}

/**
 * comparaison de grandeurs avec une unité
 * @param {string} saisie
 * @param {{value: Grandeur, precision: number}} reponse @todo est-il possible d'avoir un string et d'utiliser comme pour Hms un Grandeur.fromString() ?
 * @return {isOk: boolean, feedback?: string}
 */
export function unitesCompare (saisie: string, reponse: { value: Grandeur, precision: number }): {
    isOk: boolean,
    feedback?: string
} {
  const grandeurSaisie = saisieToGrandeur(cleanStringBeforeParse(saisie))
  const grandeurReponse = reponse.value
  const precision = reponse.precision
  if (grandeurSaisie) {
    if (grandeurSaisie.estEgal(grandeurReponse)) return { isOk: true }
    else if (precision && grandeurSaisie.estUneApproximation(grandeurReponse, precision)) {
      return {
        isOk: false,
        feedback: 'Erreur d\'arrondi'
      }
    } else return { isOk: false }
  } else {
    if ((saisie === '') || isNaN(parseFloat(saisie.replace(',', '.')))) {
      return { isOk: false, feedback: 'Réponse incorrecte' }
    } else {
      return { isOk: false, feedback: 'essaieEncoreAvecUneSeuleUnite' }
    }
  }
}

/**
 * comparaison de valeur dans un intervalle strict.
 * @param {string} saisie
 * @param {{borneInf: number, borneSup: number}} reponse @todo idem ci-dessus, avoir un Intervalle.fromString() qui donne cet objet à partir de ']3.4;5.6]' par exemple
 * @return {isOk: boolean, feedback?: string}
 */
export function intervallleStrictCompare (saisie: string, reponse: { borneInf: number, borneSup: number }): {
    isOk: boolean,
    feedback?: string
} {
  const nombreSaisi = Number(engine.parse(cleanStringBeforeParse(saisie)).numericValue)
  if (Number.isNaN(nombreSaisi)) return { isOk: false }
  if (nombreSaisi > reponse.borneInf && nombreSaisi < reponse.borneSup) return { isOk: true }
  return { isOk: false }
}

/**
 * comparaison de valeur dans un intervalle large.
 * @param {string} saisie
 * @param {{borneInf: number, borneSup: number}} reponse @todo idem ci-dessus, avoir un Intervalle.fromString() qui donne cet objet à partir de ']3.4;5.6]' par exemple
 * @return {isOk: boolean, feedback?: string}
 */
export function intervallleCompare (saisie: string, reponse: { borneInf: number, borneSup: number }): {
    isOk: boolean,
    feedback?: string
} {
  const nombreSaisi = Number(engine.parse(cleanStringBeforeParse(saisie)).numericValue)
  if (Number.isNaN(nombreSaisi)) return { isOk: false }
  if (nombreSaisi >= reponse.borneInf && nombreSaisi <= reponse.borneSup) return { isOk: true }
  return { isOk: false }
}

/**
 * comparaison d'expression de puissances
 * @param {string} saisie
 * @param {string} reponse
 * @return {isOk: boolean, feedback?: string}
 */
export function puissanceCompare (saisie: string, reponse: string): { isOk: boolean, feedback?: string } {
  let formatOK: boolean = false
  let formatKO: boolean = false
  const nombreSaisi = saisie.split('^')
  const mantisseSaisie = nombreSaisi[0].replace(/[()]/g, '')
  // const mantisseS = Number(mantisseSaisie)
  const expoSaisi = nombreSaisi[1] ? nombreSaisi[1].replace(/[{}]/g, '') : '1'
  // const expoS = Number(expoSaisi)
  const nombreAttendu = reponse.split('^')
  const mantisseReponse = nombreAttendu[0].replace(/[()]/g, '')
  const mantisseR = Number(mantisseReponse)
  const expoReponse = nombreAttendu[1] ? nombreAttendu[1].replace(/[{}]/g, '') : '1'
  const expoR = Number(expoReponse)
  if (saisie.indexOf('^') !== -1) {
    if (mantisseReponse === mantisseSaisie && expoReponse === expoSaisi) {
      formatOK = true
    }
    // gérer le cas mantisse négative a et exposant impair e, -a^e est correct mais pas du format attendu
    // si la mantisse attendue est négative on nettoie la chaine des parenthèses
    if (mantisseR < 0 && expoR % 2 === 1) {
      if ((saisie === `${mantisseReponse}^{${expoReponse}}`) || (saisie === `${mantisseReponse}^${expoReponse}`)) {
        formatKO = true
      }
    }
    // si l'exposant est négatif, il se peut qu'on ait une puissance au dénominateur
    if (expoR < 0) {
      // Si la mantisse est positive
      if ((saisie === `\\frac{1}{${mantisseR}^{${-expoR}}`) || (saisie === `\\frac{1}{${mantisseR}^${-expoR}}`)) {
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
