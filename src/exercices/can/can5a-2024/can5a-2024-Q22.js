import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import FractionEtendue from '../../../modules/FractionEtendue'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Additionner deux fractions de même dénominateur'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'd9478'
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
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'fractionEgale'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(11, 3)
      this.question = `$\\dfrac{4}{3}+\\dfrac{7}{3} ${this.interactif ? '=' : ''}$ `
      this.correction = `Les fractions ont le même dénominateur, ainsi :  <br>
      $\\dfrac{4}{3}+\\dfrac{7}{3}=${miseEnEvidence(this.reponse)}$`
    } else {
      const listeFractions = [[1, 3, 4, 3], [1, 7, 3, 7], [5, 7, 3, 7], [3, 8, 10, 8],
        [5, 3, 2, 3], [7, 5, 2, 5], [7, 3, 10, 3], [4, 7, 9, 7], [7, 13, 2, 13], [1, 9, 4, 9]]
      const a = choice(listeFractions)
      const b = new FractionEtendue(a[0], a[1])
      const c = new FractionEtendue(a[2], a[3])
      this.reponse = new FractionEtendue(a[0] + a[2], a[3])
      this.question = `$${b.texFraction}+${c.texFraction} ${this.interactif ? '=' : ''}$`
      this.correction = `$${b.texFraction}+${c.texFraction}=${miseEnEvidence(this.reponse.texFraction)}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dfrac{\\ldots}{\\ldots}$'
  }
}
