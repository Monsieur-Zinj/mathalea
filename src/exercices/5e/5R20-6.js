import FabriqueAYohaku from '../6e/_Yohaku.js'
export const titre = 'Résoudre un Yohaku additif nombres relatifs niveau 1'
export const dateDePublication = '10/08/2022'
export const dateDeModificationImportante = '16/12/2023'

export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'

export const uuid = '598c3'
export const ref = '5R20-6'
export const refs = {
  'fr-fr': ['5R20-6'],
  'fr-ch': ['9NO9-11']
}
/**
 * @author Jean-Claude Lhote
 * @constructor
 */
export default function FabriqueAYohaku5R1 () {
  FabriqueAYohaku.call(this)
  this.sup = 10
  this.sup2 = 1
  this.sup3 = 2
  this.sup4 = false
  this.type = 'entiers relatifs'
  this.besoinFormulaireNumerique = false
  this.besoinFormulaire2Numerique = false
  this.besoinFormulaire3Numerique = false
  this.besoinFormulaire4CaseACocher = ['Avec aide (la présence d\'une valeur impose une solution unique)', false]
}
