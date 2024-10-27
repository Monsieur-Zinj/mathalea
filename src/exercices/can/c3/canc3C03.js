import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Trouver le nombre dans une table de multiplication '
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 * Date de publication
*/
export const uuid = 'bdb11'
export const ref = 'canc3C03'
export const refs = {
  'fr-fr': ['canc3C03'],
  'fr-ch': []
}
export default function TableMultiplicationTrous () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = KeyboardType.clavierNumbers
  this.nouvelleVersion = function () {
    const a = randint(2, 9)
    const b = randint(4, 10)
    const c = a * b
    if (choice([true, false])) {
      this.question = `Compléter : <br>$${a}\\times .... =${c}$`
      this.correction = `$${a}\\times ${miseEnEvidence(b)} =${c}$`
      this.canEnonce = 'Compléter.'
      this.canReponseACompleter = `$${a}\\times .... =${c}$`
    } else {
      this.question = `Compléter :<br> $ .... \\times ${a}=${c}$`
      this.correction = `$ ${miseEnEvidence(b)} \\times ${a}=${c}$`
      this.canEnonce = 'Compléter.'
      this.canReponseACompleter = `$ .... \\times ${a}=${c}$`
    }
    this.reponse = b
  }
}
