import ExerciceQcmA from '../ExerciceQcmA'
import { choice } from '../../lib/outils/arrayOutils'
import { fraction } from '../../modules/fractions'

export const uuid = '64ccf'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calcul avec des fractions (issu du brevet décembre 2023 Nouvelle Calédonie)'

export default class NouvelleCaledonieDec23Exo1Q2 extends ExerciceQcmA {
  constructor () {
    super()
    this.aleatoire()
  }

  aleatoire = () => {
    const num2 = this.sup ? 2 : choice([2, 6, 10])
    const num1 = num2 + 1
    const num3 = this.sup ? 7 : choice([3, 7, 9])
    const frac1 = fraction(num1, 5)
    const frac2 = fraction(num2, 5)
    const frac3 = fraction(num3, 4)
    const produit = frac2.produitFraction(frac3)
    const frac1Bis = frac1.reduire(2)
    const resultat = frac1Bis.differenceFraction(produit.simplifie()).texFSD
    this.reponses = [
      `$${resultat}$`,
      `$\\dfrac{${(num1 - num2) * num3}}{20}$`,
      `$\\dfrac{${num2 * num3 - num1}}{15}$`
    ]
    this.bonneReponse = 0
    this.enonce = `$${frac1.texFraction}-${frac2.texFraction} \\times ${frac3.texFraction}$`
    this.correction = ` $\\begin{aligned}
     ${frac1.texFraction}-${frac2.texFraction} \\times ${frac3.texFraction} &=  ${frac1.texFraction}-${produit.texFraction} \\\\
                                                        &=${frac1Bis.texFraction}-${produit.reduire(0.5).texFraction} \\\\
                                                        &= ${resultat} \\\\
                                                        \\end{aligned} $`
  }
}
