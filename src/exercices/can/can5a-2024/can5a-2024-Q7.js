import Exercice from '../../Exercice'
import Decimal from 'decimal.js'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

export const titre = 'Multiplier par $10$ ou $100$ ou ...'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '93b90'
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
      this.reponse = '3087,2'
      this.question = `$308,72\\times 10 ${this.interactif ? '=' : ''}$ `
      this.correction = `$308,72\\times 10=${miseEnEvidence('3087,2')}$`
    } else {
      const d = new Decimal(randint(1, 9)).div(10)
      const c = new Decimal(randint(1, 9)).div(100)
      const a = new Decimal(randint(1, 9)).add(d).add(c)
      const k = choice([10, 100, 1000])
      this.reponse = a.mul(k)
      this.question = `$${texNombre(a, 3)}\\times ${texNombre(k, 0)} ${this.interactif ? '=' : ''}$`
      this.correction = `$${texNombre(a, 3)}\\times ${k}=${miseEnEvidence(texNombre(a * k, 2))}$ `
      this.canEnonce = this.question
      this.canReponseACompleter = ''
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
