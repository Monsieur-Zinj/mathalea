import { choice } from '../../../lib/outils/arrayOutils.js'
import { texteEnCouleur } from '../../../lib/outils/embellissements.js'
import { ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures.js'
import { arrondi } from '../../../lib/outils/nombres.js'
import { creerNomDePolygone } from '../../../lib/outils/outilString.js'
import { texNombre } from '../../../lib/outils/texNombre.js'
import Exercice from '../../Exercice.js'
import { randint } from '../../../modules/outils.js'
export const titre = 'Trouver les coordonnées d\'un point avec un milieu'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '29/11/2023'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence can2G22
 * 
*/
export const uuid = '9ff07'
export const ref = 'can2G22'
export default function CoordonneesMilieuExtremite () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = 'largeur01 inline'
  this.nouvelleVersion = function () {
    let a, b, c, d
    const nom = creerNomDePolygone(2, 'PQDO')
   
        a = randint(-9, 9, 0)
        b = randint(-9, 9, 0)
        this.question = `Dans un repère du plan d'origine $O$, on donne $${nom[0]}(${a};${b})$.<br>
        Déterminer les coordonnées du point $${nom[1]}$ de façon que $O$ soit le milieu de $[${nom[0]}${nom[1]}]$.<br>`
        this.optionsChampTexte = { texteApres: '' }
        this.correction = `Les points $${nom[0]}$ et $${nom[1]}$ ont des coordonnées opposées (faire un petit dessin pour représenter la situation), donc $${nom[1]}(${texNombre(-a)};${texNombre(-b)})$`
        this.reponse = `(${arrondi(-a, 0)};${arrondi(-b, 0)})`

    
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
