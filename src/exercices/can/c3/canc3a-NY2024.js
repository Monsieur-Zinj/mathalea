import CourseAuxNombresSpeciale2024 from '../6e/CANSpeciale2024'

export const titre = 'CAN Spéciale année 2024 - CM'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '5c15e'
export const ref = 'canc3a-NY2024'
export const dateDePublication = '01/01/2024'

/**
 * CAN Spéciale année 2024 pour les CM2
 *
 * @author Eric Elter - Gilles Mora
 */

export default function CourseAuxNombresSpeciale2024CM () {
  CourseAuxNombresSpeciale2024.call(this)
  this.sup = 7
  this.besoinFormulaireTexte = false
}
