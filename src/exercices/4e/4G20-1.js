import Pythagore2D from './4G20.js'
export const titre = 'Donner ou compléter une égalité de Pythagore'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '28/12/2022'

export const uuid = '40c47'
export const ref = '4G20-1'
export const refs = {
  'fr-fr': ['4G20-1'],
  'fr-ch': ['10GM4-2', '11GM1-2']
}
export default class EgalitePythagore2D extends Pythagore2D {
  constructor () {
    super()
    this.sup = 1
    this.typeDeQuestion = 'Donner égalité'
    this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, "1 : Donner l'égalité de Pythagore\n2 : Compléter l'égalité de Pythagore"]
  }
}
