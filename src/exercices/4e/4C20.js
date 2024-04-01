import ExerciceComparerDeuxFractions from '../5e/5N14.js'
export const titre = 'Comparer deux fractions (dénominateurs multiples)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'qcmMono'

/**
 * @author Guillaume Valmont
 * reference 4C20
 * Publié le 14/08/2021
 */
export const uuid = 'd7e11'
export const refs = {
  'fr-fr': ['4C20'],
  'fr-ch': []
}
export default function ExerciceComparerDeuxFractions4e () {
  ExerciceComparerDeuxFractions.call(this)
  this.titre = titre
  this.sup = 11
  this.sup2 = true
}
