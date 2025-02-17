import DernierChiffre from '../6e/6C34.js'
export const titre = 'Dernier chiffre d\'un calcul'
export const amcReady = true
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'
/**
 *Clone de 6C34 pour les CM1-CM2
 *
 * @author Jean-Claude Lhote
 */
export const uuid = 'e2a48'
export const ref = 'c3C12'
export const refs = {
  'fr-fr': ['c3C12'],
  'fr-ch': []
}
export default function DerbierChiffreC3 () {
  DernierChiffre.call(this)
  this.nbQuestions = 4
  this.version = 2
  this.besoinFormulaireNumerique = false
}
