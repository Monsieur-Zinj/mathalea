import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer une différence de deux entiers'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'd63e8'
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
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 18
      this.question = '$47-29$ '
      this.correction = `$47-29=${miseEnEvidence(18)}$`
    } else {
      const a = randint(41, 88, [49, 59, 69, 79])
      const b = choice([19, 29])
      this.reponse = a - b
      this.question = `$${a}-${b}$ `
      this.correction = `$${a}-${b}=${a}-${b + 1}+1=${a - b}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    if (this.interactif) {
      this.question += ' $=$'
    }
  }
}
