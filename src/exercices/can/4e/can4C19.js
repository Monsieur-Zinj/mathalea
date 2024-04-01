import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureNombreRelatif, ecritureNombreRelatifc, ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const interactifType = 'mathLive'
export const interactifReady = true
export const titre = 'Mutiplier des entiers relatifs'
export const dateDePublication = '04/10/2023'
/*!
 * @author  Gilles Mora (J'ai repris l'ex 4C10-3)
 *
 * Référence can4C19
 */
export const uuid = '1ae99'
export const refs = {
  'fr-fr': ['can4C19'],
  'fr-ch': []
}
export default function MultiplicationRelatifCAN () {
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
    if (a === 1) {
      a = -1
    }
    if (b === 1) {
      b = -1
    }
    if (choice([true, false])) {
      if (this.interactif) {
        this.question = '$ ' + a + ' \\times  ' + ecritureParentheseSiNegatif(b) + ' =$'
      } else {
        this.question = 'Calculer $ ' + a + ' \\times  ' + ecritureParentheseSiNegatif(b) + '$.'
      }
      this.correction = '$ ' + a + ' \\times  ' + ecritureParentheseSiNegatif(b) + ' = ' + (a * b) + ' $'
    } else {
      if (this.interactif) {
        this.question = '$ ' + ecritureNombreRelatif(a) + ' \\times  ' + ecritureNombreRelatif(b) + ' =$'
      } else {
        this.question = 'Calculer $ ' + ecritureNombreRelatif(a) + ' \\times  ' + ecritureNombreRelatif(b) + ' $.'
      }
      this.correction = '$ ' + ecritureNombreRelatifc(a) + ' \\times  ' + ecritureNombreRelatifc(b) + ' = ' + ecritureNombreRelatifc(a * b) + ' $'
    }

    this.reponse = a * b
  }
  this.canEnonce = this.question// 'Compléter'
  this.canReponseACompleter = ''
}
