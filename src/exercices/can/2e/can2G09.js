import { choice } from '../../../lib/outils/arrayOutils'
import { sp } from '../../../lib/outils/outilString.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Déterminer le coefficient de colinéarité entre deux vecteurs'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '30/10/2021' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export const uuid = 'ee579'
export const ref = 'can2G09'
export const refs = {
  'fr-fr': ['can2G09'],
  'fr-ch': []
}
export default function VecteursColineaires () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne
  this.formatChampTexte = 'largeur01 inline'
  this.nouvelleVersion = function () {
    const p = choice([-2, 2, 3, 4, -4, -3])
    const ux = randint(1, 5)
    const uy = randint(1, 5)
    const vx = p * ux
    const vy = p * uy
    this.question = `Dans un repère orthonormé $\\big(O\\,;\\,\\vec \\imath,\\,\\vec \\jmath\\big)$, on a :<br>
       $\\vec{u}\\left(${ux}${sp(1)} ; ${sp(1)} ${uy}\\right)$ et $\\vec{v}\\left(${vx}${sp(1)} ; ${sp(1)} a\\right)$<br>
      Pour quelle valeur de $a$, les vecteurs $\\vec{u}$ et $\\vec{v}$ sont-ils colinéaires ?`
    this.correction = `Les deux vecteurs sont colinéaires, donc il existe un réel $k$ tel que $\\vec{v}=k\\times \\vec{u}$.<br>
       Comme $${vx}=${p}\\times ${ux}$, alors $y_{\\vec{v}}=${p}\\times${uy}=${p * uy}$, donc $a=${miseEnEvidence(`${p * uy}`)}$.`
    this.reponse = vy
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = '$a=\\ldots$'
  }
}
