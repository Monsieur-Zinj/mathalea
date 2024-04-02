import { choice } from '../../../lib/outils/arrayOutils'
import Exercice from '../../deprecatedExercice.js'
import { texNombre } from '../../../lib/outils/texNombre'
import Decimal from 'decimal.js'
import { randint } from '../../../modules/outils.js'
export const interactifType = 'mathLive'
export const interactifReady = true
export const titre = 'Écrire un nombre décimal sous la forme $\\dfrac{a}{10^n}$'
export const dateDePublication = '19/10/2023'
/*!
 * @author  Gilles Mora
 *
 * Référence can2N06
 */
export const uuid = 'e57cb'
export const ref = 'can2N06'
export const refs = {
  'fr-fr': ['can2N06'],
  'fr-ch': []
}
export default function DecimalForme () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    this.formatChampTexte = 'largeur15 inline'
    this.formatInteractif = 'calcul'

    const puissance = randint(1, 5)
    const puissance10 = 10 ** puissance
    const a1 = randint(1, 9) * choice([1, -1])
    const a2 = randint(11, 99) * choice([1, -1])
    const a3 = randint(110, 199) * choice([1, -1])
    const a4 = randint(1001, 1499) * choice([1, -1])
    const a = choice([a1, a2, a3, a4, a4])
    const dec = new Decimal(a).div(puissance10)

    this.question = `Écrire $${texNombre(dec, 5)}$ sous la forme $\\dfrac{a}{10^n}$ avec $a\\in \\mathbb{Z}$ et $n\\in \\mathbb{N}$.`

    this.correction = `$${texNombre(dec, 5)}=\\dfrac{${texNombre(a, 0)}}{10^{${puissance}}}$`
    this.reponse = `\\dfrac{${a}}{10^{${puissance}}}`
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
