import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { ecritureAlgebrique } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { randint, calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
export const titre = 'Calculer une expression pour une valeur particulière'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can4L04
*/
export const uuid = '12514'
export const ref = 'can4L04'
export const refs = {
  'fr-fr': ['can4L04'],
  'fr-ch': []
}
export default function SubstitutionRelatif () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = -randint(2, 6)
    const b = randint(12, 25)
    const c = randint(3, 7)
    this.question = `Calculer $${b}+${c}x$ pour $x=${a}$.`
    this.correction = `$${b}+${c}x=${b}+${c}\\times (${a})=${b}${ecritureAlgebrique(c * a)}=${b + c * a}$ `
    this.correction += texteEnCouleur(`<br> Mentalement : <br>
       On commence par calculer le produit :  $${c}\\times (${a})$ qui donne $${a * c}$.<br>
       Puis, on calcule  $${b}${ecritureAlgebrique(c * a)}=${b + c * a}$.  `)

    this.reponse = calculANePlusJamaisUtiliser(b + c * a)
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
