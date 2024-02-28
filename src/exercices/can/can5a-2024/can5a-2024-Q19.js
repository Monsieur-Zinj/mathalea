import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Appliquer un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'b4d85'
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
    this.formatChampTexte = 'largeur01 inline nospacebefore'
    this.optionsChampTexte = { texteApres: '€' }
    this.formatInteractif = 'calcul'
    this.canOfficielle = true
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 15
      this.question = '$25\\,\\%$ de $60$ € est égal à : '
      this.correction = `Prendre $25\\,\\%$ de $60$ € revient à prendre le quart de $60$   : <br>
      $\\dfrac{1}{4}\\times 60  =60\\div 4=${miseEnEvidence(15)} $ €`
    } else {
      if (choice([true, false])) {
        const a = randint(3, 10)
        const val = 4 * a
        this.reponse = a
        this.question = `$25\\,\\%$ de $${val}$ € est égal à : `
        this.correction = `Prendre $25\\,\\%$ de $${val}$ € revient à prendre le quart de $${val}$ : <br>
        $\\dfrac{1}{4}\\times ${val}=${val}\\div 4=${miseEnEvidence(this.reponse)}$ €`
      } else {
        const a = randint(2, 9)
        const val = 10 * a
        this.reponse = a
        this.question = `$10\\,\\%$ de $${val}$ € est égal à : `
        this.correction = `Prendre $10\\,\\%$ de $${val}$ revient à prendre le dixième de $${val}$ : <br>
        $\\dfrac{1}{10}\\times ${val}=${val}\\div 10=${miseEnEvidence(this.reponse)}$ €`
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ €'
    if (!this.interactif) {
      this.question += '$\\ldots$ €'
    }
  }
}
