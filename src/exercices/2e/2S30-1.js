import CalculProbaExperience2Epreuves3e from '../3e/3S21.js'
export const titre = 'Simuler une expérience aléatoire à deux épreuves (indépendantes ou avec remise)'
export const dateDePublication = '26/06/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Simuler une expérience aléatoire à deux épreuves (avec ou sans remise)
 * @author Eric Elter
 */
export const uuid = '4e68a'
export const ref = '2S30-1'
export const refs = {
  'fr-fr': ['2S30-1'],
  'fr-ch': []
}
export default function CalculProbaExperience2Epreuves2nde () {
  CalculProbaExperience2Epreuves3e.call(this)
  // this.besoinFormulaireTexte = ['Type de questions : ', 'Nombres séparés par des tirets\n1 : Deux épreuves indépendantes\n2 : Deux épreuves avec remise\n3 : Deux épreuves sans remise\n4 : Mélange']
  this.besoinFormulaireTexte = ['Type de questions : ', 'Nombres séparés par des tirets\n1 : Deux épreuves indépendantes\n2 : Deux épreuves avec remise\n3 : Mélange']
  this.besoinFormulaire2CaseACocher = ['Avec un arbre', false]
  this.niveau = '2nde'
  this.sup2 = true
}
