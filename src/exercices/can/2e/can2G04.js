import { choice } from '../../../lib/outils/arrayOutils'
import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
import { arrondi } from '../../../lib/outils/nombres'
import { creerNomDePolygone } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Calculer les coordonnées du milieu'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '29/11/2023'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can2G04
 * Date de publication sptembre 2021
*/
export const uuid = '8bc88'
export const ref = 'can2G04'
export default function CalculCoordonneesMilieu () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur01 inline'
  this.nouvelleVersion = function () {
    let a, b, c, d
    const nom = creerNomDePolygone(2, 'PQDO')
    switch (choice(['a', 'b'])) {
      case 'a':
        a = randint(-10, 10)
        b = randint(-10, 10, 0)
        c = randint(-10, 10)
        d = randint(-10, 10, 0)
        this.question = `Dans un repère du plan, on donne $${nom[0]}(${a}\\,;\\,${c})$ et $${nom[1]}(${b}\\,;\\,${d})$.<br>
        Déterminer les coordonnées du milieu de $[${nom[0] + nom[1]}]$ sous forme décimale.`
        this.optionsChampTexte = { texteApres: '' }
        this.correction = `Les coordonnées du milieu sont  données par :
        $\\left(\\dfrac{${a}+${b}}{2}\\,;\\,\\dfrac{${c}+${d}}{2}\\right)=
        \\left(\\dfrac{${texNombre(a + b, 0)}}{2}\\,;\\,\\dfrac{${texNombre(c + d, 0)}}{2}\\right)=
        (${texNombre((a + b) / 2, 1)}\\,;\\,${texNombre((c + d) / 2, 1)})$<br>`
        this.correction += texteEnCouleur(` Mentalement : <br>
       On calcule les moyennes des abscisses et des orodonnées des deux points.
         `)
        this.reponse = `(${arrondi((a + b) / 2, 1)};${arrondi((c + d) / 2, 1)})`

        break
      case 'b' :
        a = randint(-9, 9, 0)
        b = randint(-9, 9, 0)

        this.question = `Dans un repère du plan d'origine $O$, on donne $${nom[0]}(${a}\\,;\\,${b})$.<br>
        Déterminer les coordonnées du milieu de $[O${nom[0]}]$ sous forme décimale.`
        this.optionsChampTexte = { texteApres: '' }
        this.correction = `Comme les coordonnées du point $O$ sont $(0\\,;\\,0)$, les coordonnées du milieu sont  données par :
        $\\left(\\dfrac{0+${ecritureParentheseSiNegatif(a)}}{2}\\,;\\,\\dfrac{0+${ecritureParentheseSiNegatif(b)}}{2}\\right)
        =(${texNombre((a) / 2)};${texNombre((b) / 2)})$<br>`
        this.correction += texteEnCouleur(` Mentalement : <br>
       Puisque le premier point est l'origine du repère, les coordonnées du milieu sont données par la moitié de l'abscisse et de l'ordonnée du deuxième point.
         `)
        this.reponse = `(${arrondi((a) / 2, 1)};${arrondi((b) / 2, 1)})`

        break
    }
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
