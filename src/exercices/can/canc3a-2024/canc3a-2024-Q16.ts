import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Calculer le quart d\'une quantité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'f5788'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora (reprise du fichier de Jean-Claude Lhote 6ième)
 * Référence
*/
export default class PourcentageFacileCM2 extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.formatChampTexte = ' '
    this.canOfficielle = false
  }

  nouvelleVersion () {
    let distance: number
    let unite: string

    if (this.canOfficielle) {
      distance = 60
      unite = 'km'
    } else {
      distance = randint(1, 9) * 10
      unite = choice(['km', 'm', 'kg', 'g'])
    }
    this.optionsChampTexte = { texteApres: unite, texteAvant: ' $=$' }

    this.reponse = distance.toFixed(0)
    this.question = `Le quart de $${texNombre(distance * 4, 0)}$ ${unite}`
    this.canEnonce = this.question
    this.canReponseACompleter = `$\\ldots$ ${unite}`
    this.correction = `Prendre le quart d'une quantité revient à la diviser par $4$. <br>
    Ainsi, le quart de $${texNombre(distance * 4, 0)}$ ${unite} est éagl à $${texNombre(distance * 4, 0)}\\div 4=${miseEnEvidence(this.reponse)}$  ${unite}.`
  }
}
