import { choice } from '../../../lib/outils/arrayOutils'
import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Limite $e^{-n}\\pm kn$'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = '9c60f'
export const refs = {
  'fr-fr': ['canT1S03'],
  'fr-ch': []
}
export const dateDePublication = '12/08/2024'

/**
 * limites de suites (canT)
 * @author Jean-Claude Lhote
 *
 */
class ExpNPmKn extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.typeExercice = 'simple'
  }

  nouvelleVersion () {
    const k = randint(2, 9)
    const pm = choice([true, false])
    const vn = 'e^{-n}'
    const wn = `${k}n`
    this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier positif ou nul n par : $${vn}${pm ? '+' : '-'}${wn}$`

    this.correction = `On sait que $\\lim\\limits_{n\\to\\infty} ${vn}=0$ et $\\lim\\limits_{n\\to\\infty} ${wn}=+\\infty$.<br>`
    this.correction += 'Ainsi, d\'après les règles des limites de la somme, '
    this.correction += pm
      ? `$\\lim\\limits_{n\\to\\infty} ${vn}+${wn}=+\\infty$.`
      : `$\\lim\\limits_{n\\to\\infty} ${vn}-${wn}=-\\infty$.`
    this.reponse = pm
      ? '+\\infty'
      : '-\\infty'
  }
}
export default ExpNPmKn
