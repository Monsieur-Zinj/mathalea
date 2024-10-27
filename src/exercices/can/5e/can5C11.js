import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Calculer une différence'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021
 * Référence can5C11
 */
export const uuid = '606fd'
export const ref = 'can5C11'
export const refs = {
  'fr-fr': ['can5C11'],
  'fr-ch': []
}
export default function DifferenceNegative () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = randint(8, 15)
    const b = randint(18, 30)
    this.question = `Calculer $${a}-${b}$.`
    this.correction = `$${a}-${b}=${a - b}$`
    this.reponse = a - b
    this.correction += texteEnCouleur(`<br> Mentalement : <br>
    On décompose $${b}$ en $${a}+${b - a}$, ce qui donne :<br>
     $${a}-${b}=${a}-${a}-${b - a}=${a - b}$.
       `)
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
