import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import FractionEtendue from '../../../modules/FractionEtendue'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { equalFractionCompare } from '../../../lib/interactif/comparisonFunctions'

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
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.formatInteractif = 'calcul'
    this.compare = equalFractionCompare
    this.optionsChampTexte = { texteAvant: 'est', texteApres: '.' }
    this.canOfficielle = false
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(2, 3).oppose()
      this.question = 'L\'opposé de $\\dfrac{2}{3}$ '
      this.correction = `Deux nombres sont opposés lorsque leur somme est nulle.<br>
      L'opposé de $\\dfrac{2}{3}$ est : $${miseEnEvidence(this.reponse.texFSD)}$.`
    } else {
      const listeFractions = [[1, 3], [1, 7], [5, 7], [3, 7],
        [5, 3], [7, 9], [7, 3], [4, 7], [7, 13], [1, 9]]
      const a = choice(listeFractions)
      if (choice([true, false])) {
        this.reponse = new FractionEtendue(a[0], a[1]).oppose()
        this.question = `L'opposé de $\\dfrac{${a[0]}}{${a[1]}}$ `
        this.correction = `Deux nombres sont opposés lorsque leur somme est nulle.<br>
        L'opposé de $\\dfrac{${a[0]}}{${a[1]}}$ est : $${miseEnEvidence(this.reponse.texFSD)}$.`
      } else {
        this.reponse = new FractionEtendue(a[0], a[1]).inverse()
        this.question = `L'inverse de $\\dfrac{${a[0]}}{${a[1]}}$ `
        this.correction = `Deux nombres sont inverses l'un de l'autre lorsque leur produit vaut $1$.<br>
        L'inverse de $\\dfrac{${a[0]}}{${a[1]}}$ est  $${miseEnEvidence(this.reponse.texFSD)}$ car $\\dfrac{${a[0]}}{${a[1]}}\\times ${this.reponse.texFSD}=1$.`
      }
    }
    this.reponse = this.reponse.texFSD
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
