import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
export const titre = 'Calculer avec un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'a0698'
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
    this.formatInteractif = 'calcul'
    this.canOfficielle = true
    // this.question += ajouteChampTexteMathLive(this, 0, 'inline largeur01 nospacebefore', { texteAvant: '$=$' })
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 90
      this.question = '$20\\,\\%$ de $450$ est égal à : '
      this.correction = `$10\\,\\%$ de $450$ est égal à $45$ (pour prendre $10\\,\\%$  d'une quantité, on la divise par $10$), donc $20\\,\\%$ de $450$ est égal à $2\\times 45=${miseEnEvidence(this.reponse)}$.`
    } else {
      const a = randint(1, 5) * 10
      const p = randint(2, 9, 5) * 10
      this.reponse = a * p / 100
      this.question = `$${p}\\,\\%$ de $${a}$ est égal à : `

      this.correction = `Prendre $${p}\\,\\%$  de $${a}$ revient à prendre $${p / 10}\\times 10\\,\\%$  de $${a}$.<br>
      Comme $10\\,\\%$  de $${a}$ vaut $${a / 10}$ (pour prendre $10\\,\\%$  d'une quantité, on la divise par $10$), alors
      $${p}\\,\\%$ de $${a}=${p / 10}\\times ${a / 10}=${miseEnEvidence(this.reponse)}$.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$'
    if (!this.interactif) {
      this.question += '$\\ldots$'
    }
  }
}
