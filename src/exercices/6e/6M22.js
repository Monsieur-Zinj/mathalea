import ExercicePerimetresEtAires from './_Exercice_perimetres_et_aires.js'

export const titre = 'Calculer le périmètre et l\'aire de disques ou demi-disques'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

export const dateDeModifImportante = '11/04/2023'

/** */
export const uuid = 'ac571'
export const refs = {
  'fr-fr': ['6M22'],
  'fr-ch': ['10GM1-1']
}
export default function Reglages6M22 () {
  ExercicePerimetresEtAires.call(this)
  this.titre = titre
  this.sup = '4-5'
  this.exo = 'OnlyDisk'
  this.besoinFormulaireTexte = [
    'Types de figures',
    'Nombres séparés par des tirets\n4 : Disque\n5 : Demi-disque'
  ]
}
