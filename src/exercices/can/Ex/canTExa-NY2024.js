import CourseAuxNombresSpeciale2024 from '../6e/CANSpeciale2024'

export const titre = 'CAN Spéciale année 2024 - Terminale'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '60653'
export const ref = 'canExa-NY2024'
export const refs = {
  'fr-fr': ['canTExa-NY2024'],
  'fr-ch': []
}
export const dateDePublication = '01/01/2024'

/**
 * CAN Spéciale année 2024 pour les Terminales
 *
 * @author Eric Elter - Gilles Mora
 */

export default class CourseAuxNombresSpeciale2024Terminale extends CourseAuxNombresSpeciale2024 {
  constructor () {
    super()
    this.besoinFormulaireTexte = false
    this.niveau = 0
  }
}
