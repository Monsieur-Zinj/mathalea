import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import Decimal from 'decimal.js'
export const titre = 'Multiplier deux décimaux'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '9379b'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    this.optionsChampTexte = { texteAvant: ' $=$' }
    this.formatInteractif = 'calcul'
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = '0,06'
      this.question = '$0,2\\times 0,3$'
      this.correction = 'On décompose le calcul pour le rendre plus simple mentalement :<br>'
      this.correction += ' $\\begin{aligned} 0,2\\times 0,3 &=2\\times 0,1\\times 3\\times 0,1\\\\'
      this.correction += ' &= 6\\times 0,01\\\\'
      this.correction += `\n&= ${miseEnEvidence('0,06')}`
      this.correction += '\n\\end{aligned}$'
    } else {
      const a = new Decimal(randint(1, 9)).div(10)
      const b = new Decimal(randint(1, 9)).div(10)
      this.reponse = a.mul(b)
      this.question = `$${texNombre(a, 1)}\\times${texNombre(b, 1)}$`
      this.correction = 'On décompose le calcul pour le rendre plus simple mentalement :<br>'
      this.correction += `  $\\begin{aligned} ${texNombre(a, 1)}\\times${texNombre(b, 1)} &=${texNombre(a * 10, 0)}\\times 0,1\\times ${texNombre(b * 10, 0)}\\times 0,1\\\\`
      this.correction += ` &= ${texNombre(a * b * 100, 0)}\\times 0,01\\\\`
      this.correction += `'\n&= ${miseEnEvidence(texNombre(this.reponse, 2))}`
      this.correction += '\n\\end{aligned}$'
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
