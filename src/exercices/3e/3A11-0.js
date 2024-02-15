import SimplifierFractions from '../4e/4C24.js'
export const titre = 'Simplifier des fractions à l\'aide des nombres premiers'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

export const dateDePublication = '28/09/2022'
export const dateDeModifImportante = '03/10/2023'

/**
 * Simplification de fraction à l'aide de décompositions en produits de facteurs premiers jusqu'à 23
 * @author Eric Elter
 */

export const uuid = '1871d'
export const ref = '3A11-0'
export const refs = {
  'fr-fr': ['3A11-0'],
  'fr-ch': []
}
export default function SimplifierFractions3e () {
  SimplifierFractions.call(this)
  this.sup = 3
  this.sup2 = '2-3-5-7-11-13-17-19-23'
}
