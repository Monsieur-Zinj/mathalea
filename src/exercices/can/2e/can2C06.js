import { choice } from '../../../lib/outils/arrayOutils'
import { extraireRacineCarree } from '../../../lib/outils/calculs'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Simplifier des racines carrées'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
 * Date de publication
*/
export const uuid = 'cc300'
export const ref = 'can2C06'
export const refs = {
  'fr-fr': ['can2C06'],
  'fr-ch': []
}
export default function SimplificationsRacinesCarrees () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    const a = choice([8, 18, 32, 50, 72, 98, 40, 200, 12, 27, 48, 75, 20, 45, 24, 28, 300, 500, 600, 700, 40, 44, 52, 60, 63, 90, 54])
    const reduction = extraireRacineCarree(a)
    this.question = ` Écrire $\\sqrt{${a}}$ sous la forme $a\\sqrt{b}$ où $a$ et $b$ sont des entiers avec $b$ le plus petit possible.`
    this.correction = `On simpifie $\\sqrt{${a}}$ en $${reduction[0]}\\sqrt{${reduction[1]}}$ , car
    $\\sqrt{${a}}=\\sqrt{${reduction[0]}^2\\times ${reduction[1]}} =
    \\sqrt{${reduction[0]}^2}\\times \\sqrt{${reduction[1]}} =
    ${miseEnEvidence(`${reduction[0]}\\sqrt{${reduction[1]}`)}}$.<br>`
    this.reponse = [`${reduction[0]}\\sqrt{${reduction[1]}}`, `${reduction[0]}\\times\\sqrt{${reduction[1]}}`]
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
