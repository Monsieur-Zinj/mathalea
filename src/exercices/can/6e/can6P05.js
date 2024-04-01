import AppliquerUnPourcentage from './can6P04.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const titre = 'Appliquer un pourcentage (bis)'
export const dateDePublication = '13/11/2021'
/**
 * @author Jean-Claude Lhote
 * Complété par des corrections de Gilles Mora
 */
export const uuid = 'a2bbc'
export const refs = {
  'fr-fr': ['can6P05'],
  'fr-ch': []
}
export default function AppliquerUnPourcentageBis () {
  AppliquerUnPourcentage.call(this)
  this.bis = true
  this.tailleDiaporama = 2
}
