import Exercice from '../Exercice.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils.js'
import { ajouteChampTexteMathLive, ajouteFeedback } from '../../lib/interactif/questionMathLive.js'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { miseEnEvidence } from '../../lib/outils/embellissements.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { ecritureAlgebriqueSauf1, rienSi1 } from '../../lib/outils/ecritures.js'

export const titre = 'Exprimer en fonction de log(x)'
export const dateDePublication = '22/7/2024'
export const uuid = '2c0b2'
export const interactifReady = true
export const interactifType = 'mathLive'
export const refs = {
  'fr-fr': ['TAN1-5'],
  'fr-ch': []
}

const listeExposants = [1, 2, 3, -1, -2, -3]
/**
 * Réduire une expression en fonction de ln/log de x
 * @autor  Jean-Claude Lhote
 * Référence TAN1-5
 */
export default class ExpressionsLogX extends Exercice {
  version: string
  constructor () {
    super()
    this.version = 'ln'
    this.nbQuestions = 5
    this.spacingCorr = 3
    this.sup = '1'
    this.besoinFormulaire2CaseACocher = ['Type de logarithme', false]
    this.comment = 'Exercice de simplification d\'expressions avec des logarithmes'
  }

  nouvelleVersion () {
    if (this.sup2) this.version = 'ln'
    else this.version = 'log'
    const logString = this.version !== 'ln' ? '\\log' : '\\ln'
    const pluriel = this.nbQuestions > 1 ? 's' : ''
    this.consigne = `Soit $x\\gt 0$,exprimer le${pluriel} nombre${pluriel} suivant${pluriel} en fonction de $${logString} x$.`

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const [expA, expB, expC] = combinaisonListes(listeExposants, 3)
      const [a, b, c] = [randint(-5, 5, 0), randint(-5, 5, 0), randint(-5, 5, 0)]
      let texte = `${rienSi1(a)}${logString}(${expA < 0
         ? `\\dfrac{1}{x${expA < -1 ? `^${-expA}` : ''}}`
         : `x${expA > 1 ? `^${expA}` : ''}`})`
      texte += `${ecritureAlgebriqueSauf1(b)}${logString}(${expB < 0
         ? `\\dfrac{1}{x${expB < -1 ? `^${-expB}` : ''}}`
         : `x${expB > 1 ? `^${expB}` : ''}`
        })`
      texte += `${ecritureAlgebriqueSauf1(c)}${logString}(${expC < 0
         ? `\\dfrac{1}{x${expC < -1 ? `^${-expC}` : ''}}`
         : `x${expC > 1 ? `^${expC}` : ''}`
        })`
      const corrA = expA === 1
        ? [`${rienSi1(a)}${logString}(x)`, `${rienSi1(a)}${logString}(x)`]
        : [`${rienSi1(a)}${logString}(x^{${expA}})`, `${rienSi1(a * expA)}${logString}(x)`]
      const corrB = expB === 1
        ? [`${ecritureAlgebriqueSauf1(b)}${logString}(x)`, `${ecritureAlgebriqueSauf1(b)}${logString}(x)`]
        : [`${ecritureAlgebriqueSauf1(b)}${logString}(x^{${expB}})`, `${ecritureAlgebriqueSauf1(b * expB)}${logString}(x)`]
      const corrC = expC === 1
        ? [`${ecritureAlgebriqueSauf1(c)}${logString}(x)`, `${ecritureAlgebriqueSauf1(c)}${logString}(x)`]
        : [`${ecritureAlgebriqueSauf1(c)}${logString}(x^{${expC}})`, `${ecritureAlgebriqueSauf1(c * expC)}${logString}(x)`]

      let texteCorr = `$${texte}=${corrA[0]}${corrB[0]}${corrC[0]}=${corrA[1]}${corrB[1]}${corrC[1]}`
      texteCorr += `=${rienSi1(a * expA + b * expB + c * expC)}${logString}(x)$`
      const answer: string = `${rienSi1(a * expA + b * expB + c * expC)}${logString}(x)`

      // on reprend la correction pour mettre me dernier membre en évidence.
      const chunks = texteCorr.split('=')
      const lastChunk = chunks[chunks.length - 1]
      chunks[chunks.length - 1] = miseEnEvidence(lastChunk.substring(0, lastChunk.length - 1)) + '$'
      texteCorr = chunks.join('=')
      // et voilà, c'est fait pour toute les corrections.
      if (this.questionJamaisPosee(i, a, b, c, expA, expB, expC)) {
        texte = `$${texte}$` // <- laisser le i et ajouter toutes les variables qui rendent les exercices différents (par exemple a, b, c et d)
        if (this.interactif) {
          texte += ajouteChampTexteMathLive(this, i, 'inline largeur10 nospacebefore' + KeyboardType.clavierFonctionsTerminales, { texteAvant: '=' }) + ajouteFeedback(this, i)
          handleAnswers(this, i, { reponse: { value: answer, compare: fonctionComparaison } })
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
