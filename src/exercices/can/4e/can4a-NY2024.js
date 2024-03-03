import CourseAuxNombresSpeciale2024 from '../6e/CANSpeciale2024'

export const titre = 'CAN Spéciale année 2024 - 4ème'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '96476'
export const ref = 'can4a-NY2024'
export const refs = {
  'fr-fr': ['can4a-NY2024'],
  'fr-ch': []
}
export const dateDePublication = '01/01/2024'

/**
 * CAN Spéciale année 2024 pour les 4èmes
 *
 * @author Eric Elter - Gilles Mora
 */

export default function CourseAuxNombresSpeciale20244e () {
  CourseAuxNombresSpeciale2024.call(this)
  this.sup = 4
  this.besoinFormulaireTexte = false
}
