import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Calculer un quotient entier'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can5C05
 */
export const uuid = '63dff'
export const ref = 'can5C05'
export const refs = {
  'fr-fr': ['can5C05'],
  'fr-ch': []
}
export default function Division5e () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = randint(11, 15)
    const b = randint(3, 6)
    const c = a * b
    this.reponse = a
    this.question = `Calculer $${c} \\div ${b}$.`
    this.correction = `$${c} \\div ${b}=${a}$`
    this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    On décompose $${c}$ en $${b * 10}+${c - 10 * b}=${b}\\times 10+${b}\\times ${(c - 10 * b) / b}=${b}(10+${(c - 10 * b) / b})$.<br>
        Ainsi :
     $${c} \\div ${b}=10+${(c - 10 * b) / b}=${a}$.<br>
     `)
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
