import TesterSiUnNombreEstSolutionDUneEquation from './4L14-0.js'

export const titre = 'Tester si un nombre est solution d\'une équation du second degré'
export const interactifReady = false

/**
 * Tester si un nombre est solution d'une équation degré 2
 * * adaptation de l'exo 5L14 de Rémi Angot
 * @author Sébastien Lozano
 */
export const uuid = '1188b'
export const ref = '4L14-2'
export const refs = {
  'fr-fr': ['4L14-2'],
  'fr-ch': ['10FA3-4', '11FA6-2']
}
export default function TesterSiUnNombreEstSolutionDUneEquationDeg2 () {
  TesterSiUnNombreEstSolutionDUneEquation.call(this)
  this.exo = '4L14-2'
}
