import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureAlgebrique, ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
import { sp } from '../../../lib/outils/outilString.js'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
import FractionEtendue from '../../../modules/FractionEtendue.ts'
export const titre = 'Déterminer une coordonnée avec un produit scalaire'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '29/06/2022'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can1G07
 *
*/
export const uuid = '14aa1'
export const ref = 'can1G07'
export const refs = {
  'fr-fr': ['can1G07'],
  'fr-ch': []
}
export default function RechercheCoordonneesProdScal () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatInteractif = 'fractionEgale'
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    const ux = randint(-10, 10)
    const uy = randint(-10, 10, 0)
    const vx = randint(-10, 10, 0)
    const vy = randint(-10, 10, 0)
    const f1 = new FractionEtendue(-ux * vx, vy)
    const f2 = new FractionEtendue(-uy * vy, ux)
    switch (choice([1, 2])) { //
      case 1:
        this.question = ` Dans un repère orthonormé $\\big(O ; \\vec \\imath,\\vec \\jmath\\big)$, on considère les vecteurs :<br>
    $\\vec{u}\\begin{pmatrix}${ux}${sp(1)} \\\\ ${sp(1)}x\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}${vx}${sp(1)} \\\\ ${sp(1)}${vy}\\end{pmatrix}$<br>
  
    Que vaut $x$ si $\\vec{u}$ et $\\vec{v}$ sont orthogonaux ?`

        this.correction = `Les vecteurs $\\vec{u}$ et $\\vec{v}$ sont orthogonaux, donc $\\vec{u}\\cdot\\vec{v}=0$.<br>
    On en déduit : $${ux}\\times ${ecritureParentheseSiNegatif(vx)}+x\\times ${ecritureParentheseSiNegatif(vy)}=0$, soit $${ux * vx}${ecritureAlgebrique(vy)}x=0$.<br>
    Cette équation a pour solution $x=\\dfrac{${-ux * vx}}{${vy}}${f1.texSimplificationAvecEtapes()}$.
    



   `
        this.reponse = f1
        break
      case 2 :
        this.question = ` Dans un repère orthonormé $\\big(O ; \\vec \\imath,\\vec \\jmath\\big)$, on considère les vecteurs :<br>
        $\\vec{u}\\begin{pmatrix}${ux}${sp(1)} \\\\ ${sp(1)}${uy}\\end{pmatrix}$ et $\\vec{v}\\begin{pmatrix}x${sp(1)} \\\\ ${sp(1)}${vy}\\end{pmatrix}$<br>
        
        Que vaut $x$ si $\\vec{u}$ et $\\vec{v}$ sont orthogonaux ?`

        this.correction = `Les vecteurs $\\vec{u}$ et $\\vec{v}$ sont orthogonaux, donc $\\vec{u}\\cdot\\vec{v}=0$.<br>
        On en déduit : $${ux}\\times x+${ecritureParentheseSiNegatif(uy)}\\times ${ecritureParentheseSiNegatif(vy)}=0$, soit $${ux}x ${ecritureAlgebrique(uy * vy)}=0$.<br>
        Cette équation a pour solution $x=\\dfrac{${-uy * vy}}{${ux}}${f2.texSimplificationAvecEtapes()}$.
        
    
    
    
       `
        this.reponse = f2
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
