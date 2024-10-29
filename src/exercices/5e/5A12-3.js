import ExerciceLabyrinthePremiers3e from '../3e/3A10-7.js'
export const titre = 'Parcourir un labyrinthe de nombres premiers'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '12/10/2022'
export const dateDeModifImportante = '29/10/2024'

/** Explorer un labyrinthe de nombres premiers
 * @author Eric Elter
*/

export const uuid = '05079'
export const ref = '5A12-3'
export const refs = {
  'fr-fr': ['5A12-3'],
  'fr-ch': []
}
export default function ExerciceLabyrinthePremiers5e () {
  ExerciceLabyrinthePremiers3e.call(this)
  this.sup = 1
}
