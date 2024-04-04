import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { factorisationCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Factoriser avec une identité remarquable'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '2f071'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 ' + KeyboardType.clavierDeBaseAvecFractionPuissanceCrochets
    this.formatInteractif = 'calcul'
    this.compare = factorisationCompare
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = '(x-5)(x+5)'
      this.question = ' Factoriser  $x^2-25$.<br>'
      this.correction = `On utilise l'égalité remarquable $a^2-b^2=(a+b)(a-b)$ avec $a=x$ et $b=5$.<br>
    $\\begin{aligned}x^2-25&=x^2-5^2\\\\
    &=${miseEnEvidence('(x-5)(x+5)')}\\end{aligned}$`
    } else {
      const a = randint(1, 10)
      this.reponse = `(x-${a})(x+${a})`
      this.question = ` Factoriser  $x^2-${a * a}$.<br>`
      this.correction = `On utilise l'égalité remarquable $a^2-b^2=(a+b)(a-b)$ avec $a=x$ et $b=${a}$.<br>
      $\\begin{aligned}x^2-${a * a}&=x^2-${a}^2\\\\
      &=${miseEnEvidence(`(x-${a})(x+${a})`)}\\end{aligned}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
