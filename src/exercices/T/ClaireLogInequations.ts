import Exercice from '../Exercice'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu } from '../../modules/outils.js'
import { texNombre } from '../../lib/outils/texNombre'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { pgcd } from '../../lib/outils/primalite'
import { fraction } from '../../modules/fractions'

export const titre = 'Résolution d\'inéquations du type $a^x \\leq b$'
export const dateDePublication = '4/5/2024'
export const dateDeModificationImportante = '18/07/2024'
export const uuid = '00a7a'
export const interactifReady = true
export const interactifType = 'mathLive'
export const refs = {
  'fr-fr': ['TAN1-0'],
  'fr-ch': []
}

/**
 * Description didactique de l'exercice
 * @autor Claire Rousset (un peu aidé par Jean-Claude Lhote)
 * Référence TAN1-0
 */
export default class InequationsLog extends Exercice {
  constructor () {
    super()
    this.consigne = 'Résoudre dans $\\R$ les inéquations suivantes. Les solutions devront être écrites sous la forme d\'un intervalle.'
    this.nbQuestions = 5
    this.spacingCorr = 3
    this.sup = '4'
    this.besoinFormulaireTexte = ['Type de question (nombre séparés par des tirets', '1 : Borne rationnelle\n2 : Borne entière\n3 : Borne irrationnelle\n4 : Mélange']
    this.comment = 'Exercice de résolution d\'inéquation avec le logarithme de base 10'
    this.correctionDetailleeDisponible = true
  }

  isRationalLogFraction (a: number, b: number, tolerance: number = 1e-5): number | [number, number] | null {
    const logA = Math.log(a)
    const logB = Math.log(b)
    const ratio = logB / logA
    const maxDenominator = 100 // Précision
    let bestNumerator = 0
    let bestDenominator = 1
    let minError = Math.abs(ratio - bestNumerator / bestDenominator)
    for (let denominator = 1; denominator <= maxDenominator; denominator++) {
      const numerator = Math.round(ratio * denominator)
      const currentError = Math.abs(ratio - numerator / denominator)
      if (currentError < minError) {
        bestNumerator = numerator
        bestDenominator = denominator
        minError = currentError
      }
      if (currentError < tolerance) {
        break
      }
    }
    if (minError < tolerance) {
      // Simplify the fraction
      const commonDivisor = pgcd(bestNumerator, bestDenominator)
      if (bestDenominator === 1) {
        return bestNumerator // Return numerator if denominator is 1
      } else {
        return [bestNumerator / commonDivisor, bestDenominator / commonDivisor]
      }
    }
    return null // Not a fraction within the tolerance
  }

  nouvelleVersion () {
    const logString = this.comment?.includes('10') ? '\\log' : '\\ln'
    const typeQuestionsDisponibles = ['>=', '>', '<=', '<']
    const listeCouples = [[0.03125, 2], [0.0625, 2], [0.08, 5], [0.125, 2], [0.125, 64], [0.2, 0.008], [0.2, 5], [0.2, 12], [0.2, 25], [0.2, 125],
      [0.25, 2], [0.25, 4], [0.25, 5], [0.25, 15], [0.25, 32], [0.25, 64], [0.4, 0.16], [0.4, 8], [0.5, 0.25], [0.5, 1.25],
      [0.5, 2], [0.5, 4], [0.5, 8], [0.5, 32], [0.6, 12], [0.625, 1.25], [0.6, 4], [0.75, 3], [0.35, 0.1225], [0.2, 0.04],
      [0.3, 0.09], [0.09, 0.3], [0.008, 0.2], [0.25, 0.5], [0.04, 0.2], [0.8, 0.64], [0.64, 0.8], [0.8, 0.512], [1.02, 2], [1.06, 2],
      [1.125, 27], [1.25, 5], [1.4, 2.8], [1.5, 3], [1.6, 8], [1.75, 3.5], [2, 4], [2, 8], [2, 9], [2, 16],
      [2, 25], [2, 32], [2, 64], [2, 128], [2, 256], [2, 512], [2, 1024], [2, 2048], [2, 4096], [2, 16384],
      [2, 65536], [2.25, 4], [2.25, 5], [2.5, 12.5], [2.5, 15], [3, 6], [3, 9], [3, 27], [3, 81], [3, 243],
      [3, 729], [3, 2187], [3, 6561], [3, 19683], [3, 59049], [3, 177147], [3, 531441], [3.25, 13], [3.5, 7], [3.75, 15],
      [4, 2], [4, 8], [4, 16], [4, 256], [4, 625], [4, 16384], [4, 65536], [5, 25], [5, 125], [11, 121],
      [6, 32], [7, 343], [8, 2], [8, 4], [9, 81], [11, 121], [12, 5], [27, 2], [27, 3], [27, 9],
      [32, 2], [32, 6], [64, 4], [81, 3], [243, 81], [243, 3], [256, 4], [1024, 2], [2048, 2], [2187, 3]]

    const listeTypeOperators = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    const listeTypeQuestions = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 3, melange: 4, defaut: 4, nbQuestions: this.nbQuestions })

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let a: number
      let b: number
      let quotient: number|[number, number]|null
      let base: number | null
      switch (listeTypeQuestions[i]) {
        case 1: // rationnel
          do {
            [a, b] = choice(listeCouples)
            quotient = this.isRationalLogFraction(a, b)
          } while (quotient === null || typeof quotient === 'number')
          if (typeof quotient === 'number') {
            base = 10 ** (Math.log10(b) / quotient)
          } else {
            base = 10 ** (Math.log10(b) / quotient[0])
          }
          break
        case 2: // entier
          do {
            [a, b] = choice(listeCouples)
            quotient = this.isRationalLogFraction(a, b)
          } while (quotient === null || Array.isArray(quotient))
          if (typeof quotient === 'number') {
            base = 10 ** (Math.log10(b) / quotient)
          } else {
            base = 10 ** (Math.log10(b) / quotient[0])
          }
          break
        default: // irrationnel
          do {
            [a, b] = choice(listeCouples)
            quotient = this.isRationalLogFraction(a, b)
          } while (quotient !== null)
          base = null
      }
      const stringA = texNombre(a, 5) // Pour que a soit écrit correctement : virgule au lieu de point et séparation des classes
      const stringB = texNombre(b, 5)
      let resultat = ''
      if (quotient !== null) {
        if (Array.isArray(quotient)) { // Pour vérifier si quotient est un tableau
          // Pour que le - d'une fraction soit devant celle-ci
          const frac = fraction(quotient[0], quotient[1])
          resultat = frac.texFSD
        } else {
          resultat = `${texNombre(quotient, 5)}`
        }
      } else {
        resultat = `\\dfrac{${logString}(${stringB})}{${logString}(${stringA})}` // dfrac pour avoir fraction de taille normale
      }

      let answer = ''
      let signe0: string
      let signe1: string
      let signe2: string

      switch (listeTypeOperators[i]) {
        case '>=':
          signe0 = '\\geq'
          if (Math.log(a) > 0) {
            signe1 = '\\geq'
            signe2 = '>'
            answer = `[${resultat};+\\infty[`
          } else {
            signe1 = '\\leq'
            signe2 = '<'
            answer = `]-\\infty;${resultat}]`
          }
          break
        case '>':
          signe0 = '>'
          if (Math.log(a) > 0) {
            signe1 = '>'
            signe2 = '>'
            answer = `]${resultat};+\\infty[`
          } else {
            signe1 = '<'
            signe2 = '<'
            answer = `]-\\infty;${resultat}[`
          }
          break
        case '<=':
          signe0 = '\\leq'
          if (Math.log(a) > 0) {
            signe1 = '\\leq'
            signe2 = '>'
            answer = `]-\\infty;${resultat}]`
          } else {
            signe1 = '\\geq'
            signe2 = '<'
            answer = `[${resultat};+\\infty[`
          }
          break
        case '<':
        default:
          signe0 = '<'
          if (Math.log(a) > 0) {
            signe1 = '<'
            signe2 = '>'
            answer = `]-\\infty;${resultat}[`
          } else {
            signe1 = '>'
            signe2 = '<'
            answer = `]${resultat};+\\infty[`
          }
          break
      }
      // déplacement du code commun ici parce que c'est quand même pas bien de copier 4 fois la même chose à un ou deux signe près.
      // c'est ce qu'on appelle factoriser.
      // ça évite lorsqu'on a 4 cas, de faire 4 fois les corrections.
      texte = `$${texNombre(a, 5)}^x ${signe0} ${stringB}$`
      texteCorr = `$${logString}{(${stringA}^x)} ${signe0} ${logString}{(${stringB})}$`
      texteCorr += `<br>$x${logString}{(${stringA})} ${signe0} ${logString}{(${stringB})}$`
      texteCorr += `<br>$x ${signe1} \\dfrac{${logString}(${stringB})}{${logString}(${stringA})}$ car $${logString}(${stringA}) ${signe2}0$`
      if (quotient !== null && base !== null) {
        texteCorr += this.correctionDetaillee
          ? typeof quotient === 'number'
            ? `<br>Or, $${logString}(${stringB})=${logString}(${texNombre(base, 5)}^{${quotient}})=${quotient}${logString}(${texNombre(base, 5)})$, donc $\\dfrac{${logString}(${stringB})}{${logString}(${stringA})}= ${resultat}$.<br>Ainsi`
            : quotient[0] === 1
              ? `<br>Or, $${logString}(${stringA})=${logString}(${texNombre(base, 5)}^{${quotient[1]}})=${quotient[1]}${logString}(${texNombre(base, 5)})$.<br>Ainsi `
              : `<br>Or, $${logString}(${stringB})=${logString}(${texNombre(base, 5)}^{${quotient[0]}})=${quotient[0]}${logString}(${texNombre(base, 5)})$ et $${logString}(${stringA})=${logString}(${texNombre(base, 5)}^{${quotient[1]}})=${quotient[1]}${logString}(${texNombre(base, 5)})$.<br>Ainsi `
          : '<br>Or, '
        texteCorr += `$\\dfrac{${logString}(${stringB})}{${logString}(${stringA})}= ${resultat}$ donc `
      }
      texteCorr += `<br>$S=${miseEnEvidence(answer)}$`
      if (this.interactif) {
        // @ts-expect-error problème typage
        handleAnswers(this, i, { reponse: { value: answer } })
        texte += '<br>$S= $'
        texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierEnsemble)
      }
      if (this.questionJamaisPosee(i, a, b)) { // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
