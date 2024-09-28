import ExerciceEquationASolutionEntiere from '../4e/4L20-0.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const titre = 'Résoudre une équation du premier degré à solutions entières'

/**
 * Équation du premier degré
 * * Type 1 : x+a=b ou ax=b
 * * Type 2 : ax+b=c
 * * Type 3 : ax+b=cx+d
 * * Tous les types
 * @author Rémi Angot
 */
export const uuid = '5a02b'
export const ref = '3L13-0'
export const refs = {
  'fr-fr': ['3L13-0'],
  'fr-ch': []
}
export default function EquationPremierDegreSolutionsEntieres () {
  ExerciceEquationASolutionEntiere.call(this)

  this.sup = true // Avec des nombres relatifs
  this.sup2 = 4 // Choix du type d'équation
  this.nbQuestions = 6
  this.tailleDiaporama = 3
}
