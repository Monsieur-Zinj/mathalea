import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
import { randint } from '../../../modules/outils.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { equalFractionCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Calculer avec des fractions '
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'bb035'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class NomExercice extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.canOfficielle = true
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction
    this.optionsChampTexte = { texteAvant: ' $=$' }
    this.formatInteractif = 'calcul'
    this.compare = equalFractionCompare
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(22, 7).texFraction
      this.question = '$3+\\dfrac{1}{7}$ '
      this.correction = `$\\begin{aligned}
      3+\\dfrac{1}{7} &= \\dfrac{3 \\times 7}{7} + \\dfrac{1}{7}\\\\
      & = \\dfrac{21}{7} + \\dfrac{1}{7}\\\\
      &  =${miseEnEvidence('\\dfrac{22}{7}')}
      \\end{aligned}$`
    } else {
      const listeFractions2 = [[1, 3], [2, 3], [3, 7], [2, 7], [4, 3], [5, 3], [4, 7], [1, 5], [3, 5], [1, 7], [2, 9], [1, 9], [7, 9], [1, 8], [5, 8]
      ]
      const frac = choice(listeFractions2)
      const a = randint(1, 4)
      const b = frac[0]
      const c = frac[1]
      const bSurC = new FractionEtendue(b, c)
      const d = new FractionEtendue(a * c + b, c)
      this.reponse = d
      this.question = `$${a}+${bSurC.texFraction}$ `
      this.correction = `$\\begin{aligned}
      ${a}+${bSurC.texFraction} &= \\dfrac{${a} \\times ${c}}{${c}} + ${bSurC.texFraction} \\\\
      &= \\dfrac{${a * c}}{${c}} + ${bSurC.texFraction}\\\\
      &  =${miseEnEvidence(d.texFraction)}
      \\end{aligned}$`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
