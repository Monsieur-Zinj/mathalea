import CourseAuxNombresSpeciale2024 from '../6e/CANSpeciale2024'

export const titre = 'CAN Spéciale année 2024 - 2nde'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'dd9d0'
export const refOK = 'can2a-NY2024'
export const dateDePublication = '01/01/2024'

/**
 * CAN Spéciale année 2024 pour les 2ndes
 *
 * @author Eric Elter - Gilles Mora
 */

export default function CourseAuxNombresSpeciale20242nde () {
  CourseAuxNombresSpeciale2024.call(this)
  this.sup = 2
  this.besoinFormulaireTexte = false
}
