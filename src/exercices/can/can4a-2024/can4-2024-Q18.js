import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import FractionEtendue from '../../../modules/FractionEtendue'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Déterminer l\'opposé ou l\'inverse d\'une fraction'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '719da'
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
    this.formatInteractif = 'fractionEgale'
    this.canOfficielle = false
    // this.question += ajouteChampTexteMathLive(this, 0, 'inline largeur01 nospacebefore', { texteAvant: '$=$' })
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(2, 3).oppose()
      this.question = 'L\'opposé de $\\dfrac{2}{3}$ est : '
      this.correction = `L'opposé de $\\dfrac{2}{3}$ est : $${miseEnEvidence(this.reponse.texFSD)}$.`
    } else {
      const listeFractions = [[1, 3], [1, 7], [5, 7], [3, 7],
        [5, 3], [7, 9], [7, 3], [4, 7], [7, 13], [1, 9]]
      const a = choice(listeFractions)
      if (choice([true, false])) {
        this.reponse = new FractionEtendue(a[0], a[1]).oppose()
        this.question = `L'opposé de $\\dfrac{${a[0]}}{${a[1]}}$ est : `
        this.correction = `L'opposé de $\\dfrac{${a[0]}}{${a[1]}}$ est : $${miseEnEvidence(this.reponse.texFSD)}$.`
      } else {
        this.reponse = new FractionEtendue(a[0], a[1]).inverse()
        this.question = `L'inverse de $\\dfrac{${a[0]}}{${a[1]}}$ est : `
        this.correction = `L'inverse de $\\dfrac{${a[0]}}{${a[1]}}$ est : $${miseEnEvidence(this.reponse.texFSD)}$.`
      }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$'
    if (!this.interactif) {
      this.question += '$\\ldots$'
    }
  }
}
