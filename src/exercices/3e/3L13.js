import ExerciceEquation1 from '../4e/4L20.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Résoudre une équation du premier degré'
export const dateDeModifImportante = '02/04/2024'

/**
 * Équation du premier degré
 * @author Rémi Angot
 */
export const uuid = 'f239f'
export const ref = '3L13'
export const refs = {
  'fr-fr': ['3L13'],
  'fr-ch': ['11FA6-4']
}
export default function ExerciceEquation3e () {
  ExerciceEquation1.call(this)
  this.sup = true
  this.sup2 = 8
  this.sup3 = false
  this.tailleDiaporama = 3
}
