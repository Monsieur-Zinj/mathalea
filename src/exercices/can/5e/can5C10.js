import ExerciceDecomposerEnFacteursPremiers from '../../5e/5A13.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Décomposer en produit de facteurs premiers'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can5C10
 */
export const uuid = '1b91d'
export const ref = 'can5C10'
export const refs = {
  'fr-fr': ['can5C10'],
  'fr-ch': []
}
export default function DecomposerFacteursPremierSimple () {
  ExerciceDecomposerEnFacteursPremiers.call(this)
  this.nbQuestions = 1
  this.sup2 = false
  this.sup = 1
  this.tailleDiaporama = 2
  this.formatChampTexte = ''
  this.consigne = `Décomposer en produit de facteurs premiers :<br>
  (facteurs dans l’ordre croissant)`
}
