import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Limite de $n^m+\\sqrt{n}$'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = '61ef0'
export const refs = {
  'fr-fr': ['canTSpeS01'],
  'fr-ch': []
}
export const dateDePublication = '12/08/2024'

/**
 * limites de suites (canT)
 * @author Jean-Claude Lhote
 *
 */
class N2PlusRacineDeN extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.typeExercice = 'simple'
  }

  nouvelleVersion () {
    const a = randint(2, 9) * choice([-1, 1])
    this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier positif ou nul $n$ par : <br> $u_n=n^{${a}}+\\sqrt{n}$.`
    this.correction = a > 0
      ? `On sait que $\\lim\\limits_{n\\to\\infty} n^{${a}}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} \\sqrt{n}=+\\infty$.<br>`
      : `On sait que $\\lim\\limits_{n\\to\\infty} n^{${a}}=\\lim\\limits_{n\\to\\infty} \\dfrac{1}{n^${-a}}=0$ et $\\lim\\limits_{n\\to\\infty} \\sqrt{n}=+\\infty$.<br>`
    this.correction += `Ainsi, par somme, $\\lim\\limits_{n\\to\\infty} n^{${a}}+\\sqrt{n}=${miseEnEvidence('+\\infty')}$.`
    this.reponse = '+\\infty'
  }
}
export default N2PlusRacineDeN
