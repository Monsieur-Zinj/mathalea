import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { reduirePolynomeDegre3, ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
export const titre = 'Calculer un discriminant'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '17868'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class DeltaSecondDegre extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 ' + KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
  }

  nouvelleVersion () {
    let a : number
    let b : number
    let c: number
    if (this.canOfficielle) {
      this.reponse = -7
      a = 2
      b = -1
      c = 1
    } else {
      a = randint(1, 2)
      b = randint(-6, 6, 0)
      c = randint(-2, 2, 0)

      this.reponse = b ** 2 - 4 * a * c
    }
    this.question = `Le discriminant du trinôme $${reduirePolynomeDegre3(0, a, b, c)}$ est `

    this.correction = ` $\\Delta=b^2-4ac$ avec $a=${a}$, $b=${b}$ et $c=${c}$.<br>
      $\\begin{aligned}
      \\Delta&=${ecritureParentheseSiNegatif(b)}^2-4\\times ${ecritureParentheseSiNegatif(a)}\\times ${ecritureParentheseSiNegatif(c)} \\\\
      &=${miseEnEvidence(this.reponse)} 
      \\end{aligned}$`
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$'
    if (!this.interactif) { this.question += ' $\\ldots$' }
  }
}
