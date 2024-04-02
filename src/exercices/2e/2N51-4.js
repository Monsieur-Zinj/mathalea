import ExerciceEquation1 from '../4e/4L20.js'
export const titre = 'Résoudre une équation du premier degré'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '02/04/2024'

/**
 * Clone de 4L20 pour les 2nde
 *
 * @author Sébastien LOZANO
 */
export const uuid = 'd02da'
export const ref = '2N51-4'
export const refs = {
  'fr-fr': ['2N51-4'],
  'fr-ch': []
}
export default function ExerciceEquation12nde () {
  ExerciceEquation1.call(this)
  this.sup = true
  this.sup2 = '5-6-7'
  this.sup3 = false
  this.tailleDiaporama = 3
}
