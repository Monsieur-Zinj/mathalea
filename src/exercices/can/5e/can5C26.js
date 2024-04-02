import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils.js'
export const interactifType = 'mathLive'
export const interactifReady = true
export const titre = 'Additionner des entiers relatifs (écriture simplifiée)'
export const dateDePublication = '04/10/2023'
/*!
 * @author  Gilles Mora (J'ai repris l'ex 5R20)
 *
 * Référence can5C25
 */
export const uuid = '8a835'
export const ref = 'can5C26'
export const refs = {
  'fr-fr': ['can5C26'],
  'fr-ch': []
}
export default function AdditionRelatifBisCAN () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.sup = 10
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    this.formatChampTexte = 'largeur15 inline'
    this.formatInteractif = 'calcul'

    let a = randint(1, this.sup)
    let b = randint(1, this.sup)
    const k = choice([[-1, -1], [-1, 1], [1, -1]]) // Les deux nombres relatifs ne peuvent pas être tous les deux positifs
    a = a * k[0]
    b = b * k[1]
    if (this.interactif) {
      this.question = `$${texNombre(a)}${ecritureAlgebrique(b)} =$`
    } else {
      this.question = `Calculer $${texNombre(a)}${ecritureAlgebrique(b)}$.`
    }

    this.correction = `$ ${a}${ecritureAlgebrique(b)} = ${a + b} $`
    this.reponse = a + b
  }
  this.canEnonce = this.question// 'Compléter'
  this.canReponseACompleter = ''
}
