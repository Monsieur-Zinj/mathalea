import { choice } from '../../../lib/outils/arrayOutils'
import { texFractionReduite } from '../../../lib/outils/deprecatedFractions.js'
import { ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
import { abs } from '../../../lib/outils/nombres'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Déterminer le coefficient d’une fonction affine'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '25/10/2021'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can3F06
*/

export const uuid = '17987'
export const ref = 'can3F06'
export const refs = {
  'fr-fr': ['can3F06'],
  'fr-ch': []
}
export default function CoefficientFonctionAffine () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const b = randint(-3, 3, 0)
    const c = randint(1, 5)
    const n = choice([-4, -3, -2, 2, 3, 4])
    const d = b + n * c
    if (b > 0) {
      this.question = `$f$ est une fonction affine telle que $f(x)=ax+${b}$ et $f(${c})=${d}$.<br>

    Donner la valeur de $a$.
    `
      this.correction = `Comme $f(${c})=${d}$, on a $a\\times ${c}+${ecritureParentheseSiNegatif(b)}=${d}$.<br>
    On en déduit $ ${c}a=${d}-${ecritureParentheseSiNegatif(b)}$, d'où $a=\\dfrac{${d}-${ecritureParentheseSiNegatif(b)}}{${c}}=\\dfrac{${d - b}}{${c}}=${texFractionReduite(d - b, c)}$.`

      this.reponse = (d - b) / c
    } else {
      this.question = `$f$ est une fonction affine telle que $f(x)=ax-${abs(b)}$ et $f(${c})=${d}$.<br>

      Donner la valeur de $a$.
    `
      this.correction = `Comme $f(${c})=${d}$, on a $a\\times ${c}+${ecritureParentheseSiNegatif(b)}=${d}$.<br>
    On en déduit $${c}a=${d}-${ecritureParentheseSiNegatif(b)}$, d'où $a=\\dfrac{${d}-${ecritureParentheseSiNegatif(b)}}{${c}}=\\dfrac{${d - b}}{${c}}=${texFractionReduite(d - b, c)}$.`

      this.reponse = (d - b) / c
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = '$a=\\ldots$'
  }
}
