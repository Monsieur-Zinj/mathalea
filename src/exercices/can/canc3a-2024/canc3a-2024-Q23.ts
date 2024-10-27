import Exercice from '../../Exercice'
import { randint } from '../../../modules/outils'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'

export const titre = 'Calculer la moitié d\'un entier'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '43cf8'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora (reprise du fichier de Jean-Claude Lhote 6ième)
 * Référence
*/

export default class MoitieCM2 extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    // this.formatInteractif = 'calcul'
    this.formatChampTexte = ''
    this.canOfficielle = false
    this.compare = fonctionComparaison
  }

  nouvelleVersion () {
    let entier: number
    if (this.canOfficielle) {
      entier = 38
    } else {
      entier = (1 + randint(1, 2) * 2) * 10 + randint(1, 4) * 2
    }
    const moitie = entier >> 1
    this.question = `La moitié de $${entier}$`
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    this.reponse = texNombre(moitie, 0)
    const unit = entier % 10
    const rondeur = entier - 10 - unit
    this.correction = `La moitié de $${texNombre(entier, 0)}$ est $${miseEnEvidence(texNombre(moitie, 0))}$.<br>`
    this.correction += `Pour calculer facilement, on peut faire ainsi :<br>$${texNombre(entier, 0)}\\div 2=(${texNombre(rondeur, 0)}\\div 2) + (${texNombre(10 + unit, 0)}\\div 2)=${texNombre(rondeur / 2, 0)}+${texNombre((10 + unit) / 2, 0)}=${miseEnEvidence(this.reponse)}$`
  }
}
