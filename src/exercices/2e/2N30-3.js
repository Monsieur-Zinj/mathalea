import ExerciceMultiplierFractions from '../4e/4C22.js'

export const titre = 'Multiplier ou/et diviser des fractions'

export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Clone de 4C22 pour les 2nde
 *
 * @author Sébastien LOZANO
 */
export const uuid = '29919'
export const ref = '2N30-3'
export const refs = {
  'fr-fr': ['2N30-3'],
  'fr-ch': []
}
export default function ExerciceMultiplierFractions2nde () {
  ExerciceMultiplierFractions.call(this)
}
