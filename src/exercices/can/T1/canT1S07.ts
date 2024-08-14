import { choice } from '../../../lib/outils/arrayOutils'
import FractionEtendue from '../../../modules/FractionEtendue'
import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Limite formes indéterminées'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = '0ce7f'
export const refs = {
  'fr-fr': ['canT1S07'],
  'fr-ch': []
}
export const dateDePublication = '13/08/2024'

/**
 * limites de suites (canT)
 * @author Jean-Claude Lhote
 *
 */
class LimiteFormeIndeterminee extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.typeExercice = 'simple'
  }

  nouvelleVersion () {
    const typeDeQuestion = randint(1,1)
    switch (typeDeQuestion){
      case 1:{// n^m-n^p
        const m = randint(2, 9)
        const p = randint(2, 9,m)
        const diff = m-p
        const un = `n^${m}`
        const vn = `n^${p}`
        this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier n, strictement positif, par : $${un}-${vn}$.`
        this.correction = `On sait que $\\lim\\limits_{n\\to\\infty} ${un}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} ${vn}=+\\infty$.<br>`
        this.correction += 'Nous avons donc une forme indeterminée donc nous allons factoriser la différence : '
         if (m>p){
           this.correction += `$${un}-${vn}=n^${m}(1-n^{${-diff}})=n^${m}(1-${diff===1? '\\dfrac{1}{n}':`\\dfrac{1}{n^${diff}}`})$.<br>Or, $\\lim\\limits_{n\\to\\infty} n^${m}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} 1-${diff===1? '\\dfrac{1}{n}':`\\dfrac{1}{n^${diff}}`}=1$.<br>`
           this.reponse = '+\\infty'
          } else {
          this.correction += `$${un}-${vn}=n^${p}(${diff===1?'n':`n^{${diff}}`}-1)=n^${p}(${diff===-1?'\\dfrac{1}{n}':`\\dfrac{1}{n^{${-diff}}}`}-1)$.<br>Or, $\\lim\\limits_{n\\to\\infty} n^${p}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} ${diff===-1?'\\dfrac{1}{n}':`\\dfrac{1}{n^{${-diff}}}`}-1=-1$.<br>`
          this.reponse = '-\\infty'
        }
        this.correction += 'Ainsi, d\'après les règles des limites d\'un produit, '
        this.correction += `$\\lim\\limits_{n\\to\\infty} ${un}-${vn}=${this.reponse}$.`
     }
      break
      /*
      case 2:{//(a+ou-b/n)/(c/n^d+ou-e)
        const a = randint(-9, 9, 0)
        const b = randint(1, 9)
        const c = randint(2,9)
        const d = randint(2,9)
        const e = randint(1, 9)
        const pm = choice([-1, 1])
        const vn = `\\dfrac{${c}}{n^${d}}${pm===1 ? '+' : '-'}${e}`
        const un = `${a}${choice([true,false])?'+':'-'}\\dfrac{${b}}{n}`
        this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier n, strictement positif, par : $\\dfrac{${un}}{${vn}}$.`
        this.correction = `On sait que $\\lim\\limits_{n\\to\\infty} ${un}=${a}$ et $\\lim\\limits_{n\\to\\infty} ${vn}=${e*pm}$.<br>`
        this.correction += 'Ainsi, d\'après les règles des limites d\'un quotient, '
        const limite = new FractionEtendue(a,e*pm).simplifie()
        this.correction += `$\\lim\\limits_{n\\to\\infty} \\dfrac{${un}}{${vn}}=${limite.texFSD}$.`
        this.reponse = limite.texFSD
      }
      break
      case 3:{//(a+ou-b/n)/(c/n^d)
        const a = randint(-9, 9, 0)
        const b = randint(1, 9)
        const c = randint(2,9)
        const d = randint(2,9)
        const e = randint(1, 9)
        const pm = choice([-1, 1])
        const vn = `\\dfrac{${c}}{n^${d}}`
        const un = `${a}${choice([true,false])?'+':'-'}\\dfrac{${b}}{n}`
        this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier n, strictement positif, par : $\\dfrac{${un}}{${vn}}$.`
        this.correction = `On sait que $\\lim\\limits_{n\\to\\infty} ${un}=${a}$ et $\\lim\\limits_{n\\to\\infty} ${vn}=0$.<br>`
        this.correction += 'Ainsi, d\'après les règles des limites d\'un quotient, '
        const limite = a>0 ? '+\\infty' : '-\\infty'
        this.correction += `$\\lim\\limits_{n\\to\\infty} \\dfrac{${un}}{${vn}}=${limite}$.`
        this.reponse = limite
      }
      break
      case 4:{// an/n^b
        const a = randint(-9, 9, 0)
        const b = randint(2, 9)
        const vn = `n^${b}`
        const un = `${a}n`
        this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier n, strictement positif, par : $\\dfrac{${un}}{${vn}}$.`
        this.correction = `On sait que $\\dfrac{${un}}{${vn}}=${a}n^{(1-${b})}=${a}\\times\\dfrac{1}{n^${b-1}}$ et $\\lim\\limits_{n\\to\\infty} \\dfrac{1}{n^${b-1}}=0$.<br>`
        this.correction += 'Ainsi, d\'après les règles des limites d\'un produit, '
        this.correction += `$\\lim\\limits_{n\\to\\infty} \\dfrac{${un}}{${vn}}=0$.`
        this.reponse = '0'
      }
      break
      */
    }
  }
}
export default LimiteFormeIndeterminee
