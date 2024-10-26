import ExerciceQcmA from '../ExerciceQcmA'
import { choice } from '../../lib/outils/arrayOutils'
import { randint } from '../../modules/outils'
import { ecritureAlgebrique } from '../../lib/outils/ecritures'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const uuid = '80f6a'
export const refs = {
  'fr-fr': ['3QCM2-3'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'QCM calcul expression 2nd degré (issu du brevet septembre 2023 Métropole)'

export default class MetropoleSep23Ex1Q3 extends ExerciceQcmA {
  constructor () {
    super()
    this.aleatoire()
  }

  aleatoire = () => {
    const a = this.sup ? 3 : choice([2, 4, 5, 6])
    const b = this.sup ? -5 : -(randint(2, 6))
    const c = this.sup ? -2 : choice([-3, -4, -5])

    const resultat = c ** 2 + a * c + b
    this.reponses = [
      `$${String(resultat)}$`,
      `$${String(-(c ** 2) + a * c + b)}$`,
      `$${String(c * c - a * c + b)}$`
    ]
    this.enonce = `Quelle est la valeur de l'expression<br>$x^2+${String(a)}x${ecritureAlgebrique(b)}$ pour $x=${c}$ ?`
    this.correction = ` $\\begin{aligned}
     x^2+${String(a)}x${ecritureAlgebrique(b)} &= (${String(c)})^2+${String(a)}\\times (${String(c)})${ecritureAlgebrique(b)} \\\\
                                                        &=${String(c * c)}${ecritureAlgebrique(a * c)}${ecritureAlgebrique(b)} \\\\
                                                        &= ${miseEnEvidence(String(resultat))} \\\\
                                                        \\end{aligned} $`
  }
}
