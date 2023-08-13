import ExercicePourcentage from '../2e/2S10-2.js'
export const titre = 'Exprimer une proportion sous la forme d\'un pourcentage'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true // Pour en bénéficier avec le générateur AMC
export const amcType = 'AMCNum' // Les réponses sont des valeurs numériques à encoder

export const dateDePublication = '04/04/2022'

export const ref = '5P14'
export const uuid = '4db23'
export default class ExercicePourcentage5e extends ExercicePourcentage {
  constructor () {
    super()
    this.titre = titre
    this.sup = 2
    this.besoinFormulaireNumerique = false
  }
}
