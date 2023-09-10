import FractionEtendue from '../../../modules/FractionEtendue.js'
import { choice } from '../../../lib/outils/arrayOutils.js'
import {
  obtenirListeFractionsIrreductibles,
  simplificationDeFractionAvecEtapes
} from '../../../lib/outils/deprecatedFractions.js'
import Exercice from '../../Exercice.js'
export const titre = 'Rendre irréductible une fraction'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
  * Créé pendant l'été 2021
 * Référence can3C03
*/
export const uuid = 'f1208'
export const ref = 'can3C03'
export default function FractionIrreductible () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur15 inline'
  this.formatInteractif = 'fractionEgale'
  this.nouvelleVersion = function () {
    const maFraction = choice(obtenirListeFractionsIrreductibles())
    const k = choice([2, 3, 4, 5, 9, 10, 20])
    const a = k * maFraction[0]
    const b = k * maFraction[1]
    this.reponse = new FractionEtendue(maFraction[0], maFraction[1]).simplifie()
    this.question = `Rendre la fraction $\\dfrac{${a}}{${b}}$ irréductible.`
    this.correction = `$\\dfrac{${a}}{${b}}` + simplificationDeFractionAvecEtapes(a, b) + '$'
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
