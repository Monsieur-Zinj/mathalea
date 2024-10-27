import Exercice from '../../Exercice'
import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { texNombre } from '../../../lib/outils/texNombre'
import Decimal from 'decimal.js'
import FractionEtendue from '../../../modules/FractionEtendue'
export const titre = 'Donner l\'écriture décimale d\'une fraction'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '96963'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class ValeurDec extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 5.25
      this.question = 'Écriture décimale de $\\dfrac{21}{4}$<br>'
      this.correction = `On décompose la  fraction : <br>
      $\\begin{aligned}
      \\dfrac{21}{4}&=\\dfrac{20}{4}+\\dfrac{1}{4}\\\\
      &=5+\\dfrac{1}{4}\\\\
      &=${miseEnEvidence(texNombre(this.reponse, 2))}
      \\end{aligned}$`
    } else {
      if (choice([true, false])) {
        const b = choice([1, 3, 4, 7, 9, 11])
        const maFraction = new FractionEtendue(b, 5)
        this.reponse = new Decimal(b).div(5)
        this.question = `Écriture décimale de  $${maFraction.texFraction}$<br> `
        this.correction = `$${maFraction.texFraction}=${miseEnEvidence(texNombre(this.reponse, 2))}$`
      } else {
        const b = choice([1, 3, 7, 9, 11])
        const maFraction = new FractionEtendue(b, 4)
        this.reponse = new Decimal(b).div(4)
        this.question = `Écriture décimale de   $${maFraction.texFraction}$ <br>`
        this.correction = `$${maFraction.texFraction}=${miseEnEvidence(texNombre(this.reponse, 2))}$`
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
