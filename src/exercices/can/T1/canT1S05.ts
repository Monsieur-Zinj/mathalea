import { choice } from '../../../lib/outils/arrayOutils'
import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Limite $u_n\\times v_n$'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = 'bf67b'
export const refs = {
  'fr-fr': ['canT1S05'],
  'fr-ch': []
}
export const dateDePublication = '13/08/2024'

/**
 * limites de suites (canT)
 * @author Jean-Claude Lhote
 *
 */
class UnFoisVn extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.typeExercice = 'simple'
  }

  nouvelleVersion () {
    const typeDeQuestion = randint(1,2)
    switch (typeDeQuestion){
      case 1:{//(cn+d)(a/n+ou-b)
        const a = randint(-9, 9, 0)
        const b = randint(1, 9)
        const c = randint(2,9)
        const d = randint(1,9,c)
        const pm = choice([true, false])
        const vn = `\\dfrac{${a}}{n}${pm ? '+' : '-'}${b}`
        const un = `${c}n+${d}`
        this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier n, strictement positif, par : $(${un})(${vn})$`
        this.correction = `On sait que $\\lim\\limits_{n\\to\\infty} ${un}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} ${vn}=${pm ? '' : '-'}${b}$.<br>`
        this.correction += 'Ainsi, d\'après les règles des limites d\'un produit, '
        this.correction += `$\\lim\\limits_{n\\to\\infty} (${un})(${vn})=${pm ? '+' : '-'}\\infty$.`
        this.reponse = `${pm ? '+' : '-'}\\infty`
      }
      break
      case 2:{//(a+ou-b/n)(c/n^d+ou-e)
        const a = randint(-9, 9, 0)
        const b = randint(1, 9)
        const c = randint(2,9)
        const d = randint(2,9)
        const e = randint(1, 9)
        const pm = choice([-1, 1])
        const vn = `\\dfrac{${c}}{n^${d}}${pm===1 ? '+' : '-'}${e}`
        const un = `${a}${choice([true,false])?'+':'-'}\\dfrac{${b}}{n}`
        this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier n, strictement positif, par : $(${un})(${vn})$.`
        this.correction = `On sait que $\\lim\\limits_{n\\to\\infty} ${un}=${a}$ et $\\lim\\limits_{n\\to\\infty} ${vn}=${e*pm}$.<br>`
        this.correction += 'Ainsi, d\'après les règles des limites d\'un produit, '
        this.correction += `$\\lim\\limits_{n\\to\\infty} (${un})(${vn})=${e*a*pm}$.`
        this.reponse = `${e*a*pm}`
      }
      break
    }
  }
}
export default UnFoisVn
