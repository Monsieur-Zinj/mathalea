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
export const refs = {
  'fr-fr': ['6N34'],
  'fr-ch': ['10GM3-9']
}
export default function Reglages6N34 () {
  ExerciceConversions.call(this)
  this.sup = 5
}
