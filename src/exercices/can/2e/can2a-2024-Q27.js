import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import FractionEtendue from '../../../modules/FractionEtendue.js'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Déterminer une proportion'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'c5768'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = true
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'fractionEgale'
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      const f = new FractionEtendue(19, 31)
      this.reponse = f
      this.question = `Dans une classe de $31$ élèves, $12$ viennent au lycée à vélo. <br>
    La proportion d’élèves qui ne viennent pas à vélo est : `
      this.correction = `$12$ viennent au lycée à vélo, donc $19$ ne viennent pas au lycée à vélo.<br>
    La proportion d’élèves qui ne viennent pas à vélo est donc $${miseEnEvidence(f.texFraction)}$.`
    } else {
      const a = choice([19, 23, 29, 31])
      const b = randint(5, 15)
      const f = new FractionEtendue(a - b, a)
      this.reponse = f
      this.question = `Dans une classe de $${a}$ élèves, $${b}$ viennent au lycée à vélo. <br>
      La proportion d’élèves qui ne viennent pas à vélo est : ` //
      this.correction = `$${b}$ viennent au lycée à vélo, donc $${a - b}$ ne viennent pas au lycée à vélo.<br>
      La proportion d’élèves qui ne viennent pas à vélo est donc $${miseEnEvidence(f.texFraction)}$.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$'
    if (!this.interactif) {
      this.question += ' $\\ldots$'
    }
  }
}
