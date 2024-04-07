import Exercice from '../../Exercice'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
export const titre = 'Écrire un nombre à partir des dizaines ou des centaines'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '2264e'
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
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'calcul'
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 2500
      this.question = 'Écris le nombre égal à $25$ centaines. '
      this.correction = `$25$ centaines $=25\\times 100=${miseEnEvidence(2500)}$`
      this.canEnonce = this.question
      this.canReponseACompleter = ''
    } else {
      const choix = choice([true, false])
      const a = randint(12, 29)
      this.reponse = choix ? a * 100 : a * 10
      this.question = `Écris le nombre égal à $${a}$ ${choix ? 'centaines' : 'dizaines'}. `
      this.correction = `$${a}$ ${choix ? 'centaines' : 'dizaines'} $=${a}\\times ${choix ? '100' : '10'}=${miseEnEvidence(texNombre(this.reponse, 0))}$.`
    }

    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
