import ConstruireParSymetrie from '../6e/_Construire_par_symetrie.js'
export const titre = 'Construire le symétrique d\'une figure par rapport à une droite (cas simples)'
export const dateDeModifImportante = '14/11/2021'
export const interactifReady = false
export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * Référence 6G24-2
 * @author Jean-Claude Lhote   (Ajout AMC par Eric Elter)
 */
export const uuid = 'adfb5'
export const ref = '6G24-2'
export const refs = {
  'fr-fr': ['6G24-2'],
  'fr-ch': ['9ES6-13']
}
export default class SymetrieAxialeFigure6e extends ConstruireParSymetrie {
  constructor () {
    super()
    this.figure = true
    this.sup = 1
    this.besoinFormulaireNumerique = ['Type de questions', 4, '1 : Axe horizontal ou vertical\n2 : Axe oblique à 45°\n3 : Axe avec une légère pente\n4 : Toutes les symétries axiales']
  }
}
