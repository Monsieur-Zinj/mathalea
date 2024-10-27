import Exercice from '../../Exercice'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer astucieusement une somme de deux décimaux'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '3e52d'
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
      this.reponse = '11,8'
      this.question = '$1,8+5,3+4,7$ '
      this.correction = `$1,8+\\underbrace{5,3+4,7}_{=10}=${miseEnEvidence('11,8')}$`
    } else {
      const choix1 = choice([true, false])
      const choix = randint(2, 2)
      if (choix === 1) {
        const a = new Decimal(randint(11, 49, [15, 20, 25, 30, 35, 40, 45])).div(10)
        const b = new Decimal(10).sub(a)
        const c = new Decimal(randint(21, 59, [30, 40, 50])).div(10)
        this.reponse = new Decimal(a).add(b).add(c)
        this.question = `${choix1 ? `$${texNombre(c, 2)}+${texNombre(a, 2)}+${texNombre(b, 2)}=$` : `$${texNombre(a, 2)}+${texNombre(c, 2)}+${texNombre(b, 2)}$`}`
        this.correction = `${choix1
? `$${texNombre(c, 2)}+\\underbrace{${texNombre(a, 2)}+${texNombre(b, 2)}}_{=10}=${miseEnEvidence(texNombre(this.reponse, 2))}$`
      : `$${texNombre(a, 2)}+${texNombre(c, 2)}+${texNombre(b, 2)}=${texNombre(c, 2)}+\\underbrace{${texNombre(a, 2)}+${texNombre(b, 2)}}_{=1}=${miseEnEvidence(texNombre(this.reponse, 2))}$`}`
      }
      if (choix === 2) {
        const a = new Decimal(randint(11, 49, [20, 30, 40])).div(100)
        const b = new Decimal(1).sub(a)
        const c = new Decimal(randint(21, 59, [30, 40, 50])).div(100)
        this.reponse = new Decimal(a).add(b).add(c)
        this.question = `$${texNombre(c, 2)}+${texNombre(a, 2)}+${texNombre(b, 2)}$`
        this.correction = ` $${texNombre(c, 2)}+\\underbrace{${texNombre(a, 2)}+${texNombre(b, 2)}}_{=1}=${miseEnEvidence(texNombre(this.reponse, 2))}$`
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    if (this.interactif) {
      this.question += ' $=$'
    }
  }
}
