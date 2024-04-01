import CalculDAngle from '../3e/3G31.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const titre = 'Utiliser le cosinus pour calculer la mesure d\'un angle dans un triangle rectangle'

/**
 * @author Jean-Claude Lhote
 * 3G31
 * Calcul d'angle dans le triangle rectangle
 * Le niveau 1 se limite à l'utilisation de Arccos
 * Le niveau 2 utilise la fonction trigo la plus pertinente pour un calcul direct
 */
export const uuid = '22810'
export const refs = {
  'fr-fr': ['4G41'],
  'fr-ch': []
}
export default function CalculDAngle4e () {
  CalculDAngle.call(this)
  this.level = 4
  this.sup = true
  this.titre = titre
}
