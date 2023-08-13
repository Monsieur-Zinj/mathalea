import ExerciceConversions from './_Exercice_conversions.js'
export const titre = 'Effectuer des conversions avec tous les préfixes de milli à tera'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * @author Rémi Angot
 * référence 6N34
 * Relecture : Novembre 2021 par EE
 */

export const uuid = 'c57cf'
export const ref = '6N34'
export default function Reglages6N34 () {
  ExerciceConversions.call(this)
  this.sup = 5
}
