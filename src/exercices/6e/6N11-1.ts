import ReperageEntiersOuDecimaux from './6N30-0'
export const titre = 'Repérer des entiers sur une droite graduée'
export const uuid = '86529'
export const refs = {
  'fr-fr': ['6N11-1'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '26/08/2024'
/**
 * Exercice de repérage sur droite graduée
 * L'exercice est décliné à partir de 6N30-0 (ReperageEntiersOuDecimaux)
 * C'est dans 6N30-0 qu'on paramètre toutes les variables didactiques de cet exo (notamment les niveaux de difficulté)
 * @author Jean-Claude Lhote
 */

class ReperageEntier extends ReperageEntiersOuDecimaux {
  constructor () {
    super()
    this.version = 'entiers'
    this.nbQuestions = 4
    this.sup = 5
    this.sup2 = false
    this.besoinFormulaireTexte = [
      'Niveaux de difficultés (nombres séparés par des tirets)',
      '1 : Simpliste\n2 : Facile\n3 : Un peu plus difficile\n4 : Complexe\n5 : Mélange']
    this.besoinFormulaire2CaseACocher = ['Zéro visible', false]
    this.correctionDetailleeDisponible = true
    this.correctionDetaillee = false
  }
}
export default ReperageEntier
