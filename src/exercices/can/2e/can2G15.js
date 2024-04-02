import { ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
import { sp } from '../../../lib/outils/outilString.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'

export const titre = 'Déterminer le déterminant de deux vecteurs'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '04/03:2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Stéphane Guyon
 * Référence
 */
export const uuid = '84eaa'
export const ref = 'can2G15'
export const refs = {
  'fr-fr': ['can2G15'],
  'fr-ch': []
}
export default function DeterminantVecteur () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur10 inline'
  this.listeAvecNumerotation = false
  this.nouvelleVersion = function () {
    const vx = randint(-5, 5)
    const vy = randint(-5, 5)
    const ux = randint(-5, 5, 0)
    const uy = randint(-5, 5)
    const det = ux * vy - uy * vx

    this.question = `Dans un repère orthonormé, on donne les vecteurs $\\vec{u}\\begin{pmatrix}${ux}${sp(1)} \\\\ ${sp(1)}${uy}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx}${sp(1)} \\\\ ${sp(1)}${vy}\\end{pmatrix}$.<br>
      Calculer le déterminant des vecteurs $\\vec{u}$ et $\\vec{v}$.<br><br>`
    this.optionsChampTexte = { texteAvant: '$det\\left(\\vec{u}\\,;\\,\\vec{v}\\right)=$' }
    this.correction = `On sait d'après le cours que si $\\vec{u}\\begin{pmatrix}x \\\\ y\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x' \\\\ y'\\end{pmatrix}$, alors :<br><br>
      $det\\left(\\vec{u}\\,;\\,\\vec{v}\\right)=\\begin{vmatrix}x&x'\\\\y&y'\\end{vmatrix}=xy'-x'y$.<br><br>
      En appliquant à l'énoncé :<br><br>
      $det\\left(\\vec{u}\\,;\\,\\vec{v}\\right)=\\begin{vmatrix}${ux}&${vx}\\\\${uy}&${vy}\\end{vmatrix}=${ux}\\times ${ecritureParentheseSiNegatif(vy)}-${ecritureParentheseSiNegatif(vx)}\\times${ecritureParentheseSiNegatif(vy)}=${miseEnEvidence(`${ux * vy - vx * uy}`)}$.<br>`
    this.reponse = `${ux * vy - vx * uy}`

    this.canEnonce = this.question // 'Compléter'
    this.canReponseACompleter = ''
  }
}
