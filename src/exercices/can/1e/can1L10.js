import { ecritureAlgebrique } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Simplifier un taux de variation'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '17/11/2022'

/**
 *
 * @author Gilles Mora
 * Référence can1L10
*/

export const uuid = 'cc9ee'
export const ref = 'can1L10'
export const refs = {
  'fr-fr': ['can1L10'],
  'fr-ch': []
}
export default function SimplifierTauxVariations () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = randint(-12, 12, [0])

    this.question = `Simplifier le plus possible : $\\dfrac{(${a}+h)^2-${a ** 2}}{h}$.`
    this.correction = `$\\dfrac{(${a}+h)^2-${a ** 2}}{h}=\\dfrac{\\cancel{${a ** 2}}${ecritureAlgebrique(2 * a)}h+h^2-\\cancel{${a ** 2}}}{h}=
    \\dfrac{${2 * a}h+h^2}{h}=\\dfrac{h(${2 * a}+h)}{h}=${2 * a}+h$`

    this.reponse = [`h+2\\times ${a}`]
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
