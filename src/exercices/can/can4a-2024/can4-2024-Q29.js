import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Calculer un produit astucieusement'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'fc710'
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
    this.optionsChampTexte = { texteAvant: '$=$' }
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 40
      this.question = '$2,5\\times 16$ '
      this.correction = `$2,5\\times 16=\\underbrace{2\\times 16}_{=32}+ \\underbrace{0,5 \\times 16}_{=8}=${miseEnEvidence(this.reponse)}$`
    } else {
      const couple = choice([[16, 25, 2], [16, 15, 1], [8, 15, 1], [14, 25, 2], [18, 15, 1], [18, 25, 2], [12, 15, 1], [12, 25, 2], [20, 25, 2], [20, 15, 1]])
      const a = couple[0]
      const b = couple[1] / 10
      this.reponse = new Decimal(a).mul(b)
      this.question = `$${texNombre(b, 1)}\\times ${a}$ `
      this.correction = `$${texNombre(b, 1)}\\times ${a}=
      \\underbrace{${couple[2]}\\times ${couple[0]}}_{=${couple[2] * couple[0]}}+\\underbrace{0,5 \\times ${couple[0]}}_{=${texNombre(couple[0] / 2, 0)}}=${miseEnEvidence(texNombre(this.reponse, 1))}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
