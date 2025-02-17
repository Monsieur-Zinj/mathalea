import { texFractionFromString } from '../../../lib/outils/deprecatedFractions.js'
import { ecritureAlgebrique } from '../../../lib/outils/ecritures'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Résoudre une équation du type $ax+b=0$'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
  * Créé pendant l'été 2021
 * Référence can3L02
*/
export const uuid = '9419f'
export const ref = 'can3L02'
export const refs = {
  'fr-fr': ['can3L02'],
  'fr-ch': []
}
export default function EquationAXPlusBEgalZero () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = randint(-5, 5, [0, -1, 1])
    this.reponse = randint(-9, 9, [-1, 0, 1])
    const b = -a * this.reponse
    this.question = `Donner la solution de l'équation :<br> $${a}x${ecritureAlgebrique(b)}=0$`
    this.correction = `On procède par étapes successives :<br>
    On commence par isoler $${a}x$ dans le membre de gauche en ajoutant
    $${ecritureAlgebrique(-b)}$ dans chacun des membres, puis on divise
    par $${a}$ pour obtenir la solution : <br>
     $\\begin{aligned}
     ${a}x${ecritureAlgebrique(b)}&=0\\\\
    ${a}x&=${ecritureAlgebrique(-b)}\\\\
    x&=${texFractionFromString(-b, a)}\\\\
    x&=${this.reponse}
    \\end{aligned}$
   `
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
