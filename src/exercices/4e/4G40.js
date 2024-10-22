import CalculDeLongueur from '../3e/3G30.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Utiliser le cosinus pour calculer une longueur dans un triangle rectangle'

/**
 * @author Jean-Claude Lhote
 * 4G40 Exercice refait avec mathalea2d l'ancien exo MG32 porte la référence 4G40-MG32
 */
export const uuid = '3303a'
export const ref = '4G40'
export const refs = {
  'fr-fr': ['4G40'],
  'fr-ch': []
}
export default function CalculDeLongueur4e () {
  CalculDeLongueur.call(this)
  this.titre = titre
  this.level = 4
  this.sup = 1
  this.sup2 = '3'
  this.besoinFormulaire2Texte = ['Types de questions', '(nombre séparés par des tirets)\n1 : Côté adjacent (cosinus)\n2 : Hypoténuse (cosinus)\n3 : Mélange']
}
