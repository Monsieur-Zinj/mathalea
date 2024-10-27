import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
import FractionEtendue from '../../../modules/FractionEtendue'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Donner l\'écriture décimale d\'une fraction'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '221a5'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.optionsChampTexte = { texteAvant: ' : ' }
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 1.25
      this.question = 'Écriture décimale de $\\dfrac{5}{4}$'
      this.correction = `On décompose la  fraction : <br>
      $\\begin{aligned}
      \\dfrac{5}{4}&=\\dfrac{4}{4}+\\dfrac{1}{4}\\\\
      &=1+\\dfrac{1}{4}\\\\
      &=${miseEnEvidence(texNombre(this.reponse, 2))}
      \\end{aligned}$`
    } else {
      if (choice([true, false])) {
        const b = choice([1, 3, 4, 7, 9, 11])
        const maFraction = new FractionEtendue(b, 5)
        this.reponse = new Decimal(b).div(5)
        this.question = `Écriture décimale de  $${maFraction.texFraction}$ `
        this.correction = `$${maFraction.texFraction}=${miseEnEvidence(texNombre(this.reponse, 2))}$`
      } else {
        const b = choice([1, 3, 7, 9, 11])
        const maFraction = new FractionEtendue(b, 4)
        this.reponse = new Decimal(b).div(4)
        this.question = `Écriture décimale de   $${maFraction.texFraction}$ `
        this.correction = `$${maFraction.texFraction}=${miseEnEvidence(texNombre(this.reponse, 2))}$`
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
