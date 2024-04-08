import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { texNombre } from '../../../lib/outils/texNombre'
import Decimal from 'decimal.js'
import { randint } from '../../../modules/outils'
export const titre = 'Déterminer la raison d\'une suite géométrique'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'e3466'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class raisonSuiteG extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    let a: number
    let b: number
    if (this.canOfficielle) {
      a = -3
      b = 9
      this.reponse = -3
    } else {
      a = randint(2, 9)
      b = a * randint(2, 9) * (-1)

      this.reponse = new Decimal(b).div(a)
    }
    this.question = `$(u_n)$ est une suite géométrique telle que $u_0=${a}$ et $u_1=${b}$<br>`
    this.question += 'La raison de cette suite est : '
    this.correction = `La raison de la suite est donnée par le quotient $\\dfrac{u_1}{u_0}=\\dfrac{${b}}{${a}}=${miseEnEvidence(texNombre(this.reponse, 0))}$.`

    if (!this.interactif) { this.question += ' $\\ldots$' }
    this.canEnonce = this.question
    this.canReponseACompleter = 'La raison de cette suite est $\\ldots$'
  }
}
