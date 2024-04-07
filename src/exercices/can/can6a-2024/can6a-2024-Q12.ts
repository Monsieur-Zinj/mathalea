import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import Decimal from 'decimal.js'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Multiplier astucieusement'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'd149d'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Jean-Claude Lhote
 * Référence
*/
export default class SoustractionDecimaux extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.optionsChampTexte = { texteAvant: ' $=$' }
    this.canOfficielle = false
    this.formatChampTexte = 'largeur01'
  }

  nouvelleVersion () {
    let a:Decimal
    let b: Decimal
    let c: Decimal
    if (this.canOfficielle) {
      a = new Decimal('50')
      b = new Decimal('3.5')
      c = new Decimal('2')
    } else {
      const [aa, cc] = choice([[25, 4], [50, 2], [250, 4], [500, 2]])
      a = new Decimal(aa)
      c = new Decimal(cc)
      b = new Decimal(randint(2, 9) * 2 + 1).div(2)
    }
    this.reponse = a.mul(b).mul(c).toFixed(0)
    this.question = `$${texNombre(a, 0)}\\times ${texNombre(b, 1)}\\times ${texNombre(c, 0)}$`
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    this.correction = `On  commence par calculer $${texNombre(a, 0)}\\times ${texNombre(c, 0)}=${texNombre(a.mul(c), 0)}$, puis `
    this.correction += `on effectue $${texNombre(a.mul(c), 0)}\\times ${texNombre(b, 1)}= ${miseEnEvidence(this.reponse)}$.`
  }
}
