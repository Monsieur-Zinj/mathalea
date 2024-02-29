import Exercice from '../../Exercice'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Effectuer un calcul'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'f5d12'
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
    this.canOfficielle = true
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 30
      this.question = '$2+4\\times 7$ '
      this.correction = `La multiplication est prioritaire :<br> $2+4\\times 7=2+28=${miseEnEvidence(45)}$`
    } else {
      const a = randint(2, 9)
      const b = randint(1, 9)
      const c = randint(2, 6)
      this.reponse = a + (b * c)
      this.question = `$${a} +${b}\\times ${c}$ `
      this.correction = `La multiplication est prioritaire :<br> 
      $${a} +${b}\\times ${c}=${a}+${b * c}=${miseEnEvidence(texNombre(this.reponse, 0))}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    if (this.interactif) {
      this.question += '$=$'
    }
  }
}
