import ConstruireParSymetrie from '../6e/_Construire_par_symetrie.js'
export const titre = 'Construire le symétrique d\'un point par rapport à une droite'
export const dateDeModifImportante = '14/11/2021'
export const amcReady = true
export const amcType = 'AMCOpen'
/**
 * Référence 6G24-1
 * @author Jean-Claude Lhote
 * Relecture : Novembre 2021 par EE
 */
export const uuid = '91a00'
export const ref = '6G24-1'
export const refs = {
  'fr-fr': ['6G24-1'],
  'fr-ch': []
}
export default class SymetrieAxialePoint6e extends ConstruireParSymetrie {
  constructor () {
    super()
    this.figure = false
    this.sup = 1
    this.besoinFormulaireNumerique = ['Type de questions', 4, '1 : Axe horizontal ou vertical\n2 : Axe oblique à 45°\n3 : Axe avec une légère pente\n4 : Toutes les symétries axiales']
  }
}
