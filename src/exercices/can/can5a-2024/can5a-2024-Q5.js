import Exercice from '../../Exercice'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer une somme de deux décimaux'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '967e9'
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
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBase
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = '0,56'
      this.question = '$0,4+0,16$ '
      this.correction = `$0,4+0,16=${miseEnEvidence('0,56')}$`
    } else {
      const a = new Decimal(randint(12, 49, [20, 30, 40])).div(100)
      const b = new Decimal(randint(31, 69, [40, 50, 60])).div(10)
      this.reponse = new Decimal(a).add(b)
      this.question = `$${texNombre(a, 2)}+${texNombre(b, 2)}$`
      this.correction = ` $${texNombre(a, 2)}+${texNombre(b, 2)}=${miseEnEvidence(texNombre(this.reponse, 2))}$`
      this.canEnonce = this.question
      this.canReponseACompleter = '$\\ldots$'
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    if (this.interactif) {
      this.question += ' $=$'
    }
  }
}
