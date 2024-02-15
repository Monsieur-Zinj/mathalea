import PerimetreOuAireDeFiguresComposees from './6M11-2.js'
export const titre = 'Décomposer une figure complexe en figures simples'

export const dateDePublication = '28/10/2023'

/**
 * @author Guillaume Valmont
 */
export const uuid = 'fbaff'
export const ref = '6M11-0'
export const refs = {
  'fr-fr': ['6M11-0'],
  'fr-ch': []
}
export default class DecomposerFigureComplexe extends PerimetreOuAireDeFiguresComposees {
  constructor () {
    super()
    this.titre = titre
    this.sup4 = 4
    this.besoinFormulaire3Numerique = false
    this.besoinFormulaire4Numerique = false
  }
}
