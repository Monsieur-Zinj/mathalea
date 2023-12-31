import CourseAuxNombresSpeciale2024 from '../6e/CANSpeciale2024'

export const titre = 'CAN Spéciale année 2024 - 1ère'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ac288'
export const ref = 'can1a-NY2024'
export const dateDePublication = '01/01/2024'

/**
 * CAN Spéciale année 2024 pour les 1ères
 *
 * @author Eric Elter - Gilles Mora
 */

export default function CourseAuxNombresSpeciale20241ere () {
  CourseAuxNombresSpeciale2024.call(this)
  this.sup = 1
  this.besoinFormulaireTexte = false
}
