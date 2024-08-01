import { choice } from '../../lib/outils/arrayOutils'
import Transformations from '../6e/_Transformations.js'

export const titre = 'Trouver l\'image d\'un point par une symétrie axiale'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

export const uuid = 'da157'
export const ref = '5G10'
export const refs = {
  'fr-fr': ['5G10'],
  'fr-ch': ['9ES6-2']
}
export default function SymetrieAxiale5e () {
  Transformations.call(this)
  this.sup = choice(['1-2-3', '1-2-4', '2-3-4', '1-3-4'])
  this.titre = titre
}
