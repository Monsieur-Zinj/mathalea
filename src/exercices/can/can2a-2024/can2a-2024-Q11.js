import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Compléter une égalité '
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '9fa79'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = false
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    // this.formatInteractif = 'calcul'
    this.compare = fonctionComparaison
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(17, 3)
      this.question = 'Compléter : $3\\times \\ldots =17$'
      this.optionsChampTexte = { texteAvant: '$3\\times$', texteApres: '$=17$' }
      if (this.interactif) {
        this.question = `Compléter : <br>
      `
      }
      this.correction = `Le nombre qui multiplié par $3$ donne $17$ est $${miseEnEvidence(this.reponse.texFraction)}$.
    `
      this.canEnonce = 'Compléter.'
      this.canReponseACompleter = '$3\\times \\ldots =17$'
    } else {
      const a = choice([11, 13, 17, 19])
      const b = choice([3, 6, 7, 9])
      this.reponse = new FractionEtendue(a, b)
      this.question = `Compléter : $${b}\\times \\ldots =${a}$`
      this.optionsChampTexte = { texteAvant: `$${b}\\times $`, texteApres: `$=${a}$` }
      if (this.interactif) {
        this.question = `Compléter : <br>
      `
      }
      this.correction = `Le nombre qui multiplié par $${b}$ donne $${a}$ est $${miseEnEvidence(this.reponse.texFraction)}$.
      `
      this.canEnonce = 'Compléter.'
      this.canReponseACompleter = `$${b}\\times \\ldots =${a}$`
    }
  }
}
