import Thales2D from '../4e/_Thales2D.js'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Calculer des longueurs avec le théorème de Thalès'

/**
 * Calcul de longueurs avec le théorème de Thalès
 * @author Rémi Angot
 * Référence 3G20
*/
export const uuid = '74eac'
export const refs = {
  'fr-fr': ['3G20'],
  'fr-ch': ['11GM3-4']
}
export default function Thales2D3e () {
  this.level = 3
  Thales2D.call(this)
  this.sup = 2
  this.video = 'j_zZOpLLl9k'
  this.pointsParQuestions = 2
}
