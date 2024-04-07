import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import Hms from '../../../modules/Hms'
import { context } from '../../../modules/context'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Transformer une heure décimale en heures/minutes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '318bc'
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
    this.keyboard = ['hms']
    this.formatChampTexte = 'largeur01 inline nospacebefore inline ' + KeyboardType.clavierHms
    this.formatInteractif = 'hms'

    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new Hms({ hour: 1, minute: 6 })
      if (!this.interactif) {
        this.question = `$1,10$ h $=$ ${context.isHtml ? '..... h ..... min' : ''}`
      } else {
        this.question = 'Convertir en heures/minutes : $1,10$ h $=$'
      }
      this.correction = `$1,10$ h $=1$ h $+$ $0,1\\times 60 $ min $=${miseEnEvidence(1)}$ h $${miseEnEvidence(6)}$ min`
    } else {
      const a = randint(1, 5)
      const b = choice([0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.9, 0.25, 0.5, 0.75])
      const d = b * 60
      this.reponse = new Hms({ hour: a, minute: d })
      if (!this.interactif) {
        this.question = `$${texNombre(a + b)}$ h $=$ ${context.isHtml ? '..... h ..... min' : ''}`
      } else {
        this.question = `Convertir en heures/minutes : $${texNombre(a + b)}$ h $=$`
      }
      this.correction = `$${texNombre(a + b)}$ h $ = ${a}$ h $ +$ $ ${texNombre(b)} \\times 60$ min $  = ${miseEnEvidence(a)}$ h $${miseEnEvidence(d)}$ min`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ h $\\ldots$ min'
  }
}
