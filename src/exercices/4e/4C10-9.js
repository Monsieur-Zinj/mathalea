import { ExoRose } from '../6e/_Roses.js'
export const titre = 'Résoudre une Rose multiplicative avec des relatifs'
export const interactifReady = true
export const interactifType = 'custom'
export const dateDePublication = '12/08/2022'
export const amcReady = true
export const amcType = 'AMCOpen'

/**
 * Travailler les tables de multiplication autrement
 * @author Jean-Claude Lhote
 */

export const uuid = '9e862'
export const ref = '4C10-9'
export const refs = {
  'fr-fr': ['4C10-9'],
  'fr-ch': ['10NO4-11']
}
export default function RoseAdditive4R () { // c'est l'ExoRose zéro contenu dans _Roses.js
  ExoRose.call(this)
  this.operation = 'multiplication'
  this.typeDonnees = 'entiers relatifs'
}
