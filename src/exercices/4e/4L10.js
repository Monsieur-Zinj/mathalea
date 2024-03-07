import ExerciceDevelopper from '../3e/3L11new.js'

export const interactifType = 'mathLive'
export const interactifReady = true
export const amcReady = true
export const amcType = 'AMCHybride'
export const uuid = '71dd8'
export const ref = '4L10'
export const refs = {
  'fr-fr': ['4L10'],
  'fr-ch': []
}
export const titre = 'Utiliser la simple distributivité'
/**
 * Développer en utilisant la distributivité simple
 * refactoring : héritage de 3L11 pour éviter de dupliquer le code
 * @author Rémi Angot
 * 4L10 et 3L11
 */
export default function ExerciceDevelopper4e () {
  ExerciceDevelopper.call(this)
  this.sup = 3 // difficulté
  this.sup2 = 1 // consigne
  this.sup3 = 7 // forme de développement
}
