import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { calculANePlusJamaisUtiliser, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Calculer avec triple et moitié'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can5C04
 */
export const uuid = '52336'
export const ref = 'can5C04'
export const refs = {
  'fr-fr': ['can5C04'],
  'fr-ch': []
}
export default function TripleEtMoitie () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nouvelleVersion = function () {
    const a = randint(3, 20)
    this.question = `Le triple d'un nombre vaut $${3 * a}$, combien vaut sa moitié ?`
    this.correction = `Le nombre est $${a}$, sa moitié est ${texNombre(a / 2)}.`
    this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    Si le triple du nombre est $${3 * a}$, ce nombre est : $${3 * a}\\div 3=${a}$.<br>
    Puisqu'on cherche sa moitié, on le divise par $2$, soit  $${a}\\div 2=${texNombre(a / 2)}$.<br>
     `)
    this.reponse = calculANePlusJamaisUtiliser(a / 2)
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
