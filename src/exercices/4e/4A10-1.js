import ExerciceLabyrinthePremiers3e from '../3e/3A10-7.js'
export const titre = 'Explorer un labyrinthe de nombres premiers'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '12/10/2022'

/** Explorer un labyrinthe de nombres premiers
 * @author Eric Elter
*/

export const uuid = '50663'
export const ref = '4A10-1'
export const refs = {
  'fr-fr': ['4A10-1'],
  'fr-ch': []
}
export default function ExerciceLabyrinthePremiers4e () {
  ExerciceLabyrinthePremiers3e.call(this)
  this.sup = 2
}
