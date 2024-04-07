import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer une somme avec des relatifs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ef726'
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
    this.optionsChampTexte = { texteAvant: ' $=$ ' }
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = -1
      this.question = '$7-14+6$'
      this.correction = `$\\underbrace{7-14}_{=-7}+6=-7+6=${miseEnEvidence(this.reponse)}$`
    } else {
      const a = randint(2, 10)
      const b = a + randint(4, 10)
      const c = randint(2, 10)
      this.reponse = a - b + c
      this.question = `$${a}-${b}+${c}$`
      this.correction = `$\\underbrace{${a}-${b}}_{=${a - b}}+${c}=${a - b}+${c}=${miseEnEvidence(this.reponse)}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
