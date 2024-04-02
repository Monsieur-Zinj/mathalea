import FonctionsProbabilite1 from '../5e/5S21.js'
export const titre = 'Utiliser le vocabulaire des probabilités'
export const interactifReady = false
export const dateDePublication = '03/04/2022'

/**
 * @author Guillaume Valmont
 */
export const uuid = '7ba64'
export const ref = '4S20'
export const refs = {
  'fr-fr': ['4S20'],
  'fr-ch': ['11NO2-10']
}
export default function FonctionsVocabulaireProbabilite4e () {
  FonctionsProbabilite1.call(this)
  this.niveau = 3
  this.spacingCorr = 2
}
