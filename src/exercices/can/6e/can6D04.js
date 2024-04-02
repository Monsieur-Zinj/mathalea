import ConversionHeuresMinutesOuMinutesEtSecondes from '../../6e/6D13.js'
export const titre = 'Convertir minutes<->heures ou secondes<->minutes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/*!
 * Alias de 6D13.js
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 * Référence can6D04
 */
export const uuid = 'd34e5'
export const ref = 'can6D04'
export const refs = {
  'fr-fr': ['can6D04'],
  'fr-ch': []
}
export default function ConvertirMinutesHeures () {
  ConversionHeuresMinutesOuMinutesEtSecondes.call(this, true)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.correctionDetaillee = true
}
