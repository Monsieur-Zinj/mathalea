import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import FractionEtendue from '../../../modules/FractionEtendue'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'

export const titre = 'Calculer une probabilité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '88a19'
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
    // this.formatInteractif = 'calcul'
    this.compare = fonctionComparaison
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(3, 8).texFraction
      this.question = `On tire une boule au hasard dans une urne contenant $3$ boules rouges et $5$ boules noires. <br>
      Quelle est la probabilité de tirer une boule rouge ? `
      this.correction = `Il y a $3$ boules rouges sur un total de $8$ boules. <br>
      La probabilité de tirer une boule rouge est donc  $${miseEnEvidence(this.reponse)}$.`
    } else {
      const a = randint(2, 10)
      const b = randint(2, 10)
      this.reponse = new FractionEtendue(a, a + b).texFraction
      this.question = `On tire une boule au hasard dans une urne contenant $${a}$ boules rouges et $${b}$ boules noires. <br>
      Quelle est la probabilité de tirer une boule rouge ? `
      this.correction = `Il y a $${a}$ boules rouges sur un total de $${a + b}$ boules. <br>
      La probabilité de tirer une boule rouge est donc  $${miseEnEvidence(this.reponse)}${new FractionEtendue(a, a + b).texSimplificationAvecEtapes()}$.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
