import ExercicePourcentage from '../2e/2S10-2.js'
export const titre = 'Appliquer un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true // Pour en bénéficier avec le générateur AMC
export const amcType = 'AMCNum' // Les réponses sont des valeurs numériques à encoder

export const dateDePublication = '04/04/2022'

export const ref = '5P14-1'
export const uuid = '542be'
export default class ExercicePourcentage5e extends ExercicePourcentage {
  constructor () {
    super()
    this.titre = titre
    this.sup = 1
    this.besoinFormulaireNumerique = false
  }
}
