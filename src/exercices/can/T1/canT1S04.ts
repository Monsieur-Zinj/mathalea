import { choice } from '../../../lib/outils/arrayOutils'
import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Limite $\\dfrac{a\\pm kn}{n}$'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = '76669'
export const refs = {
  'fr-fr': ['canT1S04'],
  'fr-ch': []
}
export const dateDePublication = '12/08/2024'

/**
 * limites de suites (canT)
 * @author Jean-Claude Lhote
 *
 */
class APlusbBnSurN extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.typeExercice = 'simple'
  }

  nouvelleVersion () {
    const a = randint(-9, 9, 0)
    const b = randint(1, 9)
    const pm = choice([true, false])
    const vn = `${a}${pm ? '+' : '-'}${b}n`
    this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier positif n par : $\\dfrac{${vn}}{n}$.`
    this.correction = `Pour tout entier n strictement positif, on a : $\\dfrac{${vn}}{n}=\\dfrac{${-a}}{n}${pm ? '+' : '-'}${b}$.<br>`
    this.correction += `$\\lim\\limits_{n\\to\\infty} \\dfrac{${-a}}{n}=0$ et $\\lim\\limits_{n\\to\\infty} ${b}=${b}$.<br>`
    this.correction += 'Ainsi, d\'après les règles des limites de la somme, '
    this.correction += `$\\lim\\limits_{n\\to\\infty} \\dfrac{${vn}}{n}=${pm ? '+' : '-'}${b}$.`
    this.reponse = `${pm ? '+' : '-'}${b}`
  }
}
export default APlusbBnSurN
