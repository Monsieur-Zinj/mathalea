import CourseAuxNombresSpeciale2024 from './CANSpeciale2024'

export const titre = 'CAN Spéciale année 2024 - 6ème'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '49fcb'
export const refOK = 'can6a-NY2024'
export const dateDePublication = '01/01/2024'

/**
 * CAN Spéciale année 2024 pour les 6èmes
 *
 * @author Eric Elter - Gilles Mora
 */

export default function CourseAuxNombresSpeciale20246e () {
  CourseAuxNombresSpeciale2024.call(this)
  this.sup = 6
  this.besoinFormulaireTexte = false
}
