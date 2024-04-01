import MesurePrincipal from '../../1e/1G12.js'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Simplifier les sinus et cosinus des angles associés'

export const dateDePublication = '01/06/2022'

/*!
 * @author Stéphane et cie
 */
export const uuid = '21c03'
export const refs = {
  'fr-fr': ['can1G03'],
  'fr-ch': []
}
export default function AnglesAssociesCAN () {
  MesurePrincipal.call(this)
  this.nbQuestions = 1
  this.can = true
}
