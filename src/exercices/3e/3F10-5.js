import CalculsImagesFonctions from './3F10-2'
export const titre = 'Calculer des images (et antécédents) dans des fonctions linéaires ou affines'

export const dateDePublication = '19/06/2024'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * Calculer images (et antécédents) de fonctions linéaires ou affines
 * @author Eric Elter
 */
export const uuid = 'c9382'
export const ref = '3F10-5'
export const refs = {
  'fr-fr': ['3F10-5'],
  'fr-ch': []
}
export default function CalculsImagesFonctionsLineairesOuAffines () {
  CalculsImagesFonctions.call(this)
  this.besoinFormulaireTexte = [
    'Choix des questions', 'Nombres séparés par des tirets\n1 : Fonction linéaire\n2 : Fonction affine \n3 :  Mélange'
  ]
  this.besoinFormulaire2Numerique = ['Image ou antécédent', 3, "1 : Calcul d'image\n2 : Calcul d'antécédent\n3 : Mélange"]
  this.fonctions = 'affinesOuLineaires'
  this.sup = 3
  this.sup2 = 1
  this.sup3 = 1
}
