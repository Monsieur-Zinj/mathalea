import { choice } from '../../../lib/outils/arrayOutils'
import { obtenirListeFractionsIrreductibles } from '../../../lib/outils/deprecatedFractions.js'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Calculer une somme entre fraction et entier'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
  * Créé pendant l'été 2021
*/
export const uuid = '1853b'
export const ref = 'can3C04'
export const refs = {
  'fr-fr': ['can3C04'],
  'fr-ch': []
}
export default function SommeEntierEtFractionIrred () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { fractionIrreductible: true }

  this.nouvelleVersion = function () {
    const maFraction = choice(obtenirListeFractionsIrreductibles())
    const a = randint(1, 4)
    const b = maFraction[0]
    const c = maFraction[1]
    const bSurC = new FractionEtendue(b, c)
    const d = new FractionEtendue(a * c + b, c).simplifie()
    this.reponse = d
    this.question = `Calculer sous la forme d'une fraction irréductible :  $${a}+${bSurC.texFraction}$.`
    this.correction = `$${a}+${bSurC.texFraction} = \\dfrac{${a} \\times ${c}}{${c}} + ${bSurC.texFraction} = \\dfrac{${a * c}}{${c}} + ${bSurC.texFraction}  =${d.texFraction}$`
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
