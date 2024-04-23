import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = 'Ajouter $10n + 9$'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6C04
 */
export const uuid = '5b591'
export const ref = 'can6C04'
export const refs = {
  'fr-fr': ['can6C04'],
  'fr-ch': []
}
export default function Ajoute10NPlus9 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const a = randint(3, 9)
    const b = randint(2, 8)
    const c = randint(1, 5)
    this.reponse = a * 10 + b + c * 10 + 9
    this.question = `Calculer $${texNombre(a * 10 + b, 0)} + ${texNombre(c * 10 + 9, 0)}$.`
    // Si les exos can avaient toujours cette propriété this.question on pourrait faire un ajout automatique
    this.canEnonce = this.question
    this.canReponseACompleter = ''// `${this.question} \\dots \\dots`
    this.correction = `$${texNombre(a * 10 + b, 0)} + ${texNombre(c * 10 + 9, 0)}= ${texNombre(this.reponse, 0)}$`
    this.correction += texteEnCouleur(`<br> Mentalement : <br>
   Pour ajouter $${c * 10 + 9}$, on peut ajouter $${(c + 1) * 10}$ et on retranche $1$.<br>
   Ainsi,  $${texNombre(a * 10 + b, 0)} + ${texNombre(c * 10 + 9, 0)}=(${texNombre(a * 10 + b, 0)}+${texNombre((c + 1) * 10, 0)}) - 1 =${texNombre(a * 10 + b + (c + 1) * 10, 0)} - 1=${texNombre(this.reponse, 0)}$.
    `)
  }
}
