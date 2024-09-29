import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Calculer le double ou la moitié'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '16/11/2021'

/*!
 * @author Jean-Claude Lhote
 * Date de publication 16/11/2021
 * Référence canc3C04
 */
export const uuid = '4ba86'
export const ref = 'canc3C04'
export const refs = {
  'fr-fr': ['canc3C04'],
  'fr-ch': []
}
export default function DoubleOuBienMoitie () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur01 inline ' + KeyboardType.clavierNumbers
  this.nouvelleVersion = function () {
    let a = randint(2, 4) * 10 + randint(1, 9)
    if (choice([true, false])) {
      this.reponse = a << 1
      this.question = `Calculer le double de $ ${a} $.`
      this.correction = `$${a}\\times 2 = ${a << 1}$`
    } else {
      if (a % 2 === 1) { a++ }
      this.question = `Calculer la moitié de $ ${a} $.`
      this.reponse = a >> 1
      this.correction = `$${a}\\div 2 = ${a >> 1}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
