import ExerciceEquation1 from '../4e/4L20.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Résoudre une équation du premier degré'

/**
 * Équation du premier degré
 * * Type 1 : x+a=b ou ax=b
 * * Type 2 : ax+b=c
 * * Type 3 : ax+b=cx+d
 * * Tous les types
 * @author Rémi Angot
 * 4L20 et 3L13
 */
export const uuid = 'f239f'
export const refs = {
  'fr-fr': ['3L13'],
  'fr-ch': ['11FA6-4']
}
export default function ExerciceEquation3e () {
  ExerciceEquation1.call(this)
  this.sup = true
  this.sup2 = 4
  this.tailleDiaporama = 3
}
