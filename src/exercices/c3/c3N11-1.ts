import ReperageEntiersOuDecimaux from '../6e/6N30-0'
export const titre = 'Repérer des entiers sur une droite graduée'
export const uuid = '14b84'
export const refs = {
  'fr-fr': ['c3N11-1'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '21/10/2024'
/**
 * Exercice de repérage sur droite graduée
 * L'exercice est décliné à partir de 6N30-0 (ReperageEntiersOuDecimaux)
 * C'est dans 6N30-0 qu'on paramètre toutes les variables didactiques de cet exo (notamment les niveaux de difficulté)
 * @author Jean-Claude Lhote
 */

class ReperageEntierC3 extends ReperageEntiersOuDecimaux {
  constructor () {
    super()
    this.version = 'cm'
    this.nbQuestions = 4
    this.sup = 5
    this.sup2 = false
    this.besoinFormulaireTexte = [
      'Niveaux de difficultés ',
      'Nombres séparés par des tirets\n1 : 10 graduations secondaires\n2 : 2 graduations secondaires\n3 : 5 graduations secondaires\n4 : Pas secondaire plus compliqué\n5 : Mélange']
    this.besoinFormulaire2CaseACocher = ['Zéro visible', false]
    this.correctionDetailleeDisponible = true
    this.correctionDetaillee = false
  }
}
export default ReperageEntierC3
