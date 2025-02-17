import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Déterminer le nombre de km avec une vitesse'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6P03
 */
export const uuid = 'b0f1a'
export const ref = 'can6P03'
export const refs = {
  'fr-fr': ['can6P03'],
  'fr-ch': []
}
export default function QuestionDeVitesse () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.optionsChampTexte = { texteApres: ' km' }
  this.nouvelleVersion = function () {
    const a = randint(2, 6) * 20
    const b = randint(1, 6)
    this.reponse = Math.round(a * (b + 0.5))
    this.question = `Une voiture roule à une vitesse constante de $${a}$ km/h. <br>
    
    Combien de kilomètres parcourt-elle en $${b}$ h et $30$ min ?`
    this.correction = `$${a}\\times ${texNombre(b + 0.5)} = ${this.reponse}$`
    this.correction += texteEnCouleur(`<br> Mentalement : <br>
    La voiture roule à une vitesse constante de $${a}$ km/h, cela signifie qu'elle parcourt $${a}$ km en $1$ heure.<br>
    En $${b}$ heures, elle parcourt $${a}\\times ${b}=${a * b}$ km.<br>
    En $30$ minutes, elle parcourt la moitié de $${a}$ km, soit $${a / 2}$ km.<br>
    Au total, elle a parcouru $${a * b}+${a / 2} $, soit $${a * (b + 0.5)}$ km. `)
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dots$ km'
  }
}
