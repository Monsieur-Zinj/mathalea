import PuissancesDeDix from '../4e/4C30.js'
export const titre = 'Utiliser les règles de calculs avec des puissances de 10'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'qcmMono'
export const dateDePublication = '05/09/2023'
/**
 * Clone de 4C30 pour les 2nde
 * @author Eric Elter
 */

export const uuid = '6b2e5'
export const ref = '2N31-5'
export const refs = {
  'fr-fr': ['2N31-5'],
  'fr-ch': []
}
export default function PuissancesDeDix2 () {
  PuissancesDeDix.call(this)
  this.sup = 3
  this.correctionDetaillee = false
  this.besoinFormulaireNumerique = [
    'Règle à travailler',
    3,
    '1 : Calculs de base\n2 : Calculs plus complexes\n3 : Mélange'
  ]
  this.besoinFormulaire2Texte = false
}
