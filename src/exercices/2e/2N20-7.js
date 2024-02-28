import ppcmEngrenages from '../3e/3A12.js'
export const titre = 'Utiliser des multiples appliqués aux engrenages'
export const interactifReady = false
export const dateDeModifImportante = '14/11/2021'

/**
 * Clone de 3A10-4 pour les 2nde
 *
 * @author Jean-Claude Lhote
 */

export const uuid = 'c3c84'
export const ref = '2N20-7'
export const refs = {
  'fr-fr': ['2N20-7'],
  'fr-ch': []
}
export default function PpcmEngrenages2nde () {
  ppcmEngrenages.call(this)
  this.sup = true
  this.besoinFormulaireCaseACocher = false
}
