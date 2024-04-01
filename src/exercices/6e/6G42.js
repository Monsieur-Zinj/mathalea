import Solide6e from './_Solide_6e.js'
export const titre = 'Connaître les propriétés du cube et du pavé droit'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMult'

export const dateDeModifImportante = '07/06/2023'

/**
 * @author Jean-Claude Lhote
 * vocabulaire arête, face, perpendicularité dans l'espace, parallélisme dans l'espace
 * référence : 6G42
 */
export const uuid = 'b36df'
export const refs = {
  'fr-fr': ['6G42'],
  'fr-ch': ['9ES7-4']
}
export default function UtiliserVocabulairePave () {
  Solide6e.call(this)
  this.titre = titre
}
