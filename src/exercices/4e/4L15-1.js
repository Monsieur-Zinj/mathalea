import EqResolvantesThales from '../3e/3L13-2.js'

export const titre = 'Équations du type $\\dfrac{x}{a}=\\dfrac{b}{c}$'

export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '04/04/2022'
/**
 * * Equation type x/a=b/c
 * * numéro de l'exo ex : 4L15-1 fils de 3L13-2
 * * publication initiale le 22/11/2020
 * * modification le jj/mm/aaaa pour ....
 * @author Sébastien Lozano
 */
export const uuid = 'ce00c'
export const ref = '4L15-1'
export const refs = {
  'fr-fr': ['4L15-1'],
  'fr-ch': ['10FA3-5', '11FA6-3']
}
export default function EquationsFractions () {
  EqResolvantesThales.call(this)
  this.exo = '4L15-1'
  this.titre = titre
  this.sup = 1
}
