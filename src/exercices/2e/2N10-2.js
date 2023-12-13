import PlacerPointsSurAxe from '../6e/6N30-2'
export const titre = 'Placer un point d\'abscisse décimale'
export const interactifReady = true
export const interactifType = 'custom'
export const amcReady = true
export const amcType = 'AMCOpen'
export const dateDeModifImportante = '27/10/2021'
/**
 * Clone de 6N30-2 pour les 2nde
 *
 * @author Jean-Claude Lhote
 */
export const uuid = '8164e'
export const ref = '2N10-2'
export default function PlacerPointsSurAxe2nde () {
  PlacerPointsSurAxe.call(this)
  this.sup = 5
}
