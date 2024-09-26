import ExercicePerimetresEtAires from './_Exercice_perimetres_et_aires.js'
export const titre = 'Calculer le périmètre et l\'aire de polygones usuels'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

export const dateDeModifImportante = '11/04/2023'

/**
 * @author Rémi Angot
 */
export const uuid = '83be1'
export const ref = '6M10'
export const refs = {
  'fr-fr': ['6M10'],
  'fr-ch': ['9GM1-6']
}
export default function Reglages6M10 () {
  ExercicePerimetresEtAires.call(this)
  this.sup = '1-2-3'
  this.titre = titre
  this.exo = 'NoDisk'
  this.besoinFormulaire4CaseACocher = false
  this.besoinFormulaireTexte = [
    'Type de figures',
    'Nombres séparés par des tirets\n1 : Carré\n2 : Rectangle\n3 : Triangle rectangle'
  ]
}
