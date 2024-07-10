import Exercice from '../Exercice'
import Derivees1 from './1AN14-1'
import Derivees3 from './1AN14-3'
import Derivees4 from './1AN14-4'
import Derivees5 from './1AN14-5'
import Derivees6 from './1AN14-6'
import Derivees7 from './1AN14-7'
import Derivees61 from './doublons/1AN14-61'
import Derivees71 from './doublons/1AN14-71'

import MetaExercice from '../MetaExerciceCan'
export const titre = 'Dérivation : bilan'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'f38cf'
export const refs = {
  'fr-fr': ['1AN14-8'],
  'fr-ch': []
}
export const dateDePublication = '18/04/2024'
const exercices = [Derivees1, Derivees3, Derivees4, Derivees5, Derivees6, Derivees61, Derivees7, Derivees71] as unknown[]
/**
 * Un exercice bilan pour les regrouper tous (les exos de dérivation)
 * @author Jean-Claude Lhote
 *
 */
class DerivationBilan extends MetaExercice {
  constructor () {
    super(exercices as Exercice[])
    this.besoinFormulaireCaseACocher = false
    this.nbQuestions = 8
    this.correctionDetailleeDisponible = true
    this.nbQuestionsModifiable = true
  }
}
export default DerivationBilan
