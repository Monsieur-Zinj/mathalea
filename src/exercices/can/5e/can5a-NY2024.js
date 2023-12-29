import CourseAuxNombresSpeciale2024 from '../6e/CANSpeciale2024'

export const titre = 'CAN Spéciale année 2024 - 5ème'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '53c5a'
export const refOK = 'can5a-NY2024'
export const dateDePublication = '01/01/2024'

/**
 * CAN Spéciale année 2024 pour les 5èmes
 *
 * @author Eric Elter - Gilles Mora
 */

export default function CourseAuxNombresSpeciale20245e () {
  CourseAuxNombresSpeciale2024.call(this)
  this.sup = 5
  this.besoinFormulaireTexte = false
}
