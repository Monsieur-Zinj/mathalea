import FabriqueAYohaku from '../6e/_Yohaku.js'
export const titre = 'Résoudre un Yohaku multiplicatif fractions niveau 1'
export const dateDePublication = '10/08/2022'
export const dateDeModificationImportante = '16/12/2023'

export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'

export const uuid = 'ee808'
export const ref = '4C22-3'
export const refs = {
  'fr-fr': ['4C22-3'],
  'fr-ch': []
}
/**
 * @author Jean-Claude Lhote
 * @constructor
 */
export default function FabriqueAYohaku4CF2 () {
  FabriqueAYohaku.call(this)
  this.sup = 10
  this.sup2 = 2
  this.sup3 = 2
  this.sup4 = false
  this.type = 'fractions positives dénominateurs premiers'
  this.besoinFormulaireNumerique = false
  this.besoinFormulaire2Numerique = false
  this.besoinFormulaire3Numerique = false
  this.besoinFormulaire4CaseACocher = ['Avec aide (la présence d\'une valeur impose une solution unique)', false]
}
