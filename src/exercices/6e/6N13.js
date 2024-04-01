import ExerciceConversions from './_Exercice_conversions.js'

export const titre = 'Convertir des longueurs, masses, capacités, prix ou unités informatiques'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * @author Rémi Angot
 * référence 6N13
 * Relecture : Novembre 2021 par EE
 */
export const uuid = '3eae0'
export const refs = {
  'fr-fr': ['6N13'],
  'fr-ch': ['10GM3-7']
}
export default function Exercice6N13 () {
  ExerciceConversions.call(this)
  this.sup = 1
  this.nbQuestions = 5
}
