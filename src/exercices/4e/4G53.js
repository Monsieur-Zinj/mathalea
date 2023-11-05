import CalculDeVolumes from '../6e/6M30.js'
export const titre = 'Calculs de volumes'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = ['qcm', 'mathLive']
export const dateDeModifImportante = '05/11/2023'

/**
 * @author Jean-claude Lhote
 */
export const uuid = 'b6cbe'
export const ref = '4G53'
export default function CalculDeVolumes4e () {
  CalculDeVolumes.call(this)
  this.titre = titre
  // this.titre = 'dfdflkmdl dlk dlk fldk fldkfldkfldkffl kdflk'
  this.sup = 1
  this.classe = 4
  this.sup4 = 7
  this.besoinFormulaire4Texte = ['Type de solides', 'Nombres séparés par des tirets\n1  : Cubes\n2 : Pavés droits\n3 : Cylindres\n4 : Prismes droits\n5 : Cônes\n6 : Pyramides\n7 : Mélange']
  this.besoinFormulaireNumerique = ['Niveau de difficulté', 3, '1 : Sans conversion\n2 : Avec des conversions\n3 : Sans conversion avec ​π≃3'
  ]
}
