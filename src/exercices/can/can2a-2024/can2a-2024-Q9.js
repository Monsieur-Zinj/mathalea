import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Calculer une racine carrée'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '71105'
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
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.optionsChampTexte = { texteAvant: ' $=$' }
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 6
      this.question = '$\\sqrt{36}$ '
      this.correction = `$\\sqrt{36}=${miseEnEvidence(6)}$`
    } else {
      const carre = randint(4, 12)
      this.reponse = carre
      this.question = `$\\sqrt{${carre ** 2}}$ `
      this.correction = `$\\sqrt{${carre ** 2}}=${miseEnEvidence(texNombre(this.reponse, 0))}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
