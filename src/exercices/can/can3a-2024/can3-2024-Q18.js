import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import FractionEtendue from '../../../modules/FractionEtendue'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { equalFractionCompare } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Diviser des fractions'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'abad7'
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
    this.optionsChampTexte = { texteAvant: ' $=$' }
    this.formatInteractif = 'calcul'
    this.compare = equalFractionCompare
    this.canOfficielle = true
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = new FractionEtendue(4, 45)
      this.question = '$\\dfrac{2}{5}\\div\\dfrac{9}{2}$'
      this.correction = `Diviser par un nombre revient à multiplier par  son inverse. L'inverse de $\\dfrac{9}{2}$ est 
      $\\dfrac{2}{9}$. <br>Ainsi, 
      $\\dfrac{2}{5}\\div\\dfrac{9}{2}=\\dfrac{2}{5}\\times\\dfrac{2}{9}=${miseEnEvidence(this.reponse)}$.`
    } else {
      const listeFractions = [[2, 3, 4, 5], [2, 3, 5, 7], [2, 9, 3, 8], [4, 5, 3, 2], [4, 3, 5, 7], [3, 5, 2, 9],
        [4, 7, 2, 3], [1, 5, 3, 7], [4, 5, 1, 3], [3, 4, 9, 7], [8, 7, 2, 3]]
      const frac = choice(listeFractions)
      const a = frac[0]
      const b = frac[1]
      const c = frac[2]
      const d = frac[3]
      this.reponse = new FractionEtendue(a * d, b * c)

      this.question = `$\\dfrac{${a}}{${b}}\\div \\dfrac{${c}}{${d}}$`
      this.correction = `Diviser par un nombre revient à multiplier par  son inverse. L'inverse de $\\dfrac{${c}}{${d}}$ est 
      $\\dfrac{${d}}{${c}}$. <br>Ainsi, <br><br>
       $\\begin{aligned}
       \\dfrac{${a}}{${b}}\\div \\dfrac{${c}}{${d}}&=\\dfrac{${a}}{${b}}\\times \\dfrac{${d}}{${c}}\\\\
      &=\\dfrac{${a}\\times ${d}}{${b}\\times${c}}\\\\
      &=${miseEnEvidence((this.reponse).texFraction)}
      \\end{aligned}$<br>
      Ainsi, $\\dfrac{${a}}{${b}}\\div \\dfrac{${c}}{${d}}=${miseEnEvidence(new FractionEtendue(a * d, b * c).simplifie().texFraction)}$
      `
    }
    this.reponse = this.reponse.texFraction
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
