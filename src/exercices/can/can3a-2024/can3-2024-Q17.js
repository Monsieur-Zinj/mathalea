import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import FractionEtendue from '../../../modules/FractionEtendue'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { equalFractionCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Calculer une probabilité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '54dc6'
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
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'calcul'
    this.compare = equalFractionCompare
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(4, 10)
      this.question = `Une urne contient des jetons numérotés de $1$ à $10$.<br>
      On tire au hasard un jeton. <br>
     Quelle est la probabilité de tirer un nombre premier ?`
      this.correction = `Les nombres premiers inférieurs à $10$ sont : $2$, $3$, $5$, $7$.<br>
      Il y a donc $4$ nombres premiers inférieurs à $10$. <br>
      On en déduit que la probabilité d'obtenir un nombre premier est : $${miseEnEvidence(new FractionEtendue(4, 10))}${new FractionEtendue(4, 10).texSimplificationAvecEtapes()}$.`
    } else {
      const a = randint(8, 22)
      const b = 4
      this.question = `Une urne contient des jetons numérotés de $1$ à $${a}$.<br>
        On tire au hasard un jeton. <br>
        Quelle est la probabilité de tirer un nombre premier ?`
      if (a < 11) {
        this.correction = `Les nombres premiers inférieurs à $${a}$ sont : $2$, $3$, $5$, $7$.<br>
        Il y a donc $4$ nombres premiers inférieurs à $${a}$. <br>
        On en déduit que la probabilité d'obtenir un nombre premier est : $${miseEnEvidence(new FractionEtendue(b, a))}${new FractionEtendue(b, a).texSimplificationAvecEtapes()}$.`
        this.reponse = new FractionEtendue(b, a)
      }
      if ((a > 10) && (a < 13)) {
        this.correction = `Les nombres premiers inférieurs à $${a}$ sont : $2$, $3$, $5$, $7$, $11$.<br>
Il y a donc $5$ nombres premiers inférieurs à $${a}$. <br>
On en déduit que la probabilité d'obtenir un nombre premier est : $${miseEnEvidence(new FractionEtendue(b + 1, a))}${new FractionEtendue(b + 1, a).texSimplificationAvecEtapes()}$.`
        this.reponse = new FractionEtendue(b + 1, a)
      }
      if ((a > 12) && (a < 17)) {
        this.correction = `Les nombres premiers inférieurs à $${a}$ sont : $2$, $3$, $5$, $7$, $11$, $13$.<br>
Il y a donc $6$ nombres premiers inférieurs à $${a}$. <br>
On en déduit que la probabilité d'obtenir un nombre premier est : $${miseEnEvidence(new FractionEtendue(b + 2, a))}${new FractionEtendue(b + 2, a).texSimplificationAvecEtapes()}$.`
        this.reponse = new FractionEtendue(b + 2, a)
      }
      if ((a > 16) && (a < 19)) {
        this.correction = `Les nombres premiers inférieurs à $${a}$ sont : $2$, $3$, $5$, $7$, $11$, $13$, $17$.<br>
Il y a donc $7$ nombres premiers inférieurs à $${a}$. <br>
On en déduit que la probabilité d'obtenir un nombre premier est : $${miseEnEvidence(new FractionEtendue(b + 3, a))}${new FractionEtendue(b + 3, a).texSimplificationAvecEtapes()}$.`
        this.reponse = new FractionEtendue(b + 3, a)
      }
      if ((a > 18) && (a < 23)) {
        this.correction = `Les nombres premiers inférieurs à $${a}$ sont : $2$, $3$, $5$, $7$, $11$, $13$, $17$, $19$.<br>
Il y a donc $8$ nombres premiers inférieurs à $${a}$.
<br>
On en déduit que la probabilité d'obtenir un nombre premier est : $${miseEnEvidence(new FractionEtendue(b + 4, a))}${new FractionEtendue(b + 4, a).texSimplificationAvecEtapes()}$.`
        this.reponse = new FractionEtendue(b + 4, a)
      }
    }
    this.reponse = this.reponse.texFraction
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
