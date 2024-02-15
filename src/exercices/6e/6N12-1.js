import MultiplierUnNombreParPuissanceDeDix from './6C30-6.js'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifReady = true
export const interactifType = 'qcm'
export const titre = 'Par combien multiplier un entier pour que le chiffre des unités devienne le chiffre des ... ?'

// Gestion de la date de publication initiale
export const dateDePublication = '05/11/2021'

/**
 * Presentation didactique : Par combien multiplier un entier pour que le chiffre des unités devienne le chiffre des ...
 * @author Eric Elter (inspiré par Aude Duvold)
 * Référence 6N12-1
 */

export const uuid = '89c0c'
export const ref = '6N12-1'
export const refs = {
  'fr-fr': ['6N12-1'],
  'fr-ch': []
}
export default function Exercice6N121 () {
  MultiplierUnNombreParPuissanceDeDix.call(this)
  this.sup = true
  this.sup3 = 1
}
