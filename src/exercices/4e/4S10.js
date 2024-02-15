import ConstruireUnDiagramme from '../5e/5S12.js'
export const titre = 'Construire un diagramme'

/**
 * @author Guillaume Valmont
 * reference 4S10
 */
export const uuid = '26ea7'
export const ref = '4S10'
export const refs = {
  'fr-fr': ['4S10'],
  'fr-ch': []
}
export default function ConstruireUnDiagramme4e () {
  ConstruireUnDiagramme.call(this)
  this.titre = titre
  this.sup = 3
  this.sup2 = 2
  this.sup3 = 1
}
