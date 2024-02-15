import PremierOuPas from './3A10-1.js'
export const titre = 'Reconnaître les premiers nombres premiers'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMono'

export const dateDePublication = '11/10/2023'

/**
 * À partir de divisions euclidiennes, indiquer l'égalité fondamentale correspondante.
 * Ref 3A13-4
 *
 * @author Eric Elter
 */

export const uuid = '3e436'
export const ref = '3A10-0'
export const refs = {
  'fr-fr': ['3A10-0'],
  'fr-ch': []
}
export default function PremierOuPasDebut () {
  PremierOuPas.call(this)
  this.besoinFormulaireNumerique = false
  this.besoinFormulaire2CaseACocher = false
  this.besoinFormulaire3CaseACocher = false
  this.sup3 = true
  this.level = 1
}
