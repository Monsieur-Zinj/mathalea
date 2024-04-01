import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Connaître les tables de multiplication (phrases)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '24/01/2023'

/*!
 * @author Gilles Mora
 *
 * Référence canc3C15
 */

export const uuid = 'aa8af'
export const refs = {
  'fr-fr': ['canc3C15'],
  'fr-ch': []
}
export default function TablesPhrase () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline ' + KeyboardType.clavierNumbers
  this.nouvelleVersion = function () {
    const a = randint(3, 9)
    const b = randint(3, 9)
    const c = a * b
    this.reponse = b
    this.question = `Dans $${c}$ combien de fois $${a}$ ?`
    this.correction = `Dans $${c}$, il y a $${miseEnEvidence(b)}$ fois $${a}$ car $${a}\\times ${b}=${c}$.`
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
