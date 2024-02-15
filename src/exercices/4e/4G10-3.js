import ImagePtParTranslation from '../2e/2G23-1'

export const titre = 'Déterminer graphiquement des images par des translations'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '15/10/2023'

/**
 * Clone de 2G23-1 pour les 4e
 * @author Eric Elter
 */

export const uuid = '6ddc5'
export const ref = '4G10-3'
export const refs = {
  'fr-fr': ['4G10-3'],
  'fr-ch': []
}
export default function ImagePtParTranslation4e () {
  ImagePtParTranslation.call(this)
  this.classe = 4
  this.sup = 4
  this.nbQuestions = 3
}
