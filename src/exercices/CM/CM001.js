import TablesDeMultiplications from '../6e/_Tables_de_multiplications.js'

export const titre = 'Tables de multiplication'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDeModifImportante = '27/08/2024'

/**
 * Tables de multiplication classiques, à trou ou un mélange des deux.
 *
 * Par défaut ce sont les tables de 2 à 9 mais on peut choisir les tables que l'on veut
 * @author Rémi Angot
 */
export const uuid = '665a0'
export const ref = 'CM001'
export const refs = {
  'fr-fr': ['CM001'],
  'fr-ch': []
}
export default class TablesParametres extends TablesDeMultiplications {
  constructor (tablesParDefaut = '2-3-4-5-6-7-8-9') {
    super(tablesParDefaut)
    this.tailleDiaporama = 3
  }
}
