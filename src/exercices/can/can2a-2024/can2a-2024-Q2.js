import Exercice from '../../Exercice'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Additionner des relatifs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ba553'
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
    this.optionsChampTexte = { texteAvant: ' $=$' }
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 0
      this.question = ' $50-55+5$'
      this.correction = `$50-55+5=${miseEnEvidence(0)}$`
    } else {
      const a = choice([35, 45, 55, 65])
      const b = a + choice([5, 10])
      const c = randint(5, 10)
      this.reponse = a - b + c
      this.question = ` $${a}-${b}+${c}$`
      this.correction = `$${a}-${b}+${c}=${miseEnEvidence(texNombre(this.reponse, 0))}$`
      this.canEnonce = this.question
      this.canReponseACompleter = ''
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
