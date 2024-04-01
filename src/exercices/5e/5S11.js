import LectureDiagrammeBaton from '../6e/6S10.js'
export const titre = 'Lire un diagramme en bâtons'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = 'qcm'

/**
 * Lire un diagramme en bâtons
 * @author Guillaume Valmont
 * reference 5S11
 * Publié le 08/08/2021
 * Fix export interactif et AMC Sébastien LOZANO
 */
export const uuid = '9926a'
export const refs = {
  'fr-fr': ['5S11'],
  'fr-ch': []
}
export default function LectureDiagrammeBarre5e () {
  LectureDiagrammeBaton.call(this)
  // this.titre = titre
  this.sup = 3
  this.sup2 = 2
}
