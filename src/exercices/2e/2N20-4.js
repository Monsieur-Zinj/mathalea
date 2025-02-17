import PremierOuPas from '../3e/3A10-1.js'
export const titre = 'Justifier qu\'un nombre est premier ou pas'
export const dateDeModifImportante = '29/10/2021'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMono'
/**
 * Clone de 3A10 pour les 2nde
 *
 * @author Jean-Claude Lhote
 */

export const uuid = 'c04cc'
export const ref = '2N20-4'
export const refs = {
  'fr-fr': ['2N20-4'],
  'fr-ch': []
}
export default function PremierOuPas2nde () {
  PremierOuPas.call(this)
  this.sup = 1
  this.sup2 = false
}
