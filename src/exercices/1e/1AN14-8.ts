import Exercice from '../Exercice'
import Derivees1 from './1AN14-30'
import Derivees2 from './1AN14-4'
import Derivees3 from './1AN14-71'
import MetaExercice from '../MetaExerciceCan'
export const titre = 'Dérivation Bilan'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'f38cf'
export const refs = {
  'fr-fr': ['1AN14-8'],
  'fr-ch': []
}
export const dateDePublication = '18/04/2024'

const exercices = [Derivees1, Derivees2, Derivees3] as unknown[]
/**
 * Un exercice bilan pour les regrouper tous (les exos de dérivation)
 * @author Jean-Claude Lhote
 *
 */
class DerivationBilan extends MetaExercice {
  constructor () {
    super(exercices as Exercice[])
    this.besoinFormulaireCaseACocher = false
    this.nbQuestions = 5
    this.correctionDetailleeDisponible = true
  }
}
export default DerivationBilan
