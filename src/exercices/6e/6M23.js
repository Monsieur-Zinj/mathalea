import ExerciceConversionsAires from './_Exercice_conversions_aires.js'
export const titre = 'Convertir des aires'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = ['qcm', 'mathLive']
export const dateDeModifImportante = '30/04/2023'
/**
 * @author Rémi Angot
 * référence 6M23
 *
*/
export const uuid = '6225c'
export const ref = '6M23'
export const refs = {
  'fr-fr': ['6M23'],
  'fr-ch': ['9GM2-2']
}
export default function Reglages6M23 () {
  ExerciceConversionsAires.call(this)
  this.titre = titre
  this.interactif = false
  this.sup = 3
  this.nbColsCorr = 1
  this.nbQuestions = 10
}
