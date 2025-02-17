import EqCartDroite from '../1e/1G13'
export const titre = 'Déterminer une équation cartésienne de droite à partir d\'un point et d\'un vecteur directeur'
export const dateDeModifImportante = '07/07/2024'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Description didactique de l'exercice
 * @author Stéphane Guyon  + Jean-Claude Lhote (interactif) + Gilles Mora
*/
export const uuid = '0ec77'
export const ref = '2G30-4'
export const refs = {
  'fr-fr': ['2G30-4'],
  'fr-ch': []
}
class EqCartpointVecteur extends EqCartDroite {
  constructor () {
    super()
    this.nbQuestions = 1
    this.spacingCorr = 2
    this.spacing = 1.5
    this.sup = 1
    this.version = 3
    this.besoinFormulaireNumerique = ['Type de correction :', 2, '1 : Correction avec le cours\n2 : Correction avec la démonstration']
  }
}
export default EqCartpointVecteur
