import { calculANePlusJamaisUtiliser, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Chercher un reste en minutes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021
 * Référence can6D02
 */
export const uuid = '46e66'
export const ref = 'can6D02'
export const refs = {
  'fr-fr': ['can6D02'],
  'fr-ch': []
}
export default function ResteEnMinutes () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = randint(1, 2)
    const b = randint(10, 59)
    const d = calculANePlusJamaisUtiliser(a * 60 + b)
    this.question = ` $${d}$ minutes $=$  $a$ heure(s) et  $b$ minute(s).<br>
    Quelle est la valeur de $b$ sachant que $a$ est le plus grand possible?`
    this.correction = `$${d} = ${a} \\times 60 + ${b}$ donc $${d}$ minutes = $${a}h ${b}$ min, donc $b=${b}$.`
    this.reponse = b
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
