import ExerciceQcmA from '../ExerciceQcmA'
import { choice } from '../../lib/outils/arrayOutils'

export const uuid = '64ccf'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calcul avec des fractions (issu du brevet décembre 2023 Nouvelle Calédonie)'

export default class NouvelleCaledonieDec23Exo1Q2 extends ExerciceQcmA {
  constructor () {
    super()
    this.renewData(this.sup)
  }

  renewData (originale: boolean): void {
    const num2 = originale ? 2 : choice([2, 6, 10])
    const num1 = originale ? 3 : num2 + 1
    const num3 = originale ? 7 : choice([3, 7, 9])
    this.reponses = [
      `$\\dfrac{${num1 * 2 - num2 * num3}}{10}$`,
      '$\\dfrac{2}{10}$',
      '$\\dfrac{7}{20}$'
    ]
    this.bonneReponse = 0
    this.enonceA = `$\\dfrac{${num1}}{5}-\\dfrac{${num2}}{5} \\times \\dfrac{${num3}}{4}$`
    this.correctionA = ` $\\begin{aligned}
      \\dfrac{${num1}}{5}-\\dfrac{${num2}}{5} \\times \\dfrac{${num3}}{4} &= \\dfrac{${num1}}{5}-\\dfrac{${num2 * num3}}{20} \\\\
                                                        &= \\dfrac{${num1 * 2}}{10}-\\dfrac{${num2 * num3 / 2}}{10} \\\\
                                                        &= \\dfrac{${num1 * 2 - num2 * num3}}{10} \\\\
                                                        \\end{aligned} $`
  }
}
