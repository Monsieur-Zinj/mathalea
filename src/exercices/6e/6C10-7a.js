import FabriqueAYohaku from './_Yohaku.js'
export const titre = 'Résoudre un Yohaku additif niveau 1'
export const dateDePublication = '10/08/2022'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDeModificationImportante = '16/12/2023'

export const uuid = '26bb9'
export const ref = '6C10-7a'
export const refs = {
  'fr-fr': ['6C10-7a'],
  'fr-ch': []
}
/**
 * @author Jean-Claude Lhote
 * @constructor
 */
export default function FabriqueAYohaku6A () {
  FabriqueAYohaku.call(this)
  this.sup = 10
  this.sup2 = 1
  this.sup3 = 2
  this.sup4 = false
  this.type = 'entiers'
  this.besoinFormulaireNumerique = false
  this.besoinFormulaire2Numerique = false
  this.besoinFormulaire3Numerique = false
  this.besoinFormulaire4CaseACocher = ['Avec aide (la présence d\'une valeur impose une solution unique)', false]
}
