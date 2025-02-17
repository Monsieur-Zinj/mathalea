import { ecritureAlgebrique, ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
import { sp } from '../../../lib/outils/outilString.js'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Déterminer un produit scalaire avec les coordonnées'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '27/06/2022'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can1G04
 *
*/
export const uuid = 'e20cc'
export const ref = 'can1G05'
export const refs = {
  'fr-fr': ['can1G05'],
  'fr-ch': []
}
export default function ProduitScalaireCoordonnees () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    const ux = randint(-10, 10)
    const uy = randint(-10, 10, 0)
    const vx = randint(-10, 10, 0)
    const vy = randint(-10, 10, 0)

    this.question = ` Dans un repère orthonormé $\\big(O ; \\vec \\imath,\\vec j\\big)$, on donne deux vecteurs :<br>
    $\\vec{u}\\begin{pmatrix}${ux}${sp(1)} \\\\ ${sp(1)}${uy}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx}${sp(1)} \\\\ ${sp(1)}${vy}\\end{pmatrix}$<br>

    Alors $\\vec{u}\\cdot\\vec{v}=$`
    if (!this.interactif) { this.question += ' ....' }
    this.correction = `$\\vec{u}\\cdot\\vec{v}=${ux}\\times ${ecritureParentheseSiNegatif(vx)}+${ecritureParentheseSiNegatif(uy)}\\times ${ecritureParentheseSiNegatif(vy)}=
    ${ux * vx} ${ecritureAlgebrique(uy * vy)}=${ux * vx + uy * vy}$



   `
    this.reponse = ux * vx + uy * vy
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
