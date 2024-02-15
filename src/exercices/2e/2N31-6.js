import CalculsAvecPuissancesDeDix from '../4e/4C32-1.js'
export const titre = 'Donner le résultat de nombres écrits avec des puissances de 10 en notation scientifique'
export const amcReady = true
export const amcType = 'qcmMono'
export const interactifType = 'qcm'
export const interactifReady = true
export const dateDePublication = '08/09/2023'
/**
 * Clone de 4C32-1 pour les 2nde
 * @author Eric Elter
 */

export const uuid = '816c8'
export const ref = '2N31-6'
export const refs = {
  'fr-fr': ['2N31-6'],
  'fr-ch': []
}
export default function CalculsAvecPuissancesDeDixEn2nde () {
  CalculsAvecPuissancesDeDix.call(this)
  this.sup = 2
  this.classe = 2
}
