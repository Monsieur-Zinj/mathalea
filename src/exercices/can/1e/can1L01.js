import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureParentheseSiNegatif, reduirePolynomeDegre3 } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Calculer un discriminant'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '26/10/2021'

/*!
 * @author Jean-Claude Lhote
 */
export const uuid = 'd0042'
export const ref = 'can1L01'
export const refs = {
  'fr-fr': ['can1L01'],
  'fr-ch': []
}
export default function Discriminant () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = randint(1, 5) * choice([-1, 1, 1, 1])
    const b = randint(-5, 5)
    const c = randint(-5, 5)
    const d = b * b - 4 * a * c
    this.question = `Calculer le discriminant de cette expression : $${reduirePolynomeDegre3(0, a, b, c)}$.<br>
    $\\Delta=$`
    this.correction = `$\\Delta =b^2-4ac=${ecritureParentheseSiNegatif(b)}^2 - 4 \\times ${ecritureParentheseSiNegatif(a)} \\times ${ecritureParentheseSiNegatif(c)}=${d}$`
    this.reponse = d
    this.canEnonce = `Calculer le discriminant de cette expression : $${reduirePolynomeDegre3(0, a, b, c)}$.`
    this.canReponseACompleter = '$\\Delta=\\ldots$'
  }
}
