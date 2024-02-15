import ExercicePourcentage from '../2e/2S10-2.js'
export const titre = 'Appliquer un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

export const dateDePublication = '04/04/2022'

export const ref = '5P14-1'
export const refs = {
  'fr-fr': ['5P14-1'],
  'fr-ch': []
}
export const uuid = '542be'
export default class ExercicePourcentage5e extends ExercicePourcentage {
  constructor () {
    super()
    this.titre = titre
    this.sup = 1
    this.besoinFormulaireNumerique = false
  }
}
