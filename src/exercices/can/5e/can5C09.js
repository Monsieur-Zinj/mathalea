import { texteEnCouleur } from '../../../lib/outils/embellissements.js'
import { texNombre } from '../../../lib/outils/texNombre.js'
import { calcul, randint } from '../../../modules/outils.js'
import Exercice from '../../Exercice.js'
export const titre = 'Multiplier par les multiples de 101'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can5C09
 */
export const uuid = '1a593'
export const ref = 'can5C09'
export default function MutliplierParN0N () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.typeExercice = 'simple'
  this.formatChampTexte = 'largeur15 inline'
  this.nouvelleVersion = function () {
    const a = randint(2, 4)
    const b = randint(9, 24, [10, 20])
    this.reponse = calcul(101 * a * b)
    this.question = `Calculer $${b}\\times ${texNombre(a * 101)}$.`
    this.correction = `$${b}\\times ${a * 101}= ${101 * a * b}$<br><br>`
    this.correction += `${texteEnCouleur('Mentalement :')}<br>`
    this.correction += `${texteEnCouleur('On calcule $' + a + '\\times ' + b + '=' + texNombre(a * b) + '$ puis on multiplie par $101$ ce qui revient à ajouter $' + texNombre(a * b * 100) + '$ et $' + texNombre(a * b) + '$.')}`
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
