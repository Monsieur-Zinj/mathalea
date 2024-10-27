import Exercice from '../../Exercice'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
export const titre = 'Calculer avec les tables de multiplication'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'bb525'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    this.optionsChampTexte = { texteAvant: ' $=$' }
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 18
      this.question = '$6\\times 3$ '
      this.correction = `$6\\times 3=${miseEnEvidence(18)}$`
    } else {
      const a = randint(3, 6)
      const b = randint(5, 9)
      this.reponse = a * b
      this.question = `$${a} \\times ${b}$ `
      this.correction = `$${a} \\times ${b}=${miseEnEvidence(texNombre(this.reponse, 0))}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
