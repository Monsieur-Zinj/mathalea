import FabriqueAYohaku from '../6e/_Yohaku.js'
export const titre = 'Résoudre un Yohaku additif expressions littérales niveau 1'
export const dateDePublication = '10/08/2022'
export const dateDeModificationImportante = '16/12/2023'

export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'

export const uuid = '4c5da'
export const ref = '4L10-3'
export const refs = {
  'fr-fr': ['4L10-3'],
  'fr-ch': []
}
/**
 * @author Jean-Claude Lhote
 * @constructor
 */
export default function FabriqueAYohaku4L1 () {
  FabriqueAYohaku.call(this, {})
  this.sup = 10
  this.sup2 = 1
  this.sup3 = 2
  this.sup4 = false
  this.type = 'littéraux'
  this.yohaku = []
  this.besoinFormulaireNumerique = false
  this.besoinFormulaire2Numerique = false
  this.besoinFormulaire3Numerique = false
  this.besoinFormulaire4CaseACocher = ['Avec aide (la présence d\'une valeur impose une solution unique)', false]
}
