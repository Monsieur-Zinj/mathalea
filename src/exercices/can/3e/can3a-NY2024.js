import CourseAuxNombresSpeciale2024 from '../6e/CANSpeciale2024'

export const titre = 'CAN Spéciale année 2024 - 3ème'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '64c10'
export const ref = 'can3a-NY2024'
export const refs = {
  'fr-fr': ['can3a-NY2024'],
  'fr-ch': []
}
export const dateDePublication = '01/01/2024'

/**
 * CAN Spéciale année 2024 pour les 3èmes
 *
 * @author Eric Elter - Gilles Mora
 */

export default function CourseAuxNombresSpeciale20243e () {
  CourseAuxNombresSpeciale2024.call(this)
  this.sup = 3
  this.besoinFormulaireTexte = false
}
