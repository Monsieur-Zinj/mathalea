import exerciceComparerDeuxFractions from '../../5e/5N14.js'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMono'
export const titre = 'Comparer deux fractions (dénominateurs multiples)'
export const dateDePublication = '04/11/2022'

/*!
 * @author Remi Angot repris par Gilles Mora pour une question can
 * Créé le 04/01/2022
 * Référence can6C43
 */
export const uuid = 'f3b31'
export const ref = 'can6C43'
export const refs = {
  'fr-fr': ['can6C43'],
  'fr-ch': []
}
export default function ExerciceComparerDeuxFractionsCAN () {
  exerciceComparerDeuxFractions.call(this)
  this.nbQuestions = 1
  this.can = true
}
