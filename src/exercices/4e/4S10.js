import ConstruireUnDiagramme from '../5e/5S12.js'
export const titre = 'Construire un diagramme'
export const interactifReady = false

/**
 * @author Guillaume Valmont
 */
export const uuid = '26ea7'
export const refs = {
  'fr-fr': ['4S10'],
  'fr-ch': ['10FA5-1']
}
export default function ConstruireUnDiagramme4e () {
  ConstruireUnDiagramme.call(this)
  this.sup = 3
  this.sup2 = 2
  this.sup3 = 1
}
