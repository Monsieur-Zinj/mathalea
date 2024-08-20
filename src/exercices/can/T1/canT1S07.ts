import { choice } from '../../../lib/outils/arrayOutils'
import { rienSi1 } from '../../../lib/outils/ecritures'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
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
    const typeDeQuestion = randint(3, 3)
    switch (typeDeQuestion) {
      case 1:
        {
          // n^m-n^p
          const m = randint(2, 9)
          const p = randint(2, 9, m)
          const diff = m - p
          const un = `n^${m}`
          const vn = `n^${p}`
          this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier n, strictement positif, par : $${un}-${vn}$.`
          this.correction = `On sait que $\\lim\\limits_{n\\to\\infty} ${un}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} ${vn}=+\\infty$.<br>`
          this.correction += `Nous avons donc une forme indeterminée du type "$\\infty - \\infty$", donc nous allons factoriser $${m > p ? `n^${m}` : `n^${p}`}$ :<br>`
          if (m > p) {
            this.correction += `$${un}-${vn}=n^${m}(1-n^{${-diff}})=n^${m}(1-${diff === 1 ? '\\dfrac{1}{n}' : `\\dfrac{1}{n^${diff}}`})$.<br>Or, $\\lim\\limits_{n\\to\\infty} n^${m}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} 1-${diff === 1 ? '\\dfrac{1}{n}' : `\\dfrac{1}{n^${diff}}`}=1$.<br>`
            this.reponse = '+\\infty'
          } else {
            this.correction += `$${un}-${vn}=n^${p}(${diff === 1 ? 'n' : `n^{${diff}}`}-1)=n^${p}(${diff === -1 ? '\\dfrac{1}{n}' : `\\dfrac{1}{n^{${-diff}}}`}-1)$.<br>Or, $\\lim\\limits_{n\\to\\infty} n^${p}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} ${diff === -1 ? '\\dfrac{1}{n}' : `\\dfrac{1}{n^{${-diff}}}`}-1=-1$.<br>`
            this.reponse = '-\\infty'
          }
          this.correction +=
            "Ainsi, d'après les règles des limites d'un produit, "
          this.correction += `$\\lim\\limits_{n\\to\\infty} ${un}-${vn}=${miseEnEvidence(this.reponse)}$.`
        }
        break
      case 2:
        {
          // sqrt(n)-n^p ou n^p-sqrt(n)
          const m = randint(2, 9)
          const a = randint(1, 9)
          const choix = choice([true, false])
          const un = choix ? `${rienSi1(a)}\\sqrt{n}` : `n^${m}\\sqrt{n}`
          const vn = !choix ? `${rienSi1(a)}\\sqrt{n}` : `n^${m}\\sqrt{n}`
          this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier n, strictement positif, par : $${un}-${vn}$.`
          this.correction = `On sait que $\\lim\\limits_{n\\to\\infty} ${un}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} ${vn}=+\\infty$.<br>`
          this.correction += 'Nous avons donc une forme indeterminée du type "$\\infty - \\infty$", donc nous allons factoriser $\\sqrt{n}$ :<br> '
          if (choix) {
            this.correction += `$${un}-${vn}=\\sqrt{n}(${a}-n^${m})$.<br>Or, $\\lim\\limits_{n\\to\\infty} \\sqrt{n}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} ${a}-n^${m}=-\\infty$.<br>`
            this.reponse = '-\\infty'
          } else {
            this.correction += `$${un}-${vn}=\\sqrt{n}(n^${m}-${a})$.<br>Or, $\\lim\\limits_{n\\to\\infty} \\sqrt{n}=+\\infty$ et $\\lim\\limits_{n\\to\\infty} n^${m}-${a}=+\\infty$.<br>`
            this.reponse = '+\\infty'
          }
          this.correction +=
            "Ainsi, d'après les règles des limites d'un produit, "
          this.correction += `$\\lim\\limits_{n\\to\\infty} ${un}-${vn}=${miseEnEvidence(this.reponse)}$.`
        }
        break
      case 3:
        {
          // (a+ou-n^m)/n^p
          const m = randint(2, 9)
          const a = randint(1, 9)
          const p = randint(2, 9)
          const pm = choice(['+', '-'])
          const un = `${a}${pm}n^${m}`
          const vn = `n^${p}`
          this.question = `Déterminer la limite de la suite $(u_n)$ définie pour tout entier n, strictement positif, par : $\\dfrac{${un}}{${vn}}$.`
          this.correction = `On sait que $\\lim\\limits_{n\\to\\infty} ${un}=${pm === '+' ? '+' : '-'}\\infty$ et $\\lim\\limits_{n\\to\\infty} ${vn}=+\\infty$.<br>`
          this.correction += `Nous avons donc une forme indeterminée du type "$\\dfrac{\\infty}{\\infty}$", donc nous allons factoriser $n^${m > p ? m : p}$ :<br> `
          if (p === m) {
            this.correction += `$\\dfrac{${un}}{${vn}}=\\dfrac{n^${p}(\\dfrac{${a}}{n^${p}}${pm}1)}{n^${p}}=\\dfrac{${a}}{n^${p}}${pm}1$ en simplifiant par $n^${p}$.<br>Or, $\\lim\\limits_{n\\to\\infty} \\dfrac{${a}}{n^${p}}=0$.<br>`
            this.reponse = pm === '+' ? '1' : '-1'
          } else if (p > m) {
            this.correction += `$\\dfrac{${un}}{${vn}}=\\dfrac{n^${p}(\\dfrac{${a}}{n^${p}}${pm}\\dfrac{1}{n^${p - m}})}{n^${p}}=\\dfrac{${a}}{n^${p}}${pm}\\dfrac{1}{n^${p - m}}$ en simplifiant par $n^${p}$.<br>Or, $\\lim\\limits_{n\\to\\infty} \\dfrac{${a}}{n^${p}}${pm}\\dfrac{1}{n^${p - m}}=0$.<br>`
            this.reponse = '0'
          } else {
            // m>p
            this.correction += `$\\dfrac{${un}}{${vn}}=\\dfrac{n^${m}(\\dfrac{${a}}{n^${m}}${pm}1)}{n^${m}\\times n^{${p - m}}}=\\dfrac{\\dfrac{${a}}{n^${m}}${pm}1}{\\dfrac{1}{n^${m - p}}}$ en simplifiant par $n^${m}$.<br>Or, $\\lim\\limits_{n\\to\\infty} \\dfrac{${a}}{n^${m}}${pm}1=${pm === '+' ? '1' : '-1'}$ et $\\lim\\limits_{n\\to\\infty} \\dfrac{1}{n^${m - p}}=0$.<br>`
            this.reponse = `${pm}\\infty`
          }
          this.correction += `Alors, $\\lim\\limits_{n\\to\\infty} \\dfrac{${un}}{${vn}}=${miseEnEvidence(this.reponse)}$.`
        }
        break
    }
  }
}
export default LimiteFormeIndeterminee
