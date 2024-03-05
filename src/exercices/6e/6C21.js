import DivisionsEuclidiennes from './6C11.js'
export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Effectuer divisions euclidiennes - Niveau 2'

/**
 * @author Rémi Angot
 * référence 6C21
*/

export const uuid = 'bbcac'
export const ref = '6C21'
export const refs = {
  'fr-fr': ['6C21'],
  'fr-ch': ['9NO3-4']
}
export default function DivisionsEuclidiennesNiv2 () {
  DivisionsEuclidiennes.call(this)
  this.sup = 3
  this.titre = titre
  this.tailleDiaporama = 3
}
