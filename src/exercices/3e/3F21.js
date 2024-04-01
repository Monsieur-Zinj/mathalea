import LectureExpressionFonctionsAffines from './3F21-1.js'
export const titre = 'Déterminer une fonction linéaire'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Trace 5 droites et demande l'expression de la fonction affine ou linéaire correspondante
 * @author Jean-Claude Lhote
 */
export const uuid = 'b4c0d'
export const refs = {
  'fr-fr': ['3F21'],
  'fr-ch': ['11FA8-9']
}
export default function LectureExpressionFonctionsLineaires () {
  LectureExpressionFonctionsAffines.call(this)
  this.lineaire = true
}
