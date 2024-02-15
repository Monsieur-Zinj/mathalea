import FabriqueAYohaku from '../6e/_Yohaku.js'
export const titre = 'Résoudre un Yohaku additif fractions niveau 1'
export const dateDePublication = '10/08/2022'
export const dateDeModificationImportante = '16/12/2023'

export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'

export const uuid = '1a61d'
export const ref = '4C21-2'
export const refs = {
  'fr-fr': ['4C21-2'],
  'fr-ch': []
}
/**
 * @author Jean-Claude Lhote
 * @constructor
 */
export default function FabriqueAYohaku4CF2 () {
  FabriqueAYohaku.call(this)
  this.sup = 10
  this.sup2 = 1
  this.sup3 = 2
  this.sup4 = false
  this.type = 'fractions dénominateurs multiples'
  this.besoinFormulaireNumerique = false
  this.besoinFormulaire2Numerique = false
  this.besoinFormulaire3Numerique = false
  this.besoinFormulaire4CaseACocher = ['Avec aide (la présence d\'une valeur impose une solution unique)', false]
}
