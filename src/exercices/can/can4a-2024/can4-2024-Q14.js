import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Connaître le vocabulaire du cube'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'cfd87'
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
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 8
      this.question = 'Le nombre de sommets d\'un cube est :  '
      this.correction = `Un cube a $${miseEnEvidence(8)}$ sommets.`
    } else {
      const choix = choice(['a', 'b', 'c'])
      if (choix === 'a') {
        this.reponse = 8
        this.question = 'Le nombre de sommets d\'un cube est :  '
        this.correction = `Un cube a $${miseEnEvidence(8)}$ sommets.`
      }

      if (choix === 'b') {
        this.reponse = 6
        this.question = 'Le nombre de faces d\'un cube est :  '
        this.correction = `Un cube a $${miseEnEvidence(6)}$ faces.`
      }
      if (choix === 'c') {
        this.reponse = 12
        this.question = 'Le nombre d\'arêtes d\'un cube est :  '
        this.correction = `Un cube a $${miseEnEvidence(12)}$ arêtes.`
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$'
    if (!this.interactif) {
      this.question += '$\\ldots$'
    }
  }
}
