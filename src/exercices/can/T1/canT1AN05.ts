import { choice } from '../../../lib/outils/arrayOutils'
import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Limite $n^{-m}\\pm n^{p}$'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = '81cd8'
export const refs = {
  'fr-fr': ['canT1AN05'],
  'fr-ch': []
}
export const dateDePublication = '12/08/2024'

/**
 * limites de suites (canT)
 * @author Jean-Claude Lhote
 *
 */
class N2PlusUnSurN extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.typeExercice = 'simple'
  }

  nouvelleVersion () {
    const m = randint(-9, -1)
    const p = randint(1, 9)
    const pm = choice([true, false])
    const vn = m === -1
      ? '\\dfrac{1}{n}'
      : `\\dfrac{1}{n^${-m}}`
    const wn = p === 1
      ? 'n'
      : `n^${p}`
    this.question = 'Déterminer la limite de la suite $(u_n)$ définie pour tout entier positif n par : $'
    this.question += m === -1
      ? '\\dfrac{1}{n}'
      : `\\dfrac{1}{n^${-m}}`
    this.question += pm
      ? '+'
      : '-'
    this.question += p === 1
      ? 'n$'
      : `n^${p}$`
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
export default N2PlusUnSurN
