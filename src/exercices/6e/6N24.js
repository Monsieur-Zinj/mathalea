import ExerciceConversions from './_Exercice_conversions.js'
export const titre = 'Utiliser les préfixes multiplicateurs et diviseurs (milli à kilo)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * @author Rémi Angot
 * référence 6N24
 * Relecture : Novembre 2021 par EE
 */
export const uuid = 'ae35d'
export const ref = '6N24'
export default function Exercice6N24 () {
  ExerciceConversions.call(this)
  this.sup = 3
  this.correction_avec_des_fractions = true
  this.spacingCorr = 2
}
