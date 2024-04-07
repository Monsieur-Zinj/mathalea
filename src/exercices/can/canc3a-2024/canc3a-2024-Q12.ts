import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Multiplier astucieusement'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '6d9c8'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora (reprise du fichier de Jean-Claude Lhote 6ième)
 * Référence
*/
export default class SoustractionDecimauxCM2 extends Exercice {
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
    let a:number
    let b: number
    let c: number
    if (this.canOfficielle) {
      a = 20
      b = 4
      c = 5
    } else {
      const [aa, cc] = choice([[25, 4], [50, 2], [250, 4], [500, 2], [200, 5], [2, 5]])
      a = aa
      c = cc
      b = randint(6, 9) * 2 + 1
    }
    this.reponse = (a * b * c).toFixed(0)
    this.question = `$${texNombre(a, 0)}\\times ${texNombre(b, 1)}\\times ${texNombre(c, 0)}$`
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    this.correction = `On  commence par calculer $${texNombre(a, 0)}\\times ${texNombre(c, 0)}=${texNombre(a * c, 0)}$, puis `
    this.correction += `on effectue $${texNombre(a * c, 0)}\\times ${texNombre(b, 1)}= ${miseEnEvidence(this.reponse)}$.`
  }
}
