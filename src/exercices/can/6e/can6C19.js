import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Déterminer le complément à 100'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021
 * Référence can6C19
 */
export const uuid = 'd656b'
export const ref = 'can6C19'
export const refs = {
  'fr-fr': ['can6C19'],
  'fr-ch': []
}
export default function ComplementACent () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.typeExercice = 'simple'
  this.nouvelleVersion = function () {
    const a = randint(11, 49, [20, 30, 40])
    this.question = `Calculer $100-${a}$.`
    this.correction = `$100-${a}=${100 - a}$`
    this.reponse = 100 - a
    this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    On décompose $${a}$ en $${a - a % 10}+${a % 10}$. Retrancher $${a}$ revient à retrancher d'abord  $${a - a % 10}$  puis $${a % 10}$. <br>
    Ainsi, $100-${a}=\\underbrace{100-${a - a % 10}}_{${100 - (a - a % 10)}}-${a % 10}=${100 - (a - a % 10)}-${a % 10}=${100 - a}$.
     `)
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
