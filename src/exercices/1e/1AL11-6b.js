import { choice } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { randint } from '../../modules/outils.js'
export const titre = 'Calculer la somme des termes d\'une suite arithmétique'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '30/11/2021'

/**
 * Calculer \sum_{k=0}^n u_k, avec n et (u_n) (suite arithmétique) données
 * @author Rémi Angot
 * Référence 1N12
*/
export const uuid = 'cfac9'
export const ref = '1AL11-6b'
export const refs = {
  'fr-fr': ['1AL11-6b'],
  'fr-ch': []
}
export default class SommeSuiteArithmetique extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 2
    this.spacingCorr = 1.5
    this.consigneCorrection = 'Rappel : $1 + 2 + 3 + ... + n = \\dfrac{n(n + 1)}{2}$'
  }

  nouvelleVersion () {
    const u0 = randint(1, 10)
    const r = randint(3, 10)
    const n = randint(2, 4) * 10
    const u = choice(['u', 'v', 'w'])
    this.question = `Soit $${u}$ la suite arithmétique de premier terme $${u}_0 = ${u0}$ et de raison $${r}$.`
    this.question += `<br>Calculer $\\displaystyle S = ${u}_0 + ${u}_1 + ... + ${u}_{${n}} =\\sum_{k=0}^{k=${n}}${u}_k$.`
    this.reponse = (n + 1) * (u0 + u0 + n * r) / 2
    this.correction = `$S = ${u0} + (${u0} + ${r}) + (${u0} + 2\\times${r}) + ... + (${u0} + ${n} \\times ${r})$`
    this.correction += `<br>$\\phantom{S} = (\\underbrace{${u0} + ${u0} + ... + ${u0}}_{${n + 1}\\times ${u0}}) + ${r} \\times (1 + 2 + ... + ${n})$`
    this.correction += `<br>$\\phantom{S} = ${n + 1} \\times ${u0} + ${r} \\times \\dfrac{${n}\\times${n + 1}}{2}$`
    this.correction += `<br>$\\phantom{S} = ${texNombre(this.reponse)}$`
  }
}
