import Transformations from './_Transformations.js'
export const titre = 'Trouver l\'image d\'un point par une symétrie axiale'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Transformations : trouvers un point numéroté par une des transformations du plan. Fonction générale utilisée sur tous les niveaux
 * @author Jean-Claude Lhote
 * référence 6G24
 * Pas de version LaTeX
 * Relecture : Novembre 2021 par EE
 */
export const uuid = 'e9d29'
export const refs = {
  'fr-fr': ['6G24'],
  'fr-ch': ['9ES6-1']
}
export default function Transformations6e () {
  Transformations.call(this)
  this.sup = 1
  this.titre = titre
}
