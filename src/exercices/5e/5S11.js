import LectureDiagrammeBarre from '../6e/6S10.js'
export const titre = 'Lire un diagramme en barres'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Lire un diagramme en barres
 * @author Guillaume Valmont
 * reference 5S11
 * Publié le 08/08/2021
 * Fix export interactif et AMC Sébastien LOZANO
 */
export const uuid = '9926a'
export const ref = '5S11'
export default function LectureDiagrammeBarre5e () {
  LectureDiagrammeBarre.call(this)
  // this.titre = titre
  this.sup = 3
  this.sup2 = 2
}
