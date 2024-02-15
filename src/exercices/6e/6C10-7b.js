import FabriqueAYohaku from './_Yohaku.js'
export const titre = 'Résoudre un Yohaku multiplicatif niveau 1'
export const dateDePublication = '10/08/2022'
export const dateDeModificationImportante = '16/12/2023'

export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'
export const uuid = '08680'
export const ref = '6C10-7b'
export const refs = {
  'fr-fr': ['6C10-7b'],
  'fr-ch': []
}
/**
 * @author Jean-Claude Lhote
 * @constructor
 */
export default function FabriqueAYohaku6B () {
  FabriqueAYohaku.call(this)
  this.sup = 10
  this.sup2 = 2
  this.sup3 = 2
  this.sup4 = false
  this.type = 'entiers'
  this.besoinFormulaireNumerique = false
  this.besoinFormulaire2Numerique = false
  this.besoinFormulaire3Numerique = false
  this.besoinFormulaire4CaseACocher = ['Avec aide (la présence d\'une valeur impose une solution unique)', false]
}
