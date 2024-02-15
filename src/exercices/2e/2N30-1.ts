import Exercice from '../6e/6N20-2'
export const titre = 'Décomposer une fraction (partie entière + fraction inférieure à 1) puis donner l\'écriture décimale'
export const interactifReady = true
export const interactifType = 'custom'
/**
 * Clone de 6N20-2 pour les 2nde
 *
 * @author Sébastien LOZANO
 */
export const uuid = '45726'
export const ref = '2N30-1'
export const refs = {
  'fr-fr': ['2N30-1'],
  'fr-ch': []
}

export default class ExerciceFractionsDifferentesEcritures extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 2
  }
}
