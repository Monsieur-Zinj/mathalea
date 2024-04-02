import Thales2D from './_Thales2D.js'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Calculer des longueurs avec le théorème de Thalès'

/**
 * Calcul de longueurs avec le théorème de Thalès
 * @author Rémi Angot
 * Référence 4G30
*/

export const uuid = '18a21'
export const ref = '4G30'
export const refs = {
  'fr-fr': ['4G30'],
  'fr-ch': ['11GM3-1']
}
export default function Thales2D4e () {
  Thales2D.call(this)
  this.level = 4
  this.besoinFormulaireNumerique = false
  this.video = 'nFgFG3YQ1O4'
}
