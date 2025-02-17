import { choice } from '../../../lib/outils/arrayOutils'
import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { calculANePlusJamaisUtiliser } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Résoudre un problème de vitesse'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can4P02
 */
export const uuid = '7374f'
export const ref = 'can4P02'
export const refs = {
  'fr-fr': ['can4P02'],
  'fr-ch': []
}
export default function ProblemesDeVitesse () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.formatChampTexte = ''
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    const a = choice([2, 3, 5, 6, 10]) // diviseur de l'heure
    const b = calculANePlusJamaisUtiliser(60 / a) // nombre de minutes de l'énoncé
    const c = choice([30, 60, 90, 120])
    this.reponse = calculANePlusJamaisUtiliser(c / a)
    this.question = `Une voiture roule à $${c}$ km/h. <br>
    
    Combien de kilomètres parcourt-elle en $${b}$ minutes ?`
    this.correction = `La voiture parcourt $${calculANePlusJamaisUtiliser(c / a)}$ km.`
    this.correction += texteEnCouleur(`<br> Mentalement : <br>
    On cherche combien de "$${b}$ minutes" il y a dans $1$ heure soit $60$ minutes. Il y en a $${a}$,
    car $${a}\\times ${b}=60$.<br>
    Cela signifie qu'en $${b}$ minutes, elle parcourt $${a}$ fois moins de km qu'en $1$ heure, soit $\\dfrac{${c}}{${a}}=
    ${calculANePlusJamaisUtiliser(c / a)}$ km.`)
    this.canEnonce = this.question// 'Compléter'
    this.canReponseACompleter = ''
  }
}
